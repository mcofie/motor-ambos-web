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

const generateMemNum = () => {
    const yr = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `MA-${yr}-${rand}`;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            member_id,
            phone,
            full_name,
            email,
            plan_id,
            tier,
            expiry_date,
            is_business,
            business_name,
            parent_org_id // Optional
        } = body;

        if (!phone || !full_name) {
            return NextResponse.json({ error: "Phone and Full Name are required" }, { status: 400 });
        }

        const payload: any = {
            phone,
            full_name,
            email,
            plan_id,
            membership_tier: tier,
            membership_expiry_date: expiry_date,
            membership_is_active: true,
            updated_at: new Date().toISOString(),
            is_business,
            business_name: is_business ? business_name : null,
        };

        console.log("Upsert Membership Payload:", JSON.stringify(payload, null, 2));

        let targetMemberId = member_id;

        // If member_id provided, update existing
        if (member_id) {
            // Check if they already have a number
            const { data: current, error: getError } = await supabaseAdmin
                .from("members")
                .select("membership_number")
                .eq("id", member_id)
                .single();

            if (!current?.membership_number) {
                payload.membership_number = generateMemNum();
            }

            const { error } = await supabaseAdmin
                .from("members")
                .update(payload)
                .eq("id", member_id);

            if (error) {
                console.error("Update Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        } else {
            // Creating New or Find by Phone
            const { data: existing } = await supabaseAdmin
                .from("members")
                .select("id, membership_number")
                .eq("phone", phone)
                .single();

            if (existing) {
                targetMemberId = existing.id;
                // Update existing found by phone
                if (!existing.membership_number) {
                    payload.membership_number = generateMemNum();
                }
                const { error } = await supabaseAdmin
                    .from("members")
                    .update(payload)
                    .eq("id", existing.id);

                if (error) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
            } else {
                // Insert New
                payload.membership_number = generateMemNum();
                const { data: newMem, error } = await supabaseAdmin
                    .from("members")
                    .insert(payload)
                    .select("id")
                    .single();

                if (error) {
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                targetMemberId = newMem.id;
            }
        }

        // Handle Linking to Org if parent_org_id is provided
        if (parent_org_id && targetMemberId) {
            const { error: linkError } = await supabaseAdmin
                .from("organization_members")
                .upsert({
                    org_member_id: parent_org_id,
                    member_id: targetMemberId,
                    role: 'DRIVER'
                }, { onConflict: 'org_member_id, member_id' });

            if (linkError) console.error("Link Org Error:", linkError);

            // If it was a NEW member (not editing existing by ID, and not found by phone initially? actually complex)
            // Simplified: If we didn't start with member_id, we treat it as an invite scenario
            if (!member_id) {
                const HUBTEL_AUTH = process.env.HUBTEL_SMS_BASIC_AUTH;
                if (HUBTEL_AUTH) {
                    // Get Org Name
                    const { data: orgData } = await supabaseAdmin
                        .from("members")
                        .select("business_name, full_name")
                        .eq("id", parent_org_id)
                        .single();
                    const bName = orgData?.business_name || orgData?.full_name || "Organization";

                    const downloadLink = "https://motorambos.com";
                    const msg = `You have been added to the ${bName} fleet on Motor Ambos. Download app: ${downloadLink}`;

                    await fetch("https://smsc.hubtel.com/v1/messages/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: HUBTEL_AUTH },
                        body: JSON.stringify({ from: "MotorAmbos", to: phone, content: msg })
                    }).catch(console.error);
                }
            }
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
