import { prisma } from "@/lib/prisma"
import { CreateTemplateForm } from "@/components/trainer/CreateTemplateForm"

export default async function NewTemplatePage() {
    const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } })
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Create Workout Program</h1>
            <p className="text-zinc-400 mb-8">Define the routine structure, days, and exercises.</p>
            <CreateTemplateForm exercises={exercises} />
        </div>
    )
}
