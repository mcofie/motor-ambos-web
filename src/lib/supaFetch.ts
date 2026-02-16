// src/lib/supaFetch.ts
// REST helpers for MotorAmbos. Clean version with:
// - anon-only help flow
// - admin-only dashboard flows

/* ─────────────────────────────────────────
   Environment
────────────────────────────────────────── */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

import { getSupabaseBrowser } from "./supabaseBrowser";

if (!URL || !ANON) throw new Error("Missing environment variables");

/**
 * Uploads a file to the provider-assets bucket
 */
export async function uploadProviderAsset(file: File, path: string): Promise<string> {
    const supabase = getSupabaseBrowser();

    // Clean path and add timestamp to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
        .from('provider-assets')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    // Return the public URL
    const { data: { publicUrl } } = supabase.storage
        .from('provider-assets')
        .getPublicUrl(filePath);

    return publicUrl;
}

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
    is_verified: boolean;
    logo_url?: string | null;
    backdrop_url?: string | null;
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
    created_at?: string;
    updated_at?: string;
    provider_type?: string | null;
    logo_url?: string | null;
    operating_hours?: Record<string, unknown> | null;
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
    driver_phone?: string | null;
    provider_id: string | null;
    details?: string | null;
    address_line?: string | null;
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

type ProviderRateRow = {
    id: string;
    provider_id: string;
    service_id: string;
    base_price: number | null;
    price_unit: string | null;
    min_callout_fee: number | null;
    is_active: boolean | null;
};

