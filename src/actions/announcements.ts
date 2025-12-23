"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAnnouncement(data: { title: string, content: string, audience: 'ALL' | 'MEMBER' | 'TRAINER' }) {
    const supabase = await createClient()

    // Check Admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // We rely on RLS "Admins manage announcements" but good to check role if we wanted strictness in code 
    // (RLS catches it securely)

    const { error } = await supabase.from('announcements').insert({
        title: data.title,
        content: data.content,
        audience_role: data.audience,
        created_by: user.id
    })

    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin/announcements')
    revalidatePath('/dashboard/member/home')
    revalidatePath('/dashboard/member/dashboard') // Just in case
    return { success: true }
}

export async function deleteAnnouncement(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/dashboard/admin/announcements')
    return { success: true }
}

export async function getAnnouncements() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    return data || []
}
