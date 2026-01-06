import { getLeaderboardAction } from "@/actions/community";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export async function Leaderboard() {
    const data = await getLeaderboardAction();

    return (
        <Card className="bg-zinc-900 border-zinc-800 h-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Lifters
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {data.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">No data yet.</div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {data.map((user: any, index: number) => (
                            <div key={user.user_id} className="flex items-center p-4 hover:bg-zinc-800/50 transition-colors">
                                <div className="w-8 text-center font-bold text-zinc-500 mr-2">
                                    {index === 0 ? <Medal className="w-5 h-5 text-yellow-400 mx-auto" /> :
                                        index === 1 ? <Medal className="w-5 h-5 text-zinc-400 mx-auto" /> :
                                            index === 2 ? <Medal className="w-5 h-5 text-amber-600 mx-auto" /> :
                                                `#${index + 1}`}
                                </div>
                                <Avatar className="h-8 w-8 mr-3 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-xs">
                                        {user.full_name?.substring(0, 2).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-white">{user.full_name}</div>
                                    <div className="text-xs text-zinc-500">{user.workouts_completed} workouts</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-mono font-bold text-indigo-400">
                                        {(user.total_volume_kg / 1000).toFixed(1)}k
                                    </div>
                                    <div className="text-[10px] text-zinc-600 uppercase">Volume (kg)</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
