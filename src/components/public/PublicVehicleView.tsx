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

    const healthScore = React.useMemo(() => {
        if (!vehicle) return 0;
        let score = 0;
        if (vehicle.insurance_url) score += 30;
        if (vehicle.roadworthy_url) score += 30;
        if (history.length > 0) {
            const lastService = new Date(history[0].service_date);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            if (lastService > sixMonthsAgo) score += 20;
            if (history.length >= 3) score += 20;
        }
        return Math.min(score, 100);
    }, [vehicle, history]);

    const nextServiceDate = React.useMemo(() => {
        if (!history.length) return null;
        const last = new Date(history[0].service_date);
        const next = new Date(last);
        next.setMonth(next.getMonth() + 6);
        return next;
    }, [history]);

    const scoreColor = healthScore >= 80 ? "text-primary" : healthScore >= 50 ? "text-yellow-500" : "text-red-500";
    const scoreBg = healthScore >= 80 ? "bg-primary" : healthScore >= 50 ? "bg-yellow-500" : "bg-red-500";
    const scoreShadow = healthScore >= 80 ? "shadow-[0_0_20px_#CEFF00]" : "shadow-none";

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-background mesh-bg">
                <div className="card-circle opacity-20" />
                <div className="ambos-label animate-pulse mb-8">SYSTEM_INITIALIZING...</div>
                <div className="h-[1px] w-48 bg-white/10 relative overflow-hidden">
                    <div className="h-full bg-primary animate-[shimmer_1s_infinite] w-1/2" />
                </div>
            </div>
        );
    }

    if (initialData?.isUnassigned) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center bg-background mesh-bg space-y-12 animate-in fade-in duration-700">
                <div className="card-circle opacity-30" />
                <div className="h-32 w-32 bg-primary/5 rounded-[2rem] border border-primary/20 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    <Sparkles className="h-12 w-12 text-primary relative z-10" />
                </div>

                <div className="space-y-4">
                    <div className="ambos-label !bg-primary !text-black mx-auto">HARDWARE_UNASSIGNED</div>
                    <h2 className="ambos-heading text-5xl text-foreground tracking-tighter">NEW_SMART_UNIT.</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto uppercase mono-text text-[11px] tracking-widest font-bold">
                        THIS_DIGITAL_PASSPORT_IS_READY_TO_BE_LINKED_TO_A_VEHICLE_NODE.
                    </p>
                </div>

                <div className="w-full max-w-sm ambos-card p-10 space-y-10 group hover:border-primary/40 transition-all duration-500">
                    <div className="space-y-4 text-center">
                        <div className="mono-text text-[10px] text-primary tracking-[0.4em] font-black uppercase">SERIAL_UNIT</div>
                        <p className="text-3xl font-black text-foreground tracking-[0.2em]">{initialData?.cardDetails?.serial_number}</p>
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                        {[
                            { step: "01", text: "OPEN_MOTOR_AMBOS_DASHBOARD" },
                            { step: "02", text: "NAVIGATE_TO_HARDWARE_LINK" },
                            { step: "03", text: "AUTHENTICATE_VIA_SERIAL" }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-6 text-left group/item">
                                <div className="text-primary mono-text text-[10px] font-black">{s.step}</div>
                                <p className="mono-text text-[11px] text-muted-foreground font-bold tracking-widest group-hover/item:text-foreground transition-colors">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="ambos-btn-secondary !py-8 !px-16 text-xl">
                    <Link href="/">RETURN_TO_ROOT</Link>
                </button>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center bg-background mesh-bg space-y-10">
                <div className="card-circle opacity-10 bg-red-500" />
                <div className="h-24 w-24 bg-red-500/5 rounded-[2rem] border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <div className="space-y-4">
                    <div className="ambos-label !bg-red-500 !text-white mx-auto">FATAL_ERROR: NODE_NOT_FOUND</div>
                    <h2 className="ambos-heading text-4xl text-foreground tracking-tighter uppercase">INVALID_PASSPORT_ENTITY.</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto mono-text text-[11px] uppercase tracking-widest font-bold">
                        THIS_ID_TAG_IS_NOT_FOUND_IN_THE_REGISTRY_INFRASTRUCTURE.
                    </p>
                </div>
                <Link href="/" className="ambos-btn-secondary !py-6 !px-12">
                    RETURN_HOME
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-32 relative selection:bg-primary/20 mesh-bg overflow-x-hidden">
            <div className="card-circle opacity-30" />

            {/* Share Modal Overlay */}
            {showShare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 animate-in fade-in duration-500" onClick={() => setShowShare(false)}>
                    <div className="ambos-card p-12 max-w-sm w-full text-center space-y-10 relative bg-zinc-900 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                        <button onClick={() => setShowShare(false)} className="absolute top-6 right-6 text-white/20 hover:text-primary transition-colors">
                            <span className="sr-only">Close</span>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="space-y-4">
                            <div className="ambos-label mx-auto">SECURE_SHARE</div>
                            <h3 className="ambos-heading text-3xl text-white tracking-tighter">PASSPORT_EXPORT.</h3>
                            <p className="mono-text text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">SCAN_TO_VIEW_OFFICIAL_RECORD</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl mx-auto inline-block border-[12px] border-zinc-800 shadow-2xl relative">
                            <div className="absolute -inset-2 border border-white/10 rounded-[2rem] pointer-events-none" />
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                alt="QR Code"
                                className="w-48 h-48 mix-blend-multiply"
                            />
                        </div>
                        <p className="mono-text text-[9px] text-primary/50 uppercase tracking-widest break-all font-black border-t border-white/5 pt-8">
                            {typeof window !== 'undefined' ? window.location.href : ''}
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto px-8 pt-20 pb-24 space-y-20 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Vehicle Identity Section */}
                <div className="text-center space-y-12">
                    <div className="space-y-6">
                        <div className="ambos-label mx-auto">PASSPORT_ENTITY: {vehicle.nfc_serial_number || "IDENTIFIED"}</div>
                        <h1 className="ambos-heading text-7xl md:text-8xl leading-[0.8] tracking-tighter text-foreground group">
                            {vehicle.year} {vehicle.make} <br />
                            <span className="text-primary italic text-glow">{(vehicle.model || "").toUpperCase()}</span>
                        </h1>
                    </div>

                    <div className="flex justify-center py-4">
                        {/* High Fidelity Ghana License Plate */}
                        <div className="bg-[#E5E5E5] border-[6px] border-zinc-900 rounded-[1.5rem] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-[420px] relative transform transition-all hover:scale-[1.02] hover:-rotate-1 duration-500 group">
                            <div className="absolute inset-1 border-[1.5px] border-black/10 rounded-[1.1rem] pointer-events-none" />
                            <div className="absolute top-2 left-6 mono-text text-[10px] text-black/20 font-black tracking-widest uppercase">GHA_NAT_REG</div>

                            <div className="flex flex-col items-center justify-center relative pt-4">
                                <div className="flex items-center justify-center w-full relative mb-2">
                                    {vehicle.plate && vehicle.plate.includes('-') ? (
                                        <span className="text-7xl font-black text-zinc-900 font-mono leading-none tracking-tighter">
                                            {vehicle.plate.split('-')[0]}
                                        </span>
                                    ) : (
                                        <span className="text-6xl font-black text-zinc-900 font-mono leading-none">
                                            {vehicle.plate?.split(' ')[0] || "GH"}
                                        </span>
                                    )}

                                    <div className="absolute right-0 top-0 flex flex-col items-center gap-1">
                                        <div className="w-12 h-7 border-[1px] border-black/20 flex flex-col shadow-sm rounded-sm overflow-hidden">
                                            <div className="h-1/3 bg-[#CE1126]" />
                                            <div className="h-1/3 bg-[#FCD116] flex items-center justify-center relative">
                                                <span className="text-black text-[10px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] tracking-none">★</span>
                                            </div>
                                            <div className="h-1/3 bg-[#006B3F]" />
                                        </div>
                                        <span className="text-zinc-900 text-[12px] font-black leading-none tracking-[0.2em]">GH</span>
                                    </div>
                                </div>

                                <span className="text-7xl font-black text-zinc-900 font-mono tracking-[0.05em] leading-none mt-2">
                                    {vehicle.plate && vehicle.plate.includes('-')
                                        ? vehicle.plate.split('-').slice(1).join('-')
                                        : vehicle.plate?.split(' ').slice(1).join(' ') || "AMBOS"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS Navigation */}
                <div className="flex p-2 bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl items-stretch">
                    {(['general', 'docs', 'history'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cls(
                                "flex-1 py-4 text-[11px] font-black uppercase tracking-[0.3em] rounded-xl transition-all duration-500",
                                activeTab === t
                                    ? "bg-primary text-black shadow-[0_0_30px_rgba(206,255,0,0.3)] scale-[1.02] z-10"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            {t === 'general' && "OVERVIEW"}
                            {t === 'docs' && "DOCUMENTS"}
                            {t === 'history' && "HISTORY"}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="min-h-[400px]">
                    {activeTab === 'general' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* STATUS CARD */}
                            <div className="ambos-card p-10 relative overflow-hidden group hover:border-primary/40 transition-all duration-700">
                                <div className={`absolute top-0 right-0 w-48 h-48 ${scoreBg} opacity-5 blur-[60px] rounded-full group-hover:opacity-10 transition-opacity`} />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="space-y-4">
                                        <div className="ambos-label">SYSTEM_VITALITY</div>
                                        <div className={`text-7xl font-black ${scoreColor} tracking-tighter flex items-baseline gap-2 text-glow`}>
                                            {healthScore}<span className="text-xl text-foreground opacity-30 tracking-widest">/100</span>
                                        </div>
                                        <p className="mono-text text-[10px] text-muted-foreground max-w-[200px] uppercase font-bold tracking-widest leading-relaxed">
                                            CALCULATED_STATUS: <br />
                                            <span className="text-foreground">REGULATORY_INTEGRITY_INDEX_v0.4</span>
                                        </p>
                                    </div>
                                    <div className="h-24 w-24 relative flex items-center justify-center">
                                        <Activity className={`h-12 w-12 ${scoreColor} animate-pulse`} />
                                        <svg className="absolute inset-0 w-full h-full -rotate-90 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 36 36">
                                            <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                                            <path className={`${scoreColor} transition-all duration-1000 ease-out`} strokeDasharray={`${healthScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Data Unit */}
                            {member && (
                                <div className="ambos-card p-8 border-white/5 flex items-center justify-between group hover:border-primary/20">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="mono-text text-[9px] font-black text-primary tracking-[0.4em] uppercase">ENTITY_OWNER</div>
                                            <h4 className="ambos-heading text-2xl text-foreground tracking-tight">{member.full_name}</h4>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary mono-text text-[9px] font-black tracking-widest uppercase rounded-full">VERIFIED_NODE</span>
                                        {member.membership_tier && (
                                            <div className="mono-text text-[9px] text-muted-foreground font-black tracking-widest uppercase pt-1">
                                                ID: {member.membership_tier}_FLEET
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Technical Specs Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "ENGINE_ARCHITECTURE", value: "2.0L I4 TURBO_SYS" },
                                    { label: "TRANSMISSION_NODE", value: "AUTOMATIC_v8" },
                                    { label: "CHASSIS_COLOR", value: "DEEP_BLACK_METALLIC" },
                                    { label: "DRIVETRAIN_ID", value: "INTELLIGENT_AWD" }
                                ].map((spec, i) => (
                                    <div key={i} className="ambos-card p-6 bg-white/[0.02] border-white/5 space-y-3">
                                        <div className="mono-text text-[8px] font-black text-muted-foreground tracking-[0.3em] uppercase">{spec.label}</div>
                                        <p className="ambos-heading text-lg text-foreground tracking-tight">{spec.value}</p>
                                    </div>
                                ))}
                                <div className="ambos-card p-6 bg-white/[0.02] border-white/5 col-span-2 space-y-3 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rotate-45 transform translate-x-8 -translate-y-8" />
                                    <div className="mono-text text-[8px] font-black text-primary tracking-[0.3em] uppercase">IDENTIFICATION_KEY: VIN</div>
                                    <p className="mono-text text-xl font-black text-foreground tracking-[0.5em] group-hover:tracking-[0.6em] transition-all duration-700">•••• •••• •••• 8492</p>
                                </div>
                            </div>

                            {/* Forecast Unit */}
                            <div className="ambos-card p-8 bg-blue-500/5 border-blue-500/20 flex items-center gap-6 group hover:border-blue-500/40 transition-all duration-500">
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <div className="space-y-2">
                                    <div className="mono-text text-[9px] font-black text-blue-400 tracking-[0.4em] uppercase">PREDICTIVE_LOG_FORECAST</div>
                                    <p className="ambos-heading text-2xl text-foreground tracking-tight">
                                        {nextServiceDate ? nextServiceDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase() : "DATA_INSUFFICIENT"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {[
                                { title: "INSURANCE_POLICY", url: vehicle.insurance_url, icon: ShieldCheck, color: "text-primary", label: "NODE_PROTECTION" },
                                { title: "ROADWORTHY_CERT", url: vehicle.roadworthy_url, icon: FileText, color: "text-blue-500", label: "COMPLIANCE_STATUS" }
                            ].map((doc, i) => (
                                <div key={i} className="ambos-card p-10 bg-white/[0.02] border-white/5 space-y-10 group hover:border-primary/40 transition-all duration-500">
                                    <div className="flex justify-between items-start">
                                        <div className={`h-16 w-16 rounded-[1.25rem] bg-zinc-900 border border-white/10 ${doc.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                                            <doc.icon className="h-8 w-8" />
                                        </div>
                                        <div className={cls("ambos-label", doc.url ? "!bg-primary !text-black" : "!bg-red-500/20 !text-red-500")}>
                                            {doc.url ? "VERIFIED_SECURE" : "EXPIRED_NODE"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="mono-text text-[9px] font-black text-muted-foreground tracking-[0.4em] uppercase">{doc.label}</div>
                                        <h4 className="ambos-heading text-4xl text-foreground tracking-tighter uppercase">{doc.title}</h4>
                                    </div>
                                    {doc.url && (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between mono-text text-[11px] font-black text-primary uppercase pt-10 border-t border-white/5 group-hover:text-primary transition-colors tracking-[0.3em]"
                                        >
                                            DECRYPT_DOCUMENT <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between px-4">
                                <div className="space-y-1">
                                    <div className="mono-text text-[10px] font-black text-primary tracking-[0.4em] uppercase font-bold flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        LIVE_TECHNICAL_LEDGER
                                    </div>
                                </div>
                                <button onClick={() => window.print()} className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-all" title="EXPORT_PDF">
                                    <Printer className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {history.length > 0 ? (
                                    history.map((h, i) => (
                                        <div key={h.id} className="ambos-card p-8 bg-white/[0.02] border-white/5 group hover:border-primary/40 transition-all duration-700">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                                                        <Wrench className="h-7 w-7" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <div className="mono-text text-[9px] font-black text-muted-foreground tracking-[0.4em] uppercase">INTERNAL_COMBUSTION_MAINTENANCE</div>
                                                            <h4 className="ambos-heading text-2xl text-foreground tracking-tight uppercase">{h.description}</h4>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="mono-text text-[10px] font-black text-white/40 flex items-center gap-2 tracking-widest uppercase">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(h.service_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                                            </div>
                                                            <div className="mono-text text-[10px] font-black text-primary flex items-center gap-2 tracking-widest uppercase">
                                                                <Hash className="h-3 w-3" />
                                                                {h.mileage?.toLocaleString()} KM
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {h.is_verified && (
                                                    <div className="h-10 w-10 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(206,255,0,0.5)] group-hover:scale-110 transition-transform" title="IMMUTABLE_RECORD">
                                                        <CheckCircle2 className="h-5 w-5" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                                <span className="mono-text text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">{h.provider_name || "OFFICIAL_PARTNER_NODE"}</span>
                                                <span className="mono-text text-sm font-black text-foreground tracking-tighter">GHS_{h.cost?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 text-center ambos-card bg-white/[0.01] border-dashed border-white/10 text-muted-foreground">
                                        <History className="h-16 w-16 mx-auto mb-8 opacity-10" />
                                        <p className="ambos-heading text-2xl text-white/20 tracking-tighter uppercase leading-none">RECORD_LOG_EMPTY</p>
                                        <p className="mono-text text-[10px] mt-4 tracking-[0.4em] font-black uppercase opacity-20">NO_VERIFIED_ENTRIES_FOR_THIS_NODE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="pt-20 text-center space-y-12">
                    <div className="space-y-4">
                        <p className="mono-text text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-40">SYSTEM_POWERED_BY</p>
                        <Link href="/" className="group inline-flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center gap-4">
                                <span className="ambos-heading text-4xl tracking-tighter text-foreground uppercase leading-none group-hover:text-primary transition-colors">MOTOR AMBOS</span>
                            </div>
                            <div className="mono-text text-[9px] text-primary/50 font-black tracking-[0.5em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">GHANA_AUTOMOTIVE_INFRA_v4.2</div>
                        </Link>
                    </div>

                    <div className="flex justify-center pt-8 border-t border-white/5">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Floating Share Button */}
            <button
                onClick={() => setShowShare(true)}
                className="fixed bottom-10 right-10 z-[80] h-20 w-20 rounded-[2rem] bg-primary text-black shadow-[0_20px_60px_-10px_rgba(206,255,0,0.5)] flex items-center justify-center hover:scale-110 hover:-rotate-6 active:scale-95 transition-all duration-500 group"
            >
                <Share2 className="h-8 w-8 group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}

function cls(...args: any[]) {
    return args.filter(Boolean).join(" ");
}
