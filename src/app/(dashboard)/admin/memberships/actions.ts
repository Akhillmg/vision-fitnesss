
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createMembership(formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return

    const userId = formData.get("userId") as string
    const planName = formData.get("planName") as string
    const price = parseFloat(formData.get("price") as string)
    const durationMonths = parseInt(formData.get("durationMonths") as string)

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + durationMonths)

    await prisma.membership.updateMany({
        where: { userId, status: "active" },
        data: { status: "expired" }
    })

    await prisma.membership.create({
        data: {
            userId,
            gymId: session.user.gymId,
            planName,
            price,
            startDate,
            endDate,
            status: "active"
        }
    })

    revalidatePath("/admin/memberships")
}
