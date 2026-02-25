import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Clock, FileCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Bureaucracy Concierge | Motor Ambos",
    description: "We handle the boring but mandatory tasks. Roadworthy renewals, Insurance updates, and DVLA compliance without the queues.",
};

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16 lg:space-y-20">
                            <div className="ambos-label">COMPLIANCE_CONCIERGE: ZERO_QUEUE_PROTOCOL_v2.1</div>

                            <div className="space-y-8 max-w-6xl">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter">
                                    WE_QUEUE. <br />
                                    <span className="text-primary italic text-glow">SO_YOU_DON&apos;T.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                                    Roadworthy, Insurance, and DVLA paperwork — the technical logistics of car ownership made effortless. We execute the bureaucracy while you maintain your velocity.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8">
                                <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                    <Link href="/club">JOIN_AMBOS_CLUB</Link>
                                </button>
                                <button className="ambos-btn-secondary !py-10 !px-24 text-2xl">
                                    <Link href="#how-it-works">PROTOCOL_INDEX</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section id="how-it-works" className="py-44 bg-background relative overflow-hidden border-y border-white/5">
                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="mb-32 space-y-8 text-center md:text-left">
                            <div className="ambos-label mx-auto md:ml-0">OPERATIONAL_WORKFLOW</div>
                            <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">THE_CONCIERGE_PROTOCOL.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "AUTO_MONITORING", desc: "Your Digital Passport tracks Roadworthy and Insurance expiration via technical telemetry—automatically." },
                                { step: "02", title: "SMART_ALERTS", desc: "System notification dispatched 30 days prior to expiry. One-tap authorization to initialize the renewal sequence." },
                                { step: "03", title: "DIGITAL_HANDOVER", desc: "We collect physical assets, complete the DVLA processing, and update your Digital Passport instantly." }
                            ].map((s, i) => (
                                <div key={i} className="ambos-card p-12 text-left bg-white/[0.02] border-white/5 group hover:border-primary/40">
                                    <div className="ambos-heading text-6xl text-primary/10 mb-8 tracking-tighter group-hover:text-primary transition-colors">{s.step}</div>
                                    <h4 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight">{s.title}</h4>
                                    <p className="mono-text text-[11px] text-muted-foreground uppercase tracking-widest leading-relaxed font-medium">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Status Visualization */}
                <section className="py-44 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="flex flex-col lg:flex-row gap-32 items-center">
                            <div className="lg:w-1/2 space-y-16">
                                <div className="ambos-label">SYSTEM_INTEGRITY</div>
                                <h2 className="ambos-heading text-7xl md:text-8xl leading-[0.8] text-foreground tracking-tighter">
                                    TOTAL_COMPLIANCE. <br /> <span className="text-primary italic text-glow">ZERO_DOWNTIME.</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                                    Designed for high-performance individuals who value their velocity. Eliminate regulatory risk and the friction of human queues.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "DVLA Renewals", icon: FileCheck },
                                        { title: "Insurance Updates", icon: ShieldCheck },
                                        { title: "Document Storage", icon: Clock },
                                        { title: "Fast Processing", icon: Zap }
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-6 mono-text text-[12px] font-black tracking-[0.3em] text-foreground">
                                            <div className="h-[1px] w-12 bg-primary" />
                                            {f.title.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <div className="ambos-card bg-zinc-900/80 p-16 border border-white/5 relative overflow-hidden group hover:border-primary/40 transition-all duration-700">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] blur-[80px]" />
                                    <div className="space-y-12 relative z-10">
                                        <div className="space-y-4">
                                            <div className="ambos-label !bg-primary !text-black mb-4">SYSTEM_STATUS: PENDING_RENEWAL</div>
                                            <div className="ambos-heading text-5xl text-white tracking-tighter">ROADWORTHY_UNIT</div>
                                        </div>

                                        <div className="flex gap-6 items-center flex-wrap">
                                            <div className="mono-text text-white/50 bg-white/5 px-8 py-4 border border-white/10 text-2xl tracking-tighter font-black">OCT_24_2026</div>
                                            <div className="px-6 py-2 border-2 border-primary text-primary text-[10px] font-black tracking-widest uppercase rounded-full">UPCOMING</div>
                                        </div>

                                        <div className="pt-12 border-t border-white/10">
                                            <button className="ambos-btn-lime w-full !py-8 !text-2xl !tracking-[0.4em]">
                                                AUTHORIZE_CONCIERGE
                                            </button>
                                        </div>
                                        <p className="mono-text text-[10px] text-white/30 text-center tracking-[0.3em] uppercase font-bold">
                                            STANDARD_PROCESSING: 24-48_HOURS.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-44 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-20">
                        <div className="ambos-label !bg-background !text-foreground !border-none">INITIALIZE_AUTOMATION</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background text-center tracking-tighter uppercase">
                            STOP_WAITING <br />
                            <span className="text-primary italic text-glow">IN_QUEUES.</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-background/60 max-w-4xl mx-auto uppercase mono-text tracking-[0.3em] font-black leading-relaxed">
                            Join the Motor Ambos Club and automate your vehicle&apos;s bureaucracy. Maximum efficiency, unlocked.
                        </p>

                        <div className="pt-10">
                            <button className="ambos-btn-lime !py-12 !px-32 !text-3xl !tracking-[0.5em] hover:!shadow-[0_20px_60px_-10px_rgba(206,255,0,0.5)]">
                                <Link href="/club">VIEW_MEMBERSHIP_PLANS</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
