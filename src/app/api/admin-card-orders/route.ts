import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";
import { linkCardToVehicle } from "@/lib/cardLink";
import { notifyOrderStatus, orderColumns } from "@/lib/cardOrderServer";
import type { CardOrderStatus } from "@/lib/cardOrders";

export const dynamic = "force-dynamic";

const statuses = ["pending_payment", "paid", "processing", "out_for_delivery", "ready_for_pickup", "delivered", "cancelled"] as const;
const pesewas = z.number().int().min(0).max(100_000_000).nullable();

const OrderUpdate = z.object({
    action: z.literal("order"),
    id: z.string().uuid(),
    status: z.enum(statuses).optional(),
    cardSerial: z.string().trim().min(3).max(40).optional(),
    staffNote: z.string().trim().max(500).optional(),
});
const ProductUpdate = z.object({
    action: z.literal("product"),
    id: z.string().uuid(),
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().max(240).nullable(),
    pricePesewas: pesewas,
    active: z.boolean(),
});
const SettingsUpdate = z.object({
    action: z.literal("settings"),
    deliveryEnabled: z.boolean(),
    deliveryFeePesewas: pesewas,
    pickupEnabled: z.boolean(),
    pickupAddress: z.string().trim().max(200).nullable(),
});

export async function GET() {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const service = getServiceClient();
    const [orders, products, settings, cards] = await Promise.all([
        service.from("card_orders").select(`${orderColumns},paystack_reference,staff_note,member_id,vehicle:vehicle_id(plate,make,model)`).order("created_at", { ascending: false }).limit(300),
        service.from("card_products").select("id,name,description,design,price_pesewas,active,sort_order").order("sort_order"),
        service.from("card_order_settings").select("delivery_enabled,delivery_fee_pesewas,pickup_enabled,pickup_address").eq("id", 1).maybeSingle(),
        service.from("nfc_cards").select("serial_number").eq("status", "MANUFACTURED").order("serial_number"),
    ]);
    if (orders.error || products.error) return NextResponse.json({ error: "Could not load card orders. Has the card orders migration run?" }, { status: 500 });
    return NextResponse.json({
        orders: (orders.data || []).map((order) => ({ ...order, vehicle: Array.isArray(order.vehicle) ? order.vehicle[0] : order.vehicle })),
        products: products.data,
        settings: settings.data,
        availableCards: (cards.data || []).map((card) => card.serial_number),
    });
}

export async function PATCH(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const service = getServiceClient();
    const body = await request.json().catch(() => null);

    const product = ProductUpdate.safeParse(body);
    if (product.success) {
        const { error } = await service.from("card_products").update({ name: product.data.name, description: product.data.description, price_pesewas: product.data.pricePesewas, active: product.data.active && product.data.pricePesewas != null, updated_at: new Date().toISOString() }).eq("id", product.data.id);
        return error ? NextResponse.json({ error: "Could not save the card" }, { status: 500 }) : NextResponse.json({ ok: true });
    }

    const settings = SettingsUpdate.safeParse(body);
    if (settings.success) {
        const { error } = await service.from("card_order_settings").update({ delivery_enabled: settings.data.deliveryEnabled, delivery_fee_pesewas: settings.data.deliveryFeePesewas, pickup_enabled: settings.data.pickupEnabled, pickup_address: settings.data.pickupAddress, updated_at: new Date().toISOString() }).eq("id", 1);
        return error ? NextResponse.json({ error: "Could not save delivery settings" }, { status: 500 }) : NextResponse.json({ ok: true });
    }

    const parsed = OrderUpdate.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Check the update and try again" }, { status: 400 });
    const { data: order } = await service.from("card_orders").select("id,order_number,product_name,recipient_phone,delivery_method,vehicle_id,status,card_serial").eq("id", parsed.data.id).maybeSingle();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const changes: Record<string, unknown> = { updated_at: new Date().toISOString() };

    // Assigning a card from inventory links it straight to the driver's car, so they never need the claim code.
    if (parsed.data.cardSerial && parsed.data.cardSerial !== order.card_serial) {
        if (order.card_serial) return NextResponse.json({ error: "This order already has a card. Unlink it from the car in Smart Cards first." }, { status: 409 });
        const { data: card } = await service.from("nfc_cards").select("id,serial_number,public_id,status").ilike("serial_number", parsed.data.cardSerial).maybeSingle();
        if (!card) return NextResponse.json({ error: "That card number is not in inventory" }, { status: 404 });
        if (card.status !== "MANUFACTURED") return NextResponse.json({ error: "That card is already assigned or cancelled" }, { status: 409 });
        if (order.vehicle_id) {
            try { await linkCardToVehicle(service, card, order.vehicle_id); } catch { return NextResponse.json({ error: "Could not link the card to the driver's car" }, { status: 500 }); }
        }
        changes.card_serial = card.serial_number;
    }
    if (parsed.data.staffNote !== undefined) changes.staff_note = parsed.data.staffNote || null;
    if (parsed.data.status && parsed.data.status !== order.status) {
        if (order.status === "pending_payment" && parsed.data.status !== "cancelled") return NextResponse.json({ error: "Wait for payment before moving this order on" }, { status: 409 });
        changes.status = parsed.data.status;
    }

    const { error } = await service.from("card_orders").update(changes).eq("id", order.id);
    if (error) return NextResponse.json({ error: "Could not update the order" }, { status: 500 });
    if (changes.status) {
        const { data: settingsRow } = await service.from("card_order_settings").select("pickup_address").eq("id", 1).maybeSingle();
        await notifyOrderStatus(order, changes.status as CardOrderStatus, settingsRow?.pickup_address);
    }
    return NextResponse.json({ ok: true });
}
