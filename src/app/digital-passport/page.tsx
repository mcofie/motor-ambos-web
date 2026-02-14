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
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-20 h-full w-full bg-background">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>The physical anchor for your vehicle's data</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Your Car's <br />
                            <span className="text-primary">Digital Passport.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                            The Motor Ambos NFC Smart Card is the 'Digital Glovebox' for your vehicle.
                            It stays with the car, storing every repair, renewal, and safety detail in one secure place.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/order-card">Order Your Card</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-bold">
                                <Link href="/link-card">Link Your Card</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1: Digital Service Log */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                    <ClipboardList className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Permanent Service Log</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A verified history of all repairs and maintenance. Accessible by any mechanic with a simple tap—no app required for them to log work.
                                </p>
                            </div>

                            {/* Feature 2: Compliance Concierge */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">DVLA Compliance</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Never miss a Roadworthy or Insurance renewal. Your card tracks expiry dates and our concierge handles the renewals for you.
                                </p>
                            </div>

                            {/* Feature 3: ICE Safety Beacon */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                    <Zap className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Emergency ICE Beacon</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    In case of emergency, first responders can tap the card to see your blood type, allergies, and emergency contacts instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resale Value Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="md:w-1/2">
                                <div className="w-full aspect-[4/3] bg-muted rounded-3xl overflow-hidden relative border border-border shadow-2xl">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CreditCard className="h-32 w-32 text-primary opacity-20" />
                                    </div>
                                    {/* Mocking the card visual */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent p-12 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                                <Zap className="h-6 w-6" />
                                            </div>
                                            <div className="font-mono text-xs opacity-50">DIGITAL PASSPORT</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-4 w-48 bg-foreground/10 rounded-full" />
                                            <div className="h-4 w-32 bg-foreground/10 rounded-full" />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-xl font-bold tracking-tighter">MOTOR AMBOS</div>
                                            <div className="h-8 w-12 bg-foreground/20 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 space-y-6">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    Sell for 20% More.
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    "Ghana Used" cars often suffer from a lack of trust. With a Motor Ambos Digital Passport,
                                    you provide potential buyers with verified, immutable proof of how well you've cared for your vehicle.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Verified repair history",
                                        "Genuine parts certification",
                                        "Ownership transparency",
                                        "Unified documents"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 font-medium text-foreground">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search / Verification Section */}
                <section className="py-24 bg-black text-white dark:bg-card">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Verify a Vehicle</h2>
                        <p className="text-primary/80 mb-10 text-lg">
                            Buying a car? Enter the Motor Ambos ID to see its verified health report.
                        </p>
                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Enter AMB-XXXX-XXXX"
                                className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl px-6 pr-14 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                                <Search className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">The Future of Car Ownership is Here</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Transform your car into a verified asset. Order your Digital Passport today.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/order-card">
                                Get Your Smart Card <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
