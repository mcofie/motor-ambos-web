"use client";

import React from "react";
import Link from "next/link";
import { Twitter, ArrowUpRight } from "lucide-react";

export function PerkFinalCTA() {
    return (
        <section className="section-white">
            <div className="fintech-container text-center space-y-20 max-w-4xl">
                <h2 className="section-heading italic">
                    Stay on the road. <br /> Stay in control.
                </h2>
                <div className="flex flex-col sm:flex-row gap-10 justify-center pt-8">
                    <button className="btn-primary !px-16 !py-10 !text-2xl">
                        Join Protocol
                    </button>
                    <button className="btn-secondary !px-16 !py-10 !text-2xl flex items-center justify-center gap-4 group">
                        View Demo <ArrowUpRight size={28} className="transition-all group-hover:translate-x-2 group-hover:-translate-y-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export function PerkFooter() {
    return (
        <footer className="bg-foreground text-background py-32 mt-24">
            <div className="fintech-container">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-24 lg:gap-12">
                    <div className="space-y-12">
                        <Link href="/" className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary border-2 border-foreground rounded-[4px] flex items-center justify-center font-black text-3xl text-foreground shadow-[6px_6px_0px_0px_var(--primary)]">A</div>
                            <span className="text-4xl font-black tracking-tighter uppercase italic">ambos.</span>
                        </Link>
                        <p className="label-technical !text-background/40 max-w-[280px]">
                            Automotive Infrastructure <br /> for a Unified Africa.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-24 lg:gap-40">
                        <div className="space-y-10">
                            <h4 className="label-technical !text-primary">System_P7</h4>
                            <ul className="space-y-6 text-sm font-black uppercase italic">
                                <li className="hover:text-primary cursor-pointer transition-colors">Rescue Protocol</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Verified Logs</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Compliance</li>
                            </ul>
                        </div>
                        <div className="space-y-10">
                            <h4 className="label-technical !text-primary">Network_N12</h4>
                            <ul className="space-y-6 text-sm font-black uppercase italic">
                                <li className="hover:text-primary cursor-pointer transition-colors">Nodes Registry</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">API Status</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Workshops</li>
                            </ul>
                        </div>
                        <div className="space-y-10">
                            <h4 className="label-technical !text-primary">Legal_L0</h4>
                            <ul className="space-y-6 text-sm font-black uppercase italic">
                                <li className="hover:text-primary cursor-pointer transition-colors">Privacy</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Terms</li>
                                <li className="hover:text-primary cursor-pointer transition-colors">Audit</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-12 pt-20 mt-32 border-t border-background/10">
                    <div className="label-technical !text-background/20 !tracking-[0.4em]">
                        © 2026 Motor Ambos Tech Inc. / All Rights Reserved
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                            <span className="label-technical !text-primary !opacity-100">v4.2.0 / PROD_STABLE</span>
                        </div>
                        <Twitter size={24} className="hover:text-primary cursor-pointer transition-colors text-background/40" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
