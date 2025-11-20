// src/app/help/page.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/components/ui/button";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {
    Car,
    Wrench,
    ArrowRight,
    ChevronLeft,
    Crosshair,
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
    MessageCircle as MessageCircleIcon, ChevronDown,
} from "lucide-react";
import {createRequest, findProvidersNear,} from "@/lib/supaFetch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

/* ───────────────────────────────
   Types & schema for the wizard
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
        .min(4, "Enter year e.g. 2019")
        .max(4, "Use 4 digits")
        .regex(/^\d{4}$/, "Year must be 4 digits"),
    carColor: z.string().min(2, "Car color is required"),
    plateNumber: z.string().min(2, "Plate number is required"),
    fullName: z.string().min(2, "Your name is required"),
    phone: z
        .string()
        .min(7, "Phone is required")
        .regex(/^[0-9+\-\s()]{7,}$/, "Enter a valid phone"),
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
}> = [
    {
        key: "battery",
        label: "Battery",
        Icon: BatteryCharging,
        hint: "Jumpstart or replace",
    },
    {key: "tire", label: "Tyres", Icon: Disc, hint: "Flat, puncture, swap"},
    {
        key: "oil",
        label: "Engine Oil",
        Icon: Droplets,
        hint: "Top-up or change",
    },
    {key: "tow", label: "Towing", Icon: Truck, hint: "Short or long haul"},
    {key: "rescue", label: "Rescue", Icon: Truck, hint: "General rescue"},
];

/* Geo helpers */
const GEO_ERROR_BLOCKED = "GEO_BLOCKED" as const;
type PermState = "granted" | "prompt" | "denied" | "unknown";

