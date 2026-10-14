"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bike, Check, CheckCircle2, Loader2, Lock, MapPin, Store } from "lucide-react";
import { SmartCard, skinForDesign } from "@/components/landing-home/SmartCardStack";
import { useRouter } from "next/navigation";
import { usePortalData } from "@/components/portal/PortalDataProvider";
import { MobileAppBar, MobileTabBar } from "@/components/portal/AppChrome";
import { cedis, orderStatusLabel, orderStatusTone, orderSteps, type CardOrderStatus } from "@/lib/cardOrders";
import { formatPhone } from "@/lib/phone";

type Product = { id: string; name: string; description: string | null; design: string; price_pesewas: number };
type Order = { id: string; order_number: string; product_name: string; product_design: string; delivery_method: "delivery" | "pickup"; total_pesewas: number; status: CardOrderStatus; area: string | null; created_at: string; card_serial: string | null };
type Shop = { products: Product[]; delivery: { feePesewas: number } | null; pickup: { address: string | null } | null; paymentsReady: boolean; orders: Order[]; defaults: { name: string; phone: string } };

const fieldClass = "mt-1.5 h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 text-[16px] text-[#171717] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";
const shortDate = (value: string) => new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short" }).format(new Date(value));

function OrderCard({ order, onPay, paying }: { order: Order; onPay: (id: string) => void; paying: boolean }) {
    const steps = orderSteps(order.delivery_method);
    const reached = steps.indexOf(order.status);
    return <li className="rounded-[18px] bg-white p-4 ring-1 ring-black/5 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-16 shrink-0 [container-type:inline-size] sm:w-24"><SmartCard skin={skinForDesign(order.product_design)} /></div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2"><p className="truncate text-[15px] sm:text-[16px]">{order.product_name}</p><span className="shrink-0 text-[15px]">{cedis(order.total_pesewas)}</span></div>
                <p className="mt-0.5 text-[12px] text-[#888] sm:text-[13px]">{order.order_number} · {shortDate(order.created_at)}</p>
                <p className="mt-0.5 truncate text-[12px] text-[#888] sm:text-[13px]">{order.delivery_method === "delivery" ? `Delivery to ${order.area || "your address"}` : "Pickup"}{order.card_serial ? ` · Card ${order.card_serial}` : ""}</p>
            </div>
        </div>
        {order.status === "pending_payment" ? <div className="mt-3 flex items-center justify-between gap-3 rounded-[12px] bg-[#F7F7F7] px-3 py-2.5"><span className="text-[13px] text-[#666]">{orderStatusLabel.pending_payment}</span><button type="button" onClick={() => onPay(order.id)} disabled={paying} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#1111F6] px-4 text-[13px] text-white disabled:opacity-50">{paying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Pay now</button></div>
            : order.status === "cancelled" ? <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[12px] ${orderStatusTone.cancelled}`}>{orderStatusLabel.cancelled}</p>
            : <div className="mt-3">
                <p className="text-[13px]"><span className={`mr-2 rounded-full px-2 py-0.5 text-[12px] ${orderStatusTone[order.status]}`}>{orderStatusLabel[order.status]}</span><span className="text-[#888] sm:hidden">Step {reached + 1} of {steps.length}</span></p>
                <ol className="mt-2.5 grid grid-cols-4 gap-1.5" aria-label="Order progress">
                    {steps.map((step, index) => <li key={step}><span className={`block h-1 rounded-full ${index <= reached ? "bg-[#1111F6]" : "bg-[#E3E3E3]"}`} /><span className={`mt-1.5 hidden text-[11px] leading-tight sm:block ${index === reached ? "text-[#171717]" : "text-[#999]"}`}>{orderStatusLabel[step]}</span><span className="sr-only sm:hidden">{orderStatusLabel[step]}{index <= reached ? ", done" : ""}</span></li>)}
                </ol>
            </div>}
    </li>;
}

export default function CardShop() {
    const { data } = usePortalData();
    const router = useRouter();
    const managesFleet = Boolean(data?.organizations.some((org) => org.role !== "DRIVER"));
    const [shop, setShop] = useState<Shop | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [productId, setProductId] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [method, setMethod] = useState<"delivery" | "pickup" | "">("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [area, setArea] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [busy, setBusy] = useState(false);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [returned, setReturned] = useState<{ state: "checking" | "paid" | "pending"; orderNumber?: string } | null>(null);
    const [showAllOrders, setShowAllOrders] = useState(false);

    const load = useCallback(async () => {
        const response = await fetch("/api/portal/card-orders", { cache: "no-store" }).catch(() => null);
        if (!response?.ok) { setLoadError(true); return; }
        const result = (await response.json()) as Shop;
        setLoadError(false);
        setShop(result);
        setProductId((current) => current || result.products[0]?.id || "");
        setMethod((current) => current || (result.delivery ? "delivery" : result.pickup ? "pickup" : ""));
        setName((current) => current || result.defaults.name);
        setPhone((current) => current || result.defaults.phone);
    }, []);

    useEffect(() => {
        // Paystack sends the driver back here with ?reference=…; confirm the payment, then load orders.
        // A car's Smart Card panel links here with ?vehicle=… to preselect that car.
        const params = new URLSearchParams(window.location.search);
        const reference = params.get("reference");
        // eslint-disable-next-line react-hooks/set-state-in-effect -- the address bar only exists in the browser
        if (params.get("vehicle")) setVehicleId(params.get("vehicle")!);
        if (reference) setReturned({ state: "checking" });
        const confirm = reference
            ? fetch(`/api/portal/card-orders/verify?reference=${encodeURIComponent(reference)}`, { cache: "no-store" }).then((response) => response.json()).then((result) => {
                setReturned({ state: result.status && result.status !== "pending_payment" ? "paid" : "pending", orderNumber: result.orderNumber });
                window.history.replaceState(null, "", "/app/cards");
            }).catch(() => setReturned({ state: "pending" }))
            : Promise.resolve();
        void confirm.then(load);
    }, [load]);

    const cars = data ? [...data.personalVehicles, ...data.fleetVehicles] : [];
    const product = shop?.products.find((item) => item.id === productId);
    const deliveryFee = method === "delivery" ? shop?.delivery?.feePesewas || 0 : 0;
    const total = product ? product.price_pesewas + deliveryFee : 0;

    async function pay(body: Record<string, unknown>) {
        const response = await fetch("/api/portal/card-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "Could not start the payment");
        window.location.assign(result.checkoutUrl);
    }

    async function placeOrder(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            await pay({ action: "order", productId, vehicleId: vehicleId || null, deliveryMethod: method, recipientName: name, recipientPhone: phone, area, address, notes });
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not start the payment");
            setBusy(false);
            void load();
        }
    }

    async function payExisting(orderId: string) {
        setPayingId(orderId);
        setError(null);
        try { await pay({ action: "pay", orderId }); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not start the payment"); setPayingId(null); }
    }

    const choice = (active: boolean) => `relative rounded-[16px] p-4 text-left transition-colors ${active ? "bg-white ring-2 ring-[#1111F6]" : "bg-white ring-1 ring-black/5 hover:ring-[#B8B8FF]"}`;

    return <div className="app-surface base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <MobileAppBar title="Smart Cards" />
        <header className="sticky top-0 z-40 hidden border-b border-[#E9E9E9] bg-white/95 backdrop-blur-md sm:block">
            <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
                <Link href="/" className="flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.035em]"><Image src="/icon.svg" alt="" width={42} height={36} className="h-9 w-[42px]" /><span className="hidden sm:inline">Motor Ambos</span></Link>
                <Link href="/app" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3.5 text-[14px] hover:border-[#B8B8FF] hover:text-[#1111F6]"><ArrowLeft className="h-4 w-4" />My cars</Link>
            </div>
        </header>

        <main className="mx-auto max-w-[960px] px-4 pb-[calc(180px+env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-36 sm:pt-10">
            <h1 id="page-title" className="text-[32px] leading-[1.1] tracking-[-0.045em] sm:text-[40px]">Get a Smart Card</h1>
            <p className="mt-1.5 max-w-[560px] text-[14px] leading-relaxed text-[#6F6F6F] sm:mt-2 sm:text-[15px]">Pay with mobile money or a card. We deliver in Accra or you pick it up, already linked to your car.</p>

            {returned && <div role="status" className={`mt-6 flex items-start gap-3 rounded-[16px] p-4 ${returned.state === "paid" ? "bg-[#EAF7F0] text-[#197252]" : returned.state === "checking" ? "bg-white ring-1 ring-black/5" : "bg-[#FFF4DF] text-[#915C12]"}`}>
                {returned.state === "checking" ? <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-[#1111F6]" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
                <p className="text-[14px]">{returned.state === "checking" ? "Confirming your payment…" : returned.state === "paid" ? `Payment received for order ${returned.orderNumber}. We will text you when your card is on its way.` : "We have not received the payment yet. If you paid, it can take a minute to confirm. Otherwise, use Pay now on your order."}</p>
            </div>}

            {loadError && <div role="alert" className="mt-6 flex items-center justify-between gap-3 rounded-[16px] border border-[#F3D8D8] bg-white p-4"><p className="text-[14px] text-[#AA3333]">We could not load Smart Card ordering.</p><button type="button" onClick={() => void load()} className="h-10 rounded-full border border-[#E3E3E3] px-4 text-[13px]">Try again</button></div>}

            {shop && shop.orders.length > 0 && <section className="mt-6 sm:mt-8" aria-labelledby="orders-heading">
                <h2 id="orders-heading" className="text-[18px] tracking-[-0.03em] sm:text-[20px]">Your orders</h2>
                <ul className="mt-3 grid gap-3">{(showAllOrders ? shop.orders : shop.orders.slice(0, 2)).map((order) => <OrderCard key={order.id} order={order} onPay={(id) => void payExisting(id)} paying={payingId === order.id} />)}</ul>
                {shop.orders.length > 2 && <button type="button" onClick={() => setShowAllOrders(!showAllOrders)} className="mt-2 min-h-11 text-[14px] text-[#1111F6]">{showAllOrders ? "Show fewer orders" : `Show all ${shop.orders.length} orders`}</button>}
            </section>}

            {!shop && !loadError && <div className="mt-10 flex items-center gap-2 text-[14px] text-[#777]"><Loader2 className="h-4 w-4 animate-spin" />Loading cards…</div>}

            {shop && (shop.products.length === 0 || (!shop.delivery && !shop.pickup) ? <div className="mt-10 rounded-[18px] bg-white p-6 text-center ring-1 ring-black/5"><p className="text-[17px]">Card ordering opens soon</p><p className="mt-1 text-[14px] text-[#777]">We will let you know when you can order a Smart Card here.</p></div>
                : <form onSubmit={placeOrder} className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
                    <section aria-labelledby="card-heading">
                        <h2 id="card-heading" className="text-[18px] tracking-[-0.03em] sm:text-[20px]">1. Choose your card</h2>
                        {product && <div className="mt-4 sm:hidden">
                            <div key={product.id} className="card-pick mx-auto w-[min(76%,280px)] [container-type:inline-size]"><SmartCard skin={skinForDesign(product.design)} /></div>
                        </div>}
                        <div className="mt-5 grid gap-2 sm:hidden" role="radiogroup" aria-label="Card">{shop.products.map((item) => <label key={item.id} className={`${choice(productId === item.id)} flex cursor-pointer items-center gap-3 p-3`}>
                            <input type="radio" name="product-mobile" value={item.id} checked={productId === item.id} onChange={() => setProductId(item.id)} className="sr-only" />
                            <div className="w-14 shrink-0 [container-type:inline-size]"><SmartCard skin={skinForDesign(item.design)} /></div>
                            <span className="min-w-0 flex-1"><span className="block text-[15px]">{item.name}</span>{item.description && <span className="mt-0.5 line-clamp-2 block text-[12px] leading-snug text-[#777]">{item.description}</span>}</span>
                            <span className="shrink-0 text-right"><span className="block text-[15px]">{cedis(item.price_pesewas)}</span><span className={`ml-auto mt-1 flex h-5 w-5 items-center justify-center rounded-full ${productId === item.id ? "bg-[#1111F6] text-white" : "ring-1 ring-[#CFCFCF]"}`}>{productId === item.id && <Check className="h-3 w-3" />}</span></span>
                        </label>)}</div>
                        <div className="mt-4 hidden gap-3 sm:grid sm:grid-cols-3">{shop.products.map((item) => <label key={item.id} className={`${choice(productId === item.id)} cursor-pointer`}>
                            <input type="radio" name="product" value={item.id} checked={productId === item.id} onChange={() => setProductId(item.id)} className="sr-only" />
                            <div className="mx-auto w-full max-w-[220px] [container-type:inline-size]"><SmartCard skin={skinForDesign(item.design)} /></div>
                            <div className="mt-4 flex items-start justify-between gap-2"><p className="text-[16px]">{item.name}</p><p className="shrink-0 text-[16px]">{cedis(item.price_pesewas)}</p></div>
                            {item.description && <p className="mt-1 text-[13px] leading-relaxed text-[#777]">{item.description}</p>}
                            {productId === item.id && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#1111F6] text-white"><Check className="h-3.5 w-3.5" /></span>}
                        </label>)}</div>
                    </section>

                    <section aria-labelledby="car-heading">
                        <h2 id="car-heading" className="text-[18px] tracking-[-0.03em] sm:text-[20px]">2. Which car is it for?</h2>
                        <p className="mt-1 text-[14px] text-[#777]">We link the card before it reaches you, so it works as soon as you tap it.</p>
                        <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} className={fieldClass + " max-w-[420px]"}>
                            <option value="">I will link it myself later</option>
                            {cars.map((car) => <option key={car.id} value={car.id}>{[car.plate, [car.year, car.make, car.model].filter(Boolean).join(" ")].filter(Boolean).join(" · ")}</option>)}
                        </select>
                    </section>

                    <section aria-labelledby="delivery-heading">
                        <h2 id="delivery-heading" className="text-[18px] tracking-[-0.03em] sm:text-[20px]">3. Delivery or pickup</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {shop.delivery && <label className={`${choice(method === "delivery")} flex cursor-pointer items-start gap-3`}><input type="radio" name="method" checked={method === "delivery"} onChange={() => setMethod("delivery")} className="sr-only" /><Bike className="mt-0.5 h-5 w-5 shrink-0 text-[#1111F6]" /><span><span className="block text-[15px]">Delivery in Greater Accra</span><span className="block text-[13px] text-[#777]">{shop.delivery.feePesewas ? cedis(shop.delivery.feePesewas) : "Free"} · A rider calls you on arrival</span></span></label>}
                            {shop.pickup && <label className={`${choice(method === "pickup")} flex cursor-pointer items-start gap-3`}><input type="radio" name="method" checked={method === "pickup"} onChange={() => setMethod("pickup")} className="sr-only" /><Store className="mt-0.5 h-5 w-5 shrink-0 text-[#1111F6]" /><span><span className="block text-[15px]">Pick up</span><span className="block text-[13px] text-[#777]">Free{shop.pickup.address ? ` · ${shop.pickup.address}` : " · We text you when it is ready"}</span></span></label>}
                        </div>
                        <div className="mt-4 grid gap-4 rounded-[18px] bg-white p-5 ring-1 ring-black/5 sm:grid-cols-2 sm:p-6">
                            <label className="text-[14px]">Name<input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} /></label>
                            <label className="text-[14px]">Phone number<input className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} onBlur={() => setPhone(formatPhone(phone))} required /></label>
                            {method === "delivery" && <>
                                <label className="text-[14px]">Area<input className={fieldClass} value={area} onChange={(event) => setArea(event.target.value)} placeholder="e.g. East Legon" required /></label>
                                <label className="text-[14px]">Address or landmark<input className={fieldClass} value={address} onChange={(event) => setAddress(event.target.value)} placeholder="e.g. Near A&C Mall, blue gate" required /></label>
                                <p className="flex items-center gap-1.5 text-[12px] text-[#888] sm:col-span-2"><MapPin className="h-3.5 w-3.5" />We deliver within Greater Accra only for now.</p>
                            </>}
                            <label className="text-[14px] sm:col-span-2">Note for us <span className="text-[#888]">(optional)</span><input className={fieldClass} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={300} placeholder="Best time to call, and so on" /></label>
                        </div>
                    </section>

                    <section aria-labelledby="summary-heading" className="rounded-[18px] bg-white p-5 ring-1 ring-black/5 sm:p-6">
                        <h2 id="summary-heading" className="text-[18px] tracking-[-0.03em] sm:text-[20px]">4. Summary</h2>
                        <dl className="mt-4 space-y-2 text-[15px]">
                            <div className="flex justify-between"><dt className="text-[#666]">{product?.name || "Card"}</dt><dd>{cedis(product?.price_pesewas)}</dd></div>
                            <div className="flex justify-between"><dt className="text-[#666]">{method === "delivery" ? "Delivery" : "Pickup"}</dt><dd>{deliveryFee ? cedis(deliveryFee) : "Free"}</dd></div>
                            <div className="flex justify-between border-t border-[#EEE] pt-3 text-[17px]"><dt>Total</dt><dd>{cedis(total)}</dd></div>
                        </dl>
                        {error && <p role="alert" className="mt-4 rounded-[10px] bg-[#FFF0EF] px-3 py-2 text-[13px] text-[#AA3333]">{error}</p>}
                        {!shop.paymentsReady && <p className="mt-4 rounded-[10px] bg-[#FFF4DF] px-3 py-2 text-[13px] text-[#915C12]">Online payment is not switched on yet. Please check back soon.</p>}
                        <p className="mt-4 flex items-center gap-1.5 text-[12px] text-[#888]"><Lock className="h-3.5 w-3.5" />Secure payment by Paystack. Mobile money and bank cards accepted.</p>
                    </section>

                    {/* On phones the pay bar floats as a panel above the tab bar; from tablet width it is a full-width bar. */}
                    <div className="fixed inset-x-0 bottom-[calc(70px+max(14px,env(safe-area-inset-bottom)))] z-30 px-4 sm:bottom-0 sm:border-t sm:border-[#E7E7E7] sm:bg-white/95 sm:px-4 sm:pb-[max(14px,env(safe-area-inset-bottom))] sm:pt-3 sm:backdrop-blur-md">
                        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-3 rounded-[22px] bg-white/95 py-2 pl-4 pr-2 shadow-[0_12px_32px_-12px_rgba(10,14,30,0.35)] ring-1 ring-black/5 backdrop-blur-xl sm:rounded-none sm:bg-transparent sm:p-0 sm:px-4 sm:shadow-none sm:ring-0 sm:backdrop-blur-none">
                            <div className="min-w-0"><p className="truncate text-[12px] text-[#777] sm:text-[13px]">{product?.name || "Card"} · {method === "delivery" ? "Delivery" : "Pickup"}</p><p className="text-[18px] leading-tight">{cedis(total)}</p></div>
                            <button type="submit" disabled={busy || !product || !method || !shop.paymentsReady} className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-7 text-[15px] text-white hover:bg-[#0606D8] disabled:opacity-40 sm:px-8">{busy && <Loader2 className="h-4 w-4 animate-spin" />}<Lock className="h-4 w-4 sm:hidden" />Pay now</button>
                        </div>
                    </div>
                </form>)}
        </main>
        <MobileTabBar active="cards" showFleet={managesFleet} onLog={() => router.push("/app?log=1")} />
    </div>;
}
