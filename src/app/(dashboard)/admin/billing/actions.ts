
"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBillingRecord(formData: FormData) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return

    const userId = formData.get("userId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string
    const note = formData.get("note") as string

    await prisma.billing.create({
        data: {
            userId,
            gymId: session.user.gymId,
            amount,
            method,
            note,
            date: new Date()
        }
    })

    revalidatePath("/admin/billing")
}
