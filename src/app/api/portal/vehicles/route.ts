import { NextResponse } from "next/server";
import { z } from "zod";
import { canManageFleet, getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { reportMajorActivity } from "@/lib/discordActivity";

const VehicleSchema = z.object({
    make: z.string().trim().min(2).max(60),
    model: z.string().trim().min(1).max(60),
    plate: z.string().trim().min(2).max(30),
    year: z.string().trim().regex(/^\d{4}$/).optional().or(z.literal("")),
    color: z.string().trim().max(40).optional(),
    orgId: z.string().uuid().optional(),
    powertrain: z.enum(["ice", "hybrid", "ev"]).optional(),
});

export async function POST(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const parsed = VehicleSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Enter a make, model, and plate number" }, { status: 400 });

    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id,is_business").eq("auth_user_id", user.id).maybeSingle();
    if (!member) return NextResponse.json({ error: "Complete your profile first" }, { status: 403 });

    let ownerId = member.is_business ? user.id : member.id;
    if (parsed.data.orgId) {
        const orgId = parsed.data.orgId;
        if (!await canManageFleet(service, member.id, orgId)) return NextResponse.json({ error: "Fleet manager access required" }, { status: 403 });
        ownerId = orgId;
    }

    const row = {
        user_id: ownerId,
        make: parsed.data.make,
        model: parsed.data.model,
        plate: parsed.data.plate.toUpperCase(),
        year: parsed.data.year || null,
        color: parsed.data.color || null,
        is_primary: false,
    };
    let { data, error } = await service.from("vehicles").insert({ ...row, powertrain: parsed.data.powertrain ?? null }).select("id").single();
    // Until the powertrain migration runs, add the car without it rather than failing.
    if (error?.code === "42703" || error?.code === "PGRST204") ({ data, error } = await service.from("vehicles").insert(row).select("id").single());
    if (error || !data) return NextResponse.json({ error: "Could not add this vehicle" }, { status: 500 });
    await reportMajorActivity("Vehicle added", [
        { name: "Vehicle", value: [parsed.data.year, parsed.data.make, parsed.data.model].filter(Boolean).join(" ") },
        { name: "Plate", value: parsed.data.plate.toUpperCase() },
        { name: "Fleet ID", value: parsed.data.orgId || null },
        { name: "Vehicle ID", value: data.id },
    ]);
    return NextResponse.json({ id: data.id }, { status: 201 });
}
