"use client";

import React from "react";
import { Shield, Microscope, LifeBuoy, CheckCircle2 } from "lucide-react";

export function PremiumServices() {
    const services = [
        {
            title: "Compliance & Security",
            subtitle: "Never miss a renewal again.",
            icon: Shield,
            items: ["Digital Glovebox", "Zero-Fine Expiry Alerts", "Verified NFC Service Records"],
            color: "emerald"
        },
        {
            title: "Insights & Diagnostics",
            subtitle: "Expert advice in your pocket.",
            icon: Microscope,
            items: ["AI Mechanic (English & Twi)", "Fuel & Expense Logs", "Driver Safety Score"],
            color: "emerald"
        },
        {
            title: "Support & Savings",
            subtitle: "The network you can trust.",
            icon: LifeBuoy,
            items: ["Local Marketplace", "Member-only Rates", "24/7 Rescue (App + USSD)"],
            color: "emerald"
        }
    ];

    return (
        <section id="services" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center flex flex-col items-center gap-4 mb-16">
                    <span className="section-label">Services</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white">Everything your car needs — in one system.</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div key={idx} className="glass-card p-10 flex flex-col gap-8 transition-all hover:scale-[1.02] hover:bg-white/[0.05] group">
                            <div className="w-16 h-16 rounded-2xl bg-emerald/10 border border-emerald/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-emerald/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <service.icon className="w-8 h-8 text-emerald relative z-10" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-muted-foreground text-sm">{service.subtitle}</p>
                            </div>

                            <ul className="flex flex-col gap-4 pt-4 border-t border-white/5">
                                {service.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
