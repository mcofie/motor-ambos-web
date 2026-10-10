import { NextResponse } from "next/server";
import { z } from "zod";
import { canManageFleet, getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";

const DocumentSchema = z.object({
    vehicleId: z.string().uuid(),
    kind: z.enum(["insurance", "roadworthy"]),
    expiresOn: z.iso.date().nullable(),
});

export async function PUT(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const parsed = DocumentSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Choose a document and expiry date" }, { status: 400 });

    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id,is_business").eq("auth_user_id", user.id).maybeSingle();
    if (!member) return NextResponse.json({ error: "Complete your profile first" }, { status: 403 });
    const { data: vehicle } = await service.from("vehicles").select("id,user_id").eq("id", parsed.data.vehicleId).maybeSingle();
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

    let allowed = vehicle.user_id === user.id || vehicle.user_id === member.id;
    if (!allowed) {
        allowed = await canManageFleet(service, member.id, vehicle.user_id);
    }
    if (!allowed) return NextResponse.json({ error: "You cannot edit this vehicle" }, { status: 403 });

    const column = parsed.data.kind === "insurance" ? "insurance_end_date" : "roadworthy_expiry";
    const { error } = await service.from("vehicles").update({ [column]: parsed.data.expiresOn }).eq("id", vehicle.id);
    if (error) return NextResponse.json({ error: "Could not save the expiry date" }, { status: 500 });
    return NextResponse.json({ ok: true });
}
