import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalVehicleAccess } from "@/lib/portalAccess";
import { getServiceClient } from "@/lib/serverAuth";
import { reportMajorActivity } from "@/lib/discordActivity";

const uuid = z.string().uuid();
const IssueSchema = z.object({
    type: z.literal("issue"),
    vehicleId: uuid,
    category: z.enum(["Tyres", "Battery", "Engine", "Brakes", "Electrical", "Other"]),
    note: z.string().trim().max(500).optional(),
});
const FuelSchema = z.object({
    type: z.literal("fuel"),
    vehicleId: uuid,
    date: z.iso.date(),
    litres: z.number().positive().max(1000),
    totalCost: z.number().positive().max(100000),
    odometer: z.number().nonnegative().max(10000000).nullable(),
});
const ChargeSchema = z.object({
    type: z.literal("charge"),
    vehicleId: uuid,
    date: z.iso.date(),
    kwh: z.number().positive().max(500),
    totalCost: z.number().nonnegative().max(100000),
    odometer: z.number().nonnegative().max(10000000).nullable(),
});
const ServiceSchema = z.object({
    type: z.literal("service"),
    vehicleId: uuid,
    date: z.iso.date(),
    description: z.string().trim().min(2).max(200),
    provider: z.string().trim().max(120).optional(),
    mileage: z.number().nonnegative().max(10000000).nullable(),
    cost: z.number().nonnegative().max(1000000).nullable(),
});
const ResolveSchema = z.object({
    vehicleId: uuid,
    issueId: uuid,
    resolutionNote: z.string().trim().min(2).max(500),
});

function accessError(status: number) {
    const message = status === 401 ? "Sign in required" : status === 403 ? "You cannot access this vehicle" : status === 404 ? "Vehicle not found" : "Could not load vehicle";
    return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
    const vehicleId = new URL(request.url).searchParams.get("vehicleId");
    if (!vehicleId || !uuid.safeParse(vehicleId).success) return NextResponse.json({ error: "Choose a vehicle" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return accessError(access.status);
    const [serviceResult, fuelResult, issueResult] = await Promise.all([
        access.service.from("service_history").select("id,service_date,description,provider_name,mileage,cost,is_verified").eq("vehicle_id", vehicleId).order("service_date", { ascending: false }).limit(50),
        selectFuel(access.service, vehicleId),
        access.service.from("vehicle_issues").select("id,category,note,status,resolution_note,created_at,resolved_at").eq("vehicle_id", vehicleId).order("created_at", { ascending: false }).limit(50),
    ]);
    if (serviceResult.error || fuelResult.error) return NextResponse.json({ error: "Could not load vehicle activity" }, { status: 500 });
    return NextResponse.json({ services: serviceResult.data || [], fuel: fuelResult.data || [], issues: issueResult.data || [], issuesAvailable: !issueResult.error }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const parsed = z.discriminatedUnion("type", [IssueSchema, FuelSchema, ChargeSchema, ServiceSchema]).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Check the information and try again" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return accessError(access.status);

    if (parsed.data.type === "issue") {
        const { error } = await access.service.from("vehicle_issues").insert({
            vehicle_id: parsed.data.vehicleId,
            reported_by: access.member.id,
            category: parsed.data.category,
            note: parsed.data.note || null,
        });
        if (error) return NextResponse.json({ error: "Could not report this issue" }, { status: 500 });
        await reportMajorActivity("Vehicle issue reported", [
            { name: "Category", value: parsed.data.category },
            { name: "Plate", value: access.vehicle.plate },
            { name: "Vehicle ID", value: parsed.data.vehicleId },
            { name: "Reported by", value: access.member.id },
        ]);
        return NextResponse.json({ ok: true }, { status: 201 });
    }

    if (parsed.data.type === "service") {
        // Entries from the owner or driver are kept apart from mechanic-confirmed records.
        const { error } = await access.service.from("service_history").insert({
            vehicle_id: parsed.data.vehicleId,
            service_date: parsed.data.date,
            description: parsed.data.description,
            provider_name: parsed.data.provider || null,
            mileage: parsed.data.mileage,
            cost: parsed.data.cost,
            is_verified: false,
        });
        if (error) return NextResponse.json({ error: "Could not save this service" }, { status: 500 });
        return NextResponse.json({ ok: true }, { status: 201 });
    }

    if (parsed.data.type === "charge") {
        const { error } = await access.service.from("fuel_logs").insert({
            vehicle_id: parsed.data.vehicleId,
            user_id: access.member.id,
            date: parsed.data.date,
            liters: null,
            price_per_liter: null,
            energy_kwh: parsed.data.kwh,
            fuel_type: "electricity",
            total_cost: parsed.data.totalCost,
            odometer_reading: parsed.data.odometer,
        });
        if (error) return NextResponse.json({ error: error.code === "PGRST204" || error.code === "42703" ? "Charging can't be saved yet. Try again later." : "Could not save this charge" }, { status: error.code === "PGRST204" || error.code === "42703" ? 503 : 500 });
        return NextResponse.json({ ok: true }, { status: 201 });
    }

    const { error } = await access.service.from("fuel_logs").insert({
        vehicle_id: parsed.data.vehicleId,
        user_id: access.member.id,
        date: parsed.data.date,
        liters: parsed.data.litres,
        price_per_liter: parsed.data.totalCost / parsed.data.litres,
        total_cost: parsed.data.totalCost,
        odometer_reading: parsed.data.odometer,
    });
    if (error) return NextResponse.json({ error: "Could not save this fuel entry" }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
    const parsed = ResolveSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Add a short outcome note" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);
    const { data, error } = await access.service.from("vehicle_issues")
        .update({ status: "resolved", resolution_note: parsed.data.resolutionNote, resolved_at: new Date().toISOString() })
        .eq("id", parsed.data.issueId).eq("vehicle_id", parsed.data.vehicleId).eq("status", "open").select("id").maybeSingle();
    if (error || !data) return NextResponse.json({ error: "Could not resolve this issue" }, { status: 500 });
    await reportMajorActivity("Vehicle issue resolved", [
        { name: "Plate", value: access.vehicle.plate },
        { name: "Vehicle ID", value: parsed.data.vehicleId },
        { name: "Issue ID", value: parsed.data.issueId },
    ]);
    return NextResponse.json({ ok: true });
}

const FUEL_COLUMNS = "id,date,liters,total_cost,odometer_reading";

/** Fill-ups and charges, newest first. Before the charging migration runs, fill-ups only. */
async function selectFuel(service: ReturnType<typeof getServiceClient>, vehicleId: string) {
    const query = (columns: string) => service.from("fuel_logs").select(columns).eq("vehicle_id", vehicleId).order("date", { ascending: false }).limit(50);
    const result = await query(`${FUEL_COLUMNS},energy_kwh,fuel_type`);
    return result.error?.code === "42703" ? query(FUEL_COLUMNS) : result;
}
