"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { selectRole } from "@/actions/role-selection"
import { Dumbbell, Shield, User, Users } from "lucide-react"

export default function RoleSelectionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [authRole, setAuthRole] = useState<"ADMIN" | "TRAINER" | null>(null)
    const [code, setCode] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSelect = async (role: "ADMIN" | "TRAINER" | "MEMBER", accessCode?: string) => {
        setLoading(role)
        setError(null)

        try {
            const result = await selectRole(role, accessCode)
            if (result.error) {
                setError(result.error)
                setLoading(null)
            } else if (result.redirectPath) {
                // Force a hard navigation to ensure middleware is re-run and session updated if needed
                window.location.href = result.redirectPath
            } else {
                router.refresh()
                // Force hard reload or router refresh significantly to clear stale middleware cache
                // But router.refresh() is soft. window.location.href forces full server trip.
                window.location.href = "/"
            }
        } catch (e) {
            console.error(e)
            setError("Something went wrong")
            setLoading(null)
        }
    }

    if (authRole) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white">
                    <CardHeader>
                        <CardTitle>{authRole === "ADMIN" ? "Admin Access" : "Trainer Access"}</CardTitle>
                        <CardDescription>Enter your access code to verify your role.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">{authRole === "ADMIN" ? "Admin Password" : "Access Code"}</label>
                            <Input
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={authRole === "ADMIN" ? "Enter admin password..." : "Enter access code..."}
                                className="bg-zinc-900 border-zinc-700"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button variant="ghost" className="flex-1" onClick={() => { setAuthRole(null); setError(null); setCode(""); }}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            onClick={() => handleSelect(authRole, code)}
                            disabled={loading === authRole}
                        >
                            {loading === authRole ? "Verifying..." : "Verify"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Choose Your Role</h1>
                    <p className="text-zinc-400 text-lg">Select how you will use Vision Fitness</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* MEMBER CARD */}
                    <Card className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors cursor-pointer group relative overflow-hidden">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 text-white group-hover:bg-red-600 transition-colors">
                                <User size={24} />
                            </div>
                            <CardTitle className="text-white">Member</CardTitle>
                            <CardDescription>I want to train and track progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                                <li>Access workout tracking</li>
                                <li>View gym schedule</li>
                                <li>Manage membership</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-zinc-800 hover:bg-zinc-700 group-hover:bg-red-600 group-hover:hover:bg-red-700 text-white border-none"
                                onClick={() => handleSelect("MEMBER")}
                                disabled={loading === "MEMBER"}
                            >
                                {loading === "MEMBER" ? "Setting up..." : "Join as Member"}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* TRAINER CARD */}
                    <Card className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 text-white group-hover:bg-blue-600 transition-colors">
                                <Users size={24} />
                            </div>
                            <CardTitle className="text-white">Trainer</CardTitle>
                            <CardDescription>I am a certified trainer</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                                <li>Manage clients</li>
                                <li>Create workout plans</li>
                                <li>Track client progress</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-zinc-800 hover:bg-zinc-700 group-hover:bg-blue-600 group-hover:hover:bg-blue-700 text-white border-none"
                                onClick={() => setAuthRole("TRAINER")}
                            >
                                Trainer Access
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* ADMIN CARD */}
                    <Card className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 text-white group-hover:bg-amber-600 transition-colors">
                                <Shield size={24} />
                            </div>
                            <CardTitle className="text-white">Admin</CardTitle>
                            <CardDescription>I manage the facility</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                                <li>Full system control</li>
                                <li>Manage staff & members</li>
                                <li>Financial reports</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-zinc-800 hover:bg-zinc-700 group-hover:bg-amber-600 group-hover:hover:bg-amber-700 text-white border-none"
                                onClick={() => setAuthRole("ADMIN")}
                            >
                                Admin Access
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
