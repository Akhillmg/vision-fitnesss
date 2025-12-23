import { LogoutButton } from "@/components/logout-button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Settings, Bell, HelpCircle } from "lucide-react"

export default function TrainerProfilePage() {
    return (
        <div className="p-4 pt-8 bg-black min-h-screen text-white space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-0">
                    <div className="flex items-center gap-4 p-4 border-b border-zinc-800">
                        <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center">
                            <User size={32} className="text-zinc-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-white">Trainer Name</h2>
                            <p className="text-sm text-zinc-500">trainer@visionfitness.com</p>
                        </div>
                    </div>
                    <div className="p-2">
                        <MenuItem icon={Settings} label="Trainer Settings" />
                        <MenuItem icon={Bell} label="Notifications" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <LogoutButton variant="destructive" />
            </div>
        </div>
    )
}

function MenuItem({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex w-full items-center gap-3 p-3 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors">
            <Icon size={18} />
            {label}
        </button>
    )
}
