import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CreditCard, ShieldCheck, ClipboardList, Zap, ArrowRight, Share2, Search, Cpu } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata = {
    title: "The Digital Passport | Motor Ambos",
    description: "The NFC Smart Card that acts as your car's Digital Glovebox. Managing compliance, history, and safety in one tap.",
};

export default function DigitalPassportPage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-[#F0F2F5]">
                    <div className="wise-container relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] shadow-xs">
                                <Cpu size={14} className="text-[#9FE870]" />
                                Hardware Anchor Protocol
                            </div>

                            <h1 className="wise-heading-hero">
                                Your car&apos;s <br />
                                <span className="text-[#2D5B18] italic">Digital Passport.</span>
                            </h1>

                            <p className="wise-body text-xl max-w-2xl mx-auto">
                                An immutable hardware record for the modern owner. Storing every repair, renewal, and safety metric in one sovereign interface.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <button className="wise-btn-primary !px-12 py-5 flex items-center gap-3">
                                    Order Hardware <ArrowRight size={20} />
                                </button>
                                <button className="wise-btn-secondary !px-12 py-5">
                                    Link Terminal
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-44 bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Permanent Log", icon: ClipboardList, color: "text-blue-600 bg-blue-50", desc: "Verified history of all repairs. Instant technical verification for mechanics via hardware tap—zero app overhead." },
                                { title: "DVLA Protocol", icon: ShieldCheck, color: "text-[#2D5B18] bg-[#9FE870]/10", desc: "Infrastructure-level monitoring. Automated roadworthy and insurance renewals synchronized with your physical ID." },
                                { title: "Emergency ICE", icon: Zap, color: "text-amber-600 bg-amber-50", desc: "High-priority medical beacon. Instant access for first responders to critical telemetry and emergency contacts." }
                            ].map((f, i) => (
                                <div key={i} className="wise-card !p-12 space-y-12 group hover:border-[#9FE870]">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", f.color)}>
                                        <f.icon size={28} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">{f.title}</h3>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resale Value Section */}
                <section className="py-44 bg-[#F0F2F5]">
                    <div className="wise-container">
                        <div className="flex flex-col lg:flex-row items-center gap-32">
                            <div className="lg:w-1/2 w-full">
                                <div className="wise-card !p-12 !bg-black text-white relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between shadow-wise-lg group">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#9FE870]/10 blur-[100px]" />

                                    <div className="flex justify-between items-start z-10">
                                        <div className="w-16 h-16 bg-[#9FE870] rounded-2xl flex items-center justify-center text-black">
                                            <Zap size={32} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">Terminal Alpha</p>
                                            <p className="text-sm font-black opacity-40">v1.0.4 r2</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 z-10">
                                        <p className="text-6xl font-black tracking-tighter opacity-10 group-hover:opacity-20 transition-opacity">PASSPORT</p>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#9FE870] w-1/3 group-hover:w-full transition-all duration-1000" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end z-10">
                                        <div className="text-2xl font-black tracking-widest">MOTOR AMBOS</div>
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-[#9FE870] animate-ping" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 space-y-12">
                                <h2 className="wise-heading-section !leading-none">Maximize <br /> <span className="text-[#2D5B18] italic">resale value.</span></h2>
                                <p className="wise-body">
                                    Africa&apos;s automotive market suffers from a trust deficit. The Ambos Passport provides buyers with immutable, hardware-verified proof of maintenance.
                                </p>
                                <ul className="space-y-6">
                                    {[
                                        "Verified Technical History",
                                        "Genuine Compliance Sync",
                                        "Transparent Ownership Data",
                                        "Unified Document Terminal"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Audit Terminal */}
                <section className="py-44 bg-black text-white text-center">
                    <div className="wise-container max-w-4xl space-y-16">
                        <div className="space-y-6">
                            <h2 className="wise-heading-hero !text-white !leading-none">Verify <br /> <span className="text-[#9FE870] italic">vehicle unit.</span></h2>
                            <p className="text-xl font-bold opacity-60 uppercase tracking-widest leading-relaxed">
                                Executing a purchase? Access the verified health report via the unique Ambos Identifier.
                            </p>
                        </div>

                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="ENTER SYSTEM ID: XXXX-XXXX"
                                className="w-full bg-white/5 border-2 border-white/10 focus:border-[#9FE870] rounded-[24px] py-8 px-10 text-3xl font-black uppercase tracking-[0.2em] outline-none transition-all placeholder:text-white/10 text-center"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-[#9FE870] rounded-2xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-wise-lg">
                                <Search size={28} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-60 bg-white text-center">
                    <div className="wise-container max-w-5xl space-y-16">
                        <h2 className="wise-heading-hero !leading-[0.85]">Transform <br /> <span className="text-[#2D5B18] italic">asset integrity.</span></h2>
                        <p className="text-xl font-bold text-[#5D7079] uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
                            The future of vehicle ownership is verified. Initialize your Digital Passport today.
                        </p>
                        <div className="pt-8">
                            <button className="wise-btn-primary !px-16 !py-6 !text-2xl shadow-[0_20px_60px_-10px_rgba(159,232,112,0.3)]">
                                Order Terminal Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
