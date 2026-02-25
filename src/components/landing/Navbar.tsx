"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Car, Menu } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/#services", label: "Services" },
        { href: "/business", label: "Business" },
        { href: "/roadside-assistance", label: "Rescue" },
        { href: "/about-us", label: "About" },
    ];

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-700 ${isScrolled
                ? "glass-nav py-4 shadow-2xl"
                : "bg-transparent py-8 border-transparent"
                }`}>
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="ambos-heading text-xl md:text-2xl tracking-[0.4em] text-foreground group-hover:text-primary transition-all duration-500 font-black">
                        MOTOR_AMBOS
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="mono-text text-[10px] font-black tracking-[0.3em] text-muted-foreground hover:text-primary transition-all uppercase"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-10 ml-8 pl-12 border-l border-white/5">
                        <ThemeToggle />
                        <button className="text-[10px] mono-text font-black tracking-[0.3em] hover:text-primary transition-colors cursor-pointer uppercase">
                            SYSTEM_LOGIN
                        </button>
                        <button className="ambos-btn-lime !py-4 !px-10 !text-[10px] !tracking-[0.4em]">
                            <Link href="/club">JOIN_GRID</Link>
                        </button>
                    </div>
                </nav>

                {/* Mobile Nav */}
                <div className="flex items-center gap-6 lg:hidden">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all">
                                <Menu className="h-6 w-6 text-foreground" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background/98 backdrop-blur-3xl border-l-white/5 w-full sm:w-[500px] p-0 rounded-none overflow-hidden">
                            <div className="flex flex-col h-full bg-background relative">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] -z-10" />
                                <div className="p-12 border-b border-white/5 flex justify-between items-center">
                                    <Link href="/" className="ambos-heading text-xl md:text-2xl tracking-[0.4em] text-foreground font-black">
                                        MOTOR_AMBOS
                                    </Link>
                                </div>
                                <div className="flex-grow p-12 flex flex-col justify-center space-y-12">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block text-6xl md:text-7xl ambos-heading text-foreground hover:text-primary transition-all duration-500 hover:translate-x-8 tracking-tighter"
                                        >
                                            {link.label.toUpperCase()}
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-12 border-t border-white/5 flex flex-col gap-6 bg-background/50">
                                    <button className="text-sm mono-text font-black tracking-[0.4em] text-foreground/40 hover:text-primary transition-all text-left uppercase">
                                        SYSTEM_LOGIN_PORTAL
                                    </button>
                                    <button className="ambos-btn-lime !py-10 !text-xl !tracking-[0.5em]">
                                        JOIN_OPERATIONAL_GRID
                                    </button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

