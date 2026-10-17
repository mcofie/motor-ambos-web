import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/serverAuth";
import { initializePayment, paystackReady, verifyPayment } from "@/lib/paystack";
import { markOrderPaid, newPaymentReference } from "@/lib/cardOrderServer";
import { invoiceLink, paymentEmail, validInvoiceToken } from "@/lib/cardInvoice";
import { cedis } from "@/lib/cardOrders";

export const dynamic = "force-dynamic";

/**
 * The payment link in a Smart Card invoice SMS. Opens a fresh Paystack checkout for the order, and
 * Paystack sends the driver back here to see whether it went through. No sign-in needed: the link's
 * signature proves it came from the invoice.
 */
export async function GET(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = await params;
    const url = new URL(request.url);
    const token = url.searchParams.get("k");
    if (!/^MA-[A-Z0-9-]{4,30}$/.test(orderNumber)) return page("Payment link not found", "Check the link in your text message.", 404);

    const service = getServiceClient();
    const { data: order } = await service.from("card_orders")
        .select("id,order_number,status,total_pesewas,recipient_phone,product_name,paystack_reference,member_id")
        .eq("order_number", orderNumber).maybeSingle();
    if (!order || !validInvoiceToken(order.id, token)) return page("Payment link not found", "Check the link in your text message.", 404);

    // Back from Paystack.
    const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
    if (reference && order.status === "pending_payment" && reference === order.paystack_reference) {
        try {
            const payment = await verifyPayment(reference);
            if (payment.status === "success") {
                await markOrderPaid(service, { reference, amount: payment.amount, currency: payment.currency, paidAt: payment.paid_at });
            }
        } catch {
            // The Paystack webhook will still mark it paid.
        }
        const { data: updated } = await service.from("card_orders").select("status").eq("id", order.id).maybeSingle();
        return updated?.status === "pending_payment"
            ? page("We're checking your payment", `If you paid, we'll text you as soon as it's confirmed. If not, you can try again with the same link.`)
            : page("Payment received", `Thank you. Your ${order.product_name} Smart Card (order ${order.order_number}) is paid. We'll text you when it's on its way or ready for pickup.`);
    }

    if (order.status === "cancelled") return page("This order was cancelled", "Contact support@motorambos.com if you have questions.");
    if (order.status !== "pending_payment") return page("Already paid", `Order ${order.order_number} is paid. We'll text you about delivery or pickup.`);
    if (!paystackReady()) return page("Online payment is unavailable", "Please try again later, or contact support@motorambos.com.", 503);

    const { data: member } = await service.from("members").select("email").eq("id", order.member_id).maybeSingle();
    const newReference = newPaymentReference(order.order_number);
    await service.from("card_orders").update({ paystack_reference: newReference, updated_at: new Date().toISOString() }).eq("id", order.id).eq("status", "pending_payment");
    try {
        const payment = await initializePayment({
            email: paymentEmail(member?.email, order.order_number),
            amountPesewas: order.total_pesewas,
            reference: newReference,
            callbackUrl: invoiceLink(order),
            phone: order.recipient_phone,
            metadata: { order_number: order.order_number },
        });
        return NextResponse.redirect(payment.authorization_url, 303);
    } catch {
        return page("Couldn't open the payment page", `Please try the link again in a moment. Order ${order.order_number}, ${cedis(order.total_pesewas)}.`, 502);
    }
}

function escape(text: string) {
    return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** A small branded page for the outcomes that don't go to Paystack. */
function page(title: string, message: string, status = 200) {
    const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} · Motor Ambos</title><meta name="robots" content="noindex">
<style>body{margin:0;font-family:-apple-system,system-ui,sans-serif;background:#F7F7F7;color:#171717;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}
main{background:#fff;border:1px solid #EAEAEA;border-radius:18px;padding:28px;max-width:420px}h1{font-size:22px;font-weight:500;letter-spacing:-.02em;margin:0 0 8px}p{color:#666;line-height:1.5;margin:0}b{color:#1111F6}</style></head>
<body><main><p><b>Motor Ambos</b></p><h1>${escape(title)}</h1><p>${escape(message)}</p></main></body></html>`;
    return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}
