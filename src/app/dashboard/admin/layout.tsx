import Link from "next/link"
import { Home, Users, CreditCard, Dumbbell } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 p-6 hidden md:flex flex-col">
                <div className="mb-8 flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-red-600"></span>
                    <span className="text-xl font-bold text-white tracking-tighter">VISION</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link href="/dashboard/admin/memberships" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                        <Users size={18} /> Members
                    </Link>
                    <Link href="/dashboard/admin/trainers" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                        <Dumbbell size={18} /> Trainers
                    </Link>
                    <Link href="/dashboard/admin/billing" className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
                        <CreditCard size={18} /> Billing
                    </Link>
                </nav>

                <div className="border-t border-zinc-900 pt-4">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
