"use client";

import { useState } from "react";
import { GoalForm } from "@/components/ai-coach/goal-form";
import { PlanDisplay } from "@/components/ai-coach/plan-display";
import { AICoachInput, AIPlanResult } from "@/actions/ai-coach";

export default function AiCoachPage() {
    const [generatedPlan, setGeneratedPlan] = useState<AIPlanResult | null>(null);
    const [inputData, setInputData] = useState<AICoachInput | null>(null);

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24 md:p-8 md:max-w-4xl md:mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                    Vision AI Coach
                </h1>
                <p className="text-zinc-500 mt-2">
                    Your personal intelligent fitness architect.
                </p>
            </header>

            <main>
                {!generatedPlan ? (
                    <GoalForm
                        onPlanGenerated={(plan, input) => {
                            setGeneratedPlan(plan);
                            setInputData(input);
                        }}
                    />
                ) : (
                    <PlanDisplay
                        plan={generatedPlan}
                        input={inputData!}
                        onReset={() => {
                            setGeneratedPlan(null);
                            setInputData(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
