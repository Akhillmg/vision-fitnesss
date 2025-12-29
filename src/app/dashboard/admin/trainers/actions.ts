"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTrainers() {
    const supabase = await createClient();

    // Fetch users with role TRAINER and their profile
    const { data, error } = await supabase
        .from("users")
        .select(`
            id,
            full_name,
            email,
            status,
            trainer_profiles (
                bio,
                specialties,
                rating
            )
        `)
        .eq("role", "TRAINER")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching trainers:", error);
        return [];
    }

    return data || [];
}
