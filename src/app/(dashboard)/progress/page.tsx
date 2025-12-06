import { auth } from "@/auth-helper"
import { prisma } from "@/lib/prisma"
import { ProgressCharts } from "@/components/member/ProgressCharts"

export default async function ProgressPage() {
    const session = await auth()
    const sets = await prisma.workoutSet.findMany({
        where: { session: { userId: session?.user?.id } },
        include: { session: true, exercise: true },
        orderBy: { session: { date: 'asc' } }
    })

    // Process data: Map<ExerciseName, Array<{date, e1rm}>>
    const data: Record<string, { date: string, e1rm: number }[]> = {}

    sets.forEach(set => {
        // Epley Formula
        const e1rm = set.weight * (1 + set.reps / 30)
        // ISO Date for sorting, formatted for display
        const date = new Date(set.session.date).toLocaleDateString()

        if (!data[set.exercise.name]) data[set.exercise.name] = []

        const existing = data[set.exercise.name].find(d => d.date === date)
        if (existing) {
            existing.e1rm = Math.max(existing.e1rm, e1rm)
        } else {
            data[set.exercise.name].push({ date, e1rm })
        }
    })

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>
                <p className="text-zinc-400">Visualize your strength gains over time.</p>
            </div>

            <ProgressCharts data={data} />
        </div>
    )
}
