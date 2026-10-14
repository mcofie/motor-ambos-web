"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BatteryCharging, Camera, Car, Check, CheckCircle2, ChevronLeft, CircleDot, Disc, Droplets, Gauge, Loader2, MessageSquareText, ShieldCheck, Wrench, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { uploadProviderAsset } from "@/lib/supaFetch";

type StepKey = "PLATE" | "OTP" | "LOG" | "SUCCESS";

const SERVICE_OPTIONS = [
    { id: "oil", label: "Oil change", Icon: Droplets },
    { id: "brakes", label: "Brake pads", Icon: Disc },
    { id: "battery", label: "Battery", Icon: BatteryCharging },
    { id: "tires", label: "Tyres", Icon: CircleDot },
    { id: "ac", label: "Electrical or AC", Icon: Zap },
    { id: "suspension", label: "Suspension", Icon: ShieldCheck },
    { id: "inspection", label: "Diagnosis", Icon: Gauge },
    { id: "general", label: "General service", Icon: Wrench },
];

const steps: { key: StepKey; label: string }[] = [
    { key: "PLATE", label: "Find the car" },
    { key: "OTP", label: "Owner's code" },
    { key: "LOG", label: "What was done" },
];

const fieldClass = "mt-1.5 h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 text-[16px] text-[#171717] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