type RequestReviewContext = {
    id: string;
    status: string;
    created_at: string;
    driver_name: string | null;
    driver_phone: string | null;
    provider_id: string | null;
    provider_name: string | null;
    provider_phone: string | null;
    service_code: string | null;
    service_name: string | null;
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
    is_verified?: boolean | null;
    logo_url?: string | null;
    backdrop_url?: string | null;
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
   Membership types (Admin)
────────────────────────────────────────── */

export type MembershipPlanRow = {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    currency: string;
    price_monthly?: number | null;
    price_yearly?: number | null;
    included_callouts_per_year: number;
    free_tow_radius_km: number;
    discount_percent_on_services: number;
    max_vehicles: number;
    priority_support: boolean;
    is_active: boolean;
};

export type MemberWithMembershipRow = {
    member_id: string;
    auth_user_id?: string | null;
    full_name: string | null;
    phone: string;
    email: string | null;
    membership_tier: string | null;
    membership_number: string | null;
    membership_expiry_date: string | null;
    membership_is_active: boolean | null;
    plan_name?: string | null;
    plan_code?: string | null;
    tier?: string | null;
    membership_id?: string | null;
    car_brand?: string | null;
    id?: string;
    is_business?: boolean;
    business_name?: string | null;
};

export type VehicleRow = {
    id: string;
    user_id: string;
    name?: string | null;
    make?: string | null;
    model?: string | null;
    year?: string | null;
    plate?: string | null;
    is_primary: boolean;
    insurance_url?: string | null;
    roadworthy_url?: string | null;
    nfc_card_id?: string | null;
    nfc_serial_number?: string | null;
    created_at?: string;
};

export type InvoiceRow = {
    id: string;
    org_id: string;
    invoice_number: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    issue_date: string;
    due_date: string;
    total_amount: number;
    paid_amount: number;
    currency: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
    organization?: {
        business_name: string;
        full_name: string;
    };
};

export type InvoiceItemRow = {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    created_at?: string;
};

export type ServiceHistoryRow = {
    id: string;
    vehicle_id: string;
    service_date: string;
    description: string;
    provider_name?: string | null;
    mileage?: number | null;
    cost?: number | null;
    is_verified: boolean;
    document_url?: string | null;
    created_at?: string;
};


export type UpsertMemberMembershipParams = {
    member_id?: string | null;
    full_name: string;
    phone: string;
    email?: string | null;
    plan_id: string;
    /**
     * Optional override for the *card number*.
     * If omitted/undefined, we send "" and let the DB auto-generate
     * a card number inside upsert_member_membership().
     */
    membership_number?: string | null;
    /**
     * Expiry as ISO string (timestamptz compatible).
     */
    expiry_date: string;
};

export type UpsertMemberMembershipResult = {
    member_id: string;
    membership_id: string;
};

/* ─────────────────────────────────────────
   Provider Rates helper
────────────────────────────────────────── */

export async function listProviderRates(providerId: string): Promise<ProviderRateRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/provider_rates?provider_id=eq.${providerId}`,
        { headers: authHeaders() }
    );

    await throwIfNotOk(res);
    return (await readJSONSafe<ProviderRateRow[]>(res)) ?? [];
}

export async function upsertProviderRates(
    providerId: string,
    payload: {
        service_id: string;
        base_price: number | null;
        price_unit: string | null;
        min_callout_fee: number | null;
        is_active: boolean;
    }[]
): Promise<void> {
    if (!payload.length) return;

    const rows = payload.map((p) => ({
        provider_id: providerId,
        service_id: p.service_id,
        base_price: p.base_price,
        price_unit: p.price_unit ?? "job",
        min_callout_fee: p.min_callout_fee ?? null,
        is_active: p.is_active,
    }));

    const res = await fetch(
        `${URL}/rest/v1/provider_rates?on_conflict=provider_id,service_id`,
        {
            method: "POST",
            headers: { ...authHeaders(), Prefer: "resolution=merge-duplicates" },
            body: JSON.stringify(rows),
        }
    );

    await throwIfNotOk(res);
}

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
    let token: string | null = null;

    if (typeof window !== "undefined") {
        // Primary: use localStorage which is kept in sync by getUser()
        token = localStorage.getItem("sb-access");

        // Fallback: try to find standard Supabase token from cookie-based storage
        if (!token) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("sb-") && key?.endsWith("-auth-token")) {
                    try {
                        const session = JSON.parse(localStorage.getItem(key)!);
                        if (session.access_token) {
                            token = session.access_token;
                            break;
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        }
    }

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
    // Use the Supabase client for proper session/cookie management
    const { getSupabaseBrowser } = await import("./supabaseBrowser");
    const supabase = getSupabaseBrowser();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message || "Login failed");
    }

    if (!data.session) {
        throw new Error("No session returned from login");
    }

    // Keep backward compatibility for REST API calls that use localStorage
    if (typeof window !== "undefined" && data.session.access_token) {
        localStorage.setItem("sb-access", data.session.access_token);
    }

    return {
        access_token: data.session.access_token,
        token_type: data.session.token_type,
        expires_in: data.session.expires_in ?? 3600,
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
    };
}

export async function logout(): Promise<void> {
    if (typeof window === "undefined") return;

    // Sign out via Supabase client to clear cookies/session
    const { getSupabaseBrowser } = await import("./supabaseBrowser");
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();

    // Also clear localStorage token for backward compatibility
    localStorage.removeItem("sb-access");
}

export async function getUser(): Promise<SupabaseUserPayload> {
    if (typeof window === "undefined") return null;

    // Use the Supabase browser client for proper session management
    // This handles auto-refresh of expired tokens automatically
    const { getSupabaseBrowser } = await import("./supabaseBrowser");
    const supabase = getSupabaseBrowser();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    // Keep localStorage in sync for authHeaders() backward compat
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        localStorage.setItem("sb-access", session.access_token);
    }

    return user as SupabaseUserPayload;
}

/* ─────────────────────────────────────────
   SERVICES (Admin + Public lookup)
────────────────────────────────────────── */

// Admin view
export async function listServices(signal?: AbortSignal): Promise<ServiceRow[]> {
    const res = await fetch(`${URL}/rest/v1/services?select=id,name,code`, {
        headers: authHeaders(),
        signal
    });

    await throwIfNotOk(res);
    return (await readJSONSafe<ServiceRow[]>(res)) ?? [];
}

// PUBLIC lookup for help flow
export async function lookupServiceIdByCode(
    code: string
): Promise<string> {
    const res = await fetch(
        `${URL}/rest/v1/services?select=id&code=eq.${code}&limit=1`,
        { headers: anonHeaders() }
    );

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<ServiceIdRow[]>(res)) ?? [];
    if (!rows[0]?.id) throw new Error(`Service '${code}' not found`);
    return rows[0].id;
}

/* ─────────────────────────────────────────
   PROVIDERS (Admin-only)
────────────────────────────────────────── */

export async function listProviders(q?: string, signal?: AbortSignal): Promise<ProviderRow[]> {
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
            "provider_type",
            "logo_url",
            "backdrop_url",
            "operating_hours",
            "created_at",
        ].join(",")
    );
    params.set("order", "created_at.desc");
    if (q) params.set("display_name", `ilike.*${q}*`);

    const res = await fetch(`${URL}/rest/v1/providers?${params}`, {
        headers: authHeaders(),
        signal
    });

    await throwIfNotOk(res);

    const rows = (await readJSONSafe<ProviderRow[]>(res)) ?? [];

    // Fallback lat/lng from GeoJSON
    return rows.map((r) => {
        if ((!r.lat || !r.lng) && r.location?.coordinates) {
            const [lng, lat] = r.location.coordinates;
            return { ...r, lat, lng };
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
    is_verified?: boolean;
    owner_id?: string | null;
    provider_type?: string | null;
    logo_url?: string | null;
    backdrop_url?: string | null;
    operating_hours?: Record<string, unknown> | null;
};

export async function insertProvider(
    p: InsertProviderParams
): Promise<ProviderRow | null> {
    const payload: Record<string, unknown> = {
        display_name: p.display_name,
        phone_business: p.phone_business ?? null,
        about: p.about ?? null,
        address_line: p.address_line ?? null,
        is_active: p.is_active,
        coverage_radius_km: p.coverage_radius_km,
        callout_fee: p.callout_fee,
        is_verified: p.is_verified ?? false,
        owner_id: p.owner_id ?? null,
        provider_type: p.provider_type ?? null,
        logo_url: p.logo_url ?? null,
        backdrop_url: p.backdrop_url ?? null,
        operating_hours: p.operating_hours ?? null,
    };

    if (typeof p.lat === "number" && typeof p.lng === "number") {
        payload.location = ewktFromLatLng(p.lat, p.lng);
    }

    const res = await fetch(`${URL}/rest/v1/providers`, {
        method: "POST",
        headers: { ...authHeaders(), Prefer: "return=representation" },
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
    updated_at: string;
    is_verified: boolean;
    provider_type: string | null;
    logo_url: string | null;
    backdrop_url: string | null;
    operating_hours: Record<string, unknown> | null;
}>;

export async function updateProvider(
    id: string,
    patch: UpdateProviderPatch
): Promise<ProviderRow | null> {
    const clean: Record<string, unknown> = { ...patch };
    delete clean.lat;
    delete clean.lng;

    const res = await fetch(`${URL}/rest/v1/providers?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...authHeaders(), Prefer: "return=representation" },
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

