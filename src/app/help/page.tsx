"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
    ChevronDown,
    Navigation,
    LocateFixed,
    ShieldCheck,
    Sparkles,
    Store,
    Zap,
    X,
    ExternalLink
} from "lucide-react";
import { createRequest, findProvidersNear } from "@/lib/supaFetch";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

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
        { key: "fuel", label: "Fuel", Icon: Droplets, hint: "Out of gas", color: "text-[#2D5B18] bg-[#9FE870]/10" },
        { key: "electrical", label: "Electrical", Icon: Zap, hint: "AC / Wiring", color: "text-yellow-600 bg-yellow-50" },
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
        <div className="min-h-screen bg-[#F0F2F5] pb-40">
            <Navbar />

            {/* Wizard Header */}
            <div className="bg-white border-b border-border py-4 sticky top-[72px] z-40">
                <div className="wise-container flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "help" && (
                            <button onClick={() => setStep(step === "providers" ? "contact" : step === "contact" ? "car" : "help")} className="p-2 hover:bg-[#F0F2F5] rounded-full transition-colors">
                                <ChevronLeft size={24} className="text-[#5D7079]" />
                            </button>
                        )}
                        <h2 className="text-xl font-black tracking-tight uppercase">
                            {step === "help" && "Service Type"}
                            {step === "car" && "Vehicle Details"}
                            {step === "contact" && "Your Location"}
                            {step === "providers" && "Nearby Help"}
                        </h2>
                    </div>
                    <div className="w-32 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#9FE870] transition-all duration-700" style={{ width: `${progressValue}%` }} />
                    </div>
                </div>
            </div>

            <main className="wise-container max-w-2xl pt-12">
                <div className="space-y-10">
                    {step === "help" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">What do <br /> you need?</h1>
                                <p className="wise-body">Select the type of assistance required for your vehicle.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {HELP_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setValue("helpType", opt.key, { shouldValidate: true })}
                                        className={cn(
                                            "wise-card !p-8 flex flex-col items-start gap-8 transition-all relative overflow-hidden",
                                            helpType === opt.key ? "!bg-black text-white shadow-wise-lg" : "hover:border-[#9FE870]/30"
                                        )}
                                    >
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", helpType === opt.key ? "bg-white/10" : opt.color)}>
                                            <opt.Icon size={28} />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-base font-black tracking-tight block uppercase">{opt.label}</span>
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", helpType === opt.key ? "text-[#9FE870]" : "text-[#5D7079]")}>{opt.hint}</span>
                                        </div>
                                        {helpType === opt.key && <div className="absolute top-4 right-4 w-2 h-2 bg-[#9FE870] rounded-full animate-pulse" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === "car" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">Vehicle intel.</h1>
                                <p className="wise-body">Tell us about the vehicle that needs assistance.</p>
                            </div>
                            <div className="wise-card !p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <WiseInput label="Make" placeholder="Toyota" {...register("carMake")} />
                                    <WiseInput label="Model" placeholder="Corolla" {...register("carModel")} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <WiseInput label="Year" placeholder="2020" {...register("carYear")} />
                                    <WiseInput label="Color" placeholder="Silver" {...register("carColor")} />
                                </div>
                                <WiseInput label="Plate Number" placeholder="GW-1234-22" {...register("plateNumber")} className="uppercase" />
                            </div>
                        </div>
                    )}

                    {step === "contact" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">Secure sync.</h1>
                                <p className="wise-body">Enter your details and share your coordinates.</p>
                            </div>
                            <div className="wise-card !p-10 space-y-8">
                                <WiseInput label="Full Name" placeholder="John Doe" {...register("fullName")} />
                                <WiseInput label="Phone Number" placeholder="054..." {...register("phone")} icon={<Phone size={18} />} />

                                <div className="pt-6 border-t border-border space-y-6">
                                    <div className="flex items-start gap-4 p-5 bg-[#F0F2F5] rounded-[20px] border border-border">
                                        <MapPin className="text-[#9FE870] shrink-0" size={24} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-black uppercase tracking-tighter">Geospatial Data</p>
                                            <p className="text-xs font-bold text-[#5D7079]">Required to find providers within your immediate radius.</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={requestLocation}
                                        disabled={locBusy}
                                        className={cn(
                                            "w-full py-8 rounded-[24px] border-2 flex items-center justify-center gap-4 transition-all active:scale-95",
                                            loc ? "bg-white border-[#9FE870] text-black" : "bg-black border-black text-white"
                                        )}
                                    >
                                        {locBusy ? <Loader2 className="animate-spin" size={24} /> : loc ? <LocateFixed size={24} /> : <Navigation size={24} />}
                                        <span className="text-sm font-black uppercase tracking-widest">
                                            {loc ? "Coordinates Latched" : "Share GPS Location"}
                                        </span>
                                    </button>

                                    {loc && (
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                                {loc.lat.toFixed(6)}, {loc.lng.toFixed(6)} • ±{Math.round(loc.accuracy || 0)}m
                                            </p>
                                        </div>
                                    )}
                                    {locError && <p className="text-xs text-red-600 text-center font-bold">Error: {locError}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "providers" && (
                        <div className="space-y-10">
                            <div className="flex items-end justify-between">
                                <div className="space-y-2">
                                    <h1 className="wise-heading-section !leading-none">Active nodes.</h1>
                                    <p className="text-sm font-bold text-[#5D7079] uppercase tracking-widest">{providers?.length || 0} units nearby</p>
                                </div>
                                <button onClick={() => setStep("contact")} className="text-[10px] font-black uppercase tracking-widest text-[#5D7079] border-b border-[#5D7079] pb-1 hover:text-black transition-colors">
                                    Change Location
                                </button>
                            </div>

                            {loadingProviders ? (
                                <div className="py-20 flex flex-col items-center gap-6">
                                    <Loader2 className="animate-spin text-[#9FE870]" size={48} />
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5D7079]">Scanning Infrastructure...</p>
                                </div>
                            ) : providers?.length ? (
                                <div className="space-y-6">
                                    {providers.map(p => (
                                        <WiseProviderCard
                                            key={p.id}
                                            provider={p}
                                            smsBody={`I need ${helpType} help. Car: ${getValues("carMake")} ${getValues("carModel")} (${getValues("plateNumber")}). Loc: https://maps.google.com/?q=${loc?.lat},${loc?.lng} ${getValues("phone")}`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="wise-card !p-20 text-center border-dashed">
                                    <MapPin size={48} className="mx-auto mb-6 text-[#5D7079]/20" />
                                    <p className="text-sm font-bold text-[#5D7079] uppercase tracking-[0.2em]">No providers found in this sector.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-border z-50">
                <div className="wise-container max-w-2xl">
                    <button
                        onClick={onNext}
                        disabled={step === "help" ? !helpType : step === "car" ? !carSectionValid : step === "contact" ? (!contactSectionValid || !loc) : false}
                        className="wise-btn-primary w-full !py-6 !text-xl flex items-center justify-center gap-4 active:scale-95 shadow-wise-lg disabled:opacity-30 disabled:grayscale"
                    >
                        {step === "contact" && loadingProviders ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                {step === "help" && "Vehicle Details"}
                                {step === "car" && "Share Location"}
                                {step === "contact" && "Find Providers"}
                                {step === "providers" && "Request Service"}
                                <ArrowRight size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function WiseInput({ label, icon, className, ...props }: any) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">{label}</label>
            <div className="relative group">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5D7079]">{icon}</div>}
                <input
                    className={cn(
                        "w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-5 px-6 text-xl font-bold outline-none transition-all placeholder:text-[#5D7079]/30",
                        icon && "pl-14",
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}

function WiseProviderCard({ provider, smsBody }: { provider: Provider, smsBody: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="wise-card !p-0 overflow-hidden group">
            {/* Backdrop / Logo */}
            <div className="relative h-48 bg-[#F0F2F5]">
                {provider.backdrop_url ? (
                    <img src={provider.backdrop_url} className="w-full h-full object-cover brightness-95" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#5D7079]/20 font-black text-6xl">
                        {provider.name.charAt(0)}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-8 flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-wise-lg">
                        <img src={provider.logo_url || "https://avatar.vercel.sh/" + provider.name} className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            {provider.name}
                            {provider.is_verified && <BadgeCheck size={20} className="text-[#9FE870]" />}
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] font-black text-white/70 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-[#9FE870]"><Star size={12} className="fill-current" /> {provider.rating || 'New'}</span>
                            <span>•</span>
                            <span>{provider.distance_km.toFixed(1)} KM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="flex gap-4">
                    <div className="px-4 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase text-[#5D7079]">Fee: GH₵{provider.min_callout_fee || '—'}</div>
                    <div className="px-4 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase text-[#5D7079]">Radius: {provider.coverage_radius_km || '—'} KM</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <a href={`tel:${provider.phone}`} className="wise-btn-secondary !py-4 flex items-center justify-center gap-3">
                        <Phone size={18} /> Call Node
                    </a>
                    <button onClick={() => setOpen(true)} className="wise-btn-primary !py-4 flex items-center justify-center gap-3">
                        <MessageCircle size={18} /> Request
                    </button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-[32px] p-10 max-w-md border-none shadow-2xl">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                Secure Data Link
                            </div>
                            <h2 className="text-3xl font-black tracking-tight uppercase">Transmit Protocol.</h2>
                        </div>
                        <div className="p-6 bg-[#F0F2F5] rounded-[24px] text-sm font-bold text-[#5D7079] leading-relaxed italic border border-border">
                            "{smsBody}"
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setOpen(false)} className="wise-btn-secondary flex-1">Abort</button>
                            <a href={`sms:${provider.phone}?body=${encodeURIComponent(smsBody)}`} className="wise-btn-primary flex-1 text-center flex items-center justify-center gap-3">
                                Transmit <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}