// src/lib/supabaseBrowser.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Single instance across the app
let _client: SupabaseClient | null = null;

/**
 * Browser client using @supabase/ssr for proper cookie-based sessions.
 * This ensures the session is available to both client and server (middleware).
 */
export function getSupabaseBrowser(): SupabaseClient {
    if (_client) return _client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    // createBrowserClient from @supabase/ssr automatically handles:
    // - Cookie-based session storage (syncs with server/middleware)
    // - Session persistence and auto-refresh
    _client = createBrowserClient(url, anonKey);

    return _client;
}

/** Optional convenience export */
export const supabaseBrowser = typeof window !== "undefined" ? getSupabaseBrowser() : null;