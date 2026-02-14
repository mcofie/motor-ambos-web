"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    getMemberById,
    listMemberVehicles,
    MemberWithMembershipRow,
    VehicleRow,
    listServiceHistory,
    ServiceHistoryRow
} from "@/lib/supaFetch";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Shield,
    Car,
    Calendar,
    Wrench,
    Clock,
    FileText,
    CheckCircle2,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { cls, StatCard } from "../ui/AdminUI";
import { toast } from "sonner";
import { DigitalGlovebox } from "./DigitalGlovebox";

interface MemberDetailViewProps {
    memberId: string;
}

export function MemberDetailView({ memberId }: MemberDetailViewProps) {
    const router = useRouter();
    const [member, setMember] = useState<MemberWithMembershipRow | null>(null);
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGloveboxOpen, setIsGloveboxOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const m = await getMemberById(memberId);
            if (!m) {
                toast.error("Member not found");
                router.push("/admin/memberships");
                return;
            }
            setMember(m);

            if (m.auth_user_id) {
                const head = await listMemberVehicles(m.auth_user_id);
                setVehicles(head);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load member details");
        } finally {
            setLoading(false);
        }
    }, [memberId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!member) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/admin/memberships")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors group"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {member.full_name || "Unnamed Member"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        Detailed profile and vehicle history
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-4">
                            <div className="flex justify-end">
                                <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider px-2 py-1 rounded-full border border-white/20">
                                    {member.membership_tier || "Standard"}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 pb-6 -mt-8">
                            <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-primary font-bold text-2xl mb-4">
                                {member.full_name?.charAt(0) || <User className="h-8 w-8" />}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <p className="font-semibold text-slate-900 dark:text-white">{member.full_name || "—"}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <Phone className="h-4 w-4 opacity-70" />
                                            {member.phone}
                                        </div>
                                        {member.email && (
                                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                                <Mail className="h-4 w-4 opacity-70" />
                                                {member.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</label>
                                    <div className="flex items-center gap-2">
                                        {member.auth_user_id ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Digital Account Linked
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                                                <Clock className="h-3 w-3" />
                                                Pending App Setup
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Vehicles & Fleet */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Car className="h-4 w-4" />
                            Registered Fleet ({vehicles.length})
                        </h3>
                        <button
                            onClick={() => setIsGloveboxOpen(true)}
                            className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                        >
                            Open Digital Glovebox
                        </button>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vehicles.length > 0 ? (
                            vehicles.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => router.push(`/admin/vehicles/${v.id}`)}
                                    className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 cursor-pointer transition-all group relative overflow-hidden"
                                >
                                    {/* Background Icon Decor */}
                                    <Car className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-100 dark:text-white/5 rotate-12 pointer-events-none" />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <Car className="h-5 w-5" />
                                            </div>
                                            {v.is_primary && (
                                                <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">
                                                    Primary
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                                            {v.year} {v.make} {v.model}
                                        </h4>
                                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
                                            {v.plate || "No Plate Recorded"}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Insurance</label>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cls("h-1.5 w-1.5 rounded-full", v.insurance_url ? "bg-emerald-500" : "bg-slate-300")} />
                                                    <span className="text-[10px] font-medium">{v.insurance_url ? "Valid" : "Not Set"}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Roadworthy</label>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cls("h-1.5 w-1.5 rounded-full", v.roadworthy_url ? "bg-emerald-500" : "bg-slate-300")} />
                                                    <span className="text-[10px] font-medium">{v.roadworthy_url ? "Valid" : "Not Set"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                <Car className="h-10 w-10 text-slate-300 mb-3" />
                                <p className="text-sm text-slate-500 font-medium">No vehicles registered yet</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Header */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-sm">Security & Plans</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Active Membership</span>
                                    <span className="font-semibold text-emerald-500">{member.membership_is_active ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Tier</span>
                                    <span className="font-semibold uppercase">{member.membership_tier || "—"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Expiry</span>
                                    <span className="font-semibold">{member.membership_expiry_date ? new Date(member.membership_expiry_date).toLocaleDateString() : "—"}</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-sm">Quick Actions</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase transition-colors text-center border border-border">
                                    Renewal
                                </button>
                                <button className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase transition-colors text-center border border-border">
                                    Billing
                                </button>
                                <button className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase transition-colors text-center border border-border">
                                    Logs
                                </button>
                                <button className="p-2 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase transition-colors text-center border border-border">
                                    Settings
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Reuse DigitalGlovebox if needed or direct to detail */}
            {isGloveboxOpen && member.membership_id && (
                <DigitalGlovebox
                    membershipId={member.membership_id}
                    memberName={member.full_name || "Member"}
                    vehicles={vehicles}
                    onClose={() => setIsGloveboxOpen(false)}
                />
            )}
        </div>
    );
}
