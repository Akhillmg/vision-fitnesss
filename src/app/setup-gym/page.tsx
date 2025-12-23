
import { createClient } from "@/lib/supabase/server"

export default async function SetupGymPage() {
    const supabase = await createClient()

    // 1. Try to find the gym
    const { data: existing, error: findError } = await supabase
        .from("Gym")
        .select("*")
        .eq("code", "VISION")
        .single()

    if (existing) {
        return (
            <div className="p-10 text-white">
                <h1>By Gym Found!</h1>
                <pre>{JSON.stringify(existing, null, 2)}</pre>
            </div>
        )
    }

    if (findError) {
        console.error("Find Error:", findError)
    }

    // 2. If not found, Create it
    const { data: created, error: createError } = await supabase
        .from("Gym")
        .insert({
            name: "Vision Fitness",
            code: "VISION",
            adminCode: "ADMIN123",
            trainerCode: "TRAINER123",
            address: "Main Street",
            updatedAt: new Date().toISOString()
        })
        .select()
        .single()

    if (createError) {
        return (
            <div className="p-10 text-red-500">
                <h1>Error Creating Gym</h1>
                <pre>{JSON.stringify(createError, null, 2)}</pre>
            </div>
        )
    }

    return (
        <div className="p-10 text-green-500">
            <h1>Gym Created Successfully</h1>
            <pre>{JSON.stringify(created, null, 2)}</pre>
        </div>
    )
}
