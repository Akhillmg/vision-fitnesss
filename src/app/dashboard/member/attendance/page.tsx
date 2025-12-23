
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckInButton } from "@/components/attendance/check-in-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function MemberAttendancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect("/login")

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Attendance</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Daily Check-in</CardTitle>
                        <CardDescription>Mark your presence at the gym.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CheckInButton />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
