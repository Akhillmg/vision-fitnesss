import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, Dumbbell } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { addDay } from "../actions"

export default async function ProgramDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
    })

    if (!user || user.role !== "TRAINER") return redirect("/")

    const program = await prisma.workoutTemplate.findUnique({
        where: { id, createdById: user.id },
        include: {
            days: {
                orderBy: { dayIndex: 'asc' },
                include: {
                    exercises: {
                        orderBy: { order: 'asc' },
                        include: { exercise: true }
                    }
                }
            }
        }
    })

    if (!program) return redirect("/trainer/programs")

    const addDayAction = addDay.bind(null, program.id)

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <Link href="/trainer/programs" className="flex items-center text-zinc-500 hover:text-white mb-4">
                <ChevronLeft size={16} className="mr-1" /> Back to Programs
            </Link>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">{program.name}</h1>
                    <p className="text-zinc-400 text-sm">{program.description || "No description provided."}</p>
                </div>
                <form action={addDayAction}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        <Plus size={16} className="mr-2" /> Add Day
                    </Button>
                </form>
            </div>

            <div className="grid gap-6">
                {program.days.map((day) => (
                    <Card key={day.id} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="p-4 flex flex-row items-center justify-between border-b border-zinc-800">
                            <CardTitle className="text-lg font-bold text-white uppercase">{day.title}</CardTitle>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 h-8" asChild>
                                <Link href={`/trainer/programs/${program.id}/day/${day.id}`}>
                                    Edit Exercises
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4">
                            {day.exercises.length > 0 ? (
                                <div className="space-y-2">
                                    {day.exercises.map((dayExercise, idx) => (
                                        <div key={dayExercise.id} className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-zinc-600 w-4">{idx + 1}</span>
                                                <span className="text-sm font-medium text-zinc-200">{dayExercise.exercise.name}</span>
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                {dayExercise.sets} x {dayExercise.reps}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-600 italic">No exercises added yet.</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {program.days.length === 0 && (
                <div className="p-10 border border-dashed border-zinc-800 rounded bg-zinc-900/50 text-center text-zinc-500">
                    <p>Start building this program by adding a Day.</p>
                </div>
            )}
        </div>
    )
}
