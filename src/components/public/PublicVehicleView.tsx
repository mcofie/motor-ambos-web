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
    Wrench,
    FileText,
    ShieldCheck,
    History,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    Sparkles,
    Hash,
    Printer,
    Share2,
    Activity,
    TrendingUp,
    Calendar,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

    const scoreColor = healthScore >= 80 ? "text-[#2D5B18]" : healthScore >= 50 ? "text-amber-600" : "text-red-600";
    const scoreBg = healthScore >= 80 ? "bg-[#9FE870]" : healthScore >= 50 ? "bg-amber-100" : "bg-red-100";

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-[#9FE870]" strokeWidth={3} />
                <p className="mt-6 text-sm font-black uppercase tracking-widest text-[#5D7079]">Verifying Node...</p>
            </div>
        );
    }

    if (!vehicle && !initialData?.isUnassigned) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center bg-[#F0F2F5] space-y-12">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tight">Node not found.</h2>
                    <p className="text-lg font-bold text-[#5D7079] max-w-sm mx-auto">
                        This Digital Passport is not registered in our high-integrity infrastructure.
                    </p>
                </div>
                <Link href="/" className="wise-btn-secondary">Return home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-foreground font-sans pb-32 selection:bg-[#9FE870] selection:text-black">
            {/* Share Modal */}
            {showShare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6" onClick={() => setShowShare(false)}>
                    <div className="bg-white p-12 max-w-sm w-full rounded-[32px] text-center space-y-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black tracking-tight">Export Passport</h3>
                            <p className="text-sm font-bold text-[#5D7079]">Scan to view official record.</p>
                        </div>
                        <div className="bg-[#F0F2F5] p-6 rounded-[24px] mx-auto inline-block border-2 border-white">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                alt="QR Code"
                                className="w-48 h-48 mix-blend-multiply"
                            />
                        </div>
                        <button onClick={() => setShowShare(false)} className="w-full py-4 rounded-full bg-black text-white font-black text-sm uppercase tracking-widest">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-xl mx-auto px-6 pt-16 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Header / Identity */}
                <div className="text-center space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] shadow-sm border border-border">
                            <ShieldCheck size={14} className="text-[#9FE870]" />
                            Verified Digital Passport
                        </div>
                        <h1 className="text-[52px] md:text-[64px] font-black leading-[0.95] tracking-tighter">
                            {vehicle?.year} {vehicle?.make} <br />
                            <span className="text-[#9FE870] italic">{(vehicle?.model || "").toUpperCase()}</span>
                        </h1>
                    </div>

                    <div className="flex justify-center">
                        {/* High Fidelity Ghana License Plate */}
                        <div className="bg-[#E5E5E5] border-[6px] border-black rounded-[20px] p-6 shadow-wise-lg w-full max-w-[400px] relative">
                            <div className="absolute top-2 left-6 text-[9px] text-black/20 font-black tracking-widest uppercase">GHA National Registry</div>
                            <div className="flex flex-col items-center justify-center pt-4">
                                <div className="flex items-center justify-center w-full relative mb-2">
                                    <span className="text-7xl font-black text-black font-mono leading-none tracking-tighter">
                                        {vehicle?.plate?.split('-')[0] || "GH"}
                                    </span>
                                    <div className="absolute right-0 top-0 flex flex-col items-center gap-1">
                                        <div className="w-10 h-6 border border-black/20 flex flex-col rounded-sm overflow-hidden">
                                            <div className="h-1/3 bg-[#CE1126]" />
                                            <div className="h-1/3 bg-[#FCD116] flex items-center justify-center relative">
                                                <span className="text-black text-[8px] absolute">★</span>
                                            </div>
                                            <div className="h-1/3 bg-[#006B3F]" />
                                        </div>
                                        <span className="text-black text-[10px] font-black leading-none">GH</span>
                                    </div>
                                </div>
                                <span className="text-7xl font-black text-black font-mono tracking-[0.05em] leading-none mt-1">
                                    {vehicle?.plate?.split('-').slice(1).join('-') || "AMBOS"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-white border border-border rounded-full shadow-sm overflow-hidden">
                    {(['general', 'docs', 'history'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === t ? "bg-[#9FE870] text-black shadow-sm" : "text-[#5D7079] hover:text-black"
                                }`}
                        >
                            {t === 'general' ? 'Overview' : t === 'docs' ? 'Documents' : 'History'}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Vitality Card */}
                            <div className="wise-card !p-10 flex items-center justify-between group">
                                <div className="space-y-6">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">System Vitality</div>
                                    <div className={`text-7xl font-black ${scoreColor} tracking-tighter flex items-baseline gap-1`}>
                                        {healthScore}<span className="text-base text-[#5D7079]/40 tracking-widest">/100</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[#5D7079]/60 uppercase tracking-widest leading-relaxed">
                                        Regulatory Integrity index <br />
                                        <span className="text-black">v4.2 Operational</span>
                                    </p>
                                </div>
                                <div className={`w-24 h-24 rounded-full ${scoreBg} flex items-center justify-center text-white shadow-inner`}>
                                    <Activity className={`h-12 w-12 ${scoreColor} animate-pulse`} />
                                </div>
                            </div>

                            {/* Owner Detail */}
                            {member && (
                                <div className="wise-card !p-8 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full bg-[#F0F2F5] flex items-center justify-center">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">Entity Owner</div>
                                            <h4 className="text-2xl font-black tracking-tight">{member.full_name}</h4>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="text-[#9FE870]" size={28} />
                                </div>
                            )}

                            {/* Tech Specs */}
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Engine", value: "2.0L I4 Turbo" },
                                    { label: "Transmission", value: "8-Speed Auto" },
                                    { label: "Exterior", value: "Deep Metallic" },
                                    { label: "Drivetrain", value: "All-Wheel Drive" }
                                ].map((spec, i) => (
                                    <div key={i} className="wise-card !p-6 space-y-3 !bg-white">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-[#5D7079]">{spec.label}</div>
                                        <p className="text-lg font-black tracking-tight">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {[
                                { title: "Insurance Policy", url: vehicle?.insurance_url, icon: ShieldCheck, label: "Coverage Node" },
                                { title: "Roadworthy Cert", url: vehicle?.roadworthy_url, icon: FileText, label: "Registry Status" }
                            ].map((doc, i) => (
                                <div key={i} className="wise-card !p-10 space-y-10 group">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-2xl bg-[#F0F2F5] flex items-center justify-center text-black">
                                            <doc.icon className="h-8 w-8" />
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${doc.url ? 'bg-[#9FE870]/20 text-[#2D5B18]' : 'bg-red-50 text-red-600'}`}>
                                            {doc.url ? 'Verified Secure' : 'Expired / Missing'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">{doc.label}</div>
                                        <h4 className="text-4xl font-black tracking-tighter">{doc.title}</h4>
                                    </div>
                                    {doc.url && (
                                        <a href={doc.url} target="_blank" className="flex items-center justify-between text-xs font-black uppercase tracking-widest pt-8 border-t border-border hover:text-[#9FE870]">
                                            Open official document <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#5D7079]">Verified Transaction Ledger</h3>
                                <button onClick={() => window.print()} className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-xs">
                                    <Printer size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {history.length > 0 ? (
                                    history.map((h) => (
                                        <div key={h.id} className="wise-card !p-8 space-y-8 group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-[#F0F2F5] flex items-center justify-center">
                                                        <Wrench size={24} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">Service Entry</div>
                                                        <h4 className="text-2xl font-black tracking-tight">{h.description}</h4>
                                                        <div className="flex items-center gap-6 text-[11px] font-bold text-[#5D7079]">
                                                            <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(h.service_date).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-2"><Hash size={14} /> {h.mileage?.toLocaleString()} KM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {h.is_verified && <CheckCircle2 className="text-[#9FE870]" size={24} strokeWidth={3} />}
                                            </div>
                                            <div className="pt-8 border-t border-border flex justify-between items-center text-[13px] font-black uppercase tracking-widest">
                                                <span className="text-[#5D7079]">{h.provider_name || 'Verified Partner'}</span>
                                                <span>GHS {h.cost?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="wise-card !p-24 text-center border-dashed">
                                        <History size={48} className="mx-auto mb-6 opacity-10" />
                                        <p className="text-xl font-black text-[#5D7079]/40 uppercase tracking-widest leading-none">Record log empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Signature */}
                <div className="pt-20 border-t border-border text-center space-y-10">
                    <div className="space-y-4">
                        <Link href="/" className="inline-block space-y-2 group">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5D7079]">Powered By</div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-[6px] bg-[#9FE870] flex items-center justify-center font-black text-sm">A</div>
                                <span className="text-xl font-black tracking-tighter group-hover:text-[#9FE870] transition-colors">ambos</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Floating Share */}
            <button
                onClick={() => setShowShare(true)}
                className="fixed bottom-10 right-10 w-20 h-20 rounded-full bg-[#9FE870] text-black shadow-wise-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-[90]"
            >
                <Share2 size={28} />
            </button>
        </div>
    );
}
