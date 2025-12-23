import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreateMembershipForm } from "./create-membership-form"

export default async function AdminMembershipsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect("/login")

    // Fetch users for the dropdown
    const { data: users } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'MEMBER')

    return (
        <div className="space-y-6 pt-6 p-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Manage Memberships</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Assign New Membership</CardTitle>
                        <CardDescription>Create or renew a plan for a member manually.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateMembershipForm users={users || []} />
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-zinc-500 text-sm">
                            Recently added memberships will appear here.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
