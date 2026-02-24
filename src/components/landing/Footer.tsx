"use client";

import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-border bg-background pt-24 pb-12">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 md:col-span-1 border-l-2 border-primary pl-6">
                        <div className="ambos-heading text-2xl tracking-widest text-foreground mb-6">
                            Motor Ambos
                        </div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider leading-relaxed">
                            Industrial vehicle infrastructure for Ghana. Verified data, genuine maintenance, and technical compliance.
                        </p>
                    </div>

                    <div>
                        <h4 className="ambos-heading text-xs tracking-[0.2em] text-foreground mb-8">System</h4>
                        <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <li><Link href="/digital-passport" className="hover:text-primary transition-colors">Digital Passport</Link></li>
                            <li><Link href="/concierge" className="hover:text-primary transition-colors">Concierge</Link></li>
                            <li><Link href="/club" className="hover:text-primary transition-colors">Club Access</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="ambos-heading text-xs tracking-[0.2em] text-foreground mb-8">Network</h4>
                        <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <li><Link href="/about-us" className="hover:text-primary transition-colors">About Ambos</Link></li>
                            <li><Link href="/for-mechanics" className="hover:text-primary transition-colors">For Mechanics</Link></li>
                            <li><Link href="/resources" className="hover:text-primary transition-colors">Terminal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="ambos-heading text-xs tracking-[0.2em] text-foreground mb-8">Legal</h4>
                        <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="mono-text text-[10px] text-muted-foreground tracking-widest">
                        © {year} MOTOR AMBOS INFRASTRUCTURE. ALL SYSTEMS OPERATIONAL.
                    </div>
                    <div className="flex gap-12">
                        <span className="mono-text text-[10px] text-muted-foreground tracking-widest">ACCRA, GHANA</span>
                        <span className="mono-text text-[10px] text-muted-foreground tracking-widest">EST. 2024</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
