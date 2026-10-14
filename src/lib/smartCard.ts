/** What a tapped Smart Card may show. Shared by the portal settings and the public page. */
export const shareKeys = ["vehicle", "plate", "papers", "service", "owner", "contact"] as const;
export type ShareKey = (typeof shareKeys)[number];
export type ShareSettings = Record<ShareKey, boolean>;

export const defaultShare: ShareSettings = { vehicle: true, plate: true, papers: true, service: true, owner: false, contact: false };

export const shareOptions: { key: ShareKey; label: string; detail: string }[] = [
    { key: "vehicle", label: "Car details", detail: "Make, model, year and colour" },
    { key: "plate", label: "Plate number", detail: "Helps a mechanic confirm the car" },
    { key: "papers", label: "Papers status", detail: "Whether insurance and roadworthy are valid. The documents stay private." },
    { key: "service", label: "Service history", detail: "Past services and repairs, with mileage" },
    { key: "owner", label: "Driver profile", detail: "Photo, first name and whether the licence is valid. Never the licence number." },
    { key: "contact", label: "Call button", detail: "Lets someone who finds the car call you" },
];

export type PublicPaperStatus = { state: "valid" | "due" | "expired" | "unknown"; expiresOn: string | null };

export type PublicCardPage =
    | { state: "missing" }
    | { state: "unlinked"; publicId: string }
    | {
        state: "linked";
        publicId: string;
        title: string;
        vehicle: { make: string | null; model: string | null; year: string | null; color: string | null } | null;
        imageUrl: string | null;
        plate: string | null;
        papers: { insurance: PublicPaperStatus; roadworthy: PublicPaperStatus } | null;
        service: { date: string; description: string; provider: string | null; mileage: number | null; verified: boolean }[] | null;
        ownerFirstName: string | null;
        driver: { name: string; role: string; photoUrl: string | null; licence: { state: PublicPaperStatus["state"]; licenceClass: string | null } | null } | null;
        contactPhone: string | null;
        helpQuery: string;
    };

export function paperStatus(expiresOn: string | null | undefined): PublicPaperStatus {
    const date = expiresOn?.slice(0, 10) || null;
    if (!date) return { state: "unknown", expiresOn: null };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(`${date}T12:00:00`).getTime() - today.getTime()) / 86_400_000);
    if (Number.isNaN(days)) return { state: "unknown", expiresOn: null };
    return { state: days < 0 ? "expired" : days <= 30 ? "due" : "valid", expiresOn: date };
}
