"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Wrench, Car, Shield, Droplets, Truck, ShoppingBag, Landmark, ArrowUpRight } from "lucide-react";

export function PerkProviders() {
    const categories = [
        "Mechanics", "Auto Shops", "Insurers", "Detailing", "Car Wash", "Towing", "Spare Parts", "Roadworthy Centres"
    ];

    const benefits = [
        { title: "More Customers", desc: "Get visibility in our premium marketplace for car owners." },
        { title: "Verified Jobs", desc: "NFC logs reduce billing disputes and build customer trust." },
        { title: "Dashboard", desc: "Optional provider dashboard to track jobs and analytics." }
    ];

    return (
        <section id="providers" className="py-32 bg-background border-y border-border">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                    <div className="space-y-6">
                        <div className="ambos-label">Marketplace</div>
                        <h2 className="ambos-heading text-4xl md:text-8xl">
                            Scalable growth <br /> for providers.
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="ambos-btn-lime">Partner with us</button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-20">
                    {categories.map((cat) => (
                        <div key={cat} className="px-5 py-2 border border-border bg-secondary/50 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors cursor-default">
                            {cat}
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((b, i) => (
                        <div key={i} className="ambos-card p-10 space-y-8 group hover:border-primary">
                            <div className="flex justify-between items-start">
                                <h3 className="ambos-heading text-2xl max-w-[120px]">{b.title}</h3>
                                <div className="mono-text text-primary text-lg">0{i + 1}</div>
                            </div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wide leading-relaxed">
                                {b.desc}
                            </p>
                            <div className="pt-4 border-t border-border flex justify-between items-center group-hover:border-primary transition-colors">
                                <span className="mono-text text-[10px]">Verified Status</span>
                                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
