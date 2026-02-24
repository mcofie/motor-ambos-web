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
                            <div className="ambos-label mb-8">SERVICE_NODE: MOBILE_REPAIR_PROTOCOL</div>
                            <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85] text-foreground uppercase">
                                EXPERT REPAIRS, <br />
                                <span className="text-primary italic">VERIFIED HISTORY.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-2xl uppercase tracking-tight">
                                Bypass the repair shop infrastructure. Our certified mobile units deploy directly to your location.
                                Every intervention is officially logged to your vehicle&apos;s <span className="text-foreground font-bold italic">Digital Passport</span>.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="ambos-btn-lime py-6 px-12 text-lg">
                                    <Link href="/help">Book a Mechanic</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            <div className="flex flex-col items-start p-12 border-r border-b md:border-b-0 border-border bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Wrench size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Full Spectrum</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    From fluid diagnostics and braking systems to complex mechanical interventions. Professional grade mobile infrastructure.
                                </p>
                            </div>

                            <div className="flex flex-col items-start p-12 border-r border-b md:border-b-0 border-border bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Clock size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Zero Friction</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Eliminate the drop-off queue. We maintain your asset while you execute your primary professional priorities.
                                </p>
                            </div>

                            <div className="flex flex-col items-start p-12 bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <CheckCircle size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Hardware Audit</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Every component replacement is serialized on your NFC Smart Card, securing asset integrity and resale value.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-32 bg-muted/5 border-y border-border">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <div className="ambos-label mb-8 mx-auto">DEPLOYMENT_FLOW</div>
                        <h2 className="ambos-heading text-4xl md:text-7xl mb-24 uppercase">Technical Sequence.</h2>
                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            <div className="bg-background p-10 border-r border-b md:border-b-0 border-border text-left">
                                <div className="mono-text text-5xl font-black text-primary/10 mb-6 tracking-tighter">01</div>
                                <h4 className="ambos-heading text-lg mb-4 uppercase">SYSTEM_DIAGNOSTIC</h4>
                                <p className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">Describe the anomaly or select a standard maintenance protocol.</p>
                            </div>
                            <div className="bg-background p-10 border-r border-b md:border-b-0 border-border text-left">
                                <div className="mono-text text-5xl font-black text-primary/10 mb-6 tracking-tighter">02</div>
                                <h4 className="ambos-heading text-lg mb-4 uppercase">COST_QUOTATION</h4>
                                <p className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">Receive instant technical cost analysis and schedule your deployment.</p>
                            </div>
                            <div className="bg-background p-10 text-left">
                                <div className="mono-text text-5xl font-black text-primary/10 mb-6 tracking-tighter">03</div>
                                <h4 className="ambos-heading text-lg mb-4 uppercase">MOBILE_DEPLOY</h4>
                                <p className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">A certified mobile unit arrives at your node to execute repairs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-8 leading-[0.9]">Initialize <br /> Mobile Repair</h2>
                        <p className="text-xl mb-16 text-white/50 uppercase tracking-widest font-medium">
                            Book a top-rated certified unit in real-time. <br /> Professional grade service, delivered.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/help">
                                    Book Deployment
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
