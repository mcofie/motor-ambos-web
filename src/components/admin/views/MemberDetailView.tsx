"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    getMemberById,
    listAllVehicles,
    MemberWithMembershipRow,
    VehicleRow,
    listOrgDrivers,
    addOrgDriver,
} from "@/lib/supaFetch";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Car,
    Clock,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Users,
    Plus,
    X,
    Smartphone,
    Check,
} from "lucide-react";
import { cls, paperStatus } from "../ui/AdminUI";
import { toast } from "sonner";
import { formatPhone } from "@/lib/phone";

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
    const [drivers, setDrivers] = useState<Awaited<ReturnType<typeof listOrgDrivers>>>([]);
    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: "", phone: "", email: "", vehicle_id: "" });
    const [addingDriver, setAddingDriver] = useState(false);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        if (initialMember) return; // Skip if we have initial data

        setLoading(true);
        try {
            const m = await getMemberById(memberId, signal);
            // A cancelled load (the page closing, or React re-running the effect) isn't "not found".
            if (signal?.aborted) return;
            if (!m) {
                toast.error("Member not found");
                router.push("/admin/memberships");
                return;
            }
            setMember(m);

            const mId = m.member_id || memberId;
            const aId = m.auth_user_id;

            if (mId) {
                // Read through the staff server route rather than the browser's own database access.
                const all = await listAllVehicles(signal);
                setVehicles(all.filter((v) => v.user_id === mId || (aId && v.user_id === aId)));

                if (m.is_business) {
                    listOrgDrivers(m.id || mId, signal).then(setDrivers).catch(e => {
                        if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
                        console.error(e);
                    });
                }
            }
        } catch (err) {
            if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'))) return;
            console.error(err);
            toast.error("Failed to load member details");
        } finally {
            setLoading(false);
        }
    }, [memberId, router, initialMember]);

    const handleAddDriver = async () => {
        if (!member?.id || !newDriver.name || !newDriver.phone || !newDriver.email) {
            toast.error("Please fill in name, phone, and email");
            return;
        }
        setAddingDriver(true);
        try {
            await addOrgDriver(member.id, newDriver.name, newDriver.phone, newDriver.email, newDriver.vehicle_id || undefined);
            toast.success("Driver added and notified");
            setIsAddDriverOpen(false);
            setNewDriver({ name: "", phone: "", email: "", vehicle_id: "" });
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
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
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
                    className="p-2 hover:bg-[#F2F2F2] rounded-full transition-colors group"
                >
                    <ArrowLeft className="h-5 w-5 text-[#777777] group-hover:text-primary transition-colors" />
                </button>
                <div>
                    <h2 className="text-2xl font-medium text-[#171717] flex items-center gap-2">
                        {member.is_business ? member.business_name : (member.full_name || "Unnamed Member")}
                        {member.is_business && (
                            <span className="bg-[#1111F6]/10 text-[#0606D8] text-[12px] uppercase font-medium px-2 py-0.5 rounded-full border border-[#1111F6]/20">
                                B2B Account
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-[#777777]">
                        {member.is_business ? "Fleet account" : "Driver profile and vehicles"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="h-24 bg-gradient-to-br from-[#1111F6] to-[#0606D8] px-6 py-4">
                            <div className="flex justify-end">
                                <span className="bg-white/20 backdrop-blur-md text-[12px] font-medium text-white px-2 py-1 rounded-full border border-white/20">
                                    {member.plan_name || member.membership_tier || "No plan"}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 pb-6 -mt-8">
                            <div className="h-16 w-16 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-primary font-medium text-2xl mb-4">
                                {member.full_name?.charAt(0) || <User className="h-8 w-8" />}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#A3A3A3]">
                                        {member.is_business ? "Business Name" : "Full Name"}
                                    </label>
                                    <p className="font-medium text-[#171717]">
                                        {member.is_business ? member.business_name : (member.full_name || "—")}
                                    </p>
                                    {member.is_business && (
                                        <div className="pt-2">
                                            <label className="text-[12px] font-medium text-[#A3A3A3]">Contact Person</label>
                                            <p className="text-sm text-[#3F3F3F]">{member.contact_name || member.full_name || "—"}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#A3A3A3]">Contact Information</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-[#555555]">
                                            <Phone className="h-4 w-4 opacity-70" />
                                            {formatPhone(member.is_business ? member.contact_phone || member.phone : member.phone) || "—"}
                                        </div>
                                        {(member.is_business ? member.contact_email || member.email : member.email) && (
                                            <div className="flex items-center gap-3 text-sm text-[#555555]">
                                                <Mail className="h-4 w-4 opacity-70" />
                                                {member.is_business ? member.contact_email || member.email : member.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[12px] font-medium text-[#A3A3A3]">Account Status</label>
                                    <div className="flex items-center gap-2">
                                        {member.auth_user_id ? (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1111F6]/10 text-[#0606D8] text-[12px] font-medium border border-[#1111F6]/20">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Digital Account Linked
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F2F2F2] text-[#777777] text-[12px] font-medium border border-[#E7E7E7]">
                                                <Clock className="h-3 w-3" />
                                                Not signed in to the app yet
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
                        <h3 className="flex items-center gap-2 text-[18px] tracking-[-0.02em]">
                            <Car className="h-5 w-5 text-[#1111F6]" />
                            Vehicles <span className="text-[14px] text-[#888]">{vehicles.length}</span>
                        </h3>
                    </section>

                    {/* Fleet Health Overview for Business */}
                    {member.is_business && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-[#F7F7F7] rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-medium text-[#171717]">{vehicles.length}</div>
                                <div className="text-[12px] text-[#777]">Vehicles</div>
                            </div>
                            <div className="bg-[#F7F7F7] rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-medium text-[#1111F6]">
                                    {vehicles.filter(v => paperStatus(v.insurance_end_date).label === "Valid").length}
                                </div>
                                <div className="text-[12px] text-[#777]">Insurance valid</div>
                            </div>
                            <div className="bg-[#F7F7F7] rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                                <div className="text-2xl font-medium text-[#1111F6]">
                                    {vehicles.filter(v => paperStatus(v.roadworthy_expiry).label === "Valid").length}
                                </div>
                                <div className="text-[12px] text-[#777]">Roadworthy valid</div>
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

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#F2F2F2] flex items-center justify-center text-[#777777] group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <Car className="h-5 w-5" />
                                            </div>
                                            {v.is_primary && (
                                                <span className="bg-[#1111F6] text-white text-[11px] font-medium px-1.5 py-0.5 rounded shadow-sm">
                                                    Primary
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-medium text-[#171717] text-lg">
                                            {v.year} {v.make} {v.model}
                                        </h4>
                                        <p className="text-xs font-mono text-[#777777] uppercase mt-1">
                                            {v.plate || "No Plate Recorded"}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {([["Insurance", v.insurance_end_date], ["Roadworthy", v.roadworthy_expiry]] as const).map(([label, date]) => {
                                                const state = paperStatus(date);
                                                return <span key={label} className={cls("rounded-full px-2.5 py-1 text-[12px]", state.tone)}>{label}: {state.label}</span>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                <Car className="h-10 w-10 text-[#D4D4D4] mb-3" />
                                <p className="text-sm text-[#777777] font-medium">No vehicles registered yet</p>
                            </div>
                        )}
                    </div>

                    {/* Fleet Drivers Section (B2B Only) */}
                    {member.is_business && (
                        <div className="pt-6 border-t border-border">
                            <section className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-medium text-[#A3A3A3] flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Authorized Drivers ({drivers.length})
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsAddDriverOpen(true)}
                                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
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
                                                    <div className="h-8 w-8 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#777777]">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium text-sm text-foreground">{d.member?.full_name}</div>
                                                        {d.member?.auth_user_id ? (
                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#1111F6]/10 text-[#0606D8] text-[11px] font-medium border border-[#1111F6]/20">
                                                                <Check className="h-2 w-2" /> Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-medium border border-amber-500/20">
                                                                <Smartphone className="h-2 w-2" /> Invited
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {d.vehicle ? (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#F2F2F2] border border-border text-[12px] font-medium text-[#555555]">
                                                            <Car className="h-3 w-3" />
                                                            {d.vehicle.year} {d.vehicle.model}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[12px] text-muted-foreground italic">No Vehicle Assigned</span>
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
                                    <h3 className="font-medium text-lg">Add Authorized Driver</h3>
                                    <button onClick={() => setIsAddDriverOpen(false)} className="p-1 hover:bg-white/10 rounded"><X className="h-5 w-5" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Enter driver details. They will receive an SMS with the web sign-up link.
                                    </p>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">Driver Name</label>
                                        <input
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            placeholder="John Doe"
                                            value={newDriver.name}
                                            onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">Phone Number</label>
                                        <input
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            placeholder="+233558508306"
                                            value={newDriver.phone}
                                            onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                                            onBlur={() => setNewDriver((current) => ({ ...current, phone: formatPhone(current.phone) }))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">Email Address</label>
                                        <input
                                            className="w-full p-2 rounded-lg border border-input bg-background"
                                            placeholder="driver@example.com"
                                            type="email"
                                            value={newDriver.email}
                                            onChange={e => setNewDriver({ ...newDriver, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">Assign Vehicle (Optional)</label>
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
                                    <button onClick={() => setIsAddDriverOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5">Cancel</button>
                                    <button
                                        onClick={handleAddDriver}
                                        disabled={addingDriver}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
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
                                <h4 className="font-medium text-sm">Membership</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#777777]">Active Membership</span>
                                    <span className={member.membership_is_active ? "text-[#197252]" : "text-[#777]"}>{member.membership_is_active ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#777777]">Tier</span>
                                    <span className="capitalize">{member.membership_tier || "—"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#777777]">Expiry</span>
                                    <span className="font-medium" suppressHydrationWarning>{member.membership_expiry_date ? new Date(member.membership_expiry_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                                </div>
                            </div>
                        </section>

                        </div>
                </div>
            </div>

        </div>
    );
}
