"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    getMemberById,
    listMemberVehicles,
    MemberWithMembershipRow,
    VehicleRow,
    listServiceHistory,
    ServiceHistoryRow,
    listOrgDrivers,
    addOrgDriver
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
    ShieldCheck,
    Users,
    Plus,
    X,
    Upload,
    Zap,
    Smartphone,
    Check
} from "lucide-react";
import { cls, StatCard } from "../ui/AdminUI";
import { toast } from "sonner";
import { DigitalGlovebox } from "./DigitalGlovebox";

export interface MemberDetailViewProps {
    memberId: string;
    initialMember?: MemberWithMembershipRow | null;
    initialVehicles?: VehicleRow[];
}

export function MemberDetailView({ memberId, initialMember, initialVehicles }: MemberDetailViewProps) {
    const router = useRouter();
    const [member, setMember] = useState<MemberWithMembershipRow | null>(initialMember || null);
    const [vehicles, setVehicles] = useState<VehicleRow[]>(initialVehicles || []);
    const [loading, setLoading] = useState(!initialMember);
    const [isGloveboxOpen, setIsGloveboxOpen] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: "", phone: "", vehicle_id: "" });
    const [addingDriver, setAddingDriver] = useState(false);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        if (initialMember) return; // Skip if we have initial data

        setLoading(true);
        try {
            const m = await getMemberById(memberId, signal);
            if (!m) {
                toast.error("Member not found");
                router.push("/admin/memberships");
                return;
            }
            setMember(m);

            const mId = m.member_id || memberId;
            const aId = m.auth_user_id;

            if (mId) {
                const head = await listMemberVehicles(mId, aId, signal);
                setVehicles(head);

                if (m.is_business) {
                    listOrgDrivers(m.id || mId, signal).then(setDrivers).catch(e => {
                        if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
                        console.error(e);
                    });
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            console.error(err);
            toast.error("Failed to load member details");
        } finally {
            setLoading(false);
        }
    }, [memberId, router, initialMember]);

    const handleAddDriver = async () => {
        if (!member?.id || !newDriver.name || !newDriver.phone) {
            toast.error("Please fill in name and phone");
            return;
        }
        setAddingDriver(true);
        try {
            await addOrgDriver(member.id, newDriver.name, newDriver.phone, newDriver.vehicle_id || undefined);
            toast.success("Driver added and notified");
            setIsAddDriverOpen(false);
            setNewDriver({ name: "", phone: "", vehicle_id: "" });
            // Refresh list
            const d = await listOrgDrivers(member.id);
            setDrivers(d);
        } catch (e) {
            console.error(e);
            toast.error("Failed to add driver");
        } finally {
            setAddingDriver(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
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
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        {member.is_business ? member.business_name : (member.full_name || "Unnamed Member")}
                        {member.is_business && (
                            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                B2B Account
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {member.is_business ? "Fleet Organization & Management" : "Detailed profile and vehicle history"}
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
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {member.is_business ? "Business Name" : "Full Name"}
                                    </label>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {member.is_business ? member.business_name : (member.full_name || "—")}
                                    </p>
                                    {member.is_business && (
                                        <div className="pt-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Person</label>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{member.full_name}</p>
                                        </div>
                                    )}
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
                        {member.is_business && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toast.info("Bulk Import Coming Soon")}
                                    className="text-xs font-bold text-slate-500 hover:text-foreground transition-colors uppercase tracking-wider flex items-center gap-1"
                                >
                                    <Upload className="h-3 w-3" /> Bulk Import
                                </button>
                                <button
                                    onClick={() => setIsGloveboxOpen(true)}
                                    className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                                >
                                    Open Digital Glovebox
                                </button>
                            </div>
                        )}
                        {!member.is_business && (
                            <button
                                onClick={() => setIsGloveboxOpen(true)}
                                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                            >
                                Open Digital Glovebox
                            </button>
                        )}
                    </section>

                    {/* Fleet Health Overview for Business */}
                    {member.is_business && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{vehicles.length}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Vehicles</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-bold text-emerald-500">
                                    {vehicles.filter(v => v.insurance_url).length}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Insured</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-bold text-emerald-500">
                                    {vehicles.filter(v => v.roadworthy_url).length}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Roadworthy</div>
                            </div>
                        </div>
                    )}

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

                    {/* Fleet Drivers Section (B2B Only) */}
                    {member.is_business && (
                        <div className="pt-6 border-t border-border">
                            <section className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Authorized Drivers ({drivers.length})
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsAddDriverOpen(true)}
                                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add Driver
                                    </button>
                                </div>
                            </section>

                            <div className="bg-card rounded-xl border border-border overflow-hidden">
                                {drivers.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {drivers.map((d) => (
                                            <div key={d.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-sm text-foreground">{d.member?.full_name}</div>
                                                        {d.member?.auth_user_id ? (
                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold border border-emerald-500/20 uppercase tracking-tighter">
                                                                <Check className="h-2 w-2" /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[9px] font-bold border border-amber-500/20 uppercase tracking-tighter">
                                                                <Smartphone className="h-2 w-2" /> Invited
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {d.vehicle ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-border text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                            <Car className="h-3 w-3" />
                                                            {d.vehicle.year} {d.vehicle.model}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground italic">No Vehicle Assigned</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm italic">
                                        No drivers added yet. Add drivers to give them app access.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add Driver Modal */}
                    {isAddDriverOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                                    <h3 className="font-bold text-lg">Add Authorized Driver</h3>
                                    <button onClick={() => setIsAddDriverOpen(false)} className="p-1 hover:bg-white/10 rounded"><X className="h-5 w-5" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Enter driver details. They will receive an SMS invite to download the app and join this fleet.
                                    </p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Driver Name</label>
                                        <input
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            placeholder="John Doe"
                                            value={newDriver.name}
                                            onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Phone Number</label>
                                        <input
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            placeholder="055XXXXXXX"
                                            value={newDriver.phone}
                                            onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Assign Vehicle (Optional)</label>
                                        <select
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            value={newDriver.vehicle_id}
                                            onChange={e => setNewDriver({ ...newDriver, vehicle_id: e.target.value })}
                                        >
                                            <option value="">-- No Vehicle --</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} ({v.plate})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-border bg-muted/30 flex gap-3 justify-end">
                                    <button onClick={() => setIsAddDriverOpen(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:bg-white/5">Cancel</button>
                                    <button
                                        onClick={handleAddDriver}
                                        disabled={addingDriver}
                                        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                                    >
                                        {addingDriver ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add & Invite"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
