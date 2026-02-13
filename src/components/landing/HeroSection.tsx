"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Zap, CreditCard, ChevronRight, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-52 lg:pb-40 bg-background">
            {/* --- Sophisticated Background Layer --- */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                {/* Mesh Gradient / Ambient Light */}
                <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary/10 rounded-full blur-[140px] opacity-60" />
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

                {/* Animated Particles (CSS based) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
                    <div className="absolute top-[40%] left-[80%] w-3 h-3 bg-secondary/20 rounded-full animate-pulse " style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[70%] left-[15%] w-2 h-2 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* LEFT COLUMN: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Zap className="h-3.5 w-3.5 fill-primary/20" />
                            <span className="tracking-wide uppercase">The Digital Passport</span>
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:leading-[1.05] mb-8 font-heading animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            Peace today. <br />
                            <span className="text-primary relative inline-block">
                                Value always.
                                <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full sm:block hidden" />
                            </span>
                        </h1>

                        <p className="mx-auto lg:mx-0 max-w-2xl text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 opacity-90">
                            One tap to access 24/7 emergency rescue and verified service logs
                            that boost your car's resale value.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-[#9FE870] text-[#163300] hover:bg-[#9FE870]/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/10"
                            >
                                <Link href="/get-started">
                                    Get Your Smart Card <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto h-14 px-10 text-lg font-bold text-foreground hover:bg-muted border-border/60 transition-all hover:border-primary/40"
                            >
                                <Link href="/business">Corporate Fleet</Link>
                            </Button>
                        </div>

                        {/* Trust Micro-Metrics */}
                        <div className="mt-14 flex flex-wrap items-center lg:justify-start justify-center gap-x-12 gap-y-6 animate-in fade-in duration-1000">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-display tracking-tight leading-none">5,000+</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 underline decoration-primary/30 decoration-2 underline-offset-4">Verified Drivers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-display tracking-tight leading-none">24/7</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 underline decoration-primary/30 decoration-2 underline-offset-4">Rapid Response</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-4 py-2 bg-muted/40 rounded-xl border border-border/50">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                    ))}
                                </div>
                                <span className="text-xs font-bold tracking-tight">4.9/5 Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visual Section */}
                    <div className="flex-1 w-full lg:w-auto relative perspective-[2000px] animate-in zoom-in-95 fade-in duration-1000">
                        <div className="relative mx-auto w-full max-w-[480px] aspect-[4/3]">

                            {/* The Digital Passport Mockup (CSS 3D) */}
                            <div className="absolute inset-0 flex items-center justify-center -rotate-3 hover:rotate-2 transition-transform duration-700 ease-out cursor-pointer group">
                                <div className="relative w-full max-w-[400px] aspect-[1.58] bg-[#0A0A0A] rounded-[1.5rem] border-2 border-primary/20 shadow-2xl overflow-hidden group-hover:shadow-primary/20 transition-all overflow-hidden">
                                    {/* Card Content Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary rounded-lg">
                                                    <Zap className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white text-sm font-bold tracking-tight leading-none">MOTOR AMBOS</span>
                                                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest mt-0.5">Digital Passport</span>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                                <ShieldCheck className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-1.5 w-32 bg-white/10 rounded-full" />
                                            <div className="h-1.5 w-48 bg-white/5 rounded-full" />
                                            <div className="flex gap-2">
                                                <div className="h-8 w-12 bg-white/5 rounded-md border border-white/10" />
                                                <div className="h-8 w-12 bg-white/5 rounded-md border border-white/10" />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-white/40 uppercase tracking-[0.2em] mb-1 font-bold">Vehicle Verified ID</span>
                                                <span className="font-mono text-white/90 text-sm tracking-widest">AMB-2024-X9F2</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center animate-pulse">
                                                    <CreditCard className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">NFC ACTIVE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shining Glow Effect */}
                                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </div>

                                {/* Floating Decorative Cards */}
                                <div className="absolute top-10 -right-8 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl -z-10 rotate-6 translate-y-4 group-hover:-translate-y-2 group-hover:rotate-12 transition-all duration-700">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <ShieldCheck className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="h-2 w-20 bg-white/20 rounded-full" />
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                                </div>

                                <div className="absolute -bottom-10 -left-6 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl -z-10 rotate-[-8deg] -translate-y-4 group-hover:translate-y-2 group-hover:-rotate-12 transition-all duration-700">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Insurance Status</span>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="h-3 w-3 bg-primary rounded-sm" />
                                        <div className="h-2.5 w-32 bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Floating Labels */}
                            <div className="absolute top-[20%] right-0 animate-bounce duration-[3000ms] pointer-events-none sm:block hidden">
                                <span className="bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-lg">VERIFIED HISTORY</span>
                            </div>
                            <div className="absolute bottom-[20%] left-0 animate-bounce duration-[2500ms] pointer-events-none sm:block hidden" style={{ animationDelay: '0.5s' }}>
                                <span className="bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-lg">SECURE NFC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