export async function bulkUpdateProviders(
    ids: string[],
    patch: Record<string, unknown>
): Promise<void> {
    const inList = `(${ids.map((s) => `"${s}"`).join(",")})`;
    const res = await fetch(
        `${URL}/rest/v1/providers?id=in.${encodeURIComponent(inList)}`,
        {
            method: "PATCH",
            headers: { ...authHeaders(), Prefer: "return=minimal" },
            body: JSON.stringify(patch),
        }
    );
    await throwIfNotOk(res);
}

export async function listRequestsByProvider(
    providerId: string
): Promise<RequestsListRow[]> {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "created_at",
            "status",
            "driver_name",
            "driver_phone",
            "provider_id",
            "details",
            "address_line",
            "location",
        ].join(",")
    );
    params.set("provider_id", `eq.${providerId}`);
    params.set("order", "created_at.desc");

    const res = await fetch(`${URL}/rest/v1/requests?${params.toString()}`, {
        headers: authHeaders(),
    });

    await throwIfNotOk(res);
    return (await readJSONSafe<RequestsListRow[]>(res)) ?? [];
}


/* ─────────────────────────────────────────
   Provider Services
────────────────────────────────────────── */

export async function getProviderServiceIds(
    providerId: string
): Promise<string[]> {
    const res = await fetch(
        `${URL}/rest/v1/provider_services?select=service_id&provider_id=eq.${providerId}`,
        { headers: authHeaders() }
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
            headers: { ...authHeaders(), Prefer: "return=minimal" },
        });
        await throwIfNotOk(res);
    }

    // INSERT added services
    if (toAdd.length) {
        const payload = toAdd.map((service_id) => ({ provider_id: providerId, service_id }));
        const res = await fetch(`${URL}/rest/v1/provider_services`, {
            method: "POST",
            headers: { ...authHeaders(), Prefer: "return=minimal" },
            body: JSON.stringify(payload),
        });
        await throwIfNotOk(res);
    }

    return { added: toAdd.length, removed: toRemove.length };
}