async function checkGeoPermission(): Promise<PermState> {
    if (!("permissions" in navigator)) return "unknown";
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
    if (!("geolocation" in navigator)) {
        return Promise.reject(
            new Error("Geolocation is not supported by your browser."),
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
   Page
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

    // Request id (displayed on Providers step)
    const [requestId, setRequestId] = useState<string | null>(null);

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
        watch,
        handleSubmit,
        trigger,
        getValues,
        formState: {isSubmitting, errors},
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
            carMake.trim().length >= 2 &&
            carModel.trim().length >= 1 &&
            /^\d{4}$/.test(carYear) &&
            carColor.trim().length >= 2 &&
            plateNumber.trim().length >= 2
        );
    }, [carMake, carModel, carYear, carColor, plateNumber]);

    const contactSectionValid = useMemo(() => {
        return fullName.trim().length >= 2 && /^[0-9+\-\s()]{7,}$/.test(phone);
    }, [fullName, phone]);

    // Lock a request for a specific provider (used by both Call & SMS flows)
    async function lockRequestForProvider(provider: Provider) {
        if (!loc) {
            setLocError("Please share your location so nearby providers can find you.");
            throw new Error("Missing location");
        }

        const values = getValues();

        const details = `Car: ${values.carMake} ${values.carModel} ${values.carYear} (${values.carColor}) • Plate: ${values.plateNumber}`;

        const requestRow = await createRequest({
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

        setRequestId(requestRow?.id ?? null);
    }

    /* geolocation */
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
                else if (e.code === 2)
                    msg = "Location unavailable. Try moving to improve signal.";
                else if (e.code === 3)
                    msg = "Location request timed out. Try again.";
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

    /* submit -> fetch providers (request locking happens on call/SMS) */
    async function onSubmit(values: HelpForm) {
        if (!loc) {
            setLocError("Please share your location so nearby providers can find you.");
            return;
        }

        setLoadingProviders(true);
        setProviders(null);

        try {
            // Get nearby providers
            const list = await findProvidersNear(values.helpType, loc.lat, loc.lng);
            list.sort((a, b) =>
                a.distance_km === b.distance_km
                    ? (b.rating ?? 0) - (a.rating ?? 0)
                    : a.distance_km - b.distance_km,
            );
            setProviders(list);
            setStep("providers");
        } catch {
            setProviders([]); // empty state
            setStep("providers");
        } finally {
            setLoadingProviders(false);
        }
    }

    /* Refresh providers on button click (Providers step) */
    async function refreshSearchAgain(
        setLoading: (b: boolean) => void,
        setProvidersList: (p: Provider[]) => void,
        values: HelpForm,
        currentLoc: GeoFix | null,
    ) {
        if (!currentLoc) return;
        setLoading(true);
        try {
            const list = await findProvidersNear(
                values.helpType,
                currentLoc.lat,
                currentLoc.lng,
            );
            list.sort((a, b) =>
                a.distance_km === b.distance_km
                    ? (b.rating ?? 0) - (a.rating ?? 0)
                    : a.distance_km - b.distance_km,
            );
            setProvidersList(list);
        } finally {
            setLoading(false);
        }
    }

    /* action bar */
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
            if (ok) setStep("contact");
            return;
        }
        if (step === "contact") {
            await handleSubmit(onSubmit)();
            return;
        }
    }

    function onBack() {
        if (step === "car") return setStep("help");
        if (step === "contact") return setStep("car");
        if (step === "providers") return setStep("contact");
    }

    const steps: Array<{ key: StepKey; label: string }> = [
        {key: "help", label: "Help"},
        {key: "car", label: "Car"},
        {key: "contact", label: "Contact"},
        {key: "providers", label: "Providers"},
    ];
    const activeIndex = Math.max(
        0,
        steps.findIndex((s) => s.key === step),
    );

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Top Bar */}
            <header
                className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto w-full max-w-2xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-base font-semibold sm:text-lg">
                            <Wrench className="h-5 w-5"/>
                            Motor Ambos
                        </div>
                        <div className="text-[10px] text-muted-foreground sm:text-xs">
                            Roadside Request
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="mt-3 flex items-center justify-between sm:gap-2 sm:justify-start">
                        {/* Mobile dots */}
                        <div className="flex items-center gap-1 sm:hidden">
                            {steps.map((s, i) => {
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <span
                                        key={s.key}
                                        className={cn(
                                            "h-2 w-2 rounded-full bg-border",
                                            isDone && "bg-muted-foreground/50",
                                            isActive && "bg-primary",
                                        )}
                                    />
                                );
                            })}
                        </div>

                        {/* >= sm labeled stepper */}
                        <div className="hidden items-center gap-2 sm:flex">
                            {steps.map((s, i) => {
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <div key={s.key} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "grid h-7 w-7 place-items-center rounded-full text-[11px] font-medium",
                                                isActive &&
                                                "bg-primary text-primary-foreground",
                                                isDone && "bg-muted",
                                                !isActive &&
                                                !isDone &&
                                                "bg-background",
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs uppercase tracking-wide",
                                                isActive
                                                    ? "text-foreground"
                                                    : "text-muted-foreground",
                                            )}
                                        >
                      {s.label}
                    </span>
                                        {i < steps.length - 1 && (
                                            <div className="mx-1 h-px w-8 bg-border"/>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="mx-auto w-full max-w-2xl px-4 py-6 pb-36 sm:pb-32">
                <div className="rounded-2xl">
                    <CardHeader className="space-y-1 px-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="py-2 text-lg font-extrabold sm:text-xl">
                                {step === "help" && "What do you need help with?"}
                                {step === "car" && "Your car details"}
                                {step === "contact" && "How can we reach you?"}
                                {step === "providers" && "Nearby providers"}
                            </CardTitle>

                            {step !== "help" && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBack}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                    <span className="hidden sm:inline">Back</span>
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    {/* FORM STEPS */}
                    {step !== "providers" && (
                        <CardContent>
                            <form
                                className="space-y-8"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                {/* Step 1: Help type */}
                                {step === "help" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2">
                                            {HELP_OPTIONS.map((opt) => (
                                                <HelpTile
                                                    key={opt.key}
                                                    value={opt.key}
                                                    label={opt.label}
                                                    Icon={opt.Icon}
                                                    hint={opt.hint}
                                                    checked={helpType === opt.key}
                                                    onChange={(v) =>
                                                        setValue("helpType", v, {
                                                            shouldValidate: true,
                                                        })
                                                    }
                                                />
                                            ))}
                                        </div>
                                        {errors.helpType && (
                                            <p className="text-xs text-destructive">
                                                {errors.helpType.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Step 2: Car details */}
                                {step === "car" && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 text-muted-foreground"/>
                                            <Label className="text-base">Car details</Label>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <Field label="Make" error={errors.carMake?.message}>
                                                <Input
                                                    {...register("carMake")}
                                                    placeholder="e.g., Toyota"
                                                    className="h-11 text-base"
                                                    autoComplete="off"
                                                />
                                            </Field>
                                            <Field label="Model" error={errors.carModel?.message}>
                                                <Input
                                                    {...register("carModel")}
                                                    placeholder="e.g., Corolla"
                                                    className="h-11 text-base"
                                                    autoComplete="off"
                                                />
                                            </Field>
                                            <Field label="Year" error={errors.carYear?.message}>
                                                <Input
                                                    inputMode="numeric"
                                                    maxLength={4}
                                                    {...register("carYear")}
                                                    placeholder="e.g., 2018"
                                                    className="h-11 text-base"
                                                    autoComplete="off"
                                                />
                                            </Field>
                                            <Field label="Color" error={errors.carColor?.message}>
                                                <Input
                                                    {...register("carColor")}
                                                    placeholder="e.g., Silver"
                                                    className="h-11 text-base"
                                                    autoComplete="off"
                                                />
                                            </Field>
                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Plate number"
                                                    error={errors.plateNumber?.message}
                                                >
                                                    <Input
                                                        {...register("plateNumber")}
                                                        placeholder="e.g., GR-1234-24"
                                                        className="h-11 text-base"
                                                        autoComplete="off"
                                                    />
                                                </Field>
                                            </div>
                                        </div>

                                        <Separator/>
                                    </div>
                                )}

                                {/* Step 3: Contact + Location */}
                                {step === "contact" && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <Field
                                                label="Full name"
                                                error={errors.fullName?.message}
                                            >
                                                <Input
                                                    {...register("fullName")}
                                                    placeholder="Your name"
                                                    className="h-11 text-base"
                                                    autoComplete="name"
                                                />
                                            </Field>
                                            <Field label="Phone" error={errors.phone?.message}>
                                                <div className="relative">
                                                    <Phone
                                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                    <Input
                                                        {...register("phone")}
                                                        inputMode="tel"
                                                        placeholder="+233 55 123 4567"
                                                        className="h-11 pl-9 text-base"
                                                        autoComplete="tel"
                                                    />
                                                </div>
                                            </Field>
                                        </div>

                                        {/* Location capture */}
                                        <div className="rounded-xl bg-muted/30 p-3">
                                            <div
                                                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="space-y-1">
                                                    <Label className="text-sm">Your location</Label>
                                                    {!loc && !locError && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Share your current location so nearby providers
                                                            can find you faster.
                                                        </p>
                                                    )}
                                                    {loc && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Captured:{" "}
                                                            <span className="font-medium">
                                {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                              </span>
                                                            {typeof loc.accuracy === "number" && (
                                                                <>
                                                                    {" "}
                                                                    • ±{Math.round(loc.accuracy)} m
                                                                </>
                                                            )}
                                                        </p>
                                                    )}

                                                    {locError === GEO_ERROR_BLOCKED ? (
                                                        <BlockedLocationHelp onRetry={requestLocation}/>
                                                    ) : locError ? (
                                                        <p className="flex items-center gap-1 text-xs text-destructive">
                                                            <AlertTriangle className="h-3.5 w-3.5"/>
                                                            {locError}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant={loc ? "secondary" : "default"}
                                                    onClick={requestLocation}
                                                    disabled={locBusy}
                                                    className="h-10 whitespace-nowrap"
                                                >
                                                    <Crosshair className="mr-2 h-4 w-4"/>
                                                    {locBusy
                                                        ? "Locating..."
                                                        : loc
                                                            ? "Refresh location"
                                                            : "Use my location"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    )}

                    {/* PROVIDERS SCREEN */}
                    {step === "providers" && (
                        <CardContent className="space-y-4 px-2">
                            <div className="rounded-xl bg-card/60 p-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4"/>
                                    <span>
                    Showing results near{" "}
                                        <strong>
                      {loc?.lat.toFixed(5)}, {loc?.lng.toFixed(5)}
                    </strong>
                  </span>
                                    {requestId && (
                                        <span className="ml-auto text-[11px] text-muted-foreground">
                      Request ID:{" "}
                                            <span className="font-mono">{requestId}</span>
                    </span>
                                    )}
                                </div>
                            </div>

                            {loadingProviders && (
                                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Fetching nearby providers…
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) === 0 && (
                                <div className="rounded-xl p-6 text-center text-sm text-muted-foreground">
                                    No providers found nearby at the moment. Please try again in a
                                    few minutes.
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) > 0 && loc && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {providers!.map((p) => (
                                        <ProviderCard
                                            key={p.id}
                                            provider={p}
                                            smsBody={buildSmsBody(getValues(), loc)}
                                            onLockRequest={lockRequestForProvider}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    )}
                </div>
            </section>

            {/* Fixed Action Bar */}
            <div
                className="fixed inset-x-0 bottom-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                <div className="mb-5 mx-auto w-full max-w-2xl px-4 py-3 pb-[env(safe-area-inset-bottom)]">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {step !== "providers" ? (
                            <Button
                                type="button"
                                className="h-11 w-full"
                                disabled={
                                    !canNext ||
                                    isSubmitting ||
                                    (step === "contact" && loadingProviders)
                                }
                                onClick={onNext}
                                title={
                                    step === "contact" && !loc
                                        ? "Share your location to continue"
                                        : undefined
                                }
                            >
                                {step === "contact" &&
                                (isSubmitting || loadingProviders) ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Finding providers…
                                    </>
                                ) : (
                                    <>
                                        {step === "help" && "Next"}
                                        {step === "car" && "Next"}
                                        {step === "contact" && "Confirm & Request"}
                                        <ArrowRight className="ml-2 h-4 w-4"/>
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="h-11 w-full"
                                disabled={loadingProviders}
                                onClick={() =>
                                    refreshSearchAgain(
                                        setLoadingProviders,
                                        (p) => setProviders(p),
                                        getValues(),
                                        loc,
                                    )
                                }
                            >
                                {loadingProviders ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Refreshing results…
                                    </>
                                ) : (
                                    "Refresh results"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

/* ───────────────────────────────
   UI bits
   ─────────────────────────────── */
function Field({
                   label,
                   error,
                   children,
               }: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <Label className="text-sm">{label}</Label>
            <div className="mt-1">{children}</div>
            {error && (
                <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}

function HelpTile({
                      value,
                      label,
                      hint,
                      Icon,
                      checked,
                      onChange,
                  }: {
    value: "battery" | "tire" | "oil" | "tow" | "rescue" | "fuel";
    label: string;
    hint: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    checked: boolean;
    onChange: (v: HelpForm["helpType"]) => void;
}) {
    return (
        <Label
            htmlFor={`help-${value}`}
            className={cn(
                "group relative cursor-pointer rounded-2xl p-4 transition",
                "bg-card/60 hover:bg-accent/40",
                "data-[checked=true]:bg-primary/10",
            )}
            data-checked={checked}
            onClick={() => onChange(value)}
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl transition",
                        checked
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                    )}
                >
                    <Icon className="h-5 w-5"/>
                </div>
                <div className="flex-1">
                    <div className="font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{hint}</div>
                </div>
                <RadioGroup className="hidden">
                    <RadioGroupItem id={`help-${value}`} value={value}/>
                </RadioGroup>
            </div>
        </Label>
    );
}

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
    const smsHref = `sms:${provider.phone}?&body=${encodeURIComponent(smsBody)}`;
    const mapsHref = `https://maps.google.com/?q=${provider.lat},${provider.lng}`;

    const [callDialogOpen, setCallDialogOpen] = React.useState(false);
    const [locking, setLocking] = React.useState(false);
    const [lockError, setLockError] = React.useState<string | null>(null);

    const [smsDialogOpen, setSmsDialogOpen] = React.useState(false);
    const [sendingSms, setSendingSms] = React.useState(false);
    const [smsError, setSmsError] = React.useState<string | null>(null);

    const [servicesOpen, setServicesOpen] = React.useState(true); // 👈 NEW

    const handleCallClick = () => {
        setLockError(null);
        setCallDialogOpen(true);
    };

    const handleConfirmCall = async () => {
        try {
            setLockError(null);
            setLocking(true);

            if (onLockRequest) {
                await onLockRequest(provider);
            }

            setCallDialogOpen(false);
            window.location.href = telHref;
        } catch (e) {
            const msg =
                e instanceof Error
                    ? e.message
                    : "Something went wrong while locking the request.";
            setLockError(msg);
        } finally {
            setLocking(false);
        }
    };

    const handleSendDetailsClick = () => {
        setSmsError(null);
        setSmsDialogOpen(true);
    };

    const handleConfirmSendDetails = async () => {
        try {
            setSmsError(null);
            setSendingSms(true);

            if (onLockRequest) {
                await onLockRequest(provider);
            }

            const res = await fetch("/api/send-sms", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    to: provider.phone,
                    content: smsBody,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.error || "Failed to send SMS");
            }

            setSmsDialogOpen(false);
            // Optional: open native app
            // window.location.href = smsHref;
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Something went wrong sending SMS.";
            setSmsError(msg);
        } finally {
            setSendingSms(false);
        }
    };

    const visibleServices = provider.services.slice(0, 4);
    const extraCount =
        provider.services.length > visibleServices.length
            ? provider.services.length - visibleServices.length
            : 0;

    return (
        <>
            <div
                className="group relative rounded-2xl bg-card/60 p-4 shadow-sm border border-border/80 ring-1 ring-border/70 transition hover:shadow-md hover:ring-primary/60">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        {/* Provider Name with Verified Badge */}
                        <div className="flex items-center gap-1">
                            <div className="text-base font-semibold">{provider.name}</div>
                            {provider.is_verified && (
                                <BadgeCheck className="h-4 w-4 text-blue-500 dark:text-blue-400"/>
                            )}
                        </div>

                        {provider.address_line && (
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                {provider.address_line}
                            </p>
                        )}

                        {/* Meta chips */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {/* Distance */}
                            <span
                                className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <span className="font-semibold">Distance</span>•
                                {` ${provider.distance_km.toFixed(1)} km`}
              </span>

                            {/* Callout Fee */}
                            {provider.min_callout_fee != null && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <span className="font-semibold">Call-out</span>
                                    {` • GH₵ ${provider.min_callout_fee.toFixed(0)}`}
                </span>
                            )}

                            {/* Coverage Radius */}
                            {provider.coverage_radius_km != null && (
                                <span
                                    className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  <span className="font-semibold">Coverage</span>
                                    {` • ${provider.coverage_radius_km} km`}
                </span>
                            )}

                            {/* Rating */}
                            {typeof provider.rating === "number" && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-yellow-500"/>
                                    {provider.rating.toFixed(1)}
                                    {provider.jobs ? ` (${provider.jobs})` : ""}
                </span>
                            )}
                        </div>

                        {/* Services offered – collapsible */}
                        {provider.services.length > 0 && (
                            <div className="mt-3 space-y-2 rounded-xl border border-border bg-muted/50 p-3">
                                {/* Header row as toggle */}
                                <button
                                    type="button"
                                    onClick={() => setServicesOpen((v) => !v)}
                                    className="flex w-full items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-muted-foreground"
                                >
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5"/>
                    <span>Services &amp; rates</span>
                  </span>

                                    <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium">
                      {provider.services.length}{" "}
                        {provider.services.length === 1 ? "service" : "services"}
                    </span>
                                        <ChevronDown
                                            className={`h-3 w-3 transition-transform ${
                                                servicesOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </button>

                                <p className="text-[11px] text-muted-foreground">
                                    Transparent rate card – prices shown are starting rates per
                                    service.
                                </p>

                                {servicesOpen && (
                                    <>
                                        <div className="space-y-1.5">
                                            {visibleServices.map((s) => (
                                                <div
                                                    key={s.code}
                                                    className="flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#9fe870]"/>
                                                        <span className="truncate text-xs font-medium">
                              {s.name}
                            </span>
                                                    </div>

                                                    {typeof s.price === "number" ? (
                                                        <div className="shrink-0 text-right text-[11px] font-semibold">
                                                            GH₵{s.price.toFixed(0)}
                                                            {s.unit && (
                                                                <span
                                                                    className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                                  /{s.unit}
                                </span>
                                                            )}
                                                            <div className="text-[9px] text-muted-foreground">
                                                                From
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="shrink-0 text-[10px] text-muted-foreground">
                                                            Call for rate
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {extraCount > 0 && (
                                            <span className="text-[11px] text-muted-foreground">
                        +{extraCount} more services available
                      </span>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Map Button */}
                    <a
                        href={mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                        title="Open in Maps"
                    >
                        <MapPin className="h-4 w-4"/>
                        <span className="hidden sm:inline">Map</span>
                    </a>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 grid grid-cols-1 gap-2 xs:grid-cols-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full border-border/80 text-sm text-foreground hover:bg-accent/40"
                        onClick={handleCallClick}
                    >
                        <Phone className="mr-1.5 h-4 w-4"/>
                        Call
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="h-10 w-full text-sm text-muted-foreground hover:bg-accent/40"
                        onClick={handleSendDetailsClick}
                    >
                        <MessageCircleIcon className="mr-1.5 h-4 w-4"/>
                        Send details
                    </Button>
                </div>
            </div>

            {/* Call lock dialog */}
            <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border border-border/60">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Phone className="h-4 w-4"/>
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Lock this request before calling
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs sm:text-sm">
                                    We’ll save this provider against your request so we can track
                                    your help and keep your history tidy.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="mt-4 rounded-xl border border-border/60 bg-muted/40 px-3 py-3 text-xs sm:text-sm">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="flex items-center gap-1.5">
                  <span className="truncate font-medium text-foreground">
                    {provider.name}
                  </span>
                                    {provider.is_verified && (
                                        <BadgeCheck className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400"/>
                                    )}
                                </p>
                                {provider.address_line && (
                                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                        {provider.address_line}
                                    </p>
                                )}
                            </div>

                            {provider.distance_km != null && (
                                <span
                                    className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {provider.distance_km.toFixed(1)} km away
                </span>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Wrench className="h-3 w-3"/>
                <span>We’ll attach this mechanic to your request.</span>
              </span>
                        </div>
                    </div>

                    <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground">
                        <p className="text-xs font-medium text-foreground">
                            What happens next
                        </p>
                        <ul className="space-y-1">
                            <li>• We lock this provider to your current help request.</li>
                            <li>• You place the call and speak directly with them.</li>
                            <li>• Your request stays in your history for follow-up.</li>
                        </ul>
                    </div>

                    {lockError && (
                        <p className="mt-3 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
                            {lockError}
                        </p>
                    )}

                    <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-9 text-sm sm:min-w-[96px]"
                            onClick={() => setCallDialogOpen(false)}
                            disabled={locking}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex h-9 items-center justify-center gap-1.5 text-sm sm:min-w-[150px]"
                            onClick={handleConfirmCall}
                            disabled={locking}
                        >
                            {locking ? (
                                <>Locking…</>
                            ) : (
                                <>
                                    Lock request &amp; call
                                    <Phone className="h-4 w-4"/>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send details dialog */}
            <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border border-border/60">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <MessageCircleIcon className="h-4 w-4"/>
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Send your details to this provider
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-xs sm:text-sm">
                                    We’ll send your car details and location to{" "}
                                    <span className="font-medium text-foreground">
                    {provider.name}
                  </span>{" "}
                                    via SMS.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="mt-4 rounded-xl bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                        <p className="mb-1 font-medium text-foreground">
                            Preview of what we’ll send:
                        </p>
                        <p className="line-clamp-4 whitespace-pre-wrap break-words">
                            {smsBody}
                        </p>
                    </div>

                    {smsError && (
                        <p className="mt-3 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
                            {smsError}
                        </p>
                    )}

                    <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-9 text-sm sm:min-w-[96px]"
                            onClick={() => setSmsDialogOpen(false)}
                            disabled={sendingSms}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="flex h-9 items-center justify-center gap-1.5 text-sm sm:min-w-[150px]"
                            onClick={handleConfirmSendDetails}
                            disabled={sendingSms}
                        >
                            {sendingSms ? "Sending…" : "Send SMS"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


function BlockedLocationHelp({onRetry}: { onRetry: () => void }) {
    return (
        <div className="mt-2 rounded-md bg-amber-50 p-3 text-amber-900">
            <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4"/>
                <div className="space-y-1 text-xs">
                    <div className="font-semibold">
                        Location permission is blocked for this site.
                    </div>
                    <p>
                        Enable it in your browser’s{" "}
                        <span className="font-medium">Site settings</span>, then
                        return and tap <span className="font-medium">Try again</span>.
                    </p>
                    <ul className="list-inside list-disc space-y-0.5 text-[11px] opacity-90">
                        <li>
                            <span className="font-medium">Chrome:</span> Lock icon →
                            Site settings → <em>Location</em> → Allow
                        </li>
                        <li>
                            <span className="font-medium">Safari (iOS):</span> Settings
                            → Privacy &amp; Security → Location Services → Safari
                            Websites → While Using
                        </li>
                    </ul>
                    <div className="pt-1">
                        <Button type="button" size="sm" onClick={onRetry}>
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* helpers */
function buildSmsBody(values: HelpForm, loc: GeoFix) {
    const mapsLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;

    const helpType = values.helpType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return [
        `Hi, I need roadside assistance for a ${helpType}.`,
        `Car: ${values.carMake} ${values.carModel} ${values.carYear} (${values.carColor}) – Plate: ${values.plateNumber}.`,
        `Location: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}.`,
        `Maps: ${mapsLink}`,
        `Name: ${values.fullName}. Phone: ${values.phone}.`,
    ].join(" ");
}