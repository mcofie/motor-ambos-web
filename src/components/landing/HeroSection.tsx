"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-background">

            {/* --- BACKGROUND IMAGE START --- */}
            <div className="absolute inset-0 -z-20 h-full w-full">
                <Image
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop"
                    alt="Car repair background"
                    fill
                    priority
                    className="object-cover opacity-20 dark:opacity-20 opacity-5 mix-blend-screen dark:mix-blend-screen mix-blend-multiply"
                />
                {/* Gradient overlay to fade image into the background */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
            </div>
            {/* --- BACKGROUND IMAGE END --- */}

            {/* Existing Background Effects (Lime Glow) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] -z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified Providers • Transparent Pricing</span>
                </div>

                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-[#9ae600] dark:text-foreground sm:text-7xl lg:leading-[1.1] mb-6">
                    Car trouble? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                        Help is minutes away.
                    </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
                    The decentralized network connecting you to the closest trusted
                    mechanics. From emergency rescue to scheduled maintenance—everything
                    your car needs, on demand.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto h-12 px-8 text-base font-bold"
                    >
                        <Link href="/help">
                            Request Assistance <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto h-12 px-8 text-base border-border bg-background/50 text-foreground hover:bg-muted hover:text-foreground backdrop-blur-sm"
                    >
                        <Link href="#services">Explore Services</Link>
                    </Button>
                </div>

                {/* Trust Badge */}
                <div className="mt-12 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                        Trusted by drivers across Ghana
                    </span>
                </div>
            </div>
        </section>
    );
}
