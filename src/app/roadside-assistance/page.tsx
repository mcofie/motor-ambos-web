import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Truck, Fuel, Battery, Key, ArrowRight, Zap, Shield, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Roadside Assistance | Motor Ambos",
    description: "24/7 Roadside Assistance. Towing, fuel delivery, battery jumpstart, and lockout services. Fast response times.",
};

export default function RoadsideAssistancePage() {
    return (
        <div className="min-h-screen bg-[#F0F2F5] text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32">
                {/* Hero Section */}
                <section className="bg-white py-32 border-b border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-red-500/5 blur-[120px]" />

                    <div className="wise-container relative z-10">
                        <div className="max-w-4xl space-y-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                                <Zap size={14} fill="currentColor" />
                                Rapid Response Protocol
                            </div>
                            <h1 className="wise-heading-hero">
                                Help is on <br /> the way.
                            </h1>
                            <p className="wise-body max-w-2xl">
                                High-velocity intervention for mechanical failure or logistics emergency. Direct dispatch units on standby across Accra — zero subscription forced.
                            </p>
                            <div className="flex flex-wrap gap-6 pt-4">
                                <button className="bg-red-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-200">
                                    <Phone size={24} />
                                    Deploy unit now
                                </button>
                                <button className="wise-btn-secondary">
                                    View full services
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="wise-section">
                    <div className="wise-container">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {[
                                { title: "Towing", icon: Truck, desc: "Professional extraction for mechanical failure. Transport to secure node." },
                                { title: "Refuel", icon: Fuel, desc: "Energy exhaustion? We deliver fuel payload to reach the nearest station." },
                                { title: "Jump Start", icon: Battery, desc: "Power failure? High-volt boost to initialize your systems today." },
                                { title: "Lockout", icon: Key, desc: "Integrity lock? Non-destructive entry protocols to regain access." }
                            ].map((s, i) => (
                                <div key={i} className="wise-card flex flex-col justify-between group cursor-default hover:border-red-200">
                                    <div className="space-y-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#F0F2F5] flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                            <s.icon size={28} className="text-black group-hover:text-red-600 transition-colors" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black tracking-tight">{s.title}</h3>
                                            <p className="text-base font-bold text-[#5D7079] leading-relaxed">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5D7079] group-hover:text-red-600 transition-colors">
                                        Dispatching... <ArrowRight size={14} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Proof Section */}
                <section className="wise-section bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="grid md:grid-cols-3 gap-16">
                            {[
                                { label: "Response Speed", value: "28 min", desc: "Average time to arrive at terminal." },
                                { label: "Network Coverage", value: "City Wide", desc: "Strategic units across the entire grid." },
                                { label: "Verified Units", value: "100%", desc: "Every responder is Ambos-vetted." },
                            ].map((stat, i) => (
                                <div key={stat.label} className="space-y-4 border-l-2 border-red-500 pl-8">
                                    <div className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">{stat.label}</div>
                                    <div className="text-5xl font-black tracking-tighter">{stat.value}</div>
                                    <p className="text-sm font-bold text-[#5D7079]">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="wise-section pb-48">
                    <div className="wise-container text-center space-y-12">
                        <h2 className="wise-heading-section">
                            Never stay <br /> stuck.
                        </h2>
                        <button className="bg-black text-[#9FE870] px-16 py-6 rounded-full font-black text-2xl hover:brightness-110 active:scale-95 transition-all">
                            Get the Motor Ambos App
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
