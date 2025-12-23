import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        // Middleware usually handles this, but good to be safe
        // redirect("/login")
    }

    const { getAdminStats } = await import("@/actions/admin-dashboard")
    const stats = await getAdminStats()

    const cards = [
        { label: "Total Members", value: stats.memberCount, icon: "👥", color: "text-blue-500" },
        { label: "Today's Attendance", value: stats.attendanceCount, icon: "📍", color: "text-green-500" },
        { label: "Pending Payments", value: stats.pendingPaymentsCount, icon: "💰", color: "text-yellow-500" },
        { label: "Expiring Soon", value: stats.expiryCount, icon: "⚠️", color: "text-red-500" },
    ]

    const quickLinks = [
        { label: "Manage Members", href: "/dashboard/admin/memberships", icon: "busts_in_silhouette" },
        { label: "Trainers", href: "/dashboard/admin/trainers", icon: "id_button" },
        { label: "Payments", href: "/dashboard/admin/billing", icon: "credit_card" },
        { label: "Plans", href: "/dashboard/admin/plans", icon: "clipboard" },
        { label: "Broadcasts", href: "/dashboard/admin/announcements", icon: "loudspeaker" },
        { label: "Settings", href: "/dashboard/admin/settings", icon: "gear" },
    ]

    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">{card.label}</p>
                                <p className="text-3xl font-bold mt-1">{card.value}</p>
                            </div>
                            <div className={`text-4xl ${card.color}`}>{card.icon}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <h2 className="text-xl font-semibold text-zinc-300">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {quickLinks.map((link, i) => (
                    <a key={i} href={link.href} className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors gap-2 group">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🔗</span>
                        <span className="text-sm font-medium text-zinc-300">{link.label}</span>
                    </a>
                ))}
            </div>
        </div>
    )
}
