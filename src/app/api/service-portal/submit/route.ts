import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
    return createClient(URL, SERVICE_KEY, {
        auth: { persistSession: false },
        db: { schema: 'motorambos' }
    });
}

export async function POST(req: Request) {
    try {
        const { plateNumber, code, serviceData } = await req.json();

        if (!plateNumber || !code || !serviceData) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const cleanedPlate = plateNumber.trim().toUpperCase();

        // 1. Verify OTP
        const { data: otpRecord, error: otpError } = await supabase
            .from("service_portal_otps")
            .select("*")
            .eq("plate_number", cleanedPlate)
            .eq("code", code)
            .eq("is_used", false)
            .gt("expires_at", new Date().toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (otpError || !otpRecord) {
            return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
        }

        // 2. Find Vehicle ID
        const { data: vehicle, error: vError } = await supabase
            .from("vehicles")
            .select("id")
            .eq("plate", cleanedPlate)
            .single();

        if (vError || !vehicle) {
            return NextResponse.json({ error: "Vehicle vanished? Unexpected error." }, { status: 500 });
        }

        // 3. Insert Service History
        const parsedMileage = parseFloat(serviceData.mileage);
        const parsedCost = parseFloat(serviceData.cost);

        const { error: insertError } = await supabase
            .from("service_history")
            .insert({
                vehicle_id: vehicle.id,
                service_date: new Date().toISOString().split('T')[0],
                description: serviceData.description,
                provider_name: serviceData.providerName,
                mileage: isNaN(parsedMileage) ? 0 : parsedMileage,
                cost: isNaN(parsedCost) ? 0 : parsedCost,
                document_url: serviceData.documentUrl || null,
                is_verified: true, // Mark verified as it came through OTP flow
            });

        if (insertError) {
            console.error("Service Log Insert Error:", insertError);
            return NextResponse.json({ error: "Failed to save service log. Please try again." }, { status: 500 });
        }

        // 4. Mark OTP as used
        await supabase
            .from("service_portal_otps")
            .update({ is_used: true })
            .eq("id", otpRecord.id);

        return NextResponse.json({
            success: true,
            message: "Service record successfully saved and verified."
        });

    } catch (err: any) {
        console.error("Submit Service Portal Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
