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
        .from('Attendance')
        .select('*')
        .eq('userId', user.id)
        .gte('date', today) // date field stores YYYY-MM-DD or similar? route.ts used 'date'
        .limit(1)
        .single()

    // 2. Active Membership
    const { data: membership } = await supabase
        .from('Membership')
        .select(`
            endDate,
            status,
            planName
        `) // removed plan:memberships(name) as planName is on Membership
        .eq('userId', user.id)
        .eq('status', 'active')
        .gte('endDate', today)
        .order('endDate', { ascending: true })
        .limit(1)
        .maybeSingle() // Use maybeSingle to avoid error if none

    // 3. Pending Payments
    const { count: pendingPayments } = await supabase
        .from('Billing')
        .select('*', { count: 'exact', head: true })
        .eq('userId', user.id)
        .eq('status', 'PENDING') // Match enum case?

    // 4. Assigned Plan
    // FIXME: Need to verify how plans are assigned. User has explicit relation or table?
    // For now returning null to avoid error
    const activePlan = null

    // 5. Recent Announcements
    const { data: announcements } = await supabase
        .from('Announcement')
        .select('*')
        // .eq('active', true) // Assuming active field exists?
        .order('createdAt', { ascending: false })
        .limit(3)

    return {
        isCheckedIn: !!attendance,
        membership: membership as any,
        pendingPayments: pendingPayments || 0,
        currentPlan: null as any, // activePlan was commented out
        announcements: announcements || []
    }
}

export async function checkIn() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Fetch GymID
    const { data: profile } = await supabase.from("User").select("gymId").eq("id", user.id).single()
    if (!profile?.gymId) return { error: "Profile incomplete." }

    const { error } = await supabase.from('Attendance').insert({
        userId: user.id,
        gymId: profile.gymId,
        date: new Date().toISOString().split('T')[0], // Using today's date YYYY-MM-DD
        checkInTime: new Date().toISOString()
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
