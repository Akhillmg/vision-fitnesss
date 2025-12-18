import { auth } from "@/auth"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Plus } from "lucide-react"

export default async function MemberWorkoutPage() {
    const session = await auth()
    // In real app, fetch assigned workouts from DB
    const workouts = [
        { id: '1', title: 'Push Day A', duration: '45m', muscles: 'Chest, Triceps' },
        { id: '2', title: 'Pull Day A', duration: '50m', muscles: 'Back, Biceps' },
        { id: '3', title: 'Leg Day', duration: '60m', muscles: 'Quads, Hams' },
    ]

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Workouts</h1>
                <Button size="icon" variant="ghost" className="text-red-500">
                    <Plus />
                </Button>
            </div>

            {/* Active Program Card */}
            <Card className="bg-zinc-900 border-l-4 border-l-red-600 border-t-0 border-r-0 border-b-0 rounded-r-lg">
                <CardContent className="p-4">
                    <span className="text-xs uppercase text-zinc-500 font-bold mb-1 block">Current Program</span>
                    <h2 className="text-xl font-bold text-white">Hypertrophy Phase 1</h2>
                    <p className="text-sm text-zinc-400 mt-1">Week 3 of 8 • 4 days/week</p>
                </CardContent>
            </Card>

            {/* Workout List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase">Available Routines</h3>
                {workouts.map(workout => (
                    <Card key={workout.id} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-red-900/20 flex items-center justify-center text-red-500">
                                    <Dumbbell size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-base text-white">{workout.title}</CardTitle>
                                    <p className="text-xs text-zinc-500">{workout.muscles} • {workout.duration}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-zinc-400">Start</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
