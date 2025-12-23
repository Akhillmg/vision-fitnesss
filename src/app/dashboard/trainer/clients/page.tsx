import { getMyClients } from "@/actions/trainer-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell } from "lucide-react"

export default async function TrainerClientsPage() {
    const clients = await getMyClients()

    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-6">
            <h1 className="text-3xl font-bold">My Assigned Members</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clients.length > 0 ? (
                    clients.map((client) => (
                        <Card key={client.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{client.full_name || "Unnamed"}</h3>
                                        <p className="text-sm text-zinc-400">{client.email}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs ${client.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {client.status?.toUpperCase() || "UNKNOWN"}
                                    </div>
                                </div>

                                <div className="text-sm text-zinc-500 mb-4">
                                    Assigned: {new Date(client.assigned_at).toLocaleDateString()}
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white">
                                        View Profile
                                    </Button>
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                        <Dumbbell size={16} className="mr-2" />
                                        Assign Plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center text-zinc-500 p-8 border border-dashed border-zinc-800 rounded-xl">
                        No clients assigned to you yet.
                    </div>
                )}
            </div>
        </div>
    )
}
