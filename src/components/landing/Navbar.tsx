"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { IdentitySwitcher } from "@/components/IdentitySwitcher";

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
        { name: "Support", href: "#trust" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-foreground/10 platform:border-slate-200/60 py-4" : "bg-transparent py-10"}`}>
            <div className="fintech-container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary border-2 border-foreground onyx:border-0 rounded-xl onyx:rounded-2xl platform:rounded-[12px] platform:border-0 flex items-center justify-center font-black text-2xl text-foreground platform:text-white shadow-[4px_4px_0px_0px_var(--foreground)] onyx:shadow-lg onyx:shadow-primary/20 platform:shadow-none">A</div>
                    <span className="text-3xl font-black tracking-tighter text-foreground uppercase italic onyx:not-italic onyx:tracking-tight platform:not-italic platform:normal-case platform:text-2xl platform:font-bold platform:tracking-tight platform:text-slate-900">ambos.</span>
                </Link>

                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="label-technical hover:text-primary transition-colors text-foreground onyx:text-foreground/70 onyx:hover:text-primary onyx:font-bold onyx:normal-case onyx:text-sm onyx:tracking-normal platform:normal-case platform:text-[15px] platform:font-medium platform:text-slate-600 platform:hover:text-primary platform:tracking-normal platform:bg-transparent platform:px-0 platform:py-0"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <IdentitySwitcher />
                </div>

                <div className="flex items-center gap-4">
                    <button className="btn-primary !hidden md:!inline-flex">
                        Join Protocol <ArrowUpRight size={16} className="ml-2" />
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-3 border-2 border-foreground onyx:border-white/10 bg-background onyx:bg-white/5 platform:bg-white platform:border-slate-200 rounded-xl flex items-center justify-center h-12 w-12 shrink-0 transition-all active:scale-95"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`lg:hidden fixed inset-0 bg-foreground/40 onyx:bg-black/60 platform:bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={`lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-md bg-background onyx:bg-[#07090D] platform:bg-white z-[101] border-l-4 border-foreground onyx:border-white/5 platform:border-slate-100 transition-transform duration-500 ease-in-out transform shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-10 flex flex-col h-full bg-background onyx:bg-[#07090D] platform:bg-white">
                    <div className="flex justify-between items-center mb-20">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary onyx:bg-primary border-2 border-foreground onyx:border-0 rounded-xl onyx:rounded-2xl platform:rounded-[12px] flex items-center justify-center font-black text-2xl text-foreground platform:text-white shadow-[4px_4px_0px_0px_var(--foreground)] onyx:shadow-lg">A</div>
                            <span className="text-3xl font-black uppercase tracking-tighter italic onyx:not-italic platform:not-italic platform:normal-case platform:text-2xl platform:font-bold platform:text-slate-900 text-foreground">ambos.</span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-3 border-2 border-foreground onyx:border-0 bg-primary onyx:bg-primary/20 onyx:text-primary platform:bg-slate-50 platform:text-slate-600 rounded-xl hover:bg-primary/80 transition-colors"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-6xl onyx:text-5xl platform:text-4xl font-black text-foreground tracking-tight uppercase onyx:normal-case onyx:tracking-normal platform:normal-case platform:tracking-tight platform:font-bold border-b-4 border-foreground onyx:border-white/5 platform:border-slate-50 pb-6 hover:text-primary transition-colors italic onyx:not-italic platform:not-italic"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-10 pt-10 border-t-2 border-foreground/5 platform:border-slate-50">
                        <div className="flex justify-between items-center bg-muted onyx:bg-white/[0.03] platform:bg-slate-50 p-4 border-2 border-foreground onyx:border-white/10 platform:border-slate-100 onyx:rounded-2xl platform:rounded-2xl">
                            <p className="label-technical !opacity-100 platform:!text-slate-400">
                                Visual Identity
                            </p>
                            <IdentitySwitcher />
                        </div>
                        <p className="label-technical onyx:font-medium onyx:normal-case onyx:tracking-tight onyx:text-foreground/40 platform:normal-case platform:tracking-tight platform:text-slate-400">
                            Automotive Infrastructure <br /> For a Unified Africa.
                        </p>
                        <button className="btn-primary w-full !py-8 !text-2xl platform:!py-5 platform:!text-lg">
                            Join Protocol
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
