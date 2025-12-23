import Link from "next/link"
import { Users, Dumbbell, Calendar, MessageSquare, User } from "lucide-react"

export default function TrainerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-black pb-20">
            <main className="flex-1">{children}</main>

            {/* Bottom Navigation for Trainer */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-900 bg-zinc-950/90 backdrop-blur-lg">
                <div className="flex items-center justify-around p-3">
                    <Link href="/dashboard/trainer/dashboard" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500 aria-[current=page]:text-red-500">
                        <Calendar size={24} />
                        <span className="text-[10px] font-medium">Dash</span>
                    </Link>
                    <Link href="/dashboard/trainer/clients" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <Users size={24} />
                        <span className="text-[10px] font-medium">Clients</span>
                    </Link>
                    <Link href="/dashboard/trainer/programs" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <Dumbbell size={24} />
                        <span className="text-[10px] font-medium">Plans</span>
                    </Link>
                    <Link href="/dashboard/trainer/attendance" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <MessageSquare size={24} />
                        <span className="text-[10px] font-medium">Attend</span>
                    </Link>
                    <Link href="/dashboard/trainer/profile" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <User size={24} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
