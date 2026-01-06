import { getWorkoutHistoryAction } from "@/actions/workout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Timer, Dumbbell, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { VolumeChart } from "@/components/workout/volume-chart";

export default async function MemberWorkoutPage() {
    const history = await getWorkoutHistoryAction();

    return (
        <div className="p-4 pt-8 pb-24 bg-black min-h-screen text-white space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Workouts</h1>
                    <p className="text-zinc-500 text-sm">Track your progress, beat your PRs.</p>
                </div>
            </div>

            {/* Quick Start Card */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 blur-[80px] opacity-20 rounded-full"></div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Ready to crush it?</h2>
                    <p className="text-zinc-400 text-sm mb-6">Start an empty workout and log as you go.</p>
                    <Button asChild className="w-full h-12 text-lg font-bold bg-white text-black hover:bg-zinc-200">
                        <Link href="/dashboard/member/workout/active">
                            <Plus className="w-5 h-5 mr-2" /> Start Workout
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Volume Chart */}
            <VolumeChart data={history.map((h: any) => ({
                name: h.name,
                volume: h.volume_kg || 0,
                date: h.started_at
            }))} />

            {/* History Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Recent Logs
                </h2>

                {history.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                        <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                        <p className="text-zinc-500">No workouts logged yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((log: any) => (
                            <Card key={log.id} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition-colors">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{log.name}</h3>
                                        <div className="flex gap-3 mt-1 text-xs text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="w-3 h-3" />
                                                {new Date(log.started_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Timer className="w-3 h-3" />
                                                {Math.floor(log.duration_seconds / 60)}m
                                            </span>
                                            <span className="flex items-center gap-1 font-medium text-zinc-300">
                                                <Dumbbell className="w-3 h-3" />
                                                {log.volume_kg?.toLocaleString()} kg
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-zinc-600">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
