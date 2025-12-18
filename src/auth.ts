import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

export const config = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                gymCode: { label: "Gym Code", type: "text" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string
                const password = credentials.password as string

                // 1. Verify Gym Code if provided (for registration logic mainly, but here we assume login)
                // For login, we just check email/pass, but we must ensure user is active.

                const user = await prisma.user.findUnique({
                    where: { email },
                    include: { gym: true }
                });

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    gymId: user.gymId
                };
            }
        })
    ],
    callbacks: {
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role || "MEMBER"
                token.id = user.id || ""
                token.gymId = user.gymId || ""
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.user.gymId = token.gymId;
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: { strategy: "jwt" }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
