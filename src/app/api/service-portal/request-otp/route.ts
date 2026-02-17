import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HUBTEL_AUTH = process.env.HUBTEL_SMS_BASIC_AUTH;

function getSupabaseAdmin() {
    return createClient(URL, SERVICE_KEY, {
        auth: { persistSession: false },
        db: { schema: 'motorambos' }
    });
}

export async function POST(req: Request) {
    try {
        const { plateNumber } = await req.json();

        if (!plateNumber) {
            return NextResponse.json({ error: "Plate number is required" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const cleanedPlate = plateNumber.trim().toUpperCase();
        // Fallback plate with common separators swapped (dash to space and vice versa)
        const alternatePlate = cleanedPlate.includes('-')
            ? cleanedPlate.replace(/-/g, ' ')
            : cleanedPlate.replace(/ /g, '-');

        // 1. Find Vehicle and Owner Phone
        const { data: vehicle, error: vError } = await supabase
            .from("vehicles")
            .select("*, members(phone, full_name, business_name)")
            .or(`plate.eq.${cleanedPlate},plate.ilike.${cleanedPlate},plate.eq.${alternatePlate},plate.ilike.${alternatePlate}`)
            .single();

        if (vError || !vehicle) {
            console.warn(`Vehicle lookup failed for plate: "${cleanedPlate}" (Alt: "${alternatePlate}")`, vError);
            return NextResponse.json({ error: "Vehicle not found. Please check the plate number." }, { status: 404 });
        }

        const phone = (vehicle as any).members?.phone;
        const ownerName = (vehicle as any).members?.business_name || (vehicle as any).members?.full_name || "Driver";

        if (!phone) {
            return NextResponse.json({ error: "Could not find a phone number associated with this vehicle." }, { status: 400 });
        }

        // 2. Generate 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // 3. Save OTP to DB
        const { error: otpError } = await supabase
            .from("service_portal_otps")
            .insert({
                plate_number: plateNumber.toUpperCase(),
                phone_number: phone,
                code: otpCode,
                expires_at: expiresAt
            });

        if (otpError) {
            console.error("OTP Insert Error:", otpError);
            return NextResponse.json({ error: "Failed to generate verification code. Please try again." }, { status: 500 });
        }

        // 4. Send SMS via Hubtel
        if (HUBTEL_AUTH) {
            const smsContent = `MotorAmbos: Verification code for ${plateNumber.toUpperCase()} is ${otpCode}. Give this to the mechanic to log your service. Valid for 10 mins.`;

            try {
                await fetch("https://smsc.hubtel.com/v1/messages/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: HUBTEL_AUTH,
                    },
                    body: JSON.stringify({
                        from: "MotorAmbos",
                        to: phone,
                        content: smsContent,
                    }),
                });
            } catch (smsErr) {
                console.error("Hubtel SMS Error:", smsErr);
                // We continue even if SMS fails in dev, but in prod we might want to throw
            }
        } else {
            console.warn("HUBTEL_SMS_BASIC_AUTH not set. SMS skipped. Code:", otpCode);
        }

        return NextResponse.json({
            success: true,
            message: `A verification code has been sent to the owner of ${plateNumber.toUpperCase()}.`,
            // Masked phone for UI
            phoneLabel: `******${phone.slice(-4)}`,
            vehicle: {
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                plate: vehicle.plate
            }
        });

    } catch (err: any) {
        console.error("Request OTP Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
