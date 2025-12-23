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
        .gte('date', today)
        .limit(1)
        .single()

    // 2. Active Membership
    const { data: membership } = await supabase
        .from('memberships')
        .select(`
            end_date,
            status,
            plan_name
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', today)
        .order('end_date', { ascending: true })
        .limit(1)
        .maybeSingle()

    // 3. Pending Payments
    const { count: pendingPayments } = await supabase
        .from('billing')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'PENDING')

    // 4. Assigned Plan
    const activePlan = null

    // 5. Recent Announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)

    return {
        isCheckedIn: !!attendance,
        membership: membership ? {
            endDate: membership.end_date,
            status: membership.status,
            planName: membership.plan_name
        } : null,
        pendingPayments: pendingPayments || 0,
        currentPlan: null as any,
        announcements: announcements || []
    }
}

export async function checkIn() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase.from('attendance').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        check_in_time: new Date().toISOString()
    })

    if (error) {
        if (error.code === '23505') {
            return { error: "You have already checked in today." }
        }
        return { error: error.message }
    }

    revalidatePath('/dashboard/member/home')
    return { success: true }
}
