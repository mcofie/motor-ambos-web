// src/lib/providerSearch.ts
// Nearby providers for the public help flow, through the find_providers_near_with_rates RPC.
// No browser-only imports, so both client pages and API routes can use it.

import { formatPhone } from "./phone";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type GeoJSONPoint = { type: "Point"; coordinates: [number, number] };

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

function mapRpcProvider(r: RpcProviderRow): Provider {
    const [lngGeo, latGeo] = r.location?.coordinates ?? [];
    return {
        id: r.id,
        name: r.name ?? r.display_name ?? "",
        phone: formatPhone(r.phone_business ?? r.phone),
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
        headers: {
            apikey: ANON,
            Authorization: `Bearer ${ANON}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Accept-Profile": "motorambos",
            "Content-Profile": "motorambos",
        },
        cache: "no-store",
        body: JSON.stringify({
            p_lat: lat,
            p_lng: lng,
            p_radius_km: radiusKm,
            p_service_code: serviceCode,
            p_limit: limit,
        }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null) as { message?: string; error?: string } | null;
        throw new Error(body?.message || body?.error || `Provider search failed (${res.status})`);
    }
    const rows = ((await res.json().catch(() => null)) as RpcProviderRow[] | null) ?? [];
    return rows.map(mapRpcProvider);
}
