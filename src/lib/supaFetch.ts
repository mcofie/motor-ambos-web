// src/lib/supaFetch.ts
// Minimal REST helpers that respect RLS and motorambos schema
import type { Provider } from "@/app/help/page";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!URL || !ANON) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/* ───────────────────────────────
   Small shared types
   ─────────────────────────────── */
type GeoJSONPoint = {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
};

type ProviderRow = {
    id: string;
    display_name?: string | null;
    phone_business?: string | null;
    about?: string | null;
    address_line?: string | null;
    is_active?: boolean | null;
    coverage_radius_km?: number | null;
    callout_fee?: number | null;
    location?: GeoJSONPoint | null;
    lat?: number | null; // optional computed/denormalized
    lng?: number | null; // optional computed/denormalized
    created_at?: string;
    updated_at?: string;
};

type ServiceRow = {
    id: string;
    name?: string;
    code?: string;
};

type ProviderServiceRow = { service_id: string };

type RequestsListRow = {
    id: string;
    created_at: string;
    status: string;
    driver_name: string | null;
    provider_id: string | null;
    location: unknown;
};

type RpcRate = {
    code: string;
    name: string;
    base_price: number | null;
    price_unit: string | null;
};

type RpcProviderRow = {
    id: string;
    display_name?: string | null;
    phone_business?: string | null;
    distance_km?: number | null;
    rating?: number | null;
    jobs_count?: number | null;
    provider_callout_fee?: number | null;
    min_callout_fee?: number | null;
    coverage_radius_km?: number | null;
    rates?: RpcRate[] | null;
    lat?: number | null;
    lng?: number | null;
    location?: GeoJSONPoint | null;
};

type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    user?: { id?: string } | null;
};

type SupabaseUserPayload = { id?: string } | { user?: { id?: string } } | null;

/* ───────────────────────────────
   Utilities
   ─────────────────────────────── */
function parseAuthBlob(raw: string | null): string | null {
    if (!raw) return null;
    try {
        const o = JSON.parse(raw as string);
        if (o?.currentSession?.access_token) return o.currentSession.access_token as string;
        if (o?.access_token) return o.access_token as string;
        return null;
    } catch {
        return null;
    }
}

/** Try the canonical key and also any sb-* fallback the SDK might have used */
export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    const canonical = parseAuthBlob(localStorage.getItem(`sb-${ref}-auth-token`));
    if (canonical) return canonical;

    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if (!k.startsWith("sb-") || !k.endsWith("-auth-token")) continue;
        const t = parseAuthBlob(localStorage.getItem(k));
        if (t) return t;
    }
    return null;
}

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
        ...baseHeaders(token ?? undefined),
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

