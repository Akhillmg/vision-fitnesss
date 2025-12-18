
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { userId, planName, price, durationMonths } = body

        if (!userId || !planName || !price || !durationMonths) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + parseInt(durationMonths))

        // Deactivate previous active memberships
        await prisma.membership.updateMany({
            where: { userId, status: "active" },
            data: { status: "expired" }
        })

        const membership = await prisma.membership.create({
            data: {
                userId,
                gymId: session.user.gymId,
                planName,
                price: parseFloat(price),
                startDate,
                endDate,
                status: "active"
            }
        })

        return NextResponse.json(membership)
    } catch (error) {
        console.error("Create membership error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const membership = await prisma.membership.findFirst({
            where: {
                userId: session.user.id,
                status: "active",
                gymId: session.user.gymId
            },
            orderBy: { endDate: 'desc' }
        })

        return NextResponse.json(membership)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
