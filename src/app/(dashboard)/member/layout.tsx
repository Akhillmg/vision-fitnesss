import Link from "next/link"
import { Home, Dumbbell, Apple, LineChart, User } from "lucide-react"

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-black pb-20">
            <main className="flex-1">{children}</main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-900 bg-zinc-950/90 backdrop-blur-lg">
                <div className="flex items-center justify-around p-3">
                    <Link href="/member/home" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500 aria-[current=page]:text-red-500">
                        <Home size={24} />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link href="/member/workout" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <Dumbbell size={24} />
                        <span className="text-[10px] font-medium">Workout</span>
                    </Link>
                    <Link href="/member/diet" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <Apple size={24} />
                        <span className="text-[10px] font-medium">Diet</span>
                    </Link>
                    <Link href="/member/progress" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <LineChart size={24} />
                        <span className="text-[10px] font-medium">Progress</span>
                    </Link>
                    <Link href="/member/profile" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-red-500">
                        <User size={24} />
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
