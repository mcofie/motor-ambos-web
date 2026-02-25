"use client";

import React from "react";
import { CreditCard, Shield, Zap, Check, ArrowRight } from "lucide-react";

export function PerkNFC() {
    return (
        <section id="nfc" className="section-white">
            <div className="fintech-container">
                <div className="space-y-20">
                    {/* Header: Value Proposition */}
                    <div className="max-w-4xl space-y-8">
                        <div className="inline-flex items-center px-3 py-1 border-2 border-black bg-[#9FE870] text-[10px] font-black uppercase tracking-widest text-black">
                            The Proof of Service Protocol
                        </div>
                        <h2 className="section-heading">
                            TRUST, <br /> PHYSICALIZED.
                        </h2>
                        <p className="body-copy max-w-2xl border-l-4 border-black pl-6">
                            Every workshop visit, oil change, or major repair is signed physically via a high-security NFC tap. It turns your car&apos;s history into a verifiable asset.
                        </p>
                    </div>

                    {/* Card Types Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Vector: Basic */}
                        <div className="fintech-card !p-0 overflow-hidden !border-4 flex flex-col group">
                            <div className="p-8 lg:p-12 bg-[#F5F5F5] border-b-4 border-black flex flex-col sm:flex-row justify-between items-start gap-8 transition-colors group-hover:bg-[#9FE870]/10">
                                <div className="space-y-4">
                                    <div className="text-[12px] font-black uppercase tracking-[0.2em] opacity-40">Entry Tier</div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">VECTOR</h3>
                                    <p className="text-sm font-bold uppercase max-w-[200px]">The standard for modern vehicle compliance.</p>
                                </div>
                                <div className="h-40 w-64 bg-white border-4 border-black rounded-xl rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col p-6 justify-between">
                                    <div className="flex justify-between items-center text-black">
                                        <div className="h-6 w-6 bg-black rounded-sm" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Ambos v4.0</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-1/2 bg-black/10 rounded-full" />
                                        <div className="h-1.5 w-3/4 bg-black/10 rounded-full" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-tighter opacity-20">Vector Protocol</div>
                                </div>
                            </div>
                            <div className="p-12 space-y-10 flex-1 flex flex-col justify-between">
                                <ul className="space-y-4">
                                    {["DIGITAL PASSPORT ENABLED", "UNIFIED COMPLIANCE", "WORKSHOP TAP-TO-LOG", "EMERGENCY USSD ACCESS"].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4 text-sm font-black uppercase">
                                            <Check size={18} className="text-[#9FE870] stroke-[4px]" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-secondary w-full">Request Vector Card</button>
                            </div>
                        </div>

                        {/* Onyx: Premium */}
                        <div className="fintech-card !p-0 overflow-hidden !border-4 border-black bg-black text-white flex flex-col group">
                            <div className="p-8 lg:p-12 bg-[#1A1A1A] border-b-4 border-black flex flex-col sm:flex-row justify-between items-start gap-8 transition-colors group-hover:bg-[#9FE870]/5">
                                <div className="space-y-4">
                                    <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[#9FE870]">Black Tier</div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">ONYX PREMIUM</h3>
                                    <p className="text-sm font-bold uppercase max-w-[200px] text-white/50">Elite management for discerning owners & fleets.</p>
                                </div>
                                <div className="h-40 w-64 bg-[#0A0A0A] border-4 border-white rounded-xl -rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-[8px_8px_0px_0px_rgba(159,232,112,0.3)] relative overflow-hidden flex flex-col p-6 justify-between">
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 w-6 bg-[#9FE870] rounded-sm" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#9FE870]">Ambos Onyx</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
                                        <div className="h-1.5 w-3/4 bg-white/20 rounded-full" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-tighter text-[#9FE870]">Onyx Protocol</div>
                                </div>
                            </div>
                            <div className="p-12 space-y-10 flex-1 flex flex-col justify-between">
                                <ul className="space-y-4">
                                    {["EVERYTHING IN VECTOR", "CONCIERGE RESCUE ASSIST", "EXCLUSIVE MARKETPLACE RATES", "PRIORITY NETWORK ROUTING", "ONYX HARDWARE FINISH"].map((text, i) => (
                                        <li key={i} className="flex items-center gap-4 text-sm font-black uppercase">
                                            <Zap size={18} className="text-[#9FE870] fill-[#9FE870]" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn-primary w-full !border-white !bg-white !text-black hover:!bg-[#9FE870]">Order Onyx Card</button>
                            </div>
                        </div>
                    </div>

                    {/* WHY ENROL: User, Provider, Business */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                label: "FOR THE USER",
                                title: "VERIFIED EQUITY",
                                desc: "STOP LOSING 20% OF YOUR CAR'S VALUE BECAUSE YOU 'LOST THE RECEIPTS'. A VERIFIABLE HISTORY IS A LIQUID ASSET."
                            },
                            {
                                label: "FOR THE PROVIDER",
                                title: "ACCREDITED TRUST",
                                desc: "LOG SERVICES INSTANTLY AND PROVE YOUR WORKSHOP'S QUALITY. ATTRACT PREMIUM FLEETS THAT DEMAND DATA-BACKED REPAIRS."
                            },
                            {
                                label: "FOR THE BUSINESS",
                                title: "LEAKAGE CONTROL",
                                desc: "KNOW EXACTLY WHICH CAR GOT WHICH PART. EVERY TAP FROM A MECHANIC IS A VERIFIED MAINTENANCE COST. ZERO GHOST RECEIPTS."
                            }
                        ].map((item, i) => (
                            <div key={i} className="fintech-card flex flex-col justify-between hover:bg-black hover:text-white transition-colors">
                                <div className="space-y-6">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{item.label}</div>
                                    <h4 className="text-2xl font-black uppercase tracking-tight leading-none">{item.title}</h4>
                                    <p className="body-copy !text-sm !font-bold opacity-60 uppercase">{item.desc}</p>
                                </div>
                                <div className="mt-8 pt-8 border-t-2 border-current">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
