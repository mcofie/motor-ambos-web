import { NextResponse } from "next/server";
import { z } from "zod";
import { findProvidersNear } from "@/lib/providerSearch";

export const dynamic = "force-dynamic";

/**
 * Nearby roadside providers for the mobile apps, the same search the /help page runs.
 * Public, like the provider directory itself. Service codes match the help page:
 * battery, tire, tow, rescue, fuel, electrical, shop, detailing.
 */
const QuerySchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    service: z.string().trim().regex(/^[a-z_-]{1,30}$/),
    radiusKm: z.coerce.number().min(1).max(100).default(20),
    limit: z.coerce.number().int().min(1).max(50).default(30),
});

export async function GET(request: Request) {
    const parsed = QuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return NextResponse.json({ error: "Share your location and choose the help you need" }, { status: 400 });
    const { lat, lng, service, radiusKm, limit } = parsed.data;
    try {
        const providers = await findProvidersNear(service, lat, lng, radiusKm, limit);
        return NextResponse.json({ providers }, { headers: { "Cache-Control": "no-store" } });
    } catch (reason) {
        console.error("Nearby provider search failed:", reason instanceof Error ? reason.message : "unknown");
        return NextResponse.json({ error: "Could not find providers right now. Please try again." }, { status: 502 });
    }
}
