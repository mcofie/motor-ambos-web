import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HUBTEL_AUTH = process.env.HUBTEL_SMS_BASIC_AUTH;

if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Missing Supabase Service Key or URL");
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'motorambos' }
});

async function sendSMS(to: string, message: string) {
    if (!HUBTEL_AUTH) {
        console.warn("Skipping SMS: HUBTEL_SMS_BASIC_AUTH not set");
        return;
    }
    try {
        await fetch("https://smsc.hubtel.com/v1/messages/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: HUBTEL_AUTH,
            },
            body: JSON.stringify({
                from: "MotorAmbos",
                to,
                content: message,
            }),
        });
    } catch (e) {
        console.error("SMS Error:", e);
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const org_id = searchParams.get("org_id");

    if (!org_id) return NextResponse.json({ error: "Missing org_id" }, { status: 400 });

    try {
        const { data, error } = await supabaseAdmin
            .from("organization_members")
            .select(`
                *,
                member:member_id (
                    id, full_name, phone, email, auth_user_id
                ),
                vehicle:vehicle_id (
                    id, make, model, plate
                )
            `)
            .eq("org_member_id", org_id);

        if (error) throw error;
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { org_id, full_name, phone, vehicle_id } = body;

        if (!org_id || !phone || !full_name) {
            return NextResponse.json({ error: "Organization ID, Driver Name, and Phone are required" }, { status: 400 });
        }

        // 1. Get Business Name
        const { data: orgData } = await supabaseAdmin
            .from("members")
            .select("business_name, full_name")
            .eq("id", org_id)
            .single();

        const businessName = orgData?.business_name || orgData?.full_name || "Organization";

        // 2. Find or Create Member
        let member_id;
        const { data: existing } = await supabaseAdmin
            .from("members")
            .select("id")
            .eq("phone", phone)
            .single();

        if (existing) {
            member_id = existing.id;
        } else {
            // Create new member
            const driverPayload = {
                full_name,
                phone,
                is_business: false,
                membership_is_active: true,
                membership_tier: "STANDARD",
                updated_at: new Date().toISOString()
            };
            console.log("Creating New Driver Member:", JSON.stringify(driverPayload, null, 2));

            const { data: newMember, error: createError } = await supabaseAdmin
                .from("members")
                .insert(driverPayload)
                .select("id")
                .single();

            if (createError) throw createError;
            member_id = newMember.id;
        }

        // 3. Link to Organization
        // Upsert to handle re-adding or updating vehicle
        const { error: linkError } = await supabaseAdmin
            .from("organization_members")
            .upsert({
                org_member_id: org_id,
                member_id: member_id,
                vehicle_id: vehicle_id || null,
                role: 'DRIVER'
            }, { onConflict: 'org_member_id, member_id' });

        if (linkError) throw linkError;

        // 4. Send SMS
        const downloadLink = "https://motorambos.com"; // Replace with actual link
        const msg = existing
            ? `You have been added to the ${businessName} fleet on Motor Ambos. Sign in to view your assigned vehicles.`
            : `You have been added to the ${businessName} fleet. Download Motor Ambos app to get started: ${downloadLink}`;

        await sendSMS(phone, msg);

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
