"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, Loader2, PackageCheck, Phone, Save, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { StatCard, cls } from "../ui/AdminUI";
import { SmartCard, skinForDesign } from "@/components/landing-home/SmartCardStack";
import { cedis, orderStatusLabel, type CardOrderStatus } from "@/lib/cardOrders";

type Order = {
    id: string; order_number: string; product_name: string; product_design: string; delivery_method: "delivery" | "pickup";
    unit_price_pesewas: number; delivery_fee_pesewas: number; total_pesewas: number; recipient_name: string; recipient_phone: string;
    area: string | null; address: string | null; notes: string | null; status: CardOrderStatus; paid_at: string | null; card_serial: string | null;
    staff_note: string | null; created_at: string; paystack_reference: string | null; vehicle: { plate: string | null; make: string | null; model: string | null } | null;
};
type Product = { id: string; name: string; description: string | null; design: string; price_pesewas: number | null; active: boolean };
type Settings = { delivery_enabled: boolean; delivery_fee_pesewas: number | null; pickup_enabled: boolean; pickup_address: string | null };

const field = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const toPesewas = (value: string) => value.trim() === "" ? null : Math.round(Number(value) * 100);
const toCedis = (value: number | null) => value == null ? "" : String(value / 100);
const filters = [
    { key: "open", label: "To fulfil", match: (status: CardOrderStatus) => ["paid", "processing", "out_for_delivery", "ready_for_pickup"].includes(status) },
    { key: "unpaid", label: "Waiting for payment", match: (status: CardOrderStatus) => status === "pending_payment" },
    { key: "done", label: "Completed", match: (status: CardOrderStatus) => status === "delivered" || status === "cancelled" },
    { key: "all", label: "All", match: () => true },
] as const;

function OrderRow({ order, cards, onSaved }: { order: Order; cards: string[]; onSaved: () => Promise<void> }) {
    const [status, setStatus] = useState(order.status);
    const [serial, setSerial] = useState(order.card_serial || "");
    const [note, setNote] = useState(order.staff_note || "");
    const [saving, setSaving] = useState(false);
    const flow: CardOrderStatus[] = order.delivery_method === "delivery" ? ["paid", "processing", "out_for_delivery", "delivered", "cancelled"] : ["paid", "processing", "ready_for_pickup", "delivered", "cancelled"];
    const changed = status !== order.status || serial !== (order.card_serial || "") || note !== (order.staff_note || "");

    async function save() {
        setSaving(true);
        const response = await fetch("/api/admin-card-orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "order", id: order.id, status, cardSerial: serial && serial !== order.card_serial ? serial : undefined, staffNote: note }) }).catch(() => null);
        const result = await response?.json().catch(() => ({}));
        setSaving(false);
        if (!response?.ok) return toast.error(result?.error || "Could not update the order");
        toast.success(`${order.order_number} updated${status !== order.status ? ". The driver has been texted." : ""}`);
        await onSaved();
    }

    return <li className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex gap-4">
            <div className="w-24 shrink-0 [container-type:inline-size]"><SmartCard skin={skinForDesign(order.product_design)} /></div>
            <div className="min-w-0 text-sm">
                <p className="font-medium text-foreground">{order.order_number} · {order.product_name}</p>
                <p className="text-muted-foreground">{new Date(order.created_at).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })} · {cedis(order.total_pesewas)}{order.paid_at ? " paid" : " unpaid"}</p>
                <p className="mt-2 text-foreground">{order.recipient_name} · <a href={`tel:${order.recipient_phone}`} className="inline-flex items-center gap-1 text-primary"><Phone className="h-3 w-3" />{order.recipient_phone}</a></p>
                <p className="text-muted-foreground">{order.delivery_method === "delivery" ? `Deliver to ${[order.area, order.address].filter(Boolean).join(", ")}` : "Pickup"}</p>
                {order.vehicle && <p className="text-muted-foreground">For {[order.vehicle.plate, order.vehicle.make, order.vehicle.model].filter(Boolean).join(" ")}</p>}
                {order.notes && <p className="mt-1 text-muted-foreground">Note: {order.notes}</p>}
            </div>
        </div>
        <div className="grid content-start gap-2 sm:grid-cols-2">
            <label className="text-xs font-medium text-muted-foreground">Status
                <select className={cls(field, "mt-1")} value={status} onChange={(event) => setStatus(event.target.value as CardOrderStatus)}>
                    {(order.status === "pending_payment" ? ["pending_payment", "cancelled"] as CardOrderStatus[] : flow).map((item) => <option key={item} value={item}>{orderStatusLabel[item]}</option>)}
                </select>
            </label>
            <label className="text-xs font-medium text-muted-foreground">Card number
                <input className={cls(field, "mt-1 font-mono uppercase")} list={`cards-${order.id}`} value={serial} onChange={(event) => setSerial(event.target.value.toUpperCase())} placeholder={order.status === "pending_payment" ? "After payment" : "Assign from inventory"} disabled={Boolean(order.card_serial) || order.status === "pending_payment"} />
                <datalist id={`cards-${order.id}`}>{cards.map((card) => <option key={card} value={card} />)}</datalist>
            </label>
            <label className="text-xs font-medium text-muted-foreground sm:col-span-2">Staff note<input className={cls(field, "mt-1")} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Rider, tracking, anything to remember" /></label>
            <p className="text-xs text-muted-foreground sm:col-span-2">{order.vehicle ? "Assigning a card links it to this car straight away." : "No car chosen. The driver links the card with its claim code."}</p>
            <button type="button" onClick={() => void save()} disabled={!changed || saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 sm:col-span-2 sm:justify-self-start">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save</button>
        </div>
    </li>;
}

