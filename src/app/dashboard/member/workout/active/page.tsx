import { redirect } from "next/navigation";
import { ActiveLogger } from "@/components/workout/active-logger";
import { startWorkoutAction } from "@/actions/workout";

export default async function ActiveWorkoutPage() {
    // Start or resume workout on page load
    const result = await startWorkoutAction("Quick Workout");

    if (result.error || !result.workoutId) {
        // Handle error gracefully
        return (
            <div className="p-8 text-center text-red-500">
                Failed to initialize workout session. Please try again.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <ActiveLogger
                workoutId={result.workoutId}
                initialName={result.resumed ? "Resuming Workout..." : "New Workout"}
            />
        </div>
    );
}
