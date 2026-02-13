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
        { href: "#services", label: "Services" },
        { href: "/business", label: "For Business" },
        { href: "/for-mechanics", label: "For Mechanics" },
        { href: "#membership", label: "Membership" },
    ];

    return (
        <header
            className="fixed top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                        <Car className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Motor Ambos
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors tracking-tight"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-4 w-px bg-border/60" />
                    <ThemeToggle />
                    <Button
                        asChild
                        className="bg-primary text-primary-foreground hover:scale-105 transition-transform font-bold rounded-full px-6"
                    >
                        <Link href="/club">Go Premium</Link>
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-l-border text-foreground w-[300px] sm:w-[400px]">
                            <SheetHeader className="text-left border-b border-border/10 pb-6 mb-6">
                                <SheetTitle asChild>
                                    <Link href="/" className="flex items-center gap-2 group w-fit">
                                        <div
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Car className="h-4 w-4" />
                                        </div>
                                        <span className="text-lg font-bold tracking-tight text-foreground">
                                            Motor Ambos
                                        </span>
                                    </Link>
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navigation menu for mobile devices
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-1 px-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center justify-between text-base font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-3 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="h-px bg-border/50 my-6" />
                                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/10">
                                    <Link href="/club">
                                        Go Premium
                                    </Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

