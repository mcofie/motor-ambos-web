"use client";

import React from "react";
import { Check } from "lucide-react";

export function PerkDrivers() {
    const bullets = [
        "Never miss expiry deadlines.",
        "Prove your service history.",
        "Track your real car costs.",
        "Get verified roadside help."
    ];

    return (
        <section className="section-blue">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <h2 className="section-heading">
                            For drivers who take ownership seriously.
                        </h2>

                        <div className="space-y-6">
                            {bullets.map((bullet, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <div className="w-2 h-10 bg-[#9FE870] group-hover:w-4 transition-all" />
                                    <span className="text-3xl font-black tracking-tight">{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="architecture-block bg-black text-white space-y-12 p-16">
                            <div className="label-technical text-white/40">Driver Node Interface</div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="label-technical text-[#9FE870]">Compliance Status</div>
                                    <div className="text-4xl font-black">All Systems Verified</div>
                                </div>
                                <div className="h-px bg-white/10 w-full" />
                                <div className="grid grid-cols-2 gap-10">
                                    <div>
                                        <div className="label-technical text-white/40 mb-2">Service Log</div>
                                        <div className="text-xl font-bold">14 Records Signed</div>
                                    </div>
                                    <div>
                                        <div className="label-technical text-white/40 mb-2">Cost/km</div>
                                        <div className="text-xl font-bold">GHS 2.40</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Asymmetry: Negative space around the block */}
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#9FE870] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
