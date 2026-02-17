"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    listMembershipPlans,
    listMembersWithMemberships,
    upsertMemberMembership,
    listAllVehicles,
    MembershipPlanRow,
    MemberWithMembershipRow,
} from "@/lib/supaFetch";
import {
    Users,
    ShieldCheck,
    LayoutGrid,
    Search,
    Plus,
    Loader2,
    Edit2,
    X,
    User as UserIcon,
    Save,
    Car,
    ArrowRight,
    FileText,
    History,
    CheckCircle2,
    Smartphone,
} from "lucide-react";
import { listMemberVehicles, VehicleRow } from "@/lib/supaFetch";
import { DigitalGlovebox } from "./DigitalGlovebox";

import {
    UUID,
} from "../types";
import {
    cls,
    StatCard,
    TextField,
} from "../ui/AdminUI";

type MembershipFormState = {
    member_id: UUID | null;
    full_name: string;
    email: string;
    phone: string;
    plan_id: string;
    tier: string;
    expiry_date: string; // yyyy-mm-dd
    is_business: boolean;
    business_name: string;
    parent_org_id: string;
};

export interface MembershipsViewProps {
    initialPlans?: MembershipPlanRow[];
    initialMembers?: MemberWithMembershipRow[];
    initialAllVehicles?: VehicleRow[];
}

