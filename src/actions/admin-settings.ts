"use server"

import { createClient } from "@/lib/supabase/server"

export async function updateAdminPassword(newPassword: string) {
    const supabase = await createClient()

    // Call the RPC function secure
    const { data: success, error } = await supabase.rpc('update_admin_code', {
        new_code: newPassword
    })

    if (error) {
        return { error: error.message }
    }

    if (!success) {
        return { error: "Unauthorized or Failed" }
    }

    return { success: true }
}

export async function updateTrainerPassword(newPassword: string) {
    const supabase = await createClient()

    // Call the RPC function secure
    const { data: success, error } = await supabase.rpc('update_trainer_code', {
        new_code: newPassword
    })

    if (error) {
        return { error: error.message }
    }

    if (!success) {
        return { error: "Unauthorized or Failed" }
    }

    return { success: true }
}

export async function getTrainerPassword() {
    const supabase = await createClient()
    const { data: code, error } = await supabase.rpc('get_trainer_code')

    if (error || !code) {
        return null
    }
    return code
}
