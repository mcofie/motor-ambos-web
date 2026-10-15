"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
    listAllVehicles,
    VehicleRow,
    listNfcCards,
    NfcCardRow,
    createNfcCardBatch,
    listMembersWithMemberships,
    MemberWithMembershipRow,
    bulkAssignNfcCards,
    updateNfcCard,
    deleteNfcCard,
    unlinkNfcCard,
} from "@/lib/supaFetch";
import { Check, Download, ExternalLink, Layers, Link2, Loader2, Pencil, Plus, Search, ShoppingBag, Trash2, Unlink } from "lucide-react";
import { toast } from "sonner";
import { formatClaimCode } from "@/lib/cardFormat";
import { siteUrl } from "@/lib/metadata";
import { cls } from "../ui/AdminUI";
import { useConfirm } from "../ui/useConfirm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type CardStatus = "MANUFACTURED" | "ASSIGNED" | "LOST" | "DAMAGED" | "VOID";
type Filter = "all" | "stock" | "linked" | "out";

const STATUS: Record<string, { label: string; tone: string }> = {
    MANUFACTURED: { label: "In stock", tone: "bg-[#EEEEFF] text-[#1111F6]" },
    ASSIGNED: { label: "Linked", tone: "bg-[#EAF7F0] text-[#197252]" },
    LOST: { label: "Lost", tone: "bg-[#FFF4DF] text-[#915C12]" },
    DAMAGED: { label: "Damaged", tone: "bg-[#FFF0EF] text-[#AA3333]" },
    VOID: { label: "Void", tone: "bg-[#F2F2F2] text-[#666]" },
};

const field = "h-11 w-full rounded-[12px] border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#171717] outline-none placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/15";
const primaryBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white transition-colors hover:bg-[#0606D8] disabled:opacity-50";
const quietBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E3E3E3] bg-white px-4 text-[14px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";
const smallBtn = "inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E3E3E3] bg-white px-3 text-[13px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";

const isAbort = (err: unknown) => err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));
const vehicleName = (v: VehicleRow) => [v.year, v.make, v.model].filter(Boolean).join(" ") || "Vehicle";

