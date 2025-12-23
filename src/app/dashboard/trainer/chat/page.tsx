import { Card, CardContent } from "@/components/ui/card"

export default function TrainerChatPage() {
    return (
        <div className="space-y-6 p-4 pt-8 bg-black min-h-screen">
            <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">Messages</h1>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-10 text-center text-zinc-500">
                    <p>Chat feature coming soon.</p>
                </CardContent>
            </Card>
        </div>
    )
}
