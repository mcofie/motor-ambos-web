"use client";

import React from "react";
import { Check, Smartphone, Shield, History, Users, BarChart3, PieChart, Sparkles, Map, TrendingUp } from "lucide-react";

export function PerkProblem() {
    return (
        <section id="drivers" className="section-grey">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-2 py-1 border-2 border-black bg-white text-[9px] font-black uppercase tracking-widest">For Individual Drivers</div>
                            <h2 className="section-heading">
                                Digital <br /> Passport.
                            </h2>
                            <p className="body-copy max-w-md border-l-4 border-black pl-6">
                                THE MOTOR AMBOS APP TRANSFORMS CAR OWNERSHIP INTO A VERIFIED, INTELLIGENT EXPERIENCE.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { title: "DIGITAL GLOVEBOX", desc: "STORE CERTIFICATES AND GET ZERO-FINE ALERTS.", icon: <Shield size={20} /> },
                                { title: "AI MECHANIC", desc: "DIAGNOSE ISSUES IN PLAIN ENGLISH OR TWI.", icon: <Sparkles size={20} /> },
                                { title: "NFC SERVICE LOGS", desc: "TAMPER-PROOF HISTORY SIGNED AT THE SHOP.", icon: <History size={20} /> },
                                { title: "SAFETY SCORE", desc: "IMPROVE DRIVING TO LOWER FUTURE PREMIUMS.", icon: <TrendingUp size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className="fintech-card !p-6 space-y-4 hover:bg-[#9FE870] transition-colors">
                                    <div className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-black text-lg uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-sm font-bold leading-tight uppercase opacity-60">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fintech-card !p-10 space-y-8 bg-white sticky top-32">
                        <div className="flex items-center gap-4 border-b-2 border-black pb-6">
                            <div className="h-12 w-12 border-2 border-black bg-[#9FE870] flex items-center justify-center font-black">GW</div>
                            <div>
                                <h3 className="text-xl font-black uppercase">GW-1234-22</h3>
                                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Digital Passport v2.0</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 border-2 border-black rounded-[4px] flex justify-between items-center text-sm font-black uppercase">
                                <span className="opacity-40">Efficiency</span>
                                <span>12.4 km/L</span>
                            </div>
                            <div className="p-4 border-2 border-black bg-[#9FE870] rounded-[4px] flex justify-between items-center text-sm font-black uppercase">
                                <span>Insurance</span>
                                <span className="text-[10px] tracking-widest px-2 py-0.5 border-2 border-black bg-white">Verified</span>
                            </div>
                            <div className="p-4 border-2 border-black bg-black text-white rounded-[4px] flex justify-between items-center text-sm font-black uppercase">
                                <span>Roadworthy</span>
                                <span className="text-[10px] tracking-widest px-2 py-0.5 border-2 border-white bg-black">23 Days Left</span>
                            </div>
                        </div>

                        <button className="btn-primary w-full">
                            Get Dashboard
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
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    <div className="order-2 lg:order-1 sticky top-32">
                        <div className="fintech-card !p-0 overflow-hidden !border-4">
                            <div className="bg-black text-white p-8 border-b-4 border-black flex justify-between items-center">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Asset Audit</div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">Fleet Sovereignty</h3>
                                </div>
                                <BarChart3 className="text-[#9FE870]" size={32} />
                            </div>

                            <div className="p-8 bg-white space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 border-2 border-black bg-[#F5F5F5] space-y-1 hover:bg-[#9FE870] transition-colors">
                                        <div className="text-[10px] font-black uppercase opacity-40">Savings</div>
                                        <div className="text-2xl font-black">15-20%</div>
                                    </div>
                                    <div className="p-6 border-2 border-black bg-[#F5F5F5] space-y-1 hover:bg-[#9FE870] transition-colors">
                                        <div className="text-[10px] font-black uppercase opacity-40">Health</div>
                                        <div className="text-2xl font-black">98.2%</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {["NO GHOST RECEIPTS", "FUEL RECONCILIATION", "DRIVER SAFETY TRACKED"].map((text, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-black uppercase">
                                            <div className="h-4 w-4 border-2 border-black bg-[#9FE870]" />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                                    Manage Fleet
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-2 py-1 border-2 border-black bg-black text-[#9FE870] text-[9px] font-black uppercase tracking-widest">B2B Sovereignty</div>
                            <h2 className="section-heading">
                                Asset <br /> Longevity.
                            </h2>
                            <p className="body-copy max-w-md border-l-4 border-black pl-6">
                                ELIMINATE THEFT, AUTOMATE DOCUMENT MANAGEMENT, AND INCREASE RESALE VALUE BY UP TO 20%.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { title: "LEAKAGE PREVENTION", desc: "CROSS-REFERENCE LOGS TO STOP FUEL SKIMMING.", icon: <PieChart size={20} /> },
                                { title: "FLEET HEATMAP", desc: "INSTANTLY SEE HEALTH STATUS OF ALL VEHICLES.", icon: <Map size={20} /> },
                                { title: "ASSET PROTECTION", desc: "MOTOR AMBOS CERTIFICATION ADDS 20% RESALE VALUE.", icon: <Shield size={20} /> },
                                { title: "UNIVERSAL RESCUE", desc: "ONE TAP FOR YOUR ENTIRE NATIONAL FLEET.", icon: <Users size={20} /> }
                            ].map((item, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="h-10 w-10 border-2 border-black bg-[#F5F5F5] flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <h4 className="font-black text-lg uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-sm font-bold leading-tight uppercase opacity-40">{item.desc}</p>
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
            <div className="fintech-container text-center max-w-4xl space-y-20">
                <div className="space-y-8">
                    <h2 className="section-heading">Built for scale.</h2>
                    <p className="body-copy max-w-2xl mx-auto uppercase font-black opacity-40">
                        Reliable / Transparent / ALWAYS ON
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Verified Nodes", value: "1.2k+" },
                        { label: "Resolved SOS", value: "10k+" },
                        { label: "Market Share", value: "40%" },
                        { label: "Uptime", value: "99.9%" }
                    ].map((stat, i) => (
                        <div key={i} className="fintech-card bg-black text-white hover:bg-[#9FE870] hover:text-black transition-colors">
                            <div className="text-4xl font-black tracking-tighter mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
