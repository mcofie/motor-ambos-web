import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, ClipboardList, Zap, ArrowRight, Share2, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "The Digital Passport | Motor Ambos",
    description: "The NFC Smart Card that acts as your car's Digital Glovebox. Managing compliance, history, and safety in one tap.",
};

export default function DigitalPassportPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
                    </div>

                    <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
                        <div className="ambos-label mb-8 mx-auto">HARDWARE_ANCHOR: VERIFIED VEHICLE TELEMETRY</div>

                        <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85] text-foreground">
                            YOUR CAR&apos;S <br />
                            <span className="text-primary italic">DIGITAL PASSPORT.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16 uppercase tracking-tight">
                            The Motor Ambos NFC Smart Card is the &apos;Digital Glovebox&apos; for your vehicle.
                            An immutable hardware record storing every repair, renewal, and safety metric.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button className="ambos-btn-lime py-6 px-12 text-lg">
                                <Link href="/order-card">Order Your Card</Link>
                            </button>
                            <button className="ambos-btn-secondary py-6 px-12 text-lg border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors">
                                <Link href="/link-card">Link Existing Card</Link>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-32 bg-muted/5 border-y border-border">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            {/* Feature 1: Digital Service Log */}
                            <div className="bg-background border-r border-b md:border-b-0 border-border p-12 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <ClipboardList size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Permanent Log</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Verified history of all repairs. Instant technical verification for mechanics via hardware tap—zero app overhead.
                                </p>
                            </div>

                            {/* Feature 2: Compliance Concierge */}
                            <div className="bg-background border-r border-b md:border-b-0 border-border p-12 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">DVLA Protocol</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Infrastructure-level monitoring. Automated roadworthy and insurance renewals synchronized with your physical ID.
                                </p>
                            </div>

                            {/* Feature 3: ICE Safety Beacon */}
                            <div className="bg-background p-12 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Zap size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Emergency ICE</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    High-priority medical beacon. Instant access for first responders to critical telemetry and emergency contacts.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resale Value Section */}
                <section className="py-32">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex flex-col md:flex-row items-center gap-24">
                            <div className="md:w-1/2">
                                <div className="ambos-card bg-onyx p-16 aspect-[4/3] border-2 border-primary/20 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="h-16 w-16 bg-primary flex items-center justify-center text-black">
                                            <Zap size={32} />
                                        </div>
                                        <div className="ambos-heading text-xs text-white/50 tracking-[0.3em]">DIGITAL_PASSPORT v1.0</div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="h-1 bg-white/10 w-full" />
                                        <div className="h-1 bg-white/10 w-2/3" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="ambos-heading text-2xl text-white">MOTOR AMBOS</div>
                                        <div className="h-10 w-16 bg-primary/20 border border-primary/30" />
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 space-y-12">
                                <div className="ambos-label">Asset Performance</div>
                                <h2 className="ambos-heading text-4xl md:text-7xl leading-[0.9]">
                                    MAXIMIZE <br /> <span className="text-primary italic">RESALE VALUE.</span>
                                </h2>
                                <p className="text-xl text-muted-foreground leading-relaxed uppercase tracking-tight">
                                    &quot;Ghana Used&quot; cars often suffer from a trust deficit. The Ambos Passport
                                    provides buyers with immutable hardware-verified proof of maintenance.
                                </p>
                                <ul className="space-y-6">
                                    {[
                                        "Verified technical history",
                                        "Genuine parts certification",
                                        "Ownership transparency protocol",
                                        "Unified documentation terminal"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-6 font-bold uppercase tracking-widest text-foreground text-sm">
                                            <div className="h-2 w-8 bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search / Verification Section */}
                <section className="py-32 bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <div className="ambos-label bg-primary text-black mb-8 mx-auto">SYSTEM_AUDIT</div>
                        <h2 className="ambos-heading text-4xl md:text-7xl mb-8">VERIFY_VEHICLE</h2>
                        <p className="text-white/50 mb-16 uppercase tracking-widest text-lg">
                            Executing a purchase? Access the verified health report via the Ambos ID.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <input
                                type="text"
                                placeholder="ENTER_AMB_ID: XXXX-XXXX"
                                className="w-full h-20 bg-white/5 border-2 border-white/20 px-8 text-xl font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="absolute right-4 top-4 h-12 w-12 bg-primary flex items-center justify-center text-black hover:scale-105 transition-transform">
                                <Search size={24} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 bg-background border-t border-border">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-12 leading-[0.9]">Transform Your <br /> Asset Integrity</h2>
                        <p className="text-xl mb-16 text-muted-foreground uppercase tracking-widest font-medium">
                            The future of car ownership is verified. <br /> Initialize your Digital Passport today.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/order-card">
                                    Order Smart Terminal
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
