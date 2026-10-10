"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AlertCircle, ChevronDown, Fuel, Wrench } from "lucide-react";
import type { PortalVehicle } from "@/lib/portalTypes";

type ServiceEntry = { id: string; service_date: string; description: string; provider_name: string | null; cost: number | null; is_verified: boolean };
type FuelEntry = { id: string; date: string; liters: number; total_cost: number; odometer_reading: number | null };
type Issue = { id: string; category: string; note: string | null; status: "open" | "resolved"; resolution_note: string | null; created_at: string };
type Activity = { services: ServiceEntry[]; fuel: FuelEntry[]; issues: Issue[]; issuesAvailable: boolean };

const fieldClass = "h-11 w-full rounded-[9px] border border-[#DEDEDE] bg-white px-3 text-[14px] outline-none focus:border-[#1111F6]";
const issueCategories = ["Tyres", "Battery", "Engine", "Brakes", "Electrical", "Other"];
const money = (value: number) => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 2 }).format(value);
const displayDate = (value: string) => new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

export default function VehicleActivity({ vehicle, editable }: { vehicle: PortalVehicle; editable: boolean }) {
    const [open, setOpen] = useState(false);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState("Tyres");
    const [note, setNote] = useState("");
    const [fuelDate, setFuelDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [litres, setLitres] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [odometer, setOdometer] = useState("");
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [resolutionNote, setResolutionNote] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/portal/activity?vehicleId=${vehicle.id}`, { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not load activity");
            setActivity(result as Activity);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not load activity");
        } finally {
            setLoading(false);
        }
    }, [vehicle.id]);

    useEffect(() => { if (open && !activity) void load(); }, [open, activity, load]);
    useEffect(() => {
        if (!open) return;
        window.addEventListener("portal-activity-changed", load);
        return () => window.removeEventListener("portal-activity-changed", load);
    }, [open, load]);

    async function post(body: Record<string, unknown>) {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not save activity");
            await load();
            window.dispatchEvent(new Event("portal-issues-changed"));
            return true;
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save activity");
            return false;
        } finally {
            setBusy(false);
        }
    }

    async function reportIssue(event: FormEvent) {
        event.preventDefault();
        if (await post({ type: "issue", vehicleId: vehicle.id, category, note })) setNote("");
    }

    async function addFuel(event: FormEvent) {
        event.preventDefault();
        if (await post({ type: "fuel", vehicleId: vehicle.id, date: fuelDate, litres: Number(litres), totalCost: Number(totalCost), odometer: odometer ? Number(odometer) : null })) {
            setLitres(""); setTotalCost(""); setOdometer("");
        }
    }

    async function resolveIssue(issueId: string) {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/activity", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId: vehicle.id, issueId, resolutionNote }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not resolve issue");
            setResolvingId(null); setResolutionNote("");
            await load();
            window.dispatchEvent(new Event("portal-issues-changed"));
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not resolve issue");
        } finally {
            setBusy(false);
        }
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklySpend = activity?.fuel.filter((entry) => new Date(entry.date) >= weekStart).reduce((total, entry) => total + Number(entry.total_cost || 0), 0) || 0;

    return <div className="border-t border-[#EEEEEE] bg-white px-5 py-4 sm:px-6">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-[14px] text-[#1111F6]">
            <span>Service, fuel & issues</span><ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="space-y-7 pb-3 pt-5">
            {loading && !activity ? <p role="status" className="text-[13px] text-[#777]">Loading vehicle activity…</p> : null}
            {error && <p role="alert" className="text-[13px] text-red-600">{error} <button type="button" onClick={() => void load()} className="underline">Try again</button></p>}
            {activity && <>
                <section>
                    <h4 className="flex items-center gap-2 text-[16px]"><Wrench className="h-4 w-4 text-[#1111F6]" />Service history</h4>
                    {activity.services.length ? <div className="mt-3 divide-y divide-[#EEE]">{activity.services.map((entry) => <div key={entry.id} className="py-3 text-[13px]"><div className="flex justify-between gap-3"><span className="font-medium">{entry.description}</span><span className="shrink-0 text-[#666]">{entry.cost == null ? "" : money(Number(entry.cost))}</span></div><p className="mt-1 text-[#777]">{entry.service_date}{entry.provider_name ? ` · ${entry.provider_name}` : ""}{entry.is_verified ? " · Provider recorded" : ""}</p></div>)}</div> : <p className="mt-2 text-[13px] text-[#777]">No service records yet. Records added by a service provider will appear here.</p>}
                </section>

                <section className="border-t border-[#EEE] pt-6">
                    <h4 className="flex items-center gap-2 text-[16px]"><Fuel className="h-4 w-4 text-[#1111F6]" />Fuel spending</h4>
                    <p className="mt-2 text-[13px] text-[#777]">Last 7 days: <span className="text-[#171717]">{money(weeklySpend)}</span> from recorded fill-ups.</p>
                    {activity.fuel.length > 0 && <div className="mt-3 divide-y divide-[#EEE]">{activity.fuel.slice(0, 5).map((entry) => <div key={entry.id} className="flex justify-between gap-3 py-2.5 text-[13px]"><span>{displayDate(entry.date)} · {Number(entry.liters)} L{entry.odometer_reading == null ? "" : ` · ${Number(entry.odometer_reading).toLocaleString()} km`}</span><span>{money(Number(entry.total_cost))}</span></div>)}</div>}
                    <form onSubmit={addFuel} className="mt-4 grid gap-2 sm:grid-cols-2">
                        <label className="text-[12px] text-[#666]">Date<input className={fieldClass + " mt-1"} type="date" value={fuelDate} onChange={(event) => setFuelDate(event.target.value)} required /></label>
                        <label className="text-[12px] text-[#666]">Litres<input className={fieldClass + " mt-1"} type="number" min="0.01" step="0.01" value={litres} onChange={(event) => setLitres(event.target.value)} required /></label>
                        <label className="text-[12px] text-[#666]">Total paid (GH₵)<input className={fieldClass + " mt-1"} type="number" min="0.01" step="0.01" value={totalCost} onChange={(event) => setTotalCost(event.target.value)} required /></label>
                        <label className="text-[12px] text-[#666]">Odometer (optional)<input className={fieldClass + " mt-1"} type="number" min="0" step="1" value={odometer} onChange={(event) => setOdometer(event.target.value)} /></label>
                        <button type="submit" disabled={busy} className="mt-1 h-11 rounded-full border border-[#DADAF8] px-4 text-[13px] text-[#1111F6] disabled:opacity-50 sm:col-span-2">Save fill-up</button>
                    </form>
                </section>

                {activity.issuesAvailable && <section className="border-t border-[#EEE] pt-6">
                    <h4 className="flex items-center gap-2 text-[16px]"><AlertCircle className="h-4 w-4 text-[#1111F6]" />Vehicle issues</h4>
                    {activity.issues.length ? <div className="mt-3 divide-y divide-[#EEE]">{activity.issues.map((issue) => <div key={issue.id} className="py-3 text-[13px]"><div className="flex justify-between gap-3"><span className="font-medium">{issue.category}</span><span className={issue.status === "open" ? "text-[#B06A12]" : "text-[#277E62]"}>{issue.status === "open" ? "Needs attention" : "Resolved"}</span></div>{issue.note && <p className="mt-1 text-[#666]">{issue.note}</p>}{issue.resolution_note && <p className="mt-1 text-[#277E62]">Outcome: {issue.resolution_note}</p>}{editable && issue.status === "open" && (resolvingId === issue.id ? <div className="mt-3 flex flex-col gap-2"><input className={fieldClass} value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="What was done?" maxLength={500} /><div className="flex gap-2"><button type="button" disabled={busy || resolutionNote.trim().length < 2} onClick={() => void resolveIssue(issue.id)} className="h-10 rounded-full bg-[#1111F6] px-4 text-white disabled:opacity-50">Mark resolved</button><button type="button" onClick={() => setResolvingId(null)}>Cancel</button></div></div> : <button type="button" onClick={() => setResolvingId(issue.id)} className="mt-2 text-[#1111F6]">Add outcome</button>)}</div>)}</div> : <p className="mt-2 text-[13px] text-[#777]">No issues reported.</p>}
                    <form onSubmit={reportIssue} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end">
                        <label className="text-[12px] text-[#666]">Problem<select className={fieldClass + " mt-1"} value={category} onChange={(event) => setCategory(event.target.value)}>{issueCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
                        <label className="text-[12px] text-[#666]">Short note (optional)<input className={fieldClass + " mt-1"} value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} placeholder="What happened?" /></label>
                        <button type="submit" disabled={busy} className="h-11 rounded-full bg-[#1111F6] px-4 text-[13px] text-white disabled:opacity-50">Report issue</button>
                    </form>
                </section>}
            </>}
        </div>}
    </div>;
}
