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
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16">
                            <div className="ambos-label">SYSTEM_LEVEL: CORPORATE_INFRASTRUCTURE</div>

                            <div className="space-y-8">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.8] text-foreground tracking-tighter">
                                    PRODUCTIVE_TEAMS <br />
                                    <span className="text-primary italic text-glow">NEVER_GET_STUCK.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                                    Your top talent shouldn&apos;t be stuck at the DVLA or by the roadside. Secure the Ambos Black Protocol — the infrastructure for elite corporate mobility.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 items-center pt-8">
                                <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                    PARTNER_WITH_US
                                </button>
                                <button className="ambos-btn-secondary !py-10 !px-24 text-2xl">
                                    VIEW_DOCUMENTATION
                                </button>
                            </div>

                            <div className="w-full max-w-2xl pt-24">
                                <div className="mono-text mb-4">CORPORATE_READOUT</div>
                                <div className="passport-id-box flex items-center justify-between group hover:border-primary/40 transition-all cursor-crosshair">
                                    <span>GHA_CORP_ADMIN_v1.0.9</span>
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#CEFF00] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Offer Section */}
                <section id="offer" className="py-44 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="grid lg:grid-cols-2 gap-32 items-start">
                            <div className="space-y-20">
                                <div className="space-y-8">
                                    <div className="ambos-label">VALUE_PROPOSITION</div>
                                    <h2 className="ambos-heading text-6xl md:text-8xl leading-[0.8] text-foreground text-glow">
                                        Infrastructure <br /> That Pays.
                                    </h2>
                                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                                        Companies in Accra lose thousands of productive hours to vehicle bureaucracy. We solve it by turning car care into a technical corporate benefit.
                                    </p>
                                </div>

                                <div className="space-y-16">
                                    {[
                                        { title: "The B2B Pitch", desc: "Deploy 'Ambos Corporate Care' to your organization. You secure the infrastructure; they execute the mission. Productive workforce; elite safety standards.", icon: Building2 },
                                        { title: "Zero Bureaucracy", desc: "We ensure their vehicles never expire. Fully automated Roadworthy and Insurance compliance protocol.", icon: ShieldCheck },
                                        { title: "24/7 Rapid Rescue", desc: "Red-tier emergency response. Our units arrive in minutes to secure personnel and asset recovery.", icon: Zap }
                                    ].map((f, i) => (
                                        <div key={i} className="flex gap-10 group">
                                            <div className="h-16 w-16 bg-white/5 border border-white/10 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                                <f.icon size={28} />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="ambos-heading text-2xl text-foreground font-black tracking-tight">{f.title.toUpperCase()}</h4>
                                                <p className="mono-text text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest font-medium">{f.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Black Card Mockup */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                                <div className="ambos-card bg-zinc-900/90 p-16 aspect-[4/5] border-white/5 relative z-10 flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/[0.04] blur-[100px]" />
                                    <div>
                                        <div className="flex justify-between items-start mb-24 relative z-10">
                                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(206,255,0,0.3)]">
                                                <Zap size={32} />
                                            </div>
                                            <div className="text-right">
                                                <div className="ambos-label !bg-primary !text-black !border-none mb-3">ELITE_TIER</div>
                                                <div className="ambos-heading text-3xl text-white tracking-widest">BLACK_CARD</div>
                                            </div>
                                        </div>

                                        <div className="space-y-10 relative z-10">
                                            <h3 className="ambos-heading text-5xl text-white tracking-tight">Verified <br /> Compliance.</h3>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full">
                                                    <span className="mono-text text-[10px] text-primary font-black tracking-widest uppercase">INSURANCE_OK</span>
                                                </div>
                                                <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-full">
                                                    <span className="mono-text text-[10px] text-primary font-black tracking-widest uppercase">ROADWORTHY_OK</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-12 mt-16 relative z-10">
                                        <p className="mono-text text-[11px] text-white/40 mb-6 tracking-[0.2em] font-medium leading-relaxed uppercase">
                                            &quot;Our management fleet is now fully autonomous. Zero downtime across all operational units.&quot;
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="h-[1px] bg-primary w-12" />
                                            <span className="ambos-heading text-sm text-white tracking-widest uppercase font-black">CEO, FINTECH_ACCRA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-44 bg-background relative overflow-hidden border-y border-white/5">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="mb-32 space-y-6">
                            <div className="ambos-label">STRATEGIC_PILLARS</div>
                            <h3 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow leading-[0.85]">Corporate <br /> Protocol.</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Centralized Compliance", desc: "Automated roadworthy and insurance renewals for enterprise-scale fleets through a single administrative terminal.", icon: Building2 },
                                { title: "Maintenance Auditing", desc: "Every service is data-verified on the Digital Passport. Technical integrity across the entire organizational fleet.", icon: BarChart3 },
                                { title: "Employee Safety", desc: "High-priority first responder access to medical telemetry via the hardware interface in emergency scenarios.", icon: Users }
                            ].map((pillar, i) => (
                                <div key={i} className="ambos-card p-12 group hover:border-primary/30">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <pillar.icon size={28} />
                                    </div>
                                    <h4 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight">{pillar.title.toUpperCase()}</h4>
                                    <p className="mono-text text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest font-medium">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-60 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-6 max-w-5xl text-center space-y-20">
                        <div className="space-y-8">
                            <h2 className="ambos-heading text-7xl md:text-[12vw] leading-[0.7] text-background tracking-tighter">
                                CONVERT_CHAOS <br />
                                <span className="text-primary italic text-glow">INTO_SYSTEM_TRUST.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-background/60 font-medium max-w-2xl mx-auto leading-relaxed uppercase mono-text tracking-widest">
                                Join the banking and logistics leaders in Accra. <br /> Eliminate automotive failure as a risk factor.
                            </p>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button className="ambos-btn-lime !py-10 !px-24 text-2xl !bg-background !text-primary !border-2 !border-primary/20 hover:!bg-primary hover:!text-black">
                                REQUEST_CORPORATE_TERMINAL
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
