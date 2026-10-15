import { readPoint } from "@/lib/geo";

/**
 * Requests arrive in two shapes: the website sends a service, a text note and a location column,
 * while the app sends `details` as { issue_type, lat, lng }. This reads either.
 */
export function requestInfo(request: { details?: unknown; location?: unknown }) {
    const details = request.details;
    const object = details && typeof details === "object" ? details as { issue_type?: unknown; lat?: unknown; lng?: unknown } : null;
    const issue = typeof object?.issue_type === "string" ? object.issue_type : null;
    const note = typeof details === "string" && details.trim() ? details.trim() : null;
    const point = readPoint(request.location) || (object && typeof object.lat === "number" && typeof object.lng === "number" ? { lat: object.lat, lng: object.lng } : null);
    return { issue, note, point };
}
