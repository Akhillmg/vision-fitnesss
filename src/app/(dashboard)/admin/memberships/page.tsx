import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createMembership } from "./actions"

export default async function AdminMembershipsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect("/")

    const { data: publicUser } = await supabase.from("User").select("role, gymId").eq("id", user.id).single()
    if (publicUser?.role !== "ADMIN") return redirect("/")

    const { data: users } = await supabase
        .from("User")
        .select("id, name, email")
        .eq("gymId", publicUser.gymId)
        .eq("role", "MEMBER")

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Manage Memberships</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Assign New Membership</CardTitle>
                        <CardDescription>Create or renew a plan for a member manually.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createMembership} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Select Member</label>
                                <select name="userId" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                                    <option value="" disabled selected>Select a member...</option>
                                    {users?.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Plan Name</label>
                                <Input name="planName" placeholder="e.g. Gold Monthly" className="bg-zinc-950 border-zinc-800 text-white" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                                    <Input name="price" type="number" placeholder="2000" className="bg-zinc-950 border-zinc-800 text-white" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Duration (Months)</label>
                                    <select name="durationMonths" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                                        <option value="1">1 Month</option>
                                        <option value="3">3 Months</option>
                                        <option value="6">6 Months</option>
                                        <option value="12">1 Year</option>
                                    </select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                                Assign Membership
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-zinc-500 text-sm">
                            Recently added memberships will verify here.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
