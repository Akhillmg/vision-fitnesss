"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signInAction } from "@/lib/auth-actions";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, action, pending] = useActionState(signInAction, initialState);

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
                <form action={action}>
                    <CardContent className="space-y-4">
                        {state?.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-2 rounded">
                                {state.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus-visible:ring-red-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="border-zinc-800 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus-visible:ring-red-600"
                            />
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-zinc-500 hover:text-red-500 cursor-pointer">Forgot password?</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700 font-bold uppercase tracking-wide text-white"
                            disabled={pending}
                        >
                            {pending ? "AUTHENTICATING..." : "ENTER GYM"}
                        </Button>
                        <div className="text-center text-xs text-zinc-500">
                            Don't have an account? <Link href="/register" className="text-white hover:underline">Join Now</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
