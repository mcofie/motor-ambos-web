"use client";

import React from "react";
import { Shield, Zap, History, BarChart3, ArrowRight } from "lucide-react";

export function PerkHero() {
    return (
        <section className="section-white relative overflow-hidden">
            {/* Background Gradients for Platform */}
            <div className="platform:block hidden absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="platform:block hidden absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Background Glows for Onyx */}
            <div className="onyx:block hidden absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="onyx:block hidden absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="fintech-container relative z-10">
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-col gap-8 md:gap-12">
                        <div className="label-technical mx-auto lg:mx-0">
                            Motor_Amos Protocol / Infrastructure_Layer_01
                        </div>

                        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12 lg:gap-20 items-end">
                            <h1 className="hero-heading">
                                Control your <br className="hidden md:block" /> vehicle&apos;s <br className="hidden md:block" /> lifecycle.
                            </h1>
                            <div className="space-y-10 pb-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                                <p className="body-copy">
                                    A unified infrastructure for automotive ownership. Verify history, automate compliance, and eliminate technical uncertainty.
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                                    <button className="btn-primary">
                                        Deploy App <ArrowRight size={20} className="ml-2" />
                                    </button>
                                    <button className="btn-secondary">
                                        For Business
                                    </button>
                                </div>
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
            icon: <Shield size={24} strokeWidth={1.5} />,
            title: "Compliance",
            desc: "Digital Glovebox for Insurance and Roadworthy. Automated 'Zero-Fine' notifications.",
            feature: "Audit_Layer",
            color: "indigo"
        },
        {
            icon: <History size={24} strokeWidth={1.5} />,
            title: "Verification",
            desc: "Immutable logs via NFC taps. Eliminate 'Ghost' receipts and verify all repairs.",
            feature: "Log_Protocol",
            color: "blue"
        },
        {
            icon: <BarChart3 size={24} strokeWidth={1.5} />,
            title: "Intelligence",
            desc: "AI Mechanic diagnostics, Fleet Heatmaps, and real-time fuel efficiency logs.",
            feature: "Analysis_Engine",
            color: "violet"
        },
        {
            icon: <Zap size={24} strokeWidth={1.5} />,
            title: "Rescue",
            desc: "24/7 Roadside Rescue via App or USSD. Universal coverage across the network.",
            feature: "Emergency_Sys",
            color: "rose"
        }
    ];

    return (
        <section className="pb-48 bg-background">
            <div className="fintech-container">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                    {pillars.map((item, i) => (
                        <div key={i} className="fintech-card flex flex-col justify-between group h-full">
                            <div className="space-y-10">
                                <div className={`h-14 w-14 border-2 border-foreground bg-primary onyx:bg-white/5 onyx:border-white/10 platform:bg-primary/5 platform:border-0 platform:rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 onyx:rounded-2xl onyx:glow-${item.color === 'rose' ? 'red' : 'green'}`}>
                                    <div className="onyx:text-primary platform:text-primary">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic onyx:not-italic onyx:text-2xl onyx:tracking-tight platform:not-italic platform:text-[22px] platform:font-bold platform:tracking-tight platform:normal-case platform:text-slate-900">{item.title}</h3>
                                    <p className="text-sm font-bold leading-relaxed opacity-70 onyx:opacity-50 onyx:font-medium platform:opacity-100 platform:text-slate-500 platform:font-normal platform:text-[15px]">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-8 flex items-center justify-between border-t-2 border-foreground onyx:border-white/5 platform:border-slate-100 mt-12">
                                <span className="label-technical !opacity-100">{item.feature}</span>
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2 text-primary" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
