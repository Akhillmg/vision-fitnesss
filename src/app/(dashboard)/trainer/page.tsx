import Link from "next/link"
import { Users, ClipboardList } from "lucide-react"
import { auth } from "@/auth-helper"
import { redirect } from "next/navigation"

export default async function TrainerDashboard() {
    const session = await auth()
    if ((session?.user as any)?.role !== 'TRAINER') {
        redirect('/dashboard')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Trainer Portal</h1>
                <p className="text-zinc-400">Welcome back. Manage your training business here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/trainer/members" className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-800 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="mb-6 text-emerald-500 bg-emerald-500/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Manage Clients</h3>
                        <p className="text-zinc-400 leading-relaxed">View all members, track their last activity, and assign personalized workout plans.</p>
                    </div>
                </Link>

                <Link href="/trainer/templates" className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ClipboardList size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="mb-6 text-blue-500 bg-blue-500/10 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform">
                            <ClipboardList size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Workout Templates</h3>
                        <p className="text-zinc-400 leading-relaxed">Design reusable workout splits, add exercises, and configure default sets/reps.</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
