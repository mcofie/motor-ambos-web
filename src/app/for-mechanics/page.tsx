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
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-20 h-full w-full bg-background">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Zap className="h-3.5 w-3.5" />
                            <span>No-App Web Interface for Professionals</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Empower Your Shop <br />
                            <span className="text-primary">Without an App.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                            Join the Motor Ambos network. Just tap a customer's NFC Smart Card to log service,
                            send professional digital invoices, and build a verified reputation—all from your browser.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/providers/join">Register Your Garage</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* The Mechanic's Edge Section */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">The Digital Tool for Growth</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Focus on fixing cars, not chasing paperwork. Our platform provides the tools you need to look professional and stay organized.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1: Tap to Log */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Tap to Log</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Simply tap the customer's <strong>NFC Card</strong> with your phone. A secure browser page opens instantly where you can log the service in seconds.
                                </p>
                            </div>

                            {/* Feature 2: Digital Invoicing */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Eye className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Professional Invoices</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Send detailed, professional <strong>Digital Invoices</strong> to your customers via SMS or WhatsApp. No more messy paper receipts.
                                </p>
                            </div>

                            {/* Feature 3: Verified Reputation */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Verified History</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Every job you log adds to the car's <strong>Permanent Data Log</strong>. Customers value your work more when it's officially recorded.
                                </p>
                            </div>

                            {/* Feature 4: Genuine Parts */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Auth Parts Sourcing</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Access our <strong>Verified Parts Network</strong>. Order genuine spares directly to your shop, ensuring quality for every repair.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Elevate Your Garage Today</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join the standard for car care in Ghana. No app installation required for you or your staff.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/providers/join">Claim Your Digital Shop</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
