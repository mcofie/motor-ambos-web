"use client";

import React, { useState, useEffect, useMemo } from "react";
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
    RefreshCw,
    X,
    Wallet
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadProviderAsset } from "@/lib/supaFetch";

type StepKey = "PLATE" | "OTP" | "LOG" | "SUCCESS";

const SERVICE_OPTIONS = [
    { id: "oil", label: "Oil Change", Icon: Droplets, color: "text-amber-600 bg-amber-50" },
    { id: "brakes", label: "Brake Pads", Icon: Disc, color: "text-red-600 bg-red-50" },
    { id: "battery", label: "Battery", Icon: BatteryCharging, color: "text-orange-600 bg-orange-50" },
    { id: "tires", label: "Tire Service", Icon: Circle, color: "text-slate-600 bg-slate-50" },
    { id: "ac", label: "AC / Electrical", Icon: Zap, color: "text-cyan-600 bg-cyan-50" },
    { id: "suspension", label: "Suspension", Icon: ShieldCheck, color: "text-indigo-600 bg-indigo-50" },
    { id: "inspection", label: "Inspection", Icon: Info, color: "text-blue-600 bg-blue-50" },
    { id: "general", label: "General Repair", Icon: Wrench, color: "text-[#2D5B18] bg-[#9FE870]/10" },
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
    const progressPercent = ((activeIndex + 1) / (stepsOrder.length - 1)) * 100;

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
            toast.success("Photo attached successfully!");
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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in scale-in-95 fade-in duration-500 bg-[#F0F2F5]">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 bg-[#9FE870]/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative h-full w-full bg-[#9FE870] rounded-full flex items-center justify-center text-[#2D5B18] shadow-wise-lg">
                        <CheckCircle2 className="h-16 w-16" strokeWidth={3} />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-4">
                    Verified!
                </h1>
                <p className="text-lg font-bold text-[#5D7079] max-w-xs mx-auto mb-12">
                    Maintenance history for <span className="text-black">{plateNumber}</span> has been securely updated.
                </p>
                <button
                    className="btn-primary !px-12 flex items-center gap-3"
                    onClick={() => window.location.reload()}
                >
                    LOG ANOTHER VEHICLE <ArrowRight size={24} />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-40">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-border py-4">
                <div className="fintech-container flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "PLATE" && (
                            <button onClick={() => setStep(step === "LOG" ? "OTP" : "PLATE")} className="p-2 border-2 border-black hover:bg-[#9FE870] transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter uppercase">ambos</span>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                {step === "PLATE" ? "Identify" : step === "OTP" ? "Verify" : "Log Service"}
                            </span>
                        </div>
                    </div>
                    <div className="w-32 h-3 border-2 border-black bg-[#F5F5F5] overflow-hidden">
                        <div className="h-full bg-[#9FE870] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
            </header>

            <main className="wise-container max-w-2xl pt-12">
                <div className="space-y-10">
                    {formError && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-[12px] flex items-center gap-3 text-red-600">
                            <Info size={18} />
                            <span className="text-sm font-black uppercase tracking-tight">{formError}</span>
                        </div>
                    )}

                    {/* Vehicle Identity */}
                    {(step === "OTP" || step === "LOG") && vehicleDetails && (
                        <div className="bg-black text-white p-8 border-4 border-black flex items-center gap-6">
                            <div className="w-16 h-16 border-2 border-[#9FE870] bg-[#9FE870]/10 flex items-center justify-center">
                                <Car size={32} className="text-[#9FE870]" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Logging for</span>
                                <h3 className="text-3xl font-black tracking-tight leading-none uppercase italic">
                                    {vehicleDetails.color} {vehicleDetails.make} {vehicleDetails.model}
                                </h3>
                                <p className="text-xs font-bold text-[#9FE870] uppercase">{plateNumber} • {vehicleDetails.year}</p>
                            </div>
                        </div>
                    )}

                    {step === "PLATE" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">Record history.</h1>
                                <p className="wise-body">Enter the vehicle plate number to initialize the maintenance ledger.</p>
                            </div>

                            <div className="fintech-card !p-10 space-y-8">
                                <WiseInput
                                    label="Vehicle Plate Number"
                                    placeholder="GW-1234-22"
                                    value={plateNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlateNumber(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4 p-5 bg-[#F5F5F5] border-2 border-black">
                                    <ShieldCheck className="text-[#9FE870] shrink-0" size={24} />
                                    <p className="text-sm font-bold text-black uppercase leading-relaxed">
                                        WE'LL REQUIRE THE DRIVER TO VERIFY THIS ENTRY VIA A SECURE OTP PROTOCOL.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "OTP" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">Verify driver.</h1>
                                <p className="wise-body">A secure code was sent to {phoneLabel}.</p>
                            </div>

                            <div className="fintech-card !p-10 space-y-10">
                                <div className="space-y-4 text-center">
                                    <label className="text-[12px] font-black uppercase tracking-widest opacity-40">Verification Code</label>
                                    <div className="flex justify-center gap-3">
                                        {[0, 1, 2, 3].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-16 h-20 bg-[#F5F5F5] border-2 border-black rounded-[4px] text-center text-4xl font-black outline-none transition-all focus:bg-[#9FE870]/10"
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
                                    className="w-full text-xs font-black uppercase tracking-widest text-black hover:bg-[#9FE870] transition-colors py-2 border-2 border-transparent hover:border-black"
                                >
                                    {resendTimer > 0 ? `ResEND IN ${resendTimer}S` : "RESEND CODE"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "LOG" && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h1 className="wise-heading-section !leading-none">Technical details.</h1>
                                <p className="wise-body">Select the tasks performed and verify the operational metrics.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {SERVICE_OPTIONS.map((opt) => {
                                    const isSelected = selectedServices.includes(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleService(opt.id)}
                                            className={cn(
                                                "fintech-card !p-6 flex flex-col items-center gap-4 text-center transition-all",
                                                isSelected ? "!bg-[#9FE870] text-black border-4" : "hover:bg-[#F5F5F5]"
                                            )}
                                        >
                                            <div className={cn("w-12 h-12 border-2 border-black flex items-center justify-center transition-colors bg-white")}>
                                                <opt.Icon size={24} />
                                            </div>
                                            <span className="text-sm font-black tracking-tight uppercase">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="fintech-card !p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <WiseInput
                                        label="Mileage (KM)"
                                        type="number"
                                        placeholder="0"
                                        value={logData.mileage}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, mileage: e.target.value })}
                                        icon={<Hash size={18} />}
                                    />
                                    <WiseInput
                                        label="Cost (GHS)"
                                        type="number"
                                        placeholder="0.00"
                                        value={logData.cost}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, cost: e.target.value })}
                                        icon={<Wallet size={18} />}
                                    />
                                </div>

                                <WiseInput
                                    label="Workshop Name"
                                    placeholder="TOTALENERGIES, ETC."
                                    value={logData.providerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogData({ ...logData, providerName: e.target.value })}
                                    icon={<Wrench size={18} />}
                                />

                                <div className="space-y-2">
                                    <label className="text-[12px] font-black uppercase tracking-widest opacity-40">Service Notes</label>
                                    <textarea
                                        className="w-full h-32 bg-[#F5F5F5] border-2 border-black rounded-[4px] p-6 text-base font-bold outline-none transition-all resize-none uppercase"
                                        placeholder="SPECIFIC REPAIRS, PARTS USED..."
                                        value={logData.notes}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLogData({ ...logData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4">
                                    <input type="file" id="photo" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    {!logData.documentUrl ? (
                                        <label htmlFor="photo" className="flex items-center justify-center gap-4 w-full h-20 border-2 border-dashed border-black bg-[#F5F5F5] cursor-pointer hover:bg-[#9FE870] transition-all text-black hover:border-solid">
                                            {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                                            <span className="text-sm font-black uppercase tracking-widest">Attach Photo Proof</span>
                                        </label>
                                    ) : (
                                        <div className="flex items-center justify-between p-5 bg-[#9FE870] border-2 border-black text-black">
                                            <div className="flex items-center gap-4">
                                                <FileText size={24} />
                                                <span className="text-sm font-black tracking-tight uppercase">Document Attached</span>
                                            </div>
                                            <button onClick={() => setLogData(prev => ({ ...prev, documentUrl: "" }))} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
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

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t-4 border-black z-50">
                <div className="fintech-container max-w-2xl">
                    <button
                        onClick={() => {
                            if (step === "PLATE") handleRequestOtp();
                            else if (step === "OTP") setStep("LOG");
                            else if (step === "LOG") handleSubmitLog();
                        }}
                        disabled={loading || (step === "PLATE" && !plateNumber) || (step === "OTP" && otpCode.length < 4) || (step === "LOG" && (!logData.mileage || selectedServices.length === 0))}
                        className="btn-primary w-full !py-8 !text-2xl flex items-center justify-center gap-4 active:translate-x-1 active:translate-y-1 disabled:opacity-30 disabled:grayscale"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                {step === "PLATE" ? "IDENTIFY VEHICLE" : step === "OTP" ? "VERIFY CODE" : "SUBMIT SERVICE LOG"}
                                <ArrowRight size={28} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function WiseInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2 w-full text-left">
            <label className="text-[12px] font-black uppercase tracking-widest opacity-40 ml-1">{label}</label>
            <div className="relative group">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black">{icon}</div>}
                <input
                    className={cn(
                        "w-full bg-[#F5F5F5] border-2 border-black rounded-[4px] py-5 px-6 text-xl font-bold outline-none transition-all placeholder:text-black/10 uppercase",
                        icon && "pl-14"
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}
