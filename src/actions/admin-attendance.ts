"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAdminAttendance() {
    const supabase = await createClient()

    // Fetch latest 50 attendance records with user details
    const { data, error } = await supabase
        .from('attendance')
        .select(`
            id,
            check_in_time,
            user:users (full_name, email, role)
        `)
        .order('check_in_time', { ascending: false })
        .limit(50)

    if (error) {
        console.error("Admin attendance fetch error:", error)
        return []
    }

    return data.map((record: any) => ({
        id: record.id,
        user_name: record.user?.full_name || "Unknown",
        user_email: record.user?.email || "",
        check_in_time: record.check_in_time
    }))
}
