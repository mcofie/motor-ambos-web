"use client";

import React from "react";
import { AlertCircle, Battery, Thermometer, ShieldOff } from "lucide-react";

export function PerkSOS() {
    const issues = [
        { label: "Flat tyre", icon: AlertCircle },
        { label: "Dead battery", icon: Battery },
        { label: "Overheating", icon: Thermometer },
        { label: "Accident", icon: ShieldOff }
    ];

    return (
        <section id="sos" className="wise-section bg-white border-t border-border">
            <div className="wise-container">
                <div className="space-y-16">
                    <div className="max-w-2xl">
                        <h2 className="wise-heading-section !leading-none">
                            Help, when <br /> you need it.
                        </h2>
                    </div>

                    <div className="wise-card !p-12 md:!p-16 bg-white border-2 border-red-500/20 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {issues.map((issue, i) => (
                                <div key={i} className="flex flex-col items-center gap-6 group cursor-pointer text-center">
                                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                        <issue.icon size={36} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-black text-[13px] uppercase tracking-[0.2em] text-black/60 group-hover:text-red-600 transition-colors">{issue.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
                            <p className="wise-body !text-black/80 max-w-xl text-center md:text-left">
                                Instant dispatch for physical roadside assistance. USSD protocol available for offline rescue.
                            </p>
                            <button className="bg-red-500 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-red-600 transition-all active:scale-[0.98] shadow-lg shadow-red-500/20">
                                Get help now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
