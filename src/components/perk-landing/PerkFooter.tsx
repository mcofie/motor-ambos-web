"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function PerkFinalCTA() {
    return (
        <section className="py-32 bg-onyx text-white">
            <div className="container mx-auto px-6 flex flex-col items-center text-center">
                <h2 className="ambos-heading text-5xl md:text-[10vw] mb-16 text-white text-center">
                    Scale <br /> Your Control.
                </h2>

                <div className="flex flex-wrap justify-center gap-6">
                    <button className="ambos-btn-lime bg-primary text-black py-6 px-12 text-lg">
                        Get the App
                    </button>
                    <button className="ambos-btn-secondary border-background text-background py-6 px-12 text-lg hover:bg-background hover:text-foreground">
                        Request Fleet Demo
                    </button>
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function PerkFooter() {
    return (
        <footer className="pt-32 pb-16 bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-32">
                    <div className="space-y-8 max-w-sm">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="ambos-heading text-3xl">Motor Ambos</span>
                        </Link>
                        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold leading-relaxed">
                            Infrastructure for Ghana's automotive future. Secure. Verified. Scalable.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-black transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 w-full max-w-4xl">
                        <div className="flex flex-col gap-6">
                            <h4 className="mono-text text-[10px] text-muted-foreground">Index</h4>
                            <Link href="#services" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Services</Link>
                            <Link href="#nfc" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Hardware</Link>
                            <Link href="/lookup" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Passport</Link>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="mono-text text-[10px] text-muted-foreground">Fleet</h4>
                            <Link href="#business" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Solutions</Link>
                            <Link href="#providers" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Partners</Link>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="mono-text text-[10px] text-muted-foreground">Global</h4>
                            <a href="mailto:hello@motorambos.com" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Email Support</a>
                            <div className="text-xs font-bold uppercase tracking-widest">Accra, GH</div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="mono-text text-[10px] text-muted-foreground">Legal</h4>
                            <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Privacy</Link>
                            <Link href="/terms" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Terms</Link>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="mono-text text-[10px] text-muted-foreground">
                        © 2026 MOTOR AMBOS. SYSTEM_ID: [ACCRA_001]
                    </p>
                    <div className="ambos-heading text-[5vw] opacity-5 pointer-events-none whitespace-nowrap overflow-hidden w-full text-center">
                        INDUSTRIAL INFRASTRUCTURE. INDUSTRIAL INFRASTRUCTURE.
                    </div>
                </div>
            </div>
        </footer>
    );
}
