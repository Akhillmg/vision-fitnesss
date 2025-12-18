"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createProgram(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
    })

    if (!user || user.role !== "TRAINER") throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) throw new Error("Name is required")

    const program = await prisma.workoutTemplate.create({
        data: {
            name,
            description,
            createdById: user.id
        }
    })

    revalidatePath("/trainer/programs")
    redirect(`/trainer/programs/${program.id}`)
}

export async function addDay(programId: string) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
    })

    if (!user || user.role !== "TRAINER") throw new Error("Unauthorized")

    // Check if program belongs to trainer? 
    // Ideally yes, but skipping strict ownership check for speed unless necessary. 
    // Actually better to check:
    const program = await prisma.workoutTemplate.findUnique({
        where: { id: programId, createdById: user.id }
    })
    if (!program) throw new Error("Program not found or unauthorized")

    const lastDay = await prisma.workoutDay.findFirst({
        where: { templateId: programId },
        orderBy: { dayIndex: 'desc' }
    })
    const newIndex = (lastDay?.dayIndex ?? 0) + 1

    await prisma.workoutDay.create({
        data: {
            templateId: programId,
            dayIndex: newIndex,
            title: `Day ${newIndex}`
        }
    })
    await prisma.workoutDay.create({
        data: {
            templateId: programId,
            dayIndex: newIndex,
            title: `Day ${newIndex}`
        }
    })
    revalidatePath(`/trainer/programs/${programId}`)
}

export async function addExerciseToDay(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const dayId = formData.get("dayId") as string
    const name = formData.get("name") as string
    const sets = parseInt(formData.get("sets") as string) || 3
    const reps = parseInt(formData.get("reps") as string) || 10

    if (!dayId || !name) throw new Error("Missing fields")

    // Find or create exercise
    let exercise = await prisma.exercise.findFirst({
        where: { name: name }
    })

    if (!exercise) {
        exercise = await prisma.exercise.create({
            data: {
                name,
                muscleGroup: "Uncategorized" // Simplified for now
            }
        })
    }

    // Get max order
    const lastEx = await prisma.workoutDayExercise.findFirst({
        where: { workoutDayId: dayId },
        orderBy: { order: 'desc' }
    })
    const newOrder = (lastEx?.order ?? 0) + 1

    await prisma.workoutDayExercise.create({
        data: {
            workoutDayId: dayId,
            exerciseId: exercise.id,
            sets,
            reps,
            order: newOrder
        }
    })

    revalidatePath(`/trainer/programs`) // broad revalidate to be safe, or specific path
}
