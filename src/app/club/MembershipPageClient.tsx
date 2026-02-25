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
    CarFront,
} from "lucide-react";
import { fetchMembershipByNumber } from "@/lib/supaFetch";

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
    if (!api) throw new Error("Empty membership payload");

    const plan = api.plan ?? {};
    const statusRaw = api.status ?? "active";

    const status: Membership["status"] =
        statusRaw === "active"
            ? "active"
            : statusRaw === "expired"
                ? "expired"
                : "paused";

    const code = (plan.code ?? "").toUpperCase();
    const tier: MembershipTier =
        code === "PREMIUM"
            ? "Pro"
            : code === "STANDARD"
                ? "Plus"
                : "Basic";

    const vehiclesFromApi: MembershipVehicleApi[] = Array.isArray(api.vehicles)
        ? api.vehicles
        : [];

    const vehicles: MembershipVehicle[] =
        vehiclesFromApi.length > 0
            ? vehiclesFromApi.map((v) => ({
                plate: v.plate ?? "—",
                model: v.model ?? "Vehicle",
                primary: Boolean(v.primary ?? false),
            }))
            : [
                {
                    plate: "—",
                    model: "No vehicle on file",
                    primary: true,
                },
            ];

    return {
        id: api.membership_id,
        memberName: api.member_name || "MotorAmbos Member",
        tier,
        memberSince: api.starts_at,
        renewalDate: api.expires_at,
        status,
        membershipNumber: api.membership_number,
        vehicles,
    };
}

/* ───────── Client Component ───────── */
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MembershipPlans } from "@/components/landing/MembershipPlans";

