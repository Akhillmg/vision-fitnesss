import { auth } from "@/auth-helper"
import { prisma } from "@/lib/prisma"
import { Calendar } from "lucide-react"

export default async function HistoryPage() {
    const session = await auth()
    const history = await prisma.workoutSession.findMany({
        where: { userId: session?.user?.id },
        orderBy: { date: 'desc' },
        include: { sets: { include: { exercise: true } }, template: true }
    })

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white">Workout History</h1>

            <div className="space-y-4">
                {history.map(session => {
                    // Group sets by exercise
                    const exercises = Object.values(session.sets.reduce((acc: any, set) => {
                        if (!acc[set.exerciseId]) {
                            acc[set.exerciseId] = { name: set.exercise.name, sets: [] }
                        }
                        acc[set.exerciseId].sets.push(set)
                        return acc
                    }, {}))

                    return (
                        <div key={session.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                            <div className="bg-zinc-950 p-4 border-b border-zinc-900 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-zinc-500" size={20} />
                                    <span className="font-bold text-white">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <span className="text-sm text-zinc-500">{session.template?.name || 'Freestyle'}</span>
                            </div>
                            <div className="p-6 grid gap-4 md:grid-cols-2">
                                {exercises.map((ex: any) => (
                                    <div key={ex.name}>
                                        <h4 className="font-medium text-emerald-400 mb-1">{ex.name}</h4>
                                        <div className="text-sm text-zinc-400">
                                            {ex.sets.map((s: any, i: number) => (
                                                <span key={i} className="mr-3">
                                                    {s.weight}kg x {s.reps}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {history.length === 0 && (
                    <div className="text-center p-12 text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <p className="text-lg">No history yet. Go lift something!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
