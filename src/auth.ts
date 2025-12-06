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
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) return null;

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
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
