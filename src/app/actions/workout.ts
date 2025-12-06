'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth-helper"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function logWorkoutAction(data: any) {
    const session = await auth()
    if (!session || !session.user) throw new Error("Unauthorized")

    try {
        await prisma.workoutSession.create({
            data: {
                userId: session.user.id!,
                date: new Date(),
                templateId: data.templateId,
                sets: {
                    create: data.sets.flatMap((ex: any) =>
                        ex.sets.map((s: any, idx: number) => ({
                            exerciseId: ex.exerciseId,
                            setNumber: idx + 1,
                            weight: Number(s.weight),
                            reps: Number(s.reps),
                            rpe: s.rpe ? Number(s.rpe) : null
                        }))
                    )
                }
            }
        })
    } catch (e) {
        console.error(e)
        throw new Error("Failed to log workout")
    }

    revalidatePath('/dashboard')
    revalidatePath('/history')
    redirect('/history')
}
