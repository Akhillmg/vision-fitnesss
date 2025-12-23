"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function selectRole(role: "ADMIN" | "TRAINER" | "MEMBER", code?: string) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user || !user.email) {
        return { error: "Unauthorized" }
    }

    // LOCK: Check if role is already assigned in Metadata
    if (user.user_metadata?.role) {
        // Allow if role is effectively "NULL" or we want to allow re-selection?
        // User Rule: "Once a role is assigned to a user, lock the role."
        return { error: "Role already assigned. Contact Admin to reset." }
    }

    // Verify Code using RPC if NOT Member
    if (role !== "MEMBER") {
        if (!code) return { error: `${role} code required` }

        // Use the secure RPC function we defined in SQL
        const { data: isValid, error: rpcError } = await supabase.rpc('verify_role_code', {
            role_type: role,
            input_code: code
        })

        if (rpcError) {
            console.error(rpcError)
            return { error: "System Verification Failed" }
        }

        if (!isValid) {
            return { error: `Invalid ${role} Code` }
        }
    }

    // Update Auth Metadata (fastest way for Middleware to see change)
    const { error: updateError } = await supabase.auth.updateUser({
        data: { role: role }
    })

    if (updateError) {
        return { error: "Failed to update session role" }
    }

    // Insert/Update Public User Table
    // We use Upsert to be safe
    const { error: dbError } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        role: role
    })

    if (dbError) {
        console.error("Public DB Sync Error:", dbError)
        // We continue anyway since Auth Metadata is source of truth for access
    }

    return {
        success: true,
        redirectPath: role === "ADMIN" ? "/dashboard/admin/dashboard" : role === "TRAINER" ? "/dashboard/trainer/dashboard" : "/dashboard/member/home"
    }
}
