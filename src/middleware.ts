import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const role = req.auth?.user?.role

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register") || nextUrl.pathname.startsWith("/gym-check");
    const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/public");

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (role === 'ADMIN') return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
            if (role === 'TRAINER') return NextResponse.redirect(new URL("/trainer/dashboard", nextUrl));
            return NextResponse.redirect(new URL("/member/home", nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        return NextResponse.redirect(new URL(`/gym-check`, nextUrl));
    }

    // Role Protection
    if (role === 'MEMBER' && (nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/trainer'))) {
        return NextResponse.redirect(new URL("/member/home", nextUrl));
    }
    if (role === 'TRAINER' && (nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/member'))) {
        // Trainer can technically view Member profiles but not "member home". for now strict redirect.
        return NextResponse.redirect(new URL("/trainer/dashboard", nextUrl));
    }

    return null;
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