/* ─────────────────────────────────────────
   Membership (Admin Dashboard)
────────────────────────────────────────── */

/**
 * List all active membership plans for the dashboard.
 */
export async function listMembershipPlans(signal?: AbortSignal): Promise<MembershipPlanRow[]> {
    const supabase = getSupabaseBrowser();
    const query = supabase
        .schema("motorambos")
        .from("membership_plans")
        .select("*")
        .order("price_monthly", { ascending: true });

    if (signal) (query as any).abortSignal(signal);

    const { data, error } = await query;

    if (error) {
        if (error.message === 'Fetch is aborted' || (signal && signal.aborted)) return [];
        console.error("Error listing membership plans:", error.message || error);
        return [];
    }
    return (data || []) as MembershipPlanRow[];
}

export async function listMembers(signal?: AbortSignal): Promise<MemberWithMembershipRow[]> {
    const supabase = getSupabaseBrowser();
    const query = supabase
        .schema("motorambos")
        .from("members")
        .select(`
            *,
            membership_plans (
                name,
                code
            )
        `);

    if (signal) (query as any).abortSignal(signal);

    const { data, error } = await query;

    if (error) {
        if (error.message === 'Fetch is aborted' || (signal && signal.aborted)) return [];
        console.error("Error listing members:", error.message || error);
        return [];
    }

    const rows = (data || []) as any[];
    // Map to the expected row type for the UI
    return rows.map(r => ({
        member_id: r.id,
        auth_user_id: r.auth_user_id,
        full_name: r.full_name,
        phone: r.phone,
        email: r.email,
        membership_tier: r.membership_tier,
        membership_number: r.membership_number,
        membership_expiry_date: r.membership_expiry_date,
        membership_is_active: r.membership_is_active,
        plan_name: r.membership_plans?.name,
        plan_code: r.membership_plans?.code,
        car_brand: r.car_brand,
        id: r.id,
        is_business: r.is_business || false,
        business_name: r.business_name,
    }));
}
export async function getMemberById(id: string, signal?: AbortSignal): Promise<MemberWithMembershipRow | null> {
    const supabase = getSupabaseBrowser();
    const query = supabase
        .schema("motorambos")
        .from("members")
        .select(`
            *,
            membership_plans (
                name,
                code
            )
        `)
        .eq("id", id)
        .single();

    if (signal) (query as any).abortSignal(signal);

    const { data, error } = await query;

    if (error) {
        if (error.message === 'Fetch is aborted' || (signal && signal.aborted)) return null;
        // PGRST116 is 'No rows found', usually fine to return null silently
        if (error.code !== 'PGRST116') {
            console.error("Error fetching member by id:", error.message || error);
        }
        return null;
    }
    if (!data) return null;

    return {
        member_id: data.id,
        auth_user_id: data.auth_user_id,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        membership_tier: data.membership_tier,
        membership_number: data.membership_number,
        membership_expiry_date: data.membership_expiry_date,
        membership_is_active: data.membership_is_active,
        plan_name: data.membership_plans?.name,
        plan_code: data.membership_plans?.code,
        car_brand: data.car_brand,
        id: data.id,
        is_business: data.is_business || false,
        business_name: data.business_name,
    };
}