export function ServicePortalForm() {
    const [step, setStep] = useState<StepKey>("PLATE");
    const [loading, setLoading] = useState(false);
    const [plateNumber, setPlateNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [phoneLabel, setPhoneLabel] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [vehicleDetails, setVehicleDetails] = useState<{ make: string; model: string; year: string; color: string } | null>(null);
    const [resendTimer, setResendTimer] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [logData, setLogData] = useState({ notes: "", providerName: "", mileage: "", cost: "", documentUrl: "" });

    // A mechanic arriving from a car's Smart Card page already has the plate.
    useEffect(() => {
        const plate = new URLSearchParams(window.location.search).get("plate")?.trim();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the link and browser storage, which only exist after the page loads
        if (plate) setPlateNumber(plate.slice(0, 30));
        try {
            const savedWorkshop = localStorage.getItem("motorambos_last_workshop");
            if (savedWorkshop) setLogData((prev) => ({ ...prev, providerName: savedWorkshop }));
        } catch { /* storage unavailable */ }
    }, []);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const toggleService = (id: string) => setSelectedServices((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

    const handleRequestOtp = async () => {
        const plate = plateNumber.trim();
        if (!plate) return setFormError("Enter the car's plate number.");
        setLoading(true);
        setFormError(null);
        try {
            const res = await fetch("/api/service-portal/request-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plateNumber: plate }) });
            const data = await res.json();
            if (!res.ok) return setFormError(data.error || "We could not find that car.");
            setPhoneLabel(data.phoneLabel);
            setVehicleDetails(data.vehicle);
            setStep("OTP");
            setResendTimer(60);
            window.scrollTo(0, 0);
        } catch {
            setFormError("Connection problem. Check your internet and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadProviderAsset(file, `service-log-${plateNumber.replace(/\s+/g, "-")}`);
            setLogData((prev) => ({ ...prev, documentUrl: url }));
            toast.success("Photo added");
        } catch {
            toast.error("Could not add the photo. Try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmitLog = async () => {
        const code = otpCode.trim();
        if (code.length < 4) return setFormError("Enter the 4-digit code from the owner.");
        if (!logData.mileage || selectedServices.length === 0) return setFormError("Choose what was done and enter the mileage.");
        const description = [...selectedServices.map((id) => SERVICE_OPTIONS.find((option) => option.id === id)?.label), logData.notes.trim()].filter(Boolean).join(", ");
        setLoading(true);
        setFormError(null);
        try {
            const res = await fetch("/api/service-portal/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plateNumber: plateNumber.trim(), code, serviceData: { ...logData, description } }) });
            const data = await res.json();
            if (!res.ok) return setFormError(data.error || "Could not save the service.");
            try { if (logData.providerName.trim()) localStorage.setItem("motorambos_last_workshop", logData.providerName.trim()); } catch { /* storage unavailable */ }
            setStep("SUCCESS");
            window.scrollTo(0, 0);
        } catch {
            setFormError("Connection problem. Check your internet and try again.");
        } finally {
            setLoading(false);
        }
    };

    const car = vehicleDetails ? [vehicleDetails.year, vehicleDetails.color, vehicleDetails.make, vehicleDetails.model].filter(Boolean).join(" ") : "";
    const activeIndex = steps.findIndex((item) => item.key === step);
    const canContinue = step === "PLATE" ? Boolean(plateNumber.trim()) : step === "OTP" ? otpCode.length === 4 : Boolean(logData.mileage) && selectedServices.length > 0;

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <header className="sticky top-0 z-40 border-b border-[#E9E9E9] bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[640px] items-center justify-between px-5">
                <Link href="/" className="flex items-center gap-2 text-[16px] font-medium tracking-[-0.03em]"><Image src="/icon.svg" alt="" width={36} height={30} className="h-[30px] w-9" />Motor Ambos</Link>
                <span className="rounded-full bg-[#F3F3FF] px-3 py-1.5 text-[12px] text-[#1111F6]">Mechanic portal</span>
            </div>
        </header>

        {step === "SUCCESS" ? <main className="mx-auto flex max-w-[480px] flex-col items-center px-5 pb-20 pt-20 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF7F0] text-[#197252]"><CheckCircle2 className="h-10 w-10" /></span>
            <h1 className="mt-6 text-[32px] tracking-[-0.04em]">Service saved</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-[#666]">The service for <span className="text-[#171717]">{plateNumber}</span> is now part of the car&apos;s record, marked as recorded by a mechanic.</p>
            <button type="button" onClick={() => { setStep("PLATE"); setPlateNumber(""); setOtpCode(""); setSelectedServices([]); setVehicleDetails(null); setLogData((prev) => ({ ...prev, notes: "", mileage: "", cost: "", documentUrl: "" })); }} className="mt-8 h-12 rounded-full bg-[#1111F6] px-6 text-[15px] text-white">Log another car</button>
        </main> : <main className="mx-auto max-w-[640px] px-5 pb-36 pt-8">
            <ol className="mb-8 flex gap-2" aria-label="Steps">
                {steps.map((item, index) => <li key={item.key} className="flex-1">
                    <span className={`block h-1 rounded-full ${index <= activeIndex ? "bg-[#1111F6]" : "bg-[#E3E3E3]"}`} />
                    <span className={`mt-2 block text-[12px] ${index === activeIndex ? "text-[#171717]" : "text-[#999]"}`}>{index + 1}. {item.label}</span>
                </li>)}
            </ol>

            {step !== "PLATE" && <button type="button" onClick={() => { setFormError(null); setStep(step === "LOG" ? "OTP" : "PLATE"); }} className="-ml-1 mb-4 inline-flex min-h-11 items-center gap-1 text-[14px] text-[#666] hover:text-[#1111F6]"><ChevronLeft className="h-4 w-4" />Back</button>}

            {vehicleDetails && step !== "PLATE" && <div className="mb-6 flex items-center gap-3 rounded-[16px] bg-white p-4 ring-1 ring-black/5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#EEEEFF] text-[#1111F6]"><Car className="h-5 w-5" /></span>
                <div className="min-w-0"><p className="truncate text-[15px]">{car || "Car found"}</p><p className="font-mono text-[13px] tracking-[0.06em] text-[#777]">{plateNumber.toUpperCase()}</p></div>
            </div>}

            {formError && <p role="alert" className="mb-5 rounded-[12px] border border-[#F3D8D8] bg-[#FFF8F7] px-4 py-3 text-[14px] text-[#AA3333]">{formError}</p>}

            {step === "PLATE" && <section>
                <h1 className="text-[30px] leading-tight tracking-[-0.04em] sm:text-[36px]">Log a service</h1>
                <p className="mt-2 text-[16px] leading-relaxed text-[#666]">Add the work you did to the car&apos;s record. The owner confirms it with a code we text to their phone.</p>
                <div className="mt-6 rounded-[18px] bg-white p-5 ring-1 ring-black/5 sm:p-6">
                    <label className="block text-[14px]">Plate number
                        <input className={fieldClass + " font-mono uppercase tracking-[0.06em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"} placeholder="e.g. GW-1234-22" value={plateNumber} onChange={(event) => setPlateNumber(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void handleRequestOtp(); }} autoCapitalize="characters" autoComplete="off" autoFocus />
                    </label>
                </div>
            </section>}

            {step === "OTP" && <section>
                <h1 className="text-[30px] leading-tight tracking-[-0.04em] sm:text-[36px]">Ask the owner for the code</h1>
                <p className="mt-2 flex items-start gap-2 text-[16px] leading-relaxed text-[#666]"><MessageSquareText className="mt-1 h-4 w-4 shrink-0 text-[#1111F6]" />We texted a 4-digit code to the owner{phoneLabel ? ` at ${phoneLabel}` : ""}.</p>
                <div className="mt-6 rounded-[18px] bg-white p-5 ring-1 ring-black/5 sm:p-6">
                    <label className="block text-[14px]">Code from the owner
                        <input className={fieldClass + " text-center font-mono text-[28px] tracking-[0.5em]"} value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="one-time-code" placeholder="••••" maxLength={4} autoFocus />
                    </label>
                    <button type="button" onClick={() => void handleRequestOtp()} disabled={resendTimer > 0 || loading} className="mt-4 text-[14px] text-[#1111F6] disabled:text-[#999]">{resendTimer > 0 ? `Send a new code in ${resendTimer}s` : "Send a new code"}</button>
                </div>
            </section>}

            {step === "LOG" && <section>
                <h1 className="text-[30px] leading-tight tracking-[-0.04em] sm:text-[36px]">What was done?</h1>
                <p className="mt-2 text-[16px] text-[#666]">Choose everything that applies.</p>
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {SERVICE_OPTIONS.map(({ id, label, Icon }) => {
                        const selected = selectedServices.includes(id);
                        return <button key={id} type="button" onClick={() => toggleService(id)} aria-pressed={selected} className={`flex min-h-[92px] flex-col items-start justify-between rounded-[14px] p-3.5 text-left text-[14px] transition-colors ${selected ? "bg-[#1111F6] text-white" : "bg-white ring-1 ring-black/5 hover:ring-[#B8B8FF]"}`}>
                            <span className="flex w-full items-center justify-between"><Icon className={`h-5 w-5 ${selected ? "text-white" : "text-[#1111F6]"}`} />{selected && <Check className="h-4 w-4" />}</span>{label}
                        </button>;
                    })}
                </div>
                <div className="mt-5 grid gap-4 rounded-[18px] bg-white p-5 ring-1 ring-black/5 sm:grid-cols-2 sm:p-6">
                    <label className="text-[14px]">Mileage (km)<input className={fieldClass} type="number" inputMode="numeric" min="0" placeholder="e.g. 84200" value={logData.mileage} onChange={(event) => setLogData({ ...logData, mileage: event.target.value })} /></label>
                    <label className="text-[14px]">Cost (GH₵) <span className="text-[#888]">(optional)</span><input className={fieldClass} type="number" inputMode="decimal" min="0" placeholder="0.00" value={logData.cost} onChange={(event) => setLogData({ ...logData, cost: event.target.value })} /></label>
                    <label className="text-[14px] sm:col-span-2">Workshop name<input className={fieldClass} placeholder="e.g. Abossey Okai Motors" value={logData.providerName} onChange={(event) => setLogData({ ...logData, providerName: event.target.value })} /></label>
                    <label className="text-[14px] sm:col-span-2">Notes <span className="text-[#888]">(optional)</span><textarea className={fieldClass + " h-24 resize-none py-3"} placeholder="Parts used or anything the owner should know" value={logData.notes} onChange={(event) => setLogData({ ...logData, notes: event.target.value })} /></label>
                    <div className="sm:col-span-2">
                        {logData.documentUrl ? <div className="flex items-center justify-between rounded-[12px] bg-[#EAF7F0] px-4 py-3 text-[14px] text-[#197252]"><span className="flex items-center gap-2"><Check className="h-4 w-4" />Photo added</span><button type="button" onClick={() => setLogData((prev) => ({ ...prev, documentUrl: "" }))} aria-label="Remove photo" className="rounded-full p-1.5 hover:bg-white/60"><X className="h-4 w-4" /></button></div>
                            : <label className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-2 border-dashed border-[#DADAF8] text-[14px] text-[#1111F6] hover:bg-[#FAFAFF]">{isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}Add a photo of the receipt or work <span className="text-[#888]">(optional)</span><input type="file" accept="image/*" className="sr-only" onChange={handleFileUpload} /></label>}
                    </div>
                </div>
            </section>}
        </main>}

        {step !== "SUCCESS" && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E7E7E7] bg-white/95 px-5 pt-3 backdrop-blur-md" style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}>
            <div className="mx-auto max-w-[640px]">
                <button type="button" onClick={() => { if (step === "PLATE") void handleRequestOtp(); else if (step === "OTP") { setFormError(null); setStep("LOG"); } else void handleSubmitLog(); }} disabled={loading || !canContinue} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[15px] text-white transition-colors hover:bg-[#0606D8] disabled:opacity-40">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}{step === "PLATE" ? "Text the owner a code" : step === "OTP" ? "Continue" : "Save service"}
                </button>
            </div>
        </div>}
    </div>;
}
