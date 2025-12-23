"use server"

import { prisma } from "@/lib/prisma"

export async function verifyGymCode(code: string) {
    if (!code || code.length < 3) return { error: "Invalid code format" }

    try {
        const gym = await prisma.gym.findFirst({
            where: {
                OR: [
                    { code: code },
                    { adminCode: code },
                    { trainerCode: code }
                ]
            },
            select: { name: true }
        })

        if (gym) {
            return { success: true, gymName: gym.name }
        } else {
            return { error: "Gym code not found" }
        }
    } catch (e) {
        console.error(e)
        // If DB schema mismatch (e.g. migration failed), fallback to legacy check
        // This is a resilience fallback
        try {
            const legacyGym = await prisma.gym.findUnique({
                where: { code: code }
            })
            if (legacyGym) return { success: true, gymName: legacyGym.name }
        } catch (e2) { }

        return { error: "Verification failed. Please try again." }
    }
}
