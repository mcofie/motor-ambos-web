"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { listProviders, deleteProvider, updateProvider, bulkUpdateProviders, listServices, listRequests } from "@/lib/supaFetch";
import { Download, List as ListIcon, Loader2, Map as MapIcon, MessageCircle, Pencil, Phone, Plus, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { ProviderRow, ServiceRow, RequestRow } from "../types";
import { cls } from "../ui/AdminUI";
import { useConfirm } from "../ui/useConfirm";
import ProviderMap from "./ProviderMap";
import { ProviderForm } from "./ProviderForm";
import { PROVIDER_TYPES, providerType } from "./providerTypes";

type Filter = "all" | "unverified" | "active" | "off";
type Sort = "newest" | "name" | "jobs";

const quietBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E3E3E3] bg-white px-4 text-[14px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";
const smallBtn = "inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E3E3E3] bg-white px-3 text-[13px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";
const select = "h-10 rounded-full border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#333] outline-none focus:border-[#1111F6]";

const isAbort = (err: unknown) => err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));

/** The roadside network: who is verified, who is taking jobs, and how they are doing. */
export function ProvidersView() {
    const [list, setList] = useState<ProviderRow[]>([]);
    const [requests, setRequests] = useState<RequestRow[]>([]);
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [type, setType] = useState<string>("all");
    const [sort, setSort] = useState<Sort>("newest");
    const [view, setView] = useState<"list" | "map">("list");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [busy, setBusy] = useState<string | null>(null);
    const { ask, dialog } = useConfirm();
    const [editing, setEditing] = useState<{ provider: ProviderRow | null } | null>(null);

    const fetchAll = useCallback(async (signal?: AbortSignal) => {
        try {
            const [p, r, s] = await Promise.all([listProviders(undefined, signal), listRequests(undefined, signal), listServices(signal)]);
            setList(p as ProviderRow[]);
            setRequests(r as RequestRow[]);
            setServices(s as ServiceRow[]);
        } catch (err) {
            if (isAbort(err)) return;
            console.error(err);
            toast.error("Could not load providers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
        fetchAll(controller.signal);
        return () => controller.abort();
    }, [fetchAll]);

    const jobs = useMemo(() => {
        const map = new Map<string, { total: number; done: number; closed: number }>();
        for (const r of requests) {
            if (!r.provider_id) continue;
            const entry = map.get(r.provider_id) || { total: 0, done: 0, closed: 0 };
            entry.total += 1;
            if (r.status === "completed") entry.done += 1;
            if (r.status === "completed" || r.status === "cancelled") entry.closed += 1;
            map.set(r.provider_id, entry);
        }
        return map;
    }, [requests]);

    const counts = {
        all: list.length,
        unverified: list.filter((p) => !p.is_verified).length,
        active: list.filter((p) => p.is_active).length,
        off: list.filter((p) => !p.is_active).length,
    };
    const typesInUse = PROVIDER_TYPES.filter((t) => list.some((p) => (p.provider_type || "mechanic") === t.value));

    const shown = list
        .filter((p) => filter === "all" || (filter === "unverified" && !p.is_verified) || (filter === "active" && p.is_active) || (filter === "off" && !p.is_active))
        .filter((p) => type === "all" || (p.provider_type || "mechanic") === type)
        .filter((p) => { const q = query.trim().toLowerCase(); return !q || [p.display_name, p.address_line, p.phone_business].some((v) => v?.toLowerCase().includes(q)); })
        .sort((a, b) => sort === "name" ? (a.display_name || "").localeCompare(b.display_name || "") : sort === "jobs" ? (jobs.get(b.id)?.total || 0) - (jobs.get(a.id)?.total || 0) : (b.created_at || "").localeCompare(a.created_at || ""));

    async function toggle(p: ProviderRow, key: "is_active" | "is_verified") {
        setBusy(`${p.id}-${key}`);
        try {
            await updateProvider(p.id, { [key]: !p[key] });
            setList((prev) => prev.map((x) => x.id === p.id ? { ...x, [key]: !p[key] } : x));
            toast.success(key === "is_verified" ? (p.is_verified ? "Verification removed" : `${p.display_name} verified`) : (p.is_active ? "Taken off jobs" : "Taking jobs again"));
        } catch {
            toast.error("Could not update the provider");
        } finally {
            setBusy(null);
        }
    }

    async function remove(p: ProviderRow) {
        if (!await ask({ title: `Delete ${p.display_name}?`, body: "Their past jobs stay, but they disappear from the network. To pause them instead, take them off jobs.", confirm: "Delete", danger: true })) return;
        try {
            await deleteProvider(p.id);
            setList((prev) => prev.filter((x) => x.id !== p.id));
            toast.success("Provider deleted");
        } catch {
            toast.error("Could not delete the provider");
        }
    }

    async function bulk(patch: Partial<Pick<ProviderRow, "is_active" | "is_verified">>, message: string) {
        const ids = Array.from(selected);
        setBusy("bulk");
        try {
            await bulkUpdateProviders(ids, patch);
            setList((prev) => prev.map((x) => selected.has(x.id) ? { ...x, ...patch } : x));
            setSelected(new Set());
            toast.success(`${ids.length} ${ids.length === 1 ? "provider" : "providers"} ${message}`);
        } catch {
            toast.error("Could not update the providers");
        } finally {
            setBusy(null);
        }
    }

    function exportCsv() {
        const rows = shown.map((p) => [p.display_name, providerType(p.provider_type).label, p.phone_business || "", p.address_line || "", p.is_active ? "Yes" : "No", p.is_verified ? "Yes" : "No", String(p.coverage_radius_km || 0), String(p.callout_fee || 0), String(jobs.get(p.id)?.total || 0)]);
        const csv = [["Name", "Type", "Phone", "Address", "Taking jobs", "Verified", "Covers (km)", "Call-out fee", "Jobs"], ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `providers-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    const filters: { key: Filter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "unverified", label: "To verify" },
        { key: "active", label: "Taking jobs" },
        { key: "off", label: "Off" },
    ];
    const allSelected = shown.length > 0 && shown.every((p) => selected.has(p.id));

    return (
        <div className="flex flex-col gap-5 pb-8">
            {counts.unverified > 0 && filter !== "unverified" && <button type="button" onClick={() => setFilter("unverified")} className="flex items-center justify-between gap-3 rounded-[16px] bg-[#FFF4DF] px-5 py-4 text-left text-[14px] text-[#915C12] hover:bg-[#FFEDCC]">
                <span><strong className="font-medium">{counts.unverified} {counts.unverified === 1 ? "provider needs" : "providers need"} verifying</strong> before drivers can fully trust them.</span>
                <span className="shrink-0">Review</span>
            </button>}

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-1.5 overflow-x-auto">
                            {filters.map((f) => (
                                <button key={f.key} type="button" onClick={() => setFilter(f.key)} className={cls("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] transition-colors", filter === f.key ? "bg-[#171717] text-white" : "bg-[#F2F2F2] text-[#555] hover:bg-[#EAEAEA]")}>
                                    {f.label}<span className={filter === f.key ? "text-white/60" : "text-[#999]"}>{counts[f.key]}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex rounded-full bg-[#F2F2F2] p-1">
                                {([["list", ListIcon, "List"], ["map", MapIcon, "Map"]] as const).map(([key, Icon, text]) => (
                                    <button key={key} type="button" onClick={() => setView(key)} className={cls("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px]", view === key ? "bg-white text-[#171717] shadow-sm" : "text-[#777]")}><Icon className="h-3.5 w-3.5" />{text}</button>
                                ))}
                            </div>
                            <button type="button" onClick={exportCsv} className={quietBtn}><Download className="h-4 w-4" />Export</button>
                            <button type="button" onClick={() => setEditing({ provider: null })} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8]"><Plus className="h-4 w-4" />Add provider</button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="relative block flex-1">
                            <span className="sr-only">Search providers</span>
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                            <input className="h-10 w-full rounded-full border border-[#E3E3E3] bg-white pl-10 pr-4 text-[14px] outline-none placeholder:text-[#AAA] focus:border-[#1111F6]" placeholder="Search name, area or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
                        </label>
                        <select aria-label="Type" className={select} value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="all">All types</option>
                            {typesInUse.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <select aria-label="Sort" className={select} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                            <option value="newest">Newest first</option>
                            <option value="name">Name A–Z</option>
                            <option value="jobs">Most jobs</option>
                        </select>
                    </div>
                </div>

                {selected.size > 0 && <div className="flex flex-wrap items-center gap-2 border-b border-[#F0F0F0] bg-[#F3F3FF] px-4 py-3 sm:px-5">
                    <span className="mr-1 text-[14px] text-[#1111F6]">{selected.size} selected</span>
                    <button type="button" disabled={busy === "bulk"} onClick={() => bulk({ is_verified: true }, "verified")} className={smallBtn}>Verify</button>
                    <button type="button" disabled={busy === "bulk"} onClick={() => bulk({ is_active: true }, "taking jobs")} className={smallBtn}>Put on jobs</button>
                    <button type="button" disabled={busy === "bulk"} onClick={() => bulk({ is_active: false }, "taken off jobs")} className={smallBtn}>Take off jobs</button>
                    <button type="button" onClick={() => setSelected(new Set())} aria-label="Clear selection" className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#555] hover:bg-white"><X className="h-4 w-4" /></button>
                </div>}

                {view === "map" ? <div className="h-[600px] p-4">
                    <ProviderMap key={`map-${shown.length}-${type}-${filter}`} providers={shown} requests={requests.filter((r) => r.status === "pending" || r.status === "accepted" || r.status === "in_progress")} onEdit={(p: ProviderRow) => setEditing({ provider: p })} />
                </div> : shown.length ? <>
                    <label className="flex items-center gap-3 border-b border-[#F0F0F0] px-4 py-2.5 text-[13px] text-[#777] sm:px-5">
                        <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(shown.map((p) => p.id)))} className="h-4 w-4 accent-[#1111F6]" />Select all {shown.length}
                    </label>
                    <ul className="divide-y divide-[#F0F0F0]">
                        {shown.map((p) => {
                            const t = providerType(p.provider_type);
                            const TypeIcon = t.icon;
                            const stats = jobs.get(p.id);
                            const phone = (p.phone_business || "").replace(/\D/g, "").replace(/^0/, "233");
                            return (
                                <li key={p.id} className={cls("flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center", selected.has(p.id) && "bg-[#FAFAFF]")}>
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <input type="checkbox" aria-label={`Select ${p.display_name}`} checked={selected.has(p.id)} onChange={() => setSelected((prev) => { const next = new Set(prev); if (next.has(p.id)) next.delete(p.id); else next.add(p.id); return next; })} className="h-4 w-4 shrink-0 accent-[#1111F6]" />
                                        {/* eslint-disable-next-line @next/next/no-img-element -- provider-supplied image of any host */}
                                        {p.logo_url ? <img src={p.logo_url} alt="" className="h-10 w-10 shrink-0 rounded-[12px] border border-[#EAEAEA] object-cover" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F3F3FF] text-[#1111F6]"><TypeIcon className="h-5 w-5" /></span>}
                                        <Link href={`/admin/providers/${p.id}`} className="group min-w-0 flex-1">
                                            <p className="flex items-center gap-1.5 truncate text-[15px] group-hover:text-[#1111F6]">{p.display_name}{p.is_verified && <ShieldCheck className="h-4 w-4 shrink-0 text-[#1111F6]" aria-label="Verified" />}</p>
                                            <p className="truncate text-[13px] text-[#888]">{t.label} · {p.address_line || "No address"}</p>
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-5 pl-7 text-[13px] text-[#777] lg:w-[220px] lg:pl-0">
                                        <span><span className="text-[15px] text-[#171717]">{stats?.total || 0}</span> {stats?.total === 1 ? "job" : "jobs"}</span>
                                        <span>{stats?.closed ? `${Math.round((stats.done / stats.closed) * 100)}% completed` : stats?.total ? "In progress" : "No jobs yet"}</span>
                                        <span>{p.coverage_radius_km || 0} km</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pl-7 lg:pl-0">
                                        <button type="button" onClick={() => toggle(p, "is_active")} disabled={busy === `${p.id}-is_active`} className={cls("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] transition-colors", p.is_active ? "bg-[#EAF7F0] text-[#197252] hover:bg-[#DDF1E6]" : "bg-[#F2F2F2] text-[#666] hover:bg-[#EAEAEA]")} title={p.is_active ? "Take off jobs" : "Put on jobs"}>
                                            <span className={cls("h-2 w-2 rounded-full", p.is_active ? "bg-[#197252]" : "bg-[#AAA]")} />{p.is_active ? "Taking jobs" : "Off"}
                                        </button>
                                        {!p.is_verified && <button type="button" onClick={() => toggle(p, "is_verified")} disabled={busy === `${p.id}-is_verified`} className={smallBtn}><ShieldCheck className="h-3.5 w-3.5" />Verify</button>}
                                        {p.phone_business && <>
                                            <a href={`tel:${p.phone_business}`} aria-label={`Call ${p.display_name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:bg-[#F3F3FF] hover:text-[#1111F6]"><Phone className="h-4 w-4" /></a>
                                            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${p.display_name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:bg-[#F3F3FF] hover:text-[#1111F6]"><MessageCircle className="h-4 w-4" /></a>
                                        </>}
                                        <button type="button" onClick={() => setEditing({ provider: p })} className={smallBtn}><Pencil className="h-3.5 w-3.5" />Edit</button>
                                        <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.display_name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-[#777] hover:bg-[#FFF0EF] hover:text-[#AA3333]"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </> : <div className="px-6 py-14 text-center">
                    <p className="text-[15px]">{list.length ? "No providers match." : "No providers yet."}</p>
                    <p className="mt-1 text-[14px] text-[#888]">{list.length ? "Try another filter or search." : "Add the mechanics and partners drivers can reach."}</p>
                </div>}
            </section>

            {dialog}
            {editing && <ProviderForm key={editing.provider?.id || "new"} provider={editing.provider} isNew={!editing.provider} services={services} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); void fetchAll(); }} />}
        </div>
    );
}
