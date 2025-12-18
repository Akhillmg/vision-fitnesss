import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function TrainerProgramsPage() {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true }
    })

    if (!user || user.role !== "TRAINER") {
        return redirect("/")
    }

    // Fetch Programs created by this trainer
    const programs = await prisma.workoutTemplate.findMany({
        where: {
            createdById: user.id
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Programs</h1>
                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400" asChild>
                    <Link href="/trainer/programs/create">
                        <Plus />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {programs.length > 0 ? (
                    programs.map(prog => (
                        <Card key={prog.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white">{prog.name}</h3>
                                    {/* <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 uppercase">{prog.level}</span> */}
                                </div>
                                <p className="text-sm text-zinc-500 line-clamp-2">{prog.description || "No description"}</p>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:text-white" asChild>
                                        <Link href={`/trainer/programs/${prog.id}`}>Edit</Link>
                                    </Button>
                                    <Button size="sm" className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white">Assign</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 space-y-4">
                        <p className="text-zinc-500">No programs created yet.</p>
                        <Button variant="outline" className="border-zinc-800 text-zinc-400" asChild>
                            <Link href="/trainer/programs/create">Create First Program</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
