"use client";

import * as React from "react";
import { useState, Suspense, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
// Removed unused Input/Label imports here to use custom ModernInput,
// or we can use them inside ModernInput.
// I will remove them from here and keep the custom implementation below
// to preserve the specific styling you liked.
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LucideIcon, Car, ArrowRight, ChevronLeft, AlertTriangle, BatteryCharging, Disc, Droplets, Truck, Phone, MapPin, Star, Loader2, BadgeCheck, MessageCircle, ChevronDown, Navigation, LocateFixed, ShieldCheck, Sparkles, Store, Zap } from "lucide-react";

// Mock or Real imports
import { createRequest, findProvidersNear } from "@/lib/supaFetch";

/* ───────────────────────────────
   Types & Logic
   ─────────────────────────────── */

type JsonObject = Record<string, unknown>;

function isRecord(val: unknown): val is Record<string, unknown> {
    return typeof val === "object" && val !== null;
}

type GeoErrorLike = { code: number; message?: string };

function isGeoErrorLike(e: unknown): e is GeoErrorLike {
    return isRecord(e) && typeof (e as JsonObject).code === "number";
}

function extractErrorMessage(e: unknown): string | null {
    if (isRecord(e) && "message" in e) {
        const msg = (e as { message: unknown }).message;
        return typeof msg === "string" ? msg : null;
    }
    return null;
}

const HelpSchema = z.object({
    helpType: z.enum(["battery", "tire", "oil", "tow", "rescue", "fuel", "roadworthy", "insurance", "detailing", "car_wash", "shop", "electrical"]),
    carMake: z.string().min(2, "Car make is required"),
    carModel: z.string().min(1, "Car model is required"),
    carYear: z
        .string()
        .min(4, "4 digits")
        .max(4, "4 digits")
        .regex(/^\d{4}$/, "4 digits"),
    carColor: z.string().min(2, "Required"),
    plateNumber: z.string().min(2, "Required"),
    fullName: z.string().min(2, "Required"),
    phone: z
        .string()
        .min(7, "Invalid phone")
        .regex(/^[0-9+\-\s()]{7,}$/, "Invalid format"),
});

type HelpForm = z.infer<typeof HelpSchema>;
type StepKey = "help" | "car" | "contact" | "providers";

type GeoFix = {
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp: number;
};

export type Provider = {
    id: string;
    name: string;
    phone: string;
    address_line?: string;
    distance_km: number;
    rating?: number;
    jobs?: number;
    min_callout_fee?: number | null;
    coverage_radius_km?: number | null;
    services: Array<{
        code: string;
        name: string;
        price?: number | null;
        unit?: string | null;
    }>;
    lat: number;
    lng: number;
    is_verified?: boolean;
    logo_url?: string | null;
    backdrop_url?: string | null;
};

const HELP_OPTIONS: Array<{
    key: HelpForm["helpType"];
    label: string;
    Icon: LucideIcon;
    hint: string;
    colorClass: string;
}> = [
        {
            key: "battery",
            label: "Battery",
            Icon: BatteryCharging,
            hint: "Jumpstart / Replace",
            colorClass: "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
        },
        {
            key: "tire",
            label: "Flat Tyre",
            Icon: Disc,
            hint: "Change / Pump",
            colorClass: "text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20",
        },
        {
            key: "oil",
            label: "Engine Oil",
            Icon: Droplets,
            hint: "Top-up / Leak",
            colorClass: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
        },
        {
            key: "tow",
            label: "Towing",
            Icon: Truck,
            hint: "Move Vehicle",
            colorClass: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
        },
        {
            key: "rescue",
            label: "Rescue",
            Icon: AlertTriangle,
            hint: "Stuck / Accident",
            colorClass: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20",
        },
        {
            key: "fuel",
            label: "Fuel",
            Icon: Droplets,
            hint: "Out of gas",
            colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
        },
        {
            key: "roadworthy",
            label: "Roadworthy",
            Icon: BadgeCheck,
            hint: "Cert / Renewal",
            colorClass: "text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-500/10 dark:border-indigo-500/20",
        },
        {
            key: "insurance",
            label: "Insurance",
            Icon: ShieldCheck,
            hint: "Quotes / Renew",
            colorClass: "text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20",
        },
        {
            key: "detailing",
            label: "Detailing",
            Icon: Sparkles,
            hint: "Deep Clean / Polish",
            colorClass: "text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-500/10 dark:border-purple-500/20",
        },
        {
            key: "car_wash",
            label: "Car Wash",
            Icon: Droplets,
            hint: "Wash & Vacuum",
            colorClass: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20",
        },
        {
            key: "shop",
            label: "Auto Shop",
            Icon: Store,
            hint: "Parts / Accessories",
            colorClass: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20",
        },
        {
            key: "electrical",
            label: "Electrical",
            Icon: Zap,
            hint: "AC / Wiring",
            colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20",
        },
    ];

