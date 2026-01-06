"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Clock, Save, Trash2, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { finishWorkoutAction, WorkoutSet } from "@/actions/workout";

interface ActiveLoggerProps {
    workoutId: string;
    initialName: string;
}

type LocalExercise = {
    id: string;
    name: string;
    sets: WorkoutSet[];
};

export function ActiveLogger({ workoutId, initialName }: ActiveLoggerProps) {
    const router = useRouter();
    const [duration, setDuration] = useState(0);
    const [exercises, setExercises] = useState<LocalExercise[]>([]);
    const [newExerciseName, setNewExerciseName] = useState("");
    const [isFinishing, setIsFinishing] = useState(false);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const addExercise = () => {
        if (!newExerciseName.trim()) return;
        const newEx: LocalExercise = {
            id: crypto.randomUUID(),
            name: newExerciseName,
            sets: [
                { exerciseName: newExerciseName, setNumber: 1, weight: 0, reps: 0, completed: false }
            ]
        };
        setExercises([...exercises, newEx]);
        setNewExerciseName("");
    };

    const addSet = (exId: string) => {
        setExercises(exercises.map(ex => {
            if (ex.id === exId) {
                return {
                    ...ex,
                    sets: [
                        ...ex.sets,
                        {
                            exerciseName: ex.name,
                            setNumber: ex.sets.length + 1,
                            weight: ex.sets[ex.sets.length - 1]?.weight || 0,
                            reps: ex.sets[ex.sets.length - 1]?.reps || 0,
                            completed: false
                        }
                    ]
                };
            }
            return ex;
        }));
    };

    const updateSet = (exId: string, setIndex: number, field: keyof WorkoutSet, value: any) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id !== exId) return ex;
            const newSets = [...ex.sets];
            newSets[setIndex] = { ...newSets[setIndex], [field]: value };
            return { ...ex, sets: newSets };
        }));
    };

    const handleFinish = async () => {
        setIsFinishing(true);
        // Flatten all sets
        const allSets = exercises.flatMap(ex => ex.sets);

        await finishWorkoutAction(workoutId, duration, allSets);
        router.push("/dashboard/member/workout");
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header / Timer */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800 p-4 -mx-4 mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-white font-bold">{initialName}</h2>
                    <div className="flex items-center text-indigo-400 font-mono text-xl">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(duration)}
                    </div>
                </div>
                <Button
                    onClick={handleFinish}
                    disabled={isFinishing}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                    {isFinishing ? "Saving..." : "Finish"}
                </Button>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
                {exercises.map((ex) => (
                    <Card key={ex.id} className="bg-zinc-900 border-zinc-800">
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-zinc-500" />
                                {ex.name}
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            {/* Table Header */}
                            <div className="grid grid-cols-10 gap-2 p-2 text-xs uppercase text-zinc-500 font-semibold text-center border-b border-zinc-800 bg-zinc-950/30">
                                <div className="col-span-1">Set</div>
                                <div className="col-span-3">kg</div>
                                <div className="col-span-3">Reps</div>
                                <div className="col-span-3">Done</div>
                            </div>

                            {/* Sets */}
                            {ex.sets.map((set, idx) => (
                                <div key={idx} className={`grid grid-cols-10 gap-2 p-3 items-center border-b border-zinc-800 last:border-0 ${set.completed ? 'bg-green-900/10' : ''}`}>
                                    <div className="col-span-1 text-center font-mono text-zinc-400">{set.setNumber}</div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            className="h-8 bg-zinc-950 border-zinc-700 text-center"
                                            value={set.weight}
                                            onChange={(e) => updateSet(ex.id, idx, 'weight', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            className="h-8 bg-zinc-950 border-zinc-700 text-center"
                                            value={set.reps}
                                            onChange={(e) => updateSet(ex.id, idx, 'reps', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-3 flex justify-center">
                                        <Button
                                            size="sm"
                                            variant={set.completed ? "default" : "outline"}
                                            className={`h-8 w-12 ${set.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'}`}
                                            onClick={() => updateSet(ex.id, idx, 'completed', !set.completed)}
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Set Button */}
                            <Button variant="ghost" className="w-full text-zinc-500 hover:text-white rounded-none h-10 text-xs uppercase tracking-widest" onClick={() => addSet(ex.id)}>
                                <Plus className="w-3 h-3 mr-2" /> Add Set
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Exercise UI */}
            <div className="p-4 bg-zinc-900/50 border border-dashed border-zinc-700 rounded-xl">
                <div className="flex gap-2">
                    <Input
                        placeholder="Exercise Name (e.g. Bench Press)"
                        className="bg-zinc-950 border-zinc-700"
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                    />
                    <Button onClick={addExercise} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
