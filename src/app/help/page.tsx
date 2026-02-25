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
        <main className="min-h-screen bg-background font-sans text-foreground relative overflow-hidden selection:bg-primary selection:text-black">
            <div className="card-circle opacity-30" />
            <div className="mesh-bg absolute inset-0 pointer-events-none opacity-40" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full glass-nav border-b border-white/5">
                <div className="mx-auto max-w-lg px-8 h-24 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        {step !== "help" && (
                            <button
                                onClick={onBack}
                                className="p-3 border border-white/10 bg-white/5 text-foreground hover:bg-primary hover:text-black transition-all rounded-xl group"
                            >
                                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        )}
                        <div className="flex flex-col space-y-1">
                            <span className="ambos-heading text-xl tracking-[0.3em] text-foreground">
                                MOTOR_AMBOS
                            </span>
                            <span className="mono-text text-[9px] text-primary font-black tracking-[0.2em] uppercase">
                                {step === "help" && "DEPLOYMENT: SERVICE_SELECT_v4.2"}
                                {step === "car" && "DEPLOYMENT: VEHICLE_INTEL_v4.2"}
                                {step === "contact" && "DEPLOYMENT: GEOSPATIAL_v4.2"}
                                {step === "providers" && "DEPLOYMENT: ACTIVE_UNITS_v4.2"}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Industrial Progress Bar */}
                <div className="h-[1px] w-full bg-white/5">
                    <div
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_20px_#CEFF00]"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="mx-auto w-full max-w-lg px-6 py-12 pb-44 relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* STEP 1: HELP TYPE */}
                    {step === "help" && (
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="ambos-label">PROTOCOL_SELECTION</div>
                                <h1 className="ambos-heading text-5xl md:text-6xl text-foreground text-glow leading-[0.85]">
                                    DEFINE_SERVICE <br />
                                    <span className="text-primary italic">INTERVENTION.</span>
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {HELP_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.key}
                                        onClick={() => setValue("helpType", opt.key, { shouldValidate: true })}
                                        className={cn(
                                            "cursor-pointer group relative flex flex-col items-start justify-between gap-8 border p-8 transition-all duration-500 rounded-[2rem] backdrop-blur-3xl",
                                            helpType === opt.key
                                                ? "border-primary/40 bg-primary/10 shadow-[0_0_40px_-10px_rgba(206,255,0,0.3)]"
                                                : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center transition-all duration-500 rounded-2xl border",
                                                helpType === opt.key
                                                    ? "bg-primary text-black border-primary text-glow shadow-[0_0_20px_rgba(206,255,0,0.4)]"
                                                    : "bg-zinc-900 text-muted-foreground border-white/10 group-hover:text-foreground group-hover:border-white/20"
                                            )}
                                        >
                                            <opt.Icon size={20} />
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <span className="ambos-heading text-xs block tracking-widest uppercase">{opt.label}</span>
                                            <span
                                                className={cn(
                                                    "block mono-text text-[9px] tracking-[0.2em] font-black uppercase",
                                                    helpType === opt.key ? "text-primary opacity-100" : "text-muted-foreground opacity-40"
                                                )}
                                            >
                                                {opt.hint}
                                            </span>
                                        </div>
                                        {helpType === opt.key && (
                                            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#CEFF00]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CAR DETAILS */}
                    {step === "car" && (
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="ambos-label">VEHICLE_REGISTRATION</div>
                                <h1 className="ambos-heading text-5xl text-foreground text-glow text-balance leading-[0.85]">
                                    ASSET_TELEMETRY.
                                </h1>
                            </div>

                            <div className="ambos-card p-12 space-y-10 bg-white/[0.02] border-white/5 backdrop-blur-3xl transition-all duration-700 hover:border-primary/20">
                                <div className="grid grid-cols-2 gap-8">
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
                                <div className="grid grid-cols-2 gap-8">
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
                                <div className="pt-6 border-t border-white/5">
                                    <ModernInput
                                        label="IDENTIFICATION_PLATE"
                                        placeholder="GR-5522-23"
                                        className="uppercase font-black tracking-[0.4em] bg-primary/[0.05] text-2xl py-8 h-20 border-primary/20"
                                        {...register("plateNumber")}
                                        error={errors.plateNumber?.message}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTACT & LOCATION */}
                    {step === "contact" && (
                        <div className="space-y-12">
                            <div className="space-y-8">
                                <div className="ambos-label">GEOSPATIAL_SYNC</div>
                                <h1 className="ambos-heading text-5xl text-foreground text-glow leading-[0.85]">
                                    RESCUE_COORDINATES.
                                </h1>
                            </div>

                            <div className="ambos-card p-12 space-y-10 bg-white/[0.02] border-white/5 backdrop-blur-3xl transition-all duration-700 hover:border-primary/20">
                                <ModernInput
                                    label="OPERATOR_NAME"
                                    placeholder="JOHN_DOE"
                                    {...register("fullName")}
                                    error={errors.fullName?.message}
                                />
                                <ModernInput
                                    label="COMMS_LINK"
                                    placeholder="054 123 4567"
                                    inputMode="tel"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                    icon={<Phone size={18} className="text-primary/60" />}
                                />
                            </div>

                            {/* Location Card */}
                            <div className="ambos-card p-12 bg-zinc-900 border-white/5 relative overflow-hidden group transition-all duration-700 hover:border-primary/30">
                                <div className="absolute top-0 right-0 h-64 w-64 bg-primary/[0.04] blur-[100px] pointer-events-none group-hover:bg-primary/[0.1] transition-all duration-1000" />
                                <div className="card-circle opacity-10 -bottom-1/2 -right-1/4" />

                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div className="flex items-center gap-4 mono-text text-[10px] text-white/50 tracking-[0.3em] font-black uppercase">
                                        <MapPin size={16} className="text-primary animate-pulse" />
                                        <span>SIGNAL_LOCK: {loc ? 'TRUE' : 'FALSE'}</span>
                                    </div>
                                    {loc && (
                                        <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full shadow-[0_0_15px_rgba(206,255,0,0.1)]">
                                            <span className="mono-text text-[9px] text-primary font-black tracking-widest uppercase">LATCHED</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-10 relative z-10">
                                    {loc ? (
                                        <div className="p-10 bg-white/[0.03] border border-white/5 rounded-[2rem] relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
                                            <div className="mono-text text-[10px] text-white/40 mb-6 font-black tracking-[0.4em] uppercase">COORDINATE_READOUT</div>
                                            <div className="ambos-heading text-4xl tracking-tighter text-white">
                                                {loc.lat.toFixed(6)} <br />
                                                <span className="text-primary">{loc.lng.toFixed(6)}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mono-text text-[9px] text-primary mt-6 font-black tracking-widest uppercase">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                                MARGIN_ERROR: ±{Math.round(loc.accuracy || 0)}M
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mono-text text-[11px] text-white/40 leading-relaxed uppercase tracking-[0.4em] font-black border-l-2 border-primary/20 pl-8">
                                            Geospatial data required for precision matching with nearby mechanic nodes.
                                        </div>
                                    )}

                                    {locError && locError !== GEO_ERROR_BLOCKED && (
                                        <div className="flex items-start gap-6 text-red-500 bg-red-500/5 p-8 border border-red-500/10 rounded-[2rem]">
                                            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                            <span className="mono-text text-[10px] uppercase tracking-[0.2em] font-black leading-relaxed">{locError}</span>
                                        </div>
                                    )}

                                    {locError === GEO_ERROR_BLOCKED && (
                                        <BlockedLocationHelp onRetry={requestLocation} />
                                    )}

                                    <button
                                        type="button"
                                        onClick={requestLocation}
                                        disabled={locBusy}
                                        className="w-full py-10 rounded-[2rem] border border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-center gap-5 group/btn overflow-hidden relative shadow-2xl"
                                    >
                                        <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                                        <div className="relative z-10 flex items-center gap-5">
                                            {locBusy ? (
                                                <Loader2 size={24} className="animate-spin text-primary group-hover/btn:text-black" />
                                            ) : loc ? (
                                                <>
                                                    <LocateFixed size={24} className="group-hover/btn:scale-110 transition-transform" /> <span className="ambos-heading text-sm tracking-[0.4em] font-black">REFRESH_SYNC</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Navigation size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> <span className="ambos-heading text-sm tracking-[0.4em] font-black">REQUEST_GPS_LATCH</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PROVIDERS */}
                    {step === "providers" && (
                        <div className="space-y-12">
                            <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="ambos-label">ACTIVE_NODES</div>
                                    <h2 className="ambos-heading text-4xl text-glow text-white tracking-widest uppercase">Grid_Results.</h2>
                                </div>
                                <div className="text-right">
                                    <div className="mono-text text-[10px] text-primary/40 uppercase tracking-[0.2em] font-black">Latency: 12ms</div>
                                    <div className="mono-text text-[10px] text-primary font-black tracking-widest uppercase mt-2 border-b border-primary/20 pb-1">{loc?.lat.toFixed(4)}, {loc?.lng.toFixed(4)}</div>
                                </div>
                            </div>

                            {loadingProviders && (
                                <div className="py-44 flex flex-col items-center justify-center space-y-12">
                                    <div className="relative">
                                        <div className="h-32 w-32 border border-white/5 rounded-full animate-spin border-t-primary shadow-[0_0_30px_rgba(206,255,0,0.2)]" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Car size={36} className="text-primary animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="ambos-heading text-xs text-primary animate-pulse tracking-[0.5em] font-black uppercase">SCANNING_INFRASTRUCTURE...</p>
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) === 0 && (
                                <div className="py-32 text-center px-12 ambos-card bg-white/[0.02] border-white/5 rounded-[2rem] space-y-12 backdrop-blur-3xl">
                                    <div className="mx-auto h-24 w-24 border border-white/10 flex items-center justify-center rounded-[1.5rem] bg-zinc-900 group">
                                        <MapPin size={36} className="text-white/20 group-hover:text-primary transition-colors duration-500" />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="ambos-heading text-2xl text-white tracking-tighter uppercase">NODE_ISOLATION.</h3>
                                        <p className="mono-text text-[11px] text-white/40 leading-relaxed uppercase tracking-[0.3em] font-black max-w-xs mx-auto">No active service units detected within current geofence infrastructure.</p>
                                    </div>
                                    <button onClick={() => setStep("contact")} className="ambos-btn-secondary w-full py-8 !text-sm">REDEFINE_GEOLOC</button>
                                </div>
                            )}

                            {!loadingProviders && providers && providers.length > 0 && loc && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
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
            <div className="fixed bottom-0 left-0 right-0 p-8 glass-nav border-t border-white/5 z-50">
                <div className="mx-auto max-w-lg">
                    {step !== "providers" ? (
                        <button
                            type="button"
                            disabled={!canNext || isSubmitting || (step === "contact" && loadingProviders)}
                            onClick={onNext}
                            className="ambos-btn-lime w-full h-22 !rounded-[2.5rem] text-sm flex items-center justify-center gap-6 disabled:opacity-20 disabled:grayscale transition-all duration-700 relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(206,255,0,0.3)]"
                        >
                            {step === "contact" && (isSubmitting || loadingProviders) ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <span className="ambos-heading tracking-[0.4em] text-lg font-black uppercase">
                                        {step === "help" && "INITIALIZE_VEHICLE"}
                                        {step === "car" && "SYNC_LOCATION"}
                                        {step === "contact" && "SCAN_RESULTS"}
                                    </span>
                                    <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
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
                            className="w-full h-22 bg-zinc-950 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-center gap-6 rounded-[2.5rem] mono-text font-black tracking-[0.4em] text-xs uppercase group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 flex items-center gap-6">
                                {loadingProviders ? (
                                    <Loader2 size={24} className="animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Zap size={24} className="text-primary group-hover:text-black transition-colors" />
                                        <span>RE-SCAN_INFRASTRUCTURE</span>
                                    </>
                                )}
                            </div>
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
            <div className="space-y-3">
                <label className="mono-text text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">{label}</label>
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-16 w-full rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 text-sm text-foreground placeholder:text-white/20 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:bg-primary/[0.02] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-500 uppercase tracking-widest font-medium",
                            icon && "pl-14",
                            error && "border-red-500/50 bg-red-500/[0.02] focus-visible:border-red-500",
                            className
                        )}
                        {...props}
                    />
                    {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-primary transition-all">{icon}</div>}
                </div>
                {error && <p className="mono-text text-[10px] font-black text-red-500/80 tracking-widest uppercase">{error}</p>}
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
            <div className="ambos-card p-10 border border-white/10 bg-white/[0.01] backdrop-blur-3xl transition-all duration-700 hover:border-primary/40 group/card">
                {/* Header with Backdrop */}
                <div className="relative h-44 -mx-10 -mt-10 mb-10 overflow-hidden bg-zinc-950">
                    {provider.backdrop_url ? (
                        <img
                            src={provider.backdrop_url}
                            alt="Backdrop"
                            className="w-full h-full object-cover grayscale brightness-50 group-hover/card:scale-110 transition-transform duration-1000"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 border-b border-white/5 relative">
                            <div className="absolute inset-0 bg-primary/5 mesh-bg opacity-30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />

                    <a href={mapsHref} target="_blank"
                        className="absolute top-6 right-6 p-4 bg-background/80 backdrop-blur-md border border-white/10 rounded-2xl text-foreground hover:bg-primary hover:text-black transition-all duration-500 z-10 shadow-2xl">
                        <MapPin size={22} />
                    </a>

                    <div className="absolute bottom-6 left-8 flex items-center gap-6 z-10">
                        <div className="h-20 w-20 bg-zinc-900 border-2 border-white/10 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-2xl group-hover/card:border-primary/40 transition-colors duration-500">
                            {provider.logo_url ? (
                                <img src={provider.logo_url} alt={provider.name} className="h-full w-full object-cover grayscale" />
                            ) : (
                                <span className="ambos-heading text-3xl text-white/20">{provider.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3 className="ambos-heading text-2xl text-white tracking-tighter flex items-center gap-3">
                                {provider.name.toUpperCase()}
                                {provider.is_verified && <BadgeCheck size={20} className="text-primary" />}
                            </h3>
                            <div className="flex items-center gap-4 mono-text text-[10px] text-white/40 font-black tracking-widest uppercase">
                                <span className="flex items-center gap-2 text-primary">
                                    <Star size={14} className="fill-current" /> {provider.rating?.toFixed(1) || "NEW_NODE"}
                                </span>
                                <span className="text-white/10">•</span>
                                <span>{provider.distance_km.toFixed(1)}KM_RADIUS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Chips */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {provider.min_callout_fee != null && (
                        <div className="ambos-label !bg-white/5 !border-white/10 !text-white/60">FEE: GH₵{provider.min_callout_fee}</div>
                    )}
                    {provider.coverage_radius_km != null && (
                        <div className="ambos-label !bg-white/5 !border-white/10 !text-white/60">RANGE: {provider.coverage_radius_km}KM</div>
                    )}
                </div>

                {/* Services Toggle */}
                {provider.services.length > 0 && (
                    <div className="mb-10">
                        <button onClick={() => setShowServices(!showServices)}
                            className="flex items-center gap-4 mono-text text-[10px] text-white/30 hover:text-primary transition-all duration-500 w-full border-t border-white/5 pt-6 font-black tracking-[0.3em] uppercase group/expand">
                            <span className="flex-1 text-left">{showServices ? 'HALT' : 'EXPAND'} {provider.services.length} SERVICE_PROTOCOLS</span>
                            <ChevronDown size={14} className={cn("transition-transform duration-500", showServices && "rotate-180")} />
                        </button>

                        {showServices && (
                            <div className="mt-6 space-y-2 animate-in slide-in-from-top-4 duration-500">
                                {provider.services.map(s => (
                                    <div key={s.code} className="flex justify-between items-center p-4 border border-white/5 bg-white/[0.02] rounded-xl hover:border-primary/20 transition-all">
                                        <span className="mono-text text-[10px] font-black text-white/60 tracking-widest uppercase">{s.name}</span>
                                        <span className="mono-text text-[11px] text-primary font-black tracking-widest">
                                            {s.price ? `GH₵${s.price}` : 'VARIABLE_RATE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                    <button onClick={() => setCallDialogOpen(true)} className="ambos-btn-secondary !py-6 !text-xs !tracking-[0.4em] font-black w-full uppercase">
                        <Phone size={14} className="inline mr-3" /> CALL_NODE
                    </button>
                    <button onClick={() => setSmsDialogOpen(true)} className="ambos-btn-lime !py-6 !text-xs !tracking-[0.4em] font-black w-full uppercase">
                        <MessageCircle size={14} className="inline mr-3" /> DATA_LINK
                    </button>
                </div>

                {/* Modals with industrial styling */}
                <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
                    <DialogContent className="rounded-[2rem] bg-zinc-900/95 backdrop-blur-3xl border-2 border-white/10 max-w-sm p-10 overflow-hidden relative selection:bg-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                        <DialogHeader className="space-y-4">
                            <div className="ambos-label mx-auto">INITIALIZE_CALL</div>
                            <DialogTitle className="ambos-heading text-3xl text-white tracking-tighter text-center uppercase">SYNC_PROTOCOL.</DialogTitle>
                            <DialogDescription className="mono-text text-[10px] uppercase pt-2 text-white/40 leading-relaxed tracking-widest text-center font-black">Authorize secure communication protocol <br /> with service node infrastructure.</DialogDescription>
                        </DialogHeader>
                        {lockError && <p className="mono-text text-red-500 text-[10px] text-center font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-xl border border-red-500/10 mt-6">{lockError}</p>}
                        <div className="flex gap-6 mt-12">
                            <button onClick={() => setCallDialogOpen(false)} className="ambos-btn-secondary flex-1 !py-6 !text-xs !tracking-[0.4em] font-black uppercase">ABORT</button>
                            <button onClick={handleCall} disabled={locking} className="ambos-btn-lime flex-1 !py-6 !text-xs !tracking-[0.4em] font-black uppercase">
                                {locking ? <Loader2 size={18} className="animate-spin mx-auto" /> : "EXECUTE"}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
                    <DialogContent className="rounded-[2rem] bg-zinc-900/95 backdrop-blur-3xl border-2 border-white/10 max-w-md p-10 overflow-hidden relative selection:bg-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl" />
                        <DialogHeader className="space-y-4">
                            <div className="ambos-label mx-auto">DATA_TRANSMISSION</div>
                            <DialogTitle className="ambos-heading text-3xl text-white tracking-tighter text-center uppercase">TELEMETRY_LINK.</DialogTitle>
                            <DialogDescription className="mono-text text-[10px] uppercase pt-2 text-white/40 leading-relaxed tracking-widest text-center font-black">Transmit asset telemetry & geospatial <br /> coordinates to {provider.name.toUpperCase()}.</DialogDescription>
                        </DialogHeader>
                        <div className="bg-zinc-950 p-8 border border-white/5 mono-text text-[10px] text-primary/70 my-8 break-words rounded-2xl leading-relaxed tracking-widest font-black relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
                            {smsBody}
                        </div>
                        {smsError && <p className="mono-text text-red-500 text-[10px] text-center font-black uppercase tracking-widest bg-red-500/5 p-4 rounded-xl border border-red-500/10 mb-6">{smsError}</p>}
                        <div className="flex gap-6">
                            <button onClick={() => setSmsDialogOpen(false)} className="ambos-btn-secondary flex-1 !py-6 !text-xs !tracking-[0.4em] font-black uppercase">ABORT</button>
                            <button onClick={handleSms} disabled={sendingSms} className="ambos-btn-lime flex-1 !py-6 !text-xs !tracking-[0.4em] font-black uppercase">
                                {sendingSms ? <Loader2 size={18} className="animate-spin mx-auto" /> : "TRANSMIT"}
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
        <div className="mt-8 p-10 bg-red-400/[0.03] text-red-400 border border-red-400/20 space-y-8 rounded-[2rem] backdrop-blur-3xl animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center border border-red-400/20">
                    <AlertTriangle size={20} />
                </div>
                <div className="ambos-heading text-lg tracking-widest uppercase">SIGNAL_BLOCK_v4.2</div>
            </div>
            <p className="mono-text text-[10px] uppercase leading-relaxed tracking-[0.3em] font-black border-l-2 border-red-400/20 pl-6">
                Enable location services in your system configuration <br /> to initialize grid synchronization protocol.
            </p>
            <button onClick={onRetry} className="ambos-btn-lime !bg-red-400 !text-white !border-none w-full !text-[11px] !py-6 !tracking-[0.4em] font-black uppercase">RETRY_SYNC</button>
        </div>
    )
}

/* helpers */
function buildSmsBody(values: HelpForm, loc: GeoFix) {
    const mapsLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const helpType = values.helpType.replace(/_/g, " ").toUpperCase();
    return `Need ${helpType} help. Car: ${values.carMake} ${values.carModel} (${values.plateNumber}). Loc: ${mapsLink} ${values.phone}`;
}