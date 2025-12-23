"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white p-4 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-bold">Something went wrong!</h2>
            <p className="text-zinc-400 max-w-md">{error.message || "An unexpected error occurred."}</p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
                <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700">Try Again</Button>
            </div>
        </div>
    )
}
