import { auth } from "@/auth-helper"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ChevronRight, Dumbbell } from "lucide-react"

export default async function StartWorkoutPage() {
    const session = await auth()
    const userId = session?.user?.id

    const assigned = await prisma.assignedTemplate.findFirst({
        where: { userId, isActive: true },
        include: { template: { include: { days: { include: { exercises: { include: { exercise: true } } }, orderBy: { dayIndex: 'asc' } } } } }
    })

    if (!assigned) {
        return (
            <div className="text-center p-12">
                <h2 className="text-xl text-white font-bold">No Active Plan</h2>
                <p className="text-zinc-400 mt-2">Please ask your trainer to assign a workout template.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Select Today's Workout</h1>
            <p className="text-zinc-400">Current Plan: <span className="text-emerald-400 font-medium">{assigned.template.name}</span></p>

            <div className="grid gap-4 mt-6">
                {assigned.template.days.map(day => (
                    <Link key={day.id} href={`/workout/log/${day.id}`} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex justify-between items-center hover:bg-zinc-800 hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                <Dumbbell size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{day.title}</h3>
                                <p className="text-sm text-zinc-500 mt-1">{day.exercises.length} Exercises</p>
                            </div>
                        </div>
                        <ChevronRight className="text-zinc-600 group-hover:text-white transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
