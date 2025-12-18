
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const gymCode = 'VISION'

    const existingGym = await prisma.gym.findUnique({
        where: { code: gymCode }
    })

    if (existingGym) {
        console.log(`Gym with code ${gymCode} already exists.`)
        return
    }

    const gym = await prisma.gym.create({
        data: {
            name: 'Vision Fitness',
            code: gymCode,
            address: '123 Fitness Blvd',
        }
    })

    console.log(`Created gym: ${gym.name} (Code: ${gym.code})`)
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