export function MembershipPageClient() {
    const searchParams = useSearchParams();
    const membershipNumberParam = searchParams.get("m") || "";

    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(!!membershipNumberParam);
    const [error, setError] = useState<string | null>(null);

    // If there is an ID in the URL, we definitely want to try loading it.
    // If NOT, we show the Plans page by default.

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!membershipNumberParam) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const apiData = await fetchMembershipByNumber<MembershipApi>(
                    membershipNumberParam
                );

                if (!apiData) {
                    if (!cancelled) {
                        setMembership(null);
                        setError("No active membership found for this number.");
                        setLoading(false);
                    }
                    return;
                }

                const mapped = mapApiToMembership(apiData);
                if (!cancelled) {
                    setMembership(mapped);
                    setLoading(false);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    const message =
                        err instanceof Error ? err.message : "Failed to load membership.";
                    setError(message);
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [membershipNumberParam]);

    const m = membership;

    const primaryVehicle = useMemo(() => {
        if (!m || !m.vehicles.length) {
            return { plate: "—", model: "No vehicle on file" };
        }
        return m.vehicles.find((v) => v.primary) ?? m.vehicles[0];
    }, [m]);

    const statusColor =
        m?.status === "active"
            ? "bg-[#9fe870]"
            : m?.status === "paused"
                ? "bg-amber-500"
                : "bg-red-500";

    const statusLabel =
        m?.status === "active"
            ? "Active"
            : m?.status === "paused"
                ? "Paused"
                : "Expired";

    /* ───────── Loading ───────── */
    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-6">
                    <div className="space-y-4 text-center">
                        <div className="mx-auto h-2 w-24 bg-primary animate-pulse" />
                        <div className="h-12 w-64 bg-muted/20 animate-pulse mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    /* ───────── MARKETING VIEW (Default if no ID) ───────── */
    if (!membershipNumberParam) {
        return (
            <>
                <Navbar />
                <MembershipPlans />
                <Footer />
            </>
        );
    }

    /* ───────── Error / Empty (Lookup View) ───────── */
    if (error || !m) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-6">
                    <div className="mx-auto flex w-full max-w-md flex-col gap-12 text-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center bg-onyx border-2 border-primary/20">
                            {error ? (
                                <AlertCircle size={40} className="text-primary" />
                            ) : (
                                <Search size={40} className="text-primary" />
                            )}
                        </div>

                        <div className="space-y-6">
                            <h1 className="ambos-heading text-4xl">
                                {error ? "SYSTEM_ERROR" : "MEMBER_LOOKUP"}
                            </h1>
                            <p className="mono-text text-sm text-muted-foreground uppercase tracking-widest leading-relaxed">
                                {error
                                    ? error
                                    : "Authorization required. Please utilize the unique technical link provided in your welcome protocol."}
                            </p>
                        </div>

                        <div className="pt-8 border-t border-border">
                            <Link
                                href="/club"
                                className="ambos-btn-secondary py-4 px-8 block text-center"
                            >
                                &larr; Return to Terminal
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    /* ───────── Main View (Digital Card) ───────── */
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow mx-auto flex w-full max-w-[1600px] flex-col gap-24 px-8 py-44 relative">
                <div className="card-circle opacity-30" />

                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-12 border-b border-white/5 relative z-10">
                    <div className="space-y-6">
                        <div className="ambos-label">IDENTITY_PROTOCOL_v2.4.8</div>
                        <h1 className="ambos-heading text-6xl md:text-8xl text-glow">DIGITAL_ID.</h1>
                    </div>
                    <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black pb-2">
                        SYSTEM_TERMINAL_SYNC: ACTIVE
                    </div>
                </header>

                <div className="grid lg:grid-cols-2 gap-24 relative z-10">
                    {/* ──── THE CARD (Premium Tech) ──── */}
                    <div className="space-y-12">
                        <div className="ambos-card bg-zinc-950 p-12 lg:p-16 border border-white/10 aspect-[1.58/1] flex flex-col justify-between relative overflow-hidden group shadow-[0_0_100px_-20px_rgba(206,255,0,0.1)]">
                            {/* Background Effects */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />

                            <div className="flex justify-between items-start z-10">
                                <div className="h-16 w-16 bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(206,255,0,0.3)]">
                                    <Car size={32} />
                                </div>
                                <div className="text-right space-y-2">
                                    <span className="ambos-label !bg-white/5 !text-white/40 !border-white/10 !text-[9px] !px-3 font-black">MEMBER_PROTOCOL_ID</span>
                                    <span className="ambos-heading text-xl text-white tracking-[0.3em] block">{m.membershipNumber}</span>
                                </div>
                            </div>

                            <div className="z-10 space-y-6">
                                <div className="space-y-2">
                                    <div className="mono-text text-[9px] text-primary/60 font-black tracking-[0.4em]">AUTHORIZED_HOLDER:</div>
                                    <div className="ambos-heading text-4xl md:text-5xl text-white uppercase truncate drop-shadow-lg">
                                        {m.memberName}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${m.status === 'active' ? 'bg-primary' : 'bg-red-500'} animate-pulse shadow-[0_0_10px_rgba(206,255,0,0.5)]`} />
                                        <span className="mono-text text-[10px] text-white font-black uppercase tracking-[0.3em]">STATUS: {statusLabel.toUpperCase()}</span>
                                    </div>
                                    <div className="h-px w-12 bg-white/10" />
                                    <span className="mono-text text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">SECURE_ID: MA_v0.9</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end z-10 pt-8 border-t border-white/5">
                                <div className="ambos-label !bg-primary !text-black !border-none !text-[11px] !px-6 !py-2 font-black tracking-[0.2em]">{m.tier.toUpperCase()}_PROTOCOL</div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-1 bg-white/5" />
                                    <div className="h-10 w-1 bg-white/10" />
                                    <div className="h-10 w-1 bg-white/20" />
                                    <div className="h-10 w-1 bg-white/40" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 py-8 border-y border-white/5 px-4">
                            <Activity size={16} className="text-primary animate-pulse" />
                            <p className="mono-text text-[10px] text-center text-muted-foreground uppercase tracking-[0.4em] font-black">
                                PRESENT_THIS_TERMINAL_IDENTITY_TO_PROVIDER_FOR_AUTH.
                            </p>
                        </div>
                    </div>

                    {/* ──── DETAILS SECTION ──── */}
                    <div className="space-y-16">
                        {/* Primary Vehicle Info */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="ambos-card bg-white/[0.02] p-10 space-y-6 border border-white/5">
                                <div className="ambos-label !bg-foreground !text-background !border-none !text-[9px] font-black">REGISTERED_UNIT</div>
                                <div className="space-y-2">
                                    <p className="ambos-heading text-2xl text-foreground truncate">{primaryVehicle.model.toUpperCase()}</p>
                                    <p className="mono-text text-[10px] text-primary font-black uppercase tracking-[0.3em]">TELEMETRICS: ACTIVE</p>
                                </div>
                            </div>
                            <div className="ambos-card bg-white/[0.02] p-10 space-y-6 border border-white/5">
                                <div className="ambos-label !bg-foreground !text-background !border-none !text-[9px] font-black">PLATE_IDENTIFICATION</div>
                                <div className="space-y-2">
                                    <p className="ambos-heading text-2xl text-foreground font-mono">{primaryVehicle.plate.toUpperCase()}</p>
                                    <p className="mono-text text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">REGION: GHANA_AO</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits List */}
                        <div className="ambos-card p-12 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-all" />

                            <h3 className="ambos-heading text-xl mb-12 uppercase tracking-widest flex items-center gap-6">
                                <Wrench size={24} className="text-primary" />
                                ACTIVE_PROTOCOLS
                            </h3>
                            <ul className="space-y-8">
                                {[
                                    "Priority roadside dispatch",
                                    "Battery diagnostics & terminal cleanup",
                                    "Rapid tyre replacement protocol",
                                    "Emergency fuel synthesis dispatch",
                                    "Heavy-duty towing infrastructure"
                                ].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-8 mono-text text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors group/item">
                                        <div className="h-px w-6 bg-primary/30 group-hover/item:w-10 group-hover/item:bg-primary transition-all shrink-0" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer Meta */}
                        <div className="flex flex-col gap-6 mono-text text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black border-t border-white/5 pt-12">
                            <div className="flex items-center gap-6">
                                <MapPin size={14} className="text-primary" />
                                <span>OPERATIONAL_NODE: ACCRA_METRO</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Activity size={14} className="text-primary" />
                                <span>INITIALIZED: {formatDate(m.memberSince).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}