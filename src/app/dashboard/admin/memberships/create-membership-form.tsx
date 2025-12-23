"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createMembership } from "./actions"

interface User {
    id: string
    full_name: string | null
    email: string | null
}

export function CreateMembershipForm({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition()

    async function clientAction(formData: FormData) {
        startTransition(async () => {
            const result = await createMembership(formData)
            if (result?.error) {
                alert(result.error) // Simple alert for now, can be improved
            } else {
                // Success is handled by revalidatePath in action, maybe reset form?
                // For now, let's just alert success
                alert("Membership assigned successfully!")
            }
        })
    }

    return (
        <form action={clientAction} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Select Member</label>
                <select
                    name="userId"
                    required
                    defaultValue=""
                    className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                    <option value="" disabled>Select a member...</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.full_name || "Unnamed"} ({u.email})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Plan Name</label>
                <Input name="planName" placeholder="e.g. Gold Monthly" className="bg-zinc-950 border-zinc-800 text-white" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                    <Input name="price" type="number" placeholder="2000" className="bg-zinc-950 border-zinc-800 text-white" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Duration (Months)</label>
                    <select
                        name="durationMonths"
                        required
                        defaultValue="1"
                        className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">1 Year</option>
                    </select>
                </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                {isPending ? "Assigning..." : "Assign Membership"}
            </Button>
        </form>
    )
}
