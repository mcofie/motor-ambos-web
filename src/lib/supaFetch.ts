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
    is_verified: boolean;
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
    let token = typeof window !== "undefined" ? localStorage.getItem("sb-access") : null;

    // Fallback: try to find standard Supabase token
    if (!token && typeof window !== "undefined") {
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
    const token = localStorage.getItem("sb-access");
    if (!token) return null;

    const res = await fetch(`${URL}/auth/v1/user`, {
        headers: { apikey: ANON, Authorization: `Bearer ${token}` },
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
export async function listMembershipPlans(): Promise<MembershipPlanRow[]> {
    const params = new URLSearchParams();
    params.set(
        "select",
        [
            "id",
            "code",
            "name",
            "description",
            "currency",
            "price_monthly",
            "price_yearly",
            "included_callouts_per_year",
            "free_tow_radius_km",
            "discount_percent_on_services",
            "max_vehicles",
            "priority_support",
            "is_active",
        ].join(",")
    );
    params.set("order", "price_monthly.asc.nullslast");

    const res = await fetch(
        `${URL}/rest/v1/membership_plans?${params.toString()}`,
        {
            headers: authHeaders(),
        }
    );

    await throwIfNotOk(res);
    return (await readJSONSafe<MembershipPlanRow[]>(res)) ?? [];
}

export async function listMembers(): Promise<MemberWithMembershipRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/members?select=*`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    const rows = (await readJSONSafe<any[]>(res)) ?? [];
    // Map to the expected row type for the UI
    return rows.map(r => ({
        member_id: r.id,
        auth_user_id: r.auth_user_id,
        full_name: r.full_name,
        phone: r.phone,
        email: r.email,
        membership_tier: null,
        membership_number: null,
        membership_expiry_date: null,
        membership_is_active: null,
    }));
}
export async function getMemberById(id: string): Promise<MemberWithMembershipRow | null> {
    const res = await fetch(
        `${URL}/rest/v1/members?id=eq.${id}&select=*`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    const rows = (await readJSONSafe<any[]>(res)) ?? [];
    if (rows.length === 0) return null;
    const r = rows[0];
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

/**
 * Use RPC motorambos.list_members_with_memberships()
 * to get members + their latest membership snapshot.
 */
export async function listMembersWithMemberships(): Promise<MemberWithMembershipRow[]> {
    try {
        const res = await fetch(
            `${URL}/rest/v1/rpc/list_members_with_memberships`,
            {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({}),
            }
        );

        if (!res.ok) {
            console.warn("RPC list_members_with_memberships failed, falling back to listMembers");
            return listMembers();
        }

        return (await readJSONSafe<MemberWithMembershipRow[]>(res)) ?? [];
    } catch (e) {
        console.error("Error in listMembersWithMemberships, falling back", e);
        return listMembers();
    }
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
    expiry_date?: string | null; // ISO string or null
}): Promise<void> {
    const res = await fetch(`${URL}/rest/v1/rpc/upsert_member_membership`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
        body: JSON.stringify({
            p_member_id: params.member_id ?? null,
            p_phone: params.phone,
            p_email: params.email ?? null,
            p_full_name: params.full_name ?? null,
            p_plan_id: params.plan_id,
            p_tier: params.tier,
            p_expiry_date: params.expiry_date ?? null,
        }),
    });

    await throwIfNotOk(res);
}

/* ─────────────────────────────────────────
   Membership Vehicles & Service History
   ────────────────────────────────────────── */

export async function listMemberVehicles(authUserUserId: string): Promise<VehicleRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/vehicles?user_id=eq.${authUserUserId}&select=*`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    return (await readJSONSafe<VehicleRow[]>(res)) ?? [];
}

export async function listAllVehicles(): Promise<VehicleRow[]> {
    const res = await fetch(
        `${URL}/rest/v1/vehicles?select=*`,
        { headers: authHeaders() }
    );
    await throwIfNotOk(res);
    return (await readJSONSafe<VehicleRow[]>(res)) ?? [];
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
            "driver_phone",
            "provider_id",
            "details",
            "address_line",
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