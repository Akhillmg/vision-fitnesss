"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/actions/register"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()


    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    // role is default empty/MEMBER, handled by Role Selection
                }
            }
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Supabase might require email confirmation.
            // If implicit, we can redirect.
            // Usually for MVP without email confirm:
            if (data.user) {
                // Check if session exists (auto-login)
                if (data.session) {
                    router.push("/onboarding/role-selection")
                } else {
                    setError("Please verify your email address before logging in.")
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
    }

    return (
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Join your gym community today</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-2 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Full Name</label>
                        <Input name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Email</label>
                        <Input name="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Password</label>
                        <Input name="password" type="password" required />
                    </div>

                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? "CREATING..." : "JOIN NOW"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default function RegisterPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-black p-4">
            <Suspense fallback={<div className="text-white">Loading form...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    )
}
