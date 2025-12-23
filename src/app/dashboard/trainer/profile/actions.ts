"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    const bio = formData.get("bio") as string
    const specialties = formData.get("specialties") as string

    // Upsert Trainer Profile
    const { error } = await supabase
        .from("trainer_profiles")
        .upsert({
            user_id: user.id,
            bio,
            specialties
        }, { onConflict: 'user_id' })

    if (error) throw new Error(error.message)

    revalidatePath("/trainer/profile")
}
