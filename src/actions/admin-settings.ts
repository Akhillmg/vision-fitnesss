"use server"

import { createClient } from "@/lib/supabase/server"

export async function updateAdminPassword(newPassword: string) {
    const supabase = await createClient()

    // Retrieve current user
    const { data: { user } } = await supabase.auth.getUser()

    // Security Check: Only allow if user is an ADMIN
    if (!user || user.user_metadata.role !== 'ADMIN') {
        return { error: "Unauthorized access" }
    }

    // Update the gym_config table (assuming single gym config)
    // We update the first row we find, or specific ID if we had it.
    // For single gym, updating where id is not null works if there's only one row.
    // Better: Update where gym_name = 'Vision Fitness' or just first row.
    // Let's assume there is only one row as per migration script.

    // First, verify a config exists or get its ID
    const { data: config } = await supabase.from('gym_config').select('id').limit(1).single()

    if (!config) {
        return { error: "Configuration not found" }
    }

    const { error } = await supabase
        .from('gym_config')
        .update({ admin_code: newPassword })
        .eq('id', config.id)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function updateTrainerPassword(newPassword: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata.role !== 'ADMIN') {
        return { error: "Unauthorized access" }
    }

    const { data: config } = await supabase.from('gym_config').select('id').limit(1).single()

    if (!config) {
        return { error: "Configuration not found" }
    }

    const { error } = await supabase
        .from('gym_config')
        .update({ trainer_code: newPassword })
        .eq('id', config.id)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getTrainerPassword() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.user_metadata.role !== 'ADMIN') {
        return null
    }

    const { data: config } = await supabase
        .from('gym_config')
        .select('trainer_code')
        .limit(1)
        .single()

    return config?.trainer_code || null
}
