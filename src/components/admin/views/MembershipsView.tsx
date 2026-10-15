"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { listMembershipPlans, listMembersWithMemberships, upsertMemberMembership, listAllVehicles, listOrgLinks, MembershipPlanRow, MemberWithMembershipRow, VehicleRow } from "@/lib/supaFetch";
import { ChevronRight, Loader2, Pencil, Plus, Search } from "lucide-react";
import { formatPhone, phoneVariants } from "@/lib/phone";
import { cls } from "../ui/AdminUI";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Filter = "all" | "active" | "attention" | "none" | "fleet";
type FormState = { member_id: string | null; full_name: string; email: string; phone: string; plan_id: string; tier: string; expiry_date: string; parent_org_id: string };

const field = "h-11 w-full rounded-[12px] border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#171717] outline-none placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/15";
const label = "block text-[13px] text-[#555]";
const isAbort = (err: unknown) => err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));
const isoDay = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

/** Plan state from the expiry date and the active flag. */
function planState(m: MemberWithMembershipRow, now: number) {
    if (!m.plan_name && !m.membership_tier) return { label: "No plan", tone: "bg-[#F2F2F2] text-[#666]", attention: false, none: true };
    if (!m.membership_expiry_date) return { label: "No end date", tone: "bg-[#F2F2F2] text-[#666]", attention: true };
    const days = Math.ceil((new Date(m.membership_expiry_date).getTime() - now) / 86_400_000);
    if (days < 0) return { label: "Expired", tone: "bg-[#FFF0EF] text-[#AA3333]", attention: true };
    if (m.membership_is_active === false) return { label: "Paused", tone: "bg-[#F2F2F2] text-[#666]", attention: true };
    if (days <= 30) return { label: `Ends in ${days} ${days === 1 ? "day" : "days"}`, tone: "bg-[#FFF4DF] text-[#915C12]", attention: true };
    return { label: "Active", tone: "bg-[#EAF7F0] text-[#197252]", attention: false };
}

export interface MembershipsViewProps {
    initialPlans?: MembershipPlanRow[];
    initialMembers?: MemberWithMembershipRow[];
    initialAllVehicles?: VehicleRow[];
}

