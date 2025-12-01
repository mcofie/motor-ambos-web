import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
// import { isAdminEmail } from "./lib/admin";

export async function middleware(req: NextRequest) {
    // Only guard /admin/**; see matcher below.
    const res = NextResponse.next();

    // Attach a server supabase client **for middleware**
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return req.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    // forward cookies set by Supabase to the response
                    res.cookies.set({ name, value, ...options });
                },
                remove(name, options) {
                    res.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    // Try to get a user quickly (no hanging in the client)
    const { error } = await supabase.auth.getUser();
    if (error) {
        // console.error("Auth error:", error);
    }

    // 3. Check for admin role if accessing /admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            const redirect = new URL("/login", req.url);
            redirect.searchParams.set("next", req.nextUrl.pathname);
            return NextResponse.redirect(redirect);
        }

        const email = user.email;

        // Simple check: is email in admin list?
        // In production, you'd probably check a `profiles.role` or similar.
        const admins = ['maxwellcofie@gmail.com', 'admin@motorambos.com'];
        if (!email || !admins.includes(email)) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    // If not an admin path, or if admin check passed, proceed.
    // If no user session, redirect to login (this part is implicitly handled by the admin check for /admin,
    // but for other paths, we might still want a general auth check if this middleware was broader).
    // For now, assuming the admin check is the primary gate for /admin.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user && req.nextUrl.pathname !== '/login') { // Only redirect if not already on login page
        const redirect = new URL("/login", req.url);
        redirect.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(redirect);
    }

    // Allowed
    return res;
}

// Run on /admin and its subpaths
export const config = {
    matcher: ["/admin", "/admin/:path*"],
};