"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, History, TrendingUp, Users, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react' // Client side signout
import { clsx } from 'clsx'

export function Sidebar({ userRole }: { userRole?: string }) {
    const pathname = usePathname()

    // Base links for everyone (Members)
    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/workout/today', label: 'Log Workout', icon: Dumbbell },
        { href: '/history', label: 'History', icon: History },
        { href: '/progress', label: 'Progress', icon: TrendingUp },
    ]

    // Trainer specific
    if (userRole === 'TRAINER') {
        links.push({ href: '/trainer', label: 'Trainer Area', icon: Users })
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-900 text-white hidden md:flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tighter text-emerald-500">Antigravity<span className="text-white">Fit</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map(link => {
                    const Icon = link.icon
                    const isActive = pathname.startsWith(link.href)
                    return (
                        <Link key={link.href} href={link.href} className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        )}>
                            <Icon size={20} />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-zinc-900">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    )
}
