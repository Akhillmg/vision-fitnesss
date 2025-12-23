"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTrainerStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { clientCount: 0, planCount: 0 }

    // 1. My Clients Count
    const { count: clientCount, error: clientError } = await supabase
        .from('User')
        .select('*', { count: 'exact', head: true })
        .eq('assignedTrainerId', user.id)

    // 2. My Workout Plans Created
    const { count: planCount, error: planError } = await supabase
        .from('WorkoutTemplate')
        .select('*', { count: 'exact', head: true })
        .eq('createdById', user.id)

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
        .from('User')
        .select(`
            id,
            name,
            email,
            role,
            createdAt
        `)
        .eq('assignedTrainerId', user.id)

    if (error) {
        console.error("Error fetching clients:", error)
        return []
    }

    // Mapping to match expected interface if needed, or return as is assuming frontend expects User fields
    return data.map((client: any) => ({
        id: client.id,
        full_name: client.name,
        email: client.email,
        role: client.role,
        status: "active", // Dummy status
        assigned_at: client.createdAt || new Date().toISOString()
    }))
}
