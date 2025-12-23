import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { addExerciseToDay } from "../../../actions"

export default async function DayExercisesPage({
    params
}: {
    params: Promise<{ id: string, dayId: string }>
}) {
    const { id, dayId } = await params
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const day = await prisma.workoutDay.findUnique({
        where: { id: dayId },
        include: {
            template: true,
            exercises: {
                orderBy: { order: 'asc' },
                include: { exercise: true }
            }
        }
    })

    if (!day || day.templateId !== id) return redirect("/trainer/programs")

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <Link href={`/trainer/programs/${id}`} className="flex items-center text-zinc-500 hover:text-white mb-4">
                <ChevronLeft size={16} className="mr-1" /> Back to Program
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">{day.title}</h1>
                    <p className="text-zinc-400 text-sm">Manage exercises for this day</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 h-fit">
                    <CardHeader>
                        <CardTitle className="text-white">Add Exercise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={addExerciseToDay} className="space-y-4">
                            <input type="hidden" name="dayId" value={day.id} />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Exercise Name</label>
                                <Input name="name" placeholder="e.g. Bench Press" className="bg-zinc-950 border-zinc-800 text-white" required />
                            </div>

                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-zinc-300">Sets</label>
                                    <Input name="sets" type="number" defaultValue="3" className="bg-zinc-950 border-zinc-800 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-zinc-300">Reps</label>
                                    <Input name="reps" type="number" defaultValue="10" className="bg-zinc-950 border-zinc-800 text-white" />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                <Plus size={16} className="mr-2" /> Add Exercise
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Current Exercises</h3>
                    {day.exercises.length > 0 ? (
                        day.exercises.map((ex, idx) => (
                            <Card key={ex.id} className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{ex.exercise.name}</p>
                                            <p className="text-sm text-zinc-500">{ex.sets} sets x {ex.reps} reps</p>
                                        </div>
                                    </div>
                                    {/* Delete Button could go here */}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-zinc-500 italic">No exercises yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
