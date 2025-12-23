import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "@/actions/announcements"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default async function AdminAnnouncementsPage() {
    const announcements = await getAnnouncements()

    return (
        <div className="p-8 bg-black min-h-screen text-white space-y-8">
            <h1 className="text-3xl font-bold">Announcements</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Create Form */}
                <Card className="bg-zinc-900 border-zinc-800 h-fit">
                    <CardHeader>
                        <CardTitle className="text-white">New Announcement</CardTitle>
                        <CardDescription>Send a message to members or trainers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async (formData: FormData) => {
                            "use server"
                            const title = formData.get("title") as string
                            const content = formData.get("content") as string
                            const audience = formData.get("audience") as 'ALL' | 'MEMBER' | 'TRAINER'

                            const { createAnnouncement } = await import("@/actions/announcements")
                            await createAnnouncement({ title, content, audience })
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                <input name="title" required className="w-full bg-black border border-zinc-700 rounded p-2 text-white" placeholder="e.g. Holiday Hours" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Message</label>
                                <textarea name="content" required rows={4} className="w-full bg-black border border-zinc-700 rounded p-2 text-white" placeholder="Type your message..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Audience</label>
                                <select name="audience" className="w-full bg-black border border-zinc-700 rounded p-2 text-white">
                                    <option value="ALL">Everyone (Broadcast)</option>
                                    <option value="MEMBER">Members Only</option>
                                    <option value="TRAINER">Trainers Only</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Send Announcement</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Recent Announcements</h2>
                    {announcements.length > 0 ? (
                        announcements.map((ann: any) => (
                            <Card key={ann.id} className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-base text-white">{ann.title}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {new Date(ann.created_at).toLocaleDateString()} • To: {ann.audience_role}
                                        </CardDescription>
                                    </div>
                                    <form action={async () => {
                                        "use server"
                                        const { deleteAnnouncement } = await import("@/actions/announcements")
                                        await deleteAnnouncement(ann.id)
                                    }}>
                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8">
                                            <Trash2 size={16} />
                                        </Button>
                                    </form>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-zinc-400 whitespace-pre-wrap">{ann.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-zinc-500 italic">No announcements sent yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
