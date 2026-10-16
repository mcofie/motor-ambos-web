import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies a Standard Webhooks signature, which Supabase Auth hooks use.
 * The secret looks like "v1,whsec_<base64>"; the signature header can hold several "v1,<base64>" values.
 */
export function verifyWebhookSignature(
    body: string,
    headers: { id: string | null; timestamp: string | null; signature: string | null },
    secret: string,
    toleranceSeconds = 5 * 60,
): boolean {
    const { id, timestamp, signature } = headers;
    if (!id || !timestamp || !signature) return false;
    const sentAt = Number(timestamp);
    if (!Number.isFinite(sentAt) || Math.abs(Date.now() / 1000 - sentAt) > toleranceSeconds) return false;

    const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
    const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
    return signature.split(" ").some((part) => {
        const [version, value] = part.split(",");
        if (version !== "v1" || !value) return false;
        const received = Buffer.from(value, "base64");
        return received.length === expected.length && timingSafeEqual(received, expected);
    });
}
