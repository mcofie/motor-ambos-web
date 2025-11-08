// Client-only Supabase instance for React client components.
// DO NOT use @supabase/ssr helpers here.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
    // Fail fast in dev so we don't silently hang
    console.error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anon, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // allow password login & email links
    },
    global: {
        // Good diagnostic defaults
        headers: { "X-Client-Info": "motorambos-web" },
    },
});