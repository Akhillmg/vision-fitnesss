import { auth } from "@/auth-helper"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Dumbbell, Calendar, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
    const userRole = (session?.user as any)?.role
    const userId = session?.user?.id

    if (!userId) return null;

    if (userRole === 'TRAINER') {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Trainer Dashboard</h1>
                <p className="text-zinc-400">Manage your clients and workout templates here.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Link href="/trainer/members" className="group bg-zinc-900 border border-zinc-800 p-8 rounded-xl hover:bg-zinc-800 transition-all">
                        <h3 className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300">Members Management</h3>
                        <p className="text-zinc-400 mt-2">View client progress, assign templates, and track adherence.</p>
                    </Link>
                    <Link href="/trainer/templates" className="group bg-zinc-900 border border-zinc-800 p-8 rounded-xl hover:bg-zinc-800 transition-all">
                        <h3 className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300">Workout Templates</h3>
                        <p className="text-zinc-400 mt-2">Create, edit, and manage workout routines and exercises.</p>
                    </Link>
                </div>
            </div>
        )
    }

    // Member Dashboard Logic
    const [lastSession, sessionCount, assigned] = await Promise.all([
        prisma.workoutSession.findFirst({
            where: { userId },
            orderBy: { date: 'desc' },
        }),
        prisma.workoutSession.count({
            where: { userId }
        }),
        prisma.assignedTemplate.findFirst({
            where: { userId, isActive: true },
            include: { template: true }
        })
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm text-zinc-400 font-medium">Last Workout</h3>
                            <p className="text-lg font-bold text-white">
                                {lastSession ? new Date(lastSession.date).toLocaleDateString() : 'No workouts yet'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm text-zinc-400 font-medium">Total Sessions</h3>
                            <p className="text-lg font-bold text-white">
                                {sessionCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Workout Call to Action */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Dumbbell size={150} />
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Ready to crush it?</h2>
                {assigned ? (
                    <p className="text-zinc-400 mb-8 max-w-lg">
                        Your current plan is <span className="text-emerald-400 font-medium">{assigned.template.name}</span>.
                        Log your session now and keep the streak alive.
                    </p>
                ) : (
                    <p className="text-zinc-400 mb-8 max-w-lg">
                        You don't have a specific plan assigned yet.
                        Start a freestyle workout or ask your trainer for a plan.
                    </p>
                )}

                <Link href="/workout/today" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                    <Dumbbell size={20} />
                    Start Workout
                </Link>
            </div>
        </div>
    )
}
