"use client";

import React from "react";
import { ShieldCheck, Lock, Database } from "lucide-react";

export function PerkTrust() {
    const systems = [
        {
            title: "Dedicated fraud & verification",
            desc: "Advanced terminal protocols ensure that every record logged is from a verified provider.",
            icon: ShieldCheck
        },
        {
            title: "2-factor authentication",
            desc: "Keep your vehicle history secure with industry-standard login protection.",
            icon: Lock
        },
        {
            title: "Secure data storage",
            desc: "Your records are encrypted and stored in high-integrity cloud nodes.",
            icon: Database
        }
    ];

    return (
        <section className="wise-section bg-[#F0F2F5] border-t border-border">
            <div className="wise-container">
                <div className="space-y-20">
                    <div className="max-w-2xl">
                        <h2 className="wise-heading-section">
                            Built to protect your <br /> vehicle data.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
                        {systems.map((sys, i) => (
                            <div key={i} className="space-y-6">
                                <div className="w-14 h-14 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-sm">
                                    <sys.icon size={28} className="text-black" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black tracking-tight">{sys.title}</h3>
                                    <p className="text-base font-bold text-[#5D7079] leading-relaxed">
                                        {sys.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
