import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, BarChart3, Users, Building2, ShieldCheck, ArrowRight, Zap, GraduationCap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Motor Ambos for Business | Corporate Care & Employee Perks",
    description: "The ultimate employee perk for corporate Ghana. Motor Ambos Corporate Care ensures your team stays productive and safe, while we handle vehicle compliance and maintenance.",
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section: The Productivity Pitch */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="max-w-4xl">
                            <div className="ambos-label mb-8 bg-primary text-black inline-block">SYSTEM_LEVEL: CORPORATE INFRASTRUCTURE</div>

                            <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85]">
                                Productive teams <br />
                                <span className="text-primary italic">never get stuck.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/70 mb-16 leading-relaxed max-w-3xl font-medium uppercase tracking-tight">
                                Your top talent shouldn&apos;t be stuck at the DVLA or by the roadside.
                                Secure the <span className="text-primary underline decoration-primary decoration-4 underline-offset-8">Ambos Black Card</span> — the protocol for elite corporate mobility.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="ambos-btn-lime py-6 px-12 text-lg">
                                    <Link href="/contact-sales">Partner with Us</Link>
                                </button>
                                <button className="ambos-btn-secondary py-6 px-12 text-lg border-white text-white">
                                    <Link href="#offer">View Documentation</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Offer Section */}
                <section id="offer" className="py-32 bg-background">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-24 items-start">
                            <div className="space-y-16">
                                <div className="space-y-6">
                                    <div className="ambos-label">Value Proposition</div>
                                    <h2 className="ambos-heading text-4xl md:text-7xl text-foreground leading-[0.9]">
                                        Infrastructure <br /> That Pays.
                                    </h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed uppercase tracking-wider">
                                        Companies in Accra lose thousands of productive hours to vehicle bureaucracy.
                                        We solve it by turning car care into a technical corporate benefit.
                                    </p>
                                </div>

                                <div className="space-y-12">
                                    {[
                                        {
                                            title: "The B2B Pitch",
                                            desc: "Deploy 'Ambos Corporate Care' to your organization. You secure the infrastructure; they execute the mission. Productive workforce; elite safety standards.",
                                            icon: Building2
                                        },
                                        {
                                            title: "Zero Bureaucracy",
                                            desc: "We ensure their vehicles never expire. Fully automated Roadworthy and Insurance compliance protocol.",
                                            icon: ShieldCheck
                                        },
                                        {
                                            title: "24/7 Rapid Rescue",
                                            desc: "Red-tier emergency response. Our units arrive in minutes to secure personnel and asset recovery.",
                                            icon: Zap
                                        }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex gap-8 group">
                                            <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center shrink-0">
                                                <feature.icon size={28} />
                                            </div>
                                            <div className="pt-2">
                                                <h4 className="ambos-heading text-xl mb-3 text-foreground">{feature.title}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Black Card Mockup */}
                            <div className="relative">
                                <div className="ambos-card bg-onyx p-12 aspect-[4/5] border-2 border-primary/20 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-16">
                                            <div className="h-16 w-16 bg-primary flex items-center justify-center">
                                                <Zap size={32} className="text-black" />
                                            </div>
                                            <div className="text-right">
                                                <div className="ambos-label bg-primary text-black mb-2">ELITE_TIER</div>
                                                <div className="ambos-heading text-3xl text-white">BLACK CARD</div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <h3 className="ambos-heading text-4xl text-white">Verified <br /> Compliance</h3>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="ambos-label border border-primary text-primary">INSURANCE_OK</span>
                                                <span className="ambos-label border border-primary text-primary">ROADWORTHY_OK</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-primary/20 pt-8 mt-12">
                                        <p className="mono-text text-[10px] text-white/40 mb-4 tracking-widest">
                                            "Our management fleet is now fully autonomous. Zero downtime."
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="h-[2px] bg-primary w-12" />
                                            <span className="ambos-heading text-xs text-white">CEO, FINTECH ACCRA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-32 border-y border-border bg-muted/5">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="mb-24 space-y-4">
                            <div className="ambos-label">Strategic Pillars</div>
                            <h3 className="ambos-heading text-4xl md:text-7xl">Corporate Protocol</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            {[
                                {
                                    title: "Centralized Compliance",
                                    desc: "Automated roadworthy and insurance renewals for enterprise-scale fleets through a single administrative terminal.",
                                    icon: Building2
                                },
                                {
                                    title: "Maintenance Auditing",
                                    desc: "Every service is data-verified on the Digital Passport. Technical integrity across the entire organizational fleet.",
                                    icon: BarChart3
                                },
                                {
                                    title: "Employee Safety",
                                    desc: "High-priority first responder access to medical telemetry via the hardware interface in emergency scenarios.",
                                    icon: Users
                                }
                            ].map((pillar, i) => (
                                <div key={i} className="bg-background border-b md:border-b-0 md:border-r last:border-r-0 border-border p-12 hover:bg-muted/5 transition-colors">
                                    <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                        <pillar.icon size={28} />
                                    </div>
                                    <h4 className="ambos-heading text-2xl mb-6">{pillar.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-onyx text-white overflow-hidden relative">
                    <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-8 leading-[0.9]">Convert Chaos into <br /> <span className="text-primary">System Trust.</span></h2>
                        <p className="text-xl mb-16 text-white/50 uppercase tracking-widest font-medium">
                            Join the banking and logistics leaders in Accra. <br /> Eliminate automotive failure as a risk factor.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/contact-sales">Request Corporate Terminal</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
