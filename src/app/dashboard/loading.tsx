import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                <p className="text-zinc-500 animate-pulse">Loading Vision Fitness...</p>
            </div>
        </div>
    )
}
