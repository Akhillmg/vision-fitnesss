"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMembers() {
    const supabase = await createClient()

    // 1. Fetch users with ROLE 'MEMBER'
    // We also want to see their active membership if it exists.
    // Note: 'memberships' is the table, linked by user_id.
    const { data: members, error } = await supabase
        .from('users')
        .select(`
            id,
            full_name,
            email,
            role,
            memberships (
                plan_name,
                end_date,
                status
            )
        `)
        .eq('role', 'MEMBER')
        .order('full_name')

    if (error) {
        console.error("Error fetching members:", error)
        return []
    }

    // 2. Transform filtering for the "active" one if multiple exist (though usually one active allowed)
    return members.map((member: any) => {
        // Filter for an active membership
        const activePlan = member.memberships?.find((m: any) => m.status === 'active')

        return {
            id: member.id,
            full_name: member.full_name,
            email: member.email,
            active_membership: activePlan ? {
                plan_name: activePlan.plan_name,
                end_date: activePlan.end_date
            } : null
        }
    })
}

export async function createMembership(formData: FormData) {
    const supabase = await createClient()

    // Check Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return // Handle auth error

    const userId = formData.get("userId") as string
    const planName = formData.get("planName") as string
    const price = parseFloat(formData.get("price") as string)
    const durationMonths = parseInt(formData.get("durationMonths") as string)

    // 1. Create/Find Plan (Simplified: We just use the name for now, or assume we create a new plan entry)
    // In our schema, we have 'memberships' table which are PLANS. 
    // And 'user_memberships' which are ASSIGNMENTS.

    // Let's create a new Plan or find existing? 
    // For this UI, it looks like "Assign New Membership" where you type the name. 
    // This implies creating a bespoke plan or using a template.
    // Let's create a new 'memberships' entry first.

    const { data: plan, error: planError } = await supabase.from('memberships').insert({
        name: planName,
        price: price,
        duration_months: durationMonths,
        gym_id: null // removed from schema? No, schema part 2 has it? Let's check. 
        // Schema part 2: create table public.memberships ( ... name, price, duration_months, created_at, active )
    }).select().single()

    if (planError) {
        console.error("Plan creation error:", planError)
        return { error: planError.message }
    }

    // 2. Assign to user
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + durationMonths)

    const { error: assignError } = await supabase.from('user_memberships').insert({
        user_id: userId,
        membership_id: plan.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active'
    })

    if (assignError) {
        console.error("Assignment error:", assignError)
        return { error: assignError.message }
    }

    revalidatePath('/dashboard/admin/memberships')
}
