import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Map, Phone, Eye, Zap, TrendingUp } from 'lucide-react';

export default function ForMechanicsPage() {
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
                        <div className="ambos-label mb-8 mx-auto">PROFESSIONAL TERMINAL: NO APP REQUIRED</div>

                        <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85] text-foreground">
                            EMPOWER YOUR SHOP <br />
                            <span className="text-primary italic">WITHOUT AN APP.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16 uppercase tracking-tight">
                            Join the Motor Ambos network. Just tap a customer&apos;s Smart Card to log service,
                            dispatch digital invoices, and build a data-verified reputation — all via browser.
                        </p>

                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-6 px-12 text-lg">
                                <Link href="/providers/join">Register Your Garage</Link>
                            </button>
                        </div>
                    </div>
                </section>

                {/* The Mechanic's Edge Section */}
                <section className="py-32 bg-muted/5 border-y border-border">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="mb-24 space-y-4">
                            <div className="ambos-label">Digital Advantage</div>
                            <h2 className="ambos-heading text-4xl md:text-7xl">The Professional Edge.</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
                            {/* Feature 1: Tap to Log */}
                            <div className="bg-background border-r border-b lg:border-b-0 border-border p-10 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Zap size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Tap to Log</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Simply tap the customer&apos;s <strong>NFC Card</strong>. Instant browser interface for high-speed service logging.
                                </p>
                            </div>

                            {/* Feature 2: Digital Invoicing */}
                            <div className="bg-background border-r border-b lg:border-b-0 border-border p-10 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Eye size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Technical Invoices</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Send detailed, data-backed <strong>Digital Invoices</strong> via WhatsApp. Professional, paperless, permanent.
                                </p>
                            </div>

                            {/* Feature 3: Verified Reputation */}
                            <div className="bg-background border-r border-b md:border-b-0 border-border p-10 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <TrendingUp size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Verified History</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    Every job entry adds to the car&apos;s <strong>Permanent Passport</strong>. Verified work commands premium value.
                                </p>
                            </div>

                            {/* Feature 4: Genuine Parts */}
                            <div className="bg-background p-10 hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Clock size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Parts Terminal</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest">
                                    One-tap access to our <strong>Verified Parts Network</strong>. Genuine spares dispatched directly to your shop.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-32 bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-8 leading-[0.9]">Upgrade Your <br /> Garage Today</h2>
                        <p className="text-xl mb-16 text-white/50 uppercase tracking-widest font-medium">
                            Join the industrial standard for car care in Ghana. <br /> Total professional control, unlocked.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/providers/join">Claim Your Digital ID</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
