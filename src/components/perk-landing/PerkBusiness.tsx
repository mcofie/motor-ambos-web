"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieChart, TrendingUp, ShieldCheck, Map, LifeBuoy, ArrowRight } from "lucide-react";

export function PerkBusiness() {
    const [activeTab, setActiveTab] = useState(0);

    const pillars = [
        {
            title: "Cost control & transparency",
            icon: PieChart,
            points: ["Eliminate Ghost receipts", "Consolidated maintenance history", "Agreed prices + verified work"]
        },
        {
            title: "Leakage prevention",
            icon: TrendingUp,
            points: ["Fuel vs mileage reconciliation", "Stop fuel skimming", "Unauthorized use detection"]
        },
        {
            title: "Operational efficiency",
            icon: Map,
            points: ["Fleet heatmap: Grounded/Due/Ready", "Compliance renewals dashboard", "Automated scheduling"]
        },
        {
            title: "Asset protection",
            icon: ShieldCheck,
            points: ["Boost resale value by up to 20%", "Driver accountability scoring", "Certified history"]
        },
        {
            title: "Safety & logistics",
            icon: LifeBuoy,
            points: ["Universal rescue (Accra to Kumasi)", "App or USSD fallback", "24/7 roadside assistance"]
        }
    ];

    return (
        <section id="business" className="py-32 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-6 mb-24">
                    <div className="ambos-label">Enterprise Solution</div>
                    <h2 className="ambos-heading text-4xl md:text-8xl text-foreground">
                        Fleet Operations, <br /> Zero Guesswork.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-12 grid md:grid-cols-3 gap-6">
                        {pillars.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`ambos-card p-10 flex flex-col gap-8 text-left transition-all ${activeTab === i ? "border-primary bg-background" : "hover:border-primary/50"
                                    }`}
                            >
                                <div className={`w-10 h-10 flex items-center justify-center ${activeTab === i ? "bg-primary text-black" : "bg-foreground text-background"
                                    }`}>
                                    <p.icon size={20} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="ambos-heading text-xl tracking-wider text-foreground">{p.title}</h3>
                                    <ul className={`space-y-2 ${activeTab === i ? "block" : "hidden md:block opacity-40"}`}>
                                        {p.points.map((pt, j) => (
                                            <li key={j} className="flex items-center gap-2">
                                                <div className="w-1 h-1 bg-primary" />
                                                <span className="mono-text text-[10px]">{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {activeTab === i && (
                                    <div className="mt-auto flex justify-end">
                                        <ArrowRight size={16} className="text-primary" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-12 pt-12">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button className="ambos-btn-lime py-5 px-10 text-sm">
                                Request Fleet Demo
                            </button>
                            <button className="ambos-btn-secondary py-5 px-10 text-sm">
                                System Specs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
