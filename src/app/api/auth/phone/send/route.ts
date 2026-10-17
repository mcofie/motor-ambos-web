import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/serverAuth";
import { sendSms } from "@/lib/sms";
import { CODE_LIFETIME_MINUTES, MAX_SENDS_PER_HOUR, RESEND_AFTER_SECONDS, ghanaMobile, hashCode, newCode } from "@/lib/phoneLogin";

export const dynamic = "force-dynamic";

/** Step 1 of phone sign-in for the mobile apps: texts a 6-digit code to a Ghana number through Hubtel. */
export async function POST(request: Request) {
    const body = await request.json().catch(() => null) as { phone?: unknown } | null;
    const phone = ghanaMobile(body?.phone);
    if (!phone) return NextResponse.json({ error: "Enter a Ghana mobile number, such as 024 123 4567." }, { status: 400 });
    if (!process.env.HUBTEL_SMS_BASIC_AUTH) return NextResponse.json({ error: "Text messages are unavailable right now. Please try again later." }, { status: 503 });

    const service = getServiceClient();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await service.from("phone_login_codes")
        .select("created_at").eq("phone", phone).gte("created_at", hourAgo).order("created_at", { ascending: false });
    if (recentError) {
        console.error("Phone login code lookup failed:", recentError.code, recentError.message);
        return NextResponse.json({ error: "Could not send a code. Please try again." }, { status: 500 });
    }
    if (recent?.length) {
        const waitSeconds = Math.ceil(RESEND_AFTER_SECONDS - (Date.now() - new Date(recent[0].created_at).getTime()) / 1000);
        if (waitSeconds > 0) return NextResponse.json({ error: `Please wait ${waitSeconds} seconds before asking for another code.` }, { status: 429 });
        if (recent.length >= MAX_SENDS_PER_HOUR) return NextResponse.json({ error: "Too many codes requested for this number. Please try again in an hour." }, { status: 429 });
    }

    const id = randomUUID();
    const code = newCode();
    const { error } = await service.from("phone_login_codes").insert({
        id,
        phone,
        code_hash: hashCode(id, code),
        expires_at: new Date(Date.now() + CODE_LIFETIME_MINUTES * 60 * 1000).toISOString(),
    });
    if (error) {
        console.error("Phone login code save failed:", error.code, error.message);
        return NextResponse.json({ error: "Could not send a code. Please try again." }, { status: 500 });
    }

    const sent = await sendSms(phone, `Your Motor Ambos sign-in code is ${code}. It expires in ${CODE_LIFETIME_MINUTES} minutes. Do not share it.`);
    if (!sent) {
        await service.from("phone_login_codes").delete().eq("id", id);
        return NextResponse.json({ error: "We couldn't send the text. Check the number and try again in a moment." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, expiresInSeconds: CODE_LIFETIME_MINUTES * 60, resendAfterSeconds: RESEND_AFTER_SECONDS });
}
