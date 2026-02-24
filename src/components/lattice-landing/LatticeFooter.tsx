"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function LatticeFooter() {
    return (
        <footer className="pt-32 pb-16 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-6 gap-12 mb-24">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-slate-900">Motor Ambos</span>
                        </Link>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            The transparent digital ecosystem for Ghana's car owners, businesses, and service providers.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald hover:bg-emerald/5 transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Product</h4>
                        <Link href="#services" className="text-slate-600 font-bold hover:text-emerald transition-colors">Services</Link>
                        <Link href="#nfc" className="text-slate-600 font-bold hover:text-emerald transition-colors">NFC Cards</Link>
                        <Link href="/lookup" className="text-slate-600 font-bold hover:text-emerald transition-colors">Digital Passport</Link>
                        <Link href="#faq" className="text-slate-600 font-bold hover:text-emerald transition-colors">FAQ</Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Business</h4>
                        <Link href="#business" className="text-slate-600 font-bold hover:text-emerald transition-colors">For Fleets</Link>
                        <Link href="#providers" className="text-slate-600 font-bold hover:text-emerald transition-colors">For Providers</Link>
                        <Link href="#" className="text-slate-600 font-bold hover:text-emerald transition-colors">Talk to Sales</Link>
                        <Link href="#" className="text-slate-600 font-bold hover:text-emerald transition-colors">Resources</Link>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-8 p-10 bg-slate-50 rounded-[40px]">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Contact Us</h4>
                        <div className="flex flex-col gap-4">
                            <a href="tel:+233000000000" className="flex items-center gap-4 text-slate-700 font-bold hover:text-emerald transition-colors">
                                <Phone size={18} className="text-emerald" /> +233 55 000 0000
                            </a>
                            <a href="mailto:hello@motorambos.com" className="flex items-center gap-4 text-slate-700 font-bold hover:text-emerald transition-colors">
                                <Mail size={18} className="text-emerald" /> hello@motorambos.com
                            </a>
                            <div className="flex items-center gap-4 text-slate-700 font-bold">
                                <MapPin size={18} className="text-emerald" /> Accra, Ghana
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 MOTOR AMBOS.
                    </p>
                    <div className="flex gap-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
