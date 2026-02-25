import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Briefcase, BarChart3, Users, Building2, ShieldCheck, ArrowRight, Zap, Globe, Cpu } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Motor Ambos for Business | Corporate Care & Employee Perks",
    description: "The ultimate employee perk for corporate Ghana. Motor Ambos Corporate Care ensures your team stays productive and safe, while we handle vehicle compliance and maintenance.",
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32">
                {/* Hero Section */}
                <section className="wise-section pb-32">
                    <div className="wise-container">
                        <div className="max-w-4xl space-y-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                <Briefcase size={14} className="text-[#9FE870]" />
                                Corporate Infrastructure
                            </div>
                            <h1 className="wise-heading-hero">
                                Keeping your <br /> workforce mobile.
                            </h1>
                            <p className="wise-body max-w-2xl">
                                Your top talent shouldn't be stuck at the DVLA or by the roadside. Secure the Ambos Business Protocol — the high-integrity infrastructure for elite corporate mobility.
                            </p>
                            <div className="flex flex-wrap gap-6 pt-4">
                                <button className="wise-btn-primary">
                                    Request demo
                                    <ArrowRight size={20} className="ml-3" />
                                </button>
                                <button className="wise-btn-secondary">
                                    Contact sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Showcase */}
                <section className="bg-[#F0F2F5] border-y border-border py-32">
                    <div className="wise-container">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-16">
                                <div className="space-y-8">
                                    <h2 className="wise-heading-section !leading-none">
                                        Visibility for <br /> every vehicle.
                                    </h2>
                                    <p className="wise-body">
                                        Companies in Accra lose thousands of productive hours to vehicle bureaucracy. We solve it by turning car care into a technical corporate benefit.
                                    </p>
                                </div>

                                <div className="space-y-10">
                                    {[
                                        { title: "Fleet-wide compliance", desc: "Automated roadworthy and insurance renewals through one terminal.", icon: Building2 },
                                        { title: "Maintenance auditing", desc: "Every service is data-verified on the Digital Passport.", icon: BarChart3 },
                                        { title: "Employee safety grid", desc: "Red-tier emergency response for all personnel.", icon: Zap }
                                    ].map((f, i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                                <f.icon size={24} className="text-black" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black tracking-tight">{f.title}</h4>
                                                <p className="text-base font-bold text-[#5D7079] leading-relaxed">{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative group lg:ml-10">
                                <div className="absolute -inset-10 bg-[#9FE870]/10 rounded-full blur-[120px] -z-10" />
                                <div className="wise-card !p-0 overflow-hidden shadow-wise-lg border-2 border-[#9FE870]/10">
                                    <div className="bg-black p-10 text-white space-y-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Fleet Overview</span>
                                                <h3 className="text-3xl font-black">24 Live Units</h3>
                                            </div>
                                            <div className="p-4 bg-white/10 rounded-2xl">
                                                <Globe size={28} className="text-[#9FE870]" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { name: "Unit_01 (Defender)", status: "Compliant" },
                                                { name: "Unit_02 (Hilux)", status: "Service Due", warning: true },
                                                { name: "Unit_03 (Corolla)", status: "Compliant" },
                                            ].map((unit, i) => (
                                                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="font-bold">{unit.name}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${unit.warning ? 'bg-amber-500/20 text-amber-400' : 'bg-[#9FE870]/20 text-[#9FE870]'}`}>
                                                        {unit.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#F0F2F5] flex items-center justify-center">
                                                    <Cpu size={18} />
                                                </div>
                                                <span className="text-sm font-bold">Node Integrity</span>
                                            </div>
                                            <span className="text-sm font-black text-[#9FE870]">99.8% Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="wise-section py-48 bg-white overflow-hidden relative">
                    <div className="wise-container text-center space-y-16">
                        <div className="space-y-8">
                            <h2 className="wise-heading-section !text-[64px] md:!text-[88px] tracking-tighter">
                                Turn chaos <br /> into trust.
                            </h2>
                            <p className="wise-body max-w-2xl mx-auto">
                                Join the banking and logistics leaders in Accra. Eliminate automotive failure as a risk factor for your business.
                            </p>
                        </div>
                        <button className="wise-btn-primary !px-24 !py-8 !text-2xl shadow-xl hover:translate-y-[-4px] transition-all">
                            Partner with us
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
