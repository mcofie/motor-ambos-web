"use client";

import React from "react";
import { CreditCard, Cpu, Shield, ArrowRight, Zap, Target } from "lucide-react";

export function PerkNFC() {
    return (
        <section id="nfc" className="maze-section bg-background border-t border-border/40 relative overflow-hidden">
            <div className="maze-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div className="space-y-16">
                        <div className="space-y-10">
                            <div className="maze-pill">
                                <Target size={12} className="text-foreground/40" />
                                <span className="maze-label !text-foreground/40">Hardware_Store_04</span>
                            </div>
                            <h2 className="maze-heading text-7xl md:text-9xl leading-[0.8] tracking-tighter">
                                Secure your <br />
                                <span className="opacity-10 italic">identity.</span>
                            </h2>
                            <p className="maze-body text-2xl md:text-3xl max-w-xl opacity-60">
                                The Onyx Card is a secure bridge between the physical vehicle and its digital record. Encrypted, forged in Accra, built for life.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            {[
                                { l: "Encryption", v: "AES-256 Bit" },
                                { l: "Interface", v: "NFC ISO/IEC" },
                                { l: "Durability", v: "Reinforced Poly" },
                                { l: "Range", v: "13.56 MHz" }
                            ].map(s => (
                                <div key={s.l} className="space-y-2 pb-6 border-b border-border/40">
                                    <div className="maze-label">{s.l}</div>
                                    <div className="maze-heading text-2xl tracking-tight">{s.v}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <button className="maze-btn-dark !rounded-full !px-16 !py-8 !text-lg flex items-center justify-center gap-4 group">
                                Purchase Onyx Card
                                <ArrowRight className="opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="relative perspective-[2000px]">
                        {/* Premium Hardware Visual */}
                        <div className="absolute -inset-20 bg-primary/20 blur-[180px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

                        <div className="relative aspect-[1.6/1] bg-[#0A0A0A] rounded-[32px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden transform rotate-[-4deg] hover:rotate-0 hover:scale-105 transition-all duration-1000 border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                            <div className="p-16 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="maze-heading text-white text-5xl tracking-[0.3em] font-bold uppercase leading-none opacity-90">Ambos</div>
                                        <div className="maze-label !text-white/20 tracking-[0.4em] text-[10px]">DIGITAL_NODE_ID</div>
                                    </div>
                                    <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Zap className="text-primary" size={32} fill="currentColor" />
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-4">
                                        <div className="maze-label !text-white/10 font-mono text-[9px]">ENCRYPTED_HARDWARE_v2.04</div>
                                        <div className="maze-heading text-white/30 text-xl font-mono tracking-[0.5em]">ONYX_SYSTEMS</div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Shield className="text-white/5" size={64} strokeWidth={1} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Price Tag */}
                        <div className="absolute top-10 right-10 maze-card bg-background/80 backdrop-blur-xl !px-10 !py-8 !rounded-[24px] shadow-2xl skew-x-3">
                            <div className="maze-label mb-2">Starting_at</div>
                            <div className="maze-heading text-5xl font-bold tracking-tighter">GHS 150</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
