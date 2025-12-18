
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function MemberBillingPage() {
    const session = await auth()
    if (!session?.user?.id) return redirect("/")

    const history = await prisma.billing.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' }
    })

    return (
        <div className="space-y-6 pt-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Payment History</h1>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-zinc-500 text-sm">No payment history available.</CardTitle>
                        </CardHeader>
                    </Card>
                ) : (
                    history.map((record) => (
                        <Card key={record.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold text-lg">₹ {record.amount}</p>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{record.method}</p>
                                    {record.note && <p className="text-xs text-zinc-400 mt-1 italic">"{record.note}"</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-300">{record.date.toLocaleDateString()}</p>
                                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded inline-block mt-1">PAID</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
