"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
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
        { name: "Personal", href: "#drivers" },
        { name: "Business", href: "#fleets" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? "bg-white border-b-2 border-black py-4" : "bg-transparent py-8"}`}>
            <div className="fintech-container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#9FE870] border-2 border-black rounded-[4px] flex items-center justify-center font-black text-xl text-black">A</div>
                    <span className="text-2xl font-black tracking-tighter text-black uppercase">ambos</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[12px] font-black uppercase tracking-widest text-black hover:bg-[#9FE870] px-2 py-1 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-primary !hidden md:!inline-flex !px-6 !py-3 !text-xs">
                        Join Platform <ArrowUpRight size={14} className="ml-2" />
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 border-2 border-black bg-white flex items-center justify-center h-10 w-10 shrink-0"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Flat Mobile Menu Drawer */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[101] border-l-4 border-black transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-16">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#9FE870] border-2 border-black rounded-[4px] flex items-center justify-center font-black text-lg text-black">A</div>
                            <span className="text-xl font-black uppercase tracking-tighter">ambos</span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 border-2 border-black bg-[#9FE870]"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-5xl font-black text-black tracking-tight uppercase border-b-4 border-black pb-4 hover:bg-[#9FE870] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                            Automotive Infrastructure <br /> For a Unified Africa.
                        </p>
                        <button className="btn-primary w-full !py-8 !text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]">
                            Join Platform
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
