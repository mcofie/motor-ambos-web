import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow pt-44 pb-24 bg-background">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="ambos-label mb-8">Data Protocol</div>
                    <h1 className="ambos-heading text-4xl md:text-7xl mb-6 text-foreground">Privacy Policy</h1>
                    <p className="mono-text text-[10px] text-muted-foreground uppercase tracking-widest mb-16">
                        Last systems update: {new Date().toLocaleDateString()}
                    </p>

                    <div className="space-y-16">
                        <section className="border-l-2 border-primary pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">1. Technical Scope</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                Welcome to Motor Ambos Infrastructure. We are committed to protecting your data integrity. This Privacy Policy outlines the protocol for collecting, storing, and safeguarding your information within our ecosystem.
                            </p>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">2. Data Acquisition</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm mb-6">
                                We acquire data through several technical channels:
                            </p>
                            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>PRIMARY_DATA: Name, address, and telematics provided during registration.</span></li>
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>METRIC_DATA: IP address, device telemetry, and access logs during session activity.</span></li>
                            </ul>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">3. Data Processing</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm mb-6">
                                Information is processed to maintain system functionality:
                            </p>
                            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>Maintain verified automotive passports.</span></li>
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>Execute compliance and maintenance workflows.</span></li>
                                <li className="flex gap-4"><span className="text-primary">[+]</span> <span>Validate session security and identity.</span></li>
                            </ul>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">4. Security Protocol</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                We deploy industry-standard encryption to protect data at rest and in transit. Access is strictly governed by the Ambos Security Protocol.
                            </p>
                        </section>

                        <section className="border-l-2 border-border pl-8">
                            <h2 className="ambos-heading text-xl mb-6 text-foreground uppercase tracking-widest">5. Contact Support</h2>
                            <p className="text-muted-foreground leading-relaxed uppercase tracking-wide text-sm">
                                For data queries: <span className="text-foreground font-bold">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
