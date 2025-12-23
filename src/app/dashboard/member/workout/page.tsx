import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export default function MemberWorkoutPage() {
    return (
        <div className="p-4 pt-8 bg-black min-h-screen text-white space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">My Workout Plan</h1>
                <Button variant="ghost" className="text-zinc-500" asChild>
                    <a href="/dashboard/member/home">Back</a>
                </Button>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <p className="text-zinc-500 text-center">Full workout plan details will appear here.</p>
                </CardContent>
            </Card>
        </div>
    )
}
