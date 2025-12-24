"use server"

import { createClient } from "@/lib/supabase/server"

export async function getMembershipDetails() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const { data: membership, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle()

    if (error) {
        return { error: error.message }
    }

    return { membership }
}
