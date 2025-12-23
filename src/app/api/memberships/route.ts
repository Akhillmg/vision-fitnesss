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
            .from("User")
            .select("role, gymId")
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
            .from("Membership")
            .update({ status: "expired" })
            .eq("userId", userId)
            .eq("status", "active")

        // Create new membership
        const { data: membership, error } = await supabase
            .from("Membership")
            .insert({
                userId,
                gymId: publicUser.gymId,
                planName,
                price: parseFloat(price),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: "active",
                updatedAt: new Date().toISOString()
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

        // Get context from public user
        const { data: publicUser } = await supabase
            .from("User")
            .select("gymId")
            .eq("id", user.id)
            .single()

        if (!publicUser) return new NextResponse("User not found", { status: 404 })

        const { data: membership, error } = await supabase
            .from("Membership")
            .select("*")
            .eq("userId", user.id)
            .eq("status", "active")
            .eq("gymId", publicUser.gymId)
            .order("endDate", { ascending: false })
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
