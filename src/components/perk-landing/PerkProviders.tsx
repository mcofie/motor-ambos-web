"use client";

import React from "react";
import { Wrench, Zap, BarChart3, ShieldCheck, ArrowUpRight } from "lucide-react";

export function PerkProviders() {
    return (
        <section id="providers" className="section-dark">
            <div className="fintech-container">
                <div className="space-y-20">
                    <div className="space-y-8 max-w-4xl">
                        <div className="inline-flex items-center px-3 py-1 border-2 border-[#9FE870] bg-[#9FE870] text-[10px] font-black uppercase tracking-widest text-black">
                            Network Nodes & Workshops
                        </div>
                        <h2 className="section-heading text-white">
                            FUELING THE <br /> SERVICE ECONOMY.
                        </h2>
                        <p className="body-copy !text-white/60 max-w-2xl border-l-4 border-[#9FE870] pl-6 uppercase font-black italic">
                            AMBOS TRANSFORMS WORKSHOPS INTO HIGH-TRUST DATA NODES. ATTRACT PREMIUM FLEETS AND PROVE YOUR SERVICE QUALITY WITH VERIFIABLE LOGS.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: <Wrench size={32} />,
                                title: "ACCREDITED STATUS",
                                desc: "JOIN THE NETWORK OF VETTED WORKSHOPS. GET PRIORITIZED BY FLEET MANAGERS AND INDIVIDUAL DRIVERS."
                            },
                            {
                                icon: <Zap size={32} />,
                                title: "TAP-TO-LOG FLOW",
                                desc: "EVERY SERVICE SIGNED PHYSICALLY. ELIMINATE REPAIR DISPUTES AND BUILD AN IMMUTABLE LOG FOR EVERY CAR."
                            },
                            {
                                icon: <BarChart3 size={32} />,
                                title: "DEMAND ROUTING",
                                desc: "GET AUTOMATED SERVICE REQUESTS BASED ON VEHICLE HEALTH ALERTS. KEEP YOUR BAYS FULL WITH SYSTEM-DRIVEN LEADS."
                            },
                            {
                                icon: <ShieldCheck size={32} />,
                                title: "FLEET COMPLIANCE",
                                desc: "PROVIDERS SIGN OFF ON B2B AUDITS AUTOMATICALLY. REDUCE PAPERWORK AND ACCELERATE PAYMENT CYCLES."
                            }
                        ].map((item, i) => (
                            <div key={i} className="fintech-card !bg-transparent !border-[#9FE870] !p-8 space-y-8 group hover:bg-[#9FE870] hover:!text-black transition-all">
                                <div className="h-16 w-16 border-2 border-current flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{item.title}</h3>
                                    <p className="text-[11px] font-black uppercase opacity-60 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 border-4 border-[#9FE870] bg-white text-black flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="space-y-2">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Ready to join?</div>
                            <h4 className="text-3xl font-black uppercase tracking-tight">Become an Accredited Node</h4>
                        </div>
                        <button className="btn-primary !px-12 !py-6 !text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                            Apply as Provider <ArrowUpRight size={20} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
