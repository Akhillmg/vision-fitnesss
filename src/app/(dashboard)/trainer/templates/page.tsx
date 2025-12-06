import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Users, Calendar } from "lucide-react"

export default async function TemplatesPage() {
    const templates = await prisma.workoutTemplate.findMany({
        include: { days: true, _count: { select: { assignedTemplates: true } } },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Workout Templates</h1>
                    <p className="text-zinc-400">Design training programs for your clients.</p>
                </div>
                <Link href="/trainer/templates/new" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/10">
                    <Plus size={20} />
                    Create New
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {templates.map(t => (
                    <div key={t.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-emerald-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                        </div>
                        <p className="text-zinc-400 mb-6 line-clamp-2">{t.description || 'No description provided.'}</p>

                        <div className="flex items-center gap-6 border-t border-zinc-800 pt-4">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Calendar size={16} />
                                <span className="text-sm font-medium text-white">{t.days.length} Days / Split</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Users size={16} />
                                <span className="text-sm font-medium text-white">{t._count.assignedTemplates} Users</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center p-16 text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    <p className="text-lg">No templates created yet.</p>
                </div>
            )}
        </div>
    )
}
