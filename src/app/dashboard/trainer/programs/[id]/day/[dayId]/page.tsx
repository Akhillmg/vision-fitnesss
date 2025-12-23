import { createClient } from "@/lib/supabase/server"
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect("/")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client: any = supabase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const step1: any = client.from("WorkoutDay");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const step2: any = step1.select(`
            *,
            template:WorkoutTemplate(*),
            exercises:WorkoutDayExercise(
                *,
                exercise:Exercise(*)
            )
        `);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const step3: any = step2.eq("id", dayId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const step4: any = step3.limit(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await step4;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const day = (response as any).data?.[0];

    if (!day || day.templateId !== id) {
        // redirect("/trainer/programs")
        return <div>Program not found</div>
    }

    // Sort manually
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (day as any).exercises.sort((a: any, b: any) => a.order - b.order)

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
                    {(day as any).exercises.length > 0 ? (
                        (day as any).exercises.map((ex: any, idx: number) => (
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
