import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, MoreHorizontal, Plus, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateMembershipForm } from "./create-membership-form"
import { getMembers } from "./actions"

export default async function AdminMembershipsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect("/login")

    const members = await getMembers()

    // Fetch users for the dropdown only (kept from old code for compatibility with CreateForm if needed)
    // Actually getMembers() returns what we used to call 'users' but with more info.
    // For the form, we might need a simpler list or just pass 'members'. 
    // Let's assume CreateMembershipForm takes 'users' prop which matches the shape roughly or we map it.

    return (
        <div className="space-y-6 pt-6 p-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Members</h1>
                    <p className="text-zinc-500 mt-2">Manage gym members and their subscriptions</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                    <Plus size={18} /> New Member
                </Button>
            </div>

            {/* List of Members */}
            <Card className="bg-zinc-950 border-zinc-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">All Members ({members.length})</CardTitle>
                            <CardDescription>Overview of all registered members</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search by ID or Name..."
                                className="pl-9 bg-zinc-900 border-zinc-800 text-white focus:ring-red-600"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">ID</TableHead>
                                <TableHead className="text-zinc-400">Member</TableHead>
                                <TableHead className="text-zinc-400">Current Plan</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400">Expiries</TableHead>
                                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.length === 0 ? (
                                <TableRow className="border-zinc-800">
                                    <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                        No members found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member: any) => (
                                    <TableRow key={member.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                        <TableCell>
                                            <div className="flex items-center gap-2 group cursor-pointer" title="Click to select ID">
                                                <code className="bg-zinc-900 px-1 py-0.5 rounded text-xs text-zinc-500 font-mono select-all">
                                                    {member.id.split('-')[0]}...
                                                </code>
                                                <Copy size={12} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{member.full_name || "Unknown"}</p>
                                                    <p className="text-sm text-zinc-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">
                                            {member.active_membership?.plan_name || "No Active Plan"}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${member.active_membership ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-zinc-400'}
                                            `}>
                                                {member.active_membership ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-zinc-400 text-sm">
                                            {member.active_membership?.end_date
                                                ? new Date(member.active_membership.end_date).toLocaleDateString()
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-400">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white" align="end">
                                                    <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">Manage Plan</DropdownMenuItem>
                                                    <DropdownMenuItem className="hover:bg-zinc-800 text-red-400 cursor-pointer">Remove Member</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Legacy Form Access (Perhaps keep in a dialog or separate tab if needed, but for now focusing on list as requested) */}
            <div className="grid gap-6 md:grid-cols-1">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Assign Membership</CardTitle>
                        <CardDescription>Manually assign a plan to a member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateMembershipForm users={members} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
