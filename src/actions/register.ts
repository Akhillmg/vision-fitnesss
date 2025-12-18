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

    const { name, email, password, gymCode } = validatedFields.data

    const gym = await prisma.gym.findUnique({
        where: { code: gymCode }
    })

    if (!gym) {
        return { error: "Invalid Gym Code" }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { error: "Email already in use" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            gymId: gym.id,
            role: "MEMBER"
        }
    })

    return { success: "Account created! Please login." }
}
