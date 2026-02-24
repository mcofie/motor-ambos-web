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
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-grow mx-auto flex w-full max-w-lg flex-col gap-12 px-6 py-44">

                {/* Header */}
                <header className="flex justify-between items-end pb-8 border-b border-border">
                    <div className="space-y-4">
                        <div className="ambos-label">IDENTITY_PROTOCOL</div>
                        <h1 className="ambos-heading text-5xl">Digital Card</h1>
                    </div>
                    <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">
                        v2.0.48
                    </div>
                </header>

                {/* ──── THE CARD (Industrial) ──── */}
                <section className="space-y-8">
                    <div className="ambos-card bg-onyx p-10 border-2 border-primary/20 aspect-[1.58/1] flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-start z-10">
                            <div className="h-12 w-12 bg-primary flex items-center justify-center text-black">
                                <Car size={24} />
                            </div>
                            <div className="text-right">
                                <span className="ambos-label text-[10px] block mb-2 px-2">MEMBER_ID</span>
                                <span className="mono-text text-white text-sm tracking-[0.2em]">{m.membershipNumber}</span>
                            </div>
                        </div>

                        <div className="z-10 space-y-4">
                            <div className="ambos-heading text-3xl text-white uppercase truncate">
                                {m.memberName}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`h-2 w-2 ${m.status === 'active' ? 'bg-primary' : 'bg-red-500'}`} />
                                <span className="mono-text text-[10px] text-white/50 uppercase tracking-[0.3em] font-bold">STATUS: {statusLabel}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end z-10">
                            <div className="ambos-label bg-primary text-black px-4 py-1 text-xs">{m.tier} PROTOCOL</div>
                            <div className="h-8 w-12 bg-white/5 border border-white/10" />
                        </div>
                    </div>
                    <p className="mono-text text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                        Present this terminal identity to provider for authentication.
                    </p>
                </section>

                {/* ──── DETAILS SECTION ──── */}
                <section className="grid gap-8">

                    {/* Primary Vehicle Info */}
                    <div className="grid grid-cols-2 gap-0 border border-border">
                        <div className="bg-muted/5 p-8 border-r border-border">
                            <div className="ambos-label mb-6 bg-foreground text-background inline-block">VEHICLE</div>
                            <p className="ambos-heading text-xl text-foreground truncate">{primaryVehicle.model}</p>
                            <p className="mono-text text-[10px] text-muted-foreground mt-2 uppercase">Telematics: Active</p>
                        </div>
                        <div className="bg-muted/5 p-8">
                            <div className="ambos-label mb-6 bg-foreground text-background inline-block">PLATE</div>
                            <p className="ambos-heading text-xl text-foreground font-mono">{primaryVehicle.plate}</p>
                            <p className="mono-text text-[10px] text-muted-foreground mt-2 uppercase">Region: GHANA</p>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <div className="ambos-card p-8 bg-muted/5 border-2 border-border">
                        <h3 className="ambos-heading text-lg mb-8 uppercase tracking-widest flex items-center gap-4">
                            <Wrench size={18} className="text-primary" />
                            Active Protocols
                        </h3>
                        <ul className="space-y-6">
                            {[
                                "Priority roadside dispatch",
                                "Battery diagnostics & terminal cleanup",
                                "Rapid tyre replacement protocol",
                                "Emergency fuel synthesis dispatch",
                                "Heavy-duty towing infrastructure"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-center gap-6 mono-text text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <div className="h-1 w-4 bg-primary shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer Meta */}
                    <div className="flex flex-col gap-4 mono-text text-[10px] text-muted-foreground uppercase tracking-[0.3em] border-t border-border pt-8">
                        <div className="flex items-center gap-4">
                            <MapPin size={12} className="text-primary" />
                            <span>Operational Node: Accra</span>
                        </div>
                        <div>Initialized: {formatDate(m.memberSince)}</div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}