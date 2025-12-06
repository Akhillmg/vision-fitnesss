import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'trainer@test.com' } })
    console.log('User:', user)
    if (user) {
        const match = await bcrypt.compare('password123', user.password)
        console.log('Match:', match)
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
