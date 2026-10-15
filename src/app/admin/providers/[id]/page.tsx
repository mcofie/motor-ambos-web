"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MapPin, MessageCircle, Pencil, Phone, ShieldCheck } from "lucide-react";
import { listProviders, listRequestsByProvider, getProviderServiceIds, listProviderRates, listServices, updateProvider, listMembersWithMemberships, type MemberWithMembershipRow } from "@/lib/supaFetch";
import { ProviderRow, ServiceRow, ProviderRateRow, RequestRow, OperatingHours } from "@/components/admin/types";
import { cls, StatusBadge } from "@/components/admin/ui/AdminUI";
import { ProviderForm } from "@/components/admin/views/ProviderForm";
import { providerType } from "@/components/admin/views/providerTypes";
import { requestInfo } from "@/components/admin/requestInfo";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const day = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const card = "rounded-[20px] border border-[#EAEAEA] bg-white p-5 sm:p-6";

export default function ProviderDetailPage() {
    const id = useParams().id as string;
    const [provider, setProvider] = useState<ProviderRow | null>(null);
    const [requests, setRequests] = useState<RequestRow[]>([]);
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [serviceIds, setServiceIds] = useState<string[]>([]);
    const [rates, setRates] = useState<ProviderRateRow[]>([]);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [busy, setBusy] = useState(false);
    const [today] = useState(() => new Date().toLocaleDateString("en-GB", { weekday: "long" }).toLowerCase());

    const load = useCallback(async () => {
        try {
            const [all, reqs, ids, svc, providerRates, people] = await Promise.all([listProviders(), listRequestsByProvider(id), getProviderServiceIds(id), listServices(), listProviderRates(id), listMembersWithMemberships()]);
            setProvider((all as ProviderRow[]).find((p) => p.id === id) || null);
            setRequests(reqs as RequestRow[]);
            setServiceIds(ids as string[]);
            setServices(svc as ServiceRow[]);
            setRates(providerRates as ProviderRateRow[]);
            setMembers(people);
        } catch (e) {
            console.error(e);
            toast.error("Could not load this provider");
        } finally {
            setLoading(false);
        }
    }, [id]);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
    useEffect(() => { void load(); }, [load]);

    const stats = useMemo(() => {
        const done = requests.filter((r) => r.status === "completed").length;
        const cancelled = requests.filter((r) => r.status === "cancelled").length;
        return { total: requests.length, done, open: requests.length - done - cancelled, rate: done + cancelled ? Math.round((done / (done + cancelled)) * 100) : null };
    }, [requests]);

    async function toggle(key: "is_active" | "is_verified") {
        if (!provider) return;
        setBusy(true);
        try {
            await updateProvider(provider.id, { [key]: !provider[key] });
            setProvider({ ...provider, [key]: !provider[key] });
        } catch {
            toast.error("Could not update the provider");
        } finally {
            setBusy(false);
        }
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;

    if (!provider) {
        return <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
            <p className="text-[16px]">Provider not found</p>
            <Link href="/admin/providers" className="text-[14px] text-[#1111F6]">Back to providers</Link>
        </div>;
    }

    const type = providerType(provider.provider_type);
    const TypeIcon = type.icon;
    const hours = provider.operating_hours as OperatingHours | null;
    const offered = services.filter((s) => serviceIds.includes(s.id));
    const phone = (provider.phone_business || "").replace(/\D/g, "").replace(/^0/, "233");

    return (
        <div className="flex flex-col gap-5 pb-10">
            <Link href="/admin/providers" className="inline-flex w-fit items-center gap-1.5 text-[14px] text-[#555] hover:text-[#1111F6]"><ArrowLeft className="h-4 w-4" />All providers</Link>

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element -- provider-supplied image of any host */}
                {provider.backdrop_url && <img src={provider.backdrop_url} alt="" className="h-32 w-full object-cover md:h-44" />}
                <div className="flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element -- provider-supplied image of any host */}
                    {provider.logo_url ? <img src={provider.logo_url} alt="" className="h-16 w-16 shrink-0 rounded-[16px] border border-[#EAEAEA] object-cover" /> : <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[#F3F3FF] text-[#1111F6]"><TypeIcon className="h-7 w-7" /></span>}
                    <div className="min-w-0 flex-1">
                        <h2 className="flex items-center gap-2 text-[24px] tracking-[-0.03em]">{provider.display_name}{provider.is_verified && <ShieldCheck className="h-5 w-5 text-[#1111F6]" aria-label="Verified" />}</h2>
                        <p className="mt-0.5 text-[14px] text-[#777]">{type.label} · Joined {day(provider.created_at)}</p>
                        {provider.about && <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[#555]">{provider.about}</p>}
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-[#555]">
                            {provider.address_line && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#999]" />{provider.lat && provider.lng ? <a href={`https://www.google.com/maps?q=${provider.lat},${provider.lng}`} target="_blank" rel="noreferrer" className="hover:text-[#1111F6]">{provider.address_line}</a> : provider.address_line}</span>}
                            {provider.phone_business && <a href={`tel:${provider.phone_business}`} className="flex items-center gap-1.5 hover:text-[#1111F6]"><Phone className="h-4 w-4 text-[#999]" />{provider.phone_business}</a>}
                            {provider.phone_business && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#1111F6]"><MessageCircle className="h-4 w-4 text-[#999]" />WhatsApp</a>}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <button type="button" onClick={() => toggle("is_active")} disabled={busy} className={cls("inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px]", provider.is_active ? "bg-[#EAF7F0] text-[#197252]" : "bg-[#F2F2F2] text-[#666]")}><span className={cls("h-2 w-2 rounded-full", provider.is_active ? "bg-[#197252]" : "bg-[#AAA]")} />{provider.is_active ? "Taking jobs" : "Off"}</button>
                        {!provider.is_verified && <button type="button" onClick={() => toggle("is_verified")} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E3E3E3] px-4 text-[14px] hover:border-[#B8B8FF] hover:text-[#1111F6]"><ShieldCheck className="h-4 w-4" />Verify</button>}
                        <button type="button" onClick={() => setEditing(true)} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8]"><Pencil className="h-4 w-4" />Edit</button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {[["Jobs", stats.total], ["Completed", stats.done], ["Open now", stats.open], ["Completion rate", stats.rate === null ? "—" : `${stats.rate}%`]].map(([title, value]) => (
                    <div key={title} className="rounded-[16px] border border-[#EAEAEA] bg-white p-5"><p className="text-[28px] leading-none tracking-[-0.04em]">{value}</p><p className="mt-2 text-[13px] text-[#777]">{title}</p></div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <section className={card}>
                    <h3 className="text-[18px] tracking-[-0.02em]">Services and prices</h3>
                    {offered.length ? <ul className="mt-3 divide-y divide-[#F0F0F0]">
                        {offered.map((svc) => {
                            const rate = rates.find((r) => r.service_id === svc.id);
                            return <li key={svc.id} className="flex items-center justify-between py-2.5 text-[14px]"><span>{svc.name}</span><span className={rate?.base_price ? "" : "text-[#AAA]"}>{rate?.base_price ? `GHS ${rate.base_price}${rate.price_unit ? ` per ${rate.price_unit}` : ""}` : "No price"}</span></li>;
                        })}
                    </ul> : <p className="mt-2 text-[14px] text-[#888]">No services yet. Add them with Edit.</p>}
                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#F0F0F0] pt-4 text-[14px]">
                        <div><dt className="text-[13px] text-[#888]">Call-out fee</dt><dd>GHS {provider.callout_fee || 0}</dd></div>
                        <div><dt className="text-[13px] text-[#888]">Covers up to</dt><dd>{provider.coverage_radius_km || 0} km</dd></div>
                    </dl>
                </section>

                <section className={card}>
                    <h3 className="text-[18px] tracking-[-0.02em]">Opening hours</h3>
                    {hours ? <ul className="mt-3 divide-y divide-[#F0F0F0]">
                        {DAYS.map((d) => {
                            const s = hours[d];
                            if (!s) return null;
                            return <li key={d} className={cls("flex items-center justify-between py-2 text-[14px]", d === today && "text-[#1111F6]")}><span className="capitalize">{d}{d === today && <span className="ml-1.5 text-[12px]">today</span>}</span><span className={s.closed ? "text-[#AAA]" : ""}>{s.closed ? "Closed" : `${s.open} to ${s.close}`}</span></li>;
                        })}
                    </ul> : <p className="mt-2 text-[14px] text-[#888]">No hours set.</p>}
                </section>
            </div>

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <h3 className="border-b border-[#F0F0F0] px-5 py-4 text-[18px] tracking-[-0.02em] sm:px-6">Jobs <span className="text-[14px] text-[#888]">{requests.length}</span></h3>
                {requests.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {requests.map((r) => (
                        <li key={r.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                            <div className="min-w-0 flex-1">
                                {(() => { const member = r.created_by ? members.find((m) => m.auth_user_id === r.created_by) : undefined; const phone = r.driver_phone || member?.phone; return <p className="truncate text-[14px]">{r.driver_name || member?.full_name || "Unknown driver"}{phone && <span className="text-[#888]"> · {phone}</span>}</p>; })()}
                                <p className="truncate text-[13px] text-[#888]">{day(r.created_at)} · {requestInfo(r).issue || r.address_line || "No address"}{requestInfo(r).note && ` · ${requestInfo(r).note}`}</p>
                            </div>
                            <StatusBadge status={r.status || "pending"} />
                        </li>
                    ))}
                </ul> : <p className="px-6 py-10 text-center text-[14px] text-[#888]">No jobs yet. Assign one from Service requests.</p>}
            </section>

            {editing && <ProviderForm provider={provider} isNew={false} services={services} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); void load(); }} />}
        </div>
    );
}
