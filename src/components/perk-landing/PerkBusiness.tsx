"use client";

import React from "react";
import { Check, ArrowRight, Table, BarChart3, Clock, LayoutDashboard } from "lucide-react";

export function PerkBusiness() {
    const bullets = [
        "Eliminate ghost receipts",
        "Prevent fuel leakage",
        "Automate compliance renewals",
        "Increase resale confidence",
        "Centralized rescue coordination"
    ];

    return (
        <section id="business" className="wise-section bg-white border-t border-border">
            <div className="wise-container">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="wise-heading-section !leading-none">
                                Fleet control, <br /> simplified.
                            </h2>
                            <p className="wise-body max-w-xl">
                                Total visibility for corporate cars, logistics, and businesses. Manage scale without the friction of manual records and unverified spending.
                            </p>
                        </div>

                        <ul className="space-y-6">
                            {bullets.map((bullet, i) => (
                                <li key={i} className="flex items-center gap-6 group cursor-default">
                                    <div className="w-6 h-6 rounded-full bg-[#9FE870] flex items-center justify-center transition-transform group-hover:scale-110">
                                        <Check size={14} className="text-black" strokeWidth={5} />
                                    </div>
                                    <span className="font-bold text-[20px] tracking-tight transition-colors group-hover:text-black">{bullet}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-8">
                            <button className="wise-btn-primary !px-12 group">
                                Request demo
                                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Dashboard Preview (Conceptual UI) */}
                    <div className="relative wise-fade-in lg:ml-10">
                        <div className="relative wise-card !p-0 overflow-hidden shadow-wise-lg border border-[#E2E8F0] bg-[#FFFFFF]">
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center border-b border-[#F0F2F5] pb-6">
                                    <div className="flex items-center gap-4">
                                        <LayoutDashboard size={20} className="text-[#5D7079]" />
                                        <span className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">Live Fleet Audit</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-3 h-3 rounded-full bg-[#9FE870]" />
                                        <div className="w-3 h-3 rounded-full bg-[#F0F2F5]" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: "NODE_01", car: "Land Rover Defender", state: "Verified", cost: "GHS 2,400" },
                                        { id: "NODE_12", car: "Toyota Hilux (Fleet)", state: "Auditing", cost: "GHS 1,120", active: true },
                                        { id: "NODE_09", car: "Mercedes Sprinter", state: "Verified", cost: "GHS 4,890" }
                                    ].map((fleet, idx) => (
                                        <div key={idx} className={`p-6 rounded-[12px] border transition-all ${fleet.active ? 'bg-[#F0F2F5] border-transparent' : 'bg-white border-[#F0F2F5] hover:border-[#E2E8F0]'}`}>
                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black text-[#5D7079] uppercase tracking-widest opacity-60">{fleet.id}</div>
                                                    <div className="text-lg font-black tracking-tight">{fleet.car}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-black ${fleet.state === 'Auditing' ? 'text-amber-500' : 'text-[#9FE870]'}`}>{fleet.state}</div>
                                                    <div className="text-[12px] font-bold text-[#5D7079]">{fleet.cost}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#000000] p-8 flex justify-between items-center text-white">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <BarChart3 size={24} className="text-[#9FE870]" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Monthly Efficiency</div>
                                        <div className="text-3xl font-black text-[#9FE870]">+14.2%</div>
                                    </div>
                                </div>
                                <ArrowRight size={24} className="text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
