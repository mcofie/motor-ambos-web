// src/app/get-help/page.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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
} from "lucide-react";

/* --------------------- Schema --------------------- */
const HelpSchema = z.object({
    // object form (supported by that overload)
    helpType: z.enum(["battery", "tyres", "engine_oil", "towing"], {message: "Select the type of help"}),
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

type Provider = {
    id: string;
    name: string;
    phone: string;
    distance_km: number;
    rating?: number;
    jobs?: number;
    min_callout_fee?: number | null;
    coverage_radius_km?: number | null;
    services: Array<{ code: string; name: string; price?: number | null; unit?: string | null }>;
    lat: number;
    lng: number;
};

const HELP_OPTIONS: Array<{
    key: HelpForm["helpType"];
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    hint: string;
}> = [
    {key: "battery", label: "Battery", Icon: BatteryCharging, hint: "Jumpstart or replace"},
    {key: "tyres", label: "Tyres", Icon: Disc, hint: "Flat, puncture, swap"},
    {key: "engine_oil", label: "Engine Oil", Icon: Droplets, hint: "Top-up or change"},
    {key: "towing", label: "Towing", Icon: Truck, hint: "Short or long haul"},
];

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
        watch,
        handleSubmit,
        trigger,
        getValues,
        formState: {isSubmitting, errors},
    } = form;

    /* --------------------- Validation snapshots --------------------- */
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

    /* --------------------- Geolocation --------------------- */
    async function requestLocation() {
        try {
            setLocBusy(true);
            setLocError(null);

            if (!("geolocation" in navigator)) {
                setLocError("Geolocation is not supported by your browser.");
                return;
            }
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                });
            });

            setLoc({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
            });
        } catch (e: unknown) {
            const msg =
                e && typeof e === "object" && "message" in e
                    ? String((e as { message?: string }).message)
                    : "Failed to get your location.";
            setLocError(msg);
            setLoc(null);
        } finally {
            setLocBusy(false);
        }
    }

    /* --------------------- Submit -> fetch providers --------------------- */
    async function onSubmit(values: HelpForm) {
        if (!loc) {
            setLocError("Please share your location so nearby providers can find you.");
            return;
        }

        setLoadingProviders(true);
        setProviders(null);

        try {
            const list = await mockFindProviders(values.helpType, loc.lat, loc.lng);
            list.sort((a, b) =>
                a.distance_km === b.distance_km ? (b.rating ?? 0) - (a.rating ?? 0) : a.distance_km - b.distance_km
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

    /* --------------------- Action bar logic --------------------- */
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
            const ok = await trigger(["carMake", "carModel", "carYear", "carColor", "plateNumber"]);
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
    const activeIndex = Math.max(0, steps.findIndex((s) => s.key === step));

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Top Bar */}
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto w-full max-w-2xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 font-semibold text-base sm:text-lg">
                            <Wrench className="h-5 w-5"/>
                            Motor Ambos
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">Roadside Request</div>
                    </div>

                    {/* Stepper */}
                    <div className="mt-3 flex items-center justify-between sm:justify-start sm:gap-2">
                        {/* Mobile: dots */}
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
                                            isActive && "bg-primary"
                                        )}
                                    />
                                );
                            })}
                        </div>

                        {/* >= sm: labeled stepper */}
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
                            {steps.map((s, i) => {
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <div key={s.key} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "grid h-7 w-7 place-items-center rounded-full border text-[11px] font-medium",
                                                isActive && "bg-primary text-primary-foreground border-primary",
                                                isDone && "bg-muted",
                                                !isActive && !isDone && "bg-background"
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs uppercase tracking-wide",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}
                                        >
                      {s.label}
                    </span>
                                        {i < steps.length - 1 && <div className="mx-1 h-px w-8 bg-border"/>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content: add bottom padding so it doesn't sit under fixed bar */}
            <section className="mx-auto w-full max-w-2xl px-4 py-6 pb-36 sm:pb-32">
                <Card className="border-2 rounded-2xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg sm:text-xl font-extrabold">
                                {step === "help" && "What do you need help with?"}
                                {step === "car" && "Your car details"}
                                {step === "contact" && "How can we reach you?"}
                                {step === "providers" && "Nearby providers"}
                            </CardTitle>

                            {step !== "help" && (
                                <Button type="button" variant="ghost" size="sm" onClick={onBack} className="gap-1">
                                    <ChevronLeft className="h-4 w-4"/>
                                    <span className="hidden sm:inline">Back</span>
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    {/* ---------------------------- FORM STEPS ---------------------------- */}
                    {step !== "providers" && (
                        <CardContent>
                            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                                {/* Step 1: Help type */}
                                {step === "help" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                                            {HELP_OPTIONS.map((opt) => (
                                                <HelpTile
                                                    key={opt.key}
                                                    value={opt.key}
                                                    label={opt.label}
                                                    Icon={opt.Icon}
                                                    hint={opt.hint}
                                                    checked={helpType === opt.key}
                                                    onChange={(v) => setValue("helpType", v, {shouldValidate: true})}
                                                />
                                            ))}
                                        </div>
                                        {errors.helpType &&
                                            <p className="text-xs text-destructive">{errors.helpType.message}</p>}
                                    </div>
                                )}

                                {/* Step 2: Car details */}
                                {step === "car" && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 text-muted-foreground"/>
                                            <Label className="text-base">Car details</Label>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                                <Field label="Plate number" error={errors.plateNumber?.message}>
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <Field label="Full name" error={errors.fullName?.message}>
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
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
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
                                        <div className="rounded-xl border p-3">
                                            <div
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-sm">Your location</Label>
                                                    {!loc && !locError && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Share your current location so nearby providers can find you
                                                            faster.
                                                        </p>
                                                    )}
                                                    {loc && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Captured:{" "}
                                                            <span className="font-medium">
                                {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                              </span>
                                                            {typeof loc.accuracy === "number" && <> •
                                                                ±{Math.round(loc.accuracy)} m</>}
                                                        </p>
                                                    )}
                                                    {locError && (
                                                        <p className="flex items-center gap-1 text-xs text-destructive">
                                                            <AlertTriangle className="h-3.5 w-3.5"/>
                                                            {locError}
                                                        </p>
                                                    )}
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant={loc ? "secondary" : "default"}
                                                    onClick={requestLocation}
                                                    disabled={locBusy}
                                                    className="whitespace-nowrap h-10"
                                                >
                                                    <Crosshair className="mr-2 h-4 w-4"/>
                                                    {locBusy ? "Locating..." : loc ? "Refresh location" : "Use my location"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    )}

                    {/* ---------------------------- PROVIDERS SCREEN ---------------------------- */}
                    {step === "providers" && (
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border p-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4"/>
                                    <span>
                    Showing results near{" "}
                                        <strong>
                      {loc?.lat.toFixed(5)}, {loc?.lng.toFixed(5)}
                    </strong>
                  </span>
                                </div>
                            </div>

                            {loadingProviders && (
                                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Fetching nearby providers…
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) === 0 && (
                                <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
                                    No providers found nearby at the moment. Please try again in a few minutes.
                                </div>
                            )}

                            {!loadingProviders && (providers?.length ?? 0) > 0 && (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {providers!.map((p) => (
                                        <ProviderCard key={p.id} provider={p}
                                                      smsBody={buildSmsBody(getValues(), loc!)}/>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
            </section>

            {/* ---------------------------- FIXED ACTION BAR ---------------------------- */}
            <div
                className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="mx-auto w-full max-w-2xl px-4 py-3 pb-[env(safe-area-inset-bottom)]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {/* Back */}
                        {step !== "help" ? (
                            <Button type="button" variant="secondary" className="h-11 w-full sm:flex-1"
                                    onClick={onBack}>
                                <ChevronLeft className="mr-1.5 h-4 w-4"/>
                                Back
                            </Button>
                        ) : (
                            <div className="hidden sm:block sm:flex-1"/>
                        )}

                        {/* Primary */}
                        {step !== "providers" ? (
                            <Button
                                type="button"
                                className="h-11 w-full sm:flex-[2]"
                                disabled={!canNext || isSubmitting || (step === "contact" && loadingProviders)}
                                onClick={onNext}
                                title={step === "contact" && !loc ? "Share your location to continue" : undefined}
                            >
                                {step === "contact" && (isSubmitting || loadingProviders) ? (
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
                            <div className="flex w-full gap-2">
                                <Button type="button" variant="secondary" className="h-11 w-full sm:flex-1"
                                        onClick={() => setStep("contact")}>
                                    Edit Contact
                                </Button>
                                <Button
                                    type="button"
                                    className="h-11 w-full sm:flex-1"
                                    onClick={() => refreshSearchAgain(setLoadingProviders, setProviders, getValues(), loc)}
                                >
                                    Refresh results
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

/* --------------------- UI bits --------------------- */
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
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
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
    value: "battery" | "tyres" | "engine_oil" | "towing";
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
                "group relative cursor-pointer rounded-2xl border-2 p-4 transition",
                "hover:bg-accent data-[checked=true]:border-primary data-[checked=true]:bg-primary/5"
            )}
            data-checked={checked}
            onClick={() => onChange(value)}
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl border",
                        checked ? "bg-primary text-primary-foreground border-primary" : "bg-muted"
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
                      }: {
    provider: Provider;
    smsBody: string;
}) {
    const telHref = `tel:${provider.phone}`;
    const smsHref = `sms:${provider.phone}?&body=${encodeURIComponent(smsBody)}`;
    const mapsHref = `https://maps.google.com/?q=${provider.lat},${provider.lng}`;

    return (
        <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{provider.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{provider.distance_km.toFixed(1)} km away</span>
                        {typeof provider.rating === "number" && (
                            <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5"/>
                                {provider.rating.toFixed(1)} {provider.jobs ? `• ${provider.jobs} jobs` : ""}
              </span>
                        )}
                        {provider.min_callout_fee != null &&
                            <span>• min callout: ${provider.min_callout_fee.toFixed(0)}</span>}
                        {provider.coverage_radius_km != null && <span>• radius: {provider.coverage_radius_km} km</span>}
                    </div>

                    {provider.services.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {provider.services.slice(0, 3).map((s) => (
                                <span key={s.code} className="rounded-full border px-2 py-0.5 text-[11px]"
                                      title={s.name}>
                  {s.name}
                                    {typeof s.price === "number" ? ` • $${s.price}` : ""}
                </span>
                            ))}
                            {provider.services.length > 3 && (
                                <span
                                    className="text-[11px] text-muted-foreground">+{provider.services.length - 3} more</span>
                            )}
                        </div>
                    )}
                </div>

                <a href={mapsHref} target="_blank" rel="noreferrer" className="rounded-md border px-2 py-1 text-xs"
                   title="Open in Maps">
                    Map
                </a>
            </div>

            <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 gap-2">
                <Button asChild className="w-full h-10">
                    <a href={telHref}>Call</a>
                </Button>
                <Button asChild variant="secondary" className="w-full h-10">
                    <a href={smsHref}>Send SMS</a>
                </Button>
            </div>
        </div>
    );
}

/* --------------------- helpers --------------------- */

function buildSmsBody(values: HelpForm, loc: GeoFix) {
    const mapsLink = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const parts = [
        `Hi, I need roadside help for ${values.helpType.replace("_", " ")}.`,
        `Car: ${values.carMake} ${values.carModel} ${values.carYear} (${values.carColor}) • Plate: ${values.plateNumber}.`,
        `My location: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)} (${mapsLink}).`,
        `Name: ${values.fullName} • Phone: ${values.phone}.`,
    ];
    return parts.join(" ");
}

async function refreshSearchAgain(
    setLoading: (b: boolean) => void,
    setProviders: (p: Provider[]) => void,
    values: HelpForm,
    loc: GeoFix | null
) {
    if (!loc) return;
    setLoading(true);
    try {
        const list = await mockFindProviders(values.helpType, loc.lat, loc.lng);
        list.sort((a, b) =>
            a.distance_km === b.distance_km ? (b.rating ?? 0) - (a.rating ?? 0) : a.distance_km - b.distance_km
        );
        setProviders(list);
    } finally {
        setLoading(false);
    }
}

/* --------------------- mock data (replace with API) --------------------- */

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function mockFindProviders(help: HelpForm["helpType"], lat: number, lng: number): Promise<Provider[]> {
    const seed: Omit<Provider, "distance_km">[] = [
        {
            id: "p1",
            name: "QuickFix Mobile Mechanics",
            phone: "+233550000111",
            rating: 4.8,
            jobs: 320,
            min_callout_fee: 30,
            coverage_radius_km: 12,
            services: [
                {code: "battery", name: "Battery Jumpstart", price: 20, unit: "flat"},
                {code: "tyres", name: "Tyre Change", price: 15, unit: "flat"},
                {code: "engine_oil", name: "Oil Top-up", price: 25, unit: "flat"},
            ],
            lat: 5.6037,
            lng: -0.187,
        },
        {
            id: "p2",
            name: "TowPro Ghana",
            phone: "+233559999222",
            rating: 4.5,
            jobs: 180,
            min_callout_fee: 50,
            coverage_radius_km: 25,
            services: [{code: "towing", name: "City Tow", price: 70, unit: "trip"}],
            lat: 5.614,
            lng: -0.205,
        },
        {
            id: "p3",
            name: "Tyre Masters",
            phone: "+233501234567",
            rating: 4.2,
            jobs: 95,
            min_callout_fee: 20,
            coverage_radius_km: 10,
            services: [{code: "tyres", name: "Puncture Fix", price: 10, unit: "flat"}],
            lat: 5.6,
            lng: -0.18,
        },
        {
            id: "p4",
            name: "Oil & Go",
            phone: "+233244555666",
            rating: 4.0,
            jobs: 70,
            min_callout_fee: 15,
            coverage_radius_km: 8,
            services: [{code: "engine_oil", name: "Oil Change", price: 35, unit: "service"}],
            lat: 5.59,
            lng: -0.2,
        },
    ];

    const filtered = seed.filter((p) => p.services.some((s) => s.code === help));
    const withDistance: Provider[] = filtered.map((p) => ({
        ...p,
        distance_km: haversineKm(lat, lng, p.lat, p.lng),
    }));

    await new Promise((r) => setTimeout(r, 600));
    return withDistance;
}