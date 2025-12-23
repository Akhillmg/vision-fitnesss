"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAdminStats() {
    const supabase = await createClient()

    // 1. Total Members
    const { count: memberCount, error: memberError } = await supabase
        .from('User')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'MEMBER')

    // 2. Attendance Overview (Today's check-ins)
    const today = new Date().toISOString().split('T')[0]
    const { count: attendanceCount, error: attendanceError } = await supabase
        .from('Attendance')
        .select('*', { count: 'exact', head: true })
        .gte('date', today) // Note: check_in_time renamed to date? Need to verify column.

    // 3. Pending Payments
    const { count: pendingPaymentsCount, error: paymentsError } = await supabase
        .from('Billing')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING') // enum matches capital?

    // 4. Membership Expiry Alerts (Expiring in next 7 days)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split('T')[0]

    // Note: status 'active' and end_date <= nextWeek
    const { count: expiryCount, error: expiryError } = await supabase
        .from('Membership')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lte('endDate', nextWeekStr) // end_date -> endDate?

    return {
        memberCount: memberCount || 0,
        attendanceCount: attendanceCount || 0,
        pendingPaymentsCount: pendingPaymentsCount || 0,
        expiryCount: expiryCount || 0
    }
}
