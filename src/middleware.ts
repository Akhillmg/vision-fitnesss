
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const url = request.nextUrl.clone();
    const path = url.pathname;

    const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
    const isPublicRoute = path === "/" || path.startsWith("/public") || path.startsWith("/setup-gym");
    const isOnboardingRoute = path.startsWith("/onboarding");

    // If NOT logged in
    if (!user) {
        if (!isPublicRoute && !isAuthRoute) {
            // Redirect to login
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
        return response;
    }

    // If LOGGED IN
    // If LOGGED IN
    if (isAuthRoute) {
        // Redirect to dashboard based on role (default to member home if unknown)
        // We need to fetch the role from metadata
        const role = user.user_metadata?.role || "MEMBER";
        if (role === "ADMIN") url.pathname = "/dashboard/admin/dashboard";
        else if (role === "TRAINER") url.pathname = "/dashboard/trainer/dashboard";
        else url.pathname = "/dashboard/member/home";

        return NextResponse.redirect(url);
    }

    // Role Definition
    const userRole = user.user_metadata?.role;

    // Check if account is disabled (Need to fetch from DB or store in metadata)
    // For now assuming active. If we want to check DB, we should sync 'status' to metadata in admin_manage_user.

    if (!userRole && !isOnboardingRoute) {
        url.pathname = "/onboarding/role-selection";
        return NextResponse.redirect(url);
    }

    if (isOnboardingRoute && userRole) {
        url.pathname = "/dashboard"; // Central redirect hub
        return NextResponse.redirect(url);
    }

    if (path.startsWith("/dashboard")) {
        // Allow access to /dashboard (we will create this page to handle redirects)
        // Or handle it here:
        if (path === "/dashboard") {
            if (userRole === "ADMIN") url.pathname = "/dashboard/admin/dashboard";
            else if (userRole === "TRAINER") url.pathname = "/dashboard/trainer/dashboard";
            else url.pathname = "/dashboard/member/home";
            return NextResponse.redirect(url);
        }
    }

    // Strict RBAC
    if (userRole === 'MEMBER' && (path.startsWith('/dashboard/admin') || path.startsWith('/dashboard/trainer'))) {
        url.pathname = "/dashboard/member/home";
        return NextResponse.redirect(url);
    }
    if (userRole === 'TRAINER' && (path.startsWith('/dashboard/admin') || path.startsWith('/dashboard/member'))) {
        url.pathname = "/dashboard/trainer/dashboard";
        return NextResponse.redirect(url);
    }
    if (userRole === 'ADMIN' && (path.startsWith('/dashboard/member') || path.startsWith('/dashboard/trainer'))) {
        // Admin might want to see Member view? For now strict.
        url.pathname = "/dashboard/admin/dashboard";
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
