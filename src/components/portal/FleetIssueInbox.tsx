"use client";

import { useCallback, useEffect, useState } from "react";

type FleetIssue = { id: string; vehicle_id: string; vehicleLabel: string; category: string; note: string | null; created_at: string };

export default function FleetIssueInbox({ orgId }: { orgId: string }) {
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

    if (!available) return null;
    return <section className="mb-8 rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-6" aria-label="Vehicle issues needing attention">
        <div className="flex items-baseline justify-between gap-3"><h2 className="text-[20px] tracking-[-0.03em]">Issues needing attention</h2><span className="text-[13px] text-[#777]">{issues.length} open</span></div>
        {error && <p role="alert" className="mt-3 text-[13px] text-red-600">{error} <button type="button" className="underline" onClick={() => void load()}>Try again</button></p>}
        {!issues.length && !error ? <p className="mt-3 text-[14px] text-[#777]">No open vehicle issues reported.</p> : <div className="mt-4 divide-y divide-[#EEE]">{issues.map((issue) => <div key={issue.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-[15px]">{issue.vehicleLabel} · {issue.category}</p><p className="mt-1 text-[13px] text-[#777]">{issue.note || "No extra details"}</p></div><a href={`#vehicle-${issue.vehicle_id}`} className="text-[13px] text-[#1111F6]">View vehicle</a></div>
            {resolvingId === issue.id ? <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input className="h-10 min-w-0 flex-1 rounded-[8px] border border-[#DDD] px-3 text-[13px]" value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="What was done?" maxLength={500} /><button type="button" onClick={() => void resolve(issue)} disabled={busy || resolutionNote.trim().length < 2} className="h-10 rounded-full bg-[#1111F6] px-4 text-[13px] text-white disabled:opacity-50">Mark resolved</button><button type="button" onClick={() => setResolvingId(null)} className="h-10 px-2 text-[13px]">Cancel</button></div> : <button type="button" onClick={() => setResolvingId(issue.id)} className="mt-2 text-[13px] text-[#1111F6]">Add outcome</button>}
        </div>)}</div>}
    </section>;
}
