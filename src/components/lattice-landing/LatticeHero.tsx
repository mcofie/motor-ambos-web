"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function LatticeHero() {
    return (
        <section className="relative pt-40 pb-20 overflow-hidden bg-white">
            <div className="absolute top-0 left-0 w-full h-full lattice-gradient-mint opacity-60 -z-10" />
            <div className="absolute bottom-0 right-0 w-full h-full lattice-gradient-blue opacity-40 -z-10" />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-8 max-w-xl">
                        <div className="section-label-pill w-fit animate-in fade-in slide-in-from-bottom-2">
                            Driving Progress in Ghana
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            The Digital <br />
                            <span className="emerald-text-gradient">Passport</span> <br />
                            for your Car.
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed">
                            Compliance, verified service history, AI diagnostics, and emergency rescue — built for Ghana.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-emerald hover:bg-emerald/90 text-white font-bold rounded-full px-8 py-7 h-auto text-lg shadow-heavy transition-all hover:scale-105 active:scale-95">
                                Get the App
                            </Button>
                            <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full px-8 py-7 h-auto text-lg transition-all hover:scale-105 shadow-soft">
                                Request Fleet Demo
                            </Button>
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            * Works with USSD fallback in low-data areas.
                        </p>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000">
                        <Image
                            src="/lattice-collage.png"
                            alt="Motor Ambos app interface"
                            width={800}
                            height={800}
                            className="w-full h-auto object-contain drop-shadow-2xl"
                            priority
                        />
                        {/* Soft ambient blurs around the collage */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald/5 blur-[120px] rounded-full -z-10" />
                    </div>
                </div>

                {/* Trust Row */}
                <div className="mt-32 pt-12 border-t border-slate-100">
                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">
                        Trusted Across the Industry
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {["Insurers", "Auto Shops", "Fleet Operators", "Towing Partners", "Roadworthy Centres"].map((logo) => (
                            <span key={logo} className="text-xl font-bold text-slate-400 tracking-tighter">
                                {logo}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
