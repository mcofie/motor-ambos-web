"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Zap, Heart, Search } from "lucide-react";

interface MembershipPlansProps {
    // No props needed anymore
}

export function MembershipPlans({ }: MembershipPlansProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                <div className="card-circle opacity-50" />

                <div className="container mx-auto px-8 max-w-[1600px] relative z-10 text-center">
                    <div className="ambos-label mb-10">SYSTEM_PROTECTION_PROTOCOL</div>

                    <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter mb-10">
                        DRIVE_WITH <br />
                        <span className="text-primary italic text-glow">ABSOLUTE_CONFIDENCE.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-16 font-medium">
                        Join the club that keeps you moving. Priority dispatch, exclusive discounts, and peace of mind on every journey. Secure your place in the Motor Ambos Network.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <button className="ambos-btn-lime !py-10 !px-24 text-2xl" onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                            VIEW_PROTOCOLS
                        </button>
                        <button className="ambos-btn-secondary !py-10 !px-24 text-2xl">
                            <Link href="/club/lookup">
                                USE_DIGITAL_CARD
                            </Link>
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-44 bg-background relative overflow-hidden border-y border-white/5">
                <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                    <div className="mb-32 space-y-8">
                        <div className="ambos-label">CORE_UTILITIES</div>
                        <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">Why Join <br /> the Club?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Priority Response", icon: Zap, desc: "Skip the queue. Club members get top priority when dispatching roadside assistance, ensuring you're never stuck for long." },
                            { title: "Service Discounts", icon: ShieldCheck, desc: "Enjoy exclusive discounts on labour fees for all mobile mechanics and partner workshops within our network." },
                            { title: "Annual Diagnostics", icon: Heart, desc: "Prevention is better than cure. Get a complimentary comprehensive vehicle health check every year of membership." }
                        ].map((b, i) => (
                            <div key={i} className="ambos-card p-12 group hover:border-primary/40">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                    <b.icon size={28} />
                                </div>
                                <h3 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight">{b.title.toUpperCase()}</h3>
                                <p className="mono-text text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest font-medium">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section id="plans" className="py-44 relative bg-background overflow-hidden">
                <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                    <div className="mb-32 space-y-8">
                        <div className="ambos-label">PRICING_STRUCTURE</div>
                        <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">SYSTEM_PLANS.</h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Basic Plan */}
                        <div className="ambos-card p-12 space-y-12 group relative overflow-hidden">
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-3xl text-foreground tracking-tight">BASIC</h3>
                                <div className="ambos-heading text-5xl text-primary drop-shadow-[0_0_10px_rgba(206,255,0,0.3)]">FREE</div>
                                <p className="mono-text text-[11px] text-muted-foreground font-black uppercase tracking-widest">Pay-as-you-go assistance for the occasional driver.</p>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Access to verified network",
                                    "Standard response times",
                                    "Pay per service"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 mono-text text-[10px] font-black tracking-widest text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>{item.toUpperCase()}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="ambos-btn-secondary !w-full !py-8 !text-lg !tracking-[0.4em]">
                                GET_STARTED
                            </button>
                        </div>

                        {/* Plus Plan (Highlighted) */}
                        <div className="ambos-card p-12 space-y-12 group relative bg-primary/5 border-primary/40 shadow-[0_0_50px_rgba(206,255,0,0.1)] scale-105 z-10">
                            <div className="absolute top-6 right-6">
                                <span className="ambos-label !bg-primary !text-black !border-none !text-[9px]">ENHANCED_COVERAGE</span>
                            </div>
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-3xl text-primary tracking-tight">PLUS</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="ambos-heading text-5xl text-foreground">GHS 50</span>
                                    <span className="mono-text font-black text-sm">/ MONTH</span>
                                </div>
                                <p className="mono-text text-[11px] text-muted-foreground font-black uppercase tracking-widest">Essential coverage for peace of mind.</p>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "1 Free Tow per year (20km)",
                                    "10% Discount on repairs",
                                    "Priority Dispatch",
                                    "Free Fuel Delivery service"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 mono-text text-[10px] font-black tracking-widest text-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>{item.toUpperCase()}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="ambos-btn-lime !w-full !py-10 !text-xl !tracking-[0.5em] !hover:shadow-[0_20px_40px_-10px_rgba(206,255,0,0.5)]">
                                JOIN_PLUS_PROTOCOL
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="ambos-card p-12 space-y-12 group relative">
                            <div className="space-y-4">
                                <h3 className="ambos-heading text-3xl text-foreground tracking-tight">PRO</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="ambos-heading text-5xl text-primary drop-shadow-[0_0_10px_rgba(206,255,0,0.3)]">GHS 120</span>
                                    <span className="mono-text font-black text-sm">/ MONTH</span>
                                </div>
                                <p className="mono-text text-[11px] text-muted-foreground font-black uppercase tracking-widest">Complete protection for frequent drivers.</p>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "3 Free Tows per year",
                                    "20% Discount on repairs",
                                    "Free Annual Vehicle Check",
                                    "Dedicated Support Line"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 mono-text text-[10px] font-black tracking-widest text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span>{item.toUpperCase()}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="ambos-btn-secondary !w-full !py-8 !text-lg !tracking-[0.4em]">
                                JOIN_PRO_PROTOCOL
                            </button>
                        </div>
                    </div>

                    <div className="mt-40 text-center space-y-8">
                        <p className="mono-text text-sm font-black tracking-widest text-muted-foreground uppercase opacity-60">Already a member but don&apos;t have your link?</p>
                        <button className="text-primary ambos-heading tracking-widest text-lg hover:italic transition-all uppercase">
                            LOOK_UP_DIGITAL_CARD &rarr;
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
