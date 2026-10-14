import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/serverAuth";
import { validWebhookSignature } from "@/lib/paystack";
import { markOrderPaid } from "@/lib/cardOrderServer";

export const dynamic = "force-dynamic";

/** Paystack's confirmation of a payment. The signature proves it came from Paystack. */
export async function POST(request: Request) {
    const raw = await request.text();
    if (!validWebhookSignature(raw, request.headers.get("x-paystack-signature"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    const event = JSON.parse(raw) as { event?: string; data?: { reference?: string; amount?: number; currency?: string; status?: string; paid_at?: string } };
    if (event.event === "charge.success" && event.data?.reference && event.data.status === "success" && typeof event.data.amount === "number") {
        await markOrderPaid(getServiceClient(), { reference: event.data.reference, amount: event.data.amount, currency: event.data.currency || "", paidAt: event.data.paid_at });
    }
    return NextResponse.json({ received: true });
}
