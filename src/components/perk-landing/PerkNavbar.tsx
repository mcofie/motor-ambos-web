"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";

export function PerkNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Personal", href: "#personal" },
        { name: "Business", href: "#business" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white border-b border-border py-4" : "bg-white py-6"}`}>
            <div className="wise-container flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-[8px] bg-[#9FE870] flex items-center justify-center font-black text-xl">
                            A
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">ambos</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-foreground hover:text-foreground transition-all border-b-2 border-transparent hover:border-[#9FE870] py-1"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                        <button className="flex items-center gap-2 text-foreground/60 hover:text-foreground">
                            <Globe size={18} />
                            <span>EN</span>
                        </button>
                        <button className="text-foreground/60 hover:text-foreground">Help</button>
                        <Link href="/login" className="text-foreground/60 hover:text-foreground">Log in</Link>
                    </div>

                    <button className="bg-[#9FE870] text-black px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-105 transition-all">
                        Sign up
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border p-8 flex flex-col gap-6 shadow-lg animate-in fade-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-black"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-border" />
                    <Link href="/login" className="text-lg font-bold">Log in</Link>
                    <button className="bg-[#9FE870] text-black w-full py-4 rounded-full font-bold">Sign up</button>
                </div>
            )}
        </nav>
    );
}
