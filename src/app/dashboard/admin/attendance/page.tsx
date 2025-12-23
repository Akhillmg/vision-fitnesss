import { getAdminAttendance } from "@/actions/admin-attendance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminAttendancePage() {
    const attendanceLogs = await getAdminAttendance()

    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Attendance Logs</h1>
                <Button variant="outline" className="border-zinc-700 text-zinc-300">Export CSV</Button>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Check-ins (All Members)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3">Member</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceLogs.length > 0 ? (
                                    attendanceLogs.map((log) => {
                                        const date = new Date(log.check_in_time)
                                        return (
                                            <tr key={log.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                                <td className="px-6 py-4 font-medium text-white">{log.user_name}</td>
                                                <td className="px-6 py-4 text-zinc-400">{log.user_email}</td>
                                                <td className="px-6 py-4 text-zinc-300">{date.toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-zinc-300">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs text-green-500 bg-green-500/10 rounded">Present</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                            No attendance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
