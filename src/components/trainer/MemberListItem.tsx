"use client"
import { useState } from "react"
import { assignTemplateAction } from "@/app/actions/trainer"
import { Loader2 } from "lucide-react"

export function MemberListItem({ member, templates }: { member: any, templates: any[] }) {
    const currentTemplateId = member.assignedTemplates[0]?.templateId || 'none'
    const [loading, setLoading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newVal = e.target.value
        setLoading(true)
        try {
            await assignTemplateAction(member.id, newVal)
        } catch (e) {
            alert('Failed to assign template')
        }
        setLoading(false)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-zinc-700 transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        {member.name[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{member.name}</h3>
                        <p className="text-sm text-zinc-400">{member.email}</p>
                    </div>
                </div>

                <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                    <span>Joined: {new Date(member.createdAt).toLocaleDateString()}</span>
                    <span>Last Active: {member.workoutSessions[0] ? new Date(member.workoutSessions[0].date).toLocaleDateString() : 'Never'}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                <label className="text-sm text-zinc-400 whitespace-nowrap">Program:</label>
                <div className="relative">
                    <select
                        value={currentTemplateId}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full md:w-48 appearance-none bg-black border border-zinc-800 rounded-lg p-3 pr-8 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors disabled:opacity-50"
                    >
                        <option value="none">No Program Assigned</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {loading && <div className="absolute right-3 top-3"><Loader2 size={16} className="animate-spin text-emerald-500" /></div>}
                </div>
            </div>
        </div>
    )
}
