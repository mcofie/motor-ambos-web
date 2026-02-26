"use client";

import React from "react";
import { Shield, History, BarChart3, PieChart, Sparkles, Map, TrendingUp, CheckCircle2 } from "lucide-react";

export function PerkProblem() {
    return (
        <section id="drivers" className="section-grey">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-32 items-start">
                    <div className="space-y-16">
                        <div className="space-y-8">
                            <div className="label-technical">Identity Management / Individual_Drivers</div>
                            <h2 className="section-heading">
                                Digital <br /> Passport.
                            </h2>
                            <p className="body-copy">
                                The Motor Ambos app transforms car ownership into a verified, intelligent experience. Eliminate technical uncertainty.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-10">
                            {[
                                { title: "Digital Glovebox", desc: "Store certificates and get zero-fine alerts.", icon: <Shield size={20} /> },
                                { title: "AI Mechanic", desc: "Diagnose issues in plain English or Twi.", icon: <Sparkles size={20} /> },
                                { title: "NFC Service Logs", desc: "Tamper-proof history signed at the shop.", icon: <History size={20} /> },
                                { title: "Safety Score", desc: "Improve driving to lower future premiums.", icon: <TrendingUp size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className="space-y-6 group">
                                    <div className="h-12 w-12 border-2 border-foreground bg-background onyx:bg-white/5 onyx:border-white/10 platform:bg-primary/5 platform:border-0 platform:rounded-xl flex items-center justify-center transition-all group-hover:bg-primary platform:group-hover:bg-primary/10 onyx:rounded-xl">
                                        <div className="onyx:text-primary group-hover:onyx:text-background platform:text-primary">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-xl uppercase tracking-tight italic onyx:not-italic onyx:text-lg onyx:tracking-normal platform:not-italic platform:text-lg platform:font-bold platform:normal-case platform:text-slate-900">{item.title}</h4>
                                    <p className="text-sm font-bold leading-relaxed opacity-60 italic onyx:not-italic onyx:opacity-40 platform:not-italic platform:opacity-100 platform:text-slate-500 platform:font-normal">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fintech-card !p-12 space-y-12 bg-background onyx:bg-[#0F1219] onyx:border-white/10 platform:border-slate-200 platform:shadow-2xl sticky top-44 onyx:rounded-[2rem] onyx:glow-green">
                        <div className="flex items-center gap-6 border-b-2 border-foreground onyx:border-white/5 platform:border-slate-100 pb-8">
                            <div className="h-14 w-14 border-2 border-foreground bg-primary onyx:bg-primary/20 onyx:border-primary platform:bg-primary platform:border-0 flex items-center justify-center font-black text-xl italic onyx:not-italic onyx:rounded-full platform:rounded-full">
                                <CheckCircle2 className="onyx:text-primary platform:text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase onyx:text-xl platform:normal-case platform:text-xl platform:font-bold">System Ready</h3>
                                <div className="label-technical !text-primary">Passport_v4.2.0 / ACTIVE</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 border-2 border-foreground onyx:border-white/5 onyx:bg-white/[0.02] platform:bg-slate-50 platform:border-slate-200 rounded-[var(--radius)] flex justify-between items-center text-sm font-black uppercase">
                                <span className="opacity-40 platform:text-slate-400 platform:font-semibold platform:normal-case">Fuel Efficiency</span>
                                <span className="italic onyx:not-italic text-primary platform:normal-case platform:font-bold">12.4 km/L</span>
                            </div>
                            <div className="p-6 border-2 border-foreground bg-primary onyx:bg-primary/10 onyx:border-primary/20 platform:bg-white platform:border-slate-200 rounded-[var(--radius)] flex justify-between items-center text-sm font-black uppercase">
                                <span className="italic onyx:not-italic onyx:text-primary platform:normal-case platform:font-semibold platform:text-slate-600">Insurance Status</span>
                                <span className="text-[10px] tracking-widest px-3 py-1 border-2 border-foreground onyx:border-primary bg-background onyx:bg-primary onyx:text-background platform:bg-green-500 platform:text-white platform:border-0 rounded-full">VERIFIED</span>
                            </div>
                            <div className="p-6 border-2 border-foreground bg-foreground text-background onyx:bg-foreground onyx:text-background platform:bg-slate-900 platform:text-white rounded-[var(--radius)] flex justify-between items-center text-sm font-black uppercase">
                                <span className="italic onyx:not-italic platform:normal-case platform:font-semibold">Roadworthy</span>
                                <span className="text-[10px] tracking-widest px-3 py-1 border-2 border-background onyx:border-background bg-foreground onyx:bg-background onyx:text-foreground platform:bg-amber-500 platform:text-white platform:border-0 rounded-full">23 DAYS LEFT</span>
                            </div>
                        </div>

                        <button className="btn-primary w-full !py-8">
                            Access Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkBusiness() {
    return (
        <section id="fleets" className="section-white">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-32 items-start">
                    <div className="order-2 lg:order-1 sticky top-44">
                        <div className="fintech-card !p-0 overflow-hidden !border-4 onyx:border-white/5 onyx:rounded-[2rem] platform:border-slate-200 platform:rounded-[24px]">
                            <div className="bg-foreground text-background onyx:bg-[#0F1219] onyx:text-foreground platform:bg-slate-900 platform:text-white p-10 border-b-4 border-foreground onyx:border-white/5 platform:border-0 flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="label-technical !text-background/40 onyx:!text-primary/60 platform:!text-indigo-400">Infrastructure_Audit / 2026</div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic onyx:not-italic onyx:text-2xl platform:normal-case platform:text-2xl platform:font-bold">Fleet Sovereignty.</h3>
                                </div>
                                <BarChart3 className="text-primary" size={42} />
                            </div>

                            <div className="p-10 bg-background onyx:bg-[#0F1219] platform:bg-white space-y-10">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-8 border-2 border-foreground onyx:border-white/5 bg-muted onyx:bg-white/[0.03] platform:bg-slate-50 platform:border-slate-100 space-y-2 hover:bg-primary platform:hover:bg-slate-100 transition-colors group onyx:rounded-2xl platform:rounded-2xl">
                                        <div className="label-technical group-hover:!text-foreground platform:!text-slate-400 platform:group-hover:!text-slate-600">Revenue_Savings</div>
                                        <div className="text-4xl font-black italic onyx:not-italic text-primary platform:normal-case platform:font-bold">15-20%</div>
                                    </div>
                                    <div className="p-8 border-2 border-foreground onyx:border-white/5 bg-muted onyx:bg-white/[0.03] platform:bg-slate-50 platform:border-slate-100 space-y-2 hover:bg-primary platform:hover:bg-slate-100 transition-colors group onyx:rounded-2xl platform:rounded-2xl">
                                        <div className="label-technical group-hover:!text-foreground platform:!text-slate-400 platform:group-hover:!text-slate-600">Fleet_Uptime</div>
                                        <div className="text-4xl font-black italic onyx:not-italic text-primary platform:normal-case platform:font-bold">98.2%</div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {["Leakage Prevention", "Fuel Reconciliation", "Automated Compliance"].map((text, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-black uppercase italic onyx:not-italic onyx:text-foreground/70 platform:normal-case platform:font-semibold platform:text-slate-600">
                                            <div className="h-5 w-5 border-2 border-foreground onyx:border-primary bg-primary onyx:bg-primary/20 platform:bg-primary platform:border-0 rounded-full" />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary w-full !py-8">
                                    Deploy Fleet Protocol
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-16">
                        <div className="space-y-8">
                            <div className="label-technical">Business Solutions / Fleet_Management</div>
                            <h2 className="section-heading">
                                Asset <br /> Longevity.
                            </h2>
                            <p className="body-copy">
                                Eliminate theft, automate document management, and increase resale value by up to 20% with technical asset verification.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-12">
                            {[
                                { title: "Leakage Prevention", desc: "Cross-reference logs to stop fuel skimming.", icon: <PieChart size={20} /> },
                                { title: "Fleet Heatmap", desc: "Instantly see health status of all vehicles.", icon: <Map size={20} /> },
                                { title: "Asset Protection", desc: "Certification adds 20% resale value.", icon: <Shield size={20} /> },
                                { title: "Universal Rescue", desc: "One tap for your entire national fleet.", icon: <CheckCircle2 size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="h-12 w-12 border-2 border-foreground bg-muted onyx:bg-white/5 onyx:border-white/10 platform:bg-primary/5 platform:border-0 platform:rounded-xl flex items-center justify-center onyx:rounded-xl">
                                        <div className="onyx:text-primary platform:text-primary">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h4 className="font-black text-xl uppercase tracking-tight italic onyx:not-italic onyx:text-lg platform:normal-case platform:text-lg platform:font-bold platform:text-slate-900">{item.title}</h4>
                                    <p className="text-sm font-bold leading-relaxed opacity-60 italic onyx:not-italic onyx:opacity-40 platform:normal-case platform:opacity-100 platform:text-slate-500 platform:font-normal">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkTrust() {
    return (
        <section id="trust" className="section-grey">
            <div className="fintech-container text-center space-y-24">
                <div className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="section-heading">Universal trust <br /> platform.</h2>
                    <p className="body-copy mx-auto italic onyx:not-italic platform:normal-case">
                        The foundation of Ghana&apos;s digital automotive economy. Vetted nodes, verified history, and technical reliability.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Verified Nodes", value: "1.2k+" },
                        { label: "Resolved SOS", value: "10k+" },
                        { label: "Market Share", value: "40%" },
                        { label: "Uptime", value: "99.9%" }
                    ].map((stat, i) => (
                        <div key={i} className="fintech-card bg-foreground text-background onyx:bg-[#0F1219] onyx:text-foreground onyx:border-white/5 platform:bg-white platform:text-slate-900 platform:border-slate-200 hover:bg-primary hover:text-foreground platform:hover:bg-slate-50 platform:hover:text-slate-900 transition-all group overflow-hidden relative onyx:rounded-2xl">
                            <div className="absolute top-2 right-2 label-technical !text-background/20 group-hover:!text-foreground/20 onyx:!text-primary/20 platform:!text-slate-300">LIVE_METRIC</div>
                            <div className="text-5xl font-black italic onyx:not-italic platform:not-italic platform:text-4xl platform:font-bold mb-4 text-primary">{stat.value}</div>
                            <div className="label-technical !text-background/40 group-hover:!text-foreground/60 onyx:!text-foreground/40 platform:!text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
