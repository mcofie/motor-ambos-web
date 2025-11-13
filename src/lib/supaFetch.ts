// src/lib/supaFetch.ts
// REST helpers for MotorAmbos. Clean version with:
// - anon-only help flow
// - admin-only dashboard flows

/* ─────────────────────────────────────────
   Environment
────────────────────────────────────────── */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!URL || !ANON) throw new Error("Missing environment variables");

/* ─────────────────────────────────────────
   Types
────────────────────────────────────────── */
type SupabaseUserPayload =
    | { id?: string; email?: string }
    | { user?: { id?: string; email?: string } }
    | null;

type GeoJSONPoint = {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
};

export type Provider = {
    id: string;
    name: string;
    phone: string;
    distance_km: number;
    rating?: number;
    address_line?: string;
    jobs?: number;
    min_callout_fee?: number | null;
    coverage_radius_km?: number | null;
    services: Array<{ code: string; name: string; price?: number | null; unit?: string | null }>;
    lat: number;
    lng: number;
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
    lat?: number | null;
    lng?: number | null;
    created_at?: string;    // 👈 add this
    updated_at?: string;    // 👈 and this
};

type ServiceRow = {
    id: string;
    name?: string;
    code?: string;
};

type ServiceIdRow = { id: string };

type ProviderServiceRow = { service_id: string };


type RequestsListRow = {
    id: string;
    created_at: string;
    status: string;
    driver_name: string | null;
    driver_phone?: string | null;   // 👈 add
    provider_id: string | null;
    details?: string | null;        // 👈 add
    address_line?: string | null;   // 👈 add
    location: unknown;
};


type RequestRow = {
    id: string;
    created_at: string;
    status: string;
    driver_name: string | null;
    driver_phone: string | null;
    provider_id: string | null;
    service_id: string;
    location: unknown;
    details?: string | null;
    address_line?: string | null;
};

type RpcRate = {
    code: string;
    name: string;
    base_price: number | null;
    price_unit: string | null;
};

type RpcProviderRow = {
    id: string;
    name?: string | null;
    phone?: string | null;
    address_line?: string | null;
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

type ErrorPayload = {
    message?: string;
    error?: string;
};

type AuthSuccessResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    user?: { id?: string; email?: string } | null;
};

type AuthErrorResponse = {
    error_description?: string;
    message?: string;
};

/* ─────────────────────────────────────────
   Utility helpers
────────────────────────────────────────── */
async function readJSONSafe<T>(res: Response): Promise<T | null> {
    const txt = await res.clone().text();
    if (!txt) return null;
    try {
        return JSON.parse(txt) as T;
    } catch {
        return null;
    }
}

async function throwIfNotOk(res: Response): Promise<void> {
    if (res.ok) return;
    const body = await readJSONSafe<ErrorPayload>(res);
    const msg = body?.message || body?.error || `HTTP ${res.status}`;
    throw new Error(String(msg));
}

const ewktFromLatLng = (lat: number, lng: number) =>
    `SRID=4326;POINT(${lng} ${lat})`;

/* ─────────────────────────────────────────
   Headers
────────────────────────────────────────── */

