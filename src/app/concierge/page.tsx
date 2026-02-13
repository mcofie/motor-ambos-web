import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Calendar, Clock, FileCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Bureaucracy Concierge | Motor Ambos",
    description: "We handle the boring but mandatory tasks. Roadworthy renewals, Insurance updates, and DVLA compliance without the queues.",
};

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 -z-20 h-full w-full">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Zero-Queue Compliance</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                                We Queue <br />
                                <span className="text-primary">So You Don't.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                                Roadworthy, Insurance, and DVLA paperwork—the 'boring' parts of car ownership made effortless.
                                We handle the logistics while you focus on driving.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg font-bold">
                                    <Link href="/club">Join Ambos Club</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold">
                                    <Link href="#how-it-works">How it Works</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section id="how-it-works" className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Concierge Experience</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                Managing your car's compliance has never been this simple.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="relative p-8 rounded-3xl bg-card border border-border">
                                <div className="absolute -top-6 left-8 h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                    1
                                </div>
                                <h3 className="text-xl font-bold mt-4 mb-4">Auto-Monitoring</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Your Digital Passport tracks your Roadworthy and Insurance expiry dates automatically.
                                </p>
                            </div>

                            <div className="relative p-8 rounded-3xl bg-card border border-border">
                                <div className="absolute -top-6 left-8 h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                    2
                                </div>
                                <h3 className="text-xl font-bold mt-4 mb-4">Smart Alerts</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We notify you 30 days before expiry. With one click, you authorize us to handle the renewal.
                                </p>
                            </div>

                            <div className="relative p-8 rounded-3xl bg-card border border-border">
                                <div className="absolute -top-6 left-8 h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                                    3
                                </div>
                                <h3 className="text-xl font-bold mt-4 mb-4">Digital Handover</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We collect your documents, complete the process at the DVLA, and update your Digital Passport instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features List */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="md:w-1/2 space-y-8">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    Total Compliance <br /> Peace of Mind.
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Our concierge service is designed for the busy professional who values their time.
                                    Eliminate the risk of fines and the stress of queues.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: "DVLA Renewals", icon: FileCheck },
                                        { title: "Insurance Updates", icon: shieldCheck },
                                        { title: "Document Storage", icon: Clock },
                                        { title: "Fast Processing", icon: Zap }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <span className="font-semibold">{feature.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="md:w-1/2 bg-card border border-border p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <ShieldCheck className="h-16 w-16 text-primary/10 group-hover:text-primary/20 transition-colors" />
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Next Renewal</div>
                                        <div className="text-2xl font-bold text-primary">Roadworthy</div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-muted px-4 py-2 rounded-xl text-sm font-mono tracking-tighter">OCT 24, 2026</div>
                                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold self-center">UPCOMING</div>
                                    </div>
                                    <div className="pt-8">
                                        <Button className="w-full h-12 font-bold bg-[#9ae600] text-black hover:bg-[#9ae600]/90 dark:bg-primary dark:text-primary-foreground">
                                            Authorize Concierge
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center">
                                        Standard processing time: 24-48 hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Stop Waiting in Queues</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join the Motor Ambos Club and let us handle your vehicle's bureaucracy.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/club">
                                See Membership Plans <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function shieldCheck(props: any) {
    return <ShieldCheck {...props} />;
}
