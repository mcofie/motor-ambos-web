import { realEmail } from "@/lib/phoneLogin";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { normalizePhone, phoneVariants } from "@/lib/phone";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "motorambos-account-claim";
const CLAIM_LIFETIME_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 5;
const SendSchema = z.object({ action: z.literal("send"), phone: z.string().trim().refine((value) => Boolean(normalizePhone(value))) });
const VerifySchema = z.object({ action: z.literal("verify"), code: z.string().trim().regex(/^\d{8}$/) });

type Claim = { userId: string; memberId: string; originalEmailHash: string; nonce: string; codeHash: string; expiresAt: number; attempts: number };
const sendLimits = new Map<string, { count: number; resetAt: number }>();
const phoneLimits = new Map<string, { count: number; resetAt: number }>();

function secret() {
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!value) throw new Error("Missing server secret");
    return value;
}

function mac(purpose: string, value: string) {
    return createHmac("sha256", secret()).update(`${purpose}:${value}`).digest("hex");
}

function signedClaim(claim: Claim) {
    const payload = Buffer.from(JSON.stringify(claim)).toString("base64url");
    return `${payload}.${mac("claim-cookie", payload)}`;
}

function readClaim(value?: string): Claim | null {
    if (!value) return null;
    const [payload, signature] = value.split(".");
    if (!payload || !signature || signature.length !== 64) return null;
    const expected = Buffer.from(mac("claim-cookie", payload), "hex");
    const received = Buffer.from(signature, "hex");
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    try {
        const claim = JSON.parse(Buffer.from(payload, "base64url").toString()) as Claim;
        return claim.expiresAt > Date.now() && claim.attempts > 0 ? claim : null;
    } catch {
        return null;
    }
}

function setClaimCookie(response: NextResponse, claim: Claim | null) {
    if (!claim) {
        response.cookies.set(COOKIE_NAME, "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/portal/claim",
            maxAge: 0,
        });
    } else {
        response.cookies.set(COOKIE_NAME, signedClaim(claim), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/portal/claim",
            maxAge: CLAIM_LIFETIME_SECONDS,
        });
    }
    return response;
}

export async function POST(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    // Phone logins link their profile at sign-in; this flow is for email logins only.
    const email = realEmail(user.email);
    if (!email || !user.email_confirmed_at) {
        return NextResponse.json({ error: "Confirm your account email before verifying this phone" }, { status: 403 });
    }
    const body = await request.json().catch(() => null);
    const service = getServiceClient();

    if (body?.action === "send") {
        const parsed = SendSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
        const phone = normalizePhone(parsed.data.phone);
        if (!phone) return NextResponse.json({ error: "Enter a valid phone number, such as +233558508306." }, { status: 400 });
        const smsAuth = process.env.HUBTEL_SMS_BASIC_AUTH;
        if (!smsAuth) return NextResponse.json({ error: "Phone verification is unavailable. Please contact support@motorambos.com." }, { status: 503 });
        const now = Date.now();
        const limit = sendLimits.get(user.id);
        if (limit && limit.resetAt > now && limit.count >= 3) {
            return NextResponse.json({ error: "Too many codes requested. Please try again later." }, { status: 429 });
        }

        const { data: matches, error: lookupError } = await service.from("members")
            .select("id,email,auth_user_id,phone")
            .in("phone", phoneVariants(phone))
            .limit(2);
        if (lookupError) return NextResponse.json({ error: "Could not check this profile" }, { status: 500 });
        if ((matches?.length || 0) > 1) return NextResponse.json({ error: "Multiple profiles use this phone. Please contact support@motorambos.com." }, { status: 409 });
        const member = matches?.[0];
        if (!member || member.auth_user_id) {
            return NextResponse.json({ error: "This profile needs help from support@motorambos.com to connect." }, { status: 409 });
        }
        const phoneLimit = phoneLimits.get(member.id);
        if (phoneLimit && phoneLimit.resetAt > now && phoneLimit.count >= 3) {
            return NextResponse.json({ error: "Too many codes requested for this phone. Please try again later." }, { status: 429 });
        }

        const code = randomInt(0, 100_000_000).toString().padStart(8, "0");
        const nonce = randomBytes(16).toString("hex");
        const claim: Claim = {
            userId: user.id,
            memberId: member.id,
            originalEmailHash: mac("original-email", (member.email || "").trim().toLowerCase()),
            nonce,
            codeHash: mac("claim-code", `${user.id}:${member.id}:${nonce}:${code}`),
            expiresAt: now + CLAIM_LIFETIME_SECONDS * 1000,
            attempts: MAX_ATTEMPTS,
        };
        const smsResponse = await fetch("https://smsc.hubtel.com/v1/messages/send", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: smsAuth },
            body: JSON.stringify({ from: "MotorAmbos", to: phone, content: `Your Motor Ambos account verification code is ${code}. It expires in 10 minutes. Do not share it.` }),
            cache: "no-store",
        }).catch(() => null);
        if (!smsResponse?.ok) return NextResponse.json({ error: "Could not send a code. Please try again later." }, { status: 502 });
        sendLimits.set(user.id, { count: limit && limit.resetAt > now ? limit.count + 1 : 1, resetAt: limit && limit.resetAt > now ? limit.resetAt : now + 60 * 60 * 1000 });
        phoneLimits.set(member.id, { count: phoneLimit && phoneLimit.resetAt > now ? phoneLimit.count + 1 : 1, resetAt: phoneLimit && phoneLimit.resetAt > now ? phoneLimit.resetAt : now + 60 * 60 * 1000 });
        return setClaimCookie(NextResponse.json({ ok: true, message: "Code sent to the phone on your existing profile." }), claim);
    }

    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Enter the 8-digit code" }, { status: 400 });
    const cookieStore = await cookies();
    const claim = readClaim(cookieStore.get(COOKIE_NAME)?.value);
    if (!claim || claim.userId !== user.id) return NextResponse.json({ error: "This code expired. Request a new one." }, { status: 400 });
    const enteredHash = Buffer.from(mac("claim-code", `${user.id}:${claim.memberId}:${claim.nonce}:${parsed.data.code}`), "hex");
    const expectedHash = Buffer.from(claim.codeHash, "hex");
    if (enteredHash.length !== expectedHash.length || !timingSafeEqual(enteredHash, expectedHash)) {
        const next = { ...claim, attempts: claim.attempts - 1 };
        return setClaimCookie(NextResponse.json({ error: next.attempts > 0 ? "That code is incorrect. Please try again." : "Too many attempts. Request a new code." }, { status: 400 }), next.attempts > 0 ? next : null);
    }

    const { data: current, error: currentError } = await service.from("members")
        .select("id,email,auth_user_id")
        .eq("id", claim.memberId)
        .maybeSingle();
    if (currentError || !current || current.auth_user_id || mac("original-email", (current.email || "").trim().toLowerCase()) !== claim.originalEmailHash) {
        return setClaimCookie(NextResponse.json({ error: "This profile changed while you were verifying it. Please contact support@motorambos.com." }, { status: 409 }), null);
    }
    let update = service.from("members")
        .update({ auth_user_id: user.id, email: email.trim().toLowerCase() })
        .eq("id", claim.memberId)
        .is("auth_user_id", null);
    update = current.email ? update.eq("email", current.email) : update.is("email", null);
    const { data: updated, error } = await update.select("id").maybeSingle();
    if (error || !updated) {
        return setClaimCookie(NextResponse.json({ error: "This profile could not be connected. Please contact support@motorambos.com." }, { status: 409 }), null);
    }
    return setClaimCookie(NextResponse.json({ ok: true }), null);
}
