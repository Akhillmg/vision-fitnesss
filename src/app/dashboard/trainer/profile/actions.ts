"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfile(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, gymId: true }
    })

    if (!user || !user.gymId) throw new Error("Unauthorized")

    const bio = formData.get("bio") as string
    const specialties = formData.get("specialties") as string

    await prisma.trainerProfile.upsert({
        where: { userId: user.id },
        update: {
            bio,
            specialties
        },
        create: {
            userId: user.id,
            gymId: user.gymId,
            bio,
            specialties
        }
    })

    revalidatePath("/trainer/profile")
}
