"use client";

import React from "react";
import { Phone } from "lucide-react";

export function PerkSOS() {
    return (
        <section id="sos" className="section-white">
            <div className="fintech-container">
                <div className="max-w-4xl mx-auto space-y-24 text-center">
                    <div className="space-y-8">
                        <h2 className="section-heading">When it matters.</h2>
                        <p className="body-copy max-w-xl mx-auto">
                            Immediate recovery dispatch. Automated failure selection. No guesswork.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-16">
                        <div className="flex flex-wrap justify-center gap-4">
                            {["Flat tyre.", "Battery.", "Overheating.", "Accident."].map((issue, i) => (
                                <div key={i} className="text-4xl md:text-6xl font-black text-black/10 hover:text-red-600 transition-colors cursor-default">
                                    {issue}
                                </div>
                            ))}
                        </div>

                        <button className="w-full max-w-2xl bg-red-600 text-white py-10 rounded-none font-black text-3xl uppercase tracking-tighter hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-6">
                            <Phone size={32} strokeWidth={3} />
                            Get rescue now
                        </button>
                    </div>

                    <div className="label-technical text-black/20">
                        Emergency Terminal Nodes Active // *443*1# USSD Protocol Available
                    </div>
                </div>
            </div>
        </section>
    );
}
