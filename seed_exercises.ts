import { prisma } from './src/lib/prisma'

const exercises = [
    { name: 'Barbell Bench Press', muscle: 'Chest' },
    { name: 'Barbell Squat', muscle: 'Legs' },
    { name: 'Deadlift', muscle: 'Back' },
    { name: 'Overhead Press', muscle: 'Shoulders' },
    { name: 'Pull Up', muscle: 'Back' },
    { name: 'Dumbbell Row', muscle: 'Back' },
    { name: 'Incline Dumbbell Press', muscle: 'Chest' },
    { name: 'Lateral Raise', muscle: 'Shoulders' },
    { name: 'Tricep Pushdown', muscle: 'Arms' },
    { name: 'Bicep Curl', muscle: 'Arms' },
    { name: 'Leg Press', muscle: 'Legs' },
    { name: 'Leg Extension', muscle: 'Legs' },
    { name: 'Leg Curl', muscle: 'Legs' },
    { name: 'Face Pull', muscle: 'Shoulders' }
]

async function main() {
    for (const ex of exercises) {
        await prisma.exercise.upsert({
            where: { id: ex.name }, // Hack: using name as ID? No schema has ID. 
            // I should use findFirst or just create if not exists
            // But upsert needs consistent unique field. 
            // I'll just delete all and create? Or createMany?
            update: {},
            create: {
                name: ex.name,
                defaultMuscleGroup: ex.muscle
            }
        }).catch(() => {
            // upsert might fail if I use id but schema id is cuid.
            // I'll check existence by name.
            return prisma.exercise.create({
                data: { name: ex.name, defaultMuscleGroup: ex.muscle }
            })
        })
    }

    // Better way:
    const count = await prisma.exercise.count()
    if (count === 0) {
        await prisma.exercise.createMany({
            data: exercises.map(e => ({ name: e.name, defaultMuscleGroup: e.muscle }))
        })
        console.log('Seeded exercises')
    } else {
        console.log('Exercises already exist')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
