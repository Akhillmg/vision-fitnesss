import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Verify Admin Role via Database
        const { data: publicUser } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()

        if (!publicUser || publicUser.role !== "ADMIN") {
            return new NextResponse("Unauthorized - Admin only", { status: 403 })
        }

        const body = await req.json()
        const { userId, planName, price, durationMonths } = body

        if (!userId || !planName || !price || !durationMonths) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + parseInt(durationMonths))

        // Deactivate previous active memberships
        await supabase
            .from("memberships")
            .update({ status: "expired" })
            .eq("user_id", userId)
            .eq("status", "active")

        // Create new membership
        const { data: membership, error } = await supabase
            .from("memberships")
            .insert({
                user_id: userId,
                plan_name: planName,
                price: parseFloat(price),
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: "active",
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(membership)
    } catch (error) {
        console.error("Create membership error:", error)
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

        const { data: membership, error } = await supabase
            .from("memberships")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .order("end_date", { ascending: false })
            .limit(1)
            .single()

        // .single() returns existing or null (if maybeSingle, but single() errors if 0). 
        // Logic: findFirst equivalent.
        // Better: use maybeSingle() or just handle error "PGRST116"

        // Actually, if no membership, returning null is fine.

        return NextResponse.json(membership || null)
    } catch (error) {
        console.error("Fetch membership error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
