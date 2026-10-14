import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalVehicleAccess } from "@/lib/portalAccess";
import { reportMajorActivity } from "@/lib/discordActivity";
import { normalizePhone } from "@/lib/phone";
import { normaliseClaimCode } from "@/lib/cardClaim";
import { linkCardToVehicle } from "@/lib/cardLink";
import { defaultShare, shareKeys, type ShareSettings } from "@/lib/smartCard";

export const dynamic = "force-dynamic";

const uuid = z.string().uuid();
const StartSchema = z.object({ action: z.literal("start"), vehicleId: uuid, code: z.string().trim().min(4).max(200), claimCode: z.string().trim().min(6).max(30) });
const VerifySchema = z.object({ action: z.literal("verify"), otp: z.string().trim().regex(/^\d{6}$/) });
const ShareSchema = z.object({ vehicleId: uuid, share: z.object(Object.fromEntries(shareKeys.map((key) => [key, z.boolean()])) as Record<keyof ShareSettings, z.ZodBoolean>) });

const COOKIE_NAME = "motorambos-card-claim";
const OTP_LIFETIME_SECONDS = 10 * 60;
const MAX_CODE_FAILURES = 5;
const LOCK_MINUTES = 30;
const NOT_FOUND = "We could not match that card number and claim code. Check both on the back of the card.";
const sendLimits = new Map<string, { count: number; resetAt: number }>();

type Pending = { userId: string; memberId: string; vehicleId: string; cardId: string; nonce: string; otpHash: string; expiresAt: number; attempts: number };

function mac(purpose: string, value: string) {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) throw new Error("Missing server secret");
    return createHmac("sha256", secret).update(`${purpose}:${value}`).digest("hex");
}

function sameText(a: string, b: string) {
    const left = Buffer.from(mac("compare", a), "hex"), right = Buffer.from(mac("compare", b), "hex");
    return timingSafeEqual(left, right);
}

function readPending(value?: string): Pending | null {
    const [payload, signature] = (value || "").split(".");
    if (!payload || signature?.length !== 64 || !sameText(signature, mac("card-claim", payload))) return null;
    try {
        const pending = JSON.parse(Buffer.from(payload, "base64url").toString()) as Pending;
        return pending.expiresAt > Date.now() && pending.attempts > 0 ? pending : null;
    } catch {
        return null;
    }
}

function withPending(response: NextResponse, pending: Pending | null) {
    const payload = pending ? Buffer.from(JSON.stringify(pending)).toString("base64url") : "";
    response.cookies.set(COOKIE_NAME, pending ? `${payload}.${mac("card-claim", payload)}` : "", {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/portal/smart-card", maxAge: pending ? OTP_LIFETIME_SECONDS : 0,
    });
    return response;
}

function accessError(status: number) {
    const message = status === 401 ? "Sign in required" : status === 403 ? "Only the owner or fleet manager can change this car's Smart Card" : status === 404 ? "Vehicle not found" : "Could not load vehicle";
    return NextResponse.json({ error: message }, { status });
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
    const body = await request.json().catch(() => null);
    return body?.action === "verify" ? verifyClaim(body) : startClaim(body);
}

