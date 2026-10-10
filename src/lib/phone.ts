/** Store and show phone numbers with a country prefix. Ghana is the default. */
export function normalizePhone(value: string | null | undefined): string | null {
    if (!value) return null;
    const compact = value.trim().replace(/[\s().-]/g, "");
    if (!/^\+?\d+$/.test(compact)) return null;

    const international = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
    if (/^0\d{9}$/.test(international)) return `+233${international.slice(1)}`;
    if (/^2330\d{9}$/.test(international)) return `+233${international.slice(4)}`;
    if (/^233\d{9}$/.test(international)) return `+${international}`;
    if (/^\d{9}$/.test(international)) return `+233${international}`;
    if (/^\+2330\d{9}$/.test(international)) return `+233${international.slice(5)}`;
    if (international.startsWith("+233")) return /^\+233\d{9}$/.test(international) ? international : null;
    // Keep valid numbers from other countries, rather than assigning a Ghana prefix to them.
    if (/^\+[1-9]\d{7,14}$/.test(international)) return international;
    return null;
}

export function formatPhone(value: string | null | undefined): string {
    return normalizePhone(value) || value?.trim() || "";
}

/** Exact representations used by older records before numbers were normalized. */
export function phoneVariants(value: string): string[] {
    const normalized = normalizePhone(value);
    if (!normalized) return [];
    if (!normalized.startsWith("+233")) return [normalized];
    const national = normalized.slice(4);
    return Array.from(new Set([normalized, `0${national}`, `233${national}`, `00233${national}`, national, `+2330${national}`, `2330${national}`, `002330${national}`]));
}
