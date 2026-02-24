"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function PerkNavbar() {
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-border py-4" : "bg-transparent border-transparent py-6"
            }`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="ambos-heading text-2xl tracking-widest group-hover:text-primary transition-colors text-foreground">Motor Ambos</span>
                </Link>

                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <button className="ambos-btn-secondary py-3 px-6 text-[10px]">
                        Request Demo
                    </button>
                    <button className="ambos-btn-lime py-3 px-6 text-[10px]">
                        Get App
                    </button>
                </div>

                <button className="lg:hidden p-2">
                    <Menu size={20} />
                </button>
            </div>
        </nav>
    );
}
