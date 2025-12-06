"use client"
import { useState } from "react"
import { Plus, Check, Trash } from "lucide-react"
import { logWorkoutAction } from "@/app/actions/workout"

export function WorkoutLogger({ day, templateId }: { day: any, templateId?: string }) {
    // Initialize with default sets
    const [logs, setLogs] = useState(
        day.exercises.map((ex: any) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exercise.name,
            sets: Array.from({ length: ex.defaultSets }).map(() => ({ weight: '', reps: ex.defaultReps, rpe: '' }))
        }))
    )
    const [loading, setLoading] = useState(false)

    const updateSet = (exIdx: number, setIdx: number, field: string, value: string) => {
        const newLogs = [...logs]
        newLogs[exIdx].sets[setIdx] = { ...newLogs[exIdx].sets[setIdx], [field]: value }
        setLogs(newLogs)
    }

    const addSet = (exIdx: number) => {
        const newLogs = [...logs]
        const lastSet = newLogs[exIdx].sets[newLogs[exIdx].sets.length - 1] || { weight: '', reps: 10, rpe: '' }
        newLogs[exIdx].sets.push({ ...lastSet })
        setLogs(newLogs)
    }

    const removeSet = (exIdx: number, setIdx: number) => {
        const newLogs = [...logs]
        newLogs[exIdx].sets.splice(setIdx, 1)
        setLogs(newLogs)
    }

    const handleFinish = async () => {
        setLoading(true)
        try {
            await logWorkoutAction({ templateId, sets: logs })
        } catch (e) {
            alert('Error logging workout')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-32 animate-in slide-in-from-bottom-5 duration-500">
            {logs.map((exLog, i) => (
                <div key={exLog.exerciseId} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">{exLog.exerciseName}</h3>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Exercise {i + 1}</span>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-2 md:gap-4 mb-2 text-xs text-zinc-500 font-medium px-2">
                            <span className="text-center">Set</span>
                            <span className="text-center">kg</span>
                            <span className="text-center">Reps</span>
                            <span className="text-center">RPE</span>
                            <span></span>
                        </div>

                        <div className="space-y-2">
                            {exLog.sets.map((set: any, sIdx: number) => (
                                <div key={sIdx} className="grid grid-cols-[2rem_1fr_1fr_1fr_2rem] gap-2 md:gap-4 items-center">
                                    <span className="text-center text-zinc-500 font-bold">{sIdx + 1}</span>
                                    <input
                                        type="number"
                                        value={set.weight}
                                        onChange={e => updateSet(i, sIdx, 'weight', e.target.value)}
                                        className="bg-black border border-zinc-800 rounded p-3 text-center text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                        placeholder="-"
                                    />
                                    <input
                                        type="number"
                                        value={set.reps}
                                        onChange={e => updateSet(i, sIdx, 'reps', e.target.value)}
                                        className="bg-black border border-zinc-800 rounded p-3 text-center text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                        placeholder="-"
                                    />
                                    <input
                                        type="number"
                                        value={set.rpe}
                                        onChange={e => updateSet(i, sIdx, 'rpe', e.target.value)}
                                        className="bg-black border border-zinc-800 rounded p-3 text-center text-white focus:border-emerald-500 focus:outline-none transition-colors"
                                        placeholder="-"
                                    />
                                    <button onClick={() => removeSet(i, sIdx)} className="flex items-center justify-center text-zinc-600 hover:text-red-500 w-full h-full">
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => addSet(i)} className="mt-4 w-full py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-emerald-500 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                            <Plus size={16} /> Add Set
                        </button>
                    </div>
                </div>
            ))}

            <div className="fixed bottom-6 left-0 right-0 p-4 md:pl-72 flex justify-center z-50 pointer-events-none">
                <button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full max-w-md bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 pointer-events-auto transition-all hover:scale-105 active:scale-95"
                >
                    <Check size={24} /> Finish Workout
                </button>
            </div>
        </div>
    )
}
