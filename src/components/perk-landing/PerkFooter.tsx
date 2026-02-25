"use client";

import React from "react";
import Link from "next/link";
import { Twitter, ArrowUpRight } from "lucide-react";

export function PerkFinalCTA() {
    return (
        <section className="bg-white py-32">
            <div className="fintech-container text-center space-y-12 max-w-4xl">
                <h2 className="section-heading">
                    STAY ON THE ROAD. <br /> STAY IN CONTROL.
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                    <button className="btn-primary !px-12 !py-8 !text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]">
                        Join Platform
                    </button>
                    <button className="btn-secondary !px-12 !py-8 !text-2xl flex items-center justify-center gap-3">
                        View Demo <ArrowUpRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export function PerkFooter() {
    return (
        <footer className="bg-black text-white py-24 border-t-8 border-black">
            <div className="fintech-container">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-[#9FE870] border-2 border-black rounded-[4px] flex items-center justify-center font-black text-2xl text-black">A</div>
                            <span className="text-3xl font-black tracking-tighter uppercase">ambos</span>
                        </Link>
                        <p className="text-sm font-black text-white/40 leading-relaxed max-w-[240px] uppercase tracking-widest">
                            Automotive Infrastructure <br /> for a Unified Africa.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-32">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">System</h4>
                            <ul className="space-y-4 text-[13px] font-black uppercase tracking-tight">
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">RESCUE PROTOCOL</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">NFC VERIFIED LOGS</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">COMPLIANCE LAYER</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">Network</h4>
                            <ul className="space-y-4 text-[13px] font-black uppercase tracking-tight">
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">NODES REGISTRY</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">API STATUS</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">WORKSHOPS</li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">Legal</h4>
                            <ul className="space-y-4 text-[13px] font-black uppercase tracking-tight">
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">PRIVACY PROTOCOL</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">TERMS OF USE</li>
                                <li className="hover:text-[#9FE870] cursor-pointer transition-colors">SECURITY AUDIT</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-16 mt-24 border-t border-white/10">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                        © 2026 Motor Ambos Tech Inc. / All Rights Reserved
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[#9FE870]">
                            <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">v4.0.2 / Production</span>
                        </div>
                        <Twitter size={20} className="hover:text-[#9FE870] cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
