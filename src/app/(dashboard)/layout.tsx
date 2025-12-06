import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { auth } from "@/auth-helper"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session) redirect('/login')

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Sidebar userRole={(session.user as any)?.role} />
            <Header userName={session.user?.name} />
            <main className="md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
