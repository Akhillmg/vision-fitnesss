"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type WorkoutSet = {
    id?: string;
    exerciseName: string;
    setNumber: number;
    weight: number;
    reps: number;
    completed: boolean;
};

export type WorkoutLog = {
    id: string;
    name: string;
    startedAt: string;
    endedAt?: string | null;
    durationSeconds: number;
    volumeKg: number;
    sets?: WorkoutSet[];
};

export async function startWorkoutAction(name: string = "Workout") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // 0. Check for active workout
    const { data: activeWorkout } = await supabase
        .from("workout_logs")
        .select("id")
        .eq("user_id", user.id)
        .is("ended_at", null)
        .single();

    if (activeWorkout) {
        return { success: true, workoutId: activeWorkout.id, resumed: true };
    }

    const { data, error } = await supabase
        .from("workout_logs")
        .insert({
            user_id: user.id,
            name,
            started_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Start Workout Error:", error);
        return { error: "Failed to start workout." };
    }

    return { success: true, workoutId: data.id };
}

export async function finishWorkoutAction(workoutId: string, durationSeconds: number, sets: WorkoutSet[]) {
    const supabase = await createClient();

    // Calculate total volume
    const volumeKg = sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);

    // 1. Update Log Details
    const { error: logError } = await supabase
        .from("workout_logs")
        .update({
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            volume_kg: volumeKg
        })
        .eq("id", workoutId);

    if (logError) return { error: "Failed to close workout session." };

    // 2. Insert Sets
    // Transform specifically for DB columns
    const setsToInsert = sets.map(s => ({
        workout_log_id: workoutId,
        exercise_name: s.exerciseName,
        set_number: s.setNumber,
        weight_kg: s.weight,
        reps: s.reps,
        completed: s.completed
    }));

    const { error: setsError } = await supabase
        .from("workout_sets")
        .insert(setsToInsert);

    if (setsError) {
        console.error("Save Sets Error:", setsError);
        return { error: "Workout saved, but failed to save individual sets." };
    }

    revalidatePath("/dashboard/member/workout");
    return { success: true };
}

export async function getWorkoutHistoryAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

    return data || [];
}
