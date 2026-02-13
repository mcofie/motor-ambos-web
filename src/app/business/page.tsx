import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, BarChart3, Users, Building2, ShieldCheck, ArrowRight, Zap, GraduationCap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Motor Ambos for Business | Corporate Care & Employee Perks",
    description: "The ultimate employee perk for corporate Ghana. Motor Ambos Corporate Care ensures your team stays productive and safe, while we handle vehicle compliance and maintenance.",
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section: The Productivity Pitch */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A0A0A] text-white">
                    <div className="absolute inset-0 -z-20 h-full w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9FE870]/20 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />

                        {/* Decorative glow */}
                        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#9FE870] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Zap className="h-4 w-4" />
                                <span className="tracking-wide uppercase">Motor Ambos Corporate Care</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                                Productive teams <br />
                                <span className="text-[#9FE870]">never get stuck.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                                Your top talent shouldn't be stuck at the DVLA or by the roadside.
                                Give them the <span className="text-white font-bold italic underline decoration-[#9FE870] decoration-2 underline-offset-4">Motor Ambos Black Card</span> — the ultimate corporate perk.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                <Button asChild size="lg" className="h-16 px-10 text-xl font-bold bg-[#9FE870] text-[#163300] hover:bg-[#9FE870]/90 border-none rounded-full shadow-2xl shadow-primary/20 flex items-center gap-2">
                                    <Link href="/contact-sales">Partner with Us <ArrowRight className="h-5 w-5" /></Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-16 px-10 text-xl font-bold border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full font-medium">
                                    <Link href="#offer">See the Offer</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Offer Section */}
                <section id="offer" className="py-32 bg-background">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                                        The Perk That Pays <br /> For Itself.
                                    </h2>
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        Companies in Accra lose thousands of productive hours to vehicle bureaucracy.
                                        We solve it by turning car care into a seamless corporate benefit.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        {
                                            title: "The B2B Pitch",
                                            desc: "Offer 'Motor Ambos Corporate Care' to your employees. You pay the subscription; they pay for repairs. You get a productive workforce; they get elite safety.",
                                            icon: Building2
                                        },
                                        {
                                            title: "Zero Bureaucracy",
                                            desc: "We ensure their cars never expire (insurance/roadworthy). No more mid-day runs to the DVLA.",
                                            icon: ShieldCheck
                                        },
                                        {
                                            title: "24/7 Rapid Rescue",
                                            desc: "If they break down, our units arrive in minutes. We get them home safely, so they can get back to what matters.",
                                            icon: Zap
                                        }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                                                <feature.icon className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xl mb-2">{feature.title}</h4>
                                                <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Black Card Mockup */}
                            <div className="relative">
                                <div className="relative aspect-[4/5] bg-neutral-900 rounded-[3rem] p-12 border-4 border-neutral-800 shadow-3xl flex flex-col justify-between group overflow-hidden">
                                    {/* Content */}
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="h-14 w-14 bg-[#9FE870] rounded-2xl flex items-center justify-center">
                                                <Zap className="h-8 w-8 text-[#163300]" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[#9FE870] font-black tracking-widest text-[10px] uppercase mb-1">Elite Tier</div>
                                                <div className="text-white text-xl font-bold tracking-tight">BLACK CARD</div>
                                            </div>
                                        </div>

                                        <div className="pt-8 space-y-4">
                                            <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                                Verified Compliance
                                                <span className="service-pulse" />
                                            </h3>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 bg-[#9FE870]/20 text-[#9FE870] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#9FE870]/30">Insurance OK</span>
                                                <span className="px-3 py-1 bg-[#9FE870]/20 text-[#9FE870] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#9FE870]/30">Roadworthy OK</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Quote */}
                                    <div className="relative z-10">
                                        <div className="text-white/40 text-sm italic mb-4 leading-relaxed">
                                            "Our top 50 managers haven't visited a repair shop in 12 months. Total peace of mind."
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-1 bg-[#9FE870] w-12 rounded-full" />
                                            <span className="text-white font-bold text-xs tracking-widest uppercase">CEO, FinTech Accra</span>
                                        </div>
                                    </div>

                                    {/* Mesh Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#9FE870]/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-primary/20 blur-[100px] rounded-full" />
                                </div>

                                {/* Floating Labels */}
                                <div className="absolute -top-6 -right-6 bg-white border border-border shadow-xl p-4 rounded-2xl rotate-6 hidden sm:block">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="h-4 w-4 text-[#9FE870]" />
                                        <span className="font-bold text-xs uppercase tracking-widest">HR Approved</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-medium">100% Tax-Deductible Perk</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-24 border-t border-border">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16 space-y-4">
                            <h3 className="text-3xl font-extrabold tracking-tight">Strategic Corporate Infrastructure</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">More than just a perk—it's a management system for your entire organization's mobility.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Centralized Compliance",
                                    desc: "Automated Roadworthy and Insurance renewals for hundreds of vehicles with one single corporate account.",
                                    icon: Building2
                                },
                                {
                                    title: "Maintenance Auditing",
                                    desc: "Every service record is cryptographically verified on the Digital Passport. No more overpaying for 'ghost' repairs.",
                                    icon: BarChart3
                                },
                                {
                                    title: "Employee Safety",
                                    desc: "Passive safety feature for first responders to access critical medical data via the card if an accident occurs.",
                                    icon: Users
                                }
                            ].map((pillar, i) => (
                                <div key={i} className="bg-card border border-border p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all group">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                        <pillar.icon className="h-7 w-7" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3">{pillar.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-[#0A0A0A] text-white overflow-hidden relative">
                    {/* Background effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#9FE870]/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Convert CAC to <br /> <span className="text-[#9FE870]">Scale and Trust.</span></h2>
                        <p className="text-xl mb-12 text-white/70 leading-relaxed font-medium">
                            Join the banks, tech firms, and logistics leaders in Accra who have eliminated vehicle downtime.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <Button asChild size="lg" className="h-16 px-12 text-xl font-bold bg-white text-black hover:bg-white/90 rounded-full font-black">
                                <Link href="/contact-sales">Request Corporate Demo</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
