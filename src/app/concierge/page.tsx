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
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background">
                    <div className="absolute inset-0 -z-20 h-full w-full">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
                    </div>

                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="max-w-3xl">
                            <div className="ambos-label mb-8">COMPLIANCE_CONCIERGE: ZERO_QUEUE_PROTOCOL</div>

                            <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85] text-foreground">
                                WE QUEUE <br />
                                <span className="text-primary italic">SO YOU DON&apos;T.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-2xl uppercase tracking-tight">
                                Roadworthy, Insurance, and DVLA paperwork — the technical logistics of car ownership made effortless.
                                We execute the bureaucracy while you maintain your velocity.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="ambos-btn-lime py-6 px-12 text-lg">
                                    <Link href="/club">Join Ambos Club</Link>
                                </button>
                                <button className="ambos-btn-secondary py-6 px-12 text-lg border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
                                    <Link href="#how-it-works">View Documentation</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section id="how-it-works" className="py-32 bg-muted/5 border-y border-border">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="mb-24 space-y-4">
                            <div className="ambos-label">Operational Workflow</div>
                            <h2 className="ambos-heading text-4xl md:text-7xl">The Concierge Protocol.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            <div className="relative bg-background border-r border-b md:border-b-0 border-border p-12 hover:bg-muted/5 transition-colors">
                                <div className="ambos-label bg-primary text-black mb-10 inline-block px-4">STEP_01</div>
                                <h3 className="ambos-heading text-2xl mb-6">Auto-Monitoring</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Your Digital Passport tracks Roadworthy and Insurance expiration via technical telemetry—automatically.
                                </p>
                            </div>

                            <div className="relative bg-background border-r border-b md:border-b-0 border-border p-12 hover:bg-muted/5 transition-colors">
                                <div className="ambos-label bg-primary text-black mb-10 inline-block px-4">STEP_02</div>
                                <h3 className="ambos-heading text-2xl mb-6">Smart Alerts</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    System notification dispatched 30 days prior to expiry. One-tap authorization to initialize the renewal sequence.
                                </p>
                            </div>

                            <div className="relative bg-background p-12 hover:bg-muted/5 transition-colors">
                                <div className="ambos-label bg-primary text-black mb-10 inline-block px-4">STEP_03</div>
                                <h3 className="ambos-heading text-2xl mb-6">Digital Handover</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    We collect physical assets, complete the DVLA processing, and update your Digital Passport instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features List */}
                <section className="py-32">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex flex-col md:flex-row gap-24 items-start">
                            <div className="md:w-1/2 space-y-12">
                                <div className="ambos-label">System Integrity</div>
                                <h2 className="ambos-heading text-4xl md:text-7xl leading-[0.9]">
                                    TOTAL COMPLIANCE. <br /> <span className="text-primary italic">ZERO DOWNTIME.</span>
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed uppercase tracking-tight">
                                    Designed for high-performance individuals who value their velocity.
                                    Eliminate regulatory risk and the friction of human queues.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "DVLA Renewals", icon: FileCheck },
                                        { title: "Insurance Updates", icon: ShieldCheck },
                                        { title: "Document Storage", icon: Clock },
                                        { title: "Fast Processing", icon: Zap }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-6 font-bold uppercase tracking-widest text-foreground text-sm">
                                            <div className="h-2 w-8 bg-primary" />
                                            {feature.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:w-1/2 w-full">
                                <div className="ambos-card bg-onyx p-16 border-2 border-primary/20 relative overflow-hidden">
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <div className="ambos-label bg-primary text-black mb-2 inline-block">SYSTEM_STATUS: PENDING_RENEWAL</div>
                                            <div className="ambos-heading text-4xl text-white">ROADWORTHY</div>
                                        </div>

                                        <div className="flex gap-6 items-center">
                                            <div className="mono-text text-white/50 bg-white/5 px-6 py-3 border border-white/10 text-xl tracking-tighter">OCT 24, 2026</div>
                                            <div className="ambos-label border border-primary text-primary">UPCOMING</div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <button className="ambos-btn-lime w-full py-6 text-xl">
                                                Authorize Concierge
                                            </button>
                                        </div>
                                        <p className="mono-text text-[10px] text-white/30 text-center tracking-widest uppercase">
                                            Standard processing time: 24-48 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-8 leading-[0.9]">Stop Waiting <br /> In Queues</h2>
                        <p className="text-xl mb-16 text-white/50 uppercase tracking-widest font-medium">
                            Join the Motor Ambos Club and automate your vehicle&apos;s bureaucracy. <br /> Maximum efficiency, unlocked.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/club">
                                    See Membership Plans
                                </Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function shieldCheck(props: any) {
    return <ShieldCheck {...props} />;
}
