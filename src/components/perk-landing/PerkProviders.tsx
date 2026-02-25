"use client";

import React from "react";
import { Wrench, Shield, Car, Droplets, Truck, Info, ArrowUpRight, CheckCircle } from "lucide-react";

export function PerkProviders() {
    const providerTypes = [
        { label: "Mechanics", icon: Wrench },
        { label: "Insurance", icon: Shield },
        { label: "Auto shops", icon: Info },
        { label: "Roadworthy", icon: CheckCircle },
        { label: "Towing", icon: Truck },
        { label: "Car wash", icon: Droplets },
        { label: "Detailing", icon: Car }
    ];

    return (
        <section id="providers" className="wise-section bg-[#F0F2F5] border-t border-border">
            <div className="wise-container">
                <div className="max-w-4xl space-y-12 mb-24">
                    <h2 className="wise-heading-section !leading-none">
                        Grow with <br /> verified work.
                    </h2>
                    <p className="wise-body text-balance">
                        Integrate Ambos terminals into your workshop workflow and gain access to prioritized automotive fleets. Build trust through verifiable service records.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {providerTypes.map((type, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-8 wise-card !rounded-[12px] wise-card-hover group cursor-pointer text-center gap-5 bg-white border-transparent hover:border-[#9FE870]/30 transition-all">
                            <div className="w-12 h-12 flex items-center justify-center bg-[#F0F2F5] rounded-full group-hover:bg-[#9FE870] transition-colors">
                                <type.icon size={24} className="text-black" />
                            </div>
                            <span className="font-bold text-[13px] tracking-tight">{type.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-20">
                    <button className="wise-btn-primary !px-12 group">
                        Become a provider
                        <ArrowUpRight size={20} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
