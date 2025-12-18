import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password, gymCode } = await req.json();

        if (!email || !password || !name || !gymCode) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        const gym = await prisma.gym.findUnique({ where: { code: gymCode } })

        if (!gym) {
            return NextResponse.json({ message: 'Invalid Gym Code' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                gymId: gym.id,
                role: "MEMBER"
            }
        });

        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
    }
}
