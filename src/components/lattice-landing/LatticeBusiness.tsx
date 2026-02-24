"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ShieldAlert, Truck, ArrowRight } from "lucide-react";

export function LatticeBusiness() {
    const [activeTab, setActiveTab] = useState(0);

    const pillars = [
        { title: "Cost Control", icon: BarChart3, desc: "Eliminate Ghost receipts with NFC verified logs. Spot fuel skimming via mileage reconciliation." },
        { title: "Operational Efficiency", icon: Users, desc: "A ground-breaking heatmap showing which units are ready and which are grounded." },
        { title: "Asset Protection", icon: ShieldAlert, desc: "Boost resale value by up to 20% with certified, unalterable maintenance history." },
        { title: "Safety & Logistics", icon: Truck, desc: "One-tap universal rescue across Ghana (Accra to Kumasi) for all drivers." }
    ];

    return (
        <section id="business" className="py-32 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center text-center gap-6 mb-20 max-w-3xl mx-auto">
                    <div className="section-label-pill bg-blue-50 text-blue-600">Enterprise Ready</div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                        Transparency, efficiency, and asset longevity.
                    </h2>
                    <p className="text-xl text-slate-600">
                        Motor Ambos for Business puts fleet owners back in the driver's seat with verifiable data and instant support.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {pillars.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`flex flex-col items-start gap-4 p-8 rounded-3xl transition-all text-left border ${activeTab === i ? "bg-white border-slate-200 shadow-heavy" : "bg-white border-transparent hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === i ? "bg-emerald text-white" : "bg-slate-100 text-slate-400"
                                        }`}>
                                        <p.icon size={20} />
                                    </div>
                                    <h4 className={`text-lg font-bold ${activeTab === i ? "text-slate-900" : "text-slate-500"}`}>
                                        {p.title}
                                    </h4>
                                </div>
                                {activeTab === i && (
                                    <p className="text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                                        {p.desc}
                                    </p>
                                )}
                            </button>
                        ))}

                        <div className="flex items-center gap-4 pt-6">
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-8 py-7 h-auto text-lg shadow-soft">
                                Request Fleet Demo
                            </Button>
                            <Button variant="ghost" className="text-slate-600 font-bold hover:text-emerald">
                                Talk to Sales <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-7 relative">
                        {/* Mock Dashboard Illustration */}
                        <div className="bg-slate-900 rounded-[40px] p-2 shadow-heavy group">
                            <div className="bg-white rounded-[32px] overflow-hidden aspect-[4/3] relative flex flex-col">
                                <div className="h-12 border-b border-slate-100 px-6 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    </div>
                                    <div className="flex-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                                        Unit Management Dashboard
                                    </div>
                                </div>
                                <div className="flex-1 p-8 bg-slate-50">
                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-soft">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fuel Skimming Risk</div>
                                            <div className="text-2xl font-bold text-red-500">Low</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-soft">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fleet Compliance</div>
                                            <div className="text-2xl font-bold text-emerald">98%</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-soft">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Daily Trips</div>
                                            <div className="text-2xl font-bold text-slate-900">124</div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-soft flex-1 space-y-4">
                                        <div className="h-4 w-[60%] bg-slate-100 rounded-full" />
                                        <div className="h-4 w-[40%] bg-slate-100 rounded-full" />
                                        <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold border-2 border-dashed border-slate-100">
                                            Ground/Road-Ready Heatmap
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[100px] -z-10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
