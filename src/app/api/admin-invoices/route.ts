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
    const org_id = searchParams.get("org_id");

    try {
        let query = supabaseAdmin
            .from("invoices")
            .select(`
                *,
                organization:org_id (
                    business_name, full_name
                )
            `)
            .order("created_at", { ascending: false });

        if (org_id) {
            query = query.eq("org_id", org_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { org_id, due_date, total_amount, notes, items } = body;

        if (!org_id) return NextResponse.json({ error: "org_id is required" }, { status: 400 });

        // 1. Generate Invoice Number
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        const invoice_number = `INV-${dateStr}-${rand}`;

        // 2. Create Invoice
        const { data: invoice, error: invError } = await supabaseAdmin
            .from("invoices")
            .insert({
                org_id,
                invoice_number,
                due_date,
                total_amount,
                notes,
                status: 'PENDING'
            })
            .select()
            .single();

        if (invError) throw invError;

        // 3. Create Items
        if (items && items.length > 0) {
            const itemRows = items.map((it: any) => ({
                invoice_id: invoice.id,
                description: it.description,
                quantity: it.quantity,
                unit_price: it.unit_price,
                amount: it.quantity * it.unit_price
            }));

            const { error: itemsError } = await supabaseAdmin
                .from("invoice_items")
                .insert(itemRows);

            if (itemsError) throw itemsError;
        }

        return NextResponse.json(invoice);
    } catch (e: any) {
        console.error("Invoice API Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
