import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl
    const user = req.auth?.user as any

    // Start with Trainer protection (stricter)
    if (pathname.startsWith('/trainer')) {
        if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.nextUrl))
        if (user?.role !== 'TRAINER') {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
        }
    }

    // Member routes
    const protectedRoots = ['/dashboard', '/workout', '/history', '/progress']
    const isProtected = protectedRoots.some(r => pathname.startsWith(r))

    if (isProtected) {
        if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/dashboard/:path*", "/trainer/:path*", "/workout/:path*", "/history/:path*", "/progress/:path*"],
}
