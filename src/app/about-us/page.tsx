import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Car, ShieldCheck, Users, Target, Heart, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "About Us | Motor Ambos",
    description: "Driven by service, powered by data. Building the digital infrastructure for vehicle ownership across Africa.",
};

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32">
                {/* Hero Section */}
                <section className="wise-section pb-32">
                    <div className="wise-container">
                        <div className="max-w-4xl space-y-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                <Target size={14} className="text-[#9FE870]" />
                                Mission Statement v4.2
                            </div>
                            <h1 className="wise-heading-hero">
                                Driven by service. <br />
                                <span className="text-[#9FE870] italic">Powered by data.</span>
                            </h1>
                            <p className="wise-body max-w-3xl">
                                Motor Ambos is building the high-integrity digital infrastructure for vehicle ownership across Africa. We combine trusted networks, verified history, and technical precision to keep you moving.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-24 mt-24 border-y border-border">
                            {[
                                { label: "Verified Mechanics", value: "500+" },
                                { label: "Network Availability", value: "24/7" },
                                { label: "Average Dispatch", value: "15 min" },
                                { label: "Protected Units", value: "5K+" }
                            ].map((stat) => (
                                <div key={stat.label} className="space-y-2">
                                    <div className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">{stat.label}</div>
                                    <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Principles */}
                <section className="wise-section bg-[#F0F2F5]">
                    <div className="wise-container">
                        <div className="mb-24 space-y-8">
                            <h2 className="wise-heading-section">The standard <br /> of trust.</h2>
                            <p className="wise-body max-w-2xl">
                                Infrastructure is invisible until it fails. We built Motor Ambos to be the invisible infrastructure that keeps the road moving.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Digital Mobility", icon: Car, desc: "Eliminating friction through high-speed dispatch and verified technical routing." },
                                { title: "Network Integrity", icon: Users, desc: "Every provider is a verified node in our ecosystem, governed by technical performance standards." },
                                { title: "Unfailing Safety", icon: ShieldCheck, desc: "Total transparency from dispatch to repair, ensuring that trust is data-driven, not assumed." }
                            ].map((p, i) => (
                                <div key={i} className="wise-card !p-12 space-y-10 group">
                                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-xs">
                                        <p.icon size={28} className="text-black" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
                                        <p className="text-base font-bold text-[#5D7079] leading-relaxed italic opacity-80">
                                            "{p.desc}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final Vision */}
                <section className="wise-section pb-48 text-center bg-white relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#9FE870]/5 blur-[120px] -z-10" />
                    <div className="wise-container space-y-16">
                        <div className="space-y-8">
                            <h2 className="wise-heading-section md:text-[88px]">The road needs <br /> a system.</h2>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="wise-btn-primary !px-16">
                                Join our network
                                <ArrowRight size={20} className="ml-3" />
                            </button>
                            <button className="wise-btn-secondary !px-16">
                                Contact us
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
