"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTrainerStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { clientCount: 0, planCount: 0 }

    // 1. My Clients Count
    const { count: clientCount, error: clientError } = await supabase
        .from('trainer_assignments')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', user.id)

    // 2. My Workout Plans Created
    const { count: planCount, error: planError } = await supabase
        .from('workout_plans')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', user.id)

    return {
        clientCount: clientCount || 0,
        planCount: planCount || 0
    }
}

export async function getMyClients() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('trainer_assignments')
        .select(`
            id,
            assigned_at,
            client:client_id (id, full_name, email, role, status)
        `)
        .eq('trainer_id', user.id)

    if (error) {
        console.error("Error fetching clients:", error)
        return []
    }

    // Flattens the structure
    return data.map((item: any) => ({
        id: item.client.id,
        assignmentId: item.id,
        ...item.client,
        assigned_at: item.assigned_at
    }))
}
