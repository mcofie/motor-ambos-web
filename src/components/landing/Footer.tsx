"use client";

import React from "react";
import Link from "next/link";
import { Globe, Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();

    const sections = [
        {
            title: "Product",
            links: [
                { name: "Compliance", href: "/#services" },
                { name: "Verified Logs", href: "/#nfc" },
                { name: "Roadside Rescue", href: "/#sos" },
                { name: "Marketplace", href: "/#services" },
            ]
        },
        {
            title: "Business",
            links: [
                { name: "Fleet Control", href: "/#business" },
                { name: "Corporate Demo", href: "/#business" },
                { name: "Institutional", href: "/#business" },
            ]
        },
        {
            title: "Providers",
            links: [
                { name: "Become a partner", href: "/providers/join" },
                { name: "Mechanic Sync", href: "/for-mechanics" },
                { name: "Service Centers", href: "/#providers" },
            ]
        },
        {
            title: "NFC",
            links: [
                { name: "Onyx Protocol", href: "/digital-passport" },
                { name: "Order Card", href: "/digital-passport" },
                { name: "Verification", href: "/digital-passport" },
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About us", href: "/about-us" },
                { name: "Mission", href: "/#trust" },
                { name: "Careers", href: "/careers" },
                { name: "Contact", href: "/contact" },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms", href: "/terms-of-service" },
                { name: "Security", href: "/#trust" },
            ]
        }
    ];

    return (
        <footer className="bg-[#050B15] text-white pt-32 pb-16">
            <div className="fintech-container">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16 lg:gap-8 mb-32">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-8">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9FE870]">{section.title}</h4>
                            <ul className="space-y-5">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-[15px] font-bold text-white/40 hover:text-[#9FE870] transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[6px] bg-[#9FE870] flex items-center justify-center font-black text-lg text-black">A</div>
                            <span className="text-xl font-black tracking-tighter">ambos</span>
                        </Link>
                        <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.1em]">
                            © {year} Motor Ambos Technology Inc. Built for Scale.
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="flex gap-8 text-white/30">
                            <Twitter size={18} className="hover:text-[#9FE870] cursor-pointer transition-colors" />
                            <Linkedin size={18} className="hover:text-[#9FE870] cursor-pointer transition-colors" />
                            <Facebook size={18} className="hover:text-[#9FE870] cursor-pointer transition-colors" />
                            <Instagram size={18} className="hover:text-[#9FE870] cursor-pointer transition-colors" />
                        </div>
                        <div className="h-px w-full md:w-px md:h-8 bg-white/5" />
                        <button className="flex items-center gap-2 text-[11px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                            <Globe size={14} />
                            <span>English (UK)</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
