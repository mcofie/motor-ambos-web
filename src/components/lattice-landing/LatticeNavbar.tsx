"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function LatticeNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Services", href: "#services" },
        { name: "Business", href: "#business" },
        { name: "Providers", href: "#providers" },
        { name: "NFC Cards", href: "#nfc" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-100 py-3" : "bg-transparent py-5"
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-foreground">Motor Ambos</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-emerald transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-3">
                    <Button variant="ghost" className="text-sm font-bold text-slate-600 hover:text-emerald px-5">
                        Request Fleet Demo
                    </Button>
                    <Button className="bg-emerald hover:bg-emerald/90 text-white font-bold rounded-full px-6 shadow-soft h-11">
                        Get the App
                    </Button>
                </div>

                <button className="lg:hidden p-2 text-slate-600">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
}
