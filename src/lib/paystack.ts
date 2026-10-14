import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.paystack.co";

export const paystackReady = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("Paystack is not configured");
    const response = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...(init?.headers || {}) }, cache: "no-store" });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.status) throw new Error(result?.message || "Paystack request failed");
    return result.data as T;
}

/** Starts a Paystack checkout in Ghana cedis. Amounts are in pesewas. */
export function initializePayment(input: { email: string; amountPesewas: number; reference: string; callbackUrl: string; phone?: string; metadata?: Record<string, unknown> }) {
    return paystack<{ authorization_url: string; reference: string }>("/transaction/initialize", {
        method: "POST",
        body: JSON.stringify({
            email: input.email,
            amount: input.amountPesewas,
            currency: "GHS",
            reference: input.reference,
            callback_url: input.callbackUrl,
            channels: ["mobile_money", "card"],
            metadata: { ...input.metadata, phone: input.phone },
        }),
    });
}

export function verifyPayment(reference: string) {
    return paystack<{ status: string; amount: number; currency: string; reference: string; paid_at: string | null }>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Paystack signs each webhook body with HMAC-SHA512 using the secret key. */
export function validWebhookSignature(rawBody: string, signature: string | null) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret || !signature) return false;
    const expected = Buffer.from(createHmac("sha512", secret).update(rawBody).digest("hex"));
    const received = Buffer.from(signature);
    return expected.length === received.length && timingSafeEqual(expected, received);
}
