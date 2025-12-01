"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export function MembershipPageClient() {
    const searchParams = useSearchParams();
    const membershipNumber = searchParams.get("m") || "";

    const [membership, setMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                if (!membershipNumber) {
                    setLoading(false);
                    return;
                }

                const apiData = await fetchMembershipByNumber<MembershipApi>(
                    membershipNumber
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
    }, [membershipNumber]);

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
                    <div className="space-y-2 text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted animate-pulse" />
                        <div className="h-6 w-48 rounded-full bg-muted animate-pulse mx-auto" />
                    </div>
                    <div className="h-56 w-full rounded-3xl bg-muted animate-pulse" />
                </div>
            </div>
        );
    }

    /* ───────── Error / Empty ───────── */
    if (!membershipNumber || error || !m) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <main className="mx-auto flex w-full max-w-md flex-col gap-6 text-center">
                    <div
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
                        {error ? (
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        ) : (
                            <Search className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {error ? "Membership Not Found" : "Membership Lookup"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {error
                                ? error
                                : "Please use the unique link provided in your welcome email to view your digital membership card."}
                        </p>
                    </div>

                    {!membershipNumber && (
                        <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
                            <p className="text-xs text-muted-foreground">
                                Example URL: <br />
                                <code className="bg-muted px-1 py-0.5 rounded">
                                    /membership?m=MBR-2048-001
                                </code>
                            </p>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    /* ───────── Main View ───────── */
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
            <main className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-10">

                {/* Header */}
                <header className="space-y-2 text-center sm:text-left">
                    <div
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span>Verified Membership</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Digital Card</h1>
                </header>

                {/* ──── THE CARD (Dark Mode) ──── */}
                <section className="group relative perspective-1000">
                    <div
                        className="relative mx-auto w-full max-w-md aspect-[1.58/1] rotate-1 transition-transform duration-500 hover:rotate-0">
                        <div
                            className="absolute inset-0 translate-y-4 rounded-2xl bg-primary/20 blur-3xl opacity-50" />
                        <div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-background border border-border shadow-2xl flex flex-col justify-between p-6 text-foreground overflow-hidden">
                            <div className="flex justify-between items-start z-10">
                                <Car className="text-primary h-8 w-8" />
                                <div className="text-right">
                                    <span className="font-mono text-[10px] text-muted-foreground block tracking-widest">MEMBER ID</span>
                                    <span
                                        className="font-mono text-xs text-muted-foreground tracking-wider">{m.membershipNumber}</span>
                                </div>
                            </div>
                            <div className="z-10">
                                <div className="text-lg font-bold tracking-wider mb-1 uppercase truncate">
                                    {m.memberName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${statusColor} animate-pulse`} />
                                    <span className="text-xs text-muted-foreground font-mono uppercase">{statusLabel}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end z-10">
                                <span
                                    className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                    {m.tier} PLAN
                                </span>
                                <div className="h-8 w-12 bg-muted rounded-md opacity-50" />
                            </div>
                            <div
                                className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none" />
                        </div>
                    </div>
                    <p className="mt-8 text-center text-xs text-muted-foreground">
                        Show this card to your provider upon arrival.
                    </p>
                </section>

                {/* ──── DETAILS SECTION (Light Mode / Clean) ──── */}
                <section className="grid gap-4">

                    {/* Primary Vehicle Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <div
                                className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <CarFront className="h-4 w-4" />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Vehicle</p>
                            <p className="font-bold text-sm text-foreground truncate">{primaryVehicle.model}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                            <div
                                className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <div className="font-mono text-[10px] font-bold">GH</div>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">License Plate</p>
                            <p className="font-bold text-sm text-foreground font-mono">{primaryVehicle.plate}</p>
                        </div>
                    </div>

                    {/* Coverage & Status */}
                    <div
                        className="rounded-2xl border border-border bg-card p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Status: {statusLabel}</p>
                                <p className="text-xs text-muted-foreground">Renew: {formatDate(m.renewalDate)}</p>
                            </div>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>

                    {/* Benefits List */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                            Included Benefits
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Priority roadside dispatch",
                                "Battery jump-start & diagnostics",
                                "Flat tyre change service",
                                "Fuel delivery coordination",
                                "Towing within coverage radius"
                            ].map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer Meta */}
                    <div
                        className="flex items-center justify-between px-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>Accra, Ghana</span>
                        </div>
                        <span>Member since {formatDate(m.memberSince)}</span>
                    </div>

                </section>
            </main>
        </div>
    );
}