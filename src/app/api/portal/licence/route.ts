import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";

const BUCKET = "vehicle-documents";
const imageTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const DetailsSchema = z.object({
    licenceNumber: z.string().trim().max(40).nullable(),
    licenceClass: z.string().trim().max(20).nullable(),
    expiresOn: z.iso.date().nullable(),
});
const PrivacySchema = z.object({ showOnFleetCards: z.boolean() });

async function currentMember() {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle();
    return member ? { service, memberId: member.id as string } : null;
}

export async function GET(request: Request) {
    const session = await currentMember();
    if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const columns = "licence_number,licence_class,expires_on,front_path,back_path";
    let { data, error } = await session.service.from("driver_licences").select(`${columns},photo_path,show_on_fleet_cards`).eq("member_id", session.memberId).maybeSingle();
    // Until the profile photo migration runs, load everything else.
    if (error?.code === "42703") ({ data, error } = await session.service.from("driver_licences").select(columns).eq("member_id", session.memberId).maybeSingle());
    if (error) return NextResponse.json({ error: "Could not load your driver profile" }, { status: 500 });
    const photoPath = (data as { photo_path?: string | null } | null)?.photo_path || null;

    const side = new URL(request.url).searchParams.get("photo");
    if (side === "front" || side === "back" || side === "profile") {
        const path = side === "front" ? data?.front_path : side === "back" ? data?.back_path : photoPath;
        if (!path) return NextResponse.json({ error: "No photo" }, { status: 404 });
        const { data: signed } = await session.service.storage.from(BUCKET).createSignedUrl(path, 60);
        return signed?.signedUrl ? NextResponse.redirect(signed.signedUrl) : NextResponse.json({ error: "Could not open photo" }, { status: 500 });
    }

    return NextResponse.json({
        available: true,
        licence: data ? {
            licenceNumber: data.licence_number,
            licenceClass: data.licence_class,
            expiresOn: data.expires_on,
            hasFront: Boolean(data.front_path),
            hasPhoto: Boolean(photoPath),
            showOnFleetCards: (data as { show_on_fleet_cards?: boolean }).show_on_fleet_cards !== false,
            hasBack: Boolean(data.back_path),
        } : null,
    }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
    const session = await currentMember();
    if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const body = await request.json().catch(() => null);
    const privacy = PrivacySchema.safeParse(body);
    if (privacy.success) {
        const { error } = await session.service.from("driver_licences").upsert({ member_id: session.memberId, show_on_fleet_cards: privacy.data.showOnFleetCards, updated_at: new Date().toISOString() }, { onConflict: "member_id" });
        return error ? NextResponse.json({ error: "Could not save your choice" }, { status: 500 }) : NextResponse.json({ ok: true });
    }
    const parsed = DetailsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Check the licence details and try again" }, { status: 400 });
    const { error } = await session.service.from("driver_licences").upsert({
        member_id: session.memberId,
        licence_number: parsed.data.licenceNumber?.toUpperCase() || null,
        licence_class: parsed.data.licenceClass?.toUpperCase() || null,
        expires_on: parsed.data.expiresOn,
        updated_at: new Date().toISOString(),
    }, { onConflict: "member_id" });
    if (error) return NextResponse.json({ error: "Could not save your licence" }, { status: 500 });
    return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
    const session = await currentMember();
    if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const form = await request.formData().catch(() => null);
    const side = form?.get("side");
    const file = form?.get("file");
    if ((side !== "front" && side !== "back" && side !== "profile") || !(file instanceof File)) return NextResponse.json({ error: "Choose a photo" }, { status: 400 });
    const extension = imageTypes[file.type];
    if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Use a photo under 5 MB" }, { status: 400 });

    const column = side === "front" ? "front_path" : side === "back" ? "back_path" : "photo_path";
    const { data: previous } = await session.service.from("driver_licences").select(column).eq("member_id", session.memberId).maybeSingle();
    const path = side === "profile" ? `profiles/${session.memberId}/${crypto.randomUUID()}.${extension}` : `licences/${session.memberId}/${side}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await session.service.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: "Could not upload the photo" }, { status: 500 });
    const { error } = await session.service.from("driver_licences").upsert({ member_id: session.memberId, [column]: path, updated_at: new Date().toISOString() }, { onConflict: "member_id" });
    if (error) {
        await session.service.storage.from(BUCKET).remove([path]);
        return NextResponse.json({ error: "Could not save the photo" }, { status: 500 });
    }
    const oldPath = (previous as Record<string, string | null> | null)?.[column];
    if (oldPath) await session.service.storage.from(BUCKET).remove([oldPath]);
    return NextResponse.json({ ok: true }, { status: 201 });
}
