"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Single instance across the app
let _client: SupabaseClient | null = null;

/** Debug fetch: logs every request & first 200 chars of the response body */
function debugFetch(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : (input as URL).toString();
    console.log("[sb.fetch] →", init?.method || "GET", url);

    return fetch(input as any, init).then(async (res) => {
        // clone so we don't consume the body
        const clone = res.clone();
        let body = "";
        try {
            body = await clone.text();
        } catch {
            // ignore body read errors
        }
        console.log("[sb.fetch] ←", res.status, body.slice(0, 200));
        return res;
    });
}

/**
 * Minimal, reliable browser client (Next.js App Router friendly).
 * - No @supabase/ssr
 * - No global Authorization/apikey headers (avoid overriding user JWTs)
 * - Use .schema('motorambos') per-query when hitting your non-public schema
 * - Debug fetch is injected so you SEE each /rest/v1 call
 */
export function getSupabaseBrowser(): SupabaseClient {
    if (_client) return _client;

    const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!URL || !ANON) {
        // Throw early so you don't get silent "hangs"
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
        );
    }

    _client = createClient(URL, ANON, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            storage:
                typeof window !== "undefined" ? window.localStorage : undefined,
        },
        global: {
            fetch: debugFetch,
        },
    });

    return _client;
}

/** Optional convenience export */
export const supabaseBrowser = getSupabaseBrowser();