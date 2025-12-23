"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBillingRecord(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // Role check
    const { data: publicUser } = await supabase.from("users").select("role").eq("id", user.id).single()
    if (publicUser?.role !== "ADMIN") return

    const userId = formData.get("userId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const method = formData.get("method") as string
    const note = formData.get("note") as string

    await supabase.from("billing").insert({
        user_id: userId,
        amount,
        method,
        note,
        date: new Date().toISOString()
    })

    revalidatePath("/admin/billing")
}
