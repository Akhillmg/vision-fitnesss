"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateAdminPassword } from "@/actions/admin-settings"

export default function AdminSettingsPage() {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleUpdate = async () => {
        if (!password) return
        setLoading(true)
        setMessage(null)

        try {
            const result = await updateAdminPassword(password)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: "Admin password updated successfully." })
                setPassword("")
            }
        } catch (e) {
            setMessage({ type: 'error', text: "An error occurred" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-white">Admin Settings</h1>

            <Card className="max-w-md bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Change Admin Access Password</CardTitle>
                    <CardDescription className="text-zinc-400">
                        This password is used for new Admins to verify their role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && (
                        <div className={`p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {message.text}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">New Password</label>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type new password..."
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                    </div>
                    <Button
                        onClick={handleUpdate}
                        disabled={loading || !password}
                        className="w-full bg-red-600 hover:bg-red-700"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </CardContent>
            </Card>

            <TrainerSettings />
        </div>
    )
}

function TrainerSettings() {
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const { updateTrainerPassword, getTrainerPassword } = require("@/actions/admin-settings")

    // Ideally load current password on mount? No, keep it hidden unless explicitly requested or just set new.
    // But user might want to see it. 
    // Implementation: Just update for now.

    const handleUpdate = async () => {
        if (!password) return
        setLoading(true)
        setMessage(null)

        try {
            const result = await updateTrainerPassword(password)
            if (result.error) {
                setMessage({ type: 'error', text: result.error })
            } else {
                setMessage({ type: 'success', text: "Trainer access key updated successfully." })
                setPassword("")
            }
        } catch (e) {
            setMessage({ type: 'error', text: "An error occurred" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-md bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">Trainer Access Key</CardTitle>
                <CardDescription className="text-zinc-400">
                    Share this key with new Trainers to verify their role.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {message && (
                    <div className={`p-2 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {message.text}
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">New Trainer Key</label>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type new key..."
                        className="bg-zinc-800 border-zinc-700 text-white"
                    />
                </div>
                <Button
                    onClick={handleUpdate}
                    disabled={loading || !password}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? "Updating..." : "Update Trainer Key"}
                </Button>
            </CardContent>
        </Card>
    )
}