function ProductEditor({ product, onSaved }: { product: Product; onSaved: () => Promise<void> }) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description || "");
    const [price, setPrice] = useState(toCedis(product.price_pesewas));
    const [active, setActive] = useState(product.active);
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        const response = await fetch("/api/admin-card-orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "product", id: product.id, name, description: description || null, pricePesewas: toPesewas(price), active }) }).catch(() => null);
        setSaving(false);
        if (!response?.ok) return toast.error("Could not save the card");
        toast.success(`${name} saved`);
        await onSaved();
    }

    return <div className="rounded-xl border border-border bg-background p-4">
        <div className="mx-auto w-full max-w-[220px] [container-type:inline-size]"><SmartCard skin={skinForDesign(product.design)} /></div>
        <div className="mt-4 grid gap-3">
            <label className="text-xs font-medium text-muted-foreground">Name<input className={cls(field, "mt-1")} value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="text-xs font-medium text-muted-foreground">What makes this tier different<textarea className={cls(field, "mt-1 h-20 resize-none")} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={240} /></label>
            <label className="text-xs font-medium text-muted-foreground">Price (GH₵)<input className={cls(field, "mt-1")} inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="Not on sale" /></label>
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={active && price !== ""} disabled={price === ""} onChange={(event) => setActive(event.target.checked)} />On sale{price === "" && <span className="text-xs text-muted-foreground">(set a price first)</span>}</label>
            <button type="button" onClick={() => void save()} disabled={saving || name.trim().length < 2} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save card</button>
        </div>
    </div>;
}

