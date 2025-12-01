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
import {
    Car,
    ArrowRight,
    ChevronLeft,
    AlertTriangle,
    BatteryCharging,
    Disc,
    Droplets,
    Truck,
    Phone,
    MapPin,
    Star,
    Loader2,
    BadgeCheck,
    MessageCircle,
    ChevronDown,
    Navigation,
    LocateFixed,
} from "lucide-react";

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
    helpType: z.enum(["battery", "tire", "oil", "tow", "rescue", "fuel"]),
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
};

const HELP_OPTIONS: Array<{
    key: HelpForm["helpType"];
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    hint: string;
    colorClass: string;
}> = [
        {
            key: "battery",
            label: "Battery",
            Icon: BatteryCharging,
            hint: "Jumpstart / Replace",
            colorClass: "text-orange-500 bg-orange-50 border-orange-100",
        },
        {
            key: "tire",
            label: "Flat Tyre",
            Icon: Disc,
            hint: "Change / Pump",
            colorClass: "text-slate-500 bg-slate-50 border-slate-100",
        },
        {
            key: "oil",
            label: "Engine Oil",
            Icon: Droplets,
            hint: "Top-up / Leak",
            colorClass: "text-amber-600 bg-amber-50 border-amber-100",
        },
        {
            key: "tow",
            label: "Towing",
            Icon: Truck,
            hint: "Move Vehicle",
            colorClass: "text-blue-600 bg-blue-50 border-blue-100",
        },
        {
            key: "rescue",
            label: "Rescue",
            Icon: AlertTriangle,
            hint: "Stuck / Accident",
            colorClass: "text-red-600 bg-red-50 border-red-100",
        },
        {
            key: "fuel",
            label: "Fuel",
            Icon: Droplets,
            hint: "Out of gas",
            colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
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
            <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {step !== "help" && (
                            <button
                                onClick={onBack}
                                className="mr-1 -ml-2 p-2 rounded-full hover:bg-muted text-muted-foreground"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">
                                Motor Ambos
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                {step === "help" && "Step 1: Request"}
                                {step === "car" && "Step 2: Vehicle"}
                                {step === "contact" && "Step 3: Location"}
                                {step === "providers" && "Nearby Help"}
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-foreground transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}% ` }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="mx-auto w-full max-w-lg px-4 py-6 pb-32">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* STEP 1: HELP TYPE */}
                    {step === "help" && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    How can we help?
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Select the service you need right now.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {HELP_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.key}
                                        onClick={() => setValue("helpType", opt.key, { shouldValidate: true })}
                                        className={cn(
                                            "cursor-pointer relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center transition-all duration-200 active:scale-95",
                                            helpType === opt.key
                                                ? "border-foreground bg-foreground text-background shadow-lg"
                                                : "border-transparent bg-card text-muted-foreground shadow-sm hover:bg-muted/50 hover:border-border"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "rounded-xl p-3 transition-colors",
                                                helpType === opt.key
                                                    ? "bg-background/10 text-background"
                                                    : opt.colorClass
                                            )}
                                        >
                                            <opt.Icon className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="block text-sm font-bold">{opt.label}</span>
                                            <span
                                                className={cn(
                                                    "block text-[10px] opacity-80",
                                                    helpType === opt.key ? "text-background/70" : "text-muted-foreground"
                                                )}
                                            >
                                                {opt.hint}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CAR DETAILS */}
                    {step === "car" && (
                        <div className="space-y-6">
                            <div className="space-y-2 mb-6">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Vehicle Details
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Help the provider identify your car.
                                </p>
                            </div>

                            <div className="space-y-4 bg-card p-5 rounded-3xl shadow-sm border border-border">
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput
                                        label="Make"
                                        placeholder="Toyota"
                                        {...register("carMake")}
                                        error={errors.carMake?.message}
                                    />
                                    <ModernInput
                                        label="Model"
                                        placeholder="Corolla"
                                        {...register("carModel")}
                                        error={errors.carModel?.message}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput
                                        label="Year"
                                        placeholder="2019"
                                        inputMode="numeric"
                                        maxLength={4}
                                        {...register("carYear")}
                                        error={errors.carYear?.message}
                                    />
                                    <ModernInput
                                        label="Color"
                                        placeholder="Silver"
                                        {...register("carColor")}
                                        error={errors.carColor?.message}
                                    />
                                </div>
                                <ModernInput
                                    label="License Plate"
                                    placeholder="GR-5522-23"
                                    className="uppercase"
                                    {...register("plateNumber")}
                                    error={errors.plateNumber?.message}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTACT & LOCATION */}
                    {step === "contact" && (
                        <div className="space-y-6">
                            <div className="space-y-2 mb-6">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Contact & Location
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Where should we send help?
                                </p>
                            </div>

                            <div className="bg-card p-5 rounded-3xl shadow-sm border border-border space-y-4">
                                <ModernInput
                                    label="Your Name"
                                    placeholder="John Doe"
                                    {...register("fullName")}
                                    error={errors.fullName?.message}
                                />
                                <ModernInput
                                    label="Phone Number"
                                    placeholder="054 123 4567"
                                    inputMode="tel"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>

                            {/* Location Card */}
                            <div className="relative overflow-hidden bg-foreground rounded-3xl p-5 shadow-lg text-background">
                                <div
                                    className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-background/10 blur-2xl"></div>

                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center gap-2 text-background/80 text-sm font-medium">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>Current Location</span>
                                    </div>
                                    {loc && (
                                        <span
                                            className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold uppercase rounded-full border border-primary/30">
                                            Acquired
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {loc ? (
                                        <div
                                            className="p-3 bg-background/10 rounded-xl border border-background/5 backdrop-blur-sm">
                                            <div
                                                className="text-xs text-background/60 uppercase tracking-wider font-bold mb-1">Coordinates
                                            </div>
                                            <div className="font-mono text-lg tracking-tight">
                                                {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                                            </div>
                                            <div className="text-[10px] text-background/60 mt-1">
                                                Accuracy: ±{Math.round(loc.accuracy || 0)}m
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-background/80 leading-relaxed">
                                            We need your location to match you with the nearest mechanics.
                                        </div>
                                    )}

                                    {locError && locError !== GEO_ERROR_BLOCKED && (
                                        <div
                                            className="flex items-start gap-2 text-red-300 text-xs bg-red-950/30 p-2 rounded-lg border border-red-500/20">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />
                                            <span>{locError}</span>
                                        </div>
                                    )}

                                    {locError === GEO_ERROR_BLOCKED && (
                                        <BlockedLocationHelp onRetry={requestLocation} />
                                    )}

                                    <Button
                                        type="button"
                                        onClick={requestLocation}
                                        disabled={locBusy}
                                        className="w-full h-12 bg-background text-foreground hover:bg-muted font-bold rounded-xl transition-all active:scale-95"
                                    >
                                        {locBusy ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : loc ? (
                                            <>
                                                <LocateFixed className="mr-2 h-4 w-4" /> Update Location
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="mr-2 h-4 w-4" /> Share Location
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PROVIDERS */}
                    {step === "providers" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg font-bold text-foreground">Nearby Help</h2>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>Within 15km</span>
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
                                    <span>{loc?.lat.toFixed(2)}, {loc?.lng.toFixed(2)}</span>
                                </div>
                            </div>

                            {loadingProviders && (
                                <div
                                    className="py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                    <div className="relative">
                                        <div
                                            className="h-12 w-12 rounded-full border-4 border-muted border-t-foreground animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Car className="h-4 w-4 text-foreground" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">Scanning network...</p>
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) === 0 && (
                                <div
                                    className="py-16 text-center px-6 bg-card rounded-3xl border border-border shadow-sm">
                                    <div
                                        className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <MapPin className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">No providers nearby</h3>
                                    <p className="text-sm text-muted-foreground mb-6">We couldn&apos;t find any active partners
                                        in your immediate area right now.</p>
                                    <Button variant="outline" onClick={() => setStep("contact")}>Change
                                        Location</Button>
                                </div>
                            )}

                            {!loadingProviders && providers && providers.length > 0 && loc && (
                                <div className="space-y-4">
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
            <div
                className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-40">
                <div className="mx-auto max-w-lg">
                    {step !== "providers" ? (
                        <Button
                            type="button"
                            disabled={!canNext || isSubmitting || (step === "contact" && loadingProviders)}
                            onClick={onNext}
                            className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-foreground/10 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                        >
                            {step === "contact" && (isSubmitting || loadingProviders) ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {step === "help" && "Continue to Vehicle"}
                                    {step === "car" && "Continue to Location"}
                                    {step === "contact" && "Find Providers"}
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            disabled={loadingProviders}
                            onClick={() =>
                                refreshSearchAgain(
                                    setLoadingProviders,
                                    (p) => setProviders(p),
                                    getValues(),
                                    loc
                                )
                            }
                            className="w-full h-12 rounded-xl border-border text-muted-foreground"
                        >
                            {loadingProviders ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Refresh Results"
                            )}
                        </Button>
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
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">{label}</label>
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:bg-card disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            icon && "pl-10",
                            error && "border-destructive bg-destructive/10 focus-visible:border-destructive",
                            className
                        )}
                        {...props}
                    />
                    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
                </div>
                {error && <p className="text-[11px] font-medium text-red-500 ml-1">{error}</p>}
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
    const telHref = `tel:${provider.phone} `;
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
            // e is unused here, which caused a warning. We can log it or just set standard msg.
            setSmsError("Failed to send SMS");
        } finally {
            setSendingSms(false);
        }
    }

    return (
        <>
            <div
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all active:scale-[0.99]">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-lg font-bold">
                            {provider.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1">
                                {provider.name}
                                {provider.is_verified && <BadgeCheck className="h-4 w-4 text-sky-500 fill-sky-500/10" />}
                            </h3>
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                    <Star className="h-3 w-3 fill-current" /> {provider.rating?.toFixed(1) || "New"}
                                </span>
                                <span>•</span>
                                <span>{provider.distance_km.toFixed(1)} km away</span>
                            </div>
                        </div>
                    </div>
                    <a href={mapsHref} target="_blank"
                        className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors">
                        <MapPin className="h-5 w-5" />
                    </a>
                </div>

                {/* Info Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {provider.min_callout_fee != null && (
                        <span
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                            Fee: GH₵{provider.min_callout_fee}
                        </span>
                    )}
                    {provider.coverage_radius_km != null && (
                        <span
                            className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-100">
                            Range: {provider.coverage_radius_km}km
                        </span>
                    )}
                </div>

                {/* Services Toggle */}
                {provider.services.length > 0 && (
                    <div className="mb-5">
                        <button onClick={() => setShowServices(!showServices)}
                            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors w-full py-1">
                            <span
                                className="flex-1 text-left">{showServices ? 'Hide' : 'View'} {provider.services.length} services & pricing</span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", showServices && "rotate-180")} />
                        </button>

                        {showServices && (
                            <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {provider.services.map(s => (
                                    <div key={s.code}
                                        className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <span className="font-medium text-slate-700">{s.name}</span>
                                        <span className="font-bold text-slate-900">
                                            {s.price ? `GH₵${s.price}` : 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setCallDialogOpen(true)}
                        className="h-12 rounded-xl border-2 border-slate-100 font-bold text-slate-700 text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" /> Call
                    </button>
                    <button onClick={() => setSmsDialogOpen(true)}
                        className="h-12 rounded-xl bg-slate-900 font-bold text-white text-sm hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Send Info
                    </button>
                </div>

                {/* Modals nested here for simplicity */}
                <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
                    <DialogContent className="rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Call Provider?</DialogTitle>
                            <DialogDescription>We will log this request so you can track it.</DialogDescription>
                        </DialogHeader>
                        {lockError && <p className="text-red-500 text-sm">{lockError}</p>}
                        <div className="flex gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setCallDialogOpen(false)}
                                className="flex-1 rounded-xl">Cancel</Button>
                            <Button onClick={handleCall} disabled={locking} className="flex-1 rounded-xl bg-slate-900">
                                {locking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Call Now"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
                    <DialogContent className="rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Send Details via SMS</DialogTitle>
                            <DialogDescription>Send your location and car info to {provider.name}.</DialogDescription>
                        </DialogHeader>
                        <div
                            className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500 font-mono border border-slate-100 my-2">
                            {smsBody}
                        </div>
                        {smsError && <p className="text-red-500 text-sm">{smsError}</p>}
                        <div className="flex gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setSmsDialogOpen(false)}
                                className="flex-1 rounded-xl">Cancel</Button>
                            <Button onClick={handleSms} disabled={sendingSms}
                                className="flex-1 rounded-xl bg-slate-900">
                                {sendingSms ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send SMS"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </>
    )
}

function BlockedLocationHelp({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="mt-4 p-4 bg-amber-50 text-amber-900 rounded-2xl border border-amber-100 text-sm space-y-2">
            <div className="font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Location Blocked
            </div>
            <p>Please enable location services in your browser settings to find nearby help.</p>
            <Button size="sm" onClick={onRetry} variant="outline"
                className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100 w-full mt-2">Retry</Button>
        </div>
    )
}

/* helpers */
function buildSmsBody(values: HelpForm, loc: GeoFix) {
    const mapsLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const helpType = values.helpType.replace(/_/g, " ").toUpperCase();
    return `Need ${helpType} help. Car: ${values.carMake} ${values.carModel} (${values.plateNumber}). Loc: ${mapsLink} ${values.phone}`;
}