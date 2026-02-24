"use client";

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
    const navLinks = [
        { href: "/#services", label: "Services" },
        { href: "/business", label: "Business" },
        { href: "/for-mechanics", label: "Mechanics" },
        { href: "/roadside-assistance", label: "Rescue" },
        { href: "/about-us", label: "About" },
    ];

    return (
        <header
            className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="ambos-heading text-2xl tracking-widest text-foreground group-hover:text-primary transition-colors">
                        Motor Ambos
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 ml-6">
                        <ThemeToggle />
                        <button className="ambos-btn-secondary py-3 px-6 text-[10px]">
                            <Link href="/club">Login</Link>
                        </button>
                        <button className="ambos-btn-lime py-3 px-6 text-[10px]">
                            <Link href="/club">Join Club</Link>
                        </button>
                    </div>
                </nav>

                {/* Mobile Nav */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background border-l-border w-full sm:w-[400px] p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-border">
                                    <Link href="/" className="ambos-heading text-2xl tracking-widest text-foreground">
                                        Motor Ambos
                                    </Link>
                                </div>
                                <div className="flex-grow p-6 space-y-8">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="block text-2xl ambos-heading text-foreground hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-6 border-t border-border grid grid-cols-2 gap-4">
                                    <button className="ambos-btn-secondary py-5 text-sm">
                                        Login
                                    </button>
                                    <button className="ambos-btn-lime py-5 text-sm">
                                        Join Club
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

