"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false) // Assuming React is available
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message) // Placeholder for toast
            setLoading(false)
        } else {
            // Success - Middleware will handle redirection based on role/metadata
            router.refresh()
            router.push("/")
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black p-4">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tighter text-white">
                        <span className="text-[var(--color-primary)]">VISION</span> FITNESS
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access the gym portal
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus-visible:ring-red-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus-visible:ring-red-600"
                            />
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-xs text-zinc-500 hover:text-red-500">Forgot password?</a>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-[var(--color-primary)] hover:bg-red-700 font-bold uppercase tracking-wide text-white"
                            disabled={loading}
                        >
                            {loading ? "AUTHENTICATING..." : "ENTER GYM"}
                        </Button>
                        <div className="text-center text-xs text-zinc-500">
                            Don't have an account? <span className="text-white hover:underline cursor-pointer" onClick={() => router.push('/register')}>Join Now</span>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