/* Geo helpers */
const GEO_ERROR_BLOCKED = "GEO_BLOCKED" as const;
type PermState = "granted" | "prompt" | "denied" | "unknown";

async function checkGeoPermission(): Promise<PermState> {
    if (typeof navigator === "undefined" || !("permissions" in navigator))
        return "unknown";
    try {
        const status = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
        });
        return (status.state as PermState) ?? "unknown";
    } catch {
        return "unknown";
    }
}

function getLocationOnce(): Promise<GeolocationPosition> {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
        return Promise.reject(
            new Error("Geolocation is not supported by your browser.")
        );
    }
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        });
    });
}

/* ───────────────────────────────
   Main Component
   ─────────────────────────────── */
export default function GetHelpWizardPage() {
    const [step, setStep] = useState<StepKey>("help");

    // Location
    const [loc, setLoc] = useState<GeoFix | null>(null);
    const [locBusy, setLocBusy] = useState(false);
    const [locError, setLocError] = useState<string | null>(null);

    // Providers
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [providers, setProviders] = useState<Provider[] | null>(null);

    const form = useForm<HelpForm>({
        resolver: zodResolver(HelpSchema),
        defaultValues: {
            helpType: undefined as unknown as HelpForm["helpType"],
            carMake: "",
            carModel: "",
            carYear: "",
            carColor: "",
            plateNumber: "",
            fullName: "",
            phone: "",
        },
        mode: "onChange",
    });

    const {
        register,
        setValue,
        handleSubmit,
        trigger,
        getValues,
        formState: { isSubmitting, errors },
        watch,
    } = form;

    /* validation snapshots */
    const helpType = watch("helpType");
    const carMake = watch("carMake");
    const carModel = watch("carModel");
    const carYear = watch("carYear");
    const carColor = watch("carColor");
    const plateNumber = watch("plateNumber");
    const fullName = watch("fullName");
    const phone = watch("phone");

    const carSectionValid = useMemo(() => {
        return (
            carMake?.trim().length >= 2 &&
            carModel?.trim().length >= 1 &&
            /^\d{4}$/.test(carYear) &&
            carColor?.trim().length >= 2 &&
            plateNumber?.trim().length >= 2
        );
    }, [carMake, carModel, carYear, carColor, plateNumber]);

    const contactSectionValid = useMemo(() => {
        return fullName?.trim().length >= 2 && /^[0-9+\-\s()]{7,}$/.test(phone);
    }, [fullName, phone]);

    // Logic
    async function lockRequestForProvider(provider: Provider) {
        if (!loc) {
            setLocError("Please share your location so nearby providers can find you.");
            throw new Error("Missing location");
        }

        const values = getValues();
        const details = `Car: ${values.carMake} ${values.carModel} ${values.carYear} (${values.carColor}) • Plate: ${values.plateNumber} `;

        await createRequest({
            helpType: values.helpType,
            driver_name: values.fullName,
            driver_phone: values.phone,
            details,
            address_line: provider.address_line ?? null,
            lat: loc.lat,
            lng: loc.lng,
            provider_id: provider.id,
            status: "pending",
        });

        // Removed unused requestId state
    }

    async function requestLocation() {
        setLocBusy(true);
        setLocError(null);

        try {
            const perm = await checkGeoPermission();
            if (perm === "denied") {
                setLocError(GEO_ERROR_BLOCKED);
                setLoc(null);
                return;
            }
            const pos = await getLocationOnce();
            setLoc({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp,
            });
        } catch (e: unknown) {
            let msg = "Failed to get your location.";
            if (isGeoErrorLike(e)) {
                if (e.code === 1) msg = "You denied the location request.";
                else if (e.code === 2) msg = "Location unavailable.";
                else if (e.code === 3) msg = "Location request timed out.";
                if (e.message && typeof e.message === "string") msg = e.message;
            } else {
                const m = extractErrorMessage(e);
                if (m) msg = m;
            }
            setLocError(msg);
            setLoc(null);
        } finally {
            setLocBusy(false);
        }
    }

    async function onSubmit(values: HelpForm) {
        if (!loc) {
            setLocError("Please share location.");
            return;
        }

        setLoadingProviders(true);
        setProviders(null);

        try {
            const list = await findProvidersNear(values.helpType, loc.lat, loc.lng);
            list.sort((a: Provider, b: Provider) =>
                a.distance_km === b.distance_km
                    ? (b.rating ?? 0) - (a.rating ?? 0)
                    : a.distance_km - b.distance_km
            );
            setProviders(list);
            setStep("providers");
        } catch {
            setProviders([]);
            setStep("providers");
        } finally {
            setLoadingProviders(false);
        }
    }

    async function refreshSearchAgain(
        setLoading: (b: boolean) => void,
        setProvidersList: (p: Provider[]) => void,
        values: HelpForm,
        currentLoc: GeoFix | null
    ) {
        if (!currentLoc) return;
        setLoading(true);
        try {
            const list = await findProvidersNear(
                values.helpType,
                currentLoc.lat,
                currentLoc.lng
            );
            list.sort((a: Provider, b: Provider) =>
                a.distance_km === b.distance_km
                    ? (b.rating ?? 0) - (a.rating ?? 0)
                    : a.distance_km - b.distance_km
            );
            setProvidersList(list);
        } finally {
            setLoading(false);
        }
    }

    const canNext =
        step === "help"
            ? !!helpType
            : step === "car"
                ? carSectionValid
                : step === "contact"
                    ? contactSectionValid && !!loc
                    : false;

    async function onNext() {
        if (step === "help") {
            setStep("car");
            if (typeof window !== "undefined") window.scrollTo(0, 0);
            return;
        }
        if (step === "car") {
            const ok = await trigger([
                "carMake",
                "carModel",
                "carYear",
                "carColor",
                "plateNumber",
            ]);
            if (ok) {
                setStep("contact");
                if (typeof window !== "undefined") window.scrollTo(0, 0);
            }
            return;
        }
        if (step === "contact") {
            await handleSubmit(onSubmit)();
            return;
        }
    }

    function onBack() {
        if (step === "car") setStep("help");
        if (step === "contact") setStep("car");
        if (step === "providers") setStep("contact");
        if (typeof window !== "undefined") window.scrollTo(0, 0);
    }

    // Progress Calculation
    const stepsOrder: StepKey[] = ["help", "car", "contact", "providers"];
    const activeIndex = stepsOrder.indexOf(step);
    const progressPercent = ((activeIndex + 1) / stepsOrder.length) * 100;

    return (
        <main className="min-h-screen bg-background font-sans text-foreground">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-background/90 backdrop-blur-md border-b border-border">
                <div className="mx-auto max-w-lg px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "help" && (
                            <button
                                onClick={onBack}
                                className="p-2 border border-border hover:bg-muted text-muted-foreground transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="ambos-heading text-lg tracking-[0.2em] text-foreground">
                                MOTOR_AMBOS
                            </span>
                            <span className="mono-text text-[10px] text-primary font-bold">
                                {step === "help" && "STRATEGY_NODE: SERVICE_SELECT"}
                                {step === "car" && "STRATEGY_NODE: VEHICLE_INTEL"}
                                {step === "contact" && "STRATEGY_NODE: DEPLOY_LOC"}
                                {step === "providers" && "STRATEGY_NODE: ACTIVE_UNITS"}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Industrial Progress Bar */}
                <div className="h-1 w-full bg-muted">
                    <div
                        className="h-full bg-primary transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="mx-auto w-full max-w-lg px-6 py-12 pb-44">
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* STEP 1: HELP TYPE */}
                    {step === "help" && (
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="ambos-label">PROTOCOL_SELECTION</div>
                                <h1 className="ambos-heading text-4xl md:text-5xl text-foreground">
                                    Define Service <br /> Intervention.
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {HELP_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.key}
                                        onClick={() => setValue("helpType", opt.key, { shouldValidate: true })}
                                        className={cn(
                                            "cursor-pointer group relative flex flex-col items-start justify-between gap-8 border-2 p-6 transition-all duration-300",
                                            helpType === opt.key
                                                ? "border-primary bg-muted/5 shadow-[0_0_30px_-10px_rgba(217,255,0,0.3)]"
                                                : "border-border bg-background hover:border-border/80"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "p-3 border border-border transition-colors",
                                                helpType === opt.key
                                                    ? "bg-primary text-black border-primary"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            )}
                                        >
                                            <opt.Icon size={24} />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <span className="ambos-heading text-xs block">{opt.label}</span>
                                            <span
                                                className={cn(
                                                    "block mono-text text-[9px] tracking-widest",
                                                    helpType === opt.key ? "text-primary font-bold" : "text-muted-foreground"
                                                )}
                                            >
                                                {opt.hint}
                                            </span>
                                        </div>
                                        {helpType === opt.key && (
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary animate-pulse" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CAR DETAILS */}
                    {step === "car" && (
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="ambos-label">VEHICLE_REGISTRATION</div>
                                <h1 className="ambos-heading text-4xl text-foreground">
                                    Asset <br /> Telemetry.
                                </h1>
                            </div>

                            <div className="space-y-6 ambos-card p-8 border-2 bg-background/50">
                                <div className="grid grid-cols-2 gap-6">
                                    <ModernInput
                                        label="MANUFACTURER"
                                        placeholder="TOYOTA"
                                        {...register("carMake")}
                                        error={errors.carMake?.message}
                                    />
                                    <ModernInput
                                        label="MODEL_TYPE"
                                        placeholder="COROLLA"
                                        {...register("carModel")}
                                        error={errors.carModel?.message}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <ModernInput
                                        label="FABRIC_YEAR"
                                        placeholder="2019"
                                        inputMode="numeric"
                                        maxLength={4}
                                        {...register("carYear")}
                                        error={errors.carYear?.message}
                                    />
                                    <ModernInput
                                        label="HUE_CODE"
                                        placeholder="SILVER"
                                        {...register("carColor")}
                                        error={errors.carColor?.message}
                                    />
                                </div>
                                <ModernInput
                                    label="IDENTIFICATION_PLATE"
                                    placeholder="GR-5522-23"
                                    className="uppercase font-bold tracking-[0.2em]"
                                    {...register("plateNumber")}
                                    error={errors.plateNumber?.message}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTACT & LOCATION */}
                    {step === "contact" && (
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="ambos-label">GEOSPATIAL_SYNC</div>
                                <h1 className="ambos-heading text-4xl text-foreground">
                                    Deployment <br /> Coordinates.
                                </h1>
                            </div>

                            <div className="ambos-card p-8 border-2 bg-background/50 space-y-8">
                                <ModernInput
                                    label="OPERATOR_NAME"
                                    placeholder="JOHN DOE"
                                    {...register("fullName")}
                                    error={errors.fullName?.message}
                                />
                                <ModernInput
                                    label="COMMS_LINK"
                                    placeholder="054 123 4567"
                                    inputMode="tel"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                    icon={<Phone size={18} className="text-muted-foreground" />}
                                />
                            </div>

                            {/* Location Card */}
                            <div className="ambos-card p-8 border-2 bg-onyx text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 blur-[100px]" />

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-2 mono-text text-[10px] text-white/50">
                                        <MapPin size={14} className="text-primary" />
                                        <span>SIGNAL_LOCK: {loc ? 'TRUE' : 'FALSE'}</span>
                                    </div>
                                    {loc && (
                                        <span className="ambos-label bg-primary text-black">
                                            LATCHED
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-6 relative z-10">
                                    {loc ? (
                                        <div className="p-6 bg-white/5 border border-white/10">
                                            <div className="mono-text text-[10px] text-white/40 mb-3 font-bold tracking-widest">COORDINATE_DATA</div>
                                            <div className="ambos-heading text-2xl tracking-tighter text-white">
                                                {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)}
                                            </div>
                                            <div className="mono-text text-[9px] text-primary mt-2">
                                                MARGIN_ERROR: ±{Math.round(loc.accuracy || 0)}M
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mono-text text-xs text-white/50 leading-relaxed uppercase tracking-wider">
                                            Geospatial data required for precision matching with nearby mechanic nodes.
                                        </div>
                                    )}

                                    {locError && locError !== GEO_ERROR_BLOCKED && (
                                        <div className="flex items-start gap-4 text-red-400 bg-red-400/10 p-4 border border-red-400/20">
                                            <AlertTriangle size={18} className="shrink-0" />
                                            <span className="mono-text text-[10px] lowercase">{locError}</span>
                                        </div>
                                    )}

                                    {locError === GEO_ERROR_BLOCKED && (
                                        <BlockedLocationHelp onRetry={requestLocation} />
                                    )}

                                    <button
                                        type="button"
                                        onClick={requestLocation}
                                        disabled={locBusy}
                                        className="w-full py-6 ambos-btn-secondary border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                                    >
                                        {locBusy ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : loc ? (
                                            <>
                                                <LocateFixed size={18} /> <span className="mono-text">SYNC_COORD_AGAIN</span>
                                            </>
                                        ) : (
                                            <>
                                                <Navigation size={18} /> <span className="mono-text">REQUEST_GPS_LATCH</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PROVIDERS */}
                    {step === "providers" && (
                        <div className="space-y-12">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="ambos-label">ACTIVE_NODES</div>
                                    <h2 className="ambos-heading text-3xl">Local Grid.</h2>
                                </div>
                                <div className="text-right">
                                    <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">Latency: 12ms</div>
                                    <div className="mono-text text-[10px] text-primary">{loc?.lat.toFixed(4)}, {loc?.lng.toFixed(4)}</div>
                                </div>
                            </div>

                            {loadingProviders && (
                                <div className="py-32 flex flex-col items-center justify-center space-y-8">
                                    <div className="relative">
                                        <div className="h-20 w-20 border border-border animate-spin" />
                                        <Car size={24} className="absolute inset-0 m-auto animate-pulse" />
                                    </div>
                                    <p className="ambos-heading text-sm text-primary animate-pulse">Scanning infrastructure...</p>
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) === 0 && (
                                <div className="py-24 text-center px-8 border border-border bg-muted/5 space-y-8">
                                    <div className="mx-auto h-20 w-20 border border-border flex items-center justify-center opacity-20">
                                        <MapPin size={32} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="ambos-heading text-xl">Node Isolation</h3>
                                        <p className="mono-text text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest">No active service units detected in the current geofence.</p>
                                    </div>
                                    <button onClick={() => setStep("contact")} className="ambos-btn-secondary w-full">REDEFINE_GEOLOC</button>
                                </div>
                            )}

                            {!loadingProviders && providers && providers.length > 0 && loc && (
                                <div className="space-y-8">
                                    {providers.map((p) => (
                                        <ProviderCard
                                            key={p.id}
                                            provider={p}
                                            smsBody={buildSmsBody(getValues(), loc)}
                                            onLockRequest={lockRequestForProvider}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-border z-40">
                <div className="mx-auto max-w-lg">
                    {step !== "providers" ? (
                        <button
                            type="button"
                            disabled={!canNext || isSubmitting || (step === "contact" && loadingProviders)}
                            onClick={onNext}
                            className="ambos-btn-lime w-full h-16 text-sm flex items-center justify-center gap-4 disabled:opacity-20 disabled:grayscale transition-all"
                        >
                            {step === "contact" && (isSubmitting || loadingProviders) ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <span className="ambos-heading tracking-[0.2em]">
                                        {step === "help" && "INITIALIZE_VEHICLE"}
                                        {step === "car" && "SYNC_LOCATION"}
                                        {step === "contact" && "SCAN_NEARBY_NODES"}
                                    </span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            disabled={loadingProviders}
                            onClick={() =>
                                refreshSearchAgain(
                                    setLoadingProviders,
                                    (p) => setProviders(p),
                                    getValues(),
                                    loc
                                )
                            }
                            className="ambos-btn-secondary w-full h-16 flex items-center justify-center gap-4 text-xs"
                        >
                            {loadingProviders ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                "RE-SCAN_NETWORK_INFRASTRUCTURE"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}

/* ───────────────────────────────
   Sub-Components (Refined)
   ─────────────────────────────── */

// Modern Input Wrapper
const ModernInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
    label: string,
    error?: string,
    icon?: React.ReactNode
}>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="mono-text text-[10px] font-bold text-muted-foreground ml-0">{label}</label>
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-14 w-full rounded-none border border-border bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary focus-visible:bg-muted/5 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 uppercase tracking-wider",
                            icon && "pl-12",
                            error && "border-red-500 bg-red-500/5 focus-visible:border-red-500",
                            className
                        )}
                        {...props}
                    />
                    {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">{icon}</div>}
                </div>
                {error && <p className="mono-text text-[10px] font-bold text-red-500">{error}</p>}
            </div>
        )
    }
)
ModernInput.displayName = "ModernInput"


function ProviderCard({
    provider,
    smsBody,
    onLockRequest,
}: {
    provider: Provider;
    smsBody: string;
    onLockRequest?: (provider: Provider) => Promise<void> | void;
}) {
    const telHref = `tel:${provider.phone}`;
    const mapsHref = `https://maps.google.com/?q=${provider.lat},${provider.lng}`;

    const [callDialogOpen, setCallDialogOpen] = useState(false);
    const [smsDialogOpen, setSmsDialogOpen] = useState(false);
    const [locking, setLocking] = useState(false);
    const [lockError, setLockError] = useState<string | null>(null);
    const [sendingSms, setSendingSms] = useState(false);
    const [smsError, setSmsError] = useState<string | null>(null);
    const [showServices, setShowServices] = useState(false);

    const handleCall = async () => {
        try {
            setLocking(true);
            if (onLockRequest) await onLockRequest(provider);
            window.location.href = telHref;
            setCallDialogOpen(false);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Error";
            setLockError(msg);
        } finally {
            setLocking(false);
        }
    };

    const handleSms = async () => {
        try {
            setSendingSms(true);
            if (onLockRequest) await onLockRequest(provider);

            const res = await fetch("/api/send-sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: provider.phone, content: smsBody }),
            });

            if (!res.ok) throw new Error("Failed");
            setSmsDialogOpen(false);
        } catch (e: unknown) {
            setSmsError("Failed to send SMS");
        } finally {
            setSendingSms(false);
        }
    }

    return (
        <>
            <div className="ambos-card p-6 border-2 border-border/50">
                {/* Header with Backdrop */}
                <div className="relative h-32 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
                    {provider.backdrop_url ? (
                        <img
                            src={provider.backdrop_url}
                            alt="Backdrop"
                            className="w-full h-full object-cover grayscale brightness-50"
                        />
                    ) : (
                        <div className="w-full h-full bg-onyx border-b border-border" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                    <a href={mapsHref} target="_blank"
                        className="absolute top-4 right-4 p-3 bg-background border border-border rounded-none text-foreground hover:bg-primary hover:text-black transition-colors z-10">
                        <MapPin size={20} />
                    </a>
                </div>

                {/* Info */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-onyx border border-border flex items-center justify-center shrink-0">
                            {provider.logo_url ? (
                                <img src={provider.logo_url} alt={provider.name} className="h-full w-full object-cover grayscale" />
                            ) : (
                                <span className="ambos-heading text-xl">{provider.name.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="ambos-heading text-lg flex items-center gap-2">
                                {provider.name}
                                {provider.is_verified && <BadgeCheck size={18} className="text-primary" />}
                            </h3>
                            <div className="flex items-center gap-4 mono-text text-[10px] text-muted-foreground mt-1">
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star size={12} className="fill-current" /> {provider.rating?.toFixed(1) || "NEW_NODE"}
                                </span>
                                <span>•</span>
                                <span>{provider.distance_km.toFixed(1)}KM_RADIUS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {provider.min_callout_fee != null && (
                        <div className="ambos-label bg-muted text-muted-foreground">FEE: GH₵{provider.min_callout_fee}</div>
                    )}
                    {provider.coverage_radius_km != null && (
                        <div className="ambos-label bg-muted text-muted-foreground">RANGE: {provider.coverage_radius_km}KM</div>
                    )}
                </div>

                {/* Services Toggle */}
                {provider.services.length > 0 && (
                    <div className="mb-6">
                        <button onClick={() => setShowServices(!showServices)}
                            className="flex items-center gap-4 mono-text text-[10px] text-muted-foreground hover:text-primary transition-colors w-full border-t border-border pt-4">
                            <span className="flex-1 text-left">{showServices ? 'HIDE' : 'EXPAND'} {provider.services.length} SERVICE_PROTOCOLS</span>
                            <ChevronDown size={14} className={cn("transition-transform", showServices && "rotate-180")} />
                        </button>

                        {showServices && (
                            <div className="mt-4 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                                {provider.services.map(s => (
                                    <div key={s.code} className="flex justify-between items-center p-3 border border-border bg-muted/5">
                                        <span className="mono-text text-[10px] font-bold text-foreground">{s.name}</span>
                                        <span className="mono-text text-[10px] text-primary">
                                            {s.price ? `GH₵${s.price}` : 'VARIABLE_RATE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setCallDialogOpen(true)} className="ambos-btn-secondary py-3 text-xs w-full">
                        <Phone size={14} className="inline mr-2" /> CALL
                    </button>
                    <button onClick={() => setSmsDialogOpen(true)} className="ambos-btn-lime py-3 text-xs w-full">
                        <MessageCircle size={14} className="inline mr-2" /> SEND_INFO
                    </button>
                </div>

                {/* Modals with industrial styling */}
                <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
                    <DialogContent className="rounded-none bg-background border-2 border-border max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="ambos-heading">INITIALIZE_CALL</DialogTitle>
                            <DialogDescription className="mono-text text-[10px] uppercase pt-2">Authorize communication protocol with service provider.</DialogDescription>
                        </DialogHeader>
                        {lockError && <p className="mono-text text-red-500 text-[10px]">{lockError}</p>}
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setCallDialogOpen(false)} className="ambos-btn-secondary flex-1 py-4 text-xs">CANCEL</button>
                            <button onClick={handleCall} disabled={locking} className="ambos-btn-lime flex-1 py-4 text-xs font-bold">
                                {locking ? <Loader2 size={16} className="animate-spin mx-auto" /> : "EXECUTE"}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
                    <DialogContent className="rounded-none bg-background border-2 border-border max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="ambos-heading">DATA_TRANSMISSION</DialogTitle>
                            <DialogDescription className="mono-text text-[10px] uppercase pt-2">Transmit telemetry and location data to {provider.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted/10 p-4 border border-border mono-text text-[10px] text-muted-foreground my-4 break-words">
                            {smsBody}
                        </div>
                        {smsError && <p className="mono-text text-red-500 text-[10px]">{smsError}</p>}
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setSmsDialogOpen(false)} className="ambos-btn-secondary flex-1 py-4 text-xs">ABORT</button>
                            <button onClick={handleSms} disabled={sendingSms} className="ambos-btn-lime flex-1 py-4 text-xs font-bold">
                                {sendingSms ? <Loader2 size={16} className="animate-spin mx-auto" /> : "TRANSMIT"}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

function BlockedLocationHelp({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="mt-4 p-6 bg-red-400/10 text-red-400 border border-red-400/20 space-y-4">
            <div className="ambos-heading text-xs flex items-center gap-2">
                <AlertTriangle size={16} /> Signal Blocked
            </div>
            <p className="mono-text text-[10px] uppercase leading-relaxed tracking-widest">Enable location services in browser settings to initialize grid synchronization.</p>
            <button onClick={onRetry} className="ambos-btn-lime w-full text-[10px] py-3">RETRY_SYNC</button>
        </div>
    )
}

/* helpers */
function buildSmsBody(values: HelpForm, loc: GeoFix) {
    const mapsLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const helpType = values.helpType.replace(/_/g, " ").toUpperCase();
    return `Need ${helpType} help. Car: ${values.carMake} ${values.carModel} (${values.plateNumber}). Loc: ${mapsLink} ${values.phone}`;
}