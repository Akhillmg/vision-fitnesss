import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProgram } from "../actions"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreateProgramPage() {
    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen max-w-2xl mx-auto">
            <Link href="/trainer/programs" className="flex items-center text-zinc-500 hover:text-white mb-4">
                <ChevronLeft size={16} className="mr-1" /> Back to Programs
            </Link>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Create New Program</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createProgram} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-zinc-300">Program Name</label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. 8 Week Hypertrophy"
                                className="bg-zinc-950 border-zinc-800 text-white"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-zinc-300">Description</label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the goal of this program..."
                                className="bg-zinc-950 border-zinc-800 text-white min-h-[100px]"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                            Create & Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
