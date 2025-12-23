import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const gymCode = 'IRON-2025'

    // Create Gym
    const gym = await prisma.gym.upsert({
        where: { code: gymCode },
        update: {},
        create: {
            name: 'Vision Fitness',
            code: 'VISION-MEMBER',        // Member Code
            adminCode: 'VISION-ADMIN',      // Admin Code
            trainerCode: 'VISION-TRAINER',  // Trainer Code
            address: '123 Muscle Ave, Lift City',
            logo: '/logo.png'
        }
    })

    console.log({ gym })

    // Create Admin
    const adminEmail = 'admin@ironforge.com'
    const adminPwd = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            name: 'Gym Owner',
            email: adminEmail,
            password: adminPwd,
            role: 'ADMIN',
            gymId: gym.id
        }
    })
    console.log({ admin })

    // Create Trainer
    const trainerEmail = 'coach@ironforge.com'
    const trainerPwd = await bcrypt.hash('coach123', 10)

    const trainer = await prisma.user.upsert({
        where: { email: trainerEmail },
        update: {},
        create: {
            name: 'Coach Rockstar',
            email: trainerEmail,
            password: trainerPwd,
            role: 'TRAINER',
            gymId: gym.id
        }
    })

    // Link Trainer Profile
    await prisma.trainerProfile.upsert({
        where: { userId: trainer.id },
        update: {},
        create: {
            userId: trainer.id,
            gymId: gym.id,
            bio: 'Strength & Conditioning Expert',
            specialties: 'Powerlifting, HIIT'
        }
    })

    console.log({ trainer })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