/** Step 1: the card number and printed claim code must match, then we text a code to the account holder. */
async function startClaim(body: unknown) {
    const parsed = StartSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Enter the card number and the claim code printed on the back of the card" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);

    const code = readCode(parsed.data.code);
    const columns = "id,serial_number,public_id,status,claim_code,claim_failed_attempts,claim_locked_until";
    const bySerial = await access.service.from("nfc_cards").select(columns).ilike("serial_number", code.replace(/[%_\\]/g, (match) => `\\${match}`)).maybeSingle();
    const card = bySerial.data || (await access.service.from("nfc_cards").select(columns).eq("public_id", code).maybeSingle()).data;
    if (!card) return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    if (card.claim_locked_until && new Date(card.claim_locked_until).getTime() > Date.now()) {
        return NextResponse.json({ error: `Too many wrong codes for this card. Try again in ${LOCK_MINUTES} minutes, or contact support@motorambos.com.` }, { status: 429 });
    }

    if (!sameText(normaliseClaimCode(parsed.data.claimCode), normaliseClaimCode(card.claim_code))) {
        const failures = (card.claim_failed_attempts || 0) + 1;
        const locked = failures >= MAX_CODE_FAILURES;
        await access.service.from("nfc_cards").update({
            claim_failed_attempts: locked ? 0 : failures,
            claim_locked_until: locked ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : null,
        }).eq("id", card.id);
        return NextResponse.json({ error: locked ? `Too many wrong codes for this card. Try again in ${LOCK_MINUTES} minutes.` : NOT_FOUND }, { status: locked ? 429 : 404 });
    }
    if (card.claim_failed_attempts) await access.service.from("nfc_cards").update({ claim_failed_attempts: 0 }).eq("id", card.id);
    if (card.status === "VOID") return NextResponse.json({ error: "This card has been cancelled. Contact support for a replacement." }, { status: 409 });
    const { data: holder } = card.public_id ? await access.service.from("vehicles").select("id").eq("nfc_card_id", card.public_id).maybeSingle() : { data: null };
    if (holder && holder.id !== access.vehicle.id) return NextResponse.json({ error: "This card is already linked to another car. Unlink it there first." }, { status: 409 });

    const { data: member } = await access.service.from("members").select("phone").eq("id", access.member.id).maybeSingle();
    const phone = normalizePhone(member?.phone || "");
    if (!phone) return NextResponse.json({ error: "Add a phone number to your account so we can text you a code." }, { status: 409 });
    const smsAuth = process.env.HUBTEL_SMS_BASIC_AUTH;
    if (!smsAuth) return NextResponse.json({ error: "Text-message codes are unavailable right now. Contact support@motorambos.com." }, { status: 503 });
    const now = Date.now();
    const limit = sendLimits.get(access.user.id);
    if (limit && limit.resetAt > now && limit.count >= 3) return NextResponse.json({ error: "Too many codes requested. Try again later." }, { status: 429 });

    const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const nonce = randomBytes(16).toString("hex");
    const pending: Pending = { userId: access.user.id, memberId: access.member.id, vehicleId: access.vehicle.id, cardId: card.id, nonce, otpHash: mac("card-otp", `${access.user.id}:${card.id}:${nonce}:${otp}`), expiresAt: now + OTP_LIFETIME_SECONDS * 1000, attempts: 5 };
    const sms = await fetch("https://smsc.hubtel.com/v1/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: smsAuth },
        body: JSON.stringify({ from: "MotorAmbos", to: phone, content: `Your Motor Ambos code to link Smart Card ${card.serial_number} to ${access.vehicle.plate || "your car"} is ${otp}. It expires in 10 minutes. Do not share it.` }),
        cache: "no-store",
    }).catch(() => null);
    if (!sms?.ok) return NextResponse.json({ error: "Could not send the code. Try again in a moment." }, { status: 502 });
    sendLimits.set(access.user.id, { count: limit && limit.resetAt > now ? limit.count + 1 : 1, resetAt: limit && limit.resetAt > now ? limit.resetAt : now + 60 * 60 * 1000 });
    return withPending(NextResponse.json({ ok: true, serial: card.serial_number, phoneHint: `•••• ${phone.slice(-4)}` }), pending);
}

/** Step 2: the texted code confirms it is really the account holder, then the card is linked. */
async function verifyClaim(body: unknown) {
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Enter the 6-digit code we texted you" }, { status: 400 });
    const pending = readPending((await cookies()).get(COOKIE_NAME)?.value);
    if (!pending) return NextResponse.json({ error: "This code expired. Start again to get a new one." }, { status: 400 });
    const access = await getPortalVehicleAccess(pending.vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit || access.user.id !== pending.userId) return withPending(accessError(403), null);

    const expected = mac("card-otp", `${pending.userId}:${pending.cardId}:${pending.nonce}:${parsed.data.otp}`);
    if (!sameText(expected, pending.otpHash)) {
        const next = { ...pending, attempts: pending.attempts - 1 };
        return withPending(NextResponse.json({ error: next.attempts > 0 ? "That code is not right. Check the text and try again." : "Too many attempts. Start again to get a new code." }, { status: 400 }), next.attempts > 0 ? next : null);
    }

    const { data: card } = await access.service.from("nfc_cards").select("id,serial_number,public_id,status").eq("id", pending.cardId).maybeSingle();
    if (!card || card.status === "VOID") return withPending(NextResponse.json({ error: "This card can no longer be linked." }, { status: 409 }), null);
    const { data: holder } = card.public_id ? await access.service.from("vehicles").select("id").eq("nfc_card_id", card.public_id).maybeSingle() : { data: null };
    if (holder && holder.id !== access.vehicle.id) return withPending(NextResponse.json({ error: "This card was linked to another car in the meantime." }, { status: 409 }), null);

    let publicId: string;
    try {
        publicId = await linkCardToVehicle(access.service, card, access.vehicle.id);
    } catch (reason) {
        return NextResponse.json({ error: reason instanceof Error ? reason.message : "Could not link the card" }, { status: 500 });
    }
    await reportMajorActivity("Smart Card linked", [
        { name: "Plate", value: access.vehicle.plate },
        { name: "Card", value: card.serial_number },
        { name: "Vehicle ID", value: access.vehicle.id },
    ]);
    return withPending(NextResponse.json({ ok: true, publicId, serial: card.serial_number }, { status: 201 }), null);
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