/** Physical Smart Cards: add stock, print, link to vehicles and fix problems. */
export function SmartNfcView() {
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [cards, setCards] = useState<NfcCardRow[]>([]);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const { ask, dialog } = useConfirm();
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");

    // Add cards
    const [addOpen, setAddOpen] = useState(false);
    const [addCount, setAddCount] = useState(20);
    const [addPrefix, setAddPrefix] = useState("MA-26-");
    const [addBatch, setAddBatch] = useState("");
    const [ownSerials, setOwnSerials] = useState(false);
    const [pasted, setPasted] = useState("");

    // Link one card
    const [linkCard, setLinkCard] = useState<{ serial: string } | null>(null);
    const [vehicleQuery, setVehicleQuery] = useState("");
    const [linkVehicleId, setLinkVehicleId] = useState("");

    // Assign to a fleet
    const [fleetOpen, setFleetOpen] = useState(false);
    const [fleetId, setFleetId] = useState("");
    const [fleetPicked, setFleetPicked] = useState<string[]>([]);

    // Edit and delete
    const [editCard, setEditCard] = useState<{ id: string; serial_number: string; status: string; batch_id: string } | null>(null);
    const [deleteCard, setDeleteCard] = useState<{ id: string; serial: string } | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            const [vData, cData, mData] = await Promise.all([listAllVehicles(signal), listNfcCards(signal), listMembersWithMemberships(signal)]);
            setVehicles(vData || []);
            setCards(cData || []);
            setMembers(mData || []);
        } catch (err) {
            if (isAbort(err)) return;
            console.error(err);
            toast.error("Could not load cards");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const ownerName = useMemo(() => {
        const names = new Map<string, string>();
        for (const m of members) {
            const name = m.business_name || m.full_name || "";
            if (!name) continue;
            names.set(m.member_id, name);
            if (m.auth_user_id) names.set(m.auth_user_id, name);
        }
        return names;
    }, [members]);
    const fleets = members.filter((m) => m.is_business && (m.business_name || m.full_name));

    // One row per serial, including serials only recorded on a vehicle.
    const inventory = useMemo(() => {
        const serials = new Set([...cards.map((c) => c.serial_number), ...(vehicles.map((v) => v.nfc_serial_number).filter(Boolean) as string[])]);
        return Array.from(serials).map((original) => {
            const serial = original.trim().toUpperCase();
            const card = cards.find((c) => c.serial_number.trim().toUpperCase() === serial);
            const vehicle = vehicles.find((v) => v.nfc_serial_number?.trim().toUpperCase() === serial || (card?.public_id && v.nfc_card_id === card.public_id));
            return {
                id: card?.id || `legacy-${serial}`,
                serial_number: original,
                public_id: card?.public_id,
                claim_code: card?.claim_code,
                batch_id: card?.batch_id,
                created_at: card?.created_at,
                status: (card?.status || (vehicle ? "ASSIGNED" : "UNKNOWN")) as CardStatus | "UNKNOWN",
                vehicle,
                registered: Boolean(card),
            };
        }).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "") || a.serial_number.localeCompare(b.serial_number));
    }, [cards, vehicles]);

    const counts = {
        all: inventory.length,
        stock: inventory.filter((c) => c.status === "MANUFACTURED").length,
        linked: inventory.filter((c) => c.status === "ASSIGNED").length,
        out: inventory.filter((c) => c.status === "LOST" || c.status === "DAMAGED" || c.status === "VOID").length,
    };
    const broken = inventory.filter((c) => c.status === "ASSIGNED" && !c.vehicle).length;

    const shown = inventory.filter((c) => {
        if (filter === "stock" && c.status !== "MANUFACTURED") return false;
        if (filter === "linked" && c.status !== "ASSIGNED") return false;
        if (filter === "out" && !["LOST", "DAMAGED", "VOID"].includes(c.status)) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [c.serial_number, c.batch_id, c.vehicle?.plate, c.vehicle?.make, c.vehicle?.model, c.vehicle && ownerName.get(c.vehicle.user_id)].some((value) => value?.toLowerCase().includes(q));
    });

    // ── Add cards ──
    const nextNumber = Math.max(0, ...cards.map((c) => Number(c.serial_number.match(/\d+$/)?.[0] || 0))) + 1;
    const generated = Array.from({ length: Math.min(Math.max(addCount, 0), 500) }, (_, i) => `${addPrefix}${String(nextNumber + i).padStart(5, "0")}`);
    const newSerials = ownSerials ? pasted.split(/[\n,]+/).map((s) => s.trim().toUpperCase()).filter(Boolean) : generated;

    function openAdd() {
        setAddBatch(`Batch ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`);
        setAddOpen(true);
    }

    async function createCards() {
        if (!newSerials.length) return;
        setBusy("add");
        try {
            await createNfcCardBatch(newSerials, addBatch.trim() || undefined);
            toast.success(`${newSerials.length} ${newSerials.length === 1 ? "card" : "cards"} added. Export them for printing next.`);
            setAddOpen(false);
            setPasted("");
            setFilter("stock");
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add the cards");
        } finally {
            setBusy(null);
        }
    }

    // One row per card for the printer: the chip link to encode and the claim code for the back.
    function exportForPrinting(list = shown) {
        const rows = list.filter((card) => card.public_id && card.claim_code);
        if (!rows.length) return toast.error("No cards in this list have a chip link and claim code to print");
        const csv = [["Serial number", "Chip link", "Claim code"], ...rows.map((card) => [card.serial_number, `${siteUrl}/v/${card.public_id}`, formatClaimCode(card.claim_code || "")])]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `smart-cards-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${rows.length} ${rows.length === 1 ? "card" : "cards"}`);
    }

    // ── Link one card ──
    const freeVehicles = vehicles.filter((v) => !v.nfc_serial_number && !v.nfc_card_id);
    const vehicleMatches = freeVehicles.filter((v) => {
        const q = vehicleQuery.trim().toLowerCase();
        return !q || [v.plate, v.make, v.model, ownerName.get(v.user_id)].some((value) => value?.toLowerCase().includes(q));
    }).slice(0, 40);

    async function saveLink() {
        if (!linkCard || !linkVehicleId) return;
        setBusy("link");
        try {
            const check = await fetch("/api/admin-nfc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify_card", serial_number: linkCard.serial }) });
            if (!check.ok) throw new Error((await check.json()).error || "This card cannot be linked");
            await bulkAssignNfcCards([{ vehicle_id: linkVehicleId, serial_number: linkCard.serial }]);
            toast.success("Card linked");
            setLinkCard(null);
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not link the card");
        } finally {
            setBusy(null);
        }
    }

    async function unlink(serial: string) {
        if (!await ask({ title: `Unlink card ${serial}?`, body: "Tapping it will no longer open that vehicle, and the card goes back into stock.", confirm: "Unlink", danger: true })) return;
        setBusy(`unlink-${serial}`);
        try {
            await unlinkNfcCard(serial);
            toast.success("Card unlinked and back in stock");
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not unlink the card");
        } finally {
            setBusy(null);
        }
    }

    // ── Assign to a fleet ──
    const fleetVehicles = freeVehicles.filter((v) => {
        const fleet = fleets.find((f) => f.member_id === fleetId);
        return fleet && (v.user_id === fleet.member_id || (fleet.auth_user_id && v.user_id === fleet.auth_user_id));
    });
    const stockCards = inventory.filter((c) => c.status === "MANUFACTURED" && c.registered);

    function chooseFleet(id: string) {
        setFleetId(id);
        const fleet = fleets.find((f) => f.member_id === id);
        setFleetPicked(fleet ? freeVehicles.filter((v) => v.user_id === fleet.member_id || (fleet.auth_user_id && v.user_id === fleet.auth_user_id)).map((v) => v.id) : []);
    }

    async function assignFleet() {
        if (!fleetPicked.length) return;
        if (stockCards.length < fleetPicked.length) return toast.error(`Only ${stockCards.length} cards in stock. Add more cards first.`);
        setBusy("fleet");
        try {
            await bulkAssignNfcCards(fleetPicked.map((vehicle_id, index) => ({ vehicle_id, serial_number: stockCards[index].serial_number })));
            toast.success(`Linked ${fleetPicked.length} ${fleetPicked.length === 1 ? "card" : "cards"}`);
            setFleetOpen(false);
            setFleetId("");
            setFleetPicked([]);
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not link the cards");
        } finally {
            setBusy(null);
        }
    }

    // ── Edit and delete ──
    async function saveEdit() {
        if (!editCard) return;
        setBusy("edit");
        try {
            await updateNfcCard(editCard.id, { serial_number: editCard.serial_number.trim().toUpperCase(), status: editCard.status, batch_id: editCard.batch_id || null });
            toast.success("Card updated");
            setEditCard(null);
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not update the card");
        } finally {
            setBusy(null);
        }
    }

    async function confirmDelete() {
        if (!deleteCard) return;
        setBusy("delete");
        try {
            await deleteNfcCard(deleteCard.id);
            toast.success("Card deleted");
            setDeleteCard(null);
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not delete the card");
        } finally {
            setBusy(null);
        }
    }

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    const filters: { key: Filter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "stock", label: "In stock" },
        { key: "linked", label: "Linked" },
        { key: "out", label: "Lost or retired" },
    ];

    return (
        <div className="flex flex-col gap-5 pb-8">
            {/* How cards move, so staff know where to start. */}
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                    { step: "1", title: "Add cards", body: "Create serials for a new print run.", action: <button type="button" onClick={openAdd} className="text-[#1111F6]">Add cards</button> },
                    { step: "2", title: "Print", body: "Export chip links and claim codes for the printer.", action: <button type="button" onClick={() => exportForPrinting(inventory.filter((c) => c.status === "MANUFACTURED"))} className="text-[#1111F6]">Export in-stock cards</button> },
                    { step: "3", title: "Link", body: "Drivers link their own with the claim code, or link one here.", action: <Link href="/admin/card-orders" className="text-[#1111F6]">Card orders</Link> },
                ].map((item) => (
                    <li key={item.step} className="flex gap-3 rounded-[16px] border border-[#EAEAEA] bg-white p-4">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F3FF] text-[13px] text-[#1111F6]">{item.step}</span>
                        <div className="min-w-0 text-[14px]">
                            <p>{item.title}</p>
                            <p className="mt-0.5 text-[13px] leading-snug text-[#777]">{item.body}</p>
                            <div className="mt-2 text-[13px]">{item.action}</div>
                        </div>
                    </li>
                ))}
            </ol>

            {broken > 0 && <div className="rounded-[16px] bg-[#FFF0EF] px-5 py-4 text-[14px] text-[#AA3333]">
                {broken} {broken === 1 ? "card is" : "cards are"} marked linked but no vehicle has {broken === 1 ? "it" : "them"}. Unlink {broken === 1 ? "it" : "them"} to put {broken === 1 ? "it" : "them"} back in stock.
            </div>}

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-1.5 overflow-x-auto">
                            {filters.map((item) => (
                                <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={cls("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] transition-colors", filter === item.key ? "bg-[#171717] text-white" : "bg-[#F2F2F2] text-[#555] hover:bg-[#EAEAEA]")}>
                                    {item.label}<span className={filter === item.key ? "text-white/60" : "text-[#999]"}>{counts[item.key]}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => exportForPrinting()} className={quietBtn}><Download className="h-4 w-4" />Export for printing</button>
                            <button type="button" onClick={() => setFleetOpen(true)} className={quietBtn}><Layers className="h-4 w-4" />Link a fleet</button>
                            <button type="button" onClick={openAdd} className={primaryBtn}><Plus className="h-4 w-4" />Add cards</button>
                        </div>
                    </div>
                    <label className="relative block">
                        <span className="sr-only">Search cards</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input className={cls(field, "pl-10")} placeholder="Search serial, batch, plate or owner" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </label>
                </div>

                {shown.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {shown.map((card) => {
                        const status = STATUS[card.status] || { label: "Unknown", tone: "bg-[#F2F2F2] text-[#666]" };
                        const owner = card.vehicle && ownerName.get(card.vehicle.user_id);
                        return (
                            <li key={card.id} className="flex flex-col gap-3 px-4 py-4 sm:px-5 md:flex-row md:items-center">
                                <div className="min-w-0 md:w-[300px] md:shrink-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[14px]">{card.serial_number}</span>
                                        <span className={cls("rounded-full px-2.5 py-0.5 text-[12px]", status.tone)}>{status.label}</span>
                                    </div>
                                    <p className="mt-1 text-[13px] text-[#888]">
                                        {card.claim_code ? <>Claim code <span className="font-mono text-[#555]">{formatClaimCode(card.claim_code)}</span></> : "No claim code"}
                                        {card.batch_id && <> · {card.batch_id}</>}
                                    </p>
                                </div>

                                <div className="min-w-0 flex-1 text-[14px]">
                                    {card.vehicle ? (
                                        <Link href={`/admin/vehicles/${card.vehicle.id}`} className="group block min-w-0">
                                            <span className="block truncate group-hover:text-[#1111F6]">{vehicleName(card.vehicle)}{card.vehicle.plate && <span className="text-[#888]"> · {card.vehicle.plate}</span>}</span>
                                            {owner && <span className="block truncate text-[13px] text-[#888]">{owner}</span>}
                                        </Link>
                                    ) : card.status === "ASSIGNED" ? (
                                        <span className="text-[13px] text-[#AA3333]">Marked linked, but no vehicle has this card</span>
                                    ) : <span className="text-[13px] text-[#AAA]">Not linked</span>}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                    {card.public_id && <a href={`/v/${card.public_id}`} target="_blank" rel="noreferrer" className={smallBtn} title="Open the page this card shows when tapped"><ExternalLink className="h-3.5 w-3.5" />Card page</a>}
                                    {card.status === "MANUFACTURED" && card.registered && <button type="button" onClick={() => { setLinkCard({ serial: card.serial_number }); setVehicleQuery(""); setLinkVehicleId(""); }} className={smallBtn}><Link2 className="h-3.5 w-3.5" />Link to vehicle</button>}
                                    {card.status === "ASSIGNED" && <button type="button" onClick={() => unlink(card.serial_number)} disabled={busy === `unlink-${card.serial_number}`} className={smallBtn}>{busy === `unlink-${card.serial_number}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}Unlink</button>}
                                    {card.registered && <button type="button" onClick={() => setEditCard({ id: card.id, serial_number: card.serial_number, status: card.status, batch_id: card.batch_id || "" })} aria-label={`Edit ${card.serial_number}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:bg-[#F3F3FF] hover:text-[#1111F6]"><Pencil className="h-4 w-4" /></button>}
                                    {card.registered && card.status !== "ASSIGNED" && <button type="button" onClick={() => setDeleteCard({ id: card.id, serial: card.serial_number })} aria-label={`Delete ${card.serial_number}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:bg-[#FFF0EF] hover:text-[#AA3333]"><Trash2 className="h-4 w-4" /></button>}
                                </div>
                            </li>
                        );
                    })}
                </ul> : <div className="px-6 py-14 text-center">
                    <p className="text-[15px]">{inventory.length ? "No cards match." : "No cards yet."}</p>
                    <p className="mt-1 text-[14px] text-[#888]">{inventory.length ? "Try another search or filter." : "Add your first print run to get started."}</p>
                    {!inventory.length && <button type="button" onClick={openAdd} className={cls(primaryBtn, "mt-4")}><Plus className="h-4 w-4" />Add cards</button>}
                </div>}
            </section>

            <p className="flex items-center gap-1.5 text-[13px] text-[#888]"><ShoppingBag className="h-4 w-4" />Driver orders, prices and delivery are in&nbsp;<Link href="/admin/card-orders" className="text-[#1111F6]">Card orders</Link>.</p>

            {/* Add cards */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add cards</DialogTitle>
                        <DialogDescription>Each card gets its own chip link and a secret claim code for the back.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        {!ownSerials ? <div className="grid grid-cols-[1fr_120px] gap-3">
                            <label className="text-[13px] text-[#555]">Serial prefix<input className={cls(field, "mt-1.5 font-mono")} value={addPrefix} onChange={(e) => setAddPrefix(e.target.value.toUpperCase())} /></label>
                            <label className="text-[13px] text-[#555]">How many<input className={cls(field, "mt-1.5")} type="number" min={1} max={500} value={addCount} onChange={(e) => setAddCount(parseInt(e.target.value) || 0)} /></label>
                            <p className="col-span-2 rounded-[12px] bg-[#F7F7F7] px-3.5 py-2.5 text-[13px] text-[#555]">
                                {generated.length ? <>Serials <span className="font-mono">{generated[0]}</span>{generated.length > 1 && <> to <span className="font-mono">{generated[generated.length - 1]}</span></>}</> : "Enter how many cards to add."}
                            </p>
                        </div> : <label className="text-[13px] text-[#555]">Serial numbers, one per line
                            <textarea className={cls(field, "mt-1.5 h-36 py-2.5 font-mono")} placeholder={"MA-26-00001\nMA-26-00002"} value={pasted} onChange={(e) => setPasted(e.target.value)} />
                        </label>}
                        <button type="button" onClick={() => setOwnSerials(!ownSerials)} className="w-fit text-[13px] text-[#1111F6]">{ownSerials ? "Number them for me instead" : "I already have serial numbers"}</button>
                        <label className="text-[13px] text-[#555]">Batch name<input className={cls(field, "mt-1.5")} value={addBatch} onChange={(e) => setAddBatch(e.target.value)} placeholder="e.g. October print run" /></label>
                    </div>
                    <DialogFooter>
                        <button type="button" onClick={() => setAddOpen(false)} className={quietBtn}>Cancel</button>
                        <button type="button" onClick={createCards} disabled={!newSerials.length || busy === "add"} className={primaryBtn}>{busy === "add" && <Loader2 className="h-4 w-4 animate-spin" />}Add {newSerials.length || ""} {newSerials.length === 1 ? "card" : "cards"}</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Link one card */}
            <Dialog open={!!linkCard} onOpenChange={(open) => !open && setLinkCard(null)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Link card <span className="font-mono">{linkCard?.serial}</span></DialogTitle>
                        <DialogDescription>Choose the vehicle. Tapping the card will open its page.</DialogDescription>
                    </DialogHeader>
                    <label className="relative block">
                        <span className="sr-only">Find a vehicle</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input autoFocus className={cls(field, "pl-10")} placeholder="Plate, make or owner" value={vehicleQuery} onChange={(e) => setVehicleQuery(e.target.value)} />
                    </label>
                    <ul className="max-h-72 divide-y divide-[#F0F0F0] overflow-y-auto rounded-[14px] border border-[#EAEAEA]">
                        {vehicleMatches.map((v) => (
                            <li key={v.id}>
                                <button type="button" onClick={() => setLinkVehicleId(v.id)} className={cls("flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] transition-colors", linkVehicleId === v.id ? "bg-[#F3F3FF]" : "hover:bg-[#FAFAFA]")}>
                                    <span className="min-w-0 flex-1"><span className="block truncate">{vehicleName(v)}{v.plate && <span className="text-[#888]"> · {v.plate}</span>}</span><span className="block truncate text-[13px] text-[#888]">{ownerName.get(v.user_id) || "Owner not found"}</span></span>
                                    {linkVehicleId === v.id && <Check className="h-4 w-4 shrink-0 text-[#1111F6]" />}
                                </button>
                            </li>
                        ))}
                        {!vehicleMatches.length && <li className="px-4 py-6 text-center text-[14px] text-[#888]">No vehicles without a card match.</li>}
                    </ul>
                    <DialogFooter>
                        <button type="button" onClick={() => setLinkCard(null)} className={quietBtn}>Cancel</button>
                        <button type="button" onClick={saveLink} disabled={!linkVehicleId || busy === "link"} className={primaryBtn}>{busy === "link" && <Loader2 className="h-4 w-4 animate-spin" />}Link card</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Link a fleet */}
            <Dialog open={fleetOpen} onOpenChange={setFleetOpen}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Link cards to a fleet</DialogTitle>
                        <DialogDescription>Gives each chosen vehicle the next card in stock. {stockCards.length} in stock.</DialogDescription>
                    </DialogHeader>
                    <label className="text-[13px] text-[#555]">Organization
                        <select className={cls(field, "mt-1.5")} value={fleetId} onChange={(e) => chooseFleet(e.target.value)}>
                            <option value="">Choose an organization</option>
                            {fleets.map((org) => <option key={org.member_id} value={org.member_id}>{org.business_name || org.full_name}</option>)}
                        </select>
                    </label>
                    {fleetId && (fleetVehicles.length ? <ul className="max-h-64 divide-y divide-[#F0F0F0] overflow-y-auto rounded-[14px] border border-[#EAEAEA]">
                        {fleetVehicles.map((v) => {
                            const picked = fleetPicked.includes(v.id);
                            return <li key={v.id}><label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[14px] hover:bg-[#FAFAFA]">
                                <input type="checkbox" checked={picked} onChange={() => setFleetPicked((prev) => picked ? prev.filter((id) => id !== v.id) : [...prev, v.id])} className="h-4 w-4 accent-[#1111F6]" />
                                <span className="min-w-0 flex-1 truncate">{vehicleName(v)}{v.plate && <span className="text-[#888]"> · {v.plate}</span>}</span>
                            </label></li>;
                        })}
                    </ul> : <p className="rounded-[14px] bg-[#F7F7F7] px-4 py-5 text-center text-[14px] text-[#777]">Every vehicle in this fleet already has a card.</p>)}
                    <DialogFooter>
                        <button type="button" onClick={() => setFleetOpen(false)} className={quietBtn}>Cancel</button>
                        <button type="button" onClick={assignFleet} disabled={!fleetPicked.length || busy === "fleet"} className={primaryBtn}>{busy === "fleet" && <Loader2 className="h-4 w-4 animate-spin" />}Link {fleetPicked.length || ""} {fleetPicked.length === 1 ? "card" : "cards"}</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit */}
            <Dialog open={!!editCard} onOpenChange={(open) => !open && setEditCard(null)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit card</DialogTitle>
                        <DialogDescription>Mark a card lost or damaged so it can’t be linked again.</DialogDescription>
                    </DialogHeader>
                    {editCard && <div className="flex flex-col gap-4">
                        <label className="text-[13px] text-[#555]">Serial number<input className={cls(field, "mt-1.5 font-mono")} value={editCard.serial_number} onChange={(e) => setEditCard({ ...editCard, serial_number: e.target.value })} /></label>
                        <label className="text-[13px] text-[#555]">Batch<input className={cls(field, "mt-1.5")} value={editCard.batch_id} onChange={(e) => setEditCard({ ...editCard, batch_id: e.target.value })} /></label>
                        <fieldset>
                            <legend className="text-[13px] text-[#555]">Status</legend>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {(editCard.status === "ASSIGNED" ? ["ASSIGNED", "LOST", "DAMAGED"] : ["MANUFACTURED", "LOST", "DAMAGED", "VOID"]).map((key) => (
                                    <button key={key} type="button" onClick={() => setEditCard({ ...editCard, status: key })} className={cls("h-9 rounded-full border px-3.5 text-[14px]", editCard.status === key ? "border-[#1111F6] bg-[#F3F3FF] text-[#1111F6]" : "border-[#E3E3E3] text-[#555]")}>{STATUS[key].label}</button>
                                ))}
                            </div>
                            {editCard.status === "ASSIGNED" && <p className="mt-2 text-[13px] text-[#888]">To move this card to another vehicle, unlink it first.</p>}
                        </fieldset>
                    </div>}
                    <DialogFooter>
                        <button type="button" onClick={() => setEditCard(null)} className={quietBtn}>Cancel</button>
                        <button type="button" onClick={saveEdit} disabled={busy === "edit"} className={primaryBtn}>{busy === "edit" && <Loader2 className="h-4 w-4 animate-spin" />}Save</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete */}
            <Dialog open={!!deleteCard} onOpenChange={(open) => !open && setDeleteCard(null)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete card {deleteCard?.serial}?</DialogTitle>
                        <DialogDescription>Only do this for a card that was never printed. For a printed card, mark it lost or void instead.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button type="button" onClick={() => setDeleteCard(null)} className={quietBtn}>Cancel</button>
                        <button type="button" onClick={confirmDelete} disabled={busy === "delete"} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#AA3333] px-4 text-[14px] text-white disabled:opacity-50">{busy === "delete" && <Loader2 className="h-4 w-4 animate-spin" />}Delete</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {dialog}
        </div>
    );
}
