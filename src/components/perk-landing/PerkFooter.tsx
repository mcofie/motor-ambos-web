"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Globe } from "lucide-react";

export function PerkFinalCTA() {
    return (
        <section className="wise-section bg-white border-t border-border">
            <div className="wise-container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="space-y-6 max-w-2xl">
                        <h2 className="wise-heading-section">Download the app. <br /> Stay in control.</h2>
                        <p className="wise-body max-w-xl">
                            Total visibility for corporate cars, logistics, and businesses. Manage scale without the friction of manual records and unverified spending.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                        <button className="wise-btn-primary !px-12">
                            Get the app
                        </button>
                        <button className="wise-btn-secondary !px-12">
                            Request fleet demo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkFooter() {
    return (
        <footer className="bg-white text-black border-t border-border pt-24 pb-12">
            <div className="wise-container">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
                    <div className="col-span-2 lg:col-span-1 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-[6px] bg-[#9FE870] flex items-center justify-center font-black text-lg">A</div>
                            <span className="text-2xl font-black tracking-tighter">ambos</span>
                        </Link>
                        <div className="flex gap-6 text-[#5D7079]">
                            <Facebook size={20} className="hover:text-black cursor-pointer transition-colors" />
                            <Twitter size={20} className="hover:text-black cursor-pointer transition-colors" />
                            <Instagram size={20} className="hover:text-black cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest">Product</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#5D7079]">
                            <li className="hover:text-black cursor-pointer">Roadside Rescue</li>
                            <li className="hover:text-black cursor-pointer">NFC Verified Logs</li>
                            <li className="hover:text-black cursor-pointer">Compliance Tracker</li>
                            <li className="hover:text-black cursor-pointer">AI Mechanic</li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest">Business</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#5D7079]">
                            <li className="hover:text-black cursor-pointer">Institutional Fleets</li>
                            <li className="hover:text-black cursor-pointer">Insurance Partners</li>
                            <li className="hover:text-black cursor-pointer">Auto Mechanics</li>
                            <li className="hover:text-black cursor-pointer">Government Agencies</li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#5D7079]">
                            <li className="hover:text-black cursor-pointer">About us</li>
                            <li className="hover:text-black cursor-pointer">Our mission</li>
                            <li className="hover:text-black cursor-pointer">Service centers</li>
                            <li className="hover:text-black cursor-pointer">Careers</li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-black uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-4 text-sm font-bold text-[#5D7079]">
                            <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-black cursor-pointer">Terms of Service</li>
                            <li className="hover:text-black cursor-pointer">Security</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10 border-t border-[#F0F2F5]">
                    <div className="text-[12px] font-bold text-[#5D7079] text-center md:text-left">
                        Motor Ambos Technology Inc © 2024. Engineered for absolute vehicle integrity.
                    </div>
                    <div className="flex items-center gap-8">
                        <button className="flex items-center gap-2 text-xs font-black text-[#5D7079] uppercase tracking-widest">
                            <Globe size={16} />
                            <span>English (UK)</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
