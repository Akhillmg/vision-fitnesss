import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function TrainerProgramsPage() {
    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Workout Plans</h1>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> New Plan
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800 border-dashed flex items-center justify-center p-8 cursor-pointer hover:bg-zinc-900/50">
                    <div className="text-center text-zinc-500">
                        <Plus size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Create First Plan</p>
                    </div>
                </Card>

                {/* Placeholder for fetching actual plans */}
                {/* <PlanCard ... /> */}
            </div>
        </div>
    )
}
