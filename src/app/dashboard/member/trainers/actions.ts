"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const ReviewSchema = z.object({
    trainerId: z.string(),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().optional(),
})

export async function submitReview(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const rawData = Object.fromEntries(formData.entries())
    const validated = ReviewSchema.safeParse(rawData)

    if (!validated.success) return { error: "Invalid data" }

    const { trainerId, rating, comment } = validated.data

    const { error } = await supabase.from("TrainerReview").insert({
        memberId: user.id,
        trainerId,
        rating,
        comment,
        createdAt: new Date().toISOString()
    })

    if (error) {
        console.error(error)
        return { error: "Failed to submit review" }
    }

    revalidatePath("/member/trainers")
    return { success: "Review submitted!" }
}

export async function assignTrainer(trainerId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from("User")
        .update({ assignedTrainerId: trainerId })
        .eq("id", user.id)

    if (error) return { error: "Failed to assign trainer" }

    revalidatePath("/member/trainers")
    revalidatePath("/trainer/dashboard")
    return { success: "Trainer assigned!" }
}
