"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ChevronRight } from "lucide-react";

export type FleetIssue = { id: string; vehicle_id: string; vehicleLabel: string; category: string; note: string | null; created_at: string };

function reportedAgo(value: string) {
    const days = Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
    if (Number.isNaN(days)) return "";
    return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function FleetIssueInbox({ orgId, onOpenVehicle, onIssuesChange }: { orgId: string; onOpenVehicle: (vehicleId: string) => void; onIssuesChange?: (issues: FleetIssue[]) => void }) {
    const [issues, setIssues] = useState<FleetIssue[]>([]);
    const [available, setAvailable] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [resolutionNote, setResolutionNote] = useState("");
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        try {
            const response = await fetch(`/api/portal/fleet/issues?orgId=${orgId}`, { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not load issues");
            setIssues(result.issues || []);
            setAvailable(result.available !== false);
            setError(null);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not load issues");
        }
    }, [orgId]);

    useEffect(() => { onIssuesChange?.(issues); }, [issues, onIssuesChange]);

    useEffect(() => {
        void load();
        window.addEventListener("portal-issues-changed", load);
        return () => window.removeEventListener("portal-issues-changed", load);
    }, [load]);

    async function resolve(issue: FleetIssue) {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/activity", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId: issue.vehicle_id, issueId: issue.id, resolutionNote }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not resolve issue");
            setResolvingId(null);
            setResolutionNote("");
            await load();
            window.dispatchEvent(new Event("portal-activity-changed"));
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not resolve issue");
        } finally {
            setBusy(false);
        }
    }

    if (!available || (!issues.length && !error)) return null;
    return <section id="issues" className="mb-8 scroll-mt-24 rounded-[18px] border border-[#F3E5C6] bg-white" aria-labelledby="issues-heading">
        <div className="flex items-center justify-between gap-3 border-b border-[#F3EEE2] px-5 py-4 sm:px-6">
            <h2 id="issues-heading" className="flex items-center gap-2 text-[17px] tracking-[-0.02em]"><AlertCircle className="h-5 w-5 shrink-0 text-[#B06A12]" />Reported problems</h2>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[#FFF4DF] px-2.5 py-1 text-[12px] text-[#915C12]">{issues.length} open</span>
        </div>
        {error && <p role="alert" className="px-5 pt-4 text-[13px] text-red-600 sm:px-6">{error} <button type="button" className="underline" onClick={() => void load()}>Try again</button></p>}
        <ul className="divide-y divide-[#F0F0F0]">{issues.map((issue) => <li key={issue.id} className="px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="text-[15px]">{issue.category} <span className="text-[#777]">· {issue.vehicleLabel}</span></p><p className="mt-0.5 text-[13px] text-[#777]">{issue.note || "No extra details"} · {reportedAgo(issue.created_at)}</p></div>
                <button type="button" onClick={() => onOpenVehicle(issue.vehicle_id)} className="inline-flex min-h-9 shrink-0 items-center gap-0.5 text-[13px] text-[#1111F6]">Vehicle<ChevronRight className="h-4 w-4" /></button>
            </div>
            {resolvingId === issue.id ? <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input className="h-10 min-w-0 flex-1 rounded-[8px] border border-[#DDD] px-3 text-[16px] outline-none focus:border-[#1111F6] sm:text-[13px]" value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="What was done?" maxLength={500} autoFocus /><div className="flex gap-2"><button type="button" onClick={() => void resolve(issue)} disabled={busy || resolutionNote.trim().length < 2} className="h-10 rounded-full bg-[#1111F6] px-4 text-[13px] text-white disabled:opacity-50">Mark resolved</button><button type="button" onClick={() => setResolvingId(null)} className="h-10 px-2 text-[13px] text-[#666]">Cancel</button></div></div> : <button type="button" onClick={() => setResolvingId(issue.id)} className="mt-2 inline-flex h-9 items-center rounded-full border border-[#E3E3E3] px-3.5 text-[13px] hover:border-[#1111F6] hover:text-[#1111F6]">Mark as resolved</button>}
        </li>)}</ul>
    </section>;
}
