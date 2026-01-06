"use client";

import { useState } from "react";
import { Loader2, Sparkles, Target, Calendar, Activity, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAIPlanAction, AICoachInput, AIPlanResult } from "@/actions/ai-coach";

interface GoalFormProps {
    onPlanGenerated: (plan: AIPlanResult, input: AICoachInput) => void;
}

export function GoalForm({ onPlanGenerated }: GoalFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<AICoachInput>({
        currentWeight: "",
        targetWeight: "",
        goal: "BUILD_MUSCLE",
        daysPerWeek: "3",
        activityLevel: "MODERATE",
        dietaryPreference: "NONE"
    });
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await generateAIPlanAction(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.plan) {
                onPlanGenerated(result.plan, formData);
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl">
            <CardHeader className="border-b border-zinc-800/50 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Vision AI Coach
                        </CardTitle>
                        <CardDescription className="text-zinc-400 mt-1">
                            Describe your goals, and let AI build your perfect routine.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Weight Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Current Weight (kg)</label>
                        <Input
                            type="number"
                            placeholder="70"
                            className="bg-zinc-950/50 border-zinc-800 focus:ring-indigo-500/50 h-12 text-lg"
                            value={formData.currentWeight}
                            onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Target Weight (kg)</label>
                        <Input
                            type="number"
                            placeholder="75"
                            className="bg-zinc-950/50 border-zinc-800 focus:ring-indigo-500/50 h-12 text-lg"
                            value={formData.targetWeight}
                            onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                        />
                    </div>
                </div>

                {/* Primary Goal */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                        <Target className="w-4 h-4" /> Primary Goal
                    </label>
                    <Select
                        value={formData.goal}
                        onValueChange={(val: any) => setFormData({ ...formData, goal: val })}
                    >
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12">
                            <SelectValue placeholder="Select Goal" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="LOSE_WEIGHT">Lose Weight & Burn Fat</SelectItem>
                            <SelectItem value="BUILD_MUSCLE">Build Muscle & Size</SelectItem>
                            <SelectItem value="STRENGTH">Increase Raw Strength</SelectItem>
                            <SelectItem value="MAINTAIN">Maintain & Tone</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                            <Calendar className="w-4 h-4" /> Frequency
                        </label>
                        <Select
                            value={formData.daysPerWeek}
                            onValueChange={(val) => setFormData({ ...formData, daysPerWeek: val })}
                        >
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="3">3 Days / Week</SelectItem>
                                <SelectItem value="4">4 Days / Week</SelectItem>
                                <SelectItem value="5">5 Days / Week</SelectItem>
                                <SelectItem value="6">6 Days / Week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                            <Activity className="w-4 h-4" /> Activity Level
                        </label>
                        <Select
                            value={formData.activityLevel}
                            onValueChange={(val: any) => setFormData({ ...formData, activityLevel: val })}
                        >
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="SEDENTARY">Sedentary (Office Job)</SelectItem>
                                <SelectItem value="MODERATE">Moderate (Active Job/Walks)</SelectItem>
                                <SelectItem value="ACTIVE">Active (Daily Exercise)</SelectItem>
                                <SelectItem value="ATHLETE">Athlete (Double Sessions)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Diet */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                        <Utensils className="w-4 h-4" /> Dietary Preference
                    </label>
                    <Select
                        value={formData.dietaryPreference}
                        onValueChange={(val: any) => setFormData({ ...formData, dietaryPreference: val })}
                    >
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800 h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="NONE">No Restrictions (Standard)</SelectItem>
                            <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                            <SelectItem value="VEGAN">Vegan</SelectItem>
                            <SelectItem value="KETO">Keto</SelectItem>
                            <SelectItem value="PALEO">Paleo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-md text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Biometrics...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-2 fill-current" />
                            Generate My Plan
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
