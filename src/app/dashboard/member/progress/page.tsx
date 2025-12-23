import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Camera, Scale } from "lucide-react"

// Auth handled by middleware
export default async function MemberProgressPage() {

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Progress</h1>
                <Button size="icon" variant="ghost" className="text-red-500">
                    <Camera />
                </Button>
            </div>

            {/* Weight Chart Mock */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase">Body Weight</h3>
                        <span className="text-xs text-green-500 font-bold">-2.5kg</span>
                    </div>
                    <div className="h-40 w-full bg-zinc-800/50 rounded flex items-center justify-center relative">
                        {/* Placeholder for Recharts or similar */}
                        <div className="absolute inset-0 p-4 flex items-end justify-between">
                            <div className="w-4 bg-red-900/40 h-[60%] rounded-t"></div>
                            <div className="w-4 bg-red-900/50 h-[55%] rounded-t"></div>
                            <div className="w-4 bg-red-900/60 h-[58%] rounded-t"></div>
                            <div className="w-4 bg-red-900/70 h-[52%] rounded-t"></div>
                            <div className="w-4 bg-red-600 h-[50%] rounded-t"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="bg-zinc-900/30 border-zinc-800 p-4">
                    <Scale size={20} className="text-zinc-500 mb-2" />
                    <span className="text-2xl font-bold text-white">75.5</span>
                    <span className="text-xs text-zinc-500 block uppercase">Current Kg</span>
                </Card>
                <Card className="bg-zinc-900/30 border-zinc-800 p-4">
                    <LineChart size={20} className="text-zinc-500 mb-2" />
                    <span className="text-2xl font-bold text-white">18%</span>
                    <span className="text-xs text-zinc-500 block uppercase">Body Fat Est.</span>
                </Card>
            </div>
        </div>
    )
}
