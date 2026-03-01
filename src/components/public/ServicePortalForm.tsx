"use client";

import React, { useState, useEffect } from "react";
import {
    Car,
    ShieldCheck,
    Wrench,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    Loader2,
    Info,
    Zap,
    Hash,
    FileText,
    Droplets,
    Disc,
    BatteryCharging,
    Circle,
    Camera,
    X,
    Wallet,
    Fingerprint,
    Timer,
    Check,
    Activity,
    AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadProviderAsset } from "@/lib/supaFetch";
import Link from "next/link";

type StepKey = "PLATE" | "OTP" | "LOG" | "SUCCESS";

const SERVICE_OPTIONS = [
    { id: "oil", label: "Oil Change", Icon: Droplets },
    { id: "brakes", label: "Brake Pads", Icon: Disc },
    { id: "battery", label: "Battery Unit", Icon: BatteryCharging },
    { id: "tires", label: "Tire System", Icon: Circle },
    { id: "ac", label: "Electrical / AC", Icon: Zap },
    { id: "suspension", label: "Suspension", Icon: ShieldCheck },
    { id: "inspection", label: "Diagnostic", Icon: Info },
    { id: "general", label: "General Service", Icon: Wrench },
];

export function ServicePortalForm() {
    const [step, setStep] = useState<StepKey>("PLATE");
    const [loading, setLoading] = useState(false);

    // Form State
    const [plateNumber, setPlateNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [phoneLabel, setPhoneLabel] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [vehicleDetails, setVehicleDetails] = useState<{
        make: string;
        model: string;
        year: string;
        color: string;
    } | null>(null);

    // Workshop Memory & OTP Timer
    const [resendTimer, setResendTimer] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [logData, setLogData] = useState({
        notes: "",
        providerName: "",
        mileage: "",
        cost: "",
        documentUrl: ""
    });

    useEffect(() => {
        const savedWorkshop = localStorage.getItem("motorambos_last_workshop");
        if (savedWorkshop) {
            setLogData(prev => ({ ...prev, providerName: savedWorkshop }));
        }
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const stepsOrder: StepKey[] = ["PLATE", "OTP", "LOG", "SUCCESS"];
    const activeIndex = stepsOrder.indexOf(step);
    const progressPercent = ((activeIndex) / (stepsOrder.length - 1)) * 100;

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleRequestOtp = async () => {
        const plate = plateNumber.trim();
        if (!plate) return toast.error("Please enter a plate number");

        setLoading(true);
        setFormError(null);
        try {
            const res = await fetch("/api/service-portal/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plateNumber: plate })
            });
            const data = await res.json();

            if (res.ok) {
                setPhoneLabel(data.phoneLabel);
                setVehicleDetails(data.vehicle);
                setStep("OTP");
                setResendTimer(60);
                toast.success(data.message);
                window.scrollTo(0, 0);
            } else {
                setFormError(data.error || "Failed to identify vehicle");
                toast.error(data.error || "Failed to identify vehicle");
            }
        } catch (err) {
            setFormError("Connection error. Please try again.");
            toast.error("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const path = `service-log-${plateNumber.replace(/\s+/g, "-")}`;
            const url = await uploadProviderAsset(file, path);
            setLogData(prev => ({ ...prev, documentUrl: url }));
            toast.success("Identity verified via asset capture!");
        } catch (err) {
            toast.error("Failed to upload photo. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmitLog = async () => {
        const code = otpCode.trim();
        if (!code) return toast.error("Please enter the verification code");
        if (code.length < 4) return toast.error("Verification code must be 4 digits");
        if (!logData.mileage || selectedServices.length === 0) {
            return toast.error("Please select a service and enter mileage");
        }

        const description = [
            ...selectedServices.map(id => SERVICE_OPTIONS.find(o => o.id === id)?.label),
            logData.notes.trim()
        ].filter(Boolean).join(", ");

        setLoading(true);
        setFormError(null);
        try {
            const res = await fetch("/api/service-portal/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plateNumber: plateNumber.trim(),
                    code: code,
                    serviceData: {
                        ...logData,
                        description
                    }
                })
            });
            const data = await res.json();

            if (res.ok) {
                if (logData.providerName.trim()) {
                    localStorage.setItem("motorambos_last_workshop", logData.providerName.trim());
                }
                setStep("SUCCESS");
                toast.success("Service record verified and saved!");
            } else {
                setFormError(data.error || "Submission failed");
                toast.error(data.error || "Submission failed");
            }
        } catch (err) {
            setFormError("Connection error. Failed to save log.");
            toast.error("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === "SUCCESS") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in scale-in-95 fade-in duration-700 bg-white font-jakarta">
                <div className="relative w-40 h-40 mb-12">
                    <div className="absolute inset-0 bg-[#00C767]/10 rounded-full blur-[60px] animate-pulse" />
                    <div className="relative h-full w-full bg-white border-4 border-[#00C767]/20 rounded-full flex items-center justify-center text-[#00C767] shadow-2xl">
                        <CheckCircle2 className="h-20 w-20" strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-4 mb-12">
                    <h1 className="text-[40px] font-extrabold tracking-tight text-[#171717] leading-none uppercase">Sequence Logged</h1>
                    <p className="text-[17px] font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">
                        The maintenance integrity for <span className="text-[#171717] font-bold">{plateNumber}</span> has been securely updated in the Ambos Ledger.
                    </p>
                </div>
                <button
                    className="bg-[#171717] text-white px-12 py-6 rounded-2xl font-bold text-[16px] flex items-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-black/10"
                    onClick={() => window.location.reload()}
                >
                    Log New Unit <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 font-jakarta pb-40 selection:bg-[#00C767]/20 selection:text-[#171717]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#00C767] rounded-full flex items-center justify-center text-white">
                                <Activity size={16} />
                            </div>
                            <span className="font-bold text-[18px] tracking-tight">motor ambos</span>
                        </Link>
                        <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]/40 hidden md:block">
                            Service Verification Portal
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#171717]/40">Progress</span>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00C767] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 pt-16">
                <div className="space-y-12">
                    {/* Back Button */}
                    {step !== "PLATE" && (
                        <button
                            onClick={() => setStep(step === "LOG" ? "OTP" : "PLATE")}
                            className="flex items-center gap-2 text-slate-400 font-bold text-[12px] uppercase tracking-widest hover:text-[#171717] transition-colors"
                        >
                            <ChevronLeft size={16} /> Previous Protocol
                        </button>
                    )}

                    {formError && (
                        <div className="p-5 bg-red-50 border border-red-100 rounded-[20px] flex items-center gap-4 text-red-500 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            <span className="text-[13px] font-bold uppercase tracking-wide leading-tight">{formError}</span>
                        </div>
                    )}

                    {/* Active Vehicle Node */}
                    {(step === "OTP" || step === "LOG") && vehicleDetails && (
                        <div className="bg-[#171717] text-white p-8 rounded-[36px] flex items-center gap-6 shadow-2xl shadow-black/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none" />
                            <div className="w-16 h-16 rounded-[20px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <Car size={32} className="text-[#00C767]" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Active Node</span>
                                <h3 className="text-[20px] font-extrabold tracking-tight leading-none uppercase">
                                    {vehicleDetails.color} {vehicleDetails.make} {vehicleDetails.model}
                                </h3>
                                <p className="text-[12px] font-bold text-[#00C767] uppercase tracking-widest">{plateNumber} • {vehicleDetails.year}</p>
                            </div>
                        </div>
                    )}

                    {step === "PLATE" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C767]/10 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C767] mb-2">
                                    <Fingerprint size={14} />
                                    Identity Verification
                                </div>
                                <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-extrabold tracking-[-0.05em] text-[#171717] leading-[0.95]">
                                    Record <br /> unit history.
                                </h1>
                                <p className="text-[15px] sm:text-[17px] md:text-[19px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest opacity-60">
                                    Enter the vehicle plate sequence to initialize the secure maintenance ledger.
                                </p>
                            </div>

                            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-6 md:space-y-10">
                                <PremiumInput
                                    label="Vehicle Plate Number"
                                    placeholder="GW-1234-22"
                                    value={plateNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlateNumber(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                                    <ShieldCheck className="text-[#00C767] shrink-0" size={24} />
                                    <p className="text-[12px] font-bold text-[#171717]/60 uppercase tracking-widest leading-relaxed">
                                        Compliance protocol requires the owner to verify this entry via a secure OTP sequence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "OTP" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C767]/10 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C767] mb-2">
                                    <Timer size={14} />
                                    Authorization Window
                                </div>
                                <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-extrabold tracking-[-0.05em] text-[#171717] leading-[0.95]">
                                    Authorize <br /> entry.
                                </h1>
                                <p className="text-[15px] sm:text-[17px] md:text-[19px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest opacity-60">
                                    A 4-digit synchronization code was sent to <span className="text-[#171717] font-bold">{phoneLabel}</span>.
                                </p>
                            </div>

                            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-8 md:space-y-12">
                                <div className="space-y-6 text-center">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#171717]/40 mb-2 block">Control Code</label>
                                    <div className="flex justify-center gap-2 sm:gap-4">
                                        {[0, 1, 2, 3].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-slate-50 border-2 border-transparent rounded-[20px] md:rounded-[24px] text-center text-[28px] sm:text-[32px] md:text-[40px] font-extrabold text-[#171717] outline-none transition-all focus:border-[#00C767] focus:bg-white focus:shadow-xl focus:shadow-[#00C767]/10"
                                                value={otpCode[i] || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const val = e.target.value.replace(/\D/g, "");
                                                    const newOtp = otpCode.split("");
                                                    if (val) {
                                                        newOtp[i] = val;
                                                        setOtpCode(newOtp.join(""));
                                                        if (i < 3) (e.target.nextElementSibling as HTMLInputElement)?.focus();
                                                    } else {
                                                        newOtp[i] = "";
                                                        setOtpCode(newOtp.join(""));
                                                    }
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === "Backspace" && !otpCode[i] && i > 0) (e.currentTarget.previousElementSibling as HTMLInputElement)?.focus();
                                                }}
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleRequestOtp}
                                    disabled={resendTimer > 0 || loading}
                                    className="w-full text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#00C767] transition-colors py-4 rounded-2xl border border-transparent hover:border-[#00C767]/20"
                                >
                                    {resendTimer > 0 ? `Reset window in ${resendTimer}s` : "Re-dispatch Signal"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "LOG" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="space-y-6 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C767]/10 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C767] mb-2">
                                    <Wrench size={14} />
                                    Technical Ledger Entry
                                </div>
                                <h1 className="text-[32px] sm:text-[44px] md:text-[56px] font-extrabold tracking-[-0.05em] text-[#171717] leading-[0.95]">
                                    Technical <br /> details.
                                </h1>
                                <p className="text-[15px] sm:text-[17px] md:text-[19px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest opacity-60">
                                    Select the operational modules executed on this hardware unit.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {SERVICE_OPTIONS.map((opt) => {
                                    const isSelected = selectedServices.includes(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleService(opt.id)}
                                            className={cn(
                                                "p-4 sm:p-6 rounded-[24px] md:rounded-[32px] border-2 flex flex-col items-center gap-3 sm:gap-4 text-center transition-all duration-500",
                                                isSelected
                                                    ? "bg-[#171717] border-[#171717] text-white shadow-xl"
                                                    : "bg-white border-slate-100 text-[#171717] hover:border-[#00C767]/20 hover:shadow-xl hover:shadow-slate-200/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                isSelected ? "bg-[#00C767] text-white" : "bg-slate-50 text-slate-300"
                                            )}>
                                                <opt.Icon size={24} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[12px] font-bold tracking-widest uppercase">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-8 md:space-y-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <PremiumInput
                                        label="Mileage (KM)"
                                        type="number"
                                        placeholder="0"
                                        value={logData.mileage}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, mileage: e.target.value })}
                                        icon={<Hash size={18} />}
                                    />
                                    <PremiumInput
                                        label="Cost (GHS)"
                                        type="number"
                                        placeholder="0.00"
                                        value={logData.cost}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, cost: e.target.value })}
                                        icon={<Wallet size={18} />}
                                    />
                                </div>

                                <PremiumInput
                                    label="Workshop / Provider Node"
                                    placeholder="TotalEnergies, Shell, etc."
                                    value={logData.providerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, providerName: e.target.value })}
                                    icon={<Wrench size={18} />}
                                />

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]/40 ml-2">Internal Service Notes</label>
                                    <textarea
                                        className="w-full h-32 bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-[16px] font-bold text-[#171717] outline-none transition-all resize-none focus:bg-white focus:border-[#00C767] focus:shadow-xl focus:shadow-[#00C767]/5 placeholder:opacity-20 uppercase"
                                        placeholder="Specific repairs, parts used..."
                                        value={logData.notes}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLogData({ ...logData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <input type="file" id="photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    {!logData.documentUrl ? (
                                        <label htmlFor="photo" className="flex items-center justify-center gap-4 w-full h-24 border-2 border-dashed border-slate-200 bg-slate-50 rounded-[28px] cursor-pointer hover:bg-[#00C767]/10 hover:border-[#00C767]/30 transition-all text-[#171717]/40 hover:text-[#00C767]">
                                            {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                                            <span className="text-[13px] font-bold uppercase tracking-widest">Attach Asset Protocol</span>
                                        </label>
                                    ) : (
                                        <div className="flex items-center justify-between p-6 bg-[#00C767]/10 border border-[#00C767]/20 rounded-[28px] text-[#00C767]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#00C767] rounded-full flex items-center justify-center text-white">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-[13px] font-bold uppercase tracking-widest">Asset Sync Successful</span>
                                            </div>
                                            <button onClick={() => setLogData(prev => ({ ...prev, documentUrl: "" }))} className="p-2.5 rounded-xl bg-white border border-[#00C767]/20 text-[#171717] hover:bg-black hover:text-white transition-all">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Premium CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-3xl border-t border-slate-100 z-50">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={() => {
                            if (step === "PLATE") handleRequestOtp();
                            else if (step === "OTP") setStep("LOG");
                            else if (step === "LOG") handleSubmitLog();
                        }}
                        disabled={loading || (step === "PLATE" && !plateNumber) || (step === "OTP" && otpCode.length < 4) || (step === "LOG" && (!logData.mileage || selectedServices.length === 0))}
                        className="w-full bg-[#171717] text-white py-4 sm:py-6 md:py-8 rounded-[20px] md:rounded-[32px] text-[16px] sm:text-[18px] md:text-[20px] font-extrabold tracking-tight flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:pointer-events-none group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                {step === "PLATE" ? "Initialize Sync" : step === "OTP" ? "Finalize Auth" : "Commit to Ledger"}
                                <div className="w-8 h-8 bg-[#00C767] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function PremiumInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2 w-full text-left">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]/40 ml-2">{label}</label>
            <div className="relative group">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#00C767]">{icon}</div>}
                <input
                    className={cn(
                        "w-full bg-slate-50 border-2 border-transparent rounded-[24px] py-5 px-6 text-[18px] font-bold text-[#171717] outline-none transition-all placeholder:text-[#171717]/10 uppercase focus:bg-white focus:border-[#00C767] focus:shadow-xl focus:shadow-[#00C767]/5",
                        icon && "pl-14"
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}
