"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";

export function LatticeNFC() {
    return (
        <section id="nfc" className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center gap-6 mb-20">
                    <div className="section-label-pill">Smart NFC Cards</div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        Tap once. Prove every service event.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-emerald/5 blur-[120px] rounded-full group-hover:bg-emerald/10 transition-all -z-10" />
                        <Image
                            src="/lattice-nfc.png"
                            alt="Motor Ambos Onyx Card"
                            width={700}
                            height={500}
                            className="w-full h-auto object-contain drop-shadow-2xl rounded-[32px] transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div className="flex flex-col gap-12">
                        <div className="grid sm:grid-cols-1 gap-8">
                            {[
                                { icon: CreditCard, title: "1. Order NFC card", desc: "Select Personal, Family or Fleet tier and we'll ship it to you." },
                                { icon: Smartphone, title: "2. Pair in the app", desc: "Simply tap to pair the card with your vehicle passport in seconds." },
                                { icon: CheckCircle2, title: "3. Tap at service points", desc: "Vetted workshops use it to write verified logs directly to your car's history." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald shrink-0">
                                        <step.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                                        <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Available Tiers</h4>
                            <div className="grid grid-cols-3 gap-6">
                                {["Personal", "Family", "Fleet"].map((tier) => (
                                    <div key={tier} className="flex flex-col gap-4">
                                        <div className="text-lg font-black text-slate-900">{tier}</div>
                                        <Button variant="ghost" className="text-emerald font-bold p-0 justify-start hover:bg-transparent hover:text-emerald/80">
                                            Order <ArrowRight size={16} className="ml-1" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-12 py-8 h-auto text-xl shadow-heavy transition-all hover:scale-105">
                            Get Your Digital Passport
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { ArrowRight } from "lucide-react";
