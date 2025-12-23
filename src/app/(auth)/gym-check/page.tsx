"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function GymCheckPage() {
    const router = useRouter()
    const [code, setCode] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { verifyGymCode } = await import("@/actions/verify-gym")
            const result = await verifyGymCode(code)

            if (result.success) {
                router.push(`/register?gymCode=${code}`)
            } else {
                alert(result.error || "Invalid Gym Code")
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white p-4">
            <div className="absolute inset-0 bg-[url('/gym-bg.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />

            <Card className="w-full max-w-md z-10 border-zinc-800 bg-zinc-950">
                <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                    </div>
                    <CardTitle className="text-2xl font-bold uppercase tracking-widest">Gym Access</CardTitle>
                    <CardDescription>Enter your Gym Code to proceed</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <Input
                            placeholder="GYM-XXXX-XXXX"
                            className="text-center text-lg uppercase tracking-widest font-mono border-zinc-700 focus:border-red-500"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold" disabled={loading}>
                            {loading ? "VERIFYING..." : "VERIFY CODE"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" className="text-zinc-500" onClick={() => router.push('/login')}>
                        I already have an account
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
