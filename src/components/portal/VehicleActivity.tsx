"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Fuel, Plus, Wrench } from "lucide-react";
import type { PortalVehicle } from "@/lib/portalTypes";
import { QuickLogForm } from "@/components/portal/QuickLog";

type ServiceEntry = { id: string; service_date: string; description: string; provider_name: string | null; cost: number | null; is_verified: boolean };
type FuelEntry = { id: string; date: string; liters: number; total_cost: number; odometer_reading: number | null };
type Issue = { id: string; category: string; note: string | null; status: "open" | "resolved"; resolution_note: string | null; created_at: string };
type Activity = { services: ServiceEntry[]; fuel: FuelEntry[]; issues: Issue[]; issuesAvailable: boolean };
type Tab = "service" | "fuel" | "issues";

const fieldClass = "h-11 w-full rounded-[9px] border border-[#DEDEDE] bg-white px-3 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10 sm:text-[14px]";
const money = (value: number) => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 2 }).format(value);
const displayDate = (value: string) => {
    const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export default function VehicleActivity({ vehicle, editable }: { vehicle: PortalVehicle; editable: boolean }) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<Tab>("service");
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fuelFormOpen, setFuelFormOpen] = useState(false);
    const [issueFormOpen, setIssueFormOpen] = useState(false);
    const [serviceFormOpen, setServiceFormOpen] = useState(false);
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
    const openIssues = activity?.issues.filter((issue) => issue.status === "open").length || 0;
    const tabs: { key: Tab; label: string; icon: typeof Wrench; count?: number }[] = [
        { key: "service", label: "Service", icon: Wrench, count: activity?.services.length },
        { key: "fuel", label: "Fuel", icon: Fuel, count: activity?.fuel.length },
        ...(activity?.issuesAvailable === false ? [] : [{ key: "issues" as Tab, label: "Issues", icon: AlertCircle, count: openIssues || undefined }]),
    ];

    return <div className="border-t border-[#EEEEEE] bg-white">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-[52px] w-full items-center justify-between gap-3 px-5 text-left text-[14px] text-[#171717] hover:text-[#1111F6] sm:px-6">
            <span>Service, fuel and issues</span><ChevronDown className={`h-4 w-4 text-[#777] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && <div className="px-5 pb-5 sm:px-6">
            <div role="tablist" aria-label="Vehicle activity" className="flex gap-1 rounded-full bg-[#F3F3F3] p-1">
                {tabs.map(({ key, label, icon: Icon, count }) => <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full text-[13px] transition-colors ${tab === key ? "bg-white text-[#171717] shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-[#666] hover:text-[#171717]"}`}>
                    <Icon className={`h-3.5 w-3.5 ${tab === key ? "text-[#1111F6]" : ""}`} />{label}{count ? <span className={`rounded-full px-1.5 text-[11px] ${key === "issues" ? "bg-[#FFF1D5] text-[#915C12]" : "bg-[#EEEEEE] text-[#666]"}`}>{count}</span> : null}
                </button>)}
            </div>

            <div role="tabpanel" className="pt-4">
                {loading && !activity ? <p role="status" className="py-4 text-[13px] text-[#777]">Loading vehicle activity…</p> : null}
                {error && <p role="alert" className="mb-3 text-[13px] text-red-600">{error} <button type="button" onClick={() => void load()} className="underline">Try again</button></p>}

                {activity && tab === "service" && <>
                    activity.services.length ? <ul className="divide-y divide-[#EEE]">{activity.services.map((entry) => <li key={entry.id} className="py-3 text-[13px]">
                    <div className="flex justify-between gap-3"><span className="text-[14px]">{entry.description}</span><span className="shrink-0 text-[#666]">{entry.cost == null ? "" : money(Number(entry.cost))}</span></div>
                    <p className="mt-1 text-[#777]">{displayDate(entry.service_date)}{entry.provider_name ? ` · ${entry.provider_name}` : ""}</p>
                    {entry.is_verified ? <span className="mt-1.5 inline-flex rounded-full bg-[#EAF7F0] px-2 py-0.5 text-[11px] text-[#197252]">Recorded by mechanic</span> : <span className="mt-1.5 inline-flex rounded-full bg-[#F2F2F2] px-2 py-0.5 text-[11px] text-[#666]">Added by you</span>}
                </li>)}</ul> : <p className="py-2 text-[13px] leading-relaxed text-[#777]">No service records yet. Add one yourself, or ask your mechanic to log it from the car's Smart Card.</p>
                    {serviceFormOpen ? <div className="mt-3"><QuickLogForm compact vehicle={vehicle} kind="service" onSaved={() => setServiceFormOpen(false)} onCancel={() => setServiceFormOpen(false)} /></div> : <button type="button" onClick={() => setServiceFormOpen(true)} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DADAF8] px-4 text-[13px] text-[#1111F6]"><Plus className="h-4 w-4" />Add a service</button>}
                </>}

                {activity && tab === "fuel" && <>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-[12px] bg-[#F7F7F7] p-3"><span className="block text-[12px] text-[#777]">Last 7 days</span><span className="mt-0.5 block text-[17px] tracking-[-0.02em]">{money(weeklySpend)}</span></div>
                        <div className="rounded-[12px] bg-[#F7F7F7] p-3"><span className="block text-[12px] text-[#777]">Last fill-up</span><span className="mt-0.5 block text-[17px] tracking-[-0.02em]">{activity.fuel[0] ? displayDate(activity.fuel[0].date) : "None yet"}</span></div>
                    </div>
                    {activity.fuel.length > 0 && <ul className="mt-2 divide-y divide-[#EEE]">{activity.fuel.slice(0, 5).map((entry) => <li key={entry.id} className="flex justify-between gap-3 py-2.5 text-[13px]"><span>{displayDate(entry.date)} · {Number(entry.liters)} L{entry.odometer_reading == null ? "" : <span className="text-[#777]"> · {Number(entry.odometer_reading).toLocaleString()} km</span>}</span><span>{money(Number(entry.total_cost))}</span></li>)}</ul>}
                    {fuelFormOpen ? <div className="mt-3"><QuickLogForm compact vehicle={vehicle} kind="fuel" onSaved={() => setFuelFormOpen(false)} onCancel={() => setFuelFormOpen(false)} /></div> : <button type="button" onClick={() => setFuelFormOpen(true)} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DADAF8] px-4 text-[13px] text-[#1111F6]"><Plus className="h-4 w-4" />Add fill-up</button>}
                </>}

                {activity && tab === "issues" && <>
                    {activity.issues.length ? <ul className="divide-y divide-[#EEE]">{activity.issues.map((issue) => <li key={issue.id} className="py-3 text-[13px]">
                        <div className="flex justify-between gap-3"><span className="text-[14px]">{issue.category}</span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${issue.status === "open" ? "bg-[#FFF4DF] text-[#915C12]" : "bg-[#EAF7F0] text-[#197252]"}`}>{issue.status === "open" ? "Open" : "Resolved"}</span></div>
                        {issue.note && <p className="mt-1 text-[#666]">{issue.note}</p>}
                        {issue.resolution_note && <p className="mt-1 text-[#277E62]">Outcome: {issue.resolution_note}</p>}
                        {editable && issue.status === "open" && (resolvingId === issue.id ? <div className="mt-3 flex flex-col gap-2"><input className={fieldClass} value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="What was done?" maxLength={500} autoFocus /><div className="flex gap-2"><button type="button" disabled={busy || resolutionNote.trim().length < 2} onClick={() => void resolveIssue(issue.id)} className="h-10 rounded-full bg-[#1111F6] px-4 text-white disabled:opacity-50">Mark resolved</button><button type="button" onClick={() => setResolvingId(null)} className="h-10 px-3 text-[#666]">Cancel</button></div></div> : <button type="button" onClick={() => setResolvingId(issue.id)} className="mt-1.5 min-h-9 text-[#1111F6]">Mark as resolved</button>)}
                    </li>)}</ul> : <p className="py-2 text-[13px] text-[#777]">No problems reported for this car.</p>}
                    {issueFormOpen ? <div className="mt-3"><QuickLogForm compact vehicle={vehicle} kind="issue" onSaved={() => setIssueFormOpen(false)} onCancel={() => setIssueFormOpen(false)} /></div> : <button type="button" onClick={() => setIssueFormOpen(true)} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DADAF8] px-4 text-[13px] text-[#1111F6]"><Plus className="h-4 w-4" />Report a problem</button>}
                </>}
            </div>
        </div>}
    </div>;
}
