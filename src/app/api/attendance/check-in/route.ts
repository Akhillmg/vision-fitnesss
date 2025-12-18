
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0) // Normalize to start of day

        // Check if already checked in
        const existingCheckIn = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: today
            }
        })

        if (existingCheckIn) {
            return NextResponse.json({ message: "Already checked in today" }, { status: 400 })
        }

        // Create check-in
        const checkIn = await prisma.attendance.create({
            data: {
                userId: session.user.id,
                gymId: session.user.gymId,
                date: today
            }
        })

        return NextResponse.json(checkIn)
    } catch (error) {
        console.error("Check-in error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