export function MembershipsView({ initialPlans, initialMembers, initialAllVehicles }: MembershipsViewProps) {
    const [plans, setPlans] = useState<MembershipPlanRow[]>(initialPlans || []);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>(initialMembers || []);
    const [loading, setLoading] = useState(!initialMembers);
    const [q, setQ] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [form, setForm] = useState<MembershipFormState>({
        member_id: null,
        full_name: "",
        email: "",
        phone: "",
        plan_id: "",
        tier: "",
        expiry_date: "",
        is_business: false,
        business_name: "",
        parent_org_id: "",
    });
    const [filterType, setFilterType] = useState<"ALL" | "INDIVIDUAL" | "BUSINESS">("ALL");
    const [selectedMembership, setSelectedMembership] = useState<{ id: string, name: string, auth_user_id?: string | null } | null>(null);
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [allVehicles, setAllVehicles] = useState<VehicleRow[]>(initialAllVehicles || []);
    const [isGloveboxOpen, setIsGloveboxOpen] = useState(false);

    const organizations = members.filter(m => m.is_business && m.business_name);


    const filteredMembers = members.filter((m) => {
        // First filter by type
        if (filterType === "INDIVIDUAL" && m.is_business) return false;
        if (filterType === "BUSINESS" && !m.is_business) return false;

        if (!q.trim()) return true;
        const hay = `${m.full_name ?? ""} ${m.phone ?? ""} ${m.plan_name ?? ""} ${m.business_name ?? ""}`.toLowerCase();
        return hay.includes(q.toLowerCase());
    });

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const [plansRes, membersRes, vehiclesRes] = await Promise.all([
                listMembershipPlans(signal),
                listMembersWithMemberships(signal),
                listAllVehicles(signal),
            ]);
            setPlans(plansRes);
            setMembers(membersRes);
            setAllVehicles(vehiclesRes);
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            console.error(err);
            toast.error("Failed to load memberships");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!initialMembers) {
            const controller = new AbortController();
            fetchData(controller.signal);
            return () => controller.abort();
        }
    }, [fetchData, initialMembers]);

    const newMembership = () => {
        const today = new Date();
        const nextYear = new Date(today);
        nextYear.setFullYear(today.getFullYear() + 1);
        const defaultExpiry = nextYear.toISOString().slice(0, 10);

        setForm({
            member_id: null,
            full_name: "",
            email: "",
            phone: "",
            plan_id: plans[0]?.id ?? "",
            tier: plans[0]?.code ?? "",
            expiry_date: defaultExpiry,
            is_business: false,
            business_name: "",
            parent_org_id: "",
        });
        setIsSidebarOpen(true);
    };

    const editMembership = (m: MemberWithMembershipRow) => {
        setForm({
            member_id: m.member_id,
            full_name: m.full_name ?? "",
            email: m.email ?? "",
            phone: m.phone ?? "",
            plan_id:
                plans.find((p) => p.code === m.plan_code)?.id ??
                plans[0]?.id ??
                "",
            tier: m.membership_tier ?? m.plan_code ?? "",
            expiry_date: m.membership_expiry_date ? m.membership_expiry_date.slice(0, 10) : "",
            is_business: m.is_business || false,
            business_name: m.business_name || "",
            parent_org_id: "", // TODO: If we want to show existing link, we'd need to fetch it or have it in row
        });
        setIsSidebarOpen(true);
    };

    const openGlovebox = async (m: MemberWithMembershipRow) => {
        // No longer blocking offline members, we will try member_id fallback in fetch
        setSelectedMembership({
            id: m.membership_id || m.member_id,
            name: m.full_name || "Member",
            auth_user_id: m.auth_user_id
        });
        setIsGloveboxOpen(true);
        setIsGloveboxOpen(true);

        // Filter from already loaded vehicles instead of fetching (which fails RLS)
        const vels = allVehicles.filter(v =>
            v.user_id === m.member_id ||
            (m.auth_user_id && v.user_id === m.auth_user_id)
        );
        setVehicles(vels);
    };


    const handleSave = async () => {
        const payload = {
            member_id: form.member_id,
            full_name: form.full_name.trim(),
            email: form.email.trim() || null,
            phone: form.phone.trim(),
            plan_id: form.plan_id,
            tier: form.tier.trim() || "STANDARD",
            expiry_date: form.expiry_date || null,
            is_business: form.is_business,
            business_name: form.is_business ? form.business_name.trim() : null,
            parent_org_id: !form.is_business ? form.parent_org_id : null,
        };

        const promise = async () => {
            await upsertMemberMembership(payload);
            setIsSidebarOpen(false);
            await fetchData();
        };

        toast.promise(promise, {
            loading: "Saving membership...",
            success: "Membership saved",
            error: "Failed to save membership",
        });
    };

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.membership_is_active).length;
    const activePlans = plans.filter((p) => p.is_active).length;

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Members" value={totalMembers} icon={Users} color="bg-indigo-500" />
                <StatCard title="Active Memberships" value={activeMembers} icon={ShieldCheck} color="bg-emerald-500" />
                <StatCard title="Active Plans" value={activePlans} icon={LayoutGrid} color="bg-slate-500" />
            </div>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-card">
                    <div className="flex bg-muted/30 p-1 rounded-lg">
                        {(["ALL", "INDIVIDUAL", "BUSINESS"] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={cls(
                                    "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    filterType === type
                                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {type === "ALL" ? "All" : type === "INDIVIDUAL" ? "B2C" : "B2B"}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 w-full md:w-auto relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                            placeholder="Search members..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={newMembership}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Member</span>
                    </button>
                </div>

                <div className="flex-1 overflow-auto relative bg-muted/20">
                    {loading && (
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead
                            className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Member</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Fleet</th>
                                <th className="px-6 py-3 text-right">Actions</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {filteredMembers.map((m) => {
                                const expired = m.membership_expiry_date ? new Date(m.membership_expiry_date) < new Date() : false;
                                return (
                                    <tr key={m.member_id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/memberships/${m.member_id}`}
                                                className="group/name block"
                                            >
                                                <div className="font-medium text-foreground group-hover/name:text-primary transition-colors flex items-center gap-1.5">
                                                    {m.is_business ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{m.business_name}</span>
                                                            <span className="text-[10px] text-muted-foreground font-normal flex items-center gap-1">
                                                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> B2B • {m.full_name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        m.full_name || "Unnamed Member"
                                                    )}
                                                    <ArrowRight className="h-3 w-3 opacity-0 group-hover/name:opacity-100 transition-all -translate-x-1 group-hover/name:translate-x-0" />
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    #{m.membership_number || "—"}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            <div>{m.phone}</div>
                                            <div className="text-muted-foreground/70">{m.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            <div className="font-medium">
                                                {m.plan_name || "No plan"}
                                            </div>
                                            <div className="text-muted-foreground/70 uppercase text-[10px]">
                                                {m.membership_tier || m.plan_code || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            {m.membership_expiry_date ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <span
                                                        className={cls(
                                                            "inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide",
                                                            expired
                                                                ? "bg-red-50 text-red-700 border-red-200"
                                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        )}
                                                    >
                                                        {expired ? "Expired" : "Active"}
                                                    </span>
                                                    <span className="text-muted-foreground/70">
                                                        Expires {new Date(m.membership_expiry_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground/50 italic">No expiry set</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const memberVehicles = (allVehicles || []).filter(v => {
                                                    const vUid = v.user_id?.toString().toLowerCase();
                                                    const mAuthId = m.auth_user_id?.toString().toLowerCase();
                                                    const mMemId = (m.member_id || m.id)?.toString().toLowerCase();
                                                    return (mAuthId && vUid === mAuthId) || (vUid === mMemId);
                                                });
                                                const hasVehicles = memberVehicles.length > 0;
                                                return (
                                                    <div className="flex flex-col gap-2">
                                                        {memberVehicles.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {memberVehicles.map(v => (
                                                                    <div key={v.id} className="flex flex-col bg-slate-100 dark:bg-white/5 rounded px-2 py-1 border border-slate-200 dark:border-white/5">
                                                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                                            {v.year} {v.make} {v.model}
                                                                        </span>
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <span className="text-[9px] font-mono text-slate-500 uppercase">{v.plate}</span>
                                                                            {v.nfc_serial_number && (
                                                                                <div className="flex items-center gap-0.5" title={`Linked to ${v.nfc_serial_number}`}>
                                                                                    <Smartphone className="h-2 w-2 text-indigo-500" />
                                                                                    <span className="text-[7px] font-bold text-indigo-500/70">NFC</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : m.car_brand ? (
                                                            <div className="flex flex-col bg-slate-100 dark:bg-white/5 rounded px-2 py-1 border border-slate-200 dark:border-white/5">
                                                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                                    {m.car_brand}
                                                                </span>
                                                                <span className="text-[9px] text-muted-foreground/50 italic">Legacy Record</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground/50 italic font-medium">No vehicles</span>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openGlovebox(m);
                                                            }}
                                                            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider"
                                                        >
                                                            <Car className="h-3 w-3" />
                                                            Manage Glovebox
                                                        </button>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-right">

                                            <button
                                                onClick={() => editMembership(m)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredMembers.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Users className="h-10 w-10 mb-2 opacity-20" />
                            <p>No members found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Slide-over form */}
            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
                        <div className="p-5 border-b border-border flex items-center justify-between bg-card">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">
                                    {form.member_id ? "Edit Membership" : "New Membership"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Link a member to a plan and set expiry.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <UserIcon className="w-3 h-3" /> Member Info
                                </h4>

                                <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="is_business"
                                        checked={form.is_business}
                                        onChange={(e) => setForm({ ...form, is_business: e.target.checked })}
                                        className="h-4 w-4 accent-primary rounded"
                                    />
                                    <label htmlFor="is_business" className="text-sm font-medium cursor-pointer select-none">
                                        This is a Business Account (B2B)
                                    </label>
                                </div>

                                {form.is_business && (
                                    <TextField
                                        label="Business Name"
                                        value={form.business_name}
                                        onChange={(v) => setForm({ ...form, business_name: v })}
                                        required
                                        placeholder="Company Name Ltd."
                                    />
                                )}

                                {!form.is_business && (
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Assign to Organization (Optional)
                                        </label>
                                        <select
                                            className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                                            value={form.parent_org_id}
                                            onChange={(e) => setForm({ ...form, parent_org_id: e.target.value })}
                                        >
                                            <option value="">-- Individual Account --</option>
                                            {organizations.map((org) => (
                                                <option key={org.member_id} value={org.member_id}>
                                                    {org.business_name} ({org.membership_tier})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            Select an organization to add this user to their fleet.
                                        </p>
                                    </div>
                                )}

                                <TextField
                                    label={form.is_business ? "Contact Person Name" : "Full Name"}
                                    value={form.full_name}
                                    onChange={(v) => setForm({ ...form, full_name: v })}
                                    required
                                />
                                <TextField
                                    label="Phone"
                                    value={form.phone}
                                    onChange={(v) => setForm({ ...form, phone: v })}
                                    required
                                />
                                <TextField
                                    label="Email"
                                    value={form.email}
                                    onChange={(v) => setForm({ ...form, email: v })}
                                    type="email"
                                    placeholder="optional"
                                />
                            </section>

                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <ShieldCheck className="w-3 h-3" /> Plan
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label
                                            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            Plan
                                        </label>
                                        <select
                                            className="mt-1 w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                                            value={form.plan_id}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    plan_id: e.target.value,
                                                    // if tier empty, default to plan code
                                                    tier:
                                                        prev.tier ||
                                                        plans.find((p) => p.id === e.target.value)?.code ||
                                                        prev.tier,
                                                }))
                                            }
                                        >
                                            <option value="">Select a plan</option>
                                            {plans.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <TextField
                                        label="Tier Label"
                                        value={form.tier}
                                        onChange={(v) => setForm({ ...form, tier: v })}
                                        placeholder="e.g. PLUS, GOLD"
                                    />
                                    <TextField
                                        label="Expiry Date"
                                        value={form.expiry_date}
                                        onChange={(v) => setForm({ ...form, expiry_date: v })}
                                        type="date"
                                        required
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="p-5 border-t border-border bg-muted/20 flex gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground bg-background border border-input hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.full_name.trim() || !form.phone.trim() || (form.is_business && !form.business_name.trim()) || !form.expiry_date}
                                className="flex-1 flex justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Digital Glovebox Overlay */}
            {isGloveboxOpen && selectedMembership && (
                <DigitalGlovebox
                    membershipId={selectedMembership.id}
                    memberName={selectedMembership.name}
                    vehicles={vehicles}
                    onClose={() => setIsGloveboxOpen(false)}
                    onRefresh={fetchData}
                />
            )}
        </div>

    );
}
