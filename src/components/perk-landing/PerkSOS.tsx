"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Snowflake, Battery, Thermometer, ShieldAlert } from "lucide-react";

export function PerkSOS() {
    const options = [
        { name: "Flat Tyre", icon: Snowflake },
        { name: "Dead Battery", icon: Battery },
        { name: "Overheating", icon: Thermometer },
        { name: "Accident", icon: ShieldAlert }
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="ambos-card bg-red-500/5 dark:bg-red-500/10 p-12 md:p-24 border-red-500/20 flex flex-col items-center text-center gap-12 relative overflow-hidden">
                    <div className="space-y-6">
                        <div className="ambos-label bg-red-500 text-white">Emergency Protocol</div>
                        <h2 className="ambos-heading text-4xl md:text-8xl text-foreground">Immediate <br /> Rescue SOS.</h2>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
                            24/7 technical assistance and roadside recovery across Ghana. One tap or USSD fallback.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
                        {options.map((opt, i) => (
                            <button key={i} className="ambos-card bg-background p-8 border border-border flex flex-col items-center gap-6 group hover:border-red-500 transition-all">
                                <div className="w-12 h-12 bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <opt.icon size={24} />
                                </div>
                                <span className="mono-text text-sm">{opt.name}</span>
                            </button>
                        ))}
                    </div>

                    <button className="ambos-btn-lime bg-red-600 text-white hover:bg-red-700 py-8 px-16 text-2xl tracking-[0.2em]">
                        Signal Rescue Now
                    </button>
                </div>
            </div>
        </section>
    );
}
