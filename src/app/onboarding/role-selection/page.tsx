"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { assignRoleAction } from "@/lib/auth-actions";
import { Check, Shield, Dumbbell, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = {
    error: "",
};

export default function RoleSelectionPage() {
    const [selectedRole, setSelectedRole] = useState<"MEMBER" | "TRAINER" | "ADMIN" | null>(null);
    const [state, action, pending] = useActionState(assignRoleAction, initialState);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black p-4">
            <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white">Select Your Role</CardTitle>
                    <CardDescription>Choose how you want to use Vision Fitness</CardDescription>
                </CardHeader>

                <form action={action}>
                    <input type="hidden" name="role" value={selectedRole || ""} />

                    <CardContent className="space-y-6">
                        {state?.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
                                {state.error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* MEMBER */}
                            <div
                                onClick={() => setSelectedRole("MEMBER")}
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-zinc-900",
                                    selectedRole === "MEMBER" ? "border-red-600 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-zinc-900 rounded-full text-white">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Member</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Track workouts & attendance</p>
                                    </div>
                                </div>
                            </div>

                            {/* TRAINER */}
                            <div
                                onClick={() => setSelectedRole("TRAINER")}
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-zinc-900",
                                    selectedRole === "TRAINER" ? "border-red-600 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-zinc-900 rounded-full text-white">
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Trainer</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Manage clients & plans</p>
                                    </div>
                                </div>
                            </div>

                            {/* ADMIN */}
                            <div
                                onClick={() => setSelectedRole("ADMIN")}
                                className={cn(
                                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-zinc-900",
                                    selectedRole === "ADMIN" ? "border-red-600 bg-zinc-900" : "border-zinc-800 bg-zinc-950"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-zinc-900 rounded-full text-white">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Admin</h3>
                                        <p className="text-xs text-zinc-400 mt-1">Manage gym & payments</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedRole === "ADMIN" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm text-zinc-400">Admin Secret Code</label>
                                <Input name="code" type="password" placeholder="Enter Admin Code provided by system owner" className="bg-zinc-900 border-zinc-700" />
                            </div>
                        )}

                        {selectedRole === "TRAINER" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm text-zinc-400">Trainer Access Code</label>
                                <Input name="code" type="password" placeholder="Enter Trainer Code provided by Admin" className="bg-zinc-900 border-zinc-700" />
                            </div>
                        )}

                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={!selectedRole || pending}
                        >
                            {pending ? "ASSIGNING ROLE..." : "CONFIRM SELECTION"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