export function baseHeadersJustAnon(): HeadersInit {
    return {
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

/** Tiny sleep helper */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function readJSONSafe<T = unknown>(res: Response): Promise<T | null> {
    const len = res.headers.get("content-length");
    if (len === "0") return null;

    const text = await res.clone().text();
    if (!text) return null;

    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
}

async function throwIfNotOk(res: Response) {
    if (res.ok) return;
    const maybe = await readJSONSafe<unknown>(res);
    const msg =
        (maybe && (typeof maybe === "object" && maybe !== null && "message" in maybe && (maybe as { message: string }).message)) ||
        (maybe && (typeof maybe === "object" && maybe !== null && "error" in maybe && (maybe as { error: string }).error)) ||
        `HTTP ${res.status}`;
    throw new Error(String(msg));
}

function ewktFromLatLng(lat: number, lng: number) {
    return `SRID=4326;POINT(${lng} ${lat})`;
}

/* ───────────────────────────────
   Auth
   ─────────────────────────────── */
export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { apikey: ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const json = (await res.json().catch(() => ({}))) as LoginResponse | { error_description?: string; message?: string };
    if (!res.ok) throw new Error((json as { error_description?: string }).error_description || (json as { message?: string }).message || "Login failed");

    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    const key = `sb-${ref}-auth-token`;
    const currentSession = json as LoginResponse;
    const currentUser = (json as LoginResponse)?.user ?? null;
    localStorage.setItem(key, JSON.stringify({ currentSession, currentUser }));
    return json as LoginResponse;
}

export async function getUser(): Promise<SupabaseUserPayload> {
    for (let i = 0; i < 3; i++) {
        const token = getAccessToken();
        if (token) {
            const res = await fetch(`${URL}/auth/v1/user`, { headers: baseHeaders(token) });
            if (res.ok) return (await res.json()) as SupabaseUserPayload;
        }
        await sleep(150 + i * 150);
    }
    return null;
}

export async function logout(): Promise<void> {
    const ref = URL.replace(/^https?:\/\//, "").split(".")[0];
    localStorage.removeItem(`sb-${ref}-auth-token`);
}

/* ───────────────────────────────
   Providers
   ─────────────────────────────── */

/**
 * List providers with computed lat/lng (fallback from GeoJSON).
 */
export async function listProviders(q?: string): Promise<ProviderRow[]> {
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
            "lat",
            "lng",
            "created_at",
            "updated_at",
        ].join(",")
    );
    params.set("order", "created_at.desc");
    if (q && q.trim()) {
        params.set("display_name", `ilike.*${q.trim()}*`);
    }

    const r = await fetch(`${URL}/rest/v1/providers?${params.toString()}`, { headers: authHeaders() });
    await throwIfNotOk(r);
    const rows = (await readJSONSafe<ProviderRow[]>(r)) ?? [];

    // Derive lat/lng from GeoJSON if not present
    return rows.map((row) => {
        if ((row.lat == null || row.lng == null) && row.location?.coordinates) {
            const [lng, lat] = row.location.coordinates;
            return { ...row, lat, lng };
        }
        return row;
    });
}

export type InsertProviderParams = {
    display_name: string;
    phone_business?: string | null;
    about?: string | null;
    address_line?: string | null;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    lng?: number | null;
    lat?: number | null;
};

export async function insertProvider(p: InsertProviderParams): Promise<ProviderRow | null> {
    const payload: Record<string, unknown> = {
        display_name: p.display_name,
        phone_business: p.phone_business ?? null,
        about: p.about ?? null,
        address_line: p.address_line ?? null,
        is_active: !!p.is_active,
        coverage_radius_km: p.coverage_radius_km ?? 10,
        callout_fee: p.callout_fee ?? 0,
    };

    if (typeof p.lng === "number" && typeof p.lat === "number") {
        payload.location = ewktFromLatLng(p.lat, p.lng);
    }

    const r = await fetch(`${URL}/rest/v1/providers`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(payload),
    });

    await throwIfNotOk(r);
    const rows = (await readJSONSafe<ProviderRow[] | ProviderRow>(r)) ?? null;
    if (!rows) return null;
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

export type UpdateProviderPatch = Partial<{
    display_name: string;
    phone_business: string | null;
    about: string | null;
    address_line: string | null;
    is_active: boolean;
    coverage_radius_km: number | null;
    callout_fee: number | null;
    // lat/lng are ignored here (computed or set via location)
    lng: number | null;
    lat: number | null;
    updated_at: string;
}>;

export async function updateProvider(id: string, patch: UpdateProviderPatch): Promise<ProviderRow | null> {
    const sanitized: Record<string, unknown> = { ...patch };
    delete sanitized.lat;
    delete sanitized.lng;

    const r = await fetch(`${URL}/rest/v1/providers?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(sanitized),
    });

    await throwIfNotOk(r);
    const rows = (await readJSONSafe<ProviderRow[] | ProviderRow>(r)) ?? null;
    if (!rows) return null;
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

export async function deleteProvider(id: string): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/providers?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(true),
    });
    if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data?.message || "Delete failed");
    }
}

export async function listServices(): Promise<ServiceRow[]> {
    const params = new URLSearchParams();
    params.set("select", "id,name,code");
    params.set("order", "name.asc");

    const r = await fetch(`${URL}/rest/v1/services?${params.toString()}`, { headers: authHeaders() });
    await throwIfNotOk(r);
    return (await readJSONSafe<ServiceRow[]>(r)) ?? [];
}

/** Get current services for a provider (returns service_id[]) */
export async function getProviderServiceIds(providerId: string): Promise<string[]> {
    const r = await fetch(
        `${URL}/rest/v1/provider_services?select=service_id&provider_id=eq.${encodeURIComponent(providerId)}`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(r);
    const rows = (await readJSONSafe<ProviderServiceRow[]>(r)) ?? [];
    return rows.map((row) => row.service_id);
}

/**
 * Set services for a provider by computing diff:
 * - Deletes removed relations
 * - Inserts new relations
 */
export async function setProviderServices(providerId: string, desired: string[]): Promise<{ added: number; removed: number }> {
    const current = await getProviderServiceIds(providerId);

    const want = new Set(desired.filter(Boolean));
    const have = new Set(current);

    const toAdd: string[] = [];
    const toRemove: string[] = [];

    for (const id of want) if (!have.has(id)) toAdd.push(id);
    for (const id of have) if (!want.has(id)) toRemove.push(id);

    if (toRemove.length > 0) {
        const inList = `(${toRemove.map((s) => `"${s}"`).join(",")})`;
        const delUrl = `${URL}/rest/v1/provider_services?provider_id=eq.${encodeURIComponent(
            providerId
        )}&service_id=in.${encodeURIComponent(inList)}`;

        const delRes = await fetch(delUrl, {
            method: "DELETE",
            headers: { ...authHeaders(), Prefer: "return=minimal" },
        });
        await throwIfNotOk(delRes);
    }

    if (toAdd.length > 0) {
        const payload = toAdd.map((service_id) => ({ provider_id: providerId, service_id }));
        const insRes = await fetch(`${URL}/rest/v1/provider_services`, {
            method: "POST",
            headers: { ...authHeaders(), "Content-Type": "application/json", Prefer: "return=minimal" },
            body: JSON.stringify(payload),
        });
        await throwIfNotOk(insRes);
    }

    return { added: toAdd.length, removed: toRemove.length };
}

/* ───────────────────────────────
   Requests + Helpers
   ─────────────────────────────── */
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

async function getUserId(): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("You must be signed in to create a request.");
    const res = await fetch(`${URL}/auth/v1/user`, {
        headers: { apikey: ANON, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load user");
    const j = (await res.json()) as SupabaseUserPayload;
    const id = (j && "id" in j ? j.id : j && "user" in j ? j.user?.id : undefined) ?? null;
    if (!id) throw new Error("No user id in session");
    return id;
}

export async function lookupServiceIdByCode(
    code: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel"
): Promise<string> {
    const qs = new URLSearchParams({ select: "id,code", code: `eq.${code}`, limit: "1" });
    const res = await fetch(`${URL}/rest/v1/services?${qs}`, { headers: restHeaders(getAccessToken()) });
    await throwIfNotOk(res);
    const rows = (await readJSONSafe<Array<{ id: string }>>(res)) ?? [];
    if (!rows?.[0]?.id) throw new Error(`Service '${code}' not found in 'services'`);
    return rows[0].id;
}

export async function getCurrentUserId(): Promise<string | null> {
    const token = getAccessToken();
    if (!token) return null;
    const r = await fetch(`${URL}/auth/v1/user`, {
        headers: { apikey: ANON, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as SupabaseUserPayload;
    return (j && "id" in j ? j.id : j && "user" in j ? j.user?.id : null) ?? null;
}

export async function createRequestRow(params: {
    serviceCode: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    driver_name: string;
    driver_phone: string;
    lat: number;
    lng: number;
}) {
    const token = getAccessToken();
    const [service_id, created_by] = await Promise.all([lookupServiceIdByCode(params.serviceCode), getUserId()]);

    const body = {
        status: "open",
        driver_name: params.driver_name,
        driver_phone: params.driver_phone,
        service_id,
        created_by,
        location: ewktFromLatLng(params.lat, params.lng),
    };

    const res = await fetch(`${URL}/rest/v1/requests`, {
        method: "POST",
        headers: { ...restHeaders(token), Prefer: "return=representation" },
        body: JSON.stringify(body),
    });
    await throwIfNotOk(res);
    const rows = (await readJSONSafe<Record<string, unknown>[] | Record<string, unknown>>(res)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

export async function createRequest(payload: {
    helpType: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    driver_name: string;
    driver_phone: string;
    details?: string | null;
    address_line?: string | null;
    lat: number;
    lng: number;
    provider_id?: string | null;
    status?: "open" | "assigned" | "completed" | "cancelled";
}) {
    const [service_id, created_by] = await Promise.all([lookupServiceIdByCode(payload.helpType), getCurrentUserId()]);
    if (!created_by) throw new Error("Could not resolve current user for created_by.");

    const body = {
        created_by,
        provider_id: payload.provider_id ?? null,
        service_id,
        status: payload.status ?? "open",
        driver_name: payload.driver_name,
        driver_phone: payload.driver_phone,
        details: payload.details ?? null,
        address_line: payload.address_line ?? null,
        location: ewktFromLatLng(payload.lat, payload.lng),
    };

    const res = await fetch(`${URL}/rest/v1/requests`, {
        method: "POST",
        headers: { ...baseHeadersJustAnon(), "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify(body),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<Record<string, unknown>[] | Record<string, unknown>>(res)) ?? [];
    return Array.isArray(rows) ? rows[0] ?? null : rows;
}

/* ───────────────────────────────
   RPC: find_providers_near_with_rates
   ─────────────────────────────── */
function mapRpcToProvider(r: RpcProviderRow): Provider {
    const [lngFromGeo, latFromGeo] = r.location?.coordinates ?? [undefined, undefined];
    return {
        id: r.id,
        name: r.display_name ?? "",
        phone: r.phone_business ?? "",
        distance_km: Number(r.distance_km ?? 0),
        rating: r.rating ?? undefined,
        jobs: r.jobs_count ?? undefined,
        min_callout_fee: r.provider_callout_fee ?? r.min_callout_fee ?? null,
        coverage_radius_km: r.coverage_radius_km ?? null,
        services:
            Array.isArray(r.rates)
                ? r.rates.map((x) => ({
                    code: x.code,
                    name: x.name,
                    price: x.base_price,
                    unit: x.price_unit,
                }))
                : [],
        lat: r.lat ?? (typeof latFromGeo === "number" ? latFromGeo : 0),
        lng: r.lng ?? (typeof lngFromGeo === "number" ? lngFromGeo : 0),
    };
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
        headers: { ...baseHeadersJustAnon(), "Content-Type": "application/json" },
        body: JSON.stringify({
            p_lat: lat,
            p_lng: lng,
            p_radius_km: radiusKm,
            p_service_code: serviceCode,
            p_limit: limit,
        }),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RpcProviderRow[] | null>(res)) ?? [];
    return rows.map(mapRpcToProvider);
}

/* ───────────────────────────────
   Requests (read-only)
   ─────────────────────────────── */
export async function listRequests(status?: string): Promise<RequestsListRow[]> {
    const params = new URLSearchParams();
    params.set("select", "id,created_at,status,driver_name,provider_id,location");
    params.set("order", "created_at.desc");
    if (status) params.set("status", `eq.${status}`);

    const res = await fetch(`${URL}/rest/v1/requests?${params.toString()}`, { headers: authHeaders(false) });
    const data = (await res.json().catch(() => [])) as RequestsListRow[] | { message?: string };
    if (!res.ok) throw new Error((data as { message?: string })?.message || "Failed to load requests");
    return Array.isArray(data) ? data : [];
}