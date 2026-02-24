import React from 'react';
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Car, ShieldCheck, Users, Target, Heart, Wrench } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background">
                    <div className="container mx-auto px-6 max-w-7xl text-center relative z-10">
                        <div className="ambos-label mb-8 mx-auto">Our Mission & Infrastructure</div>

                        <h1 className="ambos-heading text-5xl md:text-8xl mb-8 text-foreground leading-[0.9]">
                            Driven by Service, <br />
                            <span className="text-primary">Powered by Data.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-16">
                            Motor Ambos is building the digital layer for vehicle ownership in Africa, starting with Ghana. Trusted networks, verified history, and technical precision.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-border max-w-5xl mx-auto">
                            <div className="space-y-2">
                                <div className="ambos-heading text-4xl text-foreground">500+</div>
                                <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">Verified Mechanics</div>
                            </div>
                            <div className="space-y-2">
                                <div className="ambos-heading text-4xl text-foreground">15min</div>
                                <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">Avg. Response Time</div>
                            </div>
                            <div className="space-y-2">
                                <div className="ambos-heading text-4xl text-foreground">24/7</div>
                                <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">Rescue Ready</div>
                            </div>
                            <div className="space-y-2">
                                <div className="ambos-heading text-4xl text-foreground">5k+</div>
                                <div className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest">Vehicles Protected</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="py-32 bg-muted/10 border-y border-border">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="mb-24 text-left">
                            <div className="ambos-label mb-4">Core Principles</div>
                            <h2 className="ambos-heading text-4xl md:text-7xl text-foreground">The Standard of Trust.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-0 border border-border">
                            {/* Card 1 */}
                            <div className="bg-background p-12 border-b md:border-b-0 md:border-r border-border hover:bg-muted/5 transition-colors">
                                <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Car size={24} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6 text-foreground">Digital Mobility</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm uppercase tracking-wide">
                                    Eliminating breakdown friction through high-speed dispatch and verified technical routing.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-background p-12 border-b md:border-b-0 md:border-r border-border hover:bg-muted/5 transition-colors">
                                <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mb-10">
                                    <Users size={24} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6 text-foreground">Network Integrity</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm uppercase tracking-wide">
                                    Every provider is a verified node in our ecosystem, governed by technical performance standards.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-background p-12 hover:bg-muted/5 transition-colors">
                                <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center mb-10">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6 text-foreground">Unfailing Safety</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm uppercase tracking-wide">
                                    Total transparency from dispatch to repair, ensuring that trust is data-driven, not assumed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-32 bg-background">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <div className="ambos-label mb-8 mx-auto">Genesis</div>
                        <h2 className="ambos-heading text-4xl md:text-7xl mb-16 text-foreground">The Road Needs <br /> a System.</h2>

                        <div className="space-y-12 text-left max-w-2xl mx-auto">
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed uppercase tracking-wide">
                                Infrastructure is invisible until it fails. In Ghana, the automotive industry was fragmented, relying on word-of-mouth and guesswork. We built Motor Ambos to be the invisible infrastructure that keeps the road moving.
                            </p>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed uppercase tracking-wide">
                                Whether it&apos;s a digital passport for your car, a verified service record, or an emergency rescue button—we provide the technical assurance that helps every driver stay in control.
                            </p>

                            <div className="pt-16 border-t border-border flex flex-col items-center gap-8">
                                <div className="ambos-label">Join the infrastructure</div>
                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                    <button className="ambos-btn-lime py-6 px-12 text-lg">Download App</button>
                                    <button className="ambos-btn-secondary py-6 px-12 text-lg">Partner With Us</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
