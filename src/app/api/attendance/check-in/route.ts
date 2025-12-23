import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Normalize to start of day UTC to be consistent
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        const todayStr = today.toISOString()

        // Check if already checked in
        const { data: existingCheckIn } = await supabase
            .from("attendance")
            .select("id")
            .eq("user_id", user.id)
            .eq("date", todayStr)
            .single()

        if (existingCheckIn) {
            return NextResponse.json({ message: "Already checked in today" }, { status: 400 })
        }

        // Create check-in
        const { data: checkIn, error } = await supabase
            .from("attendance")
            .insert({
                user_id: user.id,
                date: todayStr,
                check_in_time: new Date().toISOString()
            })
            .select() // return created object
            .single()

        if (error) {
            console.error("Attendance Insert Error:", error)
            throw error
        }

        return NextResponse.json(checkIn)
    } catch (error) {
        console.error("Check-in error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
