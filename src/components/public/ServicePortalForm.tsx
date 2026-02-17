"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Car,
    ShieldCheck,
    Clock,
    Wrench,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    Loader2,
    Smartphone,
    User,
    Wallet,
    Info,
    Zap,
    Hash,
    FileText,
    Droplets,
    Disc,
    BatteryCharging,
    Sparkles,
    Circle,
    Camera,
    RefreshCw,
    X,
    Upload
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { uploadProviderAsset } from "@/lib/supaFetch";

type StepKey = "PLATE" | "OTP" | "LOG" | "SUCCESS";

const SERVICE_OPTIONS = [
    { id: "oil", label: "Oil Change", Icon: Droplets, color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-500 dark:bg-amber-500/10 dark:border-amber-500/20" },
    { id: "brakes", label: "Brake Pads", Icon: Disc, color: "text-red-700 bg-red-50 border-red-200 dark:text-red-500 dark:bg-red-500/10 dark:border-red-500/20" },
    { id: "battery", label: "Battery", Icon: BatteryCharging, color: "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-500 dark:bg-orange-500/10 dark:border-orange-500/20" },
    { id: "tires", label: "Tire Service", Icon: Circle, color: "text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-500 dark:bg-slate-500/10 dark:border-slate-500/20" },
    { id: "ac", label: "AC / Electrical", Icon: Zap, color: "text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-500 dark:bg-cyan-500/10 dark:border-cyan-500/20" },
    { id: "suspension", label: "Suspension", Icon: ShieldCheck, color: "text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-500 dark:bg-indigo-500/10 dark:border-indigo-500/20" },
    { id: "inspection", label: "Inspection", Icon: Info, color: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-500 dark:bg-blue-500/10 dark:border-blue-500/20" },
    { id: "general", label: "General Repair", Icon: Wrench, color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-500 dark:bg-emerald-500/10 dark:border-emerald-500/20" },
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

    // ── Persistent Workshop Memory ──────────────────────────────
    useEffect(() => {
        const savedWorkshop = localStorage.getItem("motorambos_last_workshop");
        if (savedWorkshop) {
            setLogData(prev => ({ ...prev, providerName: savedWorkshop }));
        }
    }, []);

    // ── OTP Resend Timer Logic ─────────────────────────────────
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
                setResendTimer(60); // Initialize cooldown
                toast.success(data.message);
                window.scrollTo(0, 0);
            } else {
                setFormError(data.error || "Failed to identify vehicle");
                toast.error(data.error || "Failed to identify vehicle");
            }
        } catch (err) {
            setFormError("Connection error. Please check your internet and try again.");
            toast.error("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        if (resendTimer > 0) return;
        handleRequestOtp();
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
                // Save Workshop Name for next time
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

    const onBack = () => {
        setFormError(null);
        if (step === "OTP") setStep("PLATE");
        if (step === "LOG") setStep("OTP");
        window.scrollTo(0, 0);
    };

    const canContinue = useMemo(() => {
        if (step === "PLATE") return plateNumber.trim().length >= 2;
        if (step === "OTP") return otpCode.length === 4;
        if (step === "LOG") return logData.mileage && selectedServices.length > 0;
        return false;
    }, [step, plateNumber, otpCode, logData, selectedServices]);

    const onNext = () => {
        if (step === "PLATE") handleRequestOtp();
        else if (step === "OTP") {
            setStep("LOG");
            window.scrollTo(0, 0);
        }
        else if (step === "LOG") handleSubmitLog();
    };

    if (step === "SUCCESS") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in scale-in-95 fade-in duration-500">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative h-full w-full bg-foreground rounded-full flex items-center justify-center text-background shadow-2xl">
                        <CheckCircle2 className="h-16 w-16" strokeWidth={2.5} />
                    </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
                    Verified!
                </h1>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto mb-12">
                    Maintenance history for <span className="text-foreground font-bold">{plateNumber}</span> has been securely updated.
                </p>
                <Button
                    className="h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-xs gap-2 border-2 active:scale-95 transition-all"
                    onClick={() => window.location.reload()}
                >
                    Log Another Vehicle <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-transparent">
            {/* Top Navigation Bar (Wizard Header) */}
            <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-lg px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step !== "PLATE" && (
                            <button
                                onClick={onBack}
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight uppercase leading-none">
                                Motor<span className="text-foreground tracking-normal font-bold">Ambos</span>
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {step === "PLATE" && "Identify Vehicle"}
                                {step === "OTP" && "Verify Driver"}
                                {step === "LOG" && "Service Details"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-foreground transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="mx-auto w-full max-w-lg px-4 py-8 pb-40">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {formError && (
                        <div className="mb-6 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
                            <Info className="h-4 w-4 shrink-0" />
                            {formError}
                        </div>
                    )}

                    {/* 🚗 Vehicle Preview (Steps 2 & 3) */}
                    {(step === "OTP" || step === "LOG") && vehicleDetails && (
                        <div className="mb-6 p-4 rounded-3xl bg-foreground text-background shadow-xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                            <div className="h-12 w-12 rounded-xl bg-background/10 flex items-center justify-center shrink-0">
                                <Car className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0 pointer-events-none">
                                <p className="text-[10px] uppercase tracking-widest font-black opacity-60 mb-0.5 leading-none">Logging Service For</p>
                                <p className="text-lg font-black tracking-tighter truncate uppercase leading-tight">
                                    {vehicleDetails.color} {vehicleDetails.make} {vehicleDetails.model}
                                </p>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter mt-1">
                                    Plate: <span className="bg-background/20 px-1.5 py-0.5 rounded ml-1 tabular-nums">{plateNumber}</span> • {vehicleDetails.year}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === "PLATE" && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Log Service History
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter the vehicle plate number to start.
                                </p>
                            </div>

                            <div className="space-y-6 bg-card p-5 rounded-3xl shadow-sm border border-border">
                                <ModernInput
                                    label="Vehicle Plate"
                                    placeholder="GW-1234-22"
                                    className="uppercase font-bold"
                                    icon={<Car className="h-5 w-5 text-muted-foreground" />}
                                    value={plateNumber}
                                    onChange={e => {
                                        setPlateNumber(e.target.value);
                                        setFormError(null);
                                    }}
                                    autoFocus
                                />

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border text-left">
                                    <ShieldCheck className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-foreground mb-1 text-card-foreground">Secure Verification</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            We'll send a 4-digit code to the owner's phone to verify this visit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "OTP" && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Verify Code
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Sent to {phoneLabel} via SMS.
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-3xl border border-border space-y-8 shadow-sm">
                                <div className="space-y-4 text-center">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Verification Code</label>
                                    <div className="flex justify-center gap-2">
                                        {[0, 1, 2, 3].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                inputMode="numeric"
                                                className="w-14 h-16 bg-background border-2 border-input focus:border-foreground/20 rounded-2xl text-center text-3xl font-bold outline-none transition-all focus:bg-background shadow-sm"
                                                value={otpCode[i] || ""}
                                                onChange={e => {
                                                    const val = e.target.value.replace(/\D/g, "");
                                                    if (val) {
                                                        const newOtp = otpCode.split("");
                                                        newOtp[i] = val;
                                                        setOtpCode(newOtp.join(""));
                                                        if (i < 3) {
                                                            const next = e.currentTarget.nextElementSibling as HTMLInputElement;
                                                            if (next) next.focus();
                                                        }
                                                    } else {
                                                        const newOtp = otpCode.split("");
                                                        newOtp[i] = "";
                                                        setOtpCode(newOtp.join(""));
                                                    }
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === "Backspace" && !otpCode[i] && i > 0) {
                                                        const prev = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                        if (prev) prev.focus();
                                                    }
                                                }}
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        variant="ghost"
                                        disabled={resendTimer > 0 || loading}
                                        onClick={handleResendOtp}
                                        className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground gap-2"
                                    >
                                        <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
                                        {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "LOG" && (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Service Details
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Select the tasks performed today.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* Service Selection Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {SERVICE_OPTIONS.map((opt) => {
                                        const isSelected = selectedServices.includes(opt.id);
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => toggleService(opt.id)}
                                                className={cn(
                                                    "cursor-pointer relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 text-center gap-3",
                                                    isSelected
                                                        ? "border-foreground bg-foreground text-background shadow-lg"
                                                        : "border-border bg-card text-muted-foreground shadow-sm hover:bg-muted/50 hover:border-border"
                                                )}
                                            >
                                                <div className={cn(
                                                    "rounded-xl p-3 transition-colors",
                                                    isSelected
                                                        ? "bg-background/10 text-background"
                                                        : opt.color
                                                )}>
                                                    <opt.Icon className="h-6 w-6" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="block text-sm font-bold">{opt.label}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-background flex items-center justify-center">
                                                        <CheckCircle2 className="h-3 w-3 text-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-card p-5 rounded-3xl border border-border space-y-5 shadow-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <ModernInput
                                            label="Mileage (KM)"
                                            type="number"
                                            placeholder="0"
                                            value={logData.mileage}
                                            onChange={e => setLogData({ ...logData, mileage: e.target.value })}
                                            icon={<Hash className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <ModernInput
                                            label="Cost (GHS)"
                                            type="number"
                                            placeholder="0.00"
                                            value={logData.cost}
                                            onChange={e => setLogData({ ...logData, cost: e.target.value })}
                                            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">Notes (Optional)</label>
                                        <textarea
                                            placeholder="Additional details..."
                                            className="w-full min-h-[80px] rounded-xl border-2 border-input bg-background p-4 text-sm focus:outline-none focus:border-ring focus:bg-card transition-all resize-none font-medium leading-relaxed"
                                            value={logData.notes}
                                            onChange={e => setLogData({ ...logData, notes: e.target.value })}
                                        />
                                    </div>

                                    <ModernInput
                                        label="Workshop Name"
                                        placeholder="e.g. TotalEnergies"
                                        value={logData.providerName}
                                        onChange={e => setLogData({ ...logData, providerName: e.target.value })}
                                        icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
                                    />

                                    {/* 📸 Document Upload Section */}
                                    <div className="pt-2">
                                        <input
                                            type="file"
                                            id="doc-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />

                                        {!logData.documentUrl ? (
                                            <label
                                                htmlFor="doc-upload"
                                                className={cn(
                                                    "flex items-center justify-center gap-3 w-full h-16 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground cursor-pointer hover:bg-muted/40 transition-all",
                                                    isUploading && "opacity-50 cursor-wait"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Camera className="h-5 w-5" />
                                                )}
                                                <span className="text-sm font-bold uppercase tracking-widest leading-none">
                                                    {isUploading ? "Uploading..." : "Attach Photo Proof"}
                                                </span>
                                            </label>
                                        ) : (
                                            <div className="relative group">
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600">
                                                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Document Attached</p>
                                                        <p className="text-xs font-bold truncate">Verification photo ready</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setLogData(prev => ({ ...prev, documentUrl: "" }))}
                                                        className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-muted-foreground mt-3 px-1 text-center font-medium leading-relaxed italic">
                                            Optional: Attach a photo of the odometer or physical invoice for higher trust level.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-xl border-t border-border z-40">
                <div className="mx-auto max-w-lg">
                    <Button
                        disabled={!canContinue || loading}
                        className={cn(
                            "w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-95 gap-2",
                            canContinue
                                ? "bg-foreground text-background shadow-lg"
                                : "bg-muted text-muted-foreground"
                        )}
                        onClick={onNext}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {step === "PLATE" ? "Identify Vehicle" : step === "OTP" ? "Verify Code" : "Submit Log"}
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </main>
    );
}

/* ───────────────────────────────
   Sub-Components 
   ─────────────────────────────── */

const ModernInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
    label: string,
    error?: string,
    icon?: React.ReactNode
}>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full text-left">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">{label}</label>
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full rounded-xl border-2 border-input bg-background/50 px-4 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-ring focus:bg-card disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            icon && "pl-10",
                            error && "border-destructive bg-destructive/5 focus:border-destructive",
                            className
                        )}
                        {...props}
                    />
                    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:text-foreground transition-colors">{icon}</div>}
                </div>
                {error && <p className="text-[11px] font-medium text-destructive ml-1">{error}</p>}
            </div>
        )
    }
)
ModernInput.displayName = "ModernInput"
