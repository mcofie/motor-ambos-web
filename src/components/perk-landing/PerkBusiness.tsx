"use client";

import React from "react";
import { Check, ArrowRight, BarChart3, Database } from "lucide-react";

export function PerkBusiness() {
    return (
        <section id="business" className="section-blue">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Sketch Illustration */}
                    <div className="relative">
                        <div className="max-w-xl mx-auto transform lg:-translate-x-12">
                            <img
                                src="/Users/maxwellcofie/.gemini/antigravity/brain/c7261970-ed8d-49a1-9a3a-fccc5227265e/infographic_fleet_sketch_1772025611386.png"
                                alt="Fleet Management Sketch"
                                className="w-full h-auto opacity-90 rounded-3xl"
                            />
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                Fleets
                            </div>
                            <h2 className="section-heading">
                                Fleet visibility <br /> at scale.
                            </h2>
                            <p className="body-copy">
                                Strategic logistics infrastructure. Move from manual oversight to automated vehicle sovereignty. Reconcile fuel and eliminate ghost receipts instantly.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {["Ghost receipt elimination", "Fuel reconciliation", "Compliance automation", "Resale value protection"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-bold text-black/60">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button className="btn-primary">
                                Request fleet demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkSOS() {
    return (
        <section id="sos" className="section-white">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Text */}
                    <div className="space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                Roadside
                            </div>
                            <h2 className="section-heading">
                                When it matters.
                            </h2>
                            <p className="body-copy">
                                Instant roadside dispatch protocol for any vehicle failure. Use the app or USSD to get help immediately, verified by our network of rescue nodes.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-[#F4F8FD] rounded-2xl space-y-3">
                                <div className="text-[10px] font-black uppercase text-black/30">Average ETA</div>
                                <div className="text-2xl font-black">14.2m</div>
                            </div>
                            <div className="p-6 bg-[#F4F8FD] rounded-2xl space-y-3">
                                <div className="text-[10px] font-black uppercase text-black/30">Network Nodes</div>
                                <div className="text-2xl font-black">1.2K+</div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-[12px] hover:translate-x-1 transition-transform">
                                Request Rescue <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Product Card Visual */}
                    <div className="order-1 lg:order-2">
                        <div className="fintech-card fintech-shadow space-y-8 transform lg:scale-105">
                            <div className="flex justify-between items-center">
                                <div className="label-technical">SOS Terminal v4.0</div>
                                <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
                            </div>

                            <div className="space-y-4">
                                {["Flat Tyre", "Dead Battery", "Overheating", "Tow Request"].map((issue, i) => (
                                    <div key={i} className="p-5 border-2 border-[#E8EDF2] rounded-2xl flex justify-between items-center hover:border-red-600/30 cursor-pointer transition-colors group">
                                        <span className="font-black text-lg group-hover:text-red-600 transition-colors">{issue}</span>
                                        <div className="h-6 w-6 rounded-full border-2 border-[#E8EDF2] group-hover:bg-red-600 group-hover:border-red-600 transition-all" />
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-red-600/20">
                                Deploy Rescue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkTrust() {
    return (
        <section id="trust" className="section-blue">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Visual (Like "Fair, transparent fees") */}
                    <div className="relative">
                        <div className="fintech-card fintech-shadow p-10 space-y-8 bg-white max-w-md mx-auto">
                            <div className="space-y-2 pb-6 border-b border-[#F0F2F5]">
                                <h4 className="text-xl font-black">Fee Transparency</h4>
                                <p className="text-sm text-black/40">Real-time settlement for service providers.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-black/60">Subscription Fee</span>
                                    <span className="text-sm font-black text-[#9FE870]">GHS 0.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-black/60">Service Commission</span>
                                    <span className="text-sm font-black text-black">capped at 5%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-black/60">Network Access</span>
                                    <Check size={18} className="text-[#9FE870]" strokeWidth={3} />
                                </div>
                            </div>

                            <button className="w-full bg-[#9FE870] text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest">
                                Join the Network
                            </button>
                        </div>
                        {/* Background blobs for Cashramp feel */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#9FE870]/10 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* Right: Text */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h2 className="section-heading">
                                Built for scale <br /> across Africa.
                            </h2>
                            <p className="body-copy">
                                We believe in the sovereignty of vehicle data. Our systems are built to ensure that every record is verified, tamper-proof, and accessible. No hidden fees or locked ecosystems.
                            </p>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "No hidden service records",
                                "Verified NFC logs",
                                "Secure data storage",
                                "Direct settlement for workshops"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check size={16} className="text-[#9FE870]" strokeWidth={3} />
                                    <span className="text-sm font-bold text-black/60">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

