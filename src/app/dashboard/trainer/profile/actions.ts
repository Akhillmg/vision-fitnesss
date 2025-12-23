"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const { data: publicUser } = await supabase
        .from("User")
        .select("id, gymId")
        .eq("id", user.id)
        .single()

    if (!publicUser?.gymId) throw new Error("Unauthorized")

    const bio = formData.get("bio") as string
    const specialties = formData.get("specialties") as string

    // Upsert Trainer Profile
    const { error } = await supabase
        .from("TrainerProfile")
        .upsert({
            userId: user.id,
            gymId: publicUser.gymId,
            bio,
            specialties
        }, { onConflict: 'userId' })

    if (error) throw new Error(error.message)

    revalidatePath("/trainer/profile")
}
