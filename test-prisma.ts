
import { prisma } from "@/lib/prisma"

async function main() {
    console.log('Testing prisma client...')
    if (!prisma.membership) {
        console.error('prisma.membership is undefined!')
        process.exit(1)
    }
    try {
        // Just allow it to be any for this test script if type is broken
        const memberships = await (prisma as any).membership.findMany({ take: 1 })
        console.log('Success:', memberships)
    } catch (e) {
        console.error('Error:', e)
    }
}

main()
