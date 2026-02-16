import { createClient } from "@supabase/supabase-js";
import { VehicleRow, ServiceHistoryRow, MemberWithMembershipRow } from "./supaFetch";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type PublicPassportData = {
    vehicle: VehicleRow | null;
    history: ServiceHistoryRow[];
    member: MemberWithMembershipRow | null;
};

// Helper to decode JWT role safely without external libs for debugging
function getJwtRole(token: string): string {
    try {
        const payload = token.split('.')[1];
        if (!payload) return "invalid-token";
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        return decoded.role || "unknown";
    } catch (e) { return "error-decoding"; }
}

export async function fetchPassportData(nfcId: string): Promise<PublicPassportData> {
    console.log(`[ServerFetch] START fetching for NFC ID: ${nfcId}`);

    if (!URL) {
        console.error("[ServerFetch] Missing NEXT_PUBLIC_SUPABASE_URL");
        return { vehicle: null, history: [], member: null };
    }
    if (!SERVICE_KEY) {
        console.error("[ServerFetch] Missing SUPABASE_SERVICE_ROLE_KEY");
        return { vehicle: null, history: [], member: null };
    }

    const keyRole = getJwtRole(SERVICE_KEY.trim());
    console.log(`[ServerFetch] Using Service Key rule: '${keyRole}'`);

    if (keyRole !== 'service_role') {
        console.error(`[ServerFetch] WARNING: Key role is '${keyRole}', NOT 'service_role'. This explains permission errors.`);
    }

    // Use official client to handle headers/schema logic correctly
    const supabase = createClient(URL, SERVICE_KEY.trim(), {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'motorambos'
        }
    });

    try {
        // 1. Fetch Vehicle
        console.log(`[ServerFetch] Querying 'motorambos.vehicles'...`);
        const { data: vehicles, error: vError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("nfc_card_id", nfcId);

        if (vError) {
            console.error("[ServerFetch] Vehicle Fetch Error:", vError);
            return { vehicle: null, history: [], member: null };
        }

        if (!vehicles || vehicles.length === 0) {
            console.warn(`[ServerFetch] Request OK but no vehicle found for ID: ${nfcId}`);
            return { vehicle: null, history: [], member: null };
        }

        const vehicle = vehicles[0] as VehicleRow;
        console.log(`[ServerFetch] Found vehicle: ${vehicle.id}`);

        // 3. Fetch History & Member
        const [historyRes, memberRes] = await Promise.all([
            supabase
                .from("service_history")
                .select("*")
                .eq("vehicle_id", vehicle.id)
                .order("service_date", { ascending: false }),

            supabase
                .from("members")
                .select("*")
                .or(`auth_user_id.eq.${vehicle.user_id},id.eq.${vehicle.user_id}`)
        ]);

        if (historyRes.error) console.error("[ServerFetch] History Error:", historyRes.error);
        if (memberRes.error) console.error("[ServerFetch] Member Error:", memberRes.error);

        const history = (historyRes.data || []) as ServiceHistoryRow[];
        const member = (memberRes.data && memberRes.data.length > 0 ? memberRes.data[0] : null) as MemberWithMembershipRow;

        return {
            vehicle,
            history,
            member
        };

    } catch (err) {
        console.error("[ServerFetch] Exception:", err);
        return { vehicle: null, history: [], member: null };
    }
}
