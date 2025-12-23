"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMemberStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const today = new Date().toISOString().split('T')[0]

    // 1. Check if checked in today
    const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('check_in_time', today)
        .limit(1)
        .single()

    // 2. Active Membership
    const { data: membership } = await supabase
        .from('user_memberships')
        .select(`
            end_date,
            status,
            plan:memberships(name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', today)
        .order('end_date', { ascending: true }) // Expiring soonest?
        .limit(1)
        .single()

    // 3. Pending Payments
    const { count: pendingPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending')

    // 4. Assigned Plan
    const { data: activePlan } = await supabase
        .from('client_plans')
        .select(`
            plan:workout_plans(name, description)
        `)
        .eq('client_id', user.id)
        .eq('active', true)
        .limit(1)
        .single()

    // 5. Recent Announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(3)

    return {
        isCheckedIn: !!attendance,
        membership: membership as any, // Cast to any or define interface to avoid complex Supabase inference issues
        pendingPayments: pendingPayments || 0,
        currentPlan: activePlan?.plan as any,
        announcements: announcements || []
    }
}

export async function checkIn() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase.from('attendance').insert({
        user_id: user.id
    })

    if (error) {
        if (error.code === '23505') { // Postgres unique_violation code
            return { error: "You have already checked in today." }
        }
        return { error: error.message }
    }

    revalidatePath('/dashboard/member/home')
    return { success: true }
}
