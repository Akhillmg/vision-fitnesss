"use server";

import { createClient } from "@/lib/supabase/server";

export async function getLeaderboardAction() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("view_leaderboard_volume")
        .select("*")
        .limit(10);

    return data || [];
}

export async function getCommunityFeedAction() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("view_community_feed")
        .select("*")
        .limit(20);

    return data || [];
}

export async function getUserStreakAction(userId?: string) {
    // Quick mock of streak logic since we don't have a robust daily logs table to query easily yet
    // In a real app, we'd query "consecutive days with logs"

    // For now, return a random number or simple count of logs in last 7 days
    const supabase = await createClient();
    const targetId = userId || (await supabase.auth.getUser()).data.user?.id;

    if (!targetId) return 0;

    const { count } = await supabase
        .from("workout_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", targetId)
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

    return count || 0;
}
