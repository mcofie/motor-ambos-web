// Minimal REST helpers that respect RLS and motorambos schema
import {Provider} from "@/app/help/page";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
import {toast} from "sonner"


if (!URL || !ANON) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Safely parse potential Supabase auth JSON blob */
function parseAuthBlob(raw: string | null): string | null {
    if (!raw) return null;
    try {
        const o = JSON.parse(raw);
        // supabase-js style
        if (o?.currentSession?.access_token) return o.currentSession.access_token as string;
        // straight GoTrue /auth/v1/token response saved directly
        if (o?.access_token) return o.access_token as string;
        return null;
    } catch {
        return null;
    }
}

/** Try the canonical key and also any sb-* fallback the SDK might have used */
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    // 1) canonical
    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    const canonical = parseAuthBlob(localStorage.getItem(`sb-${ref}-auth-token`));
    if (canonical) return canonical;

    // 2) fallback — scan all keys (covers edge refs / envs / migrations)
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (!k.startsWith("sb-") || !k.endsWith("-auth-token")) continue;
        const t = parseAuthBlob(localStorage.getItem(k));
        if (t) return t;
    }
    return null;
}

/** Build headers for REST (motorambos schema) or AUTH */
function baseHeaders(token?: string): HeadersInit {
    return {
        apikey: ANON,
        Authorization: `Bearer ${token ?? ANON}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
}

export function authHeaders(requireUser = false): HeadersInit {
    const token = getAccessToken();
    if (requireUser && !token) throw new Error("You must be signed in.");
    return {
        ...baseHeaders(token),
        // Only REST needs profiles
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

/** Auth — password sign-in (unchanged) */
export async function loginWithPassword(email: string, password: string) {
    const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {apikey: ANON, "Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error_description || json?.message || "Login failed");

    // Persist similar to supabase-js
    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    const key = `sb-${ref}-auth-token`;
    const currentSession = json;
    const currentUser = json?.user ?? null;
    localStorage.setItem(key, JSON.stringify({currentSession, currentUser}));
    return json;
}

/** Tiny sleep helper */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Auth — robust get current user (waits briefly if storage hasn’t flushed yet) */
export async function getUser() {
    // Try immediately, then after 150ms/300ms if needed
    for (let i = 0; i < 3; i++) {
        const token = getAccessToken();
        if (token) {
            const res = await fetch(`${URL}/auth/v1/user`, {
                headers: baseHeaders(token),
            });
            if (res.ok) return res.json();
        }
        await sleep(150 + i * 150);
    }
    return null;
}

/** Auth — logout */
export async function logout() {
    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    localStorage.removeItem(`sb-${ref}-auth-token`);
}

// ... keep your providers/requests/service helpers exactly as you have them ...

/* ---------------- Providers ---------------- */

/**
 * List providers with computed lat/lng (do NOT rely on generated columns).
 * We compute: lat: st_y(location::geometry), lng: st_x(location::geometry)
 */
export async function listProviders(q?: string) {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "display_name",
            "phone_business",
            "about",
            "address_line",
            "is_active",
            "coverage_radius_km",
            "callout_fee",
            "location",
            "lat", // computed column (via function) or real column if you made a view
            "lng",
            "created_at",
            "updated_at",
        ].join(",")
    );
    params.set("order", "created_at.desc");
    if (q && q.trim()) {
        // PostgREST ilike syntax is: column=ilike.*value*
        params.set("display_name", `ilike.*${q.trim()}*`);
    }

    const r = await fetch(`${URL}/rest/v1/providers?${params.toString()}`, {
        headers: authHeaders(),
    });

    await throwIfNotOk(r);
    const rows = (await readJSONSafe(r)) ?? [];
    // Derive lat/lng from GeoJSON when computed columns aren’t present
    return rows.map((row: any) => {
        if ((row.lat == null || row.lng == null) && row.location?.coordinates) {
            const [lng, lat] = row.location.coordinates;
            return {...row, lat, lng};
        }
        return row;
    });
}

// supaFetch.ts (helpers at top)

function hasJsonBody(res: Response) {
    const ct = res.headers.get("content-type") || "";
    // If content-type isn't JSON but there *is* a body, we still try JSON if caller needs it.
    // We'll guard with content-length and a small text peek.
    if (!ct.toLowerCase().includes("application/json")) return false;
    return true;
}

async function readJSONSafe(res: Response) {
    // Many PostgREST writes return 201/204 with empty body by default
    const len = res.headers.get("content-length");
    if (len === "0") return null;

    // Some proxies omit content-length; do a quick text sniff
    const clone = res.clone();
    const text = await clone.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        // Not valid JSON; return text for debugging or null for silent behavior
        return null;
    }
}

// Standard error surface
async function throwIfNotOk(res: Response) {
    if (res.ok) return;
    const maybe = await readJSONSafe(res);
    const msg =
        (maybe && (maybe.message || maybe.error || JSON.stringify(maybe))) ||
        `HTTP ${res.status}`;
    throw new Error(msg);
}

/** Convert numeric lat/lng to WKT geography. */
function wktFromLatLng(lat?: number | null, lng?: number | null): string | null {
    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return null;
    // POINT(longitude latitude)
    return `SRID=4326;POINT(${lng} ${lat})`;
}

/**
 * Insert provider. Never send generated columns (lat/lng) to DB.
 * If lat/lng provided, send a WKT geography string for `location`.
 */
export async function insertProvider(p: {
    display_name: string;
    phone_business?: string | null;
    about?: string | null;
    address_line?: string | null;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    // add location input as lng/lat (numbers) or optional
    lng?: number | null;
    lat?: number | null;
}) {
    // Build payload for PostgREST.
    // Do NOT include lat/lng columns if they are computed in DB.
    // Send geography. Safest form for geography is EWKT with SRID:
    //   'SRID=4326;POINT(lon lat)'
    const payload: any = {
        display_name: p.display_name,
        phone_business: p.phone_business ?? null,
        about: p.about ?? null,
        address_line: p.address_line ?? null,
        is_active: !!p.is_active,
        coverage_radius_km: p.coverage_radius_km ?? 10,
        callout_fee: p.callout_fee ?? 0,
    };

    if (typeof p.lng === "number" && typeof p.lat === "number") {
        payload.location = `SRID=4326;POINT(${p.lng} ${p.lat})`;
    }

    const r = await fetch(`${URL}/rest/v1/providers`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
            "Prefer": "return=representation", // << ensures JSON body
        },
        body: JSON.stringify(payload),
    });

    await throwIfNotOk(r);
    // With Prefer: return=representation, this is an array of rows
    const rows = (await readJSONSafe(r)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

/** Update provider. Same WKT logic as insert. */
export async function updateProvider(id: string, patch: any) {
    // Never send computed columns (lat/lng) in patch.
    delete patch.lat;
    delete patch.lng;

    const r = await fetch(`${URL}/rest/v1/providers?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        body: JSON.stringify(patch),
    });

    await throwIfNotOk(r);
    const rows = (await readJSONSafe(r)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

export async function deleteProvider(id: string) {
    const res = await fetch(`${URL}/rest/v1/providers?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(true),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Delete failed");
    }
}

export async function listServices() {
    const params = new URLSearchParams();
    params.set("select", "id,name,code");
    params.set("order", "name.asc");

    const r = await fetch(`${URL}/rest/v1/services?${params.toString()}`, {
        headers: authHeaders(),
    });
    await throwIfNotOk(r);
    const rows = (await readJSONSafe(r)) ?? [];
    return rows;
}

/** Get current services for a provider (returns service_id[]) */
export async function getProviderServiceIds(providerId: string): Promise<string[]> {
    const r = await fetch(
        `${URL}/rest/v1/provider_services?select=service_id&provider_id=eq.${encodeURIComponent(
            providerId
        )}`,
        {headers: authHeaders()}
    );
    await throwIfNotOk(r);
    const rows = (await readJSONSafe(r)) ?? [];
    return rows.map((r: any) => r.service_id);
}

/**
 * Set services for a provider by computing diff:
 * - Deletes removed relations
 * - Inserts new relations
 */
export async function setProviderServices(providerId: string, desired: string[]) {
    // 1) get current
    const current = await getProviderServiceIds(providerId);

    const want = new Set(desired.filter(Boolean));
    const have = new Set(current);

    const toAdd: string[] = [];
    const toRemove: string[] = [];

    // compute additions
    for (const id of want) if (!have.has(id)) toAdd.push(id);
    // compute removals
    for (const id of have) if (!want.has(id)) toRemove.push(id);

    // 2) delete removed
    if (toRemove.length > 0) {
        const inList = `(${toRemove.map((s) => `"${s}"`).join(",")})`;
        const delUrl = `${URL}/rest/v1/provider_services?provider_id=eq.${encodeURIComponent(
            providerId
        )}&service_id=in.${encodeURIComponent(inList)}`;

        const delRes = await fetch(delUrl, {
            method: "DELETE",
            headers: {
                ...authHeaders(),
                Prefer: "return=minimal",
            },
        });
        await throwIfNotOk(delRes);
    }

    // 3) insert additions
    if (toAdd.length > 0) {
        const payload = toAdd.map((service_id) => ({provider_id: providerId, service_id}));
        const insRes = await fetch(`${URL}/rest/v1/provider_services`, {
            method: "POST",
            headers: {
                ...authHeaders(),
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify(payload),
        });
        await throwIfNotOk(insRes);
    }

    return {added: toAdd.length, removed: toRemove.length};
}


function restHeaders(token?: string | null): HeadersInit {
    return {
        apikey: ANON,
        Authorization: `Bearer ${token ?? ANON}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

function ewktFromLatLng(lat: number, lng: number) {
    return `SRID=4326;POINT(${lng} ${lat})`;
}

async function getUserId(): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("You must be signed in to create a request.");
    const res = await fetch(`${URL}/auth/v1/user`, {
        headers: {apikey: ANON, Authorization: `Bearer ${token}`},
    });
    if (!res.ok) throw new Error("Failed to load user");
    const j = await res.json();
    const id = j?.id ?? j?.user?.id;
    if (!id) throw new Error("No user id in session");
    return id;
}

export async function createRequestRow(params: {
    serviceCode: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    driver_name: string;
    driver_phone: string;
    lat: number;
    lng: number;
}) {
    const token = getAccessToken();
    const [service_id, created_by] = await Promise.all([
        lookupServiceIdByCode(params.serviceCode),
        getUserId(),
    ]);

    const body = {
        status: "open",
        driver_name: params.driver_name,
        driver_phone: params.driver_phone,
        service_id,                            // <-- use service_id
        created_by,                                  // <-- include this
        location: ewktFromLatLng(params.lat, params.lng), // geography (EWKT)
    };

    const res = await fetch(`${URL}/rest/v1/requests`, {
        method: "POST",
        headers: {...restHeaders(token), Prefer: "return=representation"},
        body: JSON.stringify(body),
    });
    await throwIfNotOk(res);
    const rows = (await readJSONSafe(res)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}


export async function lookupServiceIdByCode(code: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel"): Promise<string> {
    const qs = new URLSearchParams({select: "id,code", code: `eq.${code}`, limit: "1"});
    const res = await fetch(`${URL}/rest/v1/services?${qs}`, {headers: restHeaders(getAccessToken())});
    await throwIfNotOk(res);
    const rows = (await readJSONSafe(res)) as Array<{ id: string }>;
    if (!rows?.[0]?.id) throw new Error(`Service '${code}' not found in 'services'`);
    return rows[0].id;
}

export async function getCurrentUserId(): Promise<string | null> {
    const token = getAccessToken();
    if (!token) return null;
    const r = await fetch(`${URL}/auth/v1/user`, {
        headers: {apikey: ANON, Authorization: `Bearer ${token}`},
    });
    if (!r.ok) return null;
    const j = await r.json();
    // Supabase payload could be { id, ... } or { user: { id, ... } }
    return j?.id ?? j?.user?.id ?? null;
}

export async function createRequest(payload: {
    helpType: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    driver_name: string;
    driver_phone: string;
    details?: string | null;
    address_line?: string | null;
    lat: number;
    lng: number;
    // optional if you already matched a provider before creating the request
    provider_id?: string | null;
    status?: "open" | "assigned" | "completed" | "cancelled";
}) {
    const token = getAccessToken();
    if (!token) throw new Error("You must be signed in.");

    // Resolve required ids
    const [service_id, created_by] = await Promise.all([
        lookupServiceIdByCode(payload.helpType),
        getCurrentUserId(),
    ]);
    if (!created_by) throw new Error("Could not resolve current user for created_by.");

    // Build DB row
    const body = {
        created_by,                                // uuid (NOT NULL)
        provider_id: payload.provider_id ?? null,   // uuid (nullable if you dispatch later)
        service_id,                                 // uuid (NOT NULL)
        status: payload.status ?? "open",           // text
        driver_name: payload.driver_name,           // text
        driver_phone: payload.driver_phone,         // text
        details: payload.details ?? null,           // text
        address_line: payload.address_line ?? null, // text
        location: `SRID=4326;POINT(${payload.lng} ${payload.lat})`, // geography EWKT
    };

    const res = await fetch(`${URL}/rest/v1/requests`, {
        method: "POST",
        headers: {
            ...authHeaders(true),                  // includes Bearer <user token>
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify(body),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe(res)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}


export async function findProvidersNear(
    serviceCode: "battery" | "tire" | "oil" | "tow" | "fuel" | "rescue",
    lat: number,
    lng: number,
    radiusKm = 20,
    limit = 30
): Promise<Provider[]> {
    const res = await fetch(`${URL}/rest/v1/rpc/find_providers_near_with_rates`, {
        method: "POST",
        headers: {
            ...authHeaders(false),           // anon read OK if you granted execute; include user token if you want authenticated-only
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            p_lat: lat,
            p_lng: lng,
            p_radius_km: radiusKm,
            p_service_code: serviceCode,
            p_limit: limit,
        }),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe(res)) as Provider[] | null;
    return rows ?? [];
}


/* ---------------- Requests (read-only) ---------------- */

export async function listRequests(status?: string) {
    const params = new URLSearchParams();
    params.set("select", "id,created_at,status,driver_name,provider_id,location");
    params.set("order", "created_at.desc");
    if (status) params.set("status", `eq.${status}`);

    const res = await fetch(`${URL}/rest/v1/requests?${params.toString()}`, {
        headers: authHeaders(false),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to load requests");
    return data;
}