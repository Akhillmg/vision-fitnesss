"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUpAction } from "@/lib/auth-actions";
import Link from "next/link";

const initialState = {
    error: "",
    success: false,
};

export default function RegisterPage() {
    const [state, action, pending] = useActionState(signUpAction, initialState);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-950">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Join your gym community today</CardDescription>
                </CardHeader>
                <form action={action}>
                    <CardContent className="space-y-4">
                        {state?.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-2 rounded">
                                {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-2 rounded">
                                Account created! Redirecting...
                                {/* Ideally the action redirects, but effective handling here is good UX */}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Gym Code</label>
                            <Input name="gymCode" placeholder="Enter Gym Code" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Full Name</label>
                            <Input name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Email</label>
                            <Input name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Password</label>
                            <Input name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={pending}
                        >
                            {pending ? "CREATING..." : "JOIN NOW"}
                        </Button>
                        <p className="text-sm text-zinc-500 text-center">
                            Already have an account? <Link href="/login" className="text-white hover:underline">Sign In</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
