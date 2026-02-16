import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Using Service Role Key to bypass RLS for Admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        db: {
            schema: 'motorambos'
        }
    }
);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    try {
        if (type === "cards") {
            const { data, error } = await supabaseAdmin
                .from("nfc_cards")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("NFC Cards Fetch Error:", error);
                throw error;
            }
            return NextResponse.json(data);
        }

        if (type === "requests") {
            const { data, error } = await supabaseAdmin
                .from("nfc_requests")
                .select(`
                    *,
                    member:member_id (
                        full_name,
                        phone
                    ),
                    vehicle:vehicle_id (
                        year,
                        make,
                        model,
                        plate
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("NFC Requests Fetch Error:", error);
                throw error;
            }

            // Post-process to ensure member and vehicle are objects not arrays
            const formatted = (data || []).map((r: any) => ({
                ...r,
                member: Array.isArray(r.member) ? r.member[0] : r.member,
                vehicle: Array.isArray(r.vehicle) ? r.vehicle[0] : r.vehicle
            }));

            return NextResponse.json(formatted);
        }

        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });

    } catch (error: any) {
        console.error("Admin NFC GET Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === "create_batch") {
            const { serials, batch_id } = body;

            if (!serials || !Array.isArray(serials)) {
                return NextResponse.json({ error: "Invalid serials array" }, { status: 400 });
            }

            const rows = serials.map((s: string) => ({
                serial_number: s,
                batch_id: batch_id || null,
                status: 'MANUFACTURED'
            }));

            const { error } = await supabaseAdmin
                .from("nfc_cards")
                .insert(rows);

            if (error) {
                console.error("Batch Create Error:", error);
                if (error.code === '23505') { // Unique violation
                    return NextResponse.json({ error: "Duplicate serial numbers found." }, { status: 409 });
                }
                throw error;
            }
            return NextResponse.json({ success: true });
        }

        if (action === "update_request_status") {
            const { id, status } = body;
            if (!id || !status) {
                return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
            }

            const { error } = await supabaseAdmin
                .from("nfc_requests")
                .update({ status, updated_at: new Date().toISOString() })
                .eq("id", id);

            if (error) {
                console.error("Update Status Error:", error);
                throw error;
            }

            return NextResponse.json({ success: true });
        }

        if (action === "bulk_assign_cards") {
            const { mappings } = body; // Array of { vehicle_id, serial_number }
            if (!mappings || !Array.isArray(mappings)) {
                return NextResponse.json({ error: "Invalid mappings array" }, { status: 400 });
            }

            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const generateId = () => Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

            // We need to update both vehicles and cards
            // This is a bit complex in Supabase without a stored procedure, 
            // but we can do it in a loop for now or multi-updates

            for (const map of mappings) {
                const publicId = generateId();
                // 1. Update Vehicle
                const { error: vError } = await supabaseAdmin
                    .from("vehicles")
                    .update({
                        nfc_card_id: publicId,
                        nfc_serial_number: map.serial_number
                    })
                    .eq("id", map.vehicle_id);

                if (vError) throw vError;

                // 2. Update Card Status
                const { error: cError } = await supabaseAdmin
                    .from("nfc_cards")
                    .update({ status: 'ASSIGNED' })
                    .eq("serial_number", map.serial_number);

                // If it fails, we keep going but log it (maybe the card record doesn't exist yet)
                if (cError) console.warn(`Could not update card status for ${map.serial_number}:`, cError.message);
            }

            return NextResponse.json({ success: true });
        }

        if (action === "update_card") {
            const { id, serial_number, status, batch_id } = body;
            if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

            const { error } = await supabaseAdmin
                .from("nfc_cards")
                .update({
                    serial_number,
                    status,
                    batch_id,
                    updated_at: new Date().toISOString()
                })
                .eq("id", id);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === "delete_card") {
            const { id } = body;
            if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

            const { error } = await supabaseAdmin
                .from("nfc_cards")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Admin NFC POST Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
