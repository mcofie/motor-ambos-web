"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listAllVehicles, VehicleRow, ServiceHistoryRow, bulkAssignNfcCards, unlinkNfcCard, getVehicleMaintenanceStatus, FuelLogRow } from "@/lib/supaFetch";
import { cls, paperStatus } from "../ui/AdminUI";
import { useConfirm } from "../ui/useConfirm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface VehicleDetailViewProps {
    vehicleId: string;
    initialVehicle?: VehicleRow | null;
    initialHistory?: ServiceHistoryRow[];
    initialFuel?: FuelLogRow[];
}

const card = "rounded-[20px] border border-[#EAEAEA] bg-white p-5 sm:p-6";
const day = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const OIL = { HEALTHY: { label: "On time", tone: "bg-[#EAF7F0] text-[#197252]", bar: "bg-[#1111F6]" }, UPCOMING: { label: "Due soon", tone: "bg-[#FFF4DF] text-[#915C12]", bar: "bg-[#E2A23B]" }, OVERDUE: { label: "Overdue", tone: "bg-[#FFF0EF] text-[#AA3333]", bar: "bg-[#D64545]" }, UNKNOWN: { label: "Not tracked", tone: "bg-[#F2F2F2] text-[#666]", bar: "bg-[#CCC]" } };