// PUBLIC — For Help Flow
function anonHeaders(): HeadersInit {
    return {
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

// ADMIN — For Dashboard
function authHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("sb-access") : null;
    return {
        apikey: ANON,
        Authorization: `Bearer ${token ?? ANON}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Profile": "motorambos",
        "Content-Profile": "motorambos",
    };
}

/* ─────────────────────────────────────────
   AUTH (Admin only)
────────────────────────────────────────── */

export async function loginWithPassword(
    email: string,
    password: string
): Promise<AuthSuccessResponse> {
    const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {apikey: ANON, "Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });

    const json = (await res.json()) as AuthSuccessResponse & AuthErrorResponse;

    if (!res.ok) {
        throw new Error(json.error_description || json.message || "Login failed");
    }

    if (typeof window !== "undefined") {
        localStorage.setItem("sb-access", json.access_token);
    }

    return json;
}

export function logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("sb-access");
}

export async function getUser(): Promise<SupabaseUserPayload> {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("sb-access");
    if (!token) return null;

    const res = await fetch(`${URL}/auth/v1/user`, {
        headers: {apikey: ANON, Authorization: `Bearer ${token}`},
    });

    if (!res.ok) return null;
    return (await res.json()) as SupabaseUserPayload;
}

/* ─────────────────────────────────────────
   SERVICES (Admin + Public lookup)
────────────────────────────────────────── */

// Admin view
export async function listServices(): Promise<ServiceRow[]> {
    const res = await fetch(`${URL}/rest/v1/services?select=id,name,code`, {
        headers: authHeaders(),
    });

    await throwIfNotOk(res);
    return (await readJSONSafe<ServiceRow[]>(res)) ?? [];
}

// PUBLIC lookup for help flow
export async function lookupServiceIdByCode(
    code: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel"
): Promise<string> {
    const res = await fetch(
        `${URL}/rest/v1/services?select=id&code=eq.${code}&limit=1`,
        {headers: anonHeaders()}
    );

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<ServiceIdRow[]>(res)) ?? [];
    if (!rows[0]?.id) throw new Error(`Service '${code}' not found`);
    return rows[0].id;
}

/* ─────────────────────────────────────────
   PROVIDERS (Admin-only)
────────────────────────────────────────── */

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
        ].join(",")
    );
    params.set("order", "created_at.desc");
    if (q) params.set("display_name", `ilike.*${q}*`);

    const res = await fetch(`${URL}/rest/v1/providers?${params}`, {
        headers: authHeaders(),
    });

    await throwIfNotOk(res);

    const rows = (await readJSONSafe<ProviderRow[]>(res)) ?? [];

    // Fallback lat/lng from GeoJSON
    return rows.map((r) => {
        if ((!r.lat || !r.lng) && r.location?.coordinates) {
            const [lng, lat] = r.location.coordinates;
            return {...r, lat, lng};
        }
        return r;
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
    lat?: number | null;
    lng?: number | null;
};

export async function insertProvider(p: InsertProviderParams): Promise<ProviderRow | null> {
    const payload: Record<string, unknown> = {
        display_name: p.display_name,
        phone_business: p.phone_business ?? null,
        about: p.about ?? null,
        address_line: p.address_line ?? null,
        is_active: p.is_active,
        coverage_radius_km: p.coverage_radius_km,
        callout_fee: p.callout_fee,
    };

    if (typeof p.lat === "number" && typeof p.lng === "number") {
        payload.location = ewktFromLatLng(p.lat, p.lng);
    }

    const res = await fetch(`${URL}/rest/v1/providers`, {
        method: "POST",
        headers: {...authHeaders(), Prefer: "return=representation"},
        body: JSON.stringify(payload),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<ProviderRow[]>(res)) ?? [];
    return rows[0] ?? null;
}

export type UpdateProviderPatch = Partial<{
    display_name: string;
    phone_business: string | null;
    about: string | null;
    address_line: string | null;
    is_active: boolean;
    coverage_radius_km: number | null;
    callout_fee: number | null;
    lat: number | null;
    lng: number | null;
    updated_at: string;          // 👈 allow this
}>;

export async function updateProvider(
    id: string,
    patch: UpdateProviderPatch
): Promise<ProviderRow | null> {
    const clean: Record<string, unknown> = {...patch};
    delete clean.lat;
    delete clean.lng;

    const res = await fetch(`${URL}/rest/v1/providers?id=eq.${id}`, {
        method: "PATCH",
        headers: {...authHeaders(), Prefer: "return=representation"},
        body: JSON.stringify(clean),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<ProviderRow[]>(res)) ?? [];
    return rows[0] ?? null;
}

export async function deleteProvider(id: string): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/providers?id=eq.${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    await throwIfNotOk(res);
}

/* ─────────────────────────────────────────
   Provider Services
────────────────────────────────────────── */

export async function getProviderServiceIds(providerId: string): Promise<string[]> {
    const res = await fetch(
        `${URL}/rest/v1/provider_services?select=service_id&provider_id=eq.${providerId}`,
        {headers: authHeaders()}
    );

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<ProviderServiceRow[]>(res)) ?? [];
    return rows.map((x) => x.service_id);
}

export async function setProviderServices(
    providerId: string,
    desired: string[]
): Promise<{ added: number; removed: number }> {
    const current = await getProviderServiceIds(providerId);

    const want = new Set(desired);
    const have = new Set(current);

    const toAdd: string[] = [];
    const toRemove: string[] = [];

    for (const id of want) {
        if (!have.has(id)) toAdd.push(id);
    }
    for (const id of have) {
        if (!want.has(id)) toRemove.push(id);
    }

    // DELETE removed services
    if (toRemove.length) {
        const inList = `(${toRemove.map((s) => `"${s}"`).join(",")})`;
        const url = `${URL}/rest/v1/provider_services?provider_id=eq.${providerId}&service_id=in.${encodeURIComponent(
            inList
        )}`;
        const res = await fetch(url, {
            method: "DELETE",
            headers: {...authHeaders(), Prefer: "return=minimal"},
        });
        await throwIfNotOk(res);
    }

    // INSERT added services
    if (toAdd.length) {
        const payload = toAdd.map((service_id) => ({provider_id: providerId, service_id}));
        const res = await fetch(`${URL}/rest/v1/provider_services`, {
            method: "POST",
            headers: {...authHeaders(), Prefer: "return=minimal"},
            body: JSON.stringify(payload),
        });
        await throwIfNotOk(res);
    }

    return {added: toAdd.length, removed: toRemove.length};
}

/* ─────────────────────────────────────────
   HELP FLOW — Anon Only
────────────────────────────────────────── */

export async function createRequest(payload: {
    helpType: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    driver_name: string;
    driver_phone: string;
    details?: string | null;
    address_line?: string | null;
    lat: number;
    lng: number;
    provider_id?: string | null;
    status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
}): Promise<RequestRow | null> {
    const service_id = await lookupServiceIdByCode(payload.helpType);

    const body = {
        created_by: null as string | null,
        provider_id: payload.provider_id ?? null,
        service_id,
        status: payload.status ?? "pending",
        driver_name: payload.driver_name,
        driver_phone: payload.driver_phone,
        details: payload.details ?? null,
        address_line: payload.address_line ?? null,
        location: ewktFromLatLng(payload.lat, payload.lng),
    };

    const res = await fetch(`${URL}/rest/v1/requests`, {
        method: "POST",
        headers: {...anonHeaders(), Prefer: "return=representation"},
        body: JSON.stringify(body),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RequestRow[]>(res)) ?? [];
    return rows[0] ?? null;
}

function mapRpcProvider(r: RpcProviderRow): Provider {
    const [lngGeo, latGeo] = r.location?.coordinates ?? [];
    return {
        id: r.id,
        name: r.name ?? r.display_name ?? "",
        phone: r.phone_business ?? r.phone ?? "",
        address_line: r.address_line ?? "",
        distance_km: Number(r.distance_km ?? 0),
        rating: r.rating ?? undefined,
        jobs: r.jobs_count ?? undefined,
        min_callout_fee: r.provider_callout_fee ?? r.min_callout_fee ?? null,
        coverage_radius_km: r.coverage_radius_km ?? null,
        services:
            r.rates?.map((x) => ({
                code: x.code,
                name: x.name,
                price: x.base_price,
                unit: x.price_unit,
            })) ?? [],
        lat: r.lat ?? latGeo ?? 0,
        lng: r.lng ?? lngGeo ?? 0,
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
        headers: anonHeaders(),
        body: JSON.stringify({
            p_lat: lat,
            p_lng: lng,
            p_radius_km: radiusKm,
            p_service_code: serviceCode,
            p_limit: limit,
        }),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RpcProviderRow[]>(res)) ?? [];
    return rows.map(mapRpcProvider);
}

/* ─────────────────────────────────────────
   Requests list (Admin)
────────────────────────────────────────── */

export async function listRequests(status?: string): Promise<RequestsListRow[]> {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "created_at",
            "status",
            "driver_name",
            "driver_phone",   // 👈 added
            "provider_id",
            "details",        // 👈 added
            "address_line",   // 👈 added
            "location",
        ].join(",")
    );
    params.set("order", "created_at.desc");

    if (status) params.set("status", `eq.${status}`);

    const res = await fetch(`${URL}/rest/v1/requests?${params.toString()}`, {
        headers: authHeaders(),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RequestsListRow[]>(res)) ?? [];
    return rows;
}