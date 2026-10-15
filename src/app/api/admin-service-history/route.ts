import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { staffApiError } from "@/lib/serverAuth";
import { reportMajorActivity } from "@/lib/discordActivity";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Missing Supabase Service Key or URL");
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'motorambos' }
});

export async function GET(req: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get("vehicle_id");

    if (!vehicleId) {
        return NextResponse.json({ error: "Missing vehicle_id" }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("service_history")
            .select("*")
            .eq("vehicle_id", vehicleId)
            .order("service_date", { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    try {
        const body = await req.json();
        const { id, vehicle_id, description, service_date, provider_name, location, mileage, cost, is_verified, document_url, document_metadata } = body;

        let query;
        if (id) {
            query = supabaseAdmin
                .from("service_history")
                .update({ vehicle_id, description, service_date, provider_name, location, mileage, cost, is_verified, document_url, document_metadata })
                .eq("id", id);
        } else {
            query = supabaseAdmin
                .from("service_history")
                .insert({ vehicle_id, description, service_date, provider_name, location, mileage, cost, is_verified, document_url, document_metadata });
        }

        const { error } = await query;
        if (error) throw error;

        await reportMajorActivity(id ? "Service record updated" : "Service record added", [
            { name: "Vehicle ID", value: vehicle_id },
            { name: "Service date", value: service_date },
            { name: "Provider", value: provider_name },
        ]);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status: 500 });
    }
}
