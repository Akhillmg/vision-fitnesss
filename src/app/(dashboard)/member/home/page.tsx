import { auth } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Play } from "lucide-react"

function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
}

export default async function MemberHomePage() {
    const session = await auth()
    const user = session?.user

    return (
        <div className="space-y-6 p-4 pt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
                        <span className="text-zinc-500 block text-sm font-medium tracking-normal normal-case mb-1">{getGreeting()},</span>
                        {user?.name?.split(' ')[0] || "Athlete"}
                    </h1>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <span className="text-xs font-bold text-white">{user?.name?.[0] || "U"}</span>
                </div>
            </div>

            {/* Streak / Motivation */}
            <Card className="border-red-900/20 bg-gradient-to-br from-zinc-900 to-black overflow-hidden relative">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Flame size={100} className="text-red-600" />
                </div>
                <CardContent className="p-6 relative z-10">
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-black text-red-500">3</span>
                        <span className="text-sm font-medium text-zinc-400 mb-2">DAY STREAK</span>
                    </div>
                    <p className="text-sm text-zinc-300">"Consistency is the key to breaking barriers. keep pushing!"</p>
                </CardContent>
            </Card>

            {/* Today's Workout */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-white">TODAY'S WORKOUT</h2>
                    <span className="text-xs font-medium text-zinc-500 uppercase">Chest & Triceps</span>
                </div>
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-0">
                        <div className="w-full h-32 bg-zinc-800 relative">
                            {/* Placeholder for workout image */}
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                <Play size={40} className="fill-current opacity-50" />
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-white mb-1">Push Day A</h3>
                            <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                                <span>45 Mins</span>
                                <span>•</span>
                                <span>6 Exercises</span>
                            </div>
                            <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 font-bold uppercase">
                                <Play size={16} className="fill-current" /> Start Workout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900/30 border-zinc-800 p-4">
                    <span className="text-xs text-zinc-500 uppercase block mb-1">Weight</span>
                    <span className="text-xl font-bold text-white">75.5 <span className="text-xs text-zinc-600">kg</span></span>
                    <span className="text-[10px] text-green-500 block mt-1">-0.5kg this week</span>
                </Card>
                <Card className="bg-zinc-900/30 border-zinc-800 p-4">
                    <span className="text-xs text-zinc-500 uppercase block mb-1">Calories</span>
                    <span className="text-xl font-bold text-white">1,240 <span className="text-xs text-zinc-600">/ 2,400</span></span>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full w-[50%]"></div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
