"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function PremiumFooter() {
    return (
        <footer className="py-20 bg-black/60 relative border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-[0.3em] text-white">MOTOR AMBOS</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The premium automotive ecosystem for Ghana. Driving transparency, safety, and efficiency for every car owner.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-emerald hover:border-emerald/50 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs">Product</h4>
                        <Link href="#services" className="text-sm text-muted-foreground hover:text-emerald transition-colors">Services</Link>
                        <Link href="#business" className="text-sm text-muted-foreground hover:text-emerald transition-colors">For Business</Link>
                        <Link href="#providers" className="text-sm text-muted-foreground hover:text-emerald transition-colors">For Providers</Link>
                        <Link href="#nfc" className="text-sm text-muted-foreground hover:text-emerald transition-colors">NFC Cards</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs">Company</h4>
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-emerald transition-colors">About Us</Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-emerald transition-colors">Contact</Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-emerald transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-emerald transition-colors">Terms of Service</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs">Stay Updated</h4>
                        <p className="text-xs text-muted-foreground">Join our newsletter for car care tips and sector insights.</p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald/50 flex-1"
                            />
                            <button className="bg-emerald text-navy text-xs font-bold px-4 py-2 rounded-full transition-transform hover:scale-105">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        © 2026 MOTOR AMBOS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-6 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        <Link href="/privacy">Privacy</Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
