
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, UserCheck } from "lucide-react"

export function CheckInButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "already">("idle")

    const handleCheckIn = async () => {
        setStatus("loading")
        try {
            const res = await fetch("/api/attendance/check-in", { method: "POST" })

            if (res.ok) {
                setStatus("success")
            } else if (res.status === 400) {
                setStatus("already")
            } else {
                setStatus("idle") // reset on error for now
            }
        } catch (e) {
            console.error(e)
            setStatus("idle")
        }
    }

    if (status === "success") {
        return (
            <Button disabled className="w-full bg-green-600/20 text-green-500 border-green-600/50 border hover:bg-green-600/20">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Checked In Today
            </Button>
        )
    }

    if (status === "already") {
        return (
            <Button disabled className="w-full bg-zinc-800 text-zinc-400 border-zinc-700 border">
                <UserCheck className="mr-2 h-4 w-4" /> Already Checked In
            </Button>
        )
    }

    return (
        <Button
            onClick={handleCheckIn}
            disabled={status === "loading"}
            className="w-full bg-red-600 hover:bg-red-700 transition-all font-bold tracking-wide"
        >
            {status === "loading" ? "CHECKING IN..." : "CHECK IN NOW"}
        </Button>
    )
}
