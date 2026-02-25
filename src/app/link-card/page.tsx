"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
    listMemberVehicles,
    linkSmartCardToVehicle,
    VehicleRow,
} from "@/lib/supaFetch";
import { supabase } from "@/lib/supabaseClient";
import {
    CreditCard,
    Car,
    CheckCircle2,
    ArrowRight,
    Loader2,
    ShieldCheck,
    ExternalLink,
    AlertCircle,
    Hash,
    Zap,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "serial" | "vehicle" | "confirm" | "success";

export default function LinkCardPage() {
    const [step, setStep] = useState<Step>("serial");
    const [serialNumber, setSerialNumber] = useState("");
    const [serialError, setSerialError] = useState("");
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [linking, setLinking] = useState(false);
    const [publicId, setPublicId] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) setUserId(data.user.id);
        })();
    }, []);

    const validateSerial = (val: string) => /^MA-\d{2}-\d{5}$/.test(val);

    const handleSerialSubmit = () => {
        const trimmed = serialNumber.trim().toUpperCase();
        if (!validateSerial(trimmed)) {
            setSerialError("ENTER VALID SERIAL (MA-26-XXXXX)");
            return;
        }
        setSerialError("");
        setSerialNumber(trimmed);
        setStep("vehicle");
        loadVehicles();
    };

    const loadVehicles = async () => {
        if (!userId) return;
        setLoadingVehicles(true);
        try {
            const data = await listMemberVehicles(userId);
            setVehicles(data);
        } catch (err) { console.error(err); }
        finally { setLoadingVehicles(false); }
    };

    const handleSelectVehicle = (v: VehicleRow) => {
        setSelectedVehicle(v);
        setStep("confirm");
    };

    const handleConfirmLink = async () => {
        if (!selectedVehicle) return;
        setLinking(true);
        try {
            const id = await linkSmartCardToVehicle(selectedVehicle.id, serialNumber);
            setPublicId(id);
            setStep("success");
            window.scrollTo(0, 0);
        } catch (err) { console.error(err); }
        finally { setLinking(false); }
    };

    const passportUrl = `https://motorambos.com/v/${publicId}`;

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-44 pb-32">
                <div className="wise-container max-w-xl">
                    {/* Header */}
                    <div className="text-center space-y-4 mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] shadow-xs">
                            <Zap size={14} className="text-[#9FE870]" />
                            Smart Card Setup
                        </div>
                        <h1 className="wise-heading-hero !text-5xl !leading-[0.85]">Link Card.</h1>
                        <p className="wise-body text-sm font-bold opacity-60 uppercase tracking-widest leading-relaxed">
                            Connect the physical card to your vehicle to create its public Digital Passport.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        {(["serial", "vehicle", "confirm", "success"] as Step[]).map((s, i) => (
                            <div key={s} className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                step === s ? "w-12 bg-[#9FE870]" : "w-1.5 bg-border"
                            )} />
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="wise-card !p-10 !bg-white">
                        {step === "serial" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <div className="relative aspect-[1.58/1] bg-black rounded-[24px] p-8 flex flex-col justify-between overflow-hidden text-white shadow-wise-lg group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9FE870]/10 blur-[60px]" />
                                    <div className="flex justify-between items-start z-10">
                                        <CreditCard className="text-[#9FE870]" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">MA Protocol</span>
                                    </div>
                                    <div className="space-y-1 z-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Serial Identification</p>
                                        <p className="text-3xl font-black tracking-tighter">{serialNumber || "MA-26-XXXXX"}</p>
                                    </div>
                                    <div className="flex justify-between items-end z-10">
                                        <p className="text-lg font-black tracking-widest leading-none">AMBOS</p>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl border border-white/10" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Card Serial Number</label>
                                    <input
                                        type="text"
                                        value={serialNumber}
                                        onChange={(e) => { setSerialNumber(e.target.value.toUpperCase()); setSerialError(""); }}
                                        placeholder="MA-26-00451"
                                        className="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-6 px-8 text-3xl font-black text-center outline-none transition-all placeholder:text-[#5D7079]/20"
                                        maxLength={11}
                                    />
                                    {serialError && (
                                        <p className="text-xs font-black text-red-600 uppercase tracking-widest text-center">{serialError}</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleSerialSubmit}
                                    disabled={!serialNumber.trim()}
                                    className="wise-btn-primary w-full !py-6 !text-lg flex items-center justify-center gap-3 disabled:opacity-30"
                                >
                                    Continue <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {step === "vehicle" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="space-y-2 text-center">
                                    <div className="inline-block px-4 py-1.5 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-widest">{serialNumber}</div>
                                    <h3 className="text-2xl font-black tracking-tight uppercase">Select Vehicle</h3>
                                </div>

                                {loadingVehicles ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#9FE870]" size={32} /></div>
                                ) : vehicles.length === 0 ? (
                                    <div className="text-center py-12 space-y-4">
                                        <p className="font-bold text-[#5D7079] uppercase tracking-widest">No units found.</p>
                                        <Link href="/help" className="text-sm font-black text-[#9FE870] uppercase">Register a vehicle first &rarr;</Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {vehicles.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => handleSelectVehicle(v)}
                                                className="flex items-center gap-6 p-6 bg-[#F0F2F5] rounded-[24px] border-2 border-transparent hover:border-[#9FE870] transition-all group"
                                            >
                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#5D7079] group-hover:bg-[#9FE870] group-hover:text-black transition-colors">
                                                    <Car size={28} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-xl font-black tracking-tight uppercase truncate">{v.year} {v.make} {v.model}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{v.plate || "NO PLATE"}</p>
                                                </div>
                                                <ArrowRight size={20} className="text-[#5D7079]/30 group-hover:text-black" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button onClick={() => setStep("serial")} className="w-full text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Back to Serial</button>
                            </div>
                        )}

                        {step === "confirm" && selectedVehicle && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <h3 className="text-2xl font-black tracking-tight uppercase text-center">Confirm Protocol</h3>

                                <div className="space-y-4">
                                    <SummaryItem label="Physical Card" value={serialNumber} />
                                    <SummaryItem label="Vehicle Unit" value={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`} />
                                    <SummaryItem label="Registration" value={selectedVehicle.plate || "—"} color="text-[#2D5B18]" />
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep("vehicle")} className="wise-btn-secondary flex-1 !py-6 !text-lg">Back</button>
                                    <button onClick={handleConfirmLink} className="wise-btn-primary flex-1 !py-6 !text-lg flex items-center justify-center gap-2" disabled={linking}>
                                        {linking ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> Deploy Link</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === "success" && (
                            <div className="space-y-10 text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-24 h-24 bg-[#9FE870] rounded-full flex items-center justify-center text-[#2D5B18] mx-auto shadow-wise-lg">
                                    <CheckCircle2 size={48} strokeWidth={3} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black tracking-tight uppercase">Card Active.</h3>
                                    <p className="text-sm font-bold text-[#5D7079] uppercase tracking-widest leading-relaxed">
                                        Your Digital Passport is live. Anyone who taps this card will see a verified profile of your vehicle unit.
                                    </p>
                                </div>

                                <div className="bg-[#F0F2F5] rounded-[24px] p-8 space-y-6 text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">Public Assignment URL</p>
                                    <p className="text-sm font-black text-[#2D5B18] break-all border-b border-[#9FE870]/20 pb-4">{passportUrl}</p>
                                    <div className="flex gap-4">
                                        <Link href={`/v/${publicId}`} className="wise-btn-primary !px-6 !py-3 !text-xs flex-1 flex items-center justify-center gap-2">
                                            <ExternalLink size={14} /> View Passport
                                        </Link>
                                        <button onClick={() => { navigator.clipboard.writeText(passportUrl); toast.success("Link Coped!"); }} className="wise-btn-secondary !px-6 !py-3 !text-xs flex-1">
                                            Copy Link
                                        </button>
                                    </div>
                                </div>

                                <Link href="/digital-passport" className="inline-block text-[10px] font-black uppercase tracking-widest opacity-40">Return to Passport Terminal</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function SummaryItem({ label, value, color = "text-black" }: { label: string, value: string, color?: string }) {
    return (
        <div className="flex justify-between items-center p-6 bg-[#F0F2F5] rounded-[20px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5D7079]">{label}</span>
            <span className={cn("text-lg font-black tracking-tight uppercase truncate max-w-[200px]", color)}>{value}</span>
        </div>
    );
}
