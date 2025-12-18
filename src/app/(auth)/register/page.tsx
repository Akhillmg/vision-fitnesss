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
    const gymCodeParam = searchParams.get('gymCode')

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await registerUser(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push("/login")
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
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Gym Code</label>
                        <Input
                            name="gymCode"
                            defaultValue={gymCodeParam || ""}
                            readOnly={!!gymCodeParam}
                            className={gymCodeParam ? "bg-zinc-800 text-zinc-400" : ""}
                            placeholder="GYM-XXXX"
                            required
                        />
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
