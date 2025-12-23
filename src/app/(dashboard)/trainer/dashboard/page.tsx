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

    const [activeClients, sessionsToday, trainingToday, reviews] = await Promise.all([
        // Active Clients (Assigned to this trainer)
        prisma.user.count({
            where: {
                gymId: user.gymId,
                assignedTrainerId: user.id
            }
        }),
        // Sessions Today (All gym - or just clients?) Let's keep general gym stats or switch to clients.
        // Let's make it more specific to the trainer: Clients who trained today.
        prisma.workoutSession.count({
            where: {
                user: { assignedTrainerId: user.id },
                date: { gte: startOfDay }
            }
        }),
        // Students Training Today (List)
        prisma.user.findMany({
            where: {
                assignedTrainerId: user.id,
                workoutSessions: {
                    some: {
                        date: { gte: startOfDay }
                    }
                }
            },
            select: {
                id: true, name: true,
                workoutSessions: {
                    where: { date: { gte: startOfDay } },
                    take: 1,
                    select: { id: true, notes: true }
                }
            }
        }),
        // Reviews
        prisma.trainerReview.findMany({
            where: { trainerId: user.id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                member: { select: { name: true } }
            }
        })
    ])

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Coach Dashboard</h1>
                    <p className="text-zinc-500 text-sm">Welcome back, {user.name}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-xs font-bold text-white">{user.name?.[0] || "T"}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-red-500" />
                        <span className="text-xs text-zinc-500 uppercase">My Clients</span>
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

            {/* Students Training Today */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Dumbbell size={16} /> Students Training Today
                </h3>
                {trainingToday.length > 0 ? (
                    trainingToday.map((student) => (
                        <Card key={student.id} className="bg-zinc-900/50 border-zinc-800">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-white">{student.name}</span>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Active</span>
                                </div>
                                <p className="text-xs text-zinc-400 truncate">
                                    {student.workoutSessions[0]?.notes || "No notes logged yet."}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-4 bg-zinc-900/30 rounded-lg border border-dashed border-zinc-800 text-center">
                        <p className="text-sm text-zinc-500">No students active today.</p>
                    </div>
                )}
            </div>

            {/* Reviews */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Users size={16} /> Recent Reviews
                </h3>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Card key={review.id} className="bg-zinc-900/30 border-zinc-800">
                            <CardContent className="p-3 space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-semibold text-white">{review.member.name}</span>
                                    <div className="flex text-yellow-500 text-xs">
                                        {"★".repeat(review.rating)}
                                        <span className="text-zinc-700">{"★".repeat(5 - review.rating)}</span>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-xs text-zinc-400 italic">"{review.comment}"</p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-sm text-zinc-500 italic">No reviews yet.</p>
                )}
            </div>

            {/* Quick Action */}
            <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-red-600">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="text-red-600" />
                        <div>
                            <h3 className="text-sm font-bold text-white">Manage Programs</h3>
                        </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white" asChild>
                        <a href="/trainer/programs">View</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
