"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    getPublicVehicle,
    getPublicServiceHistory,
    getPublicMemberByUserId,
    VehicleRow,
    ServiceHistoryRow,
    MemberWithMembershipRow,
    NfcCardRow
} from "@/lib/supaFetch";
import {
    Car,
    Calendar,
    Wrench,
    FileText,
    ShieldCheck,
    History,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    ChevronRight,
    Sparkles,
    Hash,
    Printer,
    Share2,
    Activity,
    TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PublicVehicleViewProps {
    nfcId: string;
    initialData?: {
        vehicle: VehicleRow | null;
        history: ServiceHistoryRow[];
        member: MemberWithMembershipRow | null;
        isUnassigned?: boolean;
        cardDetails?: NfcCardRow | null;
    }
}

export function PublicVehicleView({ nfcId, initialData }: PublicVehicleViewProps) {
    const [vehicle, setVehicle] = useState<VehicleRow | null>(initialData?.vehicle || null);
    const [history, setHistory] = useState<ServiceHistoryRow[]>(initialData?.history || []);
    const [member, setMember] = useState<MemberWithMembershipRow | null>(initialData?.member || null);
    const [loading, setLoading] = useState(!initialData);

    // Combined state for tabs and features
    const [activeTab, setActiveTab] = useState<'general' | 'docs' | 'history'>('general');
    const [showShare, setShowShare] = useState(false);

    const fetchData = useCallback(async () => {
        if (initialData) return;

        setLoading(true);
        try {
            const v = await getPublicVehicle(nfcId);
            if (!v) {
                setVehicle(null);
                return;
            }
            setVehicle(v);

            const [h, m] = await Promise.all([
                getPublicServiceHistory(v.id),
                getPublicMemberByUserId(v.user_id)
            ]);
            setHistory(h || []);
            setMember(m);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load digital passport");
        } finally {
            setLoading(false);
        }
    }, [nfcId, initialData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate Vehicle Health Score (0-100)
    const healthScore = React.useMemo(() => {
        if (!vehicle) return 0;
        let score = 0;
        // Basic Compliance
        if (vehicle.insurance_url) score += 30;
        if (vehicle.roadworthy_url) score += 30;
        // Maintenance History
        if (history.length > 0) {
            const lastService = new Date(history[0].service_date);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            // Recent service bonus
            if (lastService > sixMonthsAgo) score += 20;
            // Consistent history bonus
            if (history.length >= 3) score += 20;
        }
        return Math.min(score, 100);
    }, [vehicle, history]);

    // Predict Next Service
    const nextServiceDate = React.useMemo(() => {
        if (!history.length) return null;
        const last = new Date(history[0].service_date);
        const next = new Date(last);
        next.setMonth(next.getMonth() + 6); // Assume 6-month cycle
        return next;
    }, [history]);

    // Color for score
    const scoreColor = healthScore >= 80 ? "text-emerald-500" : healthScore >= 50 ? "text-yellow-500" : "text-red-500";
    const scoreBg = healthScore >= 80 ? "bg-emerald-500" : healthScore >= 50 ? "bg-yellow-500" : "bg-red-500";

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-background">
                <Car className="h-10 w-10 text-primary animate-bounce mb-4" />
                <div className="h-1 w-24 bg-secondary overflow-hidden rounded-full">
                    <div className="h-full bg-primary animate-[shimmer_1s_infinite] w-1/2" />
                </div>
            </div>
        );
    }

    if (initialData?.isUnassigned) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center bg-background space-y-8 animate-in fade-in duration-700">
                <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    <Sparkles className="h-10 w-10 text-primary relative z-10" />
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tight leading-none">New Smart Card</h2>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        This digital passport is ready to be linked to your vehicle.
                    </p>
                </div>

                <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Serial Number</label>
                        <p className="text-xl font-mono font-bold text-foreground tracking-widest">{initialData?.cardDetails?.serial_number}</p>
                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                        <div className="flex items-start gap-3 text-left">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold font-mono">1</span>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Open the <b>MotorAmbos Mobile App</b> on your device.</p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold font-mono">2</span>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Go to <b>Vehicle Settings</b> and select <b>"Link Smart Card"</b>.</p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold font-mono">3</span>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Enter the serial number above to activate this passport.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <Link href="/" className="px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center bg-background space-y-6">
                <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Invalid Passport</h2>
                    <p className="mt-2 text-muted-foreground max-w-xs text-sm">
                        This ID tag is not found in our registry.
                    </p>
                </div>
                <Link href="/" className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-20 relative selection:bg-primary/20">
            {/* Share Modal Overlay */}
            {showShare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setShowShare(false)}>
                    <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center space-y-6 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowShare(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <span className="sr-only">Close</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Share Passport</h3>
                            <p className="text-xs text-slate-500 mt-1">Scan to view this vehicle's digital record</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl mx-auto inline-block border-4 border-slate-900">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                alt="QR Code"
                                className="w-48 h-48"
                            />
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest break-all">
                            {typeof window !== 'undefined' ? window.location.href : ''}
                        </p>
                    </div>
                </div>
            )}

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-md mx-auto px-6 pt-12 pb-24 space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Vehicle Identity Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex flex-col items-center">
                        <div className="relative">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-foreground transition-colors">
                                {vehicle.year} {vehicle.make}
                            </h1>
                            <p className="text-xl font-medium text-muted-foreground mt-2 tracking-tight uppercase">{vehicle.model}</p>
                        </div>
                    </div>

                    <div className="flex justify-center py-2">
                        {/* Ghana License Plate Component */}
                        <div className="bg-[#e0e0e0] border-4 border-black rounded-xl p-3 shadow-2xl w-full max-w-[300px] relative transform transition-transform hover:scale-105 duration-300">
                            {/* Plate Inner Highlight */}
                            <div className="absolute inset-0.5 border border-black/10 rounded-lg pointer-events-none" />

                            <div className="flex flex-col items-center justify-center relative">
                                {/* Top Row: Region Code & Flag */}
                                <div className="flex items-center justify-center w-full relative mb-1">
                                    {/* Center: Region Code */}
                                    {vehicle.plate && vehicle.plate.includes('-') ? (
                                        <span className="text-5xl font-black text-black font-mono leading-none tracking-tighter">
                                            {vehicle.plate.split('-')[0]}
                                        </span>
                                    ) : (
                                        <span className="text-4xl font-black text-black font-mono leading-none">
                                            {vehicle.plate?.split(' ')[0] || "GH"}
                                        </span>
                                    )}

                                    {/* Right: Flag & Country Code */}
                                    <div className="absolute right-0 top-1 flex flex-col items-center gap-0.5">
                                        {/* Ghana Flag */}
                                        <div className="w-8 h-5 border-[0.5px] border-black/20 flex flex-col shadow-sm">
                                            <div className="h-1/3 bg-[#CE1126]" />
                                            <div className="h-1/3 bg-[#FCD116] flex items-center justify-center relative">
                                                <span className="text-black text-[8px] leading-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">★</span>
                                            </div>
                                            <div className="h-1/3 bg-[#006B3F]" />
                                        </div>
                                        <span className="text-black text-[10px] font-black leading-none tracking-widest">GH</span>
                                    </div>
                                </div>

                                {/* Bottom Row: Rest of Number */}
                                <span className="text-5xl font-black text-black font-mono tracking-widest leading-none mt-1">
                                    {vehicle.plate && vehicle.plate.includes('-')
                                        ? vehicle.plate.split('-').slice(1).join('-')
                                        : vehicle.plate?.split(' ').slice(1).join(' ') || "PASSPORT"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* TABS Navigation */}
                <div className="flex p-1 bg-secondary/20 rounded-xl overflow-hidden backdrop-blur-md shadow-lg border border-white/5">
                    {(['general', 'docs', 'history'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cls(
                                "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300",
                                activeTab === t
                                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                                    : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                            )}
                        >
                            {t === 'general' && "Overview"}
                            {t === 'docs' && "Docs"}
                            {t === 'history' && "History"}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="min-h-[300px]">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* HEALTH SCORE CARD */}
                            <div className="bg-card/50 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${scoreBg} opacity-10 rounded-bl-full`} />
                                <div>
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Health Score</h4>
                                    <div className={`text-4xl font-black ${scoreColor} mt-1 flex items-baseline gap-1`}>
                                        {healthScore}<span className="text-sm text-foreground opacity-50">/100</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[140px]">
                                        Based on insurance, valid roadworthy, and service regularity.
                                    </p>
                                </div>
                                <div className="h-16 w-16 relative flex items-center justify-center">
                                    <Activity className={`h-8 w-8 ${scoreColor}`} />
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-secondary/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                        <path className={`${scoreColor} transition-all duration-1000 ease-out`} strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                    </svg>
                                </div>
                            </div>

                            {/* Owner Info Bar */}
                            {member && (
                                <div className="bg-card/50 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-primary">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Owner</p>
                                            <h4 className="text-base font-bold text-foreground">{member.full_name}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Active Member</span>
                                        {member.membership_tier && (
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
                                                {member.membership_tier} Tier
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Vehicle Specs */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-card/30 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Color</p>
                                    <p className="text-sm font-bold text-foreground">Black</p>
                                </div>
                                <div className="bg-card/30 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Engine</p>
                                    <p className="text-sm font-bold text-foreground">2.0L I4 Turbo</p>
                                </div>
                                <div className="bg-card/30 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Transmission</p>
                                    <p className="text-sm font-bold text-foreground">Automatic</p>
                                </div>
                                <div className="bg-card/30 rounded-2xl p-4 border border-border">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Drive</p>
                                    <p className="text-sm font-bold text-foreground">AWD</p>
                                </div>
                                <div className="bg-card/30 rounded-2xl p-4 border border-border col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">VIN Check</p>
                                    <p className="text-sm font-mono text-foreground tracking-widest">•••• •••• •••• 8492</p>
                                </div>
                            </div>

                            {/* Predictive Maintenance */}
                            <div className="bg-card/30 rounded-2xl p-5 border border-border flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimated Next Service</h4>
                                    <p className="text-sm font-bold text-foreground mt-0.5">
                                        {nextServiceDate ? nextServiceDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Not enough data"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {[
                                { title: "Insurance", url: vehicle.insurance_url, icon: ShieldCheck, color: "text-primary" },
                                { title: "Roadworthy", url: vehicle.roadworthy_url, icon: FileText, color: "text-blue-500" }
                            ].map((doc, i) => (
                                <div key={i} className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border space-y-4 shadow-sm group hover:border-primary/20 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className={`h-10 w-10 rounded-2xl bg-secondary/20 ${doc.color} flex items-center justify-center`}>
                                            <doc.icon className="h-5 w-5" />
                                        </div>
                                        <CheckCircle2 className={cls("h-5 w-5", doc.url ? "text-primary" : "text-muted-foreground")} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">{doc.title}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-0.5">
                                            {doc.url ? "Document Verified" : "Missing / Expired"}
                                        </p>
                                    </div>
                                    {doc.url && (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-[10px] font-bold text-primary uppercase pt-2 border-t border-border group-hover:text-primary/80"
                                        >
                                            View Document <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    Log
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => window.print()} className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-foreground transition-colors" title="Print Report">
                                        <Printer className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {history.length > 0 ? (
                                    history.map((h, i) => (
                                        <div key={h.id} className="relative group">
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-5 border border-border shadow-sm group-hover:border-primary/30 transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-foreground shrink-0">
                                                            <Wrench className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-foreground capitalize">{h.description}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(h.service_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                                    <Hash className="h-3 w-3" />
                                                                    {h.mileage?.toLocaleString()} km
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {h.is_verified && (
                                                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md" title="Verified Service">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                                                    <span className="uppercase tracking-widest">{h.provider_name || "Official Partner"}</span>
                                                    <span className="text-foreground">GHS {h.cost?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-16 text-center bg-card/30 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
                                        <History className="h-10 w-10 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm font-bold uppercase tracking-widest leading-none">Record Log Empty</p>
                                        <p className="text-[10px] mt-2 opacity-70">No verified service history available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-8 text-center space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Powered by</p>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                        <Car className="h-5 w-5 text-primary" />
                        <span className="text-base font-black tracking-tighter text-foreground uppercase leading-none block">Motor Ambos</span>
                    </Link>

                    {vehicle.nfc_serial_number && (
                        <p className="text-[10px] font-mono text-muted-foreground/50 pt-8 uppercase tracking-widest">
                            Serial: {vehicle.nfc_serial_number}
                        </p>
                    )}

                    <div className="flex justify-center pt-4">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Floating Share Button */}
            <button
                onClick={() => setShowShare(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
                <Share2 className="h-6 w-6" />
            </button>
        </div>
    );
}

function cls(...args: any[]) {
    return args.filter(Boolean).join(" ");
}
