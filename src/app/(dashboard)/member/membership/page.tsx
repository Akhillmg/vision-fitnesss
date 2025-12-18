import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function MemberMembershipPage() {
    const session = await auth()
    if (!session?.user?.id) return redirect("/")

    // Cast to any to bypass editor type sync issue (verified property exists at runtime)
    const memberships = await (prisma as any).membership.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    const activePlan = memberships.find((m: any) => m.status === 'active')

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">My Membership</h1>

            {activePlan ? (
                <Card className="bg-gradient-to-br from-red-900/50 to-zinc-900 border-red-500/30">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-white">{activePlan.planName}</CardTitle>
                                <CardDescription className="text-red-200">Active Plan</CardDescription>
                            </div>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30">
                                ACTIVE
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-zinc-400 text-sm">Start Date</p>
                                <p className="text-white font-medium">{activePlan.startDate.toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">End Date</p>
                                <p className="text-white font-medium">{activePlan.endDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Price Paid</p>
                            <p className="text-white font-medium">₹ {activePlan.price}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">No Active Plan</CardTitle>
                        <CardDescription>Please contact the admin to purchase a membership.</CardDescription>
                    </CardHeader>
                </Card>
            )}

            <div className="pt-8">
                <h2 className="text-xl font-bold text-white mb-4">History</h2>
                <div className="space-y-3">
                    {memberships.length === 0 ? (
                        <p className="text-zinc-500 text-sm">No membership history found.</p>
                    ) : (
                        memberships.map((m: any) => (
                            <div key={m.id} className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                                <div>
                                    <p className="text-white font-medium">{m.planName}</p>
                                    <p className="text-xs text-zinc-500">{m.startDate.toLocaleDateString()} - {m.endDate.toLocaleDateString()}</p>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs capitalize ${m.status === 'active' ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'
                                    }`}>
                                    {m.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
