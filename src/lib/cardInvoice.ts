import { createHmac, timingSafeEqual } from "node:crypto";
import { siteUrl } from "@/lib/metadata";
import { cedis } from "@/lib/cardOrders";

/**
 * Smart Card requests from the mobile apps are paid outside the app: the driver gets an invoice by
 * SMS with a link to /pay/<order number>. The link carries a signature of the order, so only someone
 * with the text can open that order's payment page.
 */

function secret() {
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!value) throw new Error("Missing server secret");
    return value;
}

function sign(orderId: string) {
    return createHmac("sha256", secret()).update(`card-invoice:${orderId}`).digest("base64url").slice(0, 22);
}

export function validInvoiceToken(orderId: string, token: string | null) {
    if (!token) return false;
    const expected = Buffer.from(sign(orderId));
    const received = Buffer.from(token);
    return expected.length === received.length && timingSafeEqual(expected, received);
}

export function invoiceLink(order: { id: string; order_number: string }) {
    return `${siteUrl}/pay/${order.order_number}?k=${sign(order.id)}`;
}

type InvoiceOrder = {
    id: string;
    order_number: string;
    product_name: string;
    unit_price_pesewas: number;
    delivery_method: "delivery" | "pickup";
    delivery_fee_pesewas: number;
    total_pesewas: number;
};

/** "Motor Ambos invoice MA-2610-ABCDE: White Waves Smart Card GHS 150 + delivery GHS 30 = GHS 180. Pay …" */
export function invoiceMessage(order: InvoiceOrder) {
    const delivery = order.delivery_method === "delivery" && order.delivery_fee_pesewas > 0 ? ` + delivery ${cedis(order.delivery_fee_pesewas)}` : "";
    return `Motor Ambos invoice ${order.order_number}: ${order.product_name} Smart Card ${cedis(order.unit_price_pesewas)}${delivery} = ${cedis(order.total_pesewas)}. Pay with Mobile Money or card: ${invoiceLink(order)}`;
}

/** Paystack needs an email. Drivers who sign in by phone may have none, so receipts go to a placeholder. */
export function paymentEmail(memberEmail: string | null | undefined, orderNumber: string) {
    const email = memberEmail?.trim();
    return email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !email.endsWith("@phone.motorambos.com")
        ? email
        : `${orderNumber.toLowerCase()}@orders.motorambos.com`;
}
