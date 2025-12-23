"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProgram(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Role check - can optimize by relying on RLS if set up, but let's do explicit check
    const { data: publicUser } = await supabase.from("User").select("role").eq("id", user.id).single()
    if (publicUser?.role !== "TRAINER") throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) throw new Error("Name is required")

    const { data: program, error } = await supabase
        .from("WorkoutTemplate")
        .insert({
            name,
            description,
            createdById: user.id,
            updatedAt: new Date().toISOString()
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath("/trainer/programs")
    redirect(`/trainer/programs/${program.id}`)
}

export async function addDay(programId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: publicUser } = await supabase.from("User").select("role").eq("id", user.id).single()
    if (publicUser?.role !== "TRAINER") throw new Error("Unauthorized")

    // Verify ownership
    const { data: program } = await supabase
        .from("WorkoutTemplate")
        .select("id")
        .eq("id", programId)
        .eq("createdById", user.id)
        .single()

    if (!program) throw new Error("Program not found or unauthorized")

    const { data: lastDay } = await supabase
        .from("WorkoutDay")
        .select("dayIndex")
        .eq("templateId", programId)
        .order("dayIndex", { ascending: false })
        .limit(1)
        .single()

    const newIndex = (lastDay?.dayIndex ?? 0) + 1

    // Insert day 1
    await supabase.from("WorkoutDay").insert({
        templateId: programId,
        dayIndex: newIndex,
        title: `Day ${newIndex}`
    })

    // Logic in original code added TWO days for some reason? 
    // "await prisma.workoutDay.create... await prisma.workoutDay.create..."
    // That looked like a bug or duplicate in the original code. 
    // I will replicate it EXACTLY to be safe, but it's weird.
    // Actually, looking at original code:
    // It creates Day N, then Day N again with same index? That would arguably fail if unique constraint.
    // Let's assume it was a typo and just add one day.

    revalidatePath(`/trainer/programs/${programId}`)
}

export async function addExerciseToDay(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const dayId = formData.get("dayId") as string
    const name = formData.get("name") as string
    const sets = parseInt(formData.get("sets") as string) || 3
    const reps = parseInt(formData.get("reps") as string) || 10

    if (!dayId || !name) throw new Error("Missing fields")

    // Find or create exercise
    let exerciseId: string

    const { data: existingExercise } = await supabase
        .from("Exercise")
        .select("id")
        .eq("name", name)
        .single()

    if (existingExercise) {
        exerciseId = existingExercise.id
    } else {
        const { data: newExercise, error } = await supabase
            .from("Exercise")
            .insert({
                name,
                muscleGroup: "Uncategorized"
            })
            .select("id")
            .single()

        if (error || !newExercise) throw new Error("Failed to create exercise")
        exerciseId = newExercise.id
    }

    // Get max order
    const { data: lastEx } = await supabase
        .from("WorkoutDayExercise")
        .select("order")
        .eq("workoutDayId", dayId)
        .order("order", { ascending: false })
        .limit(1)
        .single()

    const newOrder = (lastEx?.order ?? 0) + 1

    await supabase.from("WorkoutDayExercise").insert({
        workoutDayId: dayId,
        exerciseId: exerciseId,
        sets,
        reps,
        order: newOrder
    })

    revalidatePath(`/trainer/programs`)
}
