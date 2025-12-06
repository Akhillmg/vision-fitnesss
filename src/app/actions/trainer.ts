'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth-helper"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTemplateAction(data: any) {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TRAINER') {
        throw new Error("Unauthorized")
    }

    // Basic validation
    if (!data.name || !data.days || data.days.length === 0) {
        throw new Error("Invalid data")
    }

    try {
        await prisma.workoutTemplate.create({
            data: {
                name: data.name,
                description: data.description,
                createdById: session.user.id!,
                days: {
                    create: data.days.map((day: any, dayIndex: number) => ({
                        title: day.title,
                        dayIndex,
                        exercises: {
                            create: day.exercises.map((ex: any, order: number) => ({
                                exerciseId: ex.exerciseId,
                                defaultSets: Number(ex.sets),
                                defaultReps: Number(ex.reps),
                                order
                            }))
                        }
                    }))
                }
            }
        })
    } catch (e) {
        console.error(e)
        throw new Error("Failed to create template")
    }

    revalidatePath('/trainer/templates')
    redirect('/trainer/templates')
}

export async function assignTemplateAction(userId: string, templateId: string) {
    const session = await auth()
    if (!session || (session.user as any).role !== 'TRAINER') throw new Error("Unauthorized")

    try {
        // Deactivate old
        await prisma.assignedTemplate.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        })

        if (templateId === 'none') return; // Just unassign

        // Create new
        await prisma.assignedTemplate.create({
            data: {
                userId,
                templateId,
                isActive: true
            }
        })

        revalidatePath('/trainer/members')
    } catch (e) {
        console.error(e)
        throw new Error("Failed to assign")
    }
}
