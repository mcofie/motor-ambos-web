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

    // Get the user — this also refreshes the session if needed
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        const redirect = new URL("/login", req.url);
        redirect.searchParams.set("next", req.nextUrl.pathname);
        return NextResponse.redirect(redirect);
    }

    // Check for admin role
    const email = user.email;
    const admins = ['maxcofie@gmail.com', 'admin@motorambos.com'];
    if (!email || !admins.includes(email)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Allowed
    return res;
}

// Run on /admin and its subpaths
export const config = {
    matcher: ["/admin", "/admin/:path*"],
};