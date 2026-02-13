import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, BarChart3, Users, Building2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Motor Ambos for Business | Corporate Fleet Management",
    description: "Enterprise-grade vehicle lifecycle management for corporate fleets and HR departments in Ghana. Boost efficiency and driver safety.",
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A0A0A] text-white">
                    <div className="absolute inset-0 -z-20 h-full w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9FE870]/10 via-transparent to-transparent opacity-50" />
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#9FE870] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Corporate Fleet Care</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Fleet Intelligence. <br />
                            <span className="text-[#9FE870] drop-shadow-[0_0_15px_rgba(159,232,112,0.3)]">Zero Downtime.</span>
                        </h1>

                        <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-3xl mx-auto">
                            The "Operating System" for corporate mobility. We help HR departments and Fleet Managers
                            manage compliance, maintenance, and resale value for every vehicle in their fleet.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold bg-[#9FE870] text-[#163300] hover:bg-[#9FE870]/90 border-none">
                                <Link href="/contact-sales">Request Demo</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10 bg-transparent">
                                <Link href="#features">Explore Fleet Tools</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Metrics */}
                <section className="py-24 border-b border-border">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Fleet Productivity", value: "+30%" },
                                { label: "Compliance Rate", value: "100%" },
                                { label: "Cost Reduction", value: "-15%" },
                                { label: "Resale Premium", value: "+20%" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Business Solutions */}
                <section id="features" className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    Built for Corporate <br /> HR & Fleet Teams.
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Motor Ambos provides a unified dashboard to monitor every vehicle. No more tracking
                                    renewal dates in spreadsheets or chasing receipts for repairs.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: "Centralized Compliance", desc: "Automated Roadworthy and Insurance renewals for hundreds of vehicles.", icon: Building2 },
                                        { title: "Maintenance Auditing", desc: "Every service is verified. No more overpaying for 'ghost' repairs.", icon: BarChart3 },
                                        { title: "Employee Benefit", desc: "Offer Motor Ambos Premium to your staff to ensure they are always safe on the road.", icon: Users }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <feature.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-muted rounded-[3rem] p-12 aspect-[4/5] relative overflow-hidden flex flex-col justify-between border border-border">
                                <div className="space-y-8 relative z-10">
                                    <div className="h-2 w-24 bg-primary rounded-full" />
                                    <h3 className="text-3xl font-bold tracking-tight">Enterprise <br /> Dashboard</h3>
                                    <div className="space-y-4">
                                        {[85, 92, 45, 78].map((w, i) => (
                                            <div key={i} className="h-6 bg-foreground/5 rounded-lg overflow-hidden">
                                                <div className="h-full bg-primary/20" style={{ width: `${w}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-primary/10 blur-[100px] rounded-full" />
                                <div className="mt-auto relative z-10">
                                    <Button className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black">
                                        Access Fleet Portal
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Growth Loop */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">High Performance. <br /> Lower Risks.</h2>
                        <p className="text-xl mb-12 opacity-90">
                            The best-selling "Ghana Used" cars are those with a Motor Ambos history.
                            Turn your fleet into a liquid asset that retains its value.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-white/90">
                            <Link href="/contact-sales">
                                Partner with Us <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
