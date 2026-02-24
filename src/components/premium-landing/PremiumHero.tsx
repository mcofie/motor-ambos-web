"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Cpu, Database, Zap } from "lucide-react";

export function PremiumHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald/5 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 w-fit">
                        <span className="section-label">BUILT FOR GHANA</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-white">
                        The Digital <br />
                        <span className="emerald-text-gradient">Passport</span> <br />
                        for Your Car.
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                        Compliance. Verified service history. AI diagnostics. Emergency rescue. Everything your vehicle needs, unified in one premium ecosystem.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button className="bg-emerald hover:bg-emerald/90 text-navy font-bold rounded-full px-8 py-7 h-auto text-lg emerald-glow transition-all hover:scale-105 active:scale-95">
                            Get the App
                        </Button>
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full px-8 py-7 h-auto text-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                            Request Fleet Demo
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
                        {[
                            { icon: Cpu, text: "USSD Fallback" },
                            { icon: ShieldCheck, text: "NFC Verified" },
                            { icon: Database, text: "Secure Storage" },
                            { icon: Zap, text: "24/7 Rescue" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                <item.icon className="w-4 h-4 text-emerald" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                    {/* Hero Visuals */}
                    <div className="relative z-10 animate-in fade-in zoom-in duration-1000">
                        <div className="absolute -inset-10 bg-emerald/20 blur-[100px] rounded-full -z-10 opacity-50" />
                        <Image
                            src="/hero-phone.png"
                            alt="Motor Ambos App"
                            width={500}
                            height={800}
                            className="w-[300px] md:w-[450px] object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Floating NFC Card */}
                    <div className="absolute -bottom-10 -left-10 md:left-0 z-20 animate-bounce duration-3000 ease-in-out" style={{ animationDuration: '6s' }}>
                        <Image
                            src="/nfc-card.png"
                            alt="Motor Ambos NFC Card"
                            width={300}
                            height={200}
                            className="w-[180px] md:w-[260px] object-contain drop-shadow-2xl rotate-[-15deg] glass-card p-1"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
