"use client";

import React from "react";
import { Shield, Zap, History, BarChart3, ArrowRight, Smartphone, Building2 } from "lucide-react";

export function PerkHero() {
    return (
        <section className="pt-32 pb-20 md:pt-48 md:pb-24 bg-white">
            <div className="fintech-container max-w-6xl">
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black bg-[#9FE870] text-[10px] font-black uppercase tracking-widest">
                        Unified Automotive Infrastructure
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-end">
                        <h1 className="hero-heading">
                            Control your <br className="hidden md:block" /> vehicle&apos;s <br className="hidden md:block" /> lifecycle.
                        </h1>
                        <div className="space-y-8 pb-4">
                            <p className="text-xl md:text-2xl font-black leading-tight text-black border-l-4 border-black pl-6 uppercase tracking-tight">
                                From AI diagnostics and verified service logs for drivers, to leakage prevention and automated compliance for fleets.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="btn-primary">
                                    <Smartphone size={20} className="mr-2" />
                                    Get App
                                </button>
                                <button className="btn-secondary">
                                    <Building2 size={20} className="mr-2" />
                                    Business
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkGrid() {
    const pillars = [
        {
            icon: <Shield size={24} />,
            title: "Compliance Layer",
            desc: "Digital Glovebox for Insurance and Roadworthy. Automated 'Zero-Fine' notifications.",
            feature: "B2C + B2B Audit"
        },
        {
            icon: <History size={24} />,
            title: "Verification Layer",
            desc: "Immutable logs via NFC taps. Eliminate 'Ghost' receipts and verify all repairs.",
            feature: "Tamper-Proof History"
        },
        {
            icon: <BarChart3 size={24} />,
            title: "Intelligence Layer",
            desc: "AI Mechanic diagnostics, Fleet Heatmaps, and real-time fuel efficiency logs.",
            feature: "Predictive Analytics"
        },
        {
            icon: <Zap size={24} />,
            title: "Rescue Layer",
            desc: "24/7 Roadside Rescue via App or USSD. Universal coverage across the network.",
            feature: "Emergency Protocol"
        }
    ];

    return (
        <section className="pb-32 bg-white">
            <div className="fintech-container">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pillars.map((item, i) => (
                        <div key={i} className="fintech-card flex flex-col justify-between group hover:bg-[#9FE870] transition-colors duration-300">
                            <div className="space-y-8">
                                <div className="h-12 w-12 border-2 border-black bg-white flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{item.title}</h3>
                                    <p className="text-sm font-bold leading-tight">{item.desc}</p>
                                </div>
                            </div>
                            <div className="pt-8 flex items-center justify-between border-t-2 border-black mt-8">
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.feature}</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
