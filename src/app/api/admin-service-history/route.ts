import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, vehicle_id, description, service_date, provider_name, mileage, cost, is_verified } = body;

        let query;
        if (id) {
            query = supabaseAdmin
                .from("service_history")
                .update({ vehicle_id, description, service_date, provider_name, mileage, cost, is_verified })
                .eq("id", id);
        } else {
            query = supabaseAdmin
                .from("service_history")
                .insert({ vehicle_id, description, service_date, provider_name, mileage, cost, is_verified });
        }

        const { error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
