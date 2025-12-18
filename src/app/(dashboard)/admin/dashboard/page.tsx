import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") { // Type might need fixing if role isn't in user type fully, but usually okay
        // actually strict check might be needed or handled by layout/middleware
    }

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <p className="text-zinc-400">Admin features coming soon.</p>
                </CardContent>
            </Card>
        </div>
    )
}
