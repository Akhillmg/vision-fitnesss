import { prisma } from "@/lib/prisma"
import { MemberListItem } from "@/components/trainer/MemberListItem"

export default async function MembersPage() {
    const members = await prisma.user.findMany({
        where: { role: 'MEMBER' },
        include: {
            assignedTemplates: { where: { isActive: true }, include: { template: true } },
            workoutSessions: { orderBy: { date: 'desc' }, take: 1 } // Last workout
        },
        orderBy: { name: 'asc' }
    })

    // Only get templates created by trainers (or all?)
    // Prompt says "Trainer can create workout templates... Assign a workout template".
    // I will assume all templates are assignable.
    const templates = await prisma.workoutTemplate.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Client Management</h1>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-400">
                    Total Clients: <span className="text-white font-bold">{members.length}</span>
                </div>
            </div>

            <div className="grid gap-4">
                {members.map(m => (
                    <MemberListItem key={m.id} member={m} templates={templates} />
                ))}

                {members.length === 0 && (
                    <div className="text-center p-16 text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <p className="text-lg">No members found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
