/**
 * Reads a point from what Supabase returns for a PostGIS column: EWKB hex
 * (e.g. "0101000020E6100000…"), GeoJSON, or a plain { lat, lng } object.
 */
export function readPoint(value: unknown): { lat: number; lng: number } | null {
    if (!value) return null;

    if (typeof value === "string") {
        const hex = value.trim();
        if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length < 42) return null;
        const bytes = new Uint8Array(hex.match(/../g)!.map((pair) => parseInt(pair, 16)));
        const view = new DataView(bytes.buffer);
        const little = bytes[0] === 1;
        const type = view.getUint32(1, little);
        // Only points. The 0x20000000 flag means an SRID follows the type.
        if ((type & 0xff) !== 1) return null;
        const offset = type & 0x20000000 ? 9 : 5;
        if (bytes.length < offset + 16) return null;
        const lng = view.getFloat64(offset, little);
        const lat = view.getFloat64(offset + 8, little);
        return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
    }

    if (typeof value === "object") {
        const point = value as { lat?: unknown; lng?: unknown; coordinates?: unknown };
        if (typeof point.lat === "number" && typeof point.lng === "number") return { lat: point.lat, lng: point.lng };
        if (Array.isArray(point.coordinates) && typeof point.coordinates[0] === "number" && typeof point.coordinates[1] === "number") {
            return { lng: point.coordinates[0], lat: point.coordinates[1] };
        }
    }
    return null;
}
