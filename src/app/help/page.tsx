"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    LucideIcon,
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
    Navigation,
    LocateFixed,
    ShieldCheck,
    Sparkles,
    Store,
    Zap,
    X,
} from "lucide-react";
import { findProvidersNear } from "@/lib/supaFetch";
import { StripeNavbar, StripeFooter } from "@/components/stripe-landing/Sections";

/* ───────────────────────────────
   Types & Logic
   ─────────────────────────────── */

const HelpSchema = z.object({
    helpType: z.enum(["battery", "tire", "oil", "tow", "rescue", "fuel", "roadworthy", "insurance", "detailing", "car_wash", "shop", "electrical"]),
    carMake: z.string().min(2, "Car make is required"),
    carModel: z.string().min(1, "Car model is required"),
    carYear: z.string().length(4, "4 digits").regex(/^\d{4}$/, "4 digits"),
    carColor: z.string().min(2, "Required"),
    plateNumber: z.string().min(2, "Required"),
    fullName: z.string().min(2, "Required"),
    phone: z.string().min(7, "Invalid phone").regex(/^[0-9+\-\s()]{7,}$/, "Invalid format"),
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
    color: string;
}> = [
        { key: "battery", label: "Battery", Icon: BatteryCharging, hint: "Jumpstart", color: "text-orange-600 bg-orange-50" },
        { key: "tire", label: "Flat Tyre", Icon: Disc, hint: "Change / Pump", color: "text-slate-600 bg-slate-50" },
        { key: "tow", label: "Towing", Icon: Truck, hint: "Move Vehicle", color: "text-blue-600 bg-blue-50" },
        { key: "rescue", label: "Rescue", Icon: AlertTriangle, hint: "Stuck", color: "text-red-600 bg-red-50" },
        { key: "fuel", label: "Fuel", Icon: Droplets, hint: "Out of gas", color: "text-[#00C767] bg-[#00C767]/10" },
        { key: "electrical", label: "Electrical", Icon: Zap, hint: "AC / Wiring", color: "text-amber-500 bg-amber-50" },
        { key: "shop", label: "Auto Shop", Icon: Store, hint: "Parts", color: "text-amber-600 bg-amber-50" },
        { key: "detailing", label: "Detailing", Icon: Sparkles, hint: "Polish", color: "text-purple-600 bg-purple-50" },
    ];

/* ───────────────────────────────
   Main Component
   ─────────────────────────────── */
export default function GetHelpWizardPage() {
    const [step, setStep] = useState<StepKey>("help");
    const [loc, setLoc] = useState<GeoFix | null>(null);
    const [locBusy, setLocBusy] = useState(false);
    const [locError, setLocError] = useState<string | null>(null);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [providers, setProviders] = useState<Provider[] | null>(null);

    const form = useForm<HelpForm>({
        resolver: zodResolver(HelpSchema),
        defaultValues: {
            helpType: undefined as any,
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
    const carFields = watch(["carMake", "carModel", "carYear", "carColor", "plateNumber"]);
    const contactFields = watch(["fullName", "phone"]);

    const carSectionValid = useMemo(() => carFields.every(f => f && f.length >= 1), [carFields]);
    const contactSectionValid = useMemo(() => contactFields.every(f => f && f.length >= 2), [contactFields]);

    async function requestLocation() {
        setLocBusy(true);
        setLocError(null);
        if (!navigator.geolocation) {
            setLocError("Geolocation not supported");
            setLocBusy(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: pos.timestamp });
                setLocBusy(false);
            },
            (err) => {
                setLocError(err.message);
                setLocBusy(false);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    }

    async function onSubmit(values: HelpForm) {
        if (!loc) { setLocError("Location required"); return; }
        setLoadingProviders(true);
        try {
            const list = await findProvidersNear(values.helpType, loc.lat, loc.lng);
            setProviders(list.sort((a, b) => a.distance_km - b.distance_km));
            setStep("providers");
        } catch {
            setProviders([]);
            setStep("providers");
        } finally {
            setLoadingProviders(false);
        }
    }

    const onNext = async () => {
        if (step === "help") setStep("car");
        else if (step === "car") {
            const ok = await trigger(["carMake", "carModel", "carYear", "carColor", "plateNumber"]);
            if (ok) setStep("contact");
        } else if (step === "contact") {
            await handleSubmit(onSubmit)();
        }
        window.scrollTo(0, 0);
    };

    const progressValue = useMemo(() => {
        const idx = ["help", "car", "contact", "providers"].indexOf(step);
        return ((idx + 1) / 4) * 100;
    }, [step]);

    return (
        <main className="bg-white min-h-screen selection:bg-[#00C767]/20 w-full overflow-x-hidden font-jakarta">
            <StripeNavbar />

            {/* Wizard Navigation Progress */}
            <div className="fixed top-[72px] inset-x-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "help" && (
                            <button
                                onClick={() => setStep(step === "providers" ? "contact" : step === "contact" ? "car" : "help")}
                                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                            >
                                <ChevronLeft size={20} className="text-[#171717]" />
                            </button>
                        )}
                        <h2 className="text-[14px] font-bold text-[#171717] uppercase tracking-[0.15em]">
                            {step === "help" && "Type"}
                            {step === "car" && "Vehicle"}
                            {step === "contact" && "Sync"}
                            {step === "providers" && "Nodes"}
                        </h2>
                    </div>
                    <div className="flex-1 max-w-[200px] h-1.5 bg-slate-100 rounded-full mx-4 md:mx-8 overflow-hidden">
                        <div className="h-full bg-[#00C767] transition-all duration-700" style={{ width: `${progressValue}%` }} />
                    </div>
                </div>
            </div>

            <div className="pt-40 pb-48 px-6 md:px-12 bg-white min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {step === "help" && (
                            <div className="space-y-12">
                                <div className="space-y-4 md:space-y-6">
                                    <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em]">What do <br /> you need?</h1>
                                    <p className="text-[17px] md:text-[19px] font-medium text-slate-500 max-w-md opacity-80">Select the type of assistance required for your vehicle unit.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {HELP_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setValue("helpType", opt.key, { shouldValidate: true })}
                                            className={cn(
                                                "p-8 flex flex-col items-start gap-8 rounded-[32px] border transition-all relative overflow-hidden text-left",
                                                helpType === opt.key
                                                    ? "bg-[#171717] border-[#171717] text-white shadow-2xl shadow-black/10"
                                                    : "bg-white border-slate-100 hover:border-[#00C767]/30 shadow-sm"
                                            )}
                                        >
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", helpType === opt.key ? "bg-white/10" : opt.color)}>
                                                <opt.Icon size={28} />
                                            </div>
                                            <div>
                                                <span className="text-[20px] font-extrabold tracking-tight block uppercase">{opt.label}</span>
                                                <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", helpType === opt.key ? "text-[#00C767]" : "text-slate-400")}>{opt.hint}</span>
                                            </div>
                                            {helpType === opt.key && <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#00C767] rounded-full shadow-[0_0_12px_#00C767]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === "car" && (
                            <div className="space-y-12">
                                <div className="space-y-4 md:space-y-6">
                                    <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em]">Vehicle intel.</h1>
                                    <p className="text-[17px] md:text-[19px] font-medium text-slate-500 max-w-md opacity-80">Tell us about the vehicle that needs assistance.</p>
                                </div>
                                <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-6 md:space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <PremiumWizardInput label="Make" placeholder="Toyota" {...register("carMake")} />
                                        <PremiumWizardInput label="Model" placeholder="Corolla" {...register("carModel")} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <PremiumWizardInput label="Year" placeholder="2020" {...register("carYear")} />
                                        <PremiumWizardInput label="Color" placeholder="Silver" {...register("carColor")} />
                                    </div>
                                    <PremiumWizardInput label="Plate Number" placeholder="GW-1234-22" {...register("plateNumber")} className="uppercase" />
                                </div>
                            </div>
                        )}

                        {step === "contact" && (
                            <div className="space-y-12">
                                <div className="space-y-4 md:space-y-6">
                                    <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em]">Secure sync.</h1>
                                    <p className="text-[17px] md:text-[19px] font-medium text-slate-500 max-w-md opacity-80">Enter your details and share your coordinates with the network.</p>
                                </div>
                                <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-8 md:space-y-10">
                                    <div className="space-y-8">
                                        <PremiumWizardInput label="Full Name" placeholder="John Doe" {...register("fullName")} />
                                        <PremiumWizardInput label="Phone Number" placeholder="054..." {...register("phone")} icon={<Phone size={18} />} />
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 space-y-8">
                                        <div className="flex items-start gap-4 p-6 bg-[#F8FAFF] rounded-[24px] border border-slate-100">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#00C767] shadow-sm shrink-0">
                                                <MapPin size={22} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#171717]">Geospatial Node Required</p>
                                                <p className="text-[14px] font-medium text-slate-500 leading-relaxed">Necessary to find verified providers within your immediate sector.</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={requestLocation}
                                            disabled={locBusy}
                                            className={cn(
                                                "w-full py-6 md:py-8 rounded-[20px] md:rounded-[24px] border-2 flex items-center justify-center gap-3 md:gap-4 transition-all active:scale-[0.98] font-bold text-[15px] md:text-[18px]",
                                                loc
                                                    ? "bg-white border-[#00C767] text-[#00C767]"
                                                    : "bg-[#171717] border-[#171717] text-white shadow-xl shadow-black/10"
                                            )}
                                        >
                                            {locBusy ? <Loader2 className="animate-spin" size={20} /> : loc ? <Check size={20} /> : <Navigation size={20} />}
                                            <span className="uppercase tracking-[0.15em]">
                                                {loc ? "Coordinates Latched" : "Share GPS Location"}
                                            </span>
                                        </button>

                                        {loc && (
                                            <div className="text-center">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00C767]">
                                                    {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)} • ±{Math.round(loc.accuracy || 0)}m
                                                </p>
                                            </div>
                                        )}
                                        {locError && <p className="text-sm text-red-600 text-center font-bold">Error: {locError}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === "providers" && (
                            <div className="space-y-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-3">
                                        <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em]">Active nodes.</h1>
                                        <p className="text-[14px] font-bold text-[#00C767] uppercase tracking-[0.2em]">{providers?.length || 0} units nearby in sector</p>
                                    </div>
                                    <button onClick={() => setStep("contact")} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#171717] transition-colors border-b-2 border-slate-100 pb-1 w-fit">
                                        Adjust Scan Node
                                    </button>
                                </div>

                                {loadingProviders ? (
                                    <div className="py-32 flex flex-col items-center gap-8">
                                        <div className="relative w-24 h-24">
                                            <div className="absolute inset-0 rounded-full border-4 border-[#00C767]/10 animate-ping opacity-20" />
                                            <div className="absolute inset-0 rounded-full border-4 border-[#00C767] border-t-transparent animate-spin" />
                                        </div>
                                        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#00C767]">Scanning Infrastructure...</p>
                                    </div>
                                ) : providers?.length ? (
                                    <div className="grid grid-cols-1 gap-8">
                                        {providers.map(p => (
                                            <PremiumProviderCard
                                                key={p.id}
                                                provider={p}
                                                smsBody={`I need ${helpType} help. Car: ${getValues("carMake")} ${getValues("carModel")} (${getValues("plateNumber")}). Loc: https://maps.google.com/?q=${loc?.lat},${loc?.lng} — Requesting unit: ${getValues("fullName")}`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 p-24 rounded-[48px] text-center border-2 border-dashed border-slate-200">
                                        <MapPin size={48} className="mx-auto mb-8 text-slate-200" />
                                        <p className="text-[16px] font-bold text-slate-400 uppercase tracking-[0.2em]">No providers found in this immediate sector.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Sticky Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-white/80 md:bg-white/40 backdrop-blur-3xl border-t border-slate-100 z-50 transition-all duration-500">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={onNext}
                        disabled={step === "help" ? !helpType : step === "car" ? !carSectionValid : step === "contact" ? (!contactSectionValid || !loc) : step === "providers"}
                        className="bg-[#171717] w-full py-5 md:py-7 text-white rounded-[20px] md:rounded-[24px] font-bold text-[16px] md:text-[20px] flex items-center justify-center gap-3 md:gap-4 active:scale-[0.98] shadow-2xl shadow-black/10 disabled:opacity-30 disabled:grayscale transition-all"
                    >
                        {step === "contact" && loadingProviders ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                {step === "help" && "Vehicle Details"}
                                {step === "car" && "Share Location"}
                                {step === "contact" && "Identify Nodes"}
                                {step === "providers" && "Select Provider"}
                                <ArrowRight size={24} className="text-[#00C767]" />
                            </>
                        )}
                    </button>
                    {step === "providers" && (
                        <p className="text-center mt-4 text-[11px] font-bold text-[#525252] uppercase tracking-widest opacity-40">Select a provider above to initialize protocol</p>
                    )}
                </div>
            </div>
        </main>
    );
}

function PremiumWizardInput({ label, icon, className, ...props }: any) {
    return (
        <div className="space-y-4 w-full">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#525252] ml-1 opacity-60">{label}</label>
            <div className="relative group">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00C767] transition-colors">{icon}</div>}
                <input
                    className={cn(
                        "w-full bg-[#F8FAFF] border border-slate-100 rounded-[20px] py-5 px-6 text-[18px] font-bold text-[#171717] outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:border-[#00C767] focus:ring-4 focus:ring-[#00C767]/5",
                        icon && "pl-14",
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}

function PremiumProviderCard({ provider, smsBody }: { provider: Provider, smsBody: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-500">
            {/* Provider Visual Branding */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
                {provider.backdrop_url ? (
                    <img src={provider.backdrop_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={provider.name} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#171717] to-slate-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10 flex flex-row items-center gap-3 md:gap-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[16px] md:rounded-[28px] p-1.5 shadow-2xl flex items-center justify-center">
                        <img
                            src={provider.logo_url || "https://avatar.vercel.sh/" + provider.name}
                            className="w-full h-full object-contain rounded-[12px] md:rounded-[22px]"
                            alt={provider.name}
                        />
                    </div>
                    <div>
                        <h3 className="text-[20px] md:text-[28px] font-extrabold text-white tracking-tight flex items-center gap-2 md:gap-3">
                            {provider.name}
                            {provider.is_verified && <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-[#00C767]" />}
                        </h3>
                        <div className="flex items-center gap-5 mt-2">
                            <div className="flex items-center gap-2 text-[#00C767]">
                                <Star size={16} className="fill-current" />
                                <span className="text-[14px] font-bold">{provider.rating || 'New'}</span>
                            </div>
                            <div className="h-4 w-px bg-white/20" />
                            <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest">{provider.distance_km.toFixed(1)} KM Range</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 space-y-6 md:space-y-10">
                <div className="flex flex-wrap gap-2 md:gap-4">
                    <div className="px-5 py-2 bg-slate-50 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 border border-slate-100">
                        Min. Fee: <span className="text-[#171717]">GH₵{provider.min_callout_fee || '—'}</span>
                    </div>
                    <div className="px-5 py-2 bg-slate-50 rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500 border border-slate-100">
                        Reputation: <span className="text-[#171717]">{provider.jobs || 0}+ Jobs</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href={`tel:${provider.phone}`}
                        className="flex-1 bg-white text-[#171717] border border-slate-200 py-5 rounded-2xl font-bold text-[16px] hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Phone size={20} className="text-[#00C767]" /> Direct Call
                    </a>
                    <button
                        onClick={() => setOpen(true)}
                        className="flex-1 bg-[#171717] text-white py-5 rounded-2xl font-bold text-[16px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 active:scale-[0.98]"
                    >
                        <MessageCircle size={20} className="text-[#00C767]" /> Initialize Unit
                    </button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-[24px] sm:rounded-[40px] p-6 sm:p-12 max-w-lg border-none shadow-2xl bg-white focus:outline-none w-[90vw] sm:w-full">
                    <div className="space-y-6 sm:space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C767]/10 rounded-full text-[12px] font-bold uppercase tracking-[0.15em] text-[#00C767] border border-[#00C767]/10">
                                <ShieldCheck size={14} />
                                L0 Dispatch Protocol
                            </div>
                            <h2 className="text-[32px] font-extrabold text-[#171717] tracking-tight leading-none uppercase">Transmit intel.</h2>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-[32px] text-[16px] font-medium text-slate-500 leading-relaxed italic border border-slate-100 relative">
                            <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#00C767]">
                                <MessageCircle size={20} />
                            </div>
                            "{smsBody}"
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setOpen(false)} className="flex-1 bg-white text-[#171717] border border-slate-200 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all">Abort</button>
                            <a
                                href={`sms:${provider.phone}?body=${encodeURIComponent(smsBody)}`}
                                className="flex-1 bg-[#171717] text-white py-5 rounded-2xl font-bold text-center flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-black/10"
                            >
                                Dispatch <ArrowRight size={20} className="text-[#00C767]" />
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function Check(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}