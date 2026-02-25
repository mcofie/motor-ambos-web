"use client";

import React from "react";
import {
    FileCheck,
    Nfc,
    Wrench,
    Droplets,
    ShoppingBag,
    Truck,
    Smartphone
} from "lucide-react";

export function PerkServices() {
    const services = [
        {
            title: "Compliance tracking",
            desc: "Automated alerts for insurance and roadworthy renewals.",
            icon: FileCheck
        },
        {
            title: "Verified NFC service logging",
            desc: "Tamper-proof service history using Ambos smart cards.",
            icon: Nfc
        },
        {
            title: "AI mechanic diagnostics",
            desc: "Smart diagnostics and fault analysis for any vehicle node.",
            icon: Wrench
        },
        {
            title: "Fuel & expense tracking",
            desc: "Visualized spending analysis to eliminate waste.",
            icon: Droplets
        },
        {
            title: "Marketplace",
            desc: "Direct access to vetted providers and verified parts.",
            icon: ShoppingBag
        },
        {
            title: "24/7 roadside rescue",
            desc: "One-tap recovery dispatch via App or USSD.",
            icon: Truck
        }
    ];

    return (
        <section id="services" className="wise-section bg-white">
            <div className="wise-container">
                <div className="space-y-20">
                    <div className="max-w-2xl">
                        <h2 className="wise-heading-section text-balance">
                            Everything your car needs.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <div key={i} className="wise-card wise-card-hover group cursor-default">
                                <div className="space-y-8">
                                    <div className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center group-hover:bg-[#9FE870] transition-colors">
                                        <service.icon size={24} className="text-black" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black tracking-tight">{service.title}</h3>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed">
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center md:justify-start pt-8">
                        <div className="flex items-center gap-4 p-4 pr-8 bg-[#F0F2F5] rounded-full border border-[#E2E8F0]">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-xs">A</div>
                            <span className="text-sm font-bold text-black uppercase tracking-widest">Available on App Store & Play Store</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