/** One vehicle: its oil change, papers, Smart Card, and the services and fill-ups its driver has logged. */
export function VehicleDetailView({ vehicleId, initialVehicle, initialHistory, initialFuel }: VehicleDetailViewProps) {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<VehicleRow | null>(initialVehicle || null);
    const [history] = useState<ServiceHistoryRow[]>(initialHistory || []);
    const [fuelLogs] = useState<FuelLogRow[]>(initialFuel || []);
    const [tab, setTab] = useState<"history" | "fuel">("history");
    const [linkOpen, setLinkOpen] = useState(false);
    const [serial, setSerial] = useState("");
    const [linking, setLinking] = useState(false);
    const { ask, dialog } = useConfirm();

    // Reads go through the staff server route, not the browser's own database access.
    const reloadVehicle = useCallback(async () => {
        const updated = (await listAllVehicles()).find((v) => v.id === vehicleId);
        if (updated) setVehicle(updated);
    }, [vehicleId]);

    async function linkCard() {
        const clean = serial.trim().toUpperCase();
        if (!clean || !vehicle) return;
        setLinking(true);
        try {
            const check = await fetch("/api/admin-nfc", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify_card", serial_number: clean }) });
            if (!check.ok) throw new Error((await check.json()).error || "This card cannot be linked");
            // Put the old card back in stock first, so it isn't left marked as linked.
            if (vehicle.nfc_serial_number && vehicle.nfc_serial_number !== clean) await unlinkNfcCard(vehicle.nfc_serial_number);
            await bulkAssignNfcCards([{ vehicle_id: vehicleId, serial_number: clean }]);
            toast.success("Smart Card linked");
            setLinkOpen(false);
            setSerial("");
            await reloadVehicle();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not link the card");
        } finally {
            setLinking(false);
        }
    }

    async function unlinkCard() {
        if (!vehicle?.nfc_serial_number || !await ask({ title: `Unlink card ${vehicle.nfc_serial_number}?`, body: "Tapping it will no longer open this vehicle, and the card goes back into stock.", confirm: "Unlink", danger: true })) return;
        try {
            await unlinkNfcCard(vehicle.nfc_serial_number);
            setVehicle({ ...vehicle, nfc_serial_number: null, nfc_card_id: null });
            toast.success("Card unlinked");
        } catch {
            toast.error("Could not unlink the card");
        }
    }

    if (!vehicle) {
        return <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
            <p className="text-[16px]">Vehicle not found</p>
            <button type="button" onClick={() => router.back()} className="text-[14px] text-[#1111F6]">Go back</button>
        </div>;
    }

    const oil = getVehicleMaintenanceStatus(vehicle);
    const oilState = OIL[oil.oilChangeStatus];
    const papers = [
        { name: "Insurance", expires: vehicle.insurance_end_date, file: vehicle.insurance_url },
        { name: "Roadworthy", expires: vehicle.roadworthy_expiry, file: vehicle.roadworthy_url },
    ];
    const fuelSpend = fuelLogs.reduce((sum, log) => sum + (log.total_cost || 0), 0);
    const serviceSpend = history.reduce((sum, h) => sum + (h.cost || 0), 0);

    return (
        <div className="flex flex-col gap-5 pb-10">
            <button type="button" onClick={() => router.back()} className="inline-flex w-fit items-center gap-1.5 text-[14px] text-[#555] hover:text-[#1111F6]"><ArrowLeft className="h-4 w-4" />Back</button>

            <section className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="text-[24px] tracking-[-0.03em]">{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle"}</h2>
                        <p className="mt-0.5 text-[14px] text-[#777]">{vehicle.plate || "No plate"}{vehicle.current_mileage ? ` · ${vehicle.current_mileage.toLocaleString()} km` : ""}</p>
                    </div>
                    {vehicle.nfc_card_id && <a href={`/v/${vehicle.nfc_card_id}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E3E3E3] px-4 text-[14px] hover:border-[#B8B8FF] hover:text-[#1111F6]"><ExternalLink className="h-4 w-4" />Card page</a>}
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#F0F0F0] pt-5 text-[14px] lg:grid-cols-4">
                    <div><dt className="text-[13px] text-[#888]">Services logged</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">{history.length}</dd></div>
                    <div><dt className="text-[13px] text-[#888]">Service spend</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">GHS {serviceSpend.toLocaleString()}</dd></div>
                    <div><dt className="text-[13px] text-[#888]">Fill-ups</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">{fuelLogs.length}</dd></div>
                    <div><dt className="text-[13px] text-[#888]">Fuel spend</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">GHS {fuelSpend.toLocaleString()}</dd></div>
                </dl>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <section className={card}>
                    <div className="flex items-center justify-between gap-2"><h3 className="text-[16px]">Oil change</h3><span className={cls("rounded-full px-2.5 py-0.5 text-[12px]", oilState.tone)}>{oilState.label}</span></div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F2F2F2]"><div className={cls("h-full rounded-full", oilState.bar)} style={{ width: `${oil.percentLife}%` }} /></div>
                    {oil.oilChangeStatus === "UNKNOWN" ? <p className="mt-2 text-[14px] text-[#777]">No mileage logged yet, so the next oil change can’t be worked out.</p> : <>
                        <p className="mt-2 text-[14px]">{oil.kmRemaining.toLocaleString()} km left</p>
                        <p className="text-[13px] text-[#888]">{vehicle.last_oil_change_mileage ? `Last changed at ${vehicle.last_oil_change_mileage.toLocaleString()} km` : "No oil change logged"}</p>
                    </>}
                </section>

                <section className={card}>
                    <h3 className="text-[16px]">Papers</h3>
                    <ul className="mt-3 flex flex-col gap-3">
                        {papers.map((p) => {
                            const state = paperStatus(p.expires);
                            return <li key={p.name} className="flex items-center justify-between gap-2 text-[14px]">
                                <span>{p.name}<span className="block text-[13px] text-[#888]">{p.expires ? `Expires ${day(p.expires)}` : "No expiry date"}{p.file && <> · <a href={p.file} target="_blank" rel="noreferrer" className="text-[#1111F6]">View</a></>}</span></span>
                                <span className={cls("shrink-0 rounded-full px-2.5 py-0.5 text-[12px]", state.tone)}>{state.label}</span>
                            </li>;
                        })}
                    </ul>
                </section>

                <section className={card}>
                    <h3 className="text-[16px]">Smart Card</h3>
                    {vehicle.nfc_serial_number || vehicle.nfc_card_id ? <>
                        <p className="mt-3 font-mono text-[15px]">{vehicle.nfc_serial_number || "Serial not recorded"}</p>
                        <p className="text-[13px] text-[#888]">Opens /v/{vehicle.nfc_card_id}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => setLinkOpen(true)} className="inline-flex h-9 items-center rounded-full border border-[#E3E3E3] px-3.5 text-[13px] hover:border-[#B8B8FF] hover:text-[#1111F6]">Replace card</button>
                            {vehicle.nfc_serial_number && <button type="button" onClick={unlinkCard} className="inline-flex h-9 items-center rounded-full px-3.5 text-[13px] text-[#AA3333] hover:bg-[#FFF0EF]">Unlink</button>}
                        </div>
                    </> : <>
                        <p className="mt-2 text-[14px] text-[#888]">No card linked.</p>
                        <button type="button" onClick={() => setLinkOpen(true)} className="mt-4 inline-flex h-9 items-center rounded-full bg-[#1111F6] px-3.5 text-[13px] text-white hover:bg-[#0606D8]">Link a card</button>
                    </>}
                </section>
            </div>

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex gap-1 border-b border-[#F0F0F0] px-3 pt-3 sm:px-4">
                    {([["history", "Services", history.length], ["fuel", "Fill-ups", fuelLogs.length]] as const).map(([key, text, count]) => (
                        <button key={key} type="button" onClick={() => setTab(key)} className={cls("-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 pb-3 pt-1 text-[14px] transition-colors", tab === key ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777] hover:text-[#171717]")}>{text}<span className="text-[#AAA]">{count}</span></button>
                    ))}
                </div>

                {tab === "history" && (history.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {history.map((h) => (
                        <li key={h.id} className="flex gap-4 px-5 py-4">
                            {/* eslint-disable-next-line @next/next/no-img-element -- driver-uploaded receipt photo */}
                            {h.document_url && <a href={h.document_url} target="_blank" rel="noreferrer" className="shrink-0"><img src={h.document_url} alt="Receipt" className="h-14 w-20 rounded-[10px] border border-[#EAEAEA] object-cover" /></a>}
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-[14px] first-letter:uppercase">{h.description || "Service"}</p>
                                    {h.is_verified && <span className="rounded-full bg-[#EAF7F0] px-2 py-0.5 text-[12px] text-[#197252]">Verified</span>}
                                </div>
                                <p className="mt-0.5 text-[13px] text-[#888]">{day(h.service_date)} · {h.provider_name || "Logged by driver"}{h.location && ` · ${h.location}`}{h.mileage ? ` · ${h.mileage.toLocaleString()} km` : ""}</p>
                            </div>
                            <p className="shrink-0 text-[14px]">{h.cost ? `GHS ${h.cost.toLocaleString()}` : ""}</p>
                        </li>
                    ))}
                </ul> : <p className="px-6 py-12 text-center text-[14px] text-[#888]">No services logged yet.</p>)}

                {tab === "fuel" && (fuelLogs.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {fuelLogs.map((log) => (
                        <li key={log.id} className="flex items-center gap-4 px-5 py-3.5">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[14px]">{log.station_name || "Fill-up"}</p>
                                <p className="truncate text-[13px] text-[#888]" suppressHydrationWarning>{day(log.date || log.created_at)}{log.liters ? ` · ${log.liters} L` : ""}{log.price_per_liter ? ` at GHS ${log.price_per_liter}` : ""}{log.odometer_reading ? ` · ${log.odometer_reading.toLocaleString()} km` : ""}</p>
                            </div>
                            <p className="shrink-0 text-[14px]">GHS {(log.total_cost || 0).toLocaleString()}</p>
                        </li>
                    ))}
                </ul> : <p className="px-6 py-12 text-center text-[14px] text-[#888]">No fill-ups logged yet.</p>)}
            </section>

            <Dialog open={linkOpen} onOpenChange={(open) => !linking && setLinkOpen(open)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-md">
                    <DialogHeader>
                        <DialogTitle>{vehicle.nfc_serial_number ? "Replace the Smart Card" : "Link a Smart Card"}</DialogTitle>
                        <DialogDescription>Enter the serial printed on the card.{vehicle.nfc_serial_number && ` Card ${vehicle.nfc_serial_number} goes back into stock.`}</DialogDescription>
                    </DialogHeader>
                    <input autoFocus className="h-11 w-full rounded-[12px] border border-[#E3E3E3] px-3.5 font-mono text-[15px] uppercase outline-none placeholder:font-sans placeholder:normal-case focus:border-[#1111F6]" placeholder="e.g. MA-26-00012" value={serial} onChange={(e) => setSerial(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && serial && !linking) void linkCard(); }} />
                    <DialogFooter>
                        <button type="button" onClick={() => setLinkOpen(false)} className="inline-flex h-10 items-center rounded-full border border-[#E3E3E3] px-4 text-[14px]">Cancel</button>
                        <button type="button" onClick={linkCard} disabled={linking || !serial.trim()} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8] disabled:opacity-50">{linking && <Loader2 className="h-4 w-4 animate-spin" />}Link card</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {dialog}
        </div>
    );
}
