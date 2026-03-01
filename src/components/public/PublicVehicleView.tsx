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
    ArrowRight,
    Cpu,
    Timer,
    Globe,
    Copy,
    Check,
    XCircle,
    Fingerprint
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

    const scoreColor = healthScore >= 80 ? "text-[#00C767]" : healthScore >= 50 ? "text-amber-500" : "text-red-500";
    const scoreBg = healthScore >= 80 ? "bg-[#00C767]/10" : healthScore >= 50 ? "bg-amber-500/10" : "bg-red-500/10";
    const scoreBorder = healthScore >= 80 ? "border-[#00C767]/20" : healthScore >= 50 ? "border-amber-500/20" : "border-red-500/20";

    if (loading) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-white font-jakarta">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#00C767]/20 rounded-full animate-ping" />
                    <Loader2 className="relative h-12 w-12 animate-spin text-[#00C767]" strokeWidth={2.5} />
                </div>
                <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.2em] text-[#171717]/40">Verifying Passport Node...</p>
            </div>
        );
    }

    if (!vehicle && !initialData?.isUnassigned) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center px-12 text-center bg-white font-jakarta">
                <div className="w-24 h-24 rounded-[32px] bg-red-50 flex items-center justify-center mb-10">
                    <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <div className="space-y-6 max-w-sm">
                    <h2 className="text-[32px] font-extrabold tracking-tight text-[#171717] leading-none uppercase">Invalid Node ID</h2>
                    <p className="text-[17px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest opacity-60">
                        This sequence is not registered in the Motor Ambos trust infrastructure.
                    </p>
                </div>
                <Link href="/" className="mt-12 bg-[#171717] text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[13px] hover:bg-black transition-all">
                    Return to Hub
                </Link>
            </div>
        );
    }

    const copyToClipboard = () => {
        if (typeof window === 'undefined') return;
        navigator.clipboard.writeText(window.location.href);
        toast.success("Passport Link Copied", {
            icon: <Copy size={16} />
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-[#171717] font-jakarta pb-40 selection:bg-[#00C767]/20 selection:text-[#171717]">
            {/* Share Modal */}
            {showShare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171717]/80 backdrop-blur-md p-6" onClick={() => setShowShare(false)}>
                    <div className="bg-white p-12 max-w-sm w-full rounded-[48px] text-center space-y-12 relative shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-[#F8FAFF] rounded-[24px] flex items-center justify-center mx-auto mb-6 text-[#00C767]">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-[28px] font-extrabold tracking-tight text-[#171717] uppercase">Export Passport</h3>
                            <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">Global Identity Reference</p>
                        </div>
                        <div className="bg-[#F8FAFF] p-8 rounded-[40px] border border-slate-100 shadow-inner">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                                alt="Passport QR"
                                className="w-full h-auto mix-blend-multiply"
                            />
                        </div>
                        <div className="grid gap-3">
                            <button onClick={copyToClipboard} className="w-full py-5 rounded-2xl bg-[#171717] text-white font-bold text-[15px] flex items-center justify-center gap-3">
                                <Copy size={18} /> Copy URL
                            </button>
                            <button onClick={() => setShowShare(false)} className="w-full py-5 rounded-2xl text-slate-400 font-bold text-[15px] uppercase tracking-widest border border-slate-100">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Simple Header */}
            <div className="bg-white border-b border-slate-100 h-20 px-6 flex items-center justify-between sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#00C767] rounded-full flex items-center justify-center text-white">
                        <Activity size={16} />
                    </div>
                    <span className="font-bold text-[18px] tracking-tight">motor ambos</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button onClick={() => window.print()} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
                        <Printer size={20} />
                    </button>
                    <button onClick={() => setShowShare(true)} className="bg-[#171717] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:bg-black transition-all">
                        <Share2 size={16} className="text-[#00C767]" /> Share
                    </button>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 pt-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Hero / Identity Section */}
                <div className="text-center space-y-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717] shadow-sm border border-slate-100">
                            <Fingerprint size={14} className="text-[#00C767]" />
                            System Verification Node
                        </div>
                        <div className="space-y-2">
                            <p className="text-[14px] font-bold text-slate-400 uppercase tracking-[0.2em]">Vehicle Unit Passport</p>
                            <h1 className="text-[44px] md:text-[56px] font-extrabold leading-[1.0] tracking-[-0.05em] text-[#171717]">
                                {vehicle?.year} {vehicle?.make} <br />
                                <span className="text-[#00C767] italic">{(vehicle?.model || "").toUpperCase()}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Industrial License Plate Design */}
                    <div className="flex justify-center group">
                        <div className="bg-[#DFE1E5] border-[6px] border-[#171717] rounded-[32px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-[440px] relative overflow-hidden transition-all duration-700 group-hover:scale-[1.02] transform-gpu">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 font-bold tracking-[0.4em] uppercase opacity-40">Transport Registry Control</div>

                            <div className="flex flex-col items-center justify-center pt-6">
                                <div className="flex items-center justify-between w-full mb-2 px-2">
                                    <div className="flex-1" />
                                    <span className="text-8xl font-black text-[#171717] font-mono leading-none tracking-tighter">
                                        {vehicle?.plate?.split('-')[0] || "GH"}
                                    </span>
                                    <div className="flex-1 flex justify-end">
                                        <div className="w-12 h-8 border border-[#171717]/10 flex flex-col rounded-md overflow-hidden shadow-sm">
                                            <div className="h-1/3 bg-[#CE1126]" />
                                            <div className="h-1/3 bg-[#FCD116] flex items-center justify-center relative">
                                                <span className="text-black text-[10px] absolute">★</span>
                                            </div>
                                            <div className="h-1/3 bg-[#006B3F]" />
                                        </div>
                                    </div>
                                </div>
                                <span className="text-8xl font-black text-[#171717] font-mono tracking-[0.05em] leading-none mt-2">
                                    {vehicle?.plate?.split('-').slice(1).join('-') || "AMBOS"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Navigation Tabs */}
                <div className="flex p-1 bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden sticky top-24 z-40 backdrop-blur-md bg-white/80">
                    {(['general', 'docs', 'history'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cn(
                                "flex-1 py-4 text-[12px] font-bold uppercase tracking-[0.15em] rounded-[20px] transition-all duration-300",
                                activeTab === t
                                    ? "bg-[#171717] text-white shadow-lg"
                                    : "text-slate-400 hover:text-[#171717]"
                            )}
                        >
                            {t === 'general' ? 'Core' : t === 'docs' ? 'Intel' : 'Ledger'}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content Sections */}
                <div className="min-h-[500px]">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Vitality Score Protocol */}
                            <div className={cn("bg-white p-10 rounded-[48px] border-2 flex items-center justify-between group transition-all duration-500 hover:shadow-2xl", scoreBorder)}>
                                <div className="space-y-6">
                                    <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400">Registry Integrity</div>
                                    <div className={cn("text-8xl font-black tracking-tighter flex items-baseline gap-1 font-mono", scoreColor)}>
                                        {healthScore}<span className="text-base text-slate-300 tracking-[0.1em] font-sans">PTS / 100</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-bold text-[#171717] uppercase tracking-[0.1em]">Protocol: Verified High-Active</p>
                                        <p className="text-[11px] font-medium text-slate-400">Node Synchronization: 100% Operational</p>
                                    </div>
                                </div>
                                <div className={cn("w-28 h-28 rounded-full flex items-center justify-center shadow-2xl relative", scoreBg)}>
                                    <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", scoreBg)} />
                                    <Activity className={cn("h-12 w-12", scoreColor)} />
                                </div>
                            </div>

                            {/* Ownership Status */}
                            {member && (
                                <div className="bg-[#171717] p-8 rounded-[36px] flex items-center justify-between shadow-2xl shadow-black/10 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-[20px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                            <User size={28} className="text-white opacity-80" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Unit Custodian</div>
                                            <h4 className="text-[20px] font-extrabold tracking-tight text-white uppercase">{member.full_name}</h4>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 bg-[#00C767] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#00C767]/20">
                                        <CheckCircle2 size={24} strokeWidth={3} />
                                    </div>
                                </div>
                            )}

                            {/* Technical Cluster */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Internal Node", value: "2.0L I4 Turbo", icon: Cpu },
                                    { label: "Sync Sequence", value: "8-Speed Auto", icon: Timer },
                                    { label: "Visual ID", value: "Deep Metallic", icon: Sparkles },
                                    { label: "Traction Node", value: "All-Wheel Drive", icon: TrendingUp }
                                ].map((spec, i) => (
                                    <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                            <spec.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{spec.label}</div>
                                            <p className="text-[16px] font-extrabold tracking-tight text-[#171717] uppercase">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {[
                                { title: "Insurance Intel", url: vehicle?.insurance_url, icon: ShieldCheck, sub: "Risk Mitigation Layer" },
                                { title: "National Registry", url: vehicle?.roadworthy_url, icon: FileText, sub: "Compliance Authority" }
                            ].map((doc, i) => (
                                <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-100 space-y-10 group transition-all duration-500 hover:shadow-2xl hover:border-[#00C767]/20">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-[24px] bg-[#F8FAFF] border border-slate-100 flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-[#00C767] transition-all">
                                            <doc.icon className="h-8 w-8" />
                                        </div>
                                        <div className={cn(
                                            "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]",
                                            doc.url ? 'bg-[#00C767]/10 text-[#00C767] border border-[#00C767]/10' : 'bg-red-50 text-red-500 border border-red-50'
                                        )}>
                                            {doc.url ? 'Verified Active' : 'Status: Offline'}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{doc.sub}</div>
                                        <h4 className="text-[36px] font-extrabold tracking-tight leading-none text-[#171717] uppercase">{doc.title}</h4>
                                    </div>
                                    {doc.url ? (
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            className="flex items-center justify-between text-[13px] font-bold uppercase tracking-[0.1em] pt-8 border-t border-slate-50 text-slate-400 hover:text-[#00C767] transition-colors"
                                        >
                                            View authoritative node <ExternalLink size={16} />
                                        </a>
                                    ) : (
                                        <div className="pt-8 border-t border-slate-50 text-[13px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-3">
                                            <AlertCircle size={16} /> Attention Required
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-1">
                                    <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#171717]">Technical Ledger</h3>
                                    <p className="text-[11px] font-medium text-slate-400">Verified transaction history nodes</p>
                                </div>
                                <div className="bg-[#00C767]/10 px-4 py-2 rounded-full border border-[#00C767]/10">
                                    <span className="text-[11px] font-bold text-[#00C767] uppercase tracking-widest">{history.length} Entries</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {history.length > 0 ? (
                                    history.map((h) => (
                                        <div key={h.id} className="bg-white p-8 rounded-[36px] border border-slate-100 space-y-10 transition-all duration-500 hover:shadow-2xl hover:border-[#00C767]/20 group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-6">
                                                    <div className="w-16 h-16 rounded-[20px] bg-[#F8FAFF] group-hover:bg-[#171717] group-hover:text-[#00C767] flex items-center justify-center text-slate-300 transition-all shadow-sm">
                                                        <Wrench size={24} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ledger Entry / {new Date(h.service_date).getFullYear()}</div>
                                                        <h4 className="text-[22px] font-extrabold tracking-tight text-[#171717] uppercase leading-tight">{h.description}</h4>
                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[12px] font-bold text-[#171717] opacity-60">
                                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-[#00C767]" /> {new Date(h.service_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                            <span className="flex items-center gap-2"><Hash size={14} className="text-[#00C767]" /> {h.mileage?.toLocaleString()} KM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {h.is_verified && (
                                                    <div className="w-8 h-8 rounded-full bg-[#00C767] flex items-center justify-center text-white shadow-lg shadow-[#00C767]/20">
                                                        <Check size={18} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="pt-8 border-t border-slate-50 flex justify-between items-center text-[15px] font-bold text-[#171717] uppercase tracking-[0.1em]">
                                                <span className="text-slate-300 font-medium">{h.provider_name || 'Ambos Node'}</span>
                                                <span className="text-[18px] font-extrabold tracking-tighter">GHS {h.cost?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-24 rounded-[48px] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-200">
                                            <History size={40} />
                                        </div>
                                        <p className="text-[15px] font-bold text-slate-300 uppercase tracking-[0.2em]">Zero Ledger Events Detected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Secure Verification Footer */}
                <div className="pt-24 border-t border-slate-100 flex flex-col items-center gap-12 opacity-80">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-[#00C767] rounded-xl flex items-center justify-center text-white shadow-xl shadow-[#00C767]/20 group-hover:scale-110 transition-transform">
                                <Activity size={20} />
                            </div>
                            <span className="text-[24px] font-extrabold tracking-tight text-[#171717]">motor ambos</span>
                        </Link>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Integrated Trust Infrastructure</p>
                    </div>
                </div>
            </div>

            {/* Floating Protocol Interaction */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pointer-events-none z-[90]">
                <div className="bg-[#171717] p-5 rounded-[28px] shadow-2xl flex items-center justify-between border border-white/10 pointer-events-auto animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-1.5 h-1.5 bg-[#00C767] rounded-full animate-pulse shadow-[0_0_10px_#00C767]" />
                        <span className="text-white text-[12px] font-bold uppercase tracking-widest">Passport v2.1.0_ACTV</span>
                    </div>
                    <button
                        onClick={() => setShowShare(true)}
                        className="bg-white text-[#171717] px-6 py-3 rounded-2xl font-bold text-[13px] flex items-center gap-2 hover:bg-[#00C767] hover:text-white transition-all active:scale-[0.98]"
                    >
                        <Share2 size={16} /> SHARE
                    </button>
                </div>
            </div>
        </div>
    );
}
