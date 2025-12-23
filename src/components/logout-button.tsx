"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/actions/auth"
import { useTransition } from "react"

export function LogoutButton({ variant = "ghost" }: { variant?: "ghost" | "default" | "outline" | "destructive" }) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            variant={variant}
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => logout())}
            className="gap-2"
        >
            <LogOut size={16} />
            {isPending ? "Exiting..." : "Log Out"}
        </Button>
    )
}
