import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck, Calendar, Clock, FileCheck, ArrowRight, Zap, CheckCircle2, Gavel, Handshake, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Bureaucracy Concierge | Motor Ambos",
    description: "We handle the boring but mandatory tasks. Roadworthy renewals, Insurance updates, and DVLA compliance without the queues.",
};

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-[#F0F2F5]">
                    <div className="wise-container relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <h1 className="wise-heading-hero">
                                We queue. <br />
                                <span className="text-[#2D5B18] italic">So you don&apos;t.</span>
                            </h1>

                            <p className="wise-body text-xl max-w-2xl mx-auto">
                                Roadworthy, Insurance, and DVLA paperwork — the technical logistics of car ownership made effortless. We execute the bureaucracy while you maintain your velocity.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <Link href="/club">
                                    <button className="wise-btn-primary !px-12 py-5 flex items-center gap-3">
                                        Join the Club <ArrowRight size={20} />
                                    </button>
                                </Link>
                                <Link href="#how-it-works">
                                    <button className="wise-btn-secondary !px-12 py-5">
                                        Learn the protocol
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Protocol */}
                <section id="how-it-works" className="py-44 bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="grid lg:grid-cols-2 gap-24 items-end mb-24">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                    Operational Workflow
                                </div>
                                <h2 className="wise-heading-section !leading-none">The Concierge <br /> Protocol.</h2>
                            </div>
                            <p className="wise-body text-lg">
                                Designed for high-performance individuals who value their time. We eliminate regulatory risk and the friction of human queues.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Monitoring", desc: "Your Digital Passport tracks Roadworthy and Insurance expiration via technical telemetry—automatically." },
                                { step: "02", title: "Smart Alerts", desc: "System notification dispatched 30 days prior to expiry. One-tap authorization to initialize the renewal sequence." },
                                { step: "03", title: "Execution", desc: "We collect physical assets, complete the DVLA processing, and update your Digital Passport instantly." }
                            ].map((s, i) => (
                                <div key={i} className="wise-card !p-12 space-y-8 group hover:border-[#9FE870]">
                                    <span className="text-5xl font-black text-[#5D7079]/10 group-hover:text-[#9FE870] transition-colors">{s.step}</span>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black tracking-tight uppercase">{s.title}</h4>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Status Integration */}
                <section className="py-44 bg-[#F0F2F5]">
                    <div className="wise-container">
                        <div className="flex flex-col lg:flex-row gap-32 items-center">
                            <div className="lg:w-1/2 space-y-12">
                                <h2 className="wise-heading-section !leading-none">Total Compliance. <br /> <span className="text-[#2D5B18] italic">Zero Downtime.</span></h2>
                                <p className="wise-body">
                                    Our system integrates directly with national regulatory databases to ensure your vehicle remains mission-ready at all times.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "DVLA Renewals", icon: FileCheck },
                                        { title: "Insurance Updates", icon: ShieldCheck },
                                        { title: "Document Handling", icon: FileText },
                                        { title: "Rapid Turnaround", icon: Zap }
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
                                            {f.title}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <div className="wise-card !p-12 !bg-black text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9FE870]/10 blur-[80px]" />
                                    <div className="space-y-10 relative z-10">
                                        <div className="space-y-2">
                                            <div className="px-4 py-1.5 bg-[#9FE870]/20 text-[#9FE870] border border-[#9FE870]/20 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                                                Upcoming Renewal
                                            </div>
                                            <h3 className="text-3xl font-black tracking-tighter uppercase">Roadworthy Unit</h3>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="px-8 py-5 bg-white/5 border border-white/10 text-2xl font-black tracking-tight">
                                                OCT 24, 2026
                                            </div>
                                            <div className="h-10 w-px bg-white/10" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-40">MA Protocol v2.1</span>
                                        </div>

                                        <button className="wise-btn-primary w-full !py-6 !text-xl flex items-center justify-center gap-4">
                                            Authorize Concierge <ArrowRight size={24} />
                                        </button>

                                        <p className="text-[10px] font-black uppercase text-center tracking-widest opacity-40">
                                            Standard processing cycle: 24-48 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-44 bg-black text-white text-center">
                    <div className="wise-container max-w-4xl space-y-16">
                        <h2 className="wise-heading-hero !text-white !leading-[0.85]">Stop waiting <br /> <span className="text-[#9FE870] italic">in queues.</span></h2>
                        <p className="text-xl font-bold opacity-60 uppercase tracking-widest leading-relaxed">
                            Join the Motor Ambos Club and automate your vehicle&apos;s bureaucracy. Maximum efficiency, unlocked.
                        </p>
                        <div className="pt-8">
                            <Link href="/club">
                                <button className="wise-btn-primary !px-16 !py-6 !text-2xl shadow-[0_20px_60px_-10px_rgba(159,232,112,0.3)]">
                                    View Membership Plans
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
