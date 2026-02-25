"use client";

import React from "react";
import { Check, ClipboardCheck, Nfc, Wrench, Fuel, ShoppingBag, Truck } from "lucide-react";

export function PerkServices() {
    const features = [
        { title: "Compliance tracking", icon: ClipboardCheck },
        { title: "Verified NFC service logging", icon: Nfc },
        { title: "AI diagnostics", icon: Wrench },
        { title: "Fuel & expense management", icon: Fuel },
        { title: "Marketplace access", icon: ShoppingBag },
        { title: "24/7 rescue (App + USSD)", icon: Truck }
    ];

    return (
        <section id="services" className="section-blue">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-12 order-2 lg:order-1">
                        <div className="space-y-8">
                            <h2 className="section-heading">
                                Everything your <br /> car needs.
                            </h2>
                            <p className="body-copy max-w-lg">
                                Managing a vehicle shouldn&apos;t be a second job. Motor Ambos handles the technical logistics so you can focus on the road ahead.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-[#9FE870] flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-black" strokeWidth={3} />
                                    </div>
                                    <span className="text-[17px] font-bold text-black opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {f.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Illustration Mockup */}
                    <div className="order-1 lg:order-2">
                        <div className="relative group">
                            {/* Decorative background shadow/glow */}
                            <div className="absolute -inset-10 bg-white/40 blur-[80px] rounded-full -z-10 group-hover:bg-[#9FE870]/10 transition-colors" />

                            {/* Main Card */}
                            <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 border border-white max-w-md mx-auto relative overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-2 w-16 bg-[#F0F2F5] rounded-full" />
                                        <div className="h-10 w-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
                                            <Check size={20} className="text-black" strokeWidth={3} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="h-4 w-3/4 bg-black rounded-full" />
                                        <div className="h-4 w-1/2 bg-[#5D7079]/10 rounded-full" />
                                    </div>

                                    <div className="bg-[#F8F9FB] rounded-2xl p-6 space-y-4 border border-[#E8EDF2]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-[#9FE870]">
                                                <ClipboardCheck size={20} />
                                            </div>
                                            <div className="h-2 w-32 bg-[#5D7079]/20 rounded-full" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center text-blue-500">
                                                <Nfc size={20} />
                                            </div>
                                            <div className="h-2 w-24 bg-[#5D7079]/20 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="h-14 w-full bg-black rounded-xl flex items-center justify-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-[#9FE870] animate-pulse" />
                                            <div className="h-2 w-24 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating indicator */}
                                <div className="absolute top-1/4 -right-12 bg-[#9FE870] p-4 rounded-2xl shadow-xl transform rotate-12 border-4 border-white">
                                    <Check size={24} className="text-black" strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
