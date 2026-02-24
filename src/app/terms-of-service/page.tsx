import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow pt-44 pb-24 bg-background">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="ambos-label mb-8">System Protocols</div>
                    <h1 className="ambos-heading text-4xl md:text-7xl mb-6 text-foreground">Terms of Service</h1>
                    <p className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest mb-16">
                        Last protocol update: {new Date().toLocaleDateString()}
                    </p>

                    <div className="space-y-16">
                        <section className="border-l-2 border-primary pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">1. Technical Agreement</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                These Terms constitute a binding technical agreement between the user and Motor Ambos Infrastructure. Accessing our systems implies full compliance with these protocols.
                            </p>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">2. Intellectual Infrastructure</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                All code, telemetry, interface designs, and technical data within the Ambos ecosystem are proprietary infrastructure, protected under international technical and copyright laws.
                            </p>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">3. User Integrity</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm mb-6">
                                Users maintaining data on the platform represent that:
                            </p>
                            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>All telemetry and registration data is accurate.</span></li>
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>They possess full legal capacity to utilize the infrastructure.</span></li>
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>System access will be conducted within defined legal parameters.</span></li>
                            </ul>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">4. Liability Limitations</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                Motor Ambos Infrastructure is not liable for indirect system failures, data corruption, or external hardware issues arising from user-side telemetry errors.
                            </p>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">5. Technical Complaints</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                Resolve system complaints via the primary support terminal: <span className="text-foreground font-bold">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
