/** Claim codes are stored as 10 characters and printed as XXXXX-XXXXX. Safe to use in the browser. */
export const normaliseClaimCode = (value: string) => value.toUpperCase().replace(/[^0-9A-Z]/g, "");

export const formatClaimCode = (value: string) => {
    const code = normaliseClaimCode(value);
    return code.length === 10 ? `${code.slice(0, 5)}-${code.slice(5)}` : code;
};