/**
 * Use RPC motorambos.list_members_with_memberships()
 * to get members + their latest membership snapshot.
 */
export async function listMembersWithMemberships(signal?: AbortSignal): Promise<MemberWithMembershipRow[]> {
    return listMembers(signal);
}

/**
 * Call motorambos.upsert_member_membership().
 *
 * Note: we send `p_tier` as:
 *  - params.membership_number if provided (explicit override)
 *  - "" (empty string) if not, to trigger DB-side auto-generation
 *    of the membership card number.
 */
export async function upsertMemberMembership(params: {
    member_id?: string | null;
    phone: string;
    email?: string | null;
    full_name?: string | null;
    plan_id: string;
    tier: string;
    expiry_date?: string | null;
    is_business?: boolean;
    business_name?: string | null;
    parent_org_id?: string | null;
}): Promise<void> {
    const res = await fetch("/api/admin-upsert-membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to upsert membership");
    }
}

export async function listOrgDrivers(orgId: string, signal?: AbortSignal): Promise<any[]> {
    const res = await fetch(`/api/admin-org-drivers?org_id=${orgId}`, { signal });
    if (!res.ok) throw new Error("Failed to list drivers");
    return res.json();
}

export async function addOrgDriver(orgId: string, fullName: string, phone: string, vehicleId?: string): Promise<void> {
    const res = await fetch("/api/admin-org-drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, full_name: fullName, phone, vehicle_id: vehicleId })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add driver");
    }
}

/* ─────────────────────────────────────────
   Membership Vehicles & Service History
   ────────────────────────────────────────── */

export async function listMemberVehicles(memberId: string, authId?: string | null, signal?: AbortSignal): Promise<VehicleRow[]> {
    const supabase = getSupabaseBrowser();
    const ids = [memberId];
    if (authId) ids.push(authId);

    const query = supabase
        .schema("motorambos")
        .from("vehicles")
        .select("*")
        .in("user_id", ids);

    if (signal) (query as any).abortSignal(signal);

    const { data, error } = await query;

    if (error) {
        if (error.message === 'Fetch is aborted' || (signal && signal.aborted)) return [];
        console.error("Error fetching vehicles:", error.message || error);
        return [];
    }
    return (data || []) as VehicleRow[];
}

export async function listAllVehicles(signal?: AbortSignal): Promise<VehicleRow[]> {
    const supabase = getSupabaseBrowser();
    const query = supabase
        .schema("motorambos")
        .from("vehicles")
        .select("*");

    if (signal) (query as any).abortSignal(signal);

    const { data, error } = await query;

    if (error) {
        if (error.message === 'Fetch is aborted' || (signal && signal.aborted)) return [];
        console.error("Error listing all vehicles:", error.message || error);
        return [];
    }
    return (data || []) as VehicleRow[];
}
export async function getVehicleById(id: string): Promise<VehicleRow | null> {
    const res = await fetch(
        `${URL}/rest/v1/vehicles?id=eq.${id}&select=*`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    const data = (await readJSONSafe<VehicleRow[]>(res)) ?? [];
    return data.length > 0 ? data[0] : null;
}

export async function updateVehicle(id: string, payload: Partial<VehicleRow>): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/vehicles?id=eq.${id}`, {
        method: "PATCH",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    await throwIfNotOk(res);
}

/**
 * Link a physical NFC Smart Card to a vehicle.
 * Generates a Base62 public token and stores both the physical serial and the public ID.
 * Returns the generated public passport ID (e.g. "k7R2pM9q").
 */
export async function linkSmartCardToVehicle(
    vehicleId: string,
    serialNumber: string
): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let publicId = "";
    for (let i = 0; i < 8; i++) {
        publicId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const res = await fetch(`${URL}/rest/v1/vehicles?id=eq.${vehicleId}`, {
        method: "PATCH",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nfc_card_id: publicId,
            nfc_serial_number: serialNumber,
        }),
    });
    await throwIfNotOk(res);
    return publicId;
}


/* ─────────────────────────────────────────
   Public Vehicle Lookup (for NFC Tag profiles)
────────────────────────────────────────── */

export async function getPublicVehicle(nfcId: string): Promise<VehicleRow | null> {
    const res = await fetch(
        `${URL}/rest/v1/vehicles?nfc_card_id=eq.${nfcId}&select=*`,
        {
            headers: {
                apikey: ANON,
                Authorization: `Bearer ${ANON}`,
                "Accept-Profile": "motorambos",
            }
        }
    );
    if (!res.ok) return null;
    const data = (await readJSONSafe<VehicleRow[]>(res)) ?? [];
    return data.length > 0 ? data[0] : null;
}

export async function getPublicServiceHistory(vehicleId: string): Promise<ServiceHistoryRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/service_history?vehicle_id=eq.${vehicleId}&select=*&order=service_date.desc`,
        {
            headers: {
                apikey: ANON,
                Authorization: `Bearer ${ANON}`,
                "Accept-Profile": "motorambos",
            }
        }
    );
    if (!res.ok) return [];
    return (await readJSONSafe<ServiceHistoryRow[]>(res)) ?? [];
}

