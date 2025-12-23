"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    gymCode: z.string().min(3),
})

export async function registerUser(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validatedFields = RegisterSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { name, email, password, gymCode: inputCode } = validatedFields.data

    // Search for a gym that matches ANY of the code columns
    const gym = await prisma.gym.findFirst({
        where: {
            OR: [
                { code: inputCode },
                { adminCode: inputCode },
                { trainerCode: inputCode }
            ]
        }
    })

    if (!gym) {
        return { error: "Invalid Access Code" }
    }

    let role = "MEMBER"
    if (gym.adminCode === inputCode) {
        role = "ADMIN"
    } else if (gym.trainerCode === inputCode) {
        role = "TRAINER"
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { error: "Email already in use" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            gymId: gym.id,
            role: role
        }
    })

    // If Trainer, create empty TrainerProfile
    if (role === "TRAINER") {
        await prisma.trainerProfile.create({
            data: {
                userId: user.id,
                gymId: gym.id,
                bio: "New Trainer",
                specialties: "General Fitness"
            }
        })
    }

    return { success: "Account created! Please login." }
}
