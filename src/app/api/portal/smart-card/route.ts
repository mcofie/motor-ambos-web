import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalVehicleAccess } from "@/lib/portalAccess";
import { reportMajorActivity } from "@/lib/discordActivity";
import { defaultShare, shareKeys, type ShareSettings } from "@/lib/smartCard";

const uuid = z.string().uuid();
const LinkSchema = z.object({ vehicleId: uuid, code: z.string().trim().min(4).max(200) });
const ShareSchema = z.object({ vehicleId: uuid, share: z.object(Object.fromEntries(shareKeys.map((key) => [key, z.boolean()])) as Record<keyof ShareSettings, z.ZodBoolean>) });

function accessError(status: number) {
    const message = status === 401 ? "Sign in required" : status === 403 ? "Only the owner or fleet manager can change this car's Smart Card" : status === 404 ? "Vehicle not found" : "Could not load vehicle";
    return NextResponse.json({ error: message }, { status });
}

function newPublicId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
}

/** People may type the printed card number, the code after /v/, or paste the whole link. */
function readCode(raw: string) {
    const trimmed = raw.trim();
    const fromLink = trimmed.match(/\/v\/([A-Za-z0-9_-]+)/);
    return fromLink ? fromLink[1] : trimmed.replace(/\s+/g, "");
}

export async function GET(request: Request) {
    const vehicleId = new URL(request.url).searchParams.get("vehicleId") || "";
    if (!uuid.safeParse(vehicleId).success) return NextResponse.json({ error: "Choose a vehicle" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return accessError(access.status);
    let { data, error } = await access.service.from("vehicles").select("nfc_card_id,nfc_serial_number,public_share").eq("id", vehicleId).maybeSingle();
    // Until the sharing migration runs, show the default sharing choices.
    if (error?.code === "42703") ({ data, error } = await access.service.from("vehicles").select("nfc_card_id,nfc_serial_number").eq("id", vehicleId).maybeSingle());
    if (error || !data) return NextResponse.json({ error: "Could not load the Smart Card" }, { status: 500 });
    return NextResponse.json({
        linked: Boolean(data.nfc_card_id),
        publicId: data.nfc_card_id,
        serial: data.nfc_serial_number,
        share: { ...defaultShare, ...((data as { public_share?: object }).public_share || {}) },
        canEdit: access.canEdit,
    }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const parsed = LinkSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Enter the card number printed on your Smart Card" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);

    const code = readCode(parsed.data.code);
    const bySerial = await access.service.from("nfc_cards").select("id,serial_number,public_id,status").ilike("serial_number", code.replace(/[%_\\]/g, (match) => `\\${match}`)).maybeSingle();
    const card = bySerial.data || (await access.service.from("nfc_cards").select("id,serial_number,public_id,status").eq("public_id", code).maybeSingle()).data;
    if (!card) return NextResponse.json({ error: "We could not find that card. Check the number printed on the back." }, { status: 404 });
    if (card.status === "VOID") return NextResponse.json({ error: "This card has been cancelled. Contact support for a replacement." }, { status: 409 });

    const { data: holder } = card.public_id ? await access.service.from("vehicles").select("id").eq("nfc_card_id", card.public_id).maybeSingle() : { data: null };
    if (holder && holder.id !== access.vehicle.id) return NextResponse.json({ error: "This card is already linked to another car. Unlink it there first." }, { status: 409 });

    const publicId = card.public_id || newPublicId();
    if (!card.public_id) {
        const { error } = await access.service.from("nfc_cards").update({ public_id: publicId }).eq("id", card.id);
        if (error) return NextResponse.json({ error: "Could not prepare this card" }, { status: 500 });
    }

    const { data: current } = await access.service.from("vehicles").select("nfc_serial_number").eq("id", access.vehicle.id).maybeSingle();
    const { error } = await access.service.from("vehicles").update({ nfc_card_id: publicId, nfc_serial_number: card.serial_number }).eq("id", access.vehicle.id);
    if (error) return NextResponse.json({ error: "Could not link the card" }, { status: 500 });
    await access.service.from("nfc_cards").update({ status: "ASSIGNED" }).eq("id", card.id);
    if (current?.nfc_serial_number && current.nfc_serial_number !== card.serial_number) {
        await access.service.from("nfc_cards").update({ status: "MANUFACTURED" }).eq("serial_number", current.nfc_serial_number);
    }

    await reportMajorActivity("Smart Card linked", [
        { name: "Plate", value: access.vehicle.plate },
        { name: "Card", value: card.serial_number },
        { name: "Vehicle ID", value: access.vehicle.id },
    ]);
    return NextResponse.json({ ok: true, publicId, serial: card.serial_number }, { status: 201 });
}

export async function PATCH(request: Request) {
    const parsed = ShareSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Choose what to share" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);
    const { error } = await access.service.from("vehicles").update({ public_share: parsed.data.share }).eq("id", access.vehicle.id);
    if (error) return NextResponse.json({ error: "Could not save your choices" }, { status: 500 });
    return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
    const vehicleId = new URL(request.url).searchParams.get("vehicleId") || "";
    if (!uuid.safeParse(vehicleId).success) return NextResponse.json({ error: "Choose a vehicle" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);
    const { data: current } = await access.service.from("vehicles").select("nfc_serial_number").eq("id", vehicleId).maybeSingle();
    const { error } = await access.service.from("vehicles").update({ nfc_card_id: null, nfc_serial_number: null }).eq("id", vehicleId);
    if (error) return NextResponse.json({ error: "Could not unlink the card" }, { status: 500 });
    if (current?.nfc_serial_number) await access.service.from("nfc_cards").update({ status: "MANUFACTURED" }).eq("serial_number", current.nfc_serial_number);
    return NextResponse.json({ ok: true });
}
