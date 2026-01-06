import { getUserStreakAction } from "@/actions/community";
import { Flame } from "lucide-react";

export async function StreakBadge() {
    const streak = await getUserStreakAction();

    return (
        <div className="flex items-center gap-2 bg-orange-900/20 border border-orange-500/30 px-3 py-1.5 rounded-full">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-zinc-600'}`} />
            <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-400' : 'text-zinc-500'}`}>
                {streak} Day Streak
            </span>
        </div>
    );
}
