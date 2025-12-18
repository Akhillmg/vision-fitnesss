import { auth, signOut } from "@/auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, CreditCard, Settings, User } from "lucide-react"

export default async function MemberProfilePage() {
    const session = await auth()
    const user = session?.user

    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Profile</h1>

            {/* User Card */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl text-white">
                        {user?.name?.[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                        <p className="text-sm text-zinc-400">{user?.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 uppercase tracking-wide">Premium Member</span>
                    </div>
                </CardContent>
            </Card>

            {/* Menu Options */}
            <div className="space-y-2">
                <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition mt-4">
                    <CardContent className="p-4 flex items-center gap-4">
                        <User size={20} className="text-zinc-400" />
                        <div className="flex-1">
                            <h3 className="text-white font-medium">Personal Details</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition">
                    <CardContent className="p-4 flex items-center gap-4">
                        <CreditCard size={20} className="text-zinc-400" />
                        <div className="flex-1">
                            <h3 className="text-white font-medium">Membership & Billing</h3>
                            <p className="text-xs text-zinc-500">Renews in 12 days</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 transition">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Settings size={20} className="text-zinc-400" />
                        <div className="flex-1">
                            <h3 className="text-white font-medium">App Settings</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <form action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
            }}>
                <Button variant="destructive" className="w-full mt-6" type="submit">
                    <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
            </form>
        </div>
    )
}
