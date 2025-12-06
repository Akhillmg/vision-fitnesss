import { auth } from "@/auth-helper"
import { prisma } from "@/lib/prisma"
import { WorkoutLogger } from "@/components/member/WorkoutLogger"

export default async function WorkoutSessionPage({ params }: { params: { dayId: string } }) {
    const session = await auth()
    if (!session) return null

    // Fetch day details
    const day = await prisma.workoutDay.findUnique({
        where: { id: params.dayId },
        include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } }, template: true }
    })

    if (!day) return <div className="text-white p-8">Day not found</div>

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">{day.title}</h1>
                <p className="text-zinc-400">Log your numbers below. Aim for progress.</p>
            </div>

            <WorkoutLogger day={day} templateId={day.templateId} />
        </div>
    )
}