/** Individual drivers: their plan, their cars and which fleet they drive for. Businesses live in Organizations. */
export function MembershipsView({ initialPlans, initialMembers, initialAllVehicles }: MembershipsViewProps) {
    const [plans, setPlans] = useState<MembershipPlanRow[]>(initialPlans || []);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>(initialMembers || []);
    const [vehicles, setVehicles] = useState<VehicleRow[]>(initialAllVehicles || []);
    const [links, setLinks] = useState<{ org_member_id: string; member_id: string }[]>([]);
    const [loading, setLoading] = useState(!initialMembers);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [form, setForm] = useState<FormState | null>(null);
    const [saving, setSaving] = useState(false);
    const [now] = useState(() => Date.now());

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            const [p, m, v, l] = await Promise.all([listMembershipPlans(signal), listMembersWithMemberships(signal), listAllVehicles(signal), listOrgLinks(signal)]);
            setPlans(p);
            setMembers(m);
            setVehicles(v);
            setLinks(l);
        } catch (err) {
            if (isAbort(err)) return;
            console.error(err);
            toast.error("Could not load members");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (initialMembers) listOrgLinks(controller.signal).then(setLinks).catch(() => {});
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
        else fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData, initialMembers]);

    const organizations = members.filter((m) => m.is_business && m.business_name);
    const orgName = useMemo(() => new Map(organizations.map((o) => [o.member_id, o.business_name || o.full_name || "Organization"])), [organizations]);
    const orgFor = useCallback((memberId: string) => links.find((l) => l.member_id === memberId)?.org_member_id, [links]);
    const vehiclesFor = useCallback((m: MemberWithMembershipRow) => vehicles.filter((v) => v.user_id === m.member_id || (m.auth_user_id && v.user_id === m.auth_user_id)), [vehicles]);

    const people = members.filter((m) => !m.is_business);
    const counts = {
        all: people.length,
        active: people.filter((m) => planState(m, now).label === "Active").length,
        attention: people.filter((m) => planState(m, now).attention).length,
        none: people.filter((m) => planState(m, now).none).length,
        fleet: people.filter((m) => orgFor(m.member_id)).length,
    };
    const shown = people.filter((m) => {
        if (filter === "active" && planState(m, now).label !== "Active") return false;
        if (filter === "attention" && !planState(m, now).attention) return false;
        if (filter === "none" && !planState(m, now).none) return false;
        if (filter === "fleet" && !orgFor(m.member_id)) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const cars = vehiclesFor(m).map((v) => `${v.plate} ${v.make} ${v.model}`).join(" ");
        return `${m.full_name ?? ""} ${m.email ?? ""} ${m.phone ?? ""} ${phoneVariants(m.phone || "").join(" ")} ${m.plan_name ?? ""} ${cars}`.toLowerCase().includes(q);
    });

    function openNew() {
        setForm({ member_id: null, full_name: "", email: "", phone: "", plan_id: plans[0]?.id ?? "", tier: plans[0]?.code ?? "", expiry_date: isoDay(365), parent_org_id: "" });
    }

    function openEdit(m: MemberWithMembershipRow) {
        const plan = plans.find((p) => p.code === m.plan_code);
        setForm({ member_id: m.member_id, full_name: m.full_name ?? "", email: m.email ?? "", phone: m.phone ?? "", plan_id: plan?.id ?? "", tier: m.membership_tier ?? m.plan_code ?? "", expiry_date: m.membership_expiry_date?.slice(0, 10) ?? "", parent_org_id: orgFor(m.member_id) ?? "" });
    }

    async function save() {
        if (!form) return;
        if (!form.full_name.trim() || !form.phone.trim()) return toast.error("Enter the member’s name and phone");
        setSaving(true);
        try {
            await upsertMemberMembership({
                member_id: form.member_id,
                full_name: form.full_name.trim(),
                email: form.email.trim() || null,
                phone: form.phone.trim(),
                plan_id: form.plan_id,
                tier: form.tier.trim() || plans.find((p) => p.id === form.plan_id)?.code || "STANDARD",
                expiry_date: form.expiry_date || null,
                is_business: false,
                business_name: null,
                parent_org_id: form.parent_org_id || null,
            });
            toast.success(form.member_id ? "Member saved" : "Member added");
            setForm(null);
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save the member");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    const filters: { key: Filter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "active", label: "Active plan" },
        { key: "attention", label: "Needs renewal" },
        { key: "none", label: "No plan" },
        { key: "fleet", label: "Fleet drivers" },
    ];

    return (
        <div className="flex flex-col gap-5 pb-8">
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
                        <button type="button" onClick={openNew} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8]"><Plus className="h-4 w-4" />Add member</button>
                    </div>
                    <label className="relative block">
                        <span className="sr-only">Search members</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input className="h-10 w-full rounded-full border border-[#E3E3E3] bg-white pl-10 pr-4 text-[14px] outline-none placeholder:text-[#AAA] focus:border-[#1111F6]" placeholder="Search name, phone, email or plate" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </label>
                </div>

                {shown.length ? <ul className="divide-y divide-[#F0F0F0]">
                    {shown.map((m) => {
                        const state = planState(m, now);
                        const cars = vehiclesFor(m);
                        const org = orgFor(m.member_id);
                        return (
                            <li key={m.member_id} className="flex items-center gap-2 pr-3 sm:pr-4">
                                <Link href={`/admin/memberships/${m.member_id}`} className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-4 transition-colors hover:bg-[#FAFAFA] sm:px-5 md:flex-row md:items-center md:gap-4">
                                    <div className="min-w-0 md:w-[260px] md:shrink-0">
                                        <p className="truncate text-[15px]">{m.full_name || "Unnamed member"}</p>
                                        <p className="truncate text-[13px] text-[#888]">{m.phone || "No phone"}{m.email && ` · ${m.email}`}</p>
                                    </div>
                                    <div className="min-w-0 flex-1 text-[13px] text-[#555]">
                                        <p className="truncate">{cars.length ? cars.map((v) => v.plate || [v.make, v.model].filter(Boolean).join(" ")).join(", ") : m.car_brand ? `${m.car_brand} (not added in the app)` : <span className="text-[#AAA]">No vehicles</span>}</p>
                                        {org && <p className="truncate text-[#888]">Drives for {orgName.get(org) || "an organization"}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 md:w-[220px] md:justify-end">
                                        <span className="truncate text-[13px] text-[#777]">{m.plan_name || ""}</span>
                                        <span className={cls("shrink-0 rounded-full px-2.5 py-0.5 text-[12px]", state.tone)}>{state.label}</span>
                                    </div>
                                </Link>
                                <button type="button" onClick={() => openEdit(m)} aria-label={`Edit ${m.full_name || "member"}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#777] hover:bg-[#F3F3FF] hover:text-[#1111F6]"><Pencil className="h-4 w-4" /></button>
                                <ChevronRight className="hidden h-4 w-4 shrink-0 text-[#BBB] sm:block" />
                            </li>
                        );
                    })}
                </ul> : <div className="px-6 py-14 text-center">
                    <p className="text-[15px]">{people.length ? "No members match." : "No members yet."}</p>
                    <p className="mt-1 text-[14px] text-[#888]">{people.length ? "Try another filter or search." : "Drivers appear here when they sign up or you add them."}</p>
                </div>}
            </section>

            <p className="text-[13px] text-[#888]">Businesses and their fleets are in <Link href="/admin/organizations" className="text-[#1111F6]">Organizations</Link>.</p>

            <Dialog open={!!form} onOpenChange={(open) => !open && setForm(null)}>
                <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-h-[90dvh] max-w-lg overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{form?.member_id ? "Edit member" : "Add a member"}</DialogTitle>
                        <DialogDescription>{form?.member_id ? "Change their details, plan or fleet." : "They can sign in to the app with this phone number."}</DialogDescription>
                    </DialogHeader>
                    {form && <div className="flex flex-col gap-4">
                        <label className={label}>Full name<input className={cls(field, "mt-1.5")} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className={label}>Phone<input className={cls(field, "mt-1.5")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} onBlur={() => setForm((f) => f && { ...f, phone: formatPhone(f.phone) })} placeholder="+233 55 850 8306" /></label>
                            <label className={label}>Email <span className="text-[#AAA]">(optional)</span><input type="email" className={cls(field, "mt-1.5")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className={label}>Plan
                                <select className={cls(field, "mt-1.5")} value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value, tier: plans.find((p) => p.id === e.target.value)?.code || form.tier })}>
                                    <option value="">No plan</option>
                                    {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </label>
                            <label className={label}>Plan ends<input type="date" className={cls(field, "mt-1.5")} value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></label>
                        </div>
                        <label className={label}>Drives for <span className="text-[#AAA]">(optional)</span>
                            <select className={cls(field, "mt-1.5")} value={form.parent_org_id} onChange={(e) => setForm({ ...form, parent_org_id: e.target.value })}>
                                <option value="">No organization</option>
                                {organizations.map((org) => <option key={org.member_id} value={org.member_id}>{org.business_name}</option>)}
                            </select>
                            {!form.member_id && form.parent_org_id && <span className="mt-1.5 block text-[12px] text-[#888]">They’ll get a text saying they’ve been added to the fleet.</span>}
                        </label>
                    </div>}
                    <DialogFooter>
                        <button type="button" onClick={() => setForm(null)} className="inline-flex h-10 items-center rounded-full border border-[#E3E3E3] px-4 text-[14px]">Cancel</button>
                        <button type="button" onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8] disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{form?.member_id ? "Save" : "Add member"}</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