function SettingsEditor({ settings, onSaved }: { settings: Settings; onSaved: () => Promise<void> }) {
    const [deliveryEnabled, setDeliveryEnabled] = useState(settings.delivery_enabled);
    const [fee, setFee] = useState(toCedis(settings.delivery_fee_pesewas));
    const [pickupEnabled, setPickupEnabled] = useState(settings.pickup_enabled);
    const [pickupAddress, setPickupAddress] = useState(settings.pickup_address || "");
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        const response = await fetch("/api/admin-card-orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "settings", deliveryEnabled, deliveryFeePesewas: toPesewas(fee), pickupEnabled, pickupAddress: pickupAddress || null }) }).catch(() => null);
        setSaving(false);
        if (!response?.ok) return toast.error("Could not save delivery settings");
        toast.success("Delivery settings saved");
        await onSaved();
    }

    return <div className="grid gap-4 rounded-xl border border-border bg-background p-5 md:grid-cols-2">
        <div className="grid content-start gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground"><input type="checkbox" checked={deliveryEnabled} onChange={(event) => setDeliveryEnabled(event.target.checked)} />Delivery in Greater Accra</label>
            <label className="text-xs font-medium text-muted-foreground">Delivery fee (GH₵)<input className={cls(field, "mt-1")} inputMode="decimal" value={fee} onChange={(event) => setFee(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="Set a fee to offer delivery" /></label>
            <p className="text-xs text-muted-foreground">Enter 0 for free delivery. Leave empty to hide delivery.</p>
        </div>
        <div className="grid content-start gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground"><input type="checkbox" checked={pickupEnabled} onChange={(event) => setPickupEnabled(event.target.checked)} />Free pickup</label>
            <label className="text-xs font-medium text-muted-foreground">Pickup address<input className={cls(field, "mt-1")} value={pickupAddress} onChange={(event) => setPickupAddress(event.target.value)} placeholder="Shown to drivers and in the ready-for-pickup text" /></label>
        </div>
        <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 md:col-span-2 md:justify-self-start">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save delivery settings</button>
    </div>;
}

export function CardOrdersView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [cards, setCards] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<"orders" | "setup">("orders");
    const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("open");

    const load = useCallback(async () => {
        try {
            const response = await fetch("/api/admin-card-orders", { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not load card orders");
            setOrders(result.orders); setProducts(result.products); setSettings(result.settings); setCards(result.availableCards);
            setError(null);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not load card orders");
        } finally {
            setLoading(false);
        }
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
    useEffect(() => { void load(); }, [load]);

    const match = filters.find((item) => item.key === filter)!.match;
    const visible = orders.filter((order) => match(order.status));
    const toFulfil = orders.filter((order) => filters[0].match(order.status)).length;
    const revenue = orders.filter((order) => order.paid_at && order.status !== "cancelled").reduce((total, order) => total + order.total_pesewas, 0);

    return <div className="flex flex-col gap-6 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Orders to fulfil" value={toFulfil} icon={Truck} color="bg-amber-500" />
            <StatCard title="Cards in inventory" value={cards.length} icon={PackageCheck} color="bg-indigo-500" />
            <StatCard title="Paid card sales" value={cedis(revenue) || "GH₵0"} icon={CircleDollarSign} color="bg-[#1111F6]" />
        </div>
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 ">{error}</div>}

        <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-fit rounded-lg bg-muted/30 p-1">
                    {(["orders", "setup"] as const).map((key) => <button key={key} type="button" onClick={() => setTab(key)} className={cls("rounded-md px-4 py-1.5 text-xs font-medium transition-all", tab === key ? "bg-white text-primary shadow-sm " : "text-muted-foreground hover:text-foreground")}>{key === "orders" ? "Orders" : "Cards & delivery"}</button>)}
                </div>
                {tab === "orders" && <div className="flex flex-wrap gap-1.5">{filters.map((item) => <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={cls("rounded-full px-3 py-1.5 text-xs font-medium", filter === item.key ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground")}>{item.label} {orders.filter((order) => item.match(order.status)).length}</button>)}</div>}
            </div>

            {loading ? <div className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>
                : tab === "orders" ? (visible.length ? <ul className="divide-y divide-border">{visible.map((order) => <OrderRow key={`${order.id}-${order.status}-${order.card_serial}`} order={order} cards={cards} onSaved={load} />)}</ul>
                    : <div className="flex flex-col items-center gap-2 p-10 text-center text-sm text-muted-foreground"><ShoppingBag className="h-6 w-6" />No orders here.</div>)
                : <div className="space-y-6 p-5">
                    <div><h2 className="text-base font-medium text-foreground">Card tiers</h2><p className="mt-1 text-sm text-muted-foreground">A card shows in the driver app once it has a price and is on sale.</p>
                        <div className="mt-4 grid gap-4 md:grid-cols-3">{products.map((product) => <ProductEditor key={`${product.id}-${product.price_pesewas}-${product.active}`} product={product} onSaved={load} />)}</div></div>
                    {settings && <div><h2 className="text-base font-medium text-foreground">Delivery and pickup</h2><div className="mt-4"><SettingsEditor settings={settings} onSaved={load} /></div></div>}
                </div>}
        </div>
    </div>;
}
