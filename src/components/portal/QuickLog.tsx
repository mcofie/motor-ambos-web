"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, Check, Fuel, Loader2, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { PortalVehicle } from "@/lib/portalTypes";

export type LogKind = "fuel" | "service" | "issue";

const fieldClass = "h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";
const chipClass = (active: boolean) => `h-10 shrink-0 rounded-full px-4 text-[14px] transition-colors ${active ? "bg-[#1111F6] text-white" : "border border-[#E3E3E3] bg-white text-[#333] hover:border-[#B8B8FF]"}`;
const serviceTypes = ["Oil change", "Tyres", "Brakes", "Battery", "General service", "Other"];
const issueCategories = ["Tyres", "Battery", "Engine", "Brakes", "Electrical", "Other"];
export const logKinds: { key: LogKind; label: string; detail: string; icon: typeof Fuel }[] = [
    { key: "fuel", label: "Fill-up", detail: "Fuel bought today", icon: Fuel },
    { key: "service", label: "Service", detail: "Work done on the car", icon: Wrench },
    { key: "issue", label: "Problem", detail: "Something is wrong", icon: AlertCircle },
];

const isoDay = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};
const plateOf = (vehicle: PortalVehicle) => vehicle.plate || [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle";

type History = { lastOdometer: number | null; pricePerLitre: number | null };

/** Recent readings let the form fill in mileage and litres for the driver. */
function useVehicleHistory(vehicleId: string) {
    const [history, setHistory] = useState<History>({ lastOdometer: null, pricePerLitre: null });
    useEffect(() => {
        let active = true;
        fetch(`/api/portal/activity?vehicleId=${vehicleId}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((result) => {
            if (!active || !result) return;
            const fuel = (result.fuel || []) as { liters: number; total_cost: number; odometer_reading: number | null }[];
            const services = (result.services || []) as { mileage: number | null }[];
            const readings = [...fuel.map((entry) => entry.odometer_reading), ...services.map((entry) => entry.mileage)].filter((value): value is number => typeof value === "number" && value > 0);
            const lastFill = fuel.find((entry) => Number(entry.liters) > 0);
            setHistory({ lastOdometer: readings.length ? Math.max(...readings) : null, pricePerLitre: lastFill ? Number(lastFill.total_cost) / Number(lastFill.liters) : null });
        }).catch(() => undefined);
        return () => { active = false; };
    }, [vehicleId]);
    return history;
}

function DatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const preset = value === isoDay() ? "today" : value === isoDay(1) ? "yesterday" : "other";
    return <div>
        <span className="text-[13px] text-[#666]">When</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
            <button type="button" onClick={() => onChange(isoDay())} className={chipClass(preset === "today")}>Today</button>
            <button type="button" onClick={() => onChange(isoDay(1))} className={chipClass(preset === "yesterday")}>Yesterday</button>
            <label className={`${chipClass(preset === "other")} relative inline-flex items-center`}>{preset === "other" ? new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`)) : "Other date"}<input type="date" max={isoDay()} value={value} onChange={(event) => event.target.value && onChange(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Choose another date" /></label>
        </div>
    </div>;
}

export function QuickLogForm({ vehicle, kind, onSaved, onCancel, compact = false }: { vehicle: PortalVehicle; kind: LogKind; onSaved: (message: string) => void; onCancel?: () => void; compact?: boolean }) {
    const history = useVehicleHistory(vehicle.id);
    const [date, setDate] = useState(isoDay());
    const [amount, setAmount] = useState("");
    const [litres, setLitres] = useState("");
    const [litresEdited, setLitresEdited] = useState(false);
    const [odometer, setOdometer] = useState("");
    const [serviceType, setServiceType] = useState("Oil change");
    const [otherService, setOtherService] = useState("");
    const [provider, setProvider] = useState("");
    const [cost, setCost] = useState("");
    const [category, setCategory] = useState("Tyres");
    const [note, setNote] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const estimatedLitres = useMemo(() => {
        const paid = Number(amount);
        return history.pricePerLitre && paid > 0 ? Math.round((paid / history.pricePerLitre) * 10) / 10 : null;
    }, [amount, history.pricePerLitre]);
    const litresValue = litresEdited ? litres : estimatedLitres ? String(estimatedLitres) : litres;

    const odometerHint = history.lastOdometer ? `Last: ${history.lastOdometer.toLocaleString()} km` : "Optional";
    const odometerValue = odometer ? Number(odometer) : null;
    const odometerTooLow = odometerValue != null && history.lastOdometer != null && odometerValue < history.lastOdometer;

    async function submit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        const description = serviceType === "Other" ? otherService.trim() : serviceType;
        if (kind === "service" && description.length < 2) return setError("Say what was done.");
        const body = kind === "fuel"
            ? { type: "fuel", vehicleId: vehicle.id, date, litres: Number(litresValue), totalCost: Number(amount), odometer: odometerValue }
            : kind === "service"
                ? { type: "service", vehicleId: vehicle.id, date, description, provider: provider.trim() || undefined, mileage: odometerValue, cost: cost ? Number(cost) : null }
                : { type: "issue", vehicleId: vehicle.id, category, note: note.trim() || undefined };
        setBusy(true);
        try {
            const response = await fetch("/api/portal/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || "Could not save");
            window.dispatchEvent(new Event("portal-activity-changed"));
            window.dispatchEvent(new Event("portal-issues-changed"));
            onSaved(kind === "fuel" ? `Fill-up saved for ${plateOf(vehicle)}` : kind === "service" ? `Service saved for ${plateOf(vehicle)}` : `Problem reported for ${plateOf(vehicle)}`);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save");
        } finally {
            setBusy(false);
        }
    }

    const saveLabel = kind === "fuel" ? "Save fill-up" : kind === "service" ? "Save service" : "Report problem";
    return <form onSubmit={submit} className={`grid gap-4 ${compact ? "rounded-[14px] border border-[#EAEAEA] bg-[#FAFAFA] p-4" : ""}`}>
        {kind === "fuel" && <>
            <label className="text-[13px] text-[#666]">Amount paid
                <div className="relative mt-1.5"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] text-[#888]">GH₵</span><input className={fieldClass + " pl-14 text-[20px]"} type="number" inputMode="decimal" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" autoFocus={!compact} required /></div>
            </label>
            <div className="grid grid-cols-2 gap-3">
                <label className="text-[13px] text-[#666]">Litres<input className={fieldClass + " mt-1.5"} type="number" inputMode="decimal" min="0.01" step="0.01" value={litresValue} onChange={(event) => { setLitres(event.target.value); setLitresEdited(true); }} placeholder={estimatedLitres ? String(estimatedLitres) : "e.g. 30"} required />{estimatedLitres && !litresEdited && <span className="mt-1 block text-[11px] text-[#888]">Worked out from your last price</span>}</label>
                <label className="text-[13px] text-[#666]">Odometer (km)<input className={fieldClass + " mt-1.5"} type="number" inputMode="numeric" min="0" step="1" value={odometer} onChange={(event) => setOdometer(event.target.value)} placeholder={odometerHint} />{odometerTooLow && <span className="mt-1 block text-[11px] text-[#B06A12]">Lower than the last reading</span>}</label>
            </div>
            <DatePicker value={date} onChange={setDate} />
        </>}

        {kind === "service" && <>
            <div><span className="text-[13px] text-[#666]">What was done</span><div className="mt-1.5 flex flex-wrap gap-2">{serviceTypes.map((item) => <button key={item} type="button" onClick={() => setServiceType(item)} aria-pressed={serviceType === item} className={chipClass(serviceType === item)}>{item}</button>)}</div>
                {serviceType === "Other" && <input className={fieldClass + " mt-2"} value={otherService} onChange={(event) => setOtherService(event.target.value)} placeholder="e.g. Replaced wipers" maxLength={200} autoFocus />}</div>
            <div className="grid grid-cols-2 gap-3">
                <label className="text-[13px] text-[#666]">Mileage (km)<input className={fieldClass + " mt-1.5"} type="number" inputMode="numeric" min="0" step="1" value={odometer} onChange={(event) => setOdometer(event.target.value)} placeholder={odometerHint} /></label>
                <label className="text-[13px] text-[#666]">Cost (GH₵)<input className={fieldClass + " mt-1.5"} type="number" inputMode="decimal" min="0" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="Optional" /></label>
            </div>
            <label className="text-[13px] text-[#666]">Workshop or mechanic<input className={fieldClass + " mt-1.5"} value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="Optional" maxLength={120} /></label>
            <DatePicker value={date} onChange={setDate} />
        </>}

        {kind === "issue" && <>
            <div><span className="text-[13px] text-[#666]">What is the problem?</span><div className="mt-1.5 flex flex-wrap gap-2">{issueCategories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={chipClass(category === item)}>{item}</button>)}</div></div>
            <label className="text-[13px] text-[#666]">Short note <span className="text-[#999]">(optional)</span><textarea className={fieldClass + " mt-1.5 h-24 resize-none py-3"} value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="e.g. Front left tyre keeps losing pressure" /></label>
        </>}

        {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
        <div className="flex gap-2">
            <button type="submit" disabled={busy} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[15px] text-white disabled:opacity-50 sm:flex-none">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saveLabel}</button>
            {onCancel && <button type="button" onClick={onCancel} className="h-12 rounded-full px-4 text-[14px] text-[#666]">Cancel</button>}
        </div>
    </form>;
}

export function QuickLogSheet({ open, onOpenChange, vehicles, initialVehicleId, initialKind }: { open: boolean; onOpenChange: (open: boolean) => void; vehicles: PortalVehicle[]; initialVehicleId?: string; initialKind?: LogKind }) {
    const [kind, setKind] = useState<LogKind | null>(initialKind || null);
    const [vehicleId, setVehicleId] = useState(initialVehicleId || vehicles[0]?.id || "");
    const [saved, setSaved] = useState<string | null>(null);

    // The parent mounts this sheet fresh each time it opens, so state starts from the props.

    const vehicle = vehicles.find((item) => item.id === vehicleId);
    const title = saved ? "Saved" : kind ? logKinds.find((item) => item.key === kind)!.label === "Problem" ? "Report a problem" : `Log a ${logKinds.find((item) => item.key === kind)!.label.toLowerCase()}` : "What would you like to log?";

    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bottom-0 left-0 top-auto max-h-[92dvh] max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-b-none rounded-t-[22px] border border-[#EAEAEA] bg-white p-5 pb-[max(20px,env(safe-area-inset-bottom))] text-[#171717] sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-[520px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[20px] sm:p-7">
            <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#E3E3E3] sm:hidden" />
            <DialogTitle className="pr-8 text-[22px] font-normal tracking-[-0.03em]">{title}</DialogTitle>
            <DialogDescription className="sr-only">Add a fill-up, service or problem to one of your cars.</DialogDescription>

            {saved ? <div className="pt-4">
                <div className="flex items-center gap-3 rounded-[14px] bg-[#EAF7F0] p-4 text-[#197252]"><Check className="h-5 w-5 shrink-0" /><p className="text-[15px]">{saved}</p></div>
                <div className="mt-5 flex gap-2"><button type="button" onClick={() => { setSaved(null); setKind(null); }} className="h-12 flex-1 rounded-full border border-[#E3E3E3] text-[15px]">Log something else</button><button type="button" onClick={() => onOpenChange(false)} className="h-12 flex-1 rounded-full bg-[#1111F6] text-[15px] text-white">Done</button></div>
            </div> : <div className="pt-4">
                {vehicles.length > 1 && <div className="mb-5"><span className="text-[13px] text-[#666]">Car</span><div className="-mx-1 mt-1.5 flex gap-2 overflow-x-auto px-1 pb-1">{vehicles.map((item) => <button key={item.id} type="button" onClick={() => setVehicleId(item.id)} aria-pressed={vehicleId === item.id} className={chipClass(vehicleId === item.id)}>{plateOf(item)}</button>)}</div></div>}
                {!kind ? <div className="grid gap-2.5">{logKinds.map(({ key, label, detail, icon: Icon }) => <button key={key} type="button" onClick={() => setKind(key)} className="flex items-center gap-4 rounded-[16px] border border-[#EAEAEA] p-4 text-left transition-colors hover:border-[#B8B8FF] hover:bg-[#FAFAFF]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#EEEEFF] text-[#1111F6]"><Icon className="h-5 w-5" /></span>
                    <span><span className="block text-[16px]">{label}</span><span className="block text-[13px] text-[#777]">{detail}</span></span>
                </button>)}</div> : vehicle && <>
                    {!initialKind && <button type="button" onClick={() => setKind(null)} className="mb-3 text-[13px] text-[#1111F6]">← Choose something else</button>}
                    <QuickLogForm key={`${vehicle.id}-${kind}`} vehicle={vehicle} kind={kind} onSaved={setSaved} />
                </>}
            </div>}
        </DialogContent>
    </Dialog>;
}
