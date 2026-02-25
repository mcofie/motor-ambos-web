import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Wrench, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Mobile Mechanics | Motor Ambos",
    description: "Book extensive mobile mechanic services at your home or office. Diagnostics, repairs, and maintenance directly to you.",
};

export default function MobileMechanicsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16 lg:space-y-20">
                            <div className="ambos-label">SERVICE_NODE: MOBILE_REPAIR_PROTOCOL_v4.2</div>

                            <div className="space-y-8 max-w-6xl">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter">
                                    EXPERT_REPAIRS. <br />
                                    <span className="text-primary italic text-glow">VERIFIED_HISTORY.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                                    Bypass the repair shop infrastructure. Our certified mobile units deploy directly to your location. Every intervention is officially logged to your vehicle&apos;s digital passport under technical performance standards.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8">
                                <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                    <Link href="/help">BOOK_MECHANIC_NODE</Link>
                                </button>
                                <button className="ambos-btn-secondary !py-10 !px-24 text-2xl">
                                    <Link href="/digital-passport">PASSPORT_SYNC</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-44 bg-background relative overflow-hidden border-y border-white/5">
                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Full Spectrum", icon: Wrench, desc: "From fluid diagnostics and braking systems to complex mechanical interventions. Professional grade mobile infrastructure." },
                                { title: "Zero Friction", icon: Clock, desc: "Eliminate the drop-off queue. We maintain your asset while you execute your primary professional priorities." },
                                { title: "Hardware Audit", icon: CheckCircle, desc: "Every component replacement is serialized on your NFC Smart Card, securing asset integrity and resale value." }
                            ].map((b, i) => (
                                <div key={i} className="ambos-card p-12 group hover:border-primary/40">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <b.icon size={28} />
                                    </div>
                                    <h3 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight">{b.title.toUpperCase()}</h3>
                                    <p className="mono-text text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest font-medium">
                                        {b.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-44 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-8 max-w-[1600px] text-center relative z-10">
                        <div className="mb-32 space-y-8">
                            <div className="ambos-label">DEPLOYMENT_FLOW</div>
                            <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">TECHNICAL_SEQUENCE.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "SYSTEM_DIAGNOSTIC", desc: "Describe the anomaly or select a standard maintenance protocol for immediate evaluation." },
                                { step: "02", title: "COST_QUOTATION", desc: "Receive instant technical cost analysis and schedule your deployment with guaranteed price locks." },
                                { step: "03", title: "MOBILE_DEPLOY", desc: "A certified mobile unit arrives at your node to execute repairs with full industrial precision." }
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

                {/* CTA Section */}
                <section className="py-44 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-20">
                        <div className="ambos-label !bg-background !text-foreground !border-none">INITIALIZE_REPAIR</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background text-center tracking-tighter uppercase">
                            MOBILE_REPAIR <br />
                            <span className="text-primary italic text-glow">PROTOCOL.</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-background/60 max-w-4xl mx-auto uppercase mono-text tracking-[0.3em] font-black leading-relaxed">
                            Book a top-rated certified unit in real-time. Professional grade service, delivered directly to your operational coordinates.
                        </p>

                        <div className="pt-10">
                            <button className="ambos-btn-lime !py-12 !px-32 !text-3xl !tracking-[0.5em] hover:!shadow-[0_20px_60px_-10px_rgba(206,255,0,0.5)]">
                                <Link href="/help">INITIALIZE_DEPLOYMENT</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
