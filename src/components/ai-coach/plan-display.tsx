"use client";

import { AIPlanResult, AICoachInput, saveAIPlanAction } from "@/actions/ai-coach";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Dumbbell, Utensils, Save, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PlanDisplayProps {
    plan: AIPlanResult;
    input: AICoachInput;
    onReset: () => void;
}

export function PlanDisplay({ plan, input, onReset }: PlanDisplayProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const res = await saveAIPlanAction(input, plan);
        setIsSaving(false);
        if (res?.success) setIsSaved(true);
    };

    const macroData = [
        { name: 'Protein', value: plan.nutrition.protein, color: '#818cf8' }, // Indigo-400
        { name: 'Carbs', value: plan.nutrition.carbs, color: '#34d399' },   // Emerald-400
        { name: 'Fats', value: plan.nutrition.fats, color: '#fbbf24' },     // Amber-400
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Summary */}
            <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-indigo-500">
                <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold text-white mb-2">My Custom Plan</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">{plan.summary}</p>
                </CardContent>
            </Card>

            <Tabs defaultValue="workout" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900 h-14 p-1">
                    <TabsTrigger value="workout" className="data-[state=active]:bg-zinc-800 text-base">
                        <Dumbbell className="w-4 h-4 mr-2" /> Workout Split
                    </TabsTrigger>
                    <TabsTrigger value="nutrition" className="data-[state=active]:bg-zinc-800 text-base">
                        <Utensils className="w-4 h-4 mr-2" /> Nutrition & Macros
                    </TabsTrigger>
                </TabsList>

                {/* Workout Tab */}
                <TabsContent value="workout" className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {plan.schedule.map((day, idx) => (
                            <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                                <CardHeader className="pb-3 border-b border-zinc-800/50">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg font-bold text-zinc-100">{day.day}</CardTitle>
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400">
                                            {day.focus}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    {day.exercises.map((ex, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-zinc-300 font-medium">{ex.name}</span>
                                            <span className="text-zinc-500">{ex.sets} x {ex.reps}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Nutrition Tab */}
                <TabsContent value="nutrition" className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Stats Card */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Daily Targets</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center p-6 bg-zinc-950 rounded-xl border border-zinc-800">
                                    <span className="block text-zinc-500 text-sm uppercase tracking-wider">Total Calories</span>
                                    <span className="text-4xl font-black text-white">{plan.nutrition.calories}</span>
                                    <span className="text-zinc-500 text-sm ml-1">kcal</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-indigo-950/20 rounded-lg border border-indigo-500/20">
                                        <div className="text-indigo-400 font-bold text-xl">{plan.nutrition.protein}g</div>
                                        <div className="text-xs text-indigo-300/60 uppercase">Protein</div>
                                    </div>
                                    <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/20">
                                        <div className="text-emerald-400 font-bold text-xl">{plan.nutrition.carbs}g</div>
                                        <div className="text-xs text-emerald-300/60 uppercase">Carbs</div>
                                    </div>
                                    <div className="p-3 bg-amber-950/20 rounded-lg border border-amber-500/20">
                                        <div className="text-amber-400 font-bold text-xl">{plan.nutrition.fats}g</div>
                                        <div className="text-xs text-amber-300/60 uppercase">Fats</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chart Card */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-white">Macro Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={macroData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {macroData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800 mt-6">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">AI Nutrition Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                                {plan.nutrition.notes.map((note, i) => (
                                    <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Action Bar */}
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <Button
                    variant="outline"
                    className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    onClick={onReset}
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
                </Button>
                <Button
                    className={`flex-1 ${isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                >
                    {isSaved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Saved to Profile
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" /> Save Plan
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
