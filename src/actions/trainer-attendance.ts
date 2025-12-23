"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTrainerAttendance() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch attendance for users assigned to this trainer
    // The RLS policy "Trainers view assigned clients attendance" handles filtering!
    // So we just query attendance table. However, we want user details too.

    const { data, error } = await supabase
        .from('attendance')
        .select(`
            id,
            check_in_time,
            user:users (full_name, email)
        `)
        .order('check_in_time', { ascending: false })
        .limit(50)

    if (error) {
        console.error("Trainer attendance fetch error:", error)
        return []
    }

    return data.map((record: any) => ({
        id: record.id,
        user_name: record.user?.full_name || "Unknown",
        user_email: record.user?.email || "",
        check_in_time: record.check_in_time
    }))
}
