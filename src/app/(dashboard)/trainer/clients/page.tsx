import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"

export default async function TrainerClientsPage({
    searchParams
}: {
    searchParams?: { q?: string }
}) {
    const session = await auth()
    if (!session?.user?.email) return redirect("/")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { gymId: true, role: true }
    })

    if (!user || user.role !== "TRAINER" || !user.gymId) {
        return redirect("/")
    }

    // Search query
    const query = searchParams?.q || ""

    // Fetch Clients
    const clients = await prisma.user.findMany({
        where: {
            gymId: user.gymId,
            role: "MEMBER",
            name: {
                contains: query
            }
        },
        include: {
            assignedTemplates: {
                where: { isActive: true },
                include: { template: true },
                take: 1
            }
        }
    })

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">My Clients</h1>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Add New</Button>
            </div>

            <form className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                    name="q"
                    placeholder="Search clients..."
                    className="pl-10 border-zinc-800 bg-zinc-900 text-white"
                    defaultValue={query}
                />
            </form>

            <div className="space-y-2">
                {clients.length > 0 ? (
                    clients.map(client => {
                        const activePlan = client.assignedTemplates[0]?.template.name || "No Plan Assigned"

                        return (
                            <Card key={client.id} className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                                            {client.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{client.name}</h3>
                                            <p className="text-xs text-zinc-500">{activePlan}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white">
                                        <MoreVertical size={16} />
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <p className="text-zinc-500 text-center py-4">No clients found.</p>
                )}
            </div>
        </div>
    )
}
