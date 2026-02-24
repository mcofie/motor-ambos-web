"use client";

import React from "react";
import { PlusCircle, CreditCard, Zap } from "lucide-react";

export function LatticeHowItWorks() {
    const steps = [
        { icon: PlusCircle, title: "1. Add your car", desc: "Scan your documents into the app." },
        { icon: CreditCard, title: "2. Tap to Log", desc: "Use the NFC card to verify history." },
        { icon: Zap, title: "3. Use Insights", desc: "Get rescue and AI diagnostics." }
    ];

    return (
        <section className="py-24 bg-white border-y border-slate-50">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-12">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-emerald shrink-0">
                                <step.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
