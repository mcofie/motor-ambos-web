import { NextResponse } from "next/server";
import { z } from "zod";
import { canManageFleet, getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { normalizePhone, phoneVariants } from "@/lib/phone";

const DriverSchema = z.object({
    orgId: z.string().uuid(),
    fullName: z.string().trim().min(2).max(100),
    email: z.email(),
    phone: z.string().trim().refine((value) => Boolean(normalizePhone(value))),
    vehicleId: z.string().uuid().nullable(),
});

export async function POST(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const parsed = DriverSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Enter driver details and a valid email" }, { status: 400 });
    const phone = normalizePhone(parsed.data.phone);
    if (!phone) return NextResponse.json({ error: "Enter a valid phone number, such as +233558508306." }, { status: 400 });

    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id,is_business").eq("auth_user_id", user.id).maybeSingle();
    if (!member) return NextResponse.json({ error: "Complete your profile first" }, { status: 403 });
    const isOwner = member.is_business && member.id === parsed.data.orgId;
    if (!await canManageFleet(service, member.id, parsed.data.orgId)) return NextResponse.json({ error: "Fleet manager access required" }, { status: 403 });

    if (parsed.data.vehicleId) {
        const { data: vehicle } = await service.from("vehicles").select("id,user_id").eq("id", parsed.data.vehicleId).maybeSingle();
        if (!vehicle || vehicle.user_id !== parsed.data.orgId && !(isOwner && vehicle.user_id === user.id))
            return NextResponse.json({ error: "Choose a vehicle from this fleet" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const [{ data: existing, error: lookupError }, { data: phoneMatches, error: phoneLookupError }] = await Promise.all([
        service.from("members").select("id,phone").eq("email", email).maybeSingle(),
        service.from("members").select("id,email").in("phone", phoneVariants(phone)).limit(2),
    ]);
    if (lookupError) return NextResponse.json({ error: "Could not look up driver" }, { status: 500 });
    if (phoneLookupError) return NextResponse.json({ error: "Could not check the phone number" }, { status: 500 });
    if ((phoneMatches?.length || 0) > 1 || phoneMatches?.some((row) => row.id !== existing?.id)) return NextResponse.json({ error: "That phone number is already on another profile." }, { status: 409 });
    if (existing?.phone && normalizePhone(existing.phone) !== phone) return NextResponse.json({ error: "That email belongs to a profile with a different phone number." }, { status: 409 });
    let driverId = existing?.id;
    if (!driverId) {
        const { data: created, error: createError } = await service.from("members").insert({
            full_name: parsed.data.fullName,
            phone,
            email,
            is_business: false,
        }).select("id").single();
        if (createError || !created) return NextResponse.json({ error: "Could not add driver. Check whether the phone is already used by another account." }, { status: 409 });
        driverId = created.id;
    }

    const { data: existingLink } = await service.from("organization_members").select("role").eq("org_member_id", parsed.data.orgId).eq("member_id", driverId).maybeSingle();
    if (existingLink?.role === "ADMIN") return NextResponse.json({ error: "This person is already a fleet manager" }, { status: 409 });
    const { error: linkError } = await service.from("organization_members").upsert({
        org_member_id: parsed.data.orgId,
        member_id: driverId,
        vehicle_id: parsed.data.vehicleId,
        role: "DRIVER",
    }, { onConflict: "org_member_id,member_id" });
    if (linkError) return NextResponse.json({ error: "Could not assign driver" }, { status: 500 });
    return NextResponse.json({ ok: true });
}
