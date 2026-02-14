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
};

export function MembershipsView() {
    const [plans, setPlans] = useState<MembershipPlanRow[]>([]);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [loading, setLoading] = useState(false);
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
    });
    const [selectedMembership, setSelectedMembership] = useState<{ id: string, name: string, auth_user_id?: string | null } | null>(null);
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [allVehicles, setAllVehicles] = useState<VehicleRow[]>([]);
    const [isGloveboxOpen, setIsGloveboxOpen] = useState(false);


    const filteredMembers = members.filter((m) => {
        if (!q.trim()) return true;
        const hay = `${m.full_name ?? ""} ${m.phone ?? ""} ${m.plan_name ?? ""} ${m.plan_code ?? ""}`.toLowerCase();
        return hay.includes(q.toLowerCase());
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [plansRes, membersRes, vehiclesRes] = await Promise.all([
                listMembershipPlans(),
                listMembersWithMemberships(),
                listAllVehicles(),
            ]);
            setPlans(plansRes);
            setMembers(membersRes);
            setAllVehicles(vehiclesRes);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load memberships");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        });
        setIsSidebarOpen(true);
    };

    const openGlovebox = async (m: MemberWithMembershipRow) => {
        if (!m.auth_user_id) {
            toast.error("This member has no digital account linked (auth_user_id is missing)");
            return;
        }
        setSelectedMembership({
            id: m.membership_id || m.member_id, // Use member_id as fallback id
            name: m.full_name || "Member",
            auth_user_id: m.auth_user_id
        });
        setIsGloveboxOpen(true);
        try {
            const vels = await listMemberVehicles(m.auth_user_id);
            setVehicles(vels);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load vehicles");
        }
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
                <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-card">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                            placeholder="Search members by name, phone, or plan..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={newMembership}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Membership</span>
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
                                                    {m.full_name || "Unnamed Member"}
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
                                            {m.auth_user_id ? (() => {
                                                const memberVehicles = allVehicles.filter(v => v.user_id === m.auth_user_id);
                                                return (
                                                    <div className="flex flex-col gap-2">
                                                        {memberVehicles.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {memberVehicles.map(v => (
                                                                    <div key={v.id} className="flex flex-col bg-slate-100 dark:bg-white/5 rounded px-2 py-1 border border-slate-200 dark:border-white/5">
                                                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                                            {v.year} {v.make} {v.model}
                                                                        </span>
                                                                        <span className="text-[9px] font-mono text-slate-500 uppercase">{v.plate}</span>
                                                                    </div>
                                                                ))}
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
                                            })() : (
                                                <span className="text-xs text-muted-foreground/30 italic">No auth link</span>
                                            )}
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
                                <TextField
                                    label="Full Name"
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
                                className="flex-1 flex justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95"
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
                />
            )}
        </div>

    );
}
