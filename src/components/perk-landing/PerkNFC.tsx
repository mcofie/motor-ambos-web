"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, CheckCircle2, ArrowRight } from "lucide-react";

export function PerkNFC() {
    return (
        <section id="nfc" className="py-32 bg-background border-t border-border">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-4 mb-24 items-center text-center">
                    <div className="ambos-label">Hardware Layer</div>
                    <h2 className="ambos-heading text-4xl md:text-7xl text-foreground">Tap to Verify. <br /> Prove Identity.</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="ambos-card p-4 bg-secondary/30 group">
                                <Image
                                    src="/images/vector-card.png"
                                    alt="Motor Ambos Vector Card"
                                    width={500}
                                    height={300}
                                    className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                                />
                                <div className="mt-4 flex justify-between items-center px-2">
                                    <span className="mono-text">Tier: Vector</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">Standard</span>
                                </div>
                            </div>
                            <div className="ambos-card p-4 bg-onyx/10 group">
                                <Image
                                    src="/images/onyx-card.png"
                                    alt="Motor Ambos Onyx Card"
                                    width={500}
                                    height={300}
                                    className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                                />
                                <div className="mt-4 flex justify-between items-center px-2">
                                    <span className="mono-text">Tier: Onyx</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">Premium</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            The physical gateway to your vehicle's digital passport. Secure maintenance logs, instant ID verification, and proof of ownership in one tap.
                        </p>

                        <div className="space-y-8">
                            {[
                                { title: "Secure Order", desc: "Select Vector (Individual) or Onyx (Fleet)." },
                                { title: "Vinci Pair", desc: "Link card to your Digital Passport ID via encrypted NFC." },
                                { title: "Tap to Log", desc: "Service providers tap to verify work in real-time." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="mono-text text-primary pt-1">0{i + 1}</div>
                                    <div className="space-y-2">
                                        <h4 className="ambos-heading text-xl text-foreground">{step.title}</h4>
                                        <p className="text-muted-foreground text-sm uppercase tracking-wide">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 flex gap-4">
                            <button className="ambos-btn-lime">Order Card</button>
                            <button className="ambos-btn-secondary">Technical Docs</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
