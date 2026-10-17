import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { normalizePhone } from "@/lib/phone";

/** Phone sign-in for the mobile apps: codes are sent through Hubtel and checked here, not by Supabase. */

export const CODE_LIFETIME_MINUTES = 10;
export const MAX_ATTEMPTS = 5;
export const RESEND_AFTER_SECONDS = 60;
export const MAX_SENDS_PER_HOUR = 5;

/** A Ghana mobile number as +233XXXXXXXXX (MTN, Telecel, AT start 2 or 5), or null. Sign-in is Ghana-only for now. */
export function ghanaMobile(value: unknown): string | null {
    const phone = typeof value === "string" ? normalizePhone(value) : null;
    return phone && /^\+233[25]\d{8}$/.test(phone) ? phone : null;
}

/**
 * Supabase sessions are minted through a magic link, which needs an email. Phone-only logins get
 * this placeholder, which never receives mail and is never shown to anyone.
 */
const PLACEHOLDER_DOMAIN = "phone.motorambos.com";

export function placeholderEmail(phone: string) {
    return `${phone.replace(/\D/g, "")}@${PLACEHOLDER_DOMAIN}`;
}

export function isPlaceholderEmail(email: string | null | undefined) {
    return Boolean(email?.toLowerCase().endsWith(`@${PLACEHOLDER_DOMAIN}`));
}

/** A login's real email, or null for phone-only logins. */
export function realEmail(email: string | null | undefined) {
    return email && !isPlaceholderEmail(email) ? email : null;
}

export function newCode() {
    return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function secret() {
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!value) throw new Error("Missing server secret");
    return value;
}

/** Codes are stored as an HMAC tied to their row, so a leaked table can't be replayed. */
export function hashCode(rowId: string, code: string) {
    return createHmac("sha256", secret()).update(`phone-login:${rowId}:${code}`).digest("hex");
}

export function codeMatches(rowId: string, code: string, storedHash: string) {
    const expected = Buffer.from(storedHash, "hex");
    const received = Buffer.from(hashCode(rowId, code), "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
}
