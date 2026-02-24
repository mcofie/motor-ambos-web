"use client";

import React from "react";
import { Shield, CreditCard, Brain, LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PerkServices() {
    return (
        <section id="services" className="py-32 bg-background">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-12 flex flex-col items-center text-center space-y-6 mb-24">
                        <div className="ambos-label">Capabilities</div>
                        <h2 className="ambos-heading text-5xl md:text-8xl text-foreground">
                            The Operating System <br /> for Car Ownership.
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Everything you need to keep your car compliant, healthy, and affordable in one technical system.
                        </p>
                    </div>

                    <div className="lg:col-span-12 grid md:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="ambos-card p-10 flex flex-col gap-10 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center">
                                <Shield size={20} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-2xl text-foreground">Compliance</h3>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                                    Digital glovebox for Insurance & Roadworthy. Zero-fine expiry tracking.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono">
                                <span>Status: Encrypted</span>
                                <span className="text-primary tracking-widest">Active</span>
                            </div>
                        </div>

                        {/* Service Card 2 */}
                        <div className="ambos-card p-10 flex flex-col gap-10 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-2xl text-foreground">Verified Logs</h3>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                                    NFC-verified health passport. Boost resale value by up to 20% with tamper-proof records.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono">
                                <span>Auth: NFC Required</span>
                                <span className="text-primary tracking-widest">Secure</span>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="ambos-card p-10 flex flex-col gap-10 hover:border-primary transition-colors">
                            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center">
                                <Brain size={20} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-2xl text-foreground">AI Diagnostics</h3>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                                    AI Mechanic in English & Twi. Real-time diagnostic logs and cost forecasting.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[10px] font-mono">
                                <span>Engine: Gemini Pro</span>
                                <span className="text-primary tracking-widest">Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
