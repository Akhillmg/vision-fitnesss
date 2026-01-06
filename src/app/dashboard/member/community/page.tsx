import { Leaderboard } from "@/components/community/leaderboard";
import { ActivityFeed } from "@/components/community/feed";
import { StreakBadge } from "@/components/community/streak-badge";

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24 md:p-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                        Gym Community
                    </h1>
                    <p className="text-zinc-500">
                        Compete, share, and stay motivated.
                    </p>
                </div>
                <div>
                    <StreakBadge />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
                {/* Left Column: Leaderboard */}
                <div className="lg:col-span-1 h-full overflow-hidden">
                    <Leaderboard />
                </div>

                {/* Right Column: Feed */}
                <div className="lg:col-span-2 h-full overflow-hidden">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
