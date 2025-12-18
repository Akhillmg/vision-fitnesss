import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Dumbbell } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TrainerDashboardPage() {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, gymId: true, role: true }
    })

    if (!user || user.role !== "TRAINER" || !user.gymId) {
        return redirect("/") // Or an error page
    }

    // Dates for "Today"
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [activeClients, sessionsToday, recentActivity] = await Promise.all([
        // Active Clients: Members in the same Gym
        prisma.user.count({
            where: {
                gymId: user.gymId,
                role: "MEMBER"
            }
        }),
        // Sessions Today: Sessions by members of this gym created today
        prisma.workoutSession.count({
            where: {
                user: { gymId: user.gymId },
                date: { gte: startOfDay }
            }
        }),
        // Recent Activity: 5 most recent sessions
        prisma.workoutSession.findMany({
            where: {
                user: { gymId: user.gymId }
            },
            take: 3,
            orderBy: { date: 'desc' },
            include: {
                user: { select: { name: true } }
            }
        })
    ])

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Coach Dashboard</h1>
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-xs font-bold text-white">{user.name?.[0] || "T"}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-red-500" />
                        <span className="text-xs text-zinc-500 uppercase">Active Clients</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{activeClients}</span>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-red-500" />
                        <span className="text-xs text-zinc-500 uppercase">Sessions Today</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{sessionsToday}</span>
                </Card>
            </div>

            {/* Quick Action / Highlight */}
            <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-red-600">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="text-red-600" />
                        <div>
                            <h3 className="text-sm font-bold text-white max-w-[150px] truncate">Manage Programs</h3>
                            <p className="text-xs text-zinc-400">Update workout templates</p>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white" asChild>
                        <a href="/trainer/programs">View</a>
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase">Recent Activity</h3>
                {recentActivity.length > 0 ? (
                    recentActivity.map((session) => (
                        <Card key={session.id} className="bg-zinc-900/30 border-zinc-800">
                            <CardContent className="p-3 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-bold">
                                    {session.user.name?.[0]}
                                </div>
                                <div>
                                    <p className="text-sm text-white">
                                        <span className="font-bold">{session.user.name}</span> completed a session
                                    </p>
                                    <p className="text-[10px] text-zinc-500">
                                        {new Date(session.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-sm text-zinc-500 italic">No recent activity.</p>
                )}
            </div>
        </div>
    )
}
