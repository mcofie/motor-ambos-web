"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Car,
    ShieldCheck,
    MapPin,
    Wrench,
    AlertCircle,
    Search,
    CheckCircle2,
    Activity,
    ArrowRight,
    Calendar,
    Settings,
    User
} from "lucide-react";
import { fetchMembershipByNumber } from "@/lib/supaFetch";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MembershipPlans } from "@/components/landing/MembershipPlans";
import { cn } from "@/lib/utils";

/* ───────── Types ───────── */

type MembershipTier = "Basic" | "Plus" | "Pro";

interface MembershipVehicle {
    plate: string;
    model: string;
    primary?: boolean;
}

interface Membership {
    id: string;
    memberName: string;
    tier: MembershipTier;
    memberSince: string;
    renewalDate: string;
    status: "active" | "expired" | "paused";
    membershipNumber: string;
    vehicles: MembershipVehicle[];
}

interface MembershipPlanApi {
    code?: string | null;
    name?: string | null;
}

interface MembershipVehicleApi {
    plate?: string | null;
    model?: string | null;
    primary?: boolean | null;
}

interface MembershipUsageApi {
    year?: number;
    callouts_used?: number;
    callouts_remaining?: number;
}

interface MembershipApi {
    membership_id: string;
    membership_number: string;
    status?: string | null;
    starts_at: string;
    expires_at: string;
    member_name?: string | null;
    plan?: MembershipPlanApi | null;
    vehicles?: MembershipVehicleApi[] | null;
    usage?: MembershipUsageApi | null;
}

/* ───────── Helpers ───────── */

