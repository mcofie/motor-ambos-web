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
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full opacity-30" />
                </div>

                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Motor Ambos Club</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Drive with <br />
                        <span className="text-primary">Absolute Confidence.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                        Join the club that keeps you moving. Priority dispatch, exclusive discounts, and peace of mind on every journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg font-bold min-w-[200px]" onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Plans
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-medium">
                            <Link href="/club/lookup">
                                <Search className="mr-2 h-4 w-4" />
                                Use Digital Card
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Join the Club?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            It's more than just roadside assistance. It's a comprehensive car-care companion.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Priority Response</h3>
                            <p className="text-muted-foreground">
                                Skip the queue. Club members get top priority when dispatching roadside assistance, ensuring you're never stuck for long.
                            </p>
                        </div>

                        <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <Badge className="bg-primary text-primary-foreground">20% OFF</Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Service Discounts</h3>
                            <p className="text-muted-foreground">
                                Enjoy exclusive discounts on labour fees for all mobile mechanics and partner workshops within our network.
                            </p>
                        </div>

                        <div className="bg-background border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Free Annual Check</h3>
                            <p className="text-muted-foreground">
                                Prevention is better than cure. Get a complimentary comprehensive vehicle health check every year of membership.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section id="plans" className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Plans</h2>
                        <p className="text-muted-foreground">Choose the coverage that fits your lifestyle.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Basic Plan */}
                        <div className="relative rounded-3xl border border-border bg-card p-8 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2">Basic</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold">Free</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">Pay-as-you-go assistance for the occasional driver.</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <span>Access to verified network</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <span>Standard response times</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-muted-foreground shrink-0" />
                                    <span>Pay per service</span>
                                </li>
                            </ul>
                            <Button asChild variant="outline" className="w-full h-12 font-bold">
                                <Link href="/login">Get Started</Link>
                            </Button>
                        </div>

                        {/* Plus Plan (Highlighted) */}
                        <div className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-xl scale-105 z-10">
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4">
                                <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-bold shadow-lg">MOST POPULAR</Badge>
                            </div>
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2 text-primary">Plus</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-muted-foreground">GHS</span>
                                    <span className="text-4xl font-extrabold">50</span>
                                    <span className="text-sm font-medium text-muted-foreground">/mo</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">Essential coverage for peace of mind.</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>1 Free Tow per year (20km)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>10% Discount on repairs</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>Priority Dispatch</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>Free Fuel Delivery service</span>
                                </li>
                            </ul>
                            <Button asChild className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/login?plan=plus">Join Plus</Link>
                            </Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="relative rounded-3xl border border-border bg-card p-8 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-2">Pro</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-muted-foreground">GHS</span>
                                    <span className="text-4xl font-extrabold">120</span>
                                    <span className="text-sm font-medium text-muted-foreground">/mo</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">Complete protection for frequent drivers.</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>3 Free Tows per year</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>20% Discount on repairs</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>Free Annual Vehicle Check</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span>Dedicated Support Line</span>
                                </li>
                            </ul>
                            <Button asChild variant="outline" className="w-full h-12 font-bold">
                                <Link href="/login?plan=pro">Join Pro</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-sm text-muted-foreground mb-4">Already a member but don't have your link?</p>
                        <Button asChild variant="link" className="text-primary font-bold">
                            <Link href="/club/lookup">Look up your Digital Card</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
