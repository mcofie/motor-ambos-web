import { randomInt } from "node:crypto";

const PUBLIC_ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const CLAIM_CHARS = "0123456789ABCDEF";

/** The id encoded on the card's chip, used in its /v/<id> link. */
export function newPublicId(length = 10) {
    return Array.from({ length }, () => PUBLIC_ID_CHARS[randomInt(PUBLIC_ID_CHARS.length)]).join("");
}

/** The secret printed on the card, used once to prove the person linking it holds the card. */
export function newClaimCode() {
    return Array.from({ length: 10 }, () => CLAIM_CHARS[randomInt(CLAIM_CHARS.length)]).join("");
}

export { formatClaimCode, normaliseClaimCode } from "@/lib/cardFormat";