function formatDate(str: string) {
    if (!str) return "—";
    return new Date(str).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function mapApiToMembership(api: MembershipApi): Membership {
    const plan = api.plan ?? {};
    const statusRaw = api.status ?? "active";
    const status: Membership["status"] =
        statusRaw === "active" ? "active" : statusRaw === "expired" ? "expired" : "paused";

    const code = (plan.code ?? "").toUpperCase();
    const tier: MembershipTier = code === "PREMIUM" ? "Pro" : code === "STANDARD" ? "Plus" : "Basic";

    const vehiclesFromApi = Array.isArray(api.vehicles) ? api.vehicles : [];
    const vehicles: MembershipVehicle[] = vehiclesFromApi.length > 0
        ? vehiclesFromApi.map((v) => ({
            plate: v.plate ?? "—",
            model: v.model ?? "Vehicle",
            primary: Boolean(v.primary ?? false),
        }))
        : [{ plate: "—", model: "No vehicle on file", primary: true }];

    return {
        id: api.membership_id,
        memberName: api.member_name || "Ambos Member",
        tier,
        memberSince: api.starts_at,
        renewalDate: api.expires_at,
        status,
        membershipNumber: api.membership_number,
        vehicles,
    };
}

/* ───────── Client Component ───────── */

export function MembershipPageClient() {
    const searchParams = useSearchParams();
    const mNum = searchParams.get("m") || "";

    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(!!mNum);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mNum) { setLoading(false); return; }
        async function load() {
            try {
                setLoading(true);
                const data = await fetchMembershipByNumber<MembershipApi>(mNum);
                if (!data) { setError("No active membership found."); setLoading(false); return; }
                setMembership(mapApiToMembership(data));
            } catch (err) {
                setError("Failed to load membership record.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [mNum]);

    const m = membership;
    const primaryVehicle = useMemo(() => m?.vehicles.find(v => v.primary) ?? m?.vehicles[0], [m]);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-1 bg-[#F0F2F5] rounded-full overflow-hidden">
                <div className="h-full bg-[#9FE870] animate-progress-fast" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">Syncing Identity Node...</p>
        </div>
    );

    if (!mNum) return (
        <div className="bg-white">
            <Navbar />
            <MembershipPlans />
            <Footer />
        </div>
    );

    if (error || !m) return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-10">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto">
                        <AlertCircle size={40} className="text-red-600" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black tracking-tight uppercase">Identity Error.</h1>
                        <p className="text-lg font-bold text-[#5D7079] leading-relaxed">
                            {error || "Verification required. Use the link from your welcome email."}
                        </p>
                    </div>
                    <Link href="/club" className="wise-btn-secondary inline-block !px-12">Return home</Link>
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32 pb-48">
                <div className="wise-container max-w-5xl">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Digital Card Side */}
                        <div className="lg:w-1/2 space-y-12">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] shadow-xs">
                                    <ShieldCheck size={14} className="text-[#9FE870]" />
                                    Verified Identity Node
                                </div>
                                <h1 className="wise-heading-section !leading-none">Digital <br /> Member ID.</h1>
                            </div>

                            {/* The Card */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-black/5 rounded-[40px] blur-3xl group-hover:bg-[#9FE870]/10 transition-colors" />
                                <div className="relative wise-card !p-12 !rounded-[40px] aspect-[1.58/1] flex flex-col justify-between overflow-hidden !bg-black text-white shadow-wise-lg">
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#9FE870]/10 to-transparent pointer-events-none" />

                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 bg-[#9FE870] rounded-2xl flex items-center justify-center text-black shadow-inner">
                                            <Car size={28} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">Protocol ID</p>
                                            <p className="text-xl font-bold tracking-tighter">{m.membershipNumber}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Authorized Holder</p>
                                            <p className="text-4xl font-black tracking-tighter uppercase truncate">{m.memberName}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full animate-pulse", m.status === 'active' ? 'bg-[#9FE870]' : 'bg-red-500')} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{m.status}</span>
                                            </div>
                                            <div className="h-3 w-px bg-white/20" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">v2.4.8 Ledger</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-8 border-t border-white/10">
                                        <div className="px-6 py-2 bg-[#9FE870] text-black rounded-full text-xs font-black uppercase tracking-widest">{m.tier} Protocol</div>
                                        <div className="flex gap-1 h-6">
                                            {[1, 0.6, 0.3, 0.1].map((o, i) => (
                                                <div key={i} className="w-1 h-full bg-white" style={{ opacity: o }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs font-bold text-[#5D7079] text-center uppercase tracking-widest opacity-60">
                                Present this terminal identity <br /> to authorized providers for authentication.
                            </p>
                        </div>

                        {/* Details Side */}
                        <div className="lg:w-1/2 space-y-12 pt-12">
                            <div className="grid grid-cols-2 gap-6">
                                <DetailBox label="Registered Unit" value={primaryVehicle?.model || "No Unit"} icon={<Car size={18} />} />
                                <DetailBox label="Plate Identification" value={primaryVehicle?.plate || "No Plate"} icon={<HashIcon />} />
                            </div>

                            <div className="wise-card !p-12 space-y-10">
                                <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-4">
                                    <Wrench size={24} className="text-[#9FE870]" />
                                    Active Benefits
                                </h3>
                                <ul className="space-y-6">
                                    {[
                                        "Level 1 Priority Response",
                                        "Professional On-Site Diagnostics",
                                        "Rapid Recovery Infrastructure",
                                        "Emergency Operational Support",
                                        "Verified Provider Network Access"
                                    ].map((b, i) => (
                                        <li key={i} className="flex items-center gap-6 text-sm font-bold text-[#5D7079] group">
                                            <div className="w-2 h-2 rounded-full bg-[#9FE870] group-hover:scale-150 transition-transform" />
                                            <span className="uppercase tracking-widest">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8 border-t border-border flex flex-wrap gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-border">
                                        <Calendar size={14} className="text-[#5D7079]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">Since</p>
                                        <p className="text-xs font-black uppercase">{formatDate(m.memberSince)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-border">
                                        <MapPin size={14} className="text-[#5D7079]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">Node</p>
                                        <p className="text-xs font-black uppercase">Metropolitan District</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function DetailBox({ label, value, icon }: any) {
    return (
        <div className="wise-card !p-8 space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">{label}</div>
            <div className="flex items-center gap-4">
                <div className="text-black">{icon}</div>
                <p className="text-2xl font-black tracking-tighter uppercase truncate leading-none">{value}</p>
            </div>
        </div>
    );
}

function HashIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
    );
}