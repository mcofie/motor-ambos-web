"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { listRequests, updateRequestStatus, assignRequestProvider, listProviders, listServices, listMembersWithMemberships, type MemberWithMembershipRow } from "@/lib/supaFetch";
import { requestInfo } from "../requestInfo";
import { Check, Loader2, MapPin, MessageCircle, Phone, Search, X } from "lucide-react";
import { RequestRow, RequestStatus, ProviderRow, ServiceRow } from "../types";
import { cls, StatusBadge } from "../ui/AdminUI";
import { useConfirm } from "../ui/useConfirm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Tab = "waiting" | "active" | "done" | "all";

const TABS: { key: Tab; label: string; statuses: (string | null)[] }[] = [
    { key: "waiting", label: "Waiting", statuses: ["pending", null] },
    { key: "active", label: "In hand", statuses: ["accepted", "in_progress"] },
    { key: "done", label: "Done", statuses: ["completed", "cancelled"] },
    { key: "all", label: "All", statuses: [] },
];

const quietBtn = "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-[#E3E3E3] bg-white px-3.5 text-[13px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";
const primaryBtn = "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#1111F6] px-3.5 text-[13px] text-white transition-colors hover:bg-[#0606D8] disabled:opacity-50";

const isAbort = (err: unknown) => err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));
const digits = (phone?: string | null) => (phone || "").replace(/\D/g, "").replace(/^0/, "233");

function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const rad = Math.PI / 180;
    const h = Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
    return 12742 * Math.asin(Math.sqrt(h));
}

