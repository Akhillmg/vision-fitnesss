import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const code = 'IRON-2025'
    let gym = await prisma.gym.findUnique({ where: { code } })

    if (!gym) {
        console.log("Gym not found, creating...")
        gym = await prisma.gym.create({
            data: {
                name: 'Iron Forge Gym',
                code: code,
                address: '123 Muscle Ave',
                logo: 'https://example.com/logo.png'
            }
        })
        console.log("Gym created:", gym.id)
    } else {
        console.log("Gym exists:", gym.id)
    }
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
