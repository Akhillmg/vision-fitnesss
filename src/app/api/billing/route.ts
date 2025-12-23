import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Verify Admin Role
        const { data: publicUser } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()

        if (!publicUser || publicUser.role !== "ADMIN") {
            return new NextResponse("Unauthorized - Admin only", { status: 403 })
        }

        const body = await req.json()
        const { userId, amount, method, note } = body

        if (!userId || !amount || !method) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const { data: billing, error } = await supabase
            .from("billing")
            .insert({
                user_id: userId,
                amount: parseFloat(amount),
                method,
                note,
                date: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(billing)
    } catch (error) {
        console.error("Create billing error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { data: history, error } = await supabase
            .from("billing")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })

        if (error) throw error

        return NextResponse.json(history)
    } catch (error) {
        console.error("Fetch billing error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
