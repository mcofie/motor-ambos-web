"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Snowflake, Battery, Thermometer, ShieldAlert, ArrowRight } from "lucide-react";

export function LatticeSOS() {
    const options = [
        { name: "Flat Tyre", icon: Snowflake },
        { name: "Dead Battery", icon: Battery },
        { name: "Overheating", icon: Thermometer },
        { name: "Accident", icon: ShieldAlert }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                <div className="lattice-card p-12 md:p-20 bg-slate-50 border-red-100 relative overflow-hidden flex flex-col items-center text-center gap-12">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -z-10 rounded-full" />

                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wider uppercase">
                            Emergency Only
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            One tap (or USSD) to get help now.
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl">
                            24/7 Roadside Rescue across Ghana. Whether it's a flat tyre in Accra or an engine issue in Kumasi, we've got you.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        {options.map((opt, i) => (
                            <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col items-center gap-4 group cursor-pointer hover:border-red-200 transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 transition-transform group-hover:scale-110">
                                    <opt.icon size={24} />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{opt.name}</span>
                            </div>
                        ))}
                    </div>

                    <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-full px-12 py-8 h-auto text-2xl shadow-[0_20px_40px_-10px_rgba(220,38,38,0.2)] transition-all hover:scale-105 active:scale-95">
                        Get Help Now
                    </Button>
                </div>
            </div>
        </section>
    );
}
