import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    const password = await bcrypt.hash('password123', 10)

    // Member
    const member = await prisma.user.upsert({
        where: { email: 'member@test.com' },
        update: {},
        create: {
            email: 'member@test.com',
            name: 'Alice Member',
            password,
            role: 'MEMBER'
        }
    })

    // Trainer
    const trainer = await prisma.user.upsert({
        where: { email: 'trainer@test.com' },
        update: {},
        create: {
            email: 'trainer@test.com',
            name: 'Bob Trainer',
            password,
            role: 'TRAINER'
        }
    })

    console.log({ member, trainer })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
