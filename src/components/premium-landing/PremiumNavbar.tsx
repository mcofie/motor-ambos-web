"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function PremiumNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Services", href: "#services" },
        { name: "For Businesses", href: "#business" },
        { name: "For Providers", href: "#providers" },
        { name: "NFC Cards", href: "#nfc" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-navbar py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-[0.3em] text-white">MOTOR AMBOS</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-emerald transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <Button variant="ghost" className="text-sm font-semibold text-white hover:text-emerald hover:bg-white/5">
                        Request Fleet Demo
                    </Button>
                    <Button className="bg-emerald hover:bg-emerald/90 text-navy font-bold rounded-full px-6 py-5 h-auto emerald-glow transition-all hover:scale-105 active:scale-95">
                        Get the App
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-navy border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-white"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        <Button variant="outline" className="w-full justify-center border-white/10 text-white">
                            Request Fleet Demo
                        </Button>
                        <Button className="w-full justify-center bg-emerald text-navy font-bold rounded-full">
                            Get the App
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