export async function getPublicMemberByUserId(userId: string): Promise<MemberWithMembershipRow | null> {
    const res = await fetch(
        `${URL}/rest/v1/members?auth_user_id=eq.${userId}&select=*`,
        {
            headers: {
                apikey: ANON,
                Authorization: `Bearer ${ANON}`,
                "Accept-Profile": "motorambos",
            }
        }
    );
    if (!res.ok) return null;
    const data = (await readJSONSafe<any[]>(res)) ?? [];
    if (data.length === 0) return null;
    const r = data[0];
    return {
        member_id: r.id,
        auth_user_id: r.auth_user_id,
        full_name: r.full_name,
        phone: r.phone,
        email: r.email,
        membership_tier: null,
        membership_number: null,
        membership_expiry_date: null,
        membership_is_active: null,
    };
}

export async function listServiceHistory(vehicleId: string): Promise<ServiceHistoryRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/service_history?vehicle_id=eq.${vehicleId}&select=*&order=service_date.desc`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    return (await readJSONSafe<ServiceHistoryRow[]>(res)) ?? [];
}

export async function upsertServiceHistory(row: Partial<ServiceHistoryRow>): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/service_history`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(row)
    });
    await throwIfNotOk(res);
}


/* ─────────────────────────────────────────
   HELP FLOW — Anon Only
────────────────────────────────────────── */

export async function createRequest(payload: {
    helpType: string;
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
        headers: { ...anonHeaders(), Prefer: "return=representation" },
        body: JSON.stringify(body),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RequestRow[]>(res)) ?? [];
    return rows[0] ?? null;
}

/**
 * Public lookup for a membership card (driver side).
 */
export async function fetchMembershipByNumber<T = unknown>(
    membershipNumber: string
): Promise<T | null> {
    if (!membershipNumber) {
        throw new Error("No membership number provided");
    }

    const trimmed = membershipNumber.trim();

    console.log("[fetchMembershipByNumber] looking up:", trimmed);

    const res = await fetch(`${URL}/rest/v1/rpc/get_membership_by_number`, {
        method: "POST",
        headers: {
            ...anonHeaders(),
            Prefer: "return=representation",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ in_membership_number: trimmed }),
        cache: "no-store",
    });

    console.log("[fetchMembershipByNumber] status:", res.status, res.statusText);

    if (!res.ok) {
        const text = await res.text();
        console.error("[fetchMembershipByNumber] error body:", text);
        throw new Error(text || "Failed to fetch membership");
    }

    const json = (await res.json()) as T | null;
    console.log("[fetchMembershipByNumber] json:", json);

    return json;
}

/* ─────────────────────────────────────────
   Provider search RPC (public help flow)
────────────────────────────────────────── */

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
        is_verified: r.is_verified ?? false,
        logo_url: r.logo_url ?? null,
        backdrop_url: r.backdrop_url ?? null,
    };
}

