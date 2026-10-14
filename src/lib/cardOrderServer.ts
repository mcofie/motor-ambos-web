import { randomInt } from "node:crypto";
import type { getServiceClient } from "@/lib/serverAuth";
import { sendSms } from "@/lib/sms";
import { cedis, type CardOrderStatus } from "@/lib/cardOrders";
import { reportMajorActivity } from "@/lib/discordActivity";

type Service = ReturnType<typeof getServiceClient>;

export const orderColumns = "id,order_number,vehicle_id,product_id,product_name,product_design,unit_price_pesewas,delivery_method,delivery_fee_pesewas,total_pesewas,recipient_name,recipient_phone,area,address,notes,status,paid_at,card_serial,created_at,updated_at";

export function newOrderNumber() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const stamp = new Date().toISOString().slice(2, 7).replace("-", "");
    return `MA-${stamp}-${Array.from({ length: 5 }, () => chars[randomInt(chars.length)]).join("")}`;
}

export const newPaymentReference = (orderNumber: string) => `${orderNumber}-${randomInt(100000, 999999)}`;

/**
 * Marks an order paid once Paystack confirms it. Only an unpaid order whose total matches the
 * amount Paystack collected is updated, so repeated confirmations are harmless.
 */
export async function markOrderPaid(service: Service, payment: { reference: string; amount: number; currency: string; paidAt?: string | null }) {
    if (payment.currency !== "GHS") return null;
    const { data: order } = await service.from("card_orders")
        .update({ status: "paid", paid_at: payment.paidAt || new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("paystack_reference", payment.reference).eq("status", "pending_payment").eq("total_pesewas", payment.amount)
        .select("order_number,product_name,delivery_method,recipient_phone,total_pesewas").maybeSingle();
    if (!order) return null;
    await sendSms(order.recipient_phone, `Motor Ambos: payment of ${cedis(order.total_pesewas)} received for your ${order.product_name} Smart Card (order ${order.order_number}). We will text you when it is ${order.delivery_method === "delivery" ? "on its way" : "ready for pickup"}.`);
    await reportMajorActivity("Smart Card order paid", [
        { name: "Order", value: order.order_number },
        { name: "Card", value: order.product_name },
        { name: "Total", value: cedis(order.total_pesewas) },
    ]);
    return order;
}

/** Texts the driver when their order reaches a step they need to know about. */
export async function notifyOrderStatus(order: { order_number: string; product_name: string; recipient_phone: string; delivery_method: string }, status: CardOrderStatus, pickupAddress?: string | null) {
    const messages: Partial<Record<CardOrderStatus, string>> = {
        out_for_delivery: `Motor Ambos: your ${order.product_name} Smart Card (order ${order.order_number}) is on its way. The rider will call you on arrival.`,
        ready_for_pickup: `Motor Ambos: your ${order.product_name} Smart Card (order ${order.order_number}) is ready for pickup${pickupAddress ? ` at ${pickupAddress}` : ""}.`,
        delivered: `Motor Ambos: your Smart Card (order ${order.order_number}) has been handed over. Tap it with your phone to see your car's page.`,
        cancelled: `Motor Ambos: your Smart Card order ${order.order_number} has been cancelled. Contact support@motorambos.com if you have questions.`,
    };
    if (messages[status]) await sendSms(order.recipient_phone, messages[status]!);
}
