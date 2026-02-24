"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Car, Shield, Droplets, Truck, ShoppingBag, Landmark, ArrowRight } from "lucide-react";

export function LatticeProviders() {
    const categories = [
        { name: "Mechanics", icon: Wrench },
        { name: "Auto Shops", icon: Car },
        { name: "Insurers", icon: Shield },
        { name: "Detailing", icon: Droplets },
        { name: "Car Wash", icon: Droplets },
        { name: "Towing", icon: Truck },
        { name: "Spare Parts", icon: ShoppingBag },
        { name: "Roadworthy", icon: Landmark }
    ];

    const benefits = [
        "Reach thousands of verified car owners",
        "NFC-verified records reduce billing disputes",
        "Build a trust-based digital reputation",
        "Real-time analytics on your shop performance"
    ];

    return (
        <section id="providers" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Lattice Pattern Background (Optional or simple blurs) */}
            <div className="absolute top-0 right-0 w-full h-full lattice-gradient-purple opacity-30 -z-10" />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="flex flex-col gap-10">
                        <div className="space-y-6">
                            <div className="section-label-pill bg-purple-50 text-purple-600 uppercase tracking-widest font-bold">For Providers</div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                More customers. Verified jobs. Trusted digital reputation.
                            </h2>
                            <p className="text-xl text-slate-600">
                                Join our network of elite service providers and grow your business with accountability.
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-emerald/10 flex items-center justify-center text-emerald">
                                        <ArrowRight size={12} />
                                    </div>
                                    {b}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-4">
                            <Button className="bg-emerald hover:bg-emerald/90 text-white font-bold rounded-full px-8 py-7 h-auto text-lg shadow-soft">
                                Become a Provider
                            </Button>
                            <Button variant="outline" className="border-slate-200 bg-white text-slate-600 font-bold rounded-full px-8 py-7 h-auto text-lg">
                                Download Provider Pack
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {categories.map((cat, i) => (
                            <div key={i} className="lattice-card p-6 flex flex-col items-center gap-4 text-center group cursor-pointer hover:border-emerald/30">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald transition-colors">
                                    <cat.icon size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
