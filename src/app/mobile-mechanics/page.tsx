import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Wrench, Clock, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
    title: "Mobile Mechanics | Motor Ambos",
    description: "Book extensive mobile mechanic services at your home or office. Diagnostics, repairs, and maintenance directly to you.",
};

export default function MobileMechanicsPage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-[#F0F2F5]">
                    <div className="wise-container relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <h1 className="wise-heading-hero">
                                Expert repairs. <br />
                                <span className="text-[#2D5B18] italic">Verified history.</span>
                            </h1>

                            <p className="wise-body text-xl max-w-2xl mx-auto">
                                Bypass the repair shop infrastructure. Our certified mobile units deploy directly to your location. Every intervention is officially logged to your vehicle&apos;s digital passport.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <Link href="/help">
                                    <button className="wise-btn-primary !px-12 py-5 flex items-center gap-3">
                                        Book Mechanic Node <ArrowRight size={20} />
                                    </button>
                                </Link>
                                <Link href="/digital-passport">
                                    <button className="wise-btn-secondary !px-12 py-5">
                                        Passport sync
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-44 bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Full Spectrum", icon: Wrench, color: "text-blue-600 bg-blue-50", desc: "From fluid diagnostics and braking systems to complex mechanical interventions. Professional grade mobile infrastructure." },
                                { title: "Zero Friction", icon: Clock, color: "text-amber-600 bg-amber-50", desc: "Eliminate the drop-off queue. We maintain your asset while you execute your primary professional priorities." },
                                { title: "Hardware Audit", icon: ShieldCheck, color: "text-[#2D5B18] bg-[#9FE870]/10", desc: "Every component replacement is serialized on your NFC Smart Card, securing asset integrity and resale value." }
                            ].map((b, i) => (
                                <div key={i} className="wise-card !p-12 space-y-12 group hover:border-[#9FE870]">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", b.color)}>
                                        <b.icon size={28} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">{b.title}</h3>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technical Sequence */}
                <section className="py-44 bg-[#F0F2F5]">
                    <div className="wise-container">
                        <div className="mb-24 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                Deployment Flow
                            </div>
                            <h2 className="wise-heading-section !leading-none">Technical Sequence.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Diagnostic", desc: "Describe the anomaly or select a standard maintenance protocol for immediate evaluation." },
                                { step: "02", title: "Quotation", desc: "Receive instant technical cost analysis and schedule your deployment with guaranteed price locks." },
                                { step: "03", title: "Deployment", desc: "A certified mobile unit arrives at your node to execute repairs with full industrial precision." }
                            ].map((s, i) => (
                                <div key={i} className="wise-card !p-12 space-y-12 border-dashed !bg-transparent">
                                    <span className="text-5xl font-black text-[#5D7079]/10">{s.step}</span>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black tracking-tight uppercase">{s.title}</h4>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-44 bg-black text-white text-center">
                    <div className="wise-container max-w-4xl space-y-16">
                        <h2 className="wise-heading-hero !text-white !leading-[0.85]">Mobile repair <br /> <span className="text-[#9FE870] italic">protocol.</span></h2>
                        <p className="text-xl font-bold opacity-60 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
                            Book a top-rated certified unit in real-time. Professional grade service, delivered directly to your operational coordinates.
                        </p>
                        <div className="pt-8">
                            <Link href="/help">
                                <button className="wise-btn-primary !px-16 !py-6 !text-2xl shadow-[0_20px_60px_-10px_rgba(159,232,112,0.3)]">
                                    Initialize Deployment
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
