import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { getPortalVehicleAccess } from "@/lib/portalAccess";
import { normalizePhone } from "@/lib/phone";
import { initializePayment, paystackReady } from "@/lib/paystack";
import { newOrderNumber, newPaymentReference, orderColumns } from "@/lib/cardOrderServer";

export const dynamic = "force-dynamic";

const OrderSchema = z.object({
    action: z.literal("order"),
    productId: z.string().uuid(),
    vehicleId: z.string().uuid().nullable(),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    recipientName: z.string().trim().min(2).max(80),
    recipientPhone: z.string().trim().min(6).max(20),
    area: z.string().trim().max(80).optional(),
    address: z.string().trim().max(200).optional(),
    notes: z.string().trim().max(300).optional(),
});
const PaySchema = z.object({ action: z.literal("pay"), orderId: z.string().uuid() });

async function session() {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    const service = getServiceClient();
    const { data: member } = await service.from("members").select("id,full_name,phone").eq("auth_user_id", user.id).maybeSingle();
    return member ? { user, service, member } : null;
}

export async function GET() {
    const current = await session();
    if (!current) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const [products, settings, orders] = await Promise.all([
        current.service.from("card_products").select("id,name,description,design,price_pesewas").eq("active", true).not("price_pesewas", "is", null).order("sort_order"),
        current.service.from("card_order_settings").select("delivery_enabled,delivery_fee_pesewas,pickup_enabled,pickup_address").eq("id", 1).maybeSingle(),
        current.service.from("card_orders").select(orderColumns).eq("member_id", current.member.id).order("created_at", { ascending: false }).limit(20),
    ]);
    if (products.error || orders.error) return NextResponse.json({ error: "Could not load Smart Card ordering" }, { status: 500 });
    const options = settings.data;
    return NextResponse.json({
        products: products.data,
        delivery: options?.delivery_enabled && options.delivery_fee_pesewas != null ? { feePesewas: options.delivery_fee_pesewas } : null,
        pickup: options?.pickup_enabled ? { address: options.pickup_address } : null,
        paymentsReady: paystackReady(),
        orders: orders.data,
        defaults: { name: current.member.full_name || "", phone: current.member.phone || "" },
    }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const current = await session();
    if (!current) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    if (!paystackReady()) return NextResponse.json({ error: "Card payments are not set up yet. Please try again soon." }, { status: 503 });
    if (!current.user.email) return NextResponse.json({ error: "Add an email address to your account to pay online." }, { status: 409 });
    const body = await request.json().catch(() => null);
    const origin = new URL(request.url).origin;

    // Paying again for an order that was not completed.
    const retry = PaySchema.safeParse(body);
    if (retry.success) {
        const { data: order } = await current.service.from("card_orders").select("id,order_number,total_pesewas,recipient_phone,status").eq("id", retry.data.orderId).eq("member_id", current.member.id).maybeSingle();
        if (!order || order.status !== "pending_payment") return NextResponse.json({ error: "This order cannot be paid now." }, { status: 409 });
        const reference = newPaymentReference(order.order_number);
        await current.service.from("card_orders").update({ paystack_reference: reference, updated_at: new Date().toISOString() }).eq("id", order.id);
        return checkout(current.user.email, order.total_pesewas, reference, origin, order.recipient_phone, order.order_number);
    }

    const parsed = OrderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Check your order details and try again." }, { status: 400 });
    const input = parsed.data;
    const phone = normalizePhone(input.recipientPhone);
    if (!phone) return NextResponse.json({ error: "Enter a valid phone number, such as +233558508306." }, { status: 400 });
    if (input.deliveryMethod === "delivery" && (!input.area || !input.address)) return NextResponse.json({ error: "Add the area and address for delivery." }, { status: 400 });

    const [{ data: product }, { data: settings }] = await Promise.all([
        current.service.from("card_products").select("id,name,design,price_pesewas,active").eq("id", input.productId).maybeSingle(),
        current.service.from("card_order_settings").select("delivery_enabled,delivery_fee_pesewas,pickup_enabled").eq("id", 1).maybeSingle(),
    ]);
    if (!product?.active || !product.price_pesewas) return NextResponse.json({ error: "This card is not available right now." }, { status: 409 });
    if (input.deliveryMethod === "delivery" && !(settings?.delivery_enabled && settings.delivery_fee_pesewas != null)) return NextResponse.json({ error: "Delivery is not available right now. Choose pickup." }, { status: 409 });
    if (input.deliveryMethod === "pickup" && !settings?.pickup_enabled) return NextResponse.json({ error: "Pickup is not available right now. Choose delivery." }, { status: 409 });
    if (input.vehicleId) {
        const access = await getPortalVehicleAccess(input.vehicleId);
        if (access.status !== 200 || !access.canEdit) return NextResponse.json({ error: "Choose one of your own cars." }, { status: 403 });
    }

    const deliveryFee = input.deliveryMethod === "delivery" ? settings!.delivery_fee_pesewas! : 0;
    const orderNumber = newOrderNumber();
    const reference = newPaymentReference(orderNumber);
    const { error } = await current.service.from("card_orders").insert({
        order_number: orderNumber,
        member_id: current.member.id,
        vehicle_id: input.vehicleId,
        product_id: product.id,
        product_name: product.name,
        product_design: product.design,
        unit_price_pesewas: product.price_pesewas,
        delivery_method: input.deliveryMethod,
        delivery_fee_pesewas: deliveryFee,
        total_pesewas: product.price_pesewas + deliveryFee,
        recipient_name: input.recipientName,
        recipient_phone: phone,
        area: input.deliveryMethod === "delivery" ? input.area : null,
        address: input.deliveryMethod === "delivery" ? input.address : null,
        notes: input.notes || null,
        paystack_reference: reference,
    });
    if (error) return NextResponse.json({ error: "Could not place your order. Try again." }, { status: 500 });
    return checkout(current.user.email, product.price_pesewas + deliveryFee, reference, origin, phone, orderNumber);
}

async function checkout(email: string, amountPesewas: number, reference: string, origin: string, phone: string, orderNumber: string) {
    try {
        const payment = await initializePayment({ email, amountPesewas, reference, callbackUrl: `${origin}/app/cards`, phone, metadata: { order_number: orderNumber } });
        return NextResponse.json({ ok: true, checkoutUrl: payment.authorization_url, orderNumber }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Could not start the payment. Your order is saved, so you can pay from your orders." }, { status: 502 });
    }
}
