import { getMemberStats } from "@/actions/member-dashboard"
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
    // Auth handled by middleware
    // We can fetch user if needed, but for dashboard stats we probably just need the session user ID inside the action. Ditching fetching here.

    const stats = await getMemberStats()
    if (!stats) return null // handle error

    return (
        <div className="space-y-6 p-4 pt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
                        <span className="text-zinc-500 block text-sm font-medium tracking-normal normal-case mb-1">{getGreeting()},</span>
                        Member
                    </h1>
                </div>
                {/* Check In Button */}
                <form action={async () => {
                    "use server"
                    const { checkIn } = await import("@/actions/member-dashboard")
                    await checkIn()
                }}>
                    <button
                        disabled={stats.isCheckedIn}
                        className={`px-4 py-2 rounded-full font-bold text-sm ${stats.isCheckedIn ? 'bg-green-600 text-white cursor-default' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                    >
                        {stats.isCheckedIn ? "✅ Checked In" : "📍 Check In Now"}
                    </button>
                </form>
            </div>

            {/* Expiring / Payment Alerts */}
            {stats.pendingPayments > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex justify-between items-center">
                    <div className="text-yellow-500 text-sm">You have {stats.pendingPayments} pending payment(s).</div>
                    <a href="/dashboard/member/billing" className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">PAY NOW</a>
                </div>
            )}

            {!stats.membership && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex justify-between items-center">
                    <div className="text-red-500 text-sm">No active membership found.</div>
                    <a href="/dashboard/member/membership" className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">VIEW PLANS</a>
                </div>
            )}

            {/* Announcements */}
            {stats.announcements.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase">Announcements</h2>
                    {stats.announcements.map((ann: any) => (
                        <Card key={ann.id} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base text-white">{ann.title}</CardTitle>
                                <CardDescription className="text-xs">{new Date(ann.created_at).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-zinc-400">{ann.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Today's Workout */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-white">YOUR PLAN</h2>
                    <span className="text-xs font-medium text-zinc-500 uppercase">{stats.currentPlan ? "Active" : "None"}</span>
                </div>
                {stats.currentPlan ? (
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-white mb-1">{Array.isArray(stats.currentPlan) ? stats.currentPlan[0]?.name : stats.currentPlan.name}</h3>
                            <p className="text-sm text-zinc-400 mb-4">{Array.isArray(stats.currentPlan) ? stats.currentPlan[0]?.description : stats.currentPlan.description}</p>
                            <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 font-bold uppercase" asChild>
                                <a href="/dashboard/member/workout">View Details</a>
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-sm">
                        No workout plan assigned yet. Ask your trainer!
                    </div>
                )}
            </div>

            {/* Membership Info */}
            {stats.membership && (
                <Card className="bg-zinc-900 border-zinc-800 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs text-zinc-500 uppercase block mb-1">Active Membership</span>
                            <span className="text-lg font-bold text-white">{Array.isArray(stats.membership.plan) ? stats.membership.plan[0]?.name : stats.membership.plan?.name}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-zinc-500 uppercase block mb-1">Valid Until</span>
                            <span className="text-sm font-bold text-white">{new Date(stats.membership.end_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
