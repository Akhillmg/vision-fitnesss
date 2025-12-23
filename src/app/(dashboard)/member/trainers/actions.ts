"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ReviewSchema = z.object({
    trainerId: z.string(),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().optional(),
})

export async function submitReview(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "User not found" }

    const rawData = Object.fromEntries(formData.entries())
    const validated = ReviewSchema.safeParse(rawData)

    if (!validated.success) return { error: "Invalid data" }

    const { trainerId, rating, comment } = validated.data

    try {
        await prisma.trainerReview.create({
            data: {
                memberId: user.id,
                trainerId,
                rating,
                comment
            }
        })
    } catch (e) {
        console.error(e)
        return { error: "Failed to submit review" }
    }

    revalidatePath("/member/trainers")
    return { success: "Review submitted!" }
}

export async function assignTrainer(trainerId: string) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { error: "User not found" }

    await prisma.user.update({
        where: { id: user.id },
        data: { assignedTrainerId: trainerId }
    })

    revalidatePath("/member/trainers")
    revalidatePath("/trainer/dashboard")
    return { success: "Trainer assigned!" }
}
