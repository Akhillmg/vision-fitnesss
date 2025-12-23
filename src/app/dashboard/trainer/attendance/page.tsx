import { getTrainerAttendance } from "@/actions/trainer-attendance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TrainerAttendancePage() {
    const attendanceLogs = await getTrainerAttendance()

    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-6">
            <h1 className="text-3xl font-bold">Client Attendance</h1>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Check-ins (My Clients)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceLogs.length > 0 ? (
                                    attendanceLogs.map((log) => {
                                        const date = new Date(log.check_in_time)
                                        return (
                                            <tr key={log.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    <div>{log.user_name}</div>
                                                    <div className="text-xs text-zinc-500">{log.user_email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-300">{date.toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-zinc-300">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                                            No check-ins found for your clients recently.
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
