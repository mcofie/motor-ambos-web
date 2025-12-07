import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Clock, Map, Phone, Eye, Zap, TrendingUp } from 'lucide-react';

export default function ForMechanicsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-20 h-full w-full bg-background">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-30" />
                    </div>

                    <div className="container mx-auto px-4 max-w-6xl text-center relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Zap className="h-3.5 w-3.5" />
                            <span>Join the Decentralized Network</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Are You the Best <br />
                            <span className="text-primary">Mechanic in Town?</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
                            Join Motor Ambos, the decentralized network that connects you directly to drivers who need help. Get paid instantly, grow your business, and be the hero on the road.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Button asChild size="lg" className="h-12 px-8 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                                <Link href="/providers/join">Register as a Provider</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* The Network Effect Section */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">The Network Effect</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Traditional dispatching is slow and inefficient. Our decentralized model is built for speed, transparency, and fairness.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Feature 1: Hyper-Local */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Hyperspeed Response</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    <strong>15-20 Minutes.</strong> That's the target. By connecting drivers to the nearest active provider, we eliminate long wait times and cross-town travel.
                                </p>
                            </div>

                            {/* Feature 2: Radical Transparency */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                                    <Eye className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Radical Transparency</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    No hidden fees. Drivers see your <strong>live distance</strong> and your <strong>call-out fee</strong> before they even call. Trust is built before you arrive.
                                </p>
                            </div>

                            {/* Feature 3: Zero Friction */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                                    <Phone className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Zero-Friction Calls</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We cut out the middleman. When a driver needs help, they call <strong>you</strong> directly. It's your business, your client, your reputation.
                                </p>
                            </div>

                            {/* Feature 4: Meritocracy */}
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                                <div className="h-14 w-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Fair Competition</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    The map doesn't lie. Drivers choose you effectively based on your proximity and rating. provide great service, and the network rewards you.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Join the Future of Car Care?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Be part of the network that is changing how Africa moves. Sign up today and start earning.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/providers/join">Apply Now</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
