"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMembership(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data: publicUser } = await supabase.from("User").select("role, gymId").eq("id", user.id).single()
    if (publicUser?.role !== "ADMIN") return

    const userId = formData.get("userId") as string
    const planName = formData.get("planName") as string
    const price = parseFloat(formData.get("price") as string)
    const durationMonths = parseInt(formData.get("durationMonths") as string)

    if (!userId || !planName || !price || !durationMonths) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + durationMonths)

    // Deactivate previous active memberships
    await supabase
        .from("Membership")
        .update({ status: "expired" })
        .eq("userId", userId)
        .eq("status", "active")

    // Create new membership
    await supabase.from("Membership").insert({
        userId,
        gymId: publicUser.gymId,
        planName,
        price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "active",
        updatedAt: new Date().toISOString()
    })

    revalidatePath("/admin/memberships")
}
