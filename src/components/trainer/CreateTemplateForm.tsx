"use client"
import { useState } from "react"
import { Plus, Trash, Save, Loader2 } from "lucide-react"
import { createTemplateAction } from "@/app/actions/trainer"

export function CreateTemplateForm({ exercises }: { exercises: any[] }) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    // Days State
    const [days, setDays] = useState([
        { title: "Day 1", exercises: [{ exerciseId: exercises[0]?.id || "", sets: 3, reps: 10 }] }
    ])

    const handleAddDay = () => {
        setDays([...days, { title: `Day ${days.length + 1}`, exercises: [] }])
    }

    const handleAddExercise = (dayIndex: number) => {
        const newDays = [...days]
        newDays[dayIndex].exercises.push({ exerciseId: exercises[0]?.id || "", sets: 3, reps: 10 })
        setDays(newDays)
    }

    const handleSubmit = async () => {
        if (!name) return;
        setLoading(true)
        try {
            await createTemplateAction({ name, description, days })
        } catch (e) {
            alert('Error creating template')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-24 animate-in slide-in-from-bottom-5 duration-500">
            {/* Name & Desc */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1 font-medium">Program Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="e.g. 5/3/1 Strength"
                    />
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1 font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-white h-24 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Brief overview of the routine goals..."
                    />
                </div>
            </div>

            {/* Days Builder */}
            <div className="space-y-6">
                {days.map((day, dIdx) => (
                    <div key={dIdx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative group">
                        {/* Day Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                            <input
                                value={day.title}
                                onChange={e => {
                                    const newDays = [...days];
                                    newDays[dIdx].title = e.target.value;
                                    setDays(newDays)
                                }}
                                className="bg-transparent text-xl font-bold text-emerald-400 focus:outline-none border-b border-transparent focus:border-emerald-500 transition-colors"
                            />
                            {days.length > 1 && (
                                <button onClick={() => setDays(days.filter((_, i) => i !== dIdx))} className="text-zinc-500 hover:text-red-500 p-2 rounded hover:bg-zinc-800 transition-colors">
                                    <Trash size={20} />
                                </button>
                            )}
                        </div>

                        {/* Exercises List */}
                        <div className="space-y-3">
                            {day.exercises.map((ex, eIdx) => (
                                <div key={eIdx} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-center bg-black/40 p-3 rounded-lg border border-transparent hover:border-zinc-700 transition-colors">
                                    <select
                                        value={ex.exerciseId}
                                        onChange={e => {
                                            const newDays = [...days];
                                            newDays[dIdx].exercises[eIdx].exerciseId = e.target.value;
                                            setDays(newDays)
                                        }}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                                    >
                                        {exercises.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                    </select>

                                    <div className="flex items-center gap-2">
                                        <input type="number" value={ex.sets} onChange={e => {
                                            const newDays = [...days];
                                            newDays[dIdx].exercises[eIdx].sets = Number(e.target.value);
                                            setDays(newDays);
                                        }} className="w-16 bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm text-center focus:border-emerald-500 focus:outline-none" placeholder="Sets" />
                                        <span className="text-zinc-500 text-xs w-8">Sets</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={ex.reps} onChange={e => {
                                            const newDays = [...days];
                                            newDays[dIdx].exercises[eIdx].reps = Number(e.target.value);
                                            setDays(newDays);
                                        }} className="w-16 bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm text-center focus:border-emerald-500 focus:outline-none" placeholder="Reps" />
                                        <span className="text-zinc-500 text-xs w-8">Reps</span>
                                    </div>

                                    <button onClick={() => {
                                        const newDays = [...days];
                                        newDays[dIdx].exercises.splice(eIdx, 1);
                                        setDays(newDays);
                                    }} className="text-zinc-500 hover:text-red-500 ml-1 p-2">
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}

                            <button onClick={() => handleAddExercise(dIdx)} className="w-full py-3 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2 text-sm mt-4 font-medium">
                                <Plus size={16} /> Add Exercise
                            </button>
                        </div>
                    </div>
                ))}

                <button onClick={handleAddDay} className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-medium flex items-center justify-center gap-2 transition-all">
                    <Plus size={20} /> Add Training Day
                </button>
            </div>

            {/* Floating Save Bar */}
            <div className="fixed bottom-6 right-6 md:right-12 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !name}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Program</>}
                </button>
            </div>
        </div>
    )
}
