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
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-muted/20">
                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                                Expert Repairs, <br />
                                <span className="text-primary">At Your Doorstep.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                                Skip the repair shop waiting room. Our certified mobile mechanics come to your home or office to service your vehicle.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg font-bold">
                                    <Link href="/help">Book a Mechanic</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="flex flex-col items-start">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    <Wrench className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Full Service Repairs</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    From oil changes and brake replacements to diagnostics and complex repairs. We handle almost everything a shop can do.
                                </p>
                            </div>

                            <div className="flex flex-col items-start">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Save Time</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    No more dropping off your car and finding a ride. We work while you work or relax at home.
                                </p>
                            </div>

                            <div className="flex flex-col items-start">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Get a quote upfront before you book. No surprise fees or upselling. You know exactly what you're paying for.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <div className="text-4xl font-black text-primary/20 mb-4">01</div>
                                <h4 className="text-lg font-bold mb-2">Tell Us What's Wrong</h4>
                                <p className="text-sm text-muted-foreground">Describe the issue or select a maintenance service.</p>
                            </div>
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <div className="text-4xl font-black text-primary/20 mb-4">02</div>
                                <h4 className="text-lg font-bold mb-2">Get a Quote</h4>
                                <p className="text-sm text-muted-foreground">See the price instantly and book a time that works for you.</p>
                            </div>
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <div className="text-4xl font-black text-primary/20 mb-4">03</div>
                                <h4 className="text-lg font-bold mb-2">We Come to You</h4>
                                <p className="text-sm text-muted-foreground">A mechanic arrives at your location to fix your car.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Need a Mechanic?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Book a top-rated mobile mechanic in minutes.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/help">
                                Book Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
