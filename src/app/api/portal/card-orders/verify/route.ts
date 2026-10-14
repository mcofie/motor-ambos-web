import { NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { verifyPayment } from "@/lib/paystack";
import { markOrderPaid } from "@/lib/cardOrderServer";

export const dynamic = "force-dynamic";

/** Called when Paystack sends the driver back, so the order shows as paid without waiting for the webhook. */
export async function GET(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const reference = new URL(request.url).searchParams.get("reference") || "";
    if (!/^[A-Z0-9-]{8,40}$/.test(reference)) return NextResponse.json({ error: "Unknown payment" }, { status: 400 });
    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle();
    const { data: order } = member ? await service.from("card_orders").select("order_number,status").eq("paystack_reference", reference).eq("member_id", member.id).maybeSingle() : { data: null };
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "pending_payment") return NextResponse.json({ status: order.status, orderNumber: order.order_number });

    try {
        const payment = await verifyPayment(reference);
        if (payment.status === "success") await markOrderPaid(service, { reference, amount: payment.amount, currency: payment.currency, paidAt: payment.paid_at });
    } catch {
        return NextResponse.json({ status: "pending_payment", orderNumber: order.order_number, message: "We could not confirm the payment yet." });
    }
    const { data: updated } = await service.from("card_orders").select("status").eq("paystack_reference", reference).maybeSingle();
    return NextResponse.json({ status: updated?.status || order.status, orderNumber: order.order_number });
}
