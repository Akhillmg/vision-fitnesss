import { getCommunityFeedAction } from "@/actions/community";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Activity } from "lucide-react";

export async function ActivityFeed() {
    const feed = await getCommunityFeedAction();

    return (
        <Card className="bg-zinc-900 border-zinc-800 h-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Live Feed
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {feed.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">No recent activity. Be the first!</div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {feed.map((log: any) => (
                            <div key={log.log_id} className="p-4 flex gap-3 hover:bg-zinc-800/50 transition-colors">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-indigo-900/50 text-indigo-300 font-bold">
                                        {log.full_name?.substring(0, 1).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-zinc-300">
                                        <span className="font-bold text-white">{log.full_name}</span> just finished
                                        <span className="text-indigo-400 font-medium"> {log.workout_name}</span>
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                                            <Dumbbell className="w-3 h-3" />
                                            {(log.volume_kg / 1000).toFixed(1)}k kg Volume
                                        </span>
                                        <span className="text-xs text-zinc-600">
                                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
