"use client";

import React from "react";
import { Shield, Microscope, LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LatticeServices() {
    const services = [
        {
            title: "Compliance & Security",
            desc: "Store your Insurance and Roadworthy certificates in our secure Digital Glovebox. Get notified before they expire.",
            icon: Shield,
            color: "emerald"
        },
        {
            title: "Insights & Diagnostics",
            desc: "Chat with an AI Mechanic in English or Twi for instant diagnostics. Log every cedi spent on fuel and repairs.",
            icon: Microscope,
            color: "blue"
        },
        {
            title: "Support & Savings",
            desc: "Access our network of vetted providers at member-only rates. Call for emergency rescue even without data.",
            icon: LifeBuoy,
            color: "purple"
        }
    ];

    return (
        <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-end mb-20">
                    <div className="flex flex-col gap-6">
                        <div className="section-label-pill w-fit bg-slate-200 text-slate-600">Services</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                            Everything you need to keep your car compliant, healthy, and affordable.
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="lattice-card p-12 group flex flex-col items-start gap-8">
                            <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center transition-colors ${i === 0 ? "bg-emerald/10 text-emerald" :
                                    i === 1 ? "bg-blue-500/10 text-blue-600" :
                                        "bg-purple-500/10 text-purple-600"
                                }`}>
                                <s.icon size={28} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{s.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {s.desc}
                                </p>
                                <Link href="#" className="inline-flex items-center gap-2 text-emerald font-bold hover:gap-3 transition-all">
                                    Learn more <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
