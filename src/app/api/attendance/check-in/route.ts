import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Fetch public user to get gymId
        const { data: publicUser } = await supabase
            .from("User")
            .select("gymId")
            .eq("id", user.id)
            .single()

        if (!publicUser?.gymId) {
            return new NextResponse("User profile incomplete", { status: 400 })
        }

        // Normalize to start of day UTC to be consistent
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        const todayStr = today.toISOString()

        // Check if already checked in
        const { data: existingCheckIn } = await supabase
            .from("Attendance")
            .select("id")
            .eq("userId", user.id)
            .eq("date", todayStr)
            .single()

        if (existingCheckIn) {
            return NextResponse.json({ message: "Already checked in today" }, { status: 400 })
        }

        // Create check-in
        const { data: checkIn, error } = await supabase
            .from("Attendance")
            .insert({
                userId: user.id,
                gymId: publicUser.gymId,
                date: todayStr,
                checkInTime: new Date().toISOString()
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
