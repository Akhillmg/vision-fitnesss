import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBillingRecord } from "./actions"

export default async function AdminBillingPage() {
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Billing & Payments</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Record New Payment</CardTitle>
                        <CardDescription>Manually log cash, UPI, or card payments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createBillingRecord} className="space-y-4">
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
                                <label className="text-sm font-medium text-zinc-300">Amount (₹)</label>
                                <Input name="amount" type="number" placeholder="2000" className="bg-zinc-950 border-zinc-800 text-white" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Payment Method</label>
                                <select name="method" required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                                    <option value="" disabled selected>Select method...</option>
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Notes (Optional)</label>
                                <Textarea name="note" placeholder="e.g. November dues paid via GPay" className="bg-zinc-950 border-zinc-800 text-white" />
                            </div>

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                                Record Payment
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-zinc-500 text-sm">
                            Recent transactions will appear here.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
