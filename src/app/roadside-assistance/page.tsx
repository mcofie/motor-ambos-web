import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Truck, Fuel, Battery, Key, ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Roadside Assistance | Motor Ambos",
    description: "24/7 Roadside Assistance. Towing, fuel delivery, battery jumpstart, and lockout services. Fast response times.",
};

export default function RoadsideAssistancePage() {
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
                            <div className="ambos-label mb-8">NODE_EMERGENCY: ROADSIDE_DISPATCH_PROTOCOL</div>
                            <h1 className="ambos-heading text-5xl md:text-9xl mb-8 leading-[0.85] text-foreground uppercase">
                                STUCK ON ROAD? <br />
                                <span className="text-primary italic">WE DEPLOY NOW.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-2xl uppercase tracking-tight">
                                High-velocity roadside intervention. Direct dispatch units on standby.
                                No subscription required for immediate on-demand assistance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <button className="ambos-btn-lime py-6 px-12 text-lg">
                                    <Link href="/help">Get Help Now</Link>
                                </button>
                                <button className="ambos-btn-secondary py-6 px-12 text-lg">
                                    <Link href="/club">Membership Plans</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-32">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border">
                            <div className="ambos-card p-12 border-r border-b lg:border-b-0 border-border bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Truck size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Towing</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest leading-relaxed">
                                    Professional extraction for mechanical fail or collision. Transport to secure node or mechanic.
                                </p>
                            </div>

                            <div className="ambos-card p-12 border-r border-b lg:border-b-0 border-border bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Fuel size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Refuel</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest leading-relaxed">
                                    Energy exhaustion? We deliver fuel payload to reach nearest replenishment station.
                                </p>
                            </div>

                            <div className="ambos-card p-12 border-r border-b lg:border-b-0 border-border bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Battery size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Jump Start</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest leading-relaxed">
                                    Power failure? High-volt boost to initialize your ICE/EV systems immediately.
                                </p>
                            </div>

                            <div className="ambos-card p-12 bg-background hover:bg-muted/5 transition-colors">
                                <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Key size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6">Lockout</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-widest leading-relaxed">
                                    Integrity lock? Non-destructive entry protocols to regain vehicle access.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-onyx text-white">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <div className="ambos-label mb-8 mx-auto border-white/20 text-white">INTERVENTION_STATS</div>
                        <h2 className="ambos-heading text-4xl md:text-8xl mb-12 uppercase leading-[0.9]">Rapid Response <br /> Infrastructure</h2>
                        <p className="text-xl mb-16 text-white/50 uppercase tracking-[0.2em] font-medium leading-relaxed max-w-2xl mx-auto">
                            Average deployment timeline: <span className="text-white">&lt;28 minutes</span>. <br /> Request immediate tactical assistance.
                        </p>
                        <div className="flex justify-center">
                            <button className="ambos-btn-lime py-8 px-16 text-xl">
                                <Link href="/help">
                                    Request Assistance
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
