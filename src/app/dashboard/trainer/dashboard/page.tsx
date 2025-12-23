import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Dumbbell, ClipboardList } from "lucide-react"
import { redirect } from "next/navigation"

export default async function TrainerDashboardPage() {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    // Auth Check
    const role = session.user.role // Assuming role is available on session user from middleware/auth
    if (role !== "TRAINER") {
        // middleware handles usually
    }

    const { getTrainerStats } = await import("@/actions/trainer-dashboard")
    const stats = await getTrainerStats()

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Coach Dashboard</h1>
                    <p className="text-zinc-500 text-sm">Welcome back</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-xs font-bold text-white">T</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-blue-500" />
                        <span className="text-xs text-zinc-500 uppercase">My Clients</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.clientCount}</span>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ClipboardList size={18} className="text-green-500" />
                        <span className="text-xs text-zinc-500 uppercase">Workout Plans</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{stats.planCount}</span>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid gap-3">
                <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-600 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="text-blue-600" />
                            <div>
                                <h3 className="text-sm font-bold text-white">My assigned members</h3>
                                <p className="text-xs text-zinc-400">View and manage your students</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white" asChild>
                            <a href="/dashboard/trainer/clients">View</a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-green-600 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Dumbbell className="text-green-600" />
                            <div>
                                <h3 className="text-sm font-bold text-white">Workout Plans</h3>
                                <p className="text-xs text-zinc-400">Create and update routines</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white" asChild>
                            <a href="/dashboard/trainer/programs">Manage</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-xs text-zinc-600 text-center mt-8">
                Vision Fitness Trainer Portal
            </div>
        </div>
    )
}
