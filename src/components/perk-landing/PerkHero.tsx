"use client";

import React from "react";
import { ArrowRight, Shield, CheckCircle, Clock, Wrench, Activity } from "lucide-react";

export function PerkHero() {
    return (
        <section className="wise-section pb-20 pt-40 md:pt-48 bg-white overflow-hidden">
            <div className="wise-container">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content */}
                    <div className="space-y-12 wise-fade-in relative z-10">
                        <div className="space-y-8">
                            <h1 className="wise-heading-hero">
                                The digital glovebox <br className="hidden md:block" /> for your car.
                            </h1>
                            <p className="wise-body max-w-xl text-balance">
                                Your vehicle's digital passport. Manage compliance, verified service records, and roadside rescue — all in one high-integrity system.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <button className="wise-btn-primary group">
                                Get the app
                                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="wise-btn-secondary">
                                Request fleet demo
                            </button>
                        </div>
                    </div>

                    {/* Right: Vehicle Control Panel (Wise-style Widget) */}
                    <div className="relative wise-fade-in lg:ml-10">
                        <div className="absolute -inset-10 bg-[#9FE870]/5 rounded-full blur-[100px] -z-10" />

                        <div className="wise-card !p-0 overflow-hidden shadow-wise-lg border-2 border-[#9FE870]/20">
                            <div className="bg-[#FFFFFF] p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">Vehicle Control Panel</span>
                                    <div className="px-3 py-1 bg-[#9FE870]/20 text-[#2D5B18] text-[11px] font-black rounded-full uppercase tracking-tighter">Live Node_2024</div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "Your car", value: "Land Rover Defender", icon: Shield },
                                        { label: "Insurance expiry", value: "12 Oct 2024", icon: Clock },
                                        { label: "Roadworthy expiry", value: "24 Nov 2024", icon: CheckCircle },
                                        { label: "Latest service", value: "GHS 1,200", icon: Wrench },
                                        { label: "Total spend (YTD)", value: "GHS 8,400", icon: Activity, bold: true },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#F0F2F5] rounded-[12px] group hover:bg-[#FFFFFF] hover:shadow-sm border border-transparent hover:border-[#E2E8F0] transition-all cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5D7079] group-hover:text-black">
                                                    <item.icon size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-[#5D7079]">{item.label}</span>
                                            </div>
                                            <span className={`text-[15px] ${item.bold ? 'font-black text-black' : 'font-bold text-[#000000]'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full bg-[#9FE870] text-black py-5 rounded-[12px] font-black text-lg transition-transform active:scale-[0.98] shadow-sm">
                                    Stay compliant
                                </button>
                            </div>

                            <div className="bg-[#000000] p-6 flex justify-between items-center text-white">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Safety Score</span>
                                    <div className="text-3xl font-black text-[#9FE870]">98.2%</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/10">
                                    <Shield size={24} className="text-[#9FE870]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
