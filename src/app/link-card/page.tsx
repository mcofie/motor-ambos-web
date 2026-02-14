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
} from "lucide-react";

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

    // Get logged-in user
    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                setUserId(data.user.id);
            }
        })();
    }, []);

    // Validate serial number format: MA-XX-XXXXX
    const validateSerial = (val: string) => {
        const pattern = /^MA-\d{2}-\d{5}$/;
        return pattern.test(val);
    };

    const handleSerialSubmit = () => {
        const trimmed = serialNumber.trim().toUpperCase();
        if (!validateSerial(trimmed)) {
            setSerialError("Please enter a valid card serial (e.g., MA-26-00451)");
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
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingVehicles(false);
        }
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
        } catch (err) {
            console.error(err);
        } finally {
            setLinking(false);
        }
    };

    const passportUrl = `https://motorambos.com/v/${publicId}`;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-10 pt-32">

                {/* Header */}
                <header className="space-y-2 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm mb-2">
                        <CreditCard className="h-3.5 w-3.5 text-primary" />
                        <span>Smart Card Setup</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Link Your Card</h1>
                    <p className="text-sm text-muted-foreground">
                        Connect the physical card to your vehicle to create its public Digital Passport.
                    </p>
                </header>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2">
                    {(["serial", "vehicle", "confirm", "success"] as Step[]).map((s, i) => (
                        <React.Fragment key={s}>
                            <div className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${step === s
                                ? "bg-primary scale-125 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                                : (["serial", "vehicle", "confirm", "success"].indexOf(step) > i
                                    ? "bg-primary/50"
                                    : "bg-muted")
                                }`} />
                            {i < 3 && <div className={`h-[2px] w-8 transition-all duration-500 ${["serial", "vehicle", "confirm", "success"].indexOf(step) > i
                                ? "bg-primary/50"
                                : "bg-muted"
                                }`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* ─── STEP 1: Enter Serial ─── */}
                {step === "serial" && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
                            {/* Visual Card Illustration */}
                            <div className="relative mx-auto w-full max-w-xs aspect-[1.6/1] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-xl">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                                <div className="flex justify-between items-start relative z-10">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">Digital Passport</span>
                                </div>
                                <div className="relative z-10 space-y-1">
                                    <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">Card Serial Number</div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-primary/60" />
                                        <span className="text-white font-mono font-bold text-lg tracking-widest">
                                            {serialNumber || "MA-26-_____"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end relative z-10">
                                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-tight">Motor Ambos</span>
                                    <div className="h-6 w-9 bg-white/10 rounded-md" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                                    Card Serial Number
                                </label>
                                <input
                                    type="text"
                                    value={serialNumber}
                                    onChange={(e) => {
                                        setSerialNumber(e.target.value.toUpperCase());
                                        setSerialError("");
                                    }}
                                    placeholder="MA-26-00451"
                                    className="w-full h-14 bg-muted/50 border border-border rounded-2xl px-5 text-lg font-mono font-bold tracking-wider text-center placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    maxLength={11}
                                />
                                {serialError && (
                                    <p className="text-xs text-destructive flex items-center gap-1.5">
                                        <AlertCircle className="h-3 w-3" />
                                        {serialError}
                                    </p>
                                )}
                                <p className="text-[11px] text-muted-foreground text-center">
                                    Find this number printed on the back of your Motor Ambos Smart Card.
                                </p>
                            </div>

                            <button
                                onClick={handleSerialSubmit}
                                disabled={!serialNumber.trim()}
                                className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </section>
                )}

                {/* ─── STEP 2: Select Vehicle ─── */}
                {step === "vehicle" && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
                            <div className="text-center space-y-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest mx-auto">
                                    <Hash className="h-3 w-3" />
                                    {serialNumber}
                                </div>
                                <h3 className="text-lg font-bold mt-3">Select a Vehicle</h3>
                                <p className="text-xs text-muted-foreground">
                                    Choose the vehicle to link to this physical card.
                                </p>
                            </div>

                            {loadingVehicles ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : vehicles.length === 0 ? (
                                <div className="text-center py-8 space-y-3">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                                        <Car className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">No vehicles found on your account.</p>
                                    <p className="text-xs text-muted-foreground">Add a vehicle in the app first, then come back to link your card.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {vehicles.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => handleSelectVehicle(v)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                                        >
                                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                                <Car className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-foreground capitalize truncate">
                                                    {v.year} {v.make} {v.model}
                                                </p>
                                                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                                    {v.plate || "No plate registered"}
                                                </p>
                                            </div>
                                            {v.nfc_card_id ? (
                                                <span className="text-[9px] font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20 uppercase">
                                                    Has Card
                                                </span>
                                            ) : (
                                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setStep("serial")}
                                className="w-full text-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                &larr; Back to serial entry
                            </button>
                        </div>
                    </section>
                )}

                {/* ─── STEP 3: Confirm ─── */}
                {step === "confirm" && selectedVehicle && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-bold">Confirm Link</h3>
                                <p className="text-xs text-muted-foreground">
                                    This will create a permanent public passport for this vehicle.
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="bg-muted/50 rounded-2xl p-6 space-y-4 border border-border/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Physical Card</span>
                                    <span className="font-mono font-bold text-foreground">{serialNumber}</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vehicle</span>
                                    <span className="font-bold text-foreground capitalize">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</span>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plate</span>
                                    <span className="font-mono font-bold text-primary">{selectedVehicle.plate || "—"}</span>
                                </div>
                            </div>

                            {selectedVehicle.nfc_card_id && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-600">This vehicle already has a linked card</p>
                                        <p className="text-[10px] text-amber-600/70 mt-0.5">
                                            Linking a new card will replace the existing Digital Passport URL. The old link will stop working.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep("vehicle")}
                                    className="flex-1 h-12 bg-muted text-muted-foreground rounded-2xl font-bold text-sm hover:bg-muted/80 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmLink}
                                    disabled={linking}
                                    className="flex-1 h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {linking ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-4 w-4" />
                                            Link Card
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── STEP 4: Success ─── */}
                {step === "success" && selectedVehicle && (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-center">
                            {/* Success animation */}
                            <div className="relative mx-auto h-20 w-20">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-30" />
                                <div className="relative h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Card Linked!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your Digital Passport is live. Anyone who taps or scans this card will see a verified profile of your vehicle.
                                </p>
                            </div>

                            {/* Generated URL */}
                            <div className="bg-muted/50 rounded-2xl p-5 space-y-3 border border-border/50">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Public Passport URL</div>
                                <div className="bg-background rounded-xl px-4 py-3 border border-border font-mono text-sm text-primary break-all">
                                    {passportUrl}
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/v/${publicId}`}
                                        target="_blank"
                                        className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        View Passport
                                    </Link>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(passportUrl);
                                        }}
                                        className="flex-1 h-10 bg-muted text-muted-foreground rounded-xl font-bold text-xs hover:bg-muted/80 transition-all"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Card Serial</p>
                                    <p className="font-mono font-bold text-sm mt-1">{serialNumber}</p>
                                </div>
                                <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Vehicle</p>
                                    <p className="font-bold text-sm mt-1 capitalize truncate">{selectedVehicle.make} {selectedVehicle.model}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
