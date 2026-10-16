import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/webhookSignature";
import { normalizePhone } from "@/lib/phone";
import { sendSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

/**
 * Supabase Auth "Send SMS" hook: texts sign-in codes through Hubtel, from "MotorAmbos".
 * Set it up in Supabase under Authentication → Hooks, pointing at this route, and put the
 * hook's secret in SEND_SMS_HOOK_SECRET. Only Ghana numbers are accepted for now.
 */
type HookPayload = { user?: { phone?: string | null }; sms?: { otp?: string | null } };

function hookError(status: number, message: string) {
    return NextResponse.json({ error: { http_code: status, message } }, { status });
}

export async function POST(request: Request) {
    const secret = process.env.SEND_SMS_HOOK_SECRET;
    if (!secret) return hookError(500, "Text messages are not set up.");

    const body = await request.text();
    const signed = verifyWebhookSignature(body, {
        id: request.headers.get("webhook-id"),
        timestamp: request.headers.get("webhook-timestamp"),
        signature: request.headers.get("webhook-signature"),
    }, secret);
    if (!signed) return hookError(401, "Invalid hook signature.");

    let payload: HookPayload;
    try {
        payload = JSON.parse(body) as HookPayload;
    } catch {
        return hookError(400, "Invalid hook payload.");
    }
    const phone = normalizePhone(payload.user?.phone ? `+${payload.user.phone.replace(/^\+/, "")}` : null);
    const otp = payload.sms?.otp;
    if (!phone || !otp) return hookError(400, "Missing phone or code.");
    if (!phone.startsWith("+233")) return hookError(400, "Motor Ambos sign-in works with Ghana numbers only for now.");

    const sent = await sendSms(phone, `Your Motor Ambos sign-in code is ${otp}. It expires in 10 minutes. Do not share it.`);
    if (!sent) return hookError(502, "Could not send the code. Please try again in a moment.");
    return NextResponse.json({});
}
