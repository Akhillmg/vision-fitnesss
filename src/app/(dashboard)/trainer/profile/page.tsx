import { auth, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Save } from "lucide-react"
import { updateProfile } from "./actions"
import { redirect } from "next/navigation"

export default async function TrainerProfilePage() {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { trainerProfile: true }
    })

    if (!user) return redirect("/")

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Coach Profile</h1>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl text-white">
                        {user.name?.[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-sm text-zinc-400">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-red-900/20 text-[10px] text-red-500 uppercase tracking-wide">Trainer Account</span>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-lg font-bold text-white uppercase mt-8">Details</h2>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <form action={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Bio</label>
                            <Textarea
                                name="bio"
                                placeholder="Tell clients about yourself..."
                                defaultValue={user.trainerProfile?.bio || ""}
                                className="bg-zinc-950 border-zinc-800 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Specialties</label>
                            <Input
                                name="specialties"
                                placeholder="e.g. Strength, HIIT, Nutrition"
                                defaultValue={user.trainerProfile?.specialties || ""}
                                className="bg-zinc-950 border-zinc-800 text-white"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                            <Save size={16} className="mr-2" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <form action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
            }}>
                <Button variant="destructive" className="w-full mt-6" type="submit">
                    <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
            </form>
        </div>
    )
}
