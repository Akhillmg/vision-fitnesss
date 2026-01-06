"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AICoachInput = {
    currentWeight: string;
    targetWeight: string;
    goal: "LOSE_WEIGHT" | "BUILD_MUSCLE" | "MAINTAIN" | "STRENGTH";
    daysPerWeek: string;
    activityLevel: "SEDENTARY" | "MODERATE" | "ACTIVE" | "ATHLETE";
    dietaryPreference: "NONE" | "VEGAN" | "KETO" | "PALEO" | "VEGETARIAN";
};

export type AIPlanResult = {
    id?: string; // If saved
    summary: string;
    schedule: {
        day: string;
        focus: string;
        exercises: { name: string; sets: string; reps: string; notes?: string }[];
    }[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        notes: string[];
    };
};

export async function generateAIPlanAction(input: AICoachInput): Promise<{ success?: boolean; plan?: AIPlanResult; error?: string }> {
    // 1. Validate Input (Basic)
    if (!input.currentWeight || !input.targetWeight) {
        return { error: "Please fill in all fields." };
    }

    // 2. Mock Logic (To be replaced by LLM Call)
    // Simulating delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isBulking = input.goal === "BUILD_MUSCLE" || input.goal === "STRENGTH";
    const days = parseInt(input.daysPerWeek) || 3;

    // Generate Mock Schedule
    const schedule = [];
    const splits = isBulking
        ? ["Push (Chest/Triceps/Shoulders)", "Pull (Back/Biceps)", "Legs", "Upper Body", "Lower Body", "Rest", "Rest"]
        : ["Full Body A", "Cardio & Core", "Full Body B", "Active Recovery", "Full Body C", "Rest", "Rest"];

    for (let i = 0; i < days; i++) {
        schedule.push({
            day: `Day ${i + 1}`,
            focus: splits[i % splits.length],
            exercises: [
                { name: "Barbell Squat", sets: "3", reps: isBulking ? "8-12" : "12-15" },
                { name: "Bench Press", sets: "3", reps: isBulking ? "8-12" : "12-15" },
                { name: "Lat Pulldown", sets: "3", reps: "10-12" },
                { name: "Plank", sets: "3", reps: "60s" }
            ]
        });
    }

    // Generate Mock Nutrition
    const weight = parseInt(input.currentWeight);
    const calories = isBulking ? weight * 25 + 500 : weight * 25 - 500;

    // Result
    const plan: AIPlanResult = {
        summary: `Based on your goal to ${input.goal.replace("_", " ")} and workout ${days} days a week, here is your customized plan.`,
        schedule,
        nutrition: {
            calories: Math.round(calories),
            protein: Math.round(weight * 2.2),
            carbs: Math.round((calories * 0.4) / 4),
            fats: Math.round((calories * 0.25) / 9),
            notes: ["Drink 3L water daily", "Focus on sleep"]
        }
    };

    return { success: true, plan };
}

export async function saveAIPlanAction(input: AICoachInput, plan: AIPlanResult) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("ai_generated_plans")
        .insert({
            user_id: user.id,
            user_input: input,
            plan_data: plan
        });

    if (error) {
        console.error("Save Plan Error:", error);
        return { error: "Failed to save plan history." };
    }

    revalidatePath("/dashboard/member/ai-coach");
    return { success: true };
}
