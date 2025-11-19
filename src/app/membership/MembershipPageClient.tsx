"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Car,
    ShieldCheck,
    CalendarClock,
    Clock,
    QrCode,
    MapPin,
    Wrench,
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
                    setError("No membership number in URL.");
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

    /* ───────── Internal loading (data fetch), separate from Suspense ───────── */

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
                    <div className="space-y-3">
                        <div className="h-5 w-40 rounded-full bg-muted animate-pulse" />
                        <div className="h-7 w-56 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-64 rounded-full bg-muted animate-pulse" />
                    </div>

                    <div className="relative mx-auto mt-2 max-w-sm">
                        <div className="absolute inset-0 translate-y-3 rounded-3xl bg-muted/60 blur-2xl" />
                        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-4 py-4 shadow-sm">
                            <div className="space-y-4 animate-pulse">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-2">
                                        <div className="h-5 w-28 rounded-full bg-muted" />
                                        <div className="h-4 w-32 rounded-full bg-muted" />
                                        <div className="h-3 w-40 rounded-full bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-5 w-20 rounded-full bg-muted" />
                                        <div className="h-4 w-24 rounded-full bg-muted" />
                                        <div className="h-3 w-24 rounded-full bg-muted" />
                                    </div>
                                </div>

                                <div className="h-px bg-muted" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 rounded-full bg-muted" />
                                        <div className="h-4 w-24 rounded-full bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 rounded-full bg-muted" />
                                        <div className="h-4 w-24 rounded-full bg-muted" />
                                    </div>
                                </div>

                                <div className="h-px bg-muted" />

                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="h-3 w-24 rounded-full bg-muted" />
                                        <div className="h-4 w-28 rounded-full bg-muted" />
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-muted" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    /* ───────── Error / empty ───────── */

    if (error || !m) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8">
                    <header className="space-y-2">
                        <h1 className="text-xl font-semibold">Membership lookup</h1>

                        {membershipNumber ? (
                            <p className="text-sm text-muted-foreground">
                                We couldn&apos;t find an active membership for{" "}
                                <span className="font-mono">{membershipNumber}</span>.
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Add{" "}
                                <code className="rounded bg-muted px-1 text-xs">
                                    ?m=MBR-2048-001
                                </code>{" "}
                                to the URL to view a membership card.
                            </p>
                        )}
                    </header>

                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}
                </main>
            </div>
        );
    }

    /* ───────── Main view ───────── */

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
                {/* Header */}
                <header className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#9fe870]/50 bg-[#9fe870]/10 px-3 py-1 text-xs font-medium text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#9fe870]" />
                        <span className="text-[11px] font-semibold tracking-wide">
              MotorAmbos Membership
            </span>
                    </div>

                    <h1 className="text-xl font-semibold">Your membership card</h1>

                    <p className="text-sm text-muted-foreground">
                        Show this card to providers for quick verification when you need help.
                    </p>
                </header>

                {/* Card */}
                <section>
                    <div className="relative mx-auto max-w-sm">
                        {/* Smaller shadow */}
                        <div className="absolute inset-0 translate-y-2 rounded-3xl bg-black/20 blur-2xl dark:bg-black/40" />

                        <div
                            className="relative overflow-hidden rounded-3xl border border-[#9fe870]/40 px-4 py-4 text-white shadow-lg"
                            style={{
                                background:
                                    "linear-gradient(145deg, #050505 0%, #111111 55%, #050505 100%)",
                            }}
                        >
                            {/* Light scribble + blobs but smaller */}
                            <svg
                                className="pointer-events-none absolute inset-0 opacity-50"
                                width="100%"
                                height="100%"
                                viewBox="0 0 320 200"
                                fill="none"
                            >
                                <path
                                    d="M-10 145 C60 50 220 50 330 145"
                                    stroke="#9fe870"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    opacity="0.4"
                                />
                            </svg>
                            <div className="pointer-events-none absolute -left-12 -top-16 h-32 w-32 rounded-full bg-[#9fe870]/20 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 right-0 h-32 w-32 rounded-full bg-[#9fe870]/18 blur-3xl" />

                            <div className="relative flex flex-col gap-4">
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1.5">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium ring-1 ring-white/10">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#9fe870] text-[11px] font-semibold text-black">
                        MA
                      </span>
                                            <span className="text-[#9fe870]">MotorAmbos</span>
                                        </div>
                                        <h2 className="text-lg font-semibold tracking-tight text-[#9fe870]">
                                            Membership • {m.tier}
                                        </h2>
                                        <p className="text-xs text-white/80">{m.memberName}</p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1.5 text-right">
                                        <Badge className="border-none bg-[#9fe870]/15 px-2 py-1 text-[10px] font-medium text-[#9fe870] backdrop-blur">
                      <span
                          className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${statusColor}`}
                      />
                                            {statusLabel}
                                        </Badge>
                                        <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/90 ring-1 ring-white/10">
                                            <Car className="h-3 w-3 text-[#9fe870]" />
                                            <span>{primaryVehicle.plate}</span>
                                        </div>
                                        <p className="max-w-[150px] text-[10px] text-white/70">
                                            {primaryVehicle.model}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="border-white/20" />

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1 text-[11px] text-white/70">
                                            <CalendarClock className="h-3 w-3 text-[#9fe870]" />
                                            Member since
                                        </p>
                                        <p className="font-medium text-white">
                                            {formatDate(m.memberSince)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1 text-[11px] text-white/70">
                                            <Clock className="h-3 w-3 text-[#9fe870]" />
                                            Renewal
                                        </p>
                                        <p className="font-medium text-white">
                                            {formatDate(m.renewalDate)}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="border-white/20" />

                                {/* Bottom row */}
                                <div className="flex items-end justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">
                                            Membership No.
                                        </p>
                                        <p className="font-mono text-xs tracking-[0.16em] text-[#9fe870]">
                                            {m.membershipNumber}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 p-1.5 ring-1 ring-white/15">
                                            <QrCode className="h-6 w-6 text-[#9fe870]" />
                                        </div>
                                        <div className="space-y-0.5 text-[10px] text-white/80">
                                            <p className="font-medium leading-tight">Tap / scan at the scene</p>
                                            <p className="text-[9px] text-white/60 leading-tight">
                                                For fast provider verification &amp; job start.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mt-3 text-[11px] text-muted-foreground">
                            This is a view-only digital card. Keep this page handy when you request
                            assistance.
                        </p>
                    </div>
                </section>

                {/* Details card */}
                <section>
                    <Card className="border-border bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-sm font-semibold">
                                <span>Membership details</span>
                                <span className="text-[11px] text-muted-foreground">
                  ID · {m.id}
                </span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        Primary vehicle
                                    </p>
                                    <p className="font-medium">{primaryVehicle.model}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Plate: {primaryVehicle.plate}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-muted-foreground">Status</p>
                                    <div className="inline-flex items-center gap-1">
                                        <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                                        <span className="text-sm">{statusLabel}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="border-border" />

                            <div className="grid gap-3 text-xs md:grid-cols-2">
                                <div>
                                    <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        Typical area
                                    </p>
                                    <p>Accra · Spintex / Airport (example)</p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                                        Used for dispatch &amp; ETA estimates.
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        <Wrench className="h-3 w-3" />
                                        Included services
                                    </p>
                                    <ul className="space-y-1 text-[11px]">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#9fe870]" />
                                            Priority roadside dispatch within coverage radius
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#9fe870]" />
                                            Tyre change, jump-start &amp; basic diagnostics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#9fe870]" />
                                            Up to 10km towing (Plus / Pro)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}