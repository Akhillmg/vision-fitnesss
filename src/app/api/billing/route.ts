
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
        const { userId, amount, method, note } = body

        if (!userId || !amount || !method) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const billing = await prisma.billing.create({
            data: {
                userId,
                gymId: session.user.gymId,
                amount: parseFloat(amount),
                method,
                note,
                date: new Date()
            }
        })

        return NextResponse.json(billing)
    } catch (error) {
        console.error("Create billing error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Members see their own, Admin sees gym's (if queried differently, but this is for member view mainly)
        // For simpler prototype, let's just make this endpoint for the specific user requesting

        const history = await prisma.billing.findMany({
            where: {
                userId: session.user.id,
                gymId: session.user.gymId
            },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(history)
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
