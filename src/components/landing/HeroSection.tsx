"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-0 lg:pt-48 bg-background">
            {/* --- Ambient Background --- */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[140px] opacity-50" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
                {/* Heading */}
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:leading-[1.1] mb-8 font-heading animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    The Digital Glovebox <br />
                    <span className="text-primary italic font-light">for smarter car care.</span>
                </h1>

                {/* Subheading */}
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    A verified service log, 24/7 emergency rescue, and total maintenance history.
                    Everything you need to manage your car’s health and value in one tap.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto h-14 px-12 text-lg font-bold bg-[#9FE870] text-[#163300] hover:bg-[#9FE870]/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/10 rounded-full"
                    >
                        <Link href="/get-started">
                            Get started <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                {/* Brand Imagery Section (Inspired by User Mockup) */}
                <div className="relative mx-auto max-w-5xl animate-in fade-in zoom-in-95 duration-1000 delay-300">
                    {/* Phone/Card Frame effect */}
                    <div className="relative bg-background rounded-t-[3rem] border-x-[12px] border-t-[12px] border-border shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                        {/* Notch/Speaker Mockup */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-border rounded-b-2xl z-20 flex items-center justify-center">
                            <div className="w-10 h-1 bg-background/20 rounded-full" />
                        </div>

                        {/* Large Lifestyle Image */}
                        <div className="aspect-[16/10] relative">
                            <Image
                                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
                                alt="Premium car ownership experience"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Inner Shadow for depth */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />

                            {/* Floating Card Overlay (Mini version) */}
                            <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4 justify-between items-end pointer-events-none sm:flex hidden">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-left-4 duration-700">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center relative">
                                        <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                                        <div className="absolute -top-1 -right-1">
                                            <span className="service-pulse" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest flex items-center gap-2">
                                            NFC Security
                                        </div>
                                        <div className="text-white font-bold">Active Passport</div>
                                    </div>
                                </div>
                                <div className="bg-[#9FE870] p-4 rounded-2xl shadow-2xl flex items-center gap-4 text-[#163300] animate-in slide-in-from-right-4 duration-700">
                                    <div className="flex flex-col">
                                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
                                            Resale Boost
                                            <span className="service-pulse scale-75" />
                                        </div>
                                        <div className="text-xl font-black font-display">+15%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gradient Fade to next section */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
                </div>

                {/* Trust indicator below image (Optional, keeping it clean) */}
                <div className="py-12 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-foreground" />)}
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase">5,000+ Drivers</span>
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase">24/7 Roadside Rescue</span>
                    <span className="text-xs font-bold tracking-widest uppercase">Verified Service History</span>
                </div>
            </div>
        </section>
    );
}