export async function findProvidersNear(
    serviceCode: string,
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

export async function listRequests(status?: string, signal?: AbortSignal): Promise<RequestsListRow[]> {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "created_at",
            "status",
            "driver_name",
            "driver_phone",
            "provider_id",
            "details",
            "address_line",
            "location",
            "service_id",
        ].join(",")
    );
    params.set("order", "created_at.desc");

    if (status) params.set("status", `eq.${status}`);

    const res = await fetch(`${URL}/rest/v1/requests?${params.toString()}`, {
        headers: authHeaders(),
        signal
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RequestsListRow[]>(res)) ?? [];
    return rows;
}

// ─────────────────────────────────────────
// Reviews (Anon – driver feedback)
// ─────────────────────────────────────────

export async function submitProviderReview(params: {
    requestId: string;
    rating: number;
    review: string;
    driverPhone?: string | null;
    outcome?: string | null;
}): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/rpc/add_provider_review`, {
        method: "POST",
        headers: anonHeaders(),
        body: JSON.stringify({
            p_request_id: params.requestId,
            p_rating: params.rating,
            p_review: params.review,
            p_driver_phone: params.driverPhone ?? null,
            p_outcome: params.outcome ?? "other",
        }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message: string | undefined = body?.message;

        if (message?.includes("already submitted a review")) {
            throw new Error("You’ve already reviewed this request. Thank you!");
        }

        throw new Error(message || `HTTP ${res.status}`);
    }
}

// ─────────────────────────────────────────
// Review context (Anon) – for driver review page
// ─────────────────────────────────────────

export async function getRequestReviewContext(
    requestId: string
): Promise<RequestReviewContext | null> {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "status",
            "created_at",
            "driver_name",
            "driver_phone",
            "provider_id",
            "provider_name",
            "provider_phone",
            "service_code",
            "service_name",
        ].join(",")
    );
    params.set("id", `eq.${requestId}`);
    params.set("limit", "1");

    const res = await fetch(`${URL}/rest/v1/request_review_context?${params}`, {
        headers: anonHeaders(),
    });

    await throwIfNotOk(res);
    const rows = (await readJSONSafe<RequestReviewContext[]>(res)) ?? [];
    return rows[0] ?? null;
}

/* ─────────────────────────────────────────
   Request status update (Admin)
────────────────────────────────────────── */

type RequestStatus =
    | "pending"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

export async function updateRequestStatus(
    id: string,
    status: RequestStatus
): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/requests?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...authHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ status }),
    });

    await throwIfNotOk(res);
}
/* ─────────────────────────────────────────
   NFC Inventory & Requests
   ────────────────────────────────────────── */

export type NfcCardRow = {
    id: string;
    serial_number: string;
    status: string;
    batch_id?: string | null;
    created_at?: string;
};

export type NfcRequestRow = {
    id: string;
    member_id: string;
    vehicle_id?: string | null;
    status: string;
    request_type: string;
    notes?: string | null;
    created_at?: string;
    member?: {
        full_name: string;
        phone: string;
    };
    vehicle?: {
        year: string;
        make: string;
        model: string;
        plate: string;
    };
};

export async function listNfcCards(signal?: AbortSignal): Promise<NfcCardRow[]> {
    const res = await fetch("/api/admin-nfc?type=cards", { signal });
    if (!res.ok) {
        console.error("Error listing NFC cards:", res.statusText);
        return [];
    }
    return res.json();
}

export async function createNfcCardBatch(serials: string[], batchId?: string): Promise<void> {
    const res = await fetch("/api/admin-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "create_batch",
            serials,
            batch_id: batchId
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create batch");
    }
}

export async function listNfcRequests(signal?: AbortSignal): Promise<NfcRequestRow[]> {
    const res = await fetch("/api/admin-nfc?type=requests", { signal });
    if (!res.ok) {
        console.error("Error listing NFC requests:", res.statusText);
        return [];
    }
    return res.json();
}

export async function updateNfcRequestStatus(id: string, status: string): Promise<void> {
    const res = await fetch("/api/admin-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update_request_status",
            id,
            status
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed/to update status");
    }
}
export async function bulkAssignNfcCards(mappings: { vehicle_id: string; serial_number: string }[]): Promise<void> {
    const res = await fetch("/api/admin-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "bulk_assign_cards",
            mappings
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to bulk assign cards");
    }
}

export async function updateNfcCard(id: string, updates: Partial<NfcCardRow>): Promise<void> {
    const res = await fetch("/api/admin-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update_card",
            id,
            ...updates
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update card");
    }
}

export async function deleteNfcCard(id: string): Promise<void> {
    const res = await fetch("/api/admin-nfc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete_card",
            id
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete card");
    }
}

export async function listInvoices(orgId?: string, signal?: AbortSignal): Promise<InvoiceRow[]> {
    const url = orgId ? `/api/admin-invoices?org_id=${orgId}` : "/api/admin-invoices";
    const res = await fetch(url, { signal });
    if (!res.ok) {
        console.error("Error listing invoices:", res.statusText);
        return [];
    }
    return res.json();
}

export async function createInvoice(payload: {
    org_id: string;
    due_date: string;
    total_amount: number;
    notes?: string;
    items: { description: string; quantity: number; unit_price: number }[];
}): Promise<InvoiceRow> {
    const res = await fetch("/api/admin-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create invoice");
    }
    return res.json();
}

export async function sendFleetReport(orgId: string, options: {
    startDate: string;
    endDate: string;
    includeServices: boolean;
    includeCompliance: boolean;
    includeFleetStats: boolean;
}): Promise<Blob> {
    const res = await fetch("/api/admin-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, type: 'fleet_summary', ...options })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate report");
    }
    return res.blob();
}

export async function upsertOrganization(payload: {
    id?: string;
    business_name: string;
    full_name: string;
    email?: string;
    phone: string;
    membership_tier?: string;
    membership_expiry_date?: string;
    membership_is_active?: boolean;
}): Promise<void> {
    const isNew = !payload.id;
    const url = isNew
        ? `${URL}/rest/v1/members`
        : `${URL}/rest/v1/members?id=eq.${payload.id}`;

    // Clean payload of optional empties
    const body: any = {
        ...payload,
        is_business: true,
        updated_at: new Date().toISOString()
    };
    if (body.id) delete body.id;

    const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: {
            ...authHeaders(),
            ...(isNew ? { Prefer: "return=representation" } : {})
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save organization");
    }
}

export async function recordInvoicePayment(invoiceId: string, amount: number): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/invoices?id=eq.${invoiceId}`, {
        method: "PATCH",
        headers: { ...authHeaders() },
        body: JSON.stringify({
            paid_amount: amount,
            updated_at: new Date().toISOString()
        })
    });
    if (!res.ok) throw new Error("Failed to record payment");
}

export async function listOrgNotes(orgId: string): Promise<any[]> {
    const res = await fetch(`${URL}/rest/v1/organization_notes?org_id=eq.${orgId}&select=*&order=created_at.desc`, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) return [];
    return res.json();
}

export async function addOrgNote(orgId: string, content: string, category: string = 'GENERAL'): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/organization_notes`, {
        method: "POST",
        headers: { ...authHeaders() },
        body: JSON.stringify({
            org_id: orgId,
            content,
            category,
            created_at: new Date().toISOString()
        })
    });
    if (!res.ok) throw new Error("Failed to save note");
}

export async function fetchOrgServiceAnalytics(orgId: string): Promise<{ total_requests: number, total_cost: number }> {
    // This is a simplified fetch, ideally this would be a single RPC call or aggregation
    const res = await fetch(`${URL}/rest/v1/service_history?vehicle_id=in.(select id from vehicles where user_id=eq.${orgId})&select=cost`, {
        headers: { ...authHeaders() }
    });
    if (!res.ok) return { total_requests: 0, total_cost: 0 };
    const data = await res.json();
    return {
        total_requests: data.length,
        total_cost: data.reduce((sum: number, item: any) => sum + (item.cost || 0), 0)
    };
}
