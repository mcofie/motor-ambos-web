"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlertTriangle,
    ArrowRight,
    BatteryCharging,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Disc,
    Droplets,
    Loader2,
    MapPin,
    MessageCircle,
    Navigation,
    Phone,
    ShieldCheck,
    Sparkles,
    Star,
    Store,
    Truck,
    Wrench,
    Zap,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { findProvidersNear, type Provider } from "@/lib/supaFetch";
import { BrandMark, LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import { formatPhone, normalizePhone } from "@/lib/phone";

const HelpSchema = z.object({
    helpType: z.enum(["battery", "tire", "oil", "tow", "rescue", "fuel", "roadworthy", "insurance", "detailing", "car_wash", "shop", "electrical"]),
    carMake: z.string(),
    carModel: z.string(),
    carYear: z.string(),
    carColor: z.string(),
    plateNumber: z.string().min(2, "Enter the plate number"),
    fullName: z.string().min(2, "Enter your name"),
    phone: z.string().refine((value) => Boolean(normalizePhone(value)), "Enter a valid phone number, such as +233558508306"),
});

type HelpForm = z.infer<typeof HelpSchema>;
type StepKey = "help" | "car" | "contact" | "providers";
type GeoFix = { lat: number; lng: number; accuracy?: number; timestamp: number };

const helpOptions = [
    { key: "battery", label: "Battery", hint: "Jumpstart", icon: BatteryCharging },
    { key: "tire", label: "Flat tyre", hint: "Change or pump", icon: Disc },
    { key: "tow", label: "Towing", hint: "Move the car", icon: Truck },
    { key: "rescue", label: "Rescue", hint: "Stuck on the road", icon: AlertTriangle },
    { key: "fuel", label: "Fuel", hint: "Out of fuel", icon: Droplets },
    { key: "electrical", label: "Electrical", hint: "Wiring or AC", icon: Zap },
    { key: "shop", label: "Auto shop", hint: "Parts or repair", icon: Store },
    { key: "detailing", label: "Detailing", hint: "Cleaning or polish", icon: Sparkles },
] as const;

const modelsByMake: Record<string, string[]> = {
    Toyota: ["Corolla", "Camry", "Yaris", "RAV4", "Hilux", "Land Cruiser", "Hiace"],
    Hyundai: ["i10", "Accent", "Elantra", "Tucson", "Santa Fe", "H-100"],
    Kia: ["Picanto", "Rio", "Cerato", "Sportage", "Sorento"],
    Nissan: ["March", "Sunny", "Sentra", "Altima", "X-Trail", "Navara"],
    Honda: ["Fit", "Civic", "Accord", "CR-V", "HR-V"],
    Suzuki: ["Alto", "Swift", "Dzire", "Vitara", "Baleno"],
    Ford: ["Focus", "Escape", "Ranger", "Explorer", "Transit"],
    Mercedes: ["C-Class", "E-Class", "GLC", "Sprinter", "Vito"],
    BMW: ["3 Series", "5 Series", "X3", "X5"],
};
const yearChoices = Array.from({ length: 26 }, (_, index) => String(new Date().getFullYear() - index));
const colorChoices = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Gold", "Brown", "Beige", "Yellow", "Orange"];

const inputClass = "h-12 w-full rounded-[10px] border border-[#E5E5E5] bg-white px-4 text-[16px] text-[#171717] outline-none transition-colors placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

function carForMessage(values: HelpForm) {
    const details = [values.carYear, values.carColor, values.carMake, values.carModel].filter(Boolean).join(" ");
    return details ? `${details} (plate ${values.plateNumber})` : `plate ${values.plateNumber}`;
}

function ProviderCard({ provider, smsBody }: { provider: Provider; smsBody: string }) {
    const [messageOpen, setMessageOpen] = useState(false);

    return (
        <article className="rounded-[14px] border border-[#EAEAEA] bg-white p-4 sm:p-8">
            <div className="flex items-start gap-4">
                <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#EEEEFF] text-[#1111F6] sm:flex"><Wrench className="h-6 w-6" /></span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[17px] font-normal leading-snug tracking-[-0.02em] sm:text-[22px] sm:tracking-[-0.025em]">{provider.name}</h3>
                        <span className="shrink-0 rounded-full bg-[#F7F7F7] px-2.5 py-1 text-[12px] text-[#555] sm:px-3 sm:py-1.5 sm:text-[13px]">{provider.distance_km.toFixed(1)} km</span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#777] sm:mt-1 sm:text-[14px]">{provider.address_line || "Nearby provider"}</p>
                    {provider.is_verified && <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#277E62]"><ShieldCheck className="h-4 w-4" />Verified provider</span>}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-[#EFEFEF] pt-3 text-[13px] text-[#666] sm:mt-6 sm:pt-5">
                <span>Call-out fee: <strong className="font-medium text-[#171717]">{provider.min_callout_fee == null ? "Ask provider" : "GH₵" + provider.min_callout_fee}</strong></span>
                {provider.rating != null && provider.rating > 0 && <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[#1111F6] text-[#1111F6]" />{provider.rating}</span>}
                {provider.services.length > 0 && <span>{provider.services.map((service) => service.name).slice(0, 2).join(" · ")}</span>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:gap-3">
                <a href={"tel:" + provider.phone} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#E5E5E5] px-5 text-[15px] transition-colors hover:bg-[#F8F8F8]"><Phone className="h-4 w-4" />Call</a>
                <button type="button" onClick={() => setMessageOpen(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[15px] text-white transition-colors hover:bg-[#0606D8]"><MessageCircle className="h-4 w-4" />Message</button>
            </div>

            <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
                <DialogContent className="bottom-0 left-0 top-auto max-w-none translate-x-0 translate-y-0 gap-0 rounded-b-none rounded-t-[20px] border border-[#EAEAEA] bg-white p-5 pb-[max(20px,env(safe-area-inset-bottom))] text-[#171717] sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[16px] sm:p-8">
                    <DialogTitle className="pr-8 text-[22px] font-normal leading-tight tracking-[-0.03em] sm:text-[28px] sm:tracking-[-0.035em]">Message {provider.name}</DialogTitle>
                    <DialogDescription className="mt-2 text-[14px] text-[#777]">Review the request before opening your messaging app.</DialogDescription>
                    <div className="mt-5 max-h-[40dvh] overflow-y-auto break-words rounded-[12px] bg-[#F7F7F7] p-4 text-[14px] leading-relaxed text-[#444] sm:mt-6">{smsBody}</div>
                    <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                        <button type="button" onClick={() => setMessageOpen(false)} className="h-12 rounded-full border border-[#E5E5E5] bg-white px-5 text-[15px] text-[#171717] outline-none focus-visible:ring-2 focus-visible:ring-[#1111F6] focus-visible:ring-offset-2">Cancel</button>
                        <a href={"sms:" + provider.phone + "?body=" + encodeURIComponent(smsBody)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[15px] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#1111F6] focus-visible:ring-offset-2">Open message <ArrowRight className="h-4 w-4" /></a>
                    </div>
                </DialogContent>
            </Dialog>
        </article>
    );
}

export default function GetHelpWizardPage() {
    const [step, setStep] = useState<StepKey>("help");
    const [loc, setLoc] = useState<GeoFix | null>(null);
    const [locBusy, setLocBusy] = useState(false);
    const [locError, setLocError] = useState<string | null>(null);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [providerError, setProviderError] = useState(false);
    const [showMoreHelp, setShowMoreHelp] = useState(false);
    const [showMoreCar, setShowMoreCar] = useState(false);
    const [carFromLink, setCarFromLink] = useState(false);
    const [customMake, setCustomMake] = useState(false);
    const [customModel, setCustomModel] = useState(false);
    const [customYear, setCustomYear] = useState(false);
    const [customColor, setCustomColor] = useState(false);

    const form = useForm<HelpForm>({
        resolver: zodResolver(HelpSchema),
        defaultValues: {
            helpType: undefined,
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
    const { register, setValue, handleSubmit, trigger, getValues, watch, formState: { errors } } = form;
    const helpType = watch("helpType");
    const carMake = watch("carMake");
    const carModel = watch("carModel");
    const carYear = watch("carYear");
    const carColor = watch("carColor");

    useEffect(() => {
        // A sticker can open /help with car details already in the QR URL.
        const params = new URLSearchParams(window.location.search);
        const fields = { plateNumber: "plate", carMake: "make", carModel: "model", carYear: "year", carColor: "color" } as const;
        let hasCar = false;
        for (const [field, parameter] of Object.entries(fields) as [keyof typeof fields, string][]) {
            const value = params.get(parameter)?.trim();
            if (value) {
                setValue(field, value.slice(0, 80), { shouldValidate: true });
                hasCar = true;
            }
        }
        const linkedMake = params.get("make")?.trim() || "";
        const linkedModel = params.get("model")?.trim() || "";
        const linkedYear = params.get("year")?.trim() || "";
        const linkedColor = params.get("color")?.trim() || "";
        setCustomMake(Boolean(linkedMake && !modelsByMake[linkedMake]));
        setCustomModel(Boolean(linkedModel && (!modelsByMake[linkedMake] || !modelsByMake[linkedMake].includes(linkedModel))));
        setCustomYear(Boolean(linkedYear && !yearChoices.includes(linkedYear)));
        setCustomColor(Boolean(linkedColor && !colorChoices.includes(linkedColor)));
        setShowMoreCar(Boolean(linkedYear || linkedColor));
        setCarFromLink(hasCar);
    }, [setValue]);

    function moveTo(next: StepKey) {
        setStep(next);
        requestAnimationFrame(() => {
            // On phones the hero is hidden after the first step, so the flow starts at the top of the page.
            if (window.matchMedia("(max-width: 639px)").matches) window.scrollTo({ top: 0 });
            else document.getElementById("help-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function requestLocation() {
        setLocBusy(true);
        setLocError(null);
        if (!navigator.geolocation) {
            setLocError("Location sharing is not supported by this browser.");
            setLocBusy(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: pos.timestamp });
                setLocBusy(false);
            },
            () => {
                setLocError("We could not get your location. Check location access and try again.");
                setLocBusy(false);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }

    async function onSubmit(values: HelpForm) {
        if (!loc) {
            setLocError("Share your location to find nearby help.");
            return;
        }
        setProviderError(false);
        setLoadingProviders(true);
        moveTo("providers");
        try {
            const found = await findProvidersNear(values.helpType, loc.lat, loc.lng);
            setProviders(found.sort((a, b) => a.distance_km - b.distance_km));
        } catch {
            setProviders([]);
            setProviderError(true);
        } finally {
            setLoadingProviders(false);
        }
    }

    async function onNext() {
        if (step === "help") {
            if (helpType) moveTo(carFromLink && getValues("plateNumber") ? "contact" : "car");
        } else if (step === "car") {
            const valid = await trigger(["plateNumber"]);
            if (valid) moveTo("contact");
        } else if (step === "contact") {
            await handleSubmit(onSubmit)();
        }
    }

    const progress = step === "help" ? 1 : step === "car" ? 2 : 3;
    const stepLabels = ["What happened", "Your car", "Find help"];
    const helpLabel = helpOptions.find((option) => option.key === helpType)?.label.toLowerCase() ?? "roadside";

    function chooseHelp(key: HelpForm["helpType"]) {
        setValue("helpType", key, { shouldValidate: true });
        moveTo(carFromLink && getValues("plateNumber") ? "contact" : "car");
    }

    return (
        <main className="base-landing min-h-screen overflow-x-hidden bg-white text-[#171717]">
            <LandingNav />

            <section className={(step === "help" ? "" : "hidden sm:block ") + "relative overflow-hidden px-4 pb-4 pt-[84px] text-left sm:px-8 sm:pb-12 sm:pt-28 sm:text-center md:pt-[132px] lg:px-16"}>
                <PixelCluster className="hidden sm:block left-[7%] top-[43%] opacity-40" heights={[12, 24, 40, 27, 17, 31, 14]} />
                <PixelCluster className="hidden sm:block right-[8%] top-[28%] opacity-45" heights={[15, 29, 49, 64, 47, 25, 12]} />
                <div className="relative z-10 mx-auto max-w-[900px]">
                    <p className="mb-5 hidden text-[14px] text-[#777] sm:block">Motor Ambos roadside help</p>
                    <h1 className="text-[28px] font-normal leading-[1.08] tracking-[-0.04em] sm:text-[56px]">Help when the road stops.</h1>
                    <p className="mx-auto mt-1.5 max-w-[650px] text-[15px] leading-[1.4] tracking-[-0.025em] text-[#777] sm:mt-6 sm:text-[18px] md:text-[20px]">Tell us what happened. We’ll help you find someone nearby.</p>
                </div>
            </section>

            <section id="help-flow" className={(step === "help" ? "pt-4" : "pt-[80px]") + " min-h-[100dvh] scroll-mt-16 bg-[#F7F7F7] px-4 " + (step === "providers" ? "pb-10" : "pb-32") + " sm:min-h-0 sm:scroll-mt-[76px] sm:px-8 sm:py-12 lg:px-16"}>
                <div className="mx-auto max-w-[960px]">
                    <div className="mb-4 sm:hidden" aria-live="polite">
                        <div className="flex items-baseline justify-between text-[13px]"><span className="text-[#777]">Step {progress} of 3</span><span className="text-[#171717]">{stepLabels[progress - 1]}</span></div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#E3E3E3]"><div className="h-full rounded-full bg-[#1111F6] transition-[width] duration-300" style={{ width: `${(progress / 3) * 100}%` }} /></div>
                    </div>
                    <div className="mb-10 hidden items-center justify-between gap-3 sm:flex">
                        {stepLabels.map((label, index) => (
                            <div key={label} className="flex flex-1 items-center gap-2.5">
                                <span className={index + 1 <= progress ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1111F6] text-[12px] text-white" : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DADADA] bg-white text-[12px] text-[#888]"}>{index + 1}</span>
                                <span className="text-[14px] text-[#555]">{label}</span>
                                {index < 2 && <span className="ml-auto h-px flex-1 bg-[#DADADA]" />}
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-4 sm:p-8 md:p-10">
                        {step !== "help" && (
                            <button type="button" onClick={() => moveTo(step === "providers" ? "contact" : step === "contact" ? (carFromLink ? "help" : "car") : "help")} className="-ml-1 mb-1 inline-flex min-h-11 items-center gap-1 text-[14px] text-[#666] hover:text-[#1111F6] sm:mb-8"><ChevronLeft className="h-4 w-4" />Back</button>
                        )}

                        {step === "help" && (
                            <div className="help-step-motion">
                                <h2 className="text-[26px] font-normal tracking-[-0.035em] sm:text-[32px] md:text-[40px]">What happened?</h2>
                                <p className="mt-1 text-[14px] text-[#777] sm:mt-3 sm:text-[16px]">Tap the help you need right now.</p>
                                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-4">
                                    {helpOptions.filter((option, index) => showMoreHelp || index < 4).map(({ key, label, hint, icon: Icon }) => (
                                        <button key={key} type="button" onClick={() => chooseHelp(key)} aria-pressed={helpType === key} className={helpType === key ? "min-h-[96px] rounded-[12px] border-2 border-[#1111F6] bg-[#F5F5FF] p-3 text-left sm:min-h-[150px] sm:p-4" : "min-h-[96px] rounded-[12px] border border-[#EAEAEA] bg-white p-3 text-left transition-colors active:bg-[#F5F5FF] hover:border-[#B8B8FF] sm:min-h-[150px] sm:p-4"}>
                                            <Icon className="mb-2 h-6 w-6 text-[#1111F6] sm:mb-6 sm:h-7 sm:w-7" strokeWidth={1.7} />
                                            <span className="block text-[15px] sm:text-[16px]">{label}</span>
                                            <span className="mt-0.5 block text-[12px] text-[#777] sm:mt-1">{hint}</span>
                                        </button>
                                    ))}
                                </div>
                                {!showMoreHelp && <button type="button" onClick={() => setShowMoreHelp(true)} className="mt-3 inline-flex min-h-11 items-center text-[14px] text-[#1111F6]">See fuel, electrical and other help <ChevronRight className="ml-1 h-4 w-4" /></button>}
                            </div>
                        )}

                        {step === "car" && (
                            <div className="help-step-motion">
                                <h2 className="text-[26px] font-normal tracking-[-0.035em] sm:text-[32px] md:text-[40px]">Which car needs help?</h2>
                                <p className="mt-2 text-[14px] text-[#777] sm:mt-3 sm:text-[16px]">Choose your car if you know it. Only the plate number is required.</p>
                                <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
                                    <label className="text-[14px] sm:col-span-2">Plate number<input className={inputClass + " mt-2 uppercase placeholder:normal-case"} placeholder="GW-1234-22" autoComplete="off" autoCapitalize="characters" autoCorrect="off" spellCheck={false} enterKeyHint="next" {...register("plateNumber")} />{errors.plateNumber && <span className="mt-1 block text-[12px] text-red-600">{errors.plateNumber.message}</span>}</label>
                                    <label className="text-[14px]">Make <span className="text-[#888]">(optional)</span>
                                        <select className={inputClass + " mt-2"} value={customMake ? "other" : carMake} onChange={(event) => {
                                            const make = event.target.value;
                                            setCustomMake(make === "other");
                                            setCustomModel(false);
                                            setValue("carMake", make === "other" ? "" : make);
                                            setValue("carModel", "");
                                        }}>
                                            <option value="">Select make</option>
                                            {Object.keys(modelsByMake).map((make) => <option key={make} value={make}>{make}</option>)}
                                            <option value="other">Another make</option>
                                        </select>
                                    </label>
                                    <label className="text-[14px]">Model <span className="text-[#888]">(optional)</span>
                                        {customMake ? <input className={inputClass + " mt-2"} placeholder="Type your model" autoComplete="off" {...register("carModel")} /> : (
                                            <select className={inputClass + " mt-2"} value={customModel ? "other" : carModel} disabled={!carMake} onChange={(event) => {
                                                const model = event.target.value;
                                                setCustomModel(model === "other");
                                                setValue("carModel", model === "other" ? "" : model);
                                            }}>
                                                <option value="">{carMake ? "Select model" : "Choose make first"}</option>
                                                {(modelsByMake[carMake] || []).map((model) => <option key={model} value={model}>{model}</option>)}
                                                <option value="other">Another model</option>
                                            </select>
                                        )}
                                    </label>
                                </div>
                                {customMake && <label className="mt-4 block text-[14px]">Make name<input className={inputClass + " mt-2"} placeholder="Type your car make" autoComplete="off" {...register("carMake")} /></label>}
                                {customModel && !customMake && <label className="mt-4 block text-[14px]">Model name<input className={inputClass + " mt-2"} placeholder="Type your car model" autoComplete="off" {...register("carModel")} /></label>}
                                <button type="button" onClick={() => setShowMoreCar(!showMoreCar)} className="mt-4 inline-flex min-h-11 items-center text-[14px] text-[#1111F6]">{showMoreCar ? "Hide" : "Add"} year and colour <ChevronRight className="ml-1 h-4 w-4" /></button>
                                {showMoreCar && <div className="mt-3 grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="car-year" className="text-[14px]">Year <span className="text-[#888]">(optional)</span></label>
                                        <select id="car-year" className={inputClass + " mt-2"} value={customYear ? "other" : carYear} onChange={(event) => {
                                            const year = event.target.value;
                                            setCustomYear(year === "other");
                                            setValue("carYear", year === "other" ? "" : year);
                                        }}>
                                            <option value="">Select year</option>
                                            {yearChoices.map((year) => <option key={year} value={year}>{year}</option>)}
                                            <option value="other">Older / another year</option>
                                        </select>
                                        {customYear && <label className="mt-3 block text-[14px]">Type year<input className={inputClass + " mt-2"} placeholder="1998" inputMode="numeric" maxLength={4} {...register("carYear")} /></label>}
                                    </div>
                                    <div>
                                        <label htmlFor="car-color" className="text-[14px]">Colour <span className="text-[#888]">(optional)</span></label>
                                        <select id="car-color" className={inputClass + " mt-2"} value={customColor ? "other" : carColor} onChange={(event) => {
                                            const color = event.target.value;
                                            setCustomColor(color === "other");
                                            setValue("carColor", color === "other" ? "" : color);
                                        }}>
                                            <option value="">Select colour</option>
                                            {colorChoices.map((color) => <option key={color} value={color}>{color}</option>)}
                                            <option value="other">Another colour</option>
                                        </select>
                                        {customColor && <label className="mt-3 block text-[14px]">Type colour<input className={inputClass + " mt-2"} placeholder="Your car's colour" autoComplete="off" {...register("carColor")} /></label>}
                                    </div>
                                </div>}
                            </div>
                        )}

                        {step === "contact" && (
                            <div className="help-step-motion">
                                <h2 className="text-[26px] font-normal tracking-[-0.035em] sm:text-[32px] md:text-[40px]">Where should help go?</h2>
                                <p className="mt-2 text-[14px] text-[#777] sm:mt-3 sm:text-[16px]">Share your current location to see nearby providers.</p>
                                {carFromLink && <button type="button" onClick={() => moveTo("car")} className="mt-4 inline-flex min-h-11 items-center text-[14px] text-[#1111F6]">Car from QR link: {getValues("plateNumber")} · Edit</button>}
                                <div className="mt-5 rounded-[12px] bg-[#F7F7F7] p-4 sm:mt-8 sm:p-5">
                                    <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1111F6]" /><div><h3 className="text-[17px]">Share your current location</h3><p className="mt-1 text-[14px] leading-relaxed text-[#777]">Location lets us find providers nearby. You choose who to call or message.</p></div></div>
                                    <button type="button" onClick={requestLocation} disabled={locBusy} className={(loc ? "border border-[#BFE3D2] bg-white text-[#277E62]" : "bg-[#1111F6] text-white") + " mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-[15px] disabled:opacity-60 sm:mt-5 sm:w-auto"}>{locBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : loc ? <Check className="h-4 w-4" /> : <Navigation className="h-4 w-4" />}{locBusy ? "Getting location…" : loc ? "Location shared" : "Use my location"}</button>
                                    {loc && <p className="mt-3 text-[13px] text-[#277E62]">Location ready · accuracy about {Math.round(loc.accuracy || 0)} m</p>}
                                    {locError && <p role="alert" className="mt-3 text-[13px] text-red-600">{locError}{carFromLink && " If you cannot share it, call the number printed on your sticker."}</p>}
                                </div>
                                <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
                                    <label className="text-[14px]">Your name<input className={inputClass + " mt-2"} placeholder="Your full name" autoComplete="name" autoCapitalize="words" enterKeyHint="next" {...register("fullName")} />{errors.fullName && <span className="mt-1 block text-[12px] text-red-600">{errors.fullName.message}</span>}</label>
                                    <label className="text-[14px]">Phone number<input className={inputClass + " mt-2"} placeholder="+233558508306" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="done" {...register("phone", { onBlur: (event) => setValue("phone", formatPhone(event.target.value), { shouldValidate: true }) })} />{errors.phone && <span className="mt-1 block text-[12px] text-red-600">{errors.phone.message}</span>}</label>
                                </div>
                            </div>
                        )}

                        {step === "providers" && (
                            <div className="help-step-motion">
                                <div className="flex items-end justify-between gap-4">
                                    <div><h2 className="text-[26px] font-normal tracking-[-0.035em] sm:text-[32px] md:text-[40px]">Nearby help.</h2><p className="mt-1 text-[14px] text-[#777] sm:mt-3 sm:text-[16px]">{loadingProviders ? "Looking for providers near you…" : providerError ? "We could not load nearby providers." : providers.length ? providers.length + " provider" + (providers.length === 1 ? "" : "s") + " found nearby." : "No providers found nearby right now."}</p></div>
                                    <button type="button" onClick={() => moveTo("contact")} className="inline-flex min-h-11 shrink-0 items-center text-[14px] text-[#1111F6]">Change location</button>
                                </div>
                                {loadingProviders ? <div className="flex items-center gap-3 py-12 text-[15px] text-[#777] sm:py-16"><Loader2 className="h-5 w-5 animate-spin text-[#1111F6]" />Searching nearby providers</div> : providerError || providers.length === 0 ? <div className="mt-5 rounded-[12px] border border-[#EAEAEA] bg-[#F7F7F7] p-5 text-[15px] text-[#666] sm:mt-8 sm:p-8">{providerError ? "Please go back and try again." : "Try a different help type or check your location and search again."}</div> : (
                                    <div className="mt-4 grid gap-3 sm:mt-8 sm:gap-4">
                                        {providers.map((provider) => (
                                            <ProviderCard key={provider.id} provider={provider} smsBody={"I need " + helpLabel + " help. Car: " + carForMessage(getValues()) + ". Location: https://maps.google.com/?q=" + loc?.lat + "," + loc?.lng + ". My name is " + getValues("fullName") + ". Call me on " + formatPhone(getValues("phone")) + "."} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {step !== "providers" && (
                        <div className={(step === "help" ? "hidden sm:flex " : "") + "fixed inset-x-0 bottom-0 z-30 border-t border-[#EAEAEA] bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:static sm:mt-6 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"}>
                            <p className="hidden text-[13px] text-[#888] sm:block">You choose the provider before any message is sent.</p>
                            <button type="button" onClick={onNext} disabled={step === "help" ? !helpType : step === "contact" ? !loc || loadingProviders : false} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] px-6 text-[16px] text-white transition-colors hover:bg-[#0606D8] disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-auto">
                                {step === "help" ? carFromLink && getValues("plateNumber") ? "Continue to location" : "Continue to vehicle" : step === "car" ? "Continue to location" : "Find nearby help"} <ChevronRight className="h-4 w-4" />
                            </button>
                            <p className="mt-2 text-center text-[12px] text-[#777] sm:hidden">You choose the provider before any message is sent.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="hidden px-5 py-20 sm:block sm:px-8 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] gap-5 md:grid-cols-3">
                    <div className="rounded-[12px] border border-[#ECECEC] p-6"><CircleAlert className="mb-5 h-7 w-7 text-[#1111F6]" /><h2 className="text-[18px]">Tell us what happened</h2><p className="mt-2 text-[15px] leading-[1.45] text-[#777]">Choose the type of help, then add your car details.</p></div>
                    <div className="rounded-[12px] border border-[#ECECEC] p-6"><MapPin className="mb-5 h-7 w-7 text-[#1111F6]" /><h2 className="text-[18px]">Find nearby providers</h2><p className="mt-2 text-[15px] leading-[1.45] text-[#777]">Share your location to see providers near you.</p></div>
                    <div className="rounded-[12px] border border-[#ECECEC] p-6"><Phone className="mb-5 h-7 w-7 text-[#1111F6]" /><h2 className="text-[18px]">Choose how to reach out</h2><p className="mt-2 text-[15px] leading-[1.45] text-[#777]">Review the provider and call or open a prepared message.</p></div>
                </div>
            </section>

            <section className="relative hidden overflow-hidden bg-[#1111F6] px-5 py-20 text-white sm:block sm:px-8 md:py-24 lg:px-16">
                <PixelCluster className="right-[10%] bottom-[-10%] opacity-55" heights={[22, 54, 90, 125, 158, 123, 75, 30]} />
                <div className="relative z-10 mx-auto max-w-[1136px]">
                    <h2 className="text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">Keep the essentials close.</h2>
                    <p className="mt-4 max-w-[460px] text-[16px] leading-[1.45] text-white/70">The driver app brings your car papers, reminders, and roadside help together.</p>
                    <Link href="/login" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-[#171717]"><BrandMark />Get started <ArrowRight className="h-4 w-4" /></Link>
                </div>
            </section>

            <div className="hidden sm:block"><LandingFooter /></div>
        </main>
    );
}
