"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOutAction } from "@/lib/auth-actions"
import { useTransition } from "react"

export function LogoutButton({ variant = "ghost" }: { variant?: "ghost" | "default" | "outline" | "destructive" }) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            variant={variant}
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => signOutAction())}
            className="gap-3 w-full justify-start text-zinc-400 hover:text-white"
        >
            <LogOut size={18} />
            {isPending ? "Exiting..." : "Log Out"}
        </Button>
    )
}
