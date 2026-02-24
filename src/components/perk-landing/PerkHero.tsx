"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PerkHero() {
    return (
        <section className="relative pt-44 pb-32 overflow-hidden bg-background">
            <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-12 flex flex-col items-center text-center space-y-12 mb-20">
                    <div className="ambos-label">Industrial Vehicle Infrastructure</div>
                    <h1 className="ambos-heading text-6xl md:text-[10vw] leading-[0.8] max-w-7xl mx-auto text-foreground">
                        The Digital <br /> Passport <br /> For Your Car.
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Operating system for car ownership in Ghana. Compliance, verified maintenance history, and 24/7 rescue.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <button className="ambos-btn-lime py-6 px-12 text-lg">
                            Get the App
                        </button>
                        <button className="ambos-btn-secondary py-6 px-12 text-lg">
                            Request Fleet Demo
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 pt-12">
                        {["USSD fallback", "NFC verified", "Secure glovebox", "24/7 rescue"].map((feat) => (
                            <div key={feat} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-primary" />
                                <span className="mono-text text-[10px] text-muted-foreground">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-12 relative w-full max-w-6xl mx-auto">
                    <div className="ambos-card bg-secondary/30 relative overflow-hidden aspect-video">
                        <iframe
                            className="absolute inset-0 w-full h-[120%] top-[-10%] grayscale hover:grayscale-0 transition-all duration-1000 pointer-events-none"
                            src="https://www.youtube.com/embed/mTYqUCVy-wc?autoplay=1&mute=1&loop=1&playlist=mTYqUCVy-wc&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&enablejsapi=1&origin=http://localhost:3000"
                            title="Motor Ambos Infrastructure"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                        <div className="absolute inset-0 bg-onyx/20 pointer-events-none" />
                        <div className="absolute top-4 right-4 ambos-label bg-primary text-black z-10">
                            SYSTEM_LIVE: 24.0.1
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof Row */}
            <div className="mt-24 border-y border-slate-100 py-12 bg-warm-grey/30">
                <div className="container mx-auto px-6">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                        Trusted by providers and partners
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-40 grayscale contrast-125">
                        {["Insurers", "Auto Shops", "Fleet Operators", "Roadworthy Centres", "Towing Partners"].map((logo) => (
                            <span key={logo} className="text-2xl font-black text-slate-900 tracking-tighter font-syne">
                                {logo}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