function since(value: string, now: number) {
    const minutes = Math.max(0, Math.round((now - new Date(value).getTime()) / 60000));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Roadside requests: see who is waiting, give them a provider, and close them off. */
export function RequestsView() {
    const [list, setList] = useState<RequestRow[]>([]);
    const [providers, setProviders] = useState<ProviderRow[]>([]);
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("waiting");
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState<string | null>(null);
    const [assigning, setAssigning] = useState<RequestRow | null>(null);
    const [providerQuery, setProviderQuery] = useState("");
    const [now, setNow] = useState(() => Date.now());
    const { ask, dialog } = useConfirm();

    const fetchRequests = useCallback(async (signal?: AbortSignal) => {
        try {
            setList((await listRequests(undefined, signal)) as RequestRow[]);
        } catch (err) {
            if (isAbort(err)) return;
            console.error(err);
            toast.error("Could not load requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
        fetchRequests(controller.signal);
        listProviders(undefined, controller.signal).then((rows) => setProviders(rows as ProviderRow[])).catch(() => {});
        listServices(controller.signal).then((rows) => setServices(rows as ServiceRow[])).catch(() => {});
        listMembersWithMemberships(controller.signal).then(setMembers).catch(() => {});

        // Check for new requests every 20 seconds and keep the waiting times current.
        const poll = window.setInterval(() => { void fetchRequests(); setNow(Date.now()); }, 20_000);
        return () => { controller.abort(); window.clearInterval(poll); };
    }, [fetchRequests]);

    const providerById = useMemo(() => new Map(providers.map((p) => [p.id, p])), [providers]);
    const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);
    // App requests carry who sent them but not their name or phone, so look the member up.
    const memberByAuth = useMemo(() => new Map(members.filter((m) => m.auth_user_id).map((m) => [m.auth_user_id as string, m])), [members]);
    const driverOf = useCallback((r: RequestRow) => {
        const member = r.created_by ? memberByAuth.get(r.created_by) : undefined;
        return { name: r.driver_name || member?.full_name || null, phone: r.driver_phone || member?.phone || null };
    }, [memberByAuth]);

    const counts = Object.fromEntries(TABS.map((t) => [t.key, t.statuses.length ? list.filter((r) => t.statuses.includes(r.status)).length : list.length])) as Record<Tab, number>;
    const current = TABS.find((t) => t.key === tab)!;
    const shown = list.filter((r) => {
        if (current.statuses.length && !current.statuses.includes(r.status)) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const info = requestInfo(r);
        const driver = driverOf(r);
        return [driver.name, driver.phone, r.address_line, info.issue, info.note, r.provider_id && providerById.get(r.provider_id)?.display_name].some((v) => typeof v === "string" && v.toLowerCase().includes(q));
    });
    // Oldest first while waiting, so the longest wait is on top.
    if (tab === "waiting") shown.reverse();

    async function setStatus(r: RequestRow, status: RequestStatus) {
        setBusy(r.id);
        try {
            await updateRequestStatus(r.id, status);
            setList((prev) => prev.map((x) => x.id === r.id ? { ...x, status } : x));
            toast.success(status === "completed" ? "Marked done" : status === "cancelled" ? "Request cancelled" : "Status updated");
        } catch {
            toast.error("Could not update the request");
        } finally {
            setBusy(null);
        }
    }

    async function assign(providerId: string | null) {
        if (!assigning) return;
        const request = assigning;
        setBusy(request.id);
        try {
            await assignRequestProvider(request.id, providerId);
            setList((prev) => prev.map((x) => x.id === request.id ? { ...x, provider_id: providerId, status: providerId ? "accepted" : "pending" } : x));
            toast.success(providerId ? `Given to ${providerById.get(providerId)?.display_name || "provider"}` : "Provider removed");
            setAssigning(null);
        } catch {
            toast.error("Could not assign the provider");
        } finally {
            setBusy(null);
        }
    }

    // Providers for the assign dialog: active ones first, nearest first when we know where the driver is.
    const requestPoint = assigning ? requestInfo(assigning).point : null;
    const providerChoices = providers
        .filter((p) => !providerQuery.trim() || [p.display_name, p.address_line].some((v) => v?.toLowerCase().includes(providerQuery.trim().toLowerCase())))
        .map((p) => ({ provider: p, distance: requestPoint && p.lat != null && p.lng != null ? km(requestPoint, { lat: p.lat, lng: p.lng }) : null }))
        .sort((a, b) => Number(b.provider.is_active) - Number(a.provider.is_active) || (a.distance ?? 9e9) - (b.distance ?? 9e9))
        .slice(0, 30);

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    return (
        <div className="flex flex-col gap-5 pb-8">
            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 sm:p-5 lg:flex-row lg:items-center">
                    <div className="flex gap-1.5 overflow-x-auto">
                        {TABS.map((t) => (
                            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cls("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] transition-colors", tab === t.key ? "bg-[#171717] text-white" : "bg-[#F2F2F2] text-[#555] hover:bg-[#EAEAEA]")}>
                                {t.label}
                                <span className={cls(tab === t.key ? "text-white/60" : "text-[#999]", t.key === "waiting" && counts.waiting > 0 && tab !== t.key && "text-[#915C12]")}>{counts[t.key]}</span>
                            </button>
                        ))}
                    </div>
                    <label className="relative block flex-1">
                        <span className="sr-only">Search requests</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input className="h-10 w-full rounded-full border border-[#E3E3E3] bg-white pl-10 pr-4 text-[14px] outline-none placeholder:text-[#AAA] focus:border-[#1111F6]" placeholder="Search driver, phone, place or provider" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </label>
                </div>

                {shown.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {shown.map((r) => {
                        const provider = r.provider_id ? providerById.get(r.provider_id) : undefined;
                        const service = r.service_id ? serviceById.get(r.service_id)?.name : null;
                        const { issue, note, point } = requestInfo(r);
                        const driver = driverOf(r);
                        const mapUrl = point ? `https://www.google.com/maps?q=${point.lat},${point.lng}` : r.address_line ? `https://www.google.com/maps/search/${encodeURIComponent(r.address_line)}` : null;
                        const waiting = !r.status || r.status === "pending";
                        const open = waiting || r.status === "accepted" || r.status === "in_progress";
                        const longWait = waiting && now - new Date(r.created_at).getTime() > 15 * 60000;
                        return (
                            <li key={r.id} className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-start">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-[15px]">{driver.name || "Unknown driver"}</p>
                                        {!waiting && <StatusBadge status={r.status || "pending"} />}
                                        <span className={cls("text-[13px]", longWait ? "text-[#AA3333]" : "text-[#888]")} suppressHydrationWarning>{waiting ? (since(r.created_at, now).endsWith(" ago") ? `Waiting ${since(r.created_at, now).replace(" ago", "")}` : `Waiting since ${since(r.created_at, now)}`) : since(r.created_at, now)}</span>
                                    </div>
                                    <p className="mt-1 text-[14px] text-[#555]">{issue || service || "Roadside help"}{note && <span className="text-[#888]"> · {note}</span>}</p>
                                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#888]"><MapPin className="h-3.5 w-3.5 shrink-0" />{mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer" className="truncate hover:text-[#1111F6]">{r.address_line || "Open location in Google Maps"}</a> : "No location shared"}</p>
                                    {provider && <p className="mt-1 text-[13px] text-[#555]">Provider: <span className="text-[#171717]">{provider.display_name}</span>{provider.phone_business && <a href={`tel:${provider.phone_business}`} className="ml-1.5 text-[#1111F6]">{provider.phone_business}</a>}</p>}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                    {driver.phone && <>
                                        <a href={`tel:${driver.phone}`} className={quietBtn} aria-label={`Call ${driver.name || "driver"}`}><Phone className="h-3.5 w-3.5" />Call</a>
                                        <a href={`https://wa.me/${digits(driver.phone)}`} target="_blank" rel="noreferrer" className={quietBtn} aria-label="WhatsApp the driver"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</a>
                                    </>}
                                    {open && <button type="button" onClick={() => { setAssigning(r); setProviderQuery(""); }} disabled={busy === r.id} className={waiting && !r.provider_id ? primaryBtn : quietBtn}>{r.provider_id ? "Change provider" : "Assign provider"}</button>}
                                    {r.status === "accepted" && <button type="button" onClick={() => setStatus(r, "in_progress")} disabled={busy === r.id} className={quietBtn}>On the way</button>}
                                    {open && !waiting && <button type="button" onClick={() => setStatus(r, "completed")} disabled={busy === r.id} className={primaryBtn}><Check className="h-3.5 w-3.5" />Mark done</button>}
                                    {open && <button type="button" onClick={async () => { if (await ask({ title: `Cancel ${driver.name || "this driver"}’s request?`, body: "It moves to Done. You can reopen it later.", confirm: "Cancel request", danger: true })) void setStatus(r, "cancelled"); }} disabled={busy === r.id} aria-label="Cancel request" className="flex h-9 w-9 items-center justify-center rounded-full text-[#888] hover:bg-[#FFF0EF] hover:text-[#AA3333]"><X className="h-4 w-4" /></button>}
                                    {!open && <button type="button" onClick={() => setStatus(r, "pending")} disabled={busy === r.id} className={quietBtn}>Reopen</button>}
                                </div>
                            </li>
                        );
                    })}
                </ul> : <div className="px-6 py-14 text-center">
                    <p className="text-[15px]">{tab === "waiting" && !query ? "Nobody is waiting." : "No requests here."}</p>
                    <p className="mt-1 text-[14px] text-[#888]">{tab === "waiting" && !query ? "New requests appear here as they come in." : "Try another tab or search."}</p>
                </div>}
            </section>

            <Dialog open={!!assigning} onOpenChange={(open) => !open && setAssigning(null)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Assign a provider</DialogTitle>
                        <DialogDescription>{(assigning && driverOf(assigning).name) || "Driver"}{assigning?.address_line ? `, ${assigning.address_line}` : ""}. {requestPoint ? "Nearest active providers first." : "Active providers first."}</DialogDescription>
                    </DialogHeader>
                    <label className="relative block">
                        <span className="sr-only">Find a provider</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input autoFocus className="h-11 w-full rounded-[12px] border border-[#E3E3E3] pl-10 pr-4 text-[14px] outline-none focus:border-[#1111F6]" placeholder="Name or area" value={providerQuery} onChange={(e) => setProviderQuery(e.target.value)} />
                    </label>
                    <ul className="max-h-80 divide-y divide-[#F0F0F0] overflow-y-auto rounded-[14px] border border-[#EAEAEA]">
                        {providerChoices.map(({ provider, distance }) => (
                            <li key={provider.id}>
                                <button type="button" onClick={() => assign(provider.id)} disabled={busy === assigning?.id} className={cls("flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] hover:bg-[#FAFAFA]", assigning?.provider_id === provider.id && "bg-[#F3F3FF]")}>
                                    <span className="min-w-0 flex-1"><span className="block truncate">{provider.display_name}</span><span className="block truncate text-[13px] text-[#888]">{provider.address_line || "No address"}</span></span>
                                    {distance != null && <span className="shrink-0 text-[13px] text-[#555]">{distance < 10 ? distance.toFixed(1) : Math.round(distance)} km</span>}
                                    {!provider.is_active && <span className="shrink-0 rounded-full bg-[#F2F2F2] px-2 py-0.5 text-[12px] text-[#666]">Off</span>}
                                </button>
                            </li>
                        ))}
                        {!providerChoices.length && <li className="px-4 py-6 text-center text-[14px] text-[#888]">No providers match.</li>}
                    </ul>
                    {assigning?.provider_id && <button type="button" onClick={() => assign(null)} className="w-fit text-[13px] text-[#AA3333]">Remove the current provider</button>}
                </DialogContent>
            </Dialog>
            {dialog}
        </div>
    );
}
