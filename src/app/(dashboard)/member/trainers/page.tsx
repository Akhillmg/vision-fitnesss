import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitReview, assignTrainer } from "./actions"
import { redirect } from "next/navigation"
import { User, Check, Star } from "lucide-react"

export default async function TrainersPage() {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, gymId: true, assignedTrainerId: true }
    })

    if (!user || !user.gymId) return redirect("/")

    const trainers = await prisma.user.findMany({
        where: {
            gymId: user.gymId,
            role: "TRAINER"
        },
        include: {
            trainerProfile: true,
            receivedReviews: {
                select: { rating: true }
            }
        }
    })

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen text-white">
            <h1 className="text-2xl font-bold uppercase tracking-tighter text-emerald-500">Find a Coach</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trainers.map(trainer => {
                    const avgRating = trainer.receivedReviews.reduce((acc, r) => acc + r.rating, 0) / (trainer.receivedReviews.length || 1)
                    const isAssigned = user.assignedTrainerId === trainer.id

                    return (
                        <Card key={trainer.id} className={`bg-zinc-900 border-zinc-800 ${isAssigned ? 'border-emerald-500 box-content' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                            <User className="text-zinc-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-white">{trainer.name}</CardTitle>
                                            <p className="text-xs text-zinc-400">{trainer.trainerProfile?.specialties || "General Fitness"}</p>
                                        </div>
                                    </div>
                                    {isAssigned && (
                                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold uppercase">
                                            <Check size={12} /> Coach
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-white font-bold">{avgRating.toFixed(1)}</span>
                                    <span className="text-zinc-500">({trainer.receivedReviews.length} reviews)</span>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm text-zinc-400 min-h-[60px]">
                                {trainer.trainerProfile?.bio || "Ready to help you achieve your goals."}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3 pt-0">
                                {!isAssigned && (
                                    <form action={async () => {
                                        "use server"
                                        await assignTrainer(trainer.id)
                                    }} className="w-full">
                                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                                            Hire Coach
                                        </Button>
                                    </form>
                                )}

                                <div className="w-full pt-3 border-t border-zinc-800">
                                    <p className="text-xs text-zinc-500 mb-2 uppercase font-bold">Leave a Review</p>
                                    <form action={submitReview} className="space-y-2">
                                        <input type="hidden" name="trainerId" value={trainer.id} />
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                name="rating"
                                                min="1"
                                                max="5"
                                                placeholder="5"
                                                className="w-16 bg-zinc-950 border-zinc-800 text-white"
                                                required
                                            />
                                            <Input
                                                name="comment"
                                                placeholder="Great session!"
                                                className="flex-1 bg-zinc-950 border-zinc-800 text-white"
                                            />
                                        </div>
                                        <Button size="sm" variant="ghost" className="w-full text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 h-8">
                                            Submit Review
                                        </Button>
                                    </form>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
