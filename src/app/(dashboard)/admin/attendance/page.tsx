
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminAttendancePage() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") return redirect("/")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkIns = await prisma.attendance.findMany({
        where: {
            gymId: session.user.gymId,
            date: today
        },
        include: {
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { checkInTime: 'desc' }
    })

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Today's Attendance</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Total Check-ins</CardTitle>
                        <Users className="h-4 w-4 text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{checkIns.length}</div>
                        <p className="text-xs text-zinc-400">Members active today</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Recent Check-ins</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {checkIns.length === 0 ? (
                            <p className="text-zinc-500 text-sm">No check-ins yet today.</p>
                        ) : (
                            checkIns.map((record) => (
                                <div key={record.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-white">{record.user.name}</p>
                                        <p className="text-xs text-zinc-500">{record.user.email}</p>
                                    </div>
                                    <div className="text-sm text-zinc-400 font-mono">
                                        {record.checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
