"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, ShieldCheck, PieChart } from "lucide-react";

export function PremiumProviders() {
    const providerTypes = [
        "Mechanics", "Auto Shops", "Insurance", "Detailing", "Car Wash", "Towing", "Spare Parts"
    ];

    const benefits = [
        { title: "Verified Job Dispatch", icon: CheckCircle2, desc: "Receive high-quality leads from verified car owners." },
        { title: "Digital Reputation", icon: ShieldCheck, desc: "Build trust with a verified history and customer reviews." },
        { title: "Reduce Disputes", icon: PieChart, desc: "Crystal clear logs for every service event." },
        { title: "Analytics Dashboard", icon: TrendingUp, desc: "Track your performance and grow your business." }
    ];

    return (
        <section id="providers" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="section-label">For Providers</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-4">
                                More customers. Verified jobs. Trusted reputation.
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {providerTypes.map((type) => (
                                <div key={type} className="px-5 py-2 rounded-full border border-emerald/20 bg-emerald/5 text-emerald text-sm font-bold shadow-[0_0_15px_-5px_rgba(29,185,84,0.3)]">
                                    {type}
                                </div>
                            ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1">
                                        <benefit.icon size={20} className="text-emerald" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm tracking-wide">{benefit.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 leading-normal">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button className="bg-emerald hover:bg-emerald/90 text-navy font-bold rounded-full px-8 py-7 h-auto text-lg transition-transform hover:scale-105 active:scale-95">
                            Become a Provider
                        </Button>
                    </div>

                    <div className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/10 blur-3xl rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

                        <div className="space-y-6 relative z-10">
                            <h4 className="font-black text-2xl text-white">Join the Network</h4>
                            <p className="text-muted-foreground">The most trusted automotive marketplace in Ghana. We verify every provider to ensure premium service for our members.</p>

                            <div className="space-y-4 pt-4">
                                {[
                                    { name: "Accra Auto Specialists", type: "Mechanics", rating: 4.9 },
                                    { name: "Kumasi Prime Parts", type: "Spare Parts", rating: 4.8 },
                                    { name: "Coastal Towing Ltd", type: "Towing", rating: 5.0 },
                                ].map((p, i) => (
                                    <div key={i} className="p-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-navy border border-white/10" />
                                            <div>
                                                <div className="text-sm font-bold text-white">{p.name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{p.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-emerald">★ {p.rating}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
