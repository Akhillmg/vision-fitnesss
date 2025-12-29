"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMembership(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data: publicUser } = await supabase.from("users").select("role").eq("id", user.id).single()
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
        .from("memberships")
        .update({ status: "expired" })
        .eq("user_id", userId)
        .eq("status", "active")

    // Create new membership
    await supabase.from("memberships").insert({
        user_id: userId,
        plan_name: planName,
        price,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        updated_at: new Date().toISOString()
    })

    revalidatePath("/dashboard/admin/memberships")
}

export async function getMembers() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            full_name,
            email,
            status,
            memberships (
                plan_name,
                status,
                end_date
            )
        `)
        .eq("role", "MEMBER")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching members:", error)
        return []
    }

    // Process data to get active membership easier
    return data?.map(user => ({
        ...user,
        active_membership: user.memberships?.find((m: any) => m.status === 'active') || null
    })) || []
}
