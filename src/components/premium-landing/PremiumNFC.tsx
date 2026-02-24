"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";

export function PremiumNFC() {
    const steps = [
        { icon: CreditCard, title: "Order Card", desc: "Select your tier: Personal, Family, or Fleet." },
        { icon: Smartphone, title: "Pair in App", desc: "Instantly link the card to your digital vehicle passport." },
        { icon: CheckCircle2, title: "Tap to Log", desc: "Tap at any verified service center to log maintenance." }
    ];

    return (
        <section id="nfc" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-16">
                <span className="section-label">Smart NFC Card</span>
                <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6">Tap once. Prove everything.</h2>
            </div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative group perspective-2000">
                    <div className="absolute -inset-10 bg-emerald/10 blur-[120px] rounded-full group-hover:bg-emerald/20 transition-all" />
                    <Image
                        src="/nfc-card.png"
                        alt="Motor Ambos Onyx Card"
                        width={600}
                        height={400}
                        className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:rotate-y-12"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald/20 blur-[80px] -z-10 rounded-full animate-pulse" />
                </div>

                <div className="flex flex-col gap-10 text-left">
                    <div className="space-y-4">
                        <p className="text-xl text-white/80 font-medium leading-relaxed">
                            The Motorola Ambos NFC Card is more than an accessory. It's the physical bridge to your car's digital life.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="text-emerald w-5 h-5 shrink-0" />
                                <span>Links vehicle to digital passport instantly</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="text-emerald w-5 h-5 shrink-0" />
                                <span>Logs verified service events without manual entry</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="text-emerald w-5 h-5 shrink-0" />
                                <span>Boosts resale trust with unalterable history</span>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald">
                                    <step.icon size={18} />
                                </div>
                                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button className="bg-emerald hover:bg-emerald/90 text-navy font-bold rounded-full px-8 py-7 h-auto text-lg transition-all hover:scale-105">
                            Order NFC Card
                        </Button>
                        <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Pricing Tiers</div>
                            <div className="text-sm font-bold text-white flex gap-3">
                                <span>Personal</span>
                                <span className="text-white/20">|</span>
                                <span>Family</span>
                                <span className="text-white/20">|</span>
                                <span className="text-emerald">Fleet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
