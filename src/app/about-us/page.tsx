import React from 'react';
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Car, ShieldCheck, Users, Target, Heart, Wrench } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 -z-20 h-full w-full bg-background">
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
                        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-50" />
                    </div>

                    <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Target className="h-3.5 w-3.5" />
                            <span>Our Mission & Vision</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Driven by Service, <br />
                            <span className="text-primary">Powered by Community.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                            Motor Ambos is redefining roadside assistance in Africa by connecting drivers with a trusted network of skilled mechanics and service providers.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/50 max-w-4xl mx-auto">
                            <div>
                                <div className="text-3xl font-bold text-foreground">500+</div>
                                <div className="text-sm text-muted-foreground mt-1">Verified Mechanics</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-foreground">15min</div>
                                <div className="text-sm text-muted-foreground mt-1">Avg. Response Time</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-foreground">24/7</div>
                                <div className="text-sm text-muted-foreground mt-1">Support Available</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-foreground">5k+</div>
                                <div className="text-sm text-muted-foreground mt-1">Drivers Helped</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We are building more than just an app; we are building a standard of trust and reliability on the road.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="group bg-card hover:bg-card/80 border border-border p-8 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Car className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Keep Africa Moving</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    To eliminate the stress of vehicle breakdowns by providing fast, reliable, and transparent roadside assistance for every driver.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="group bg-card hover:bg-card/80 border border-border p-8 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Empower Mechanics</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We provide local mechanics with the digital tools and visibility they need to grow their businesses and compete fairly.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="group bg-card hover:bg-card/80 border border-border p-8 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Trust & Safety First</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Safety is non-negotiable. We rigorously vet every provider to ensure top-quality service and peace of mind for every user.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-8">
                                <Heart className="h-8 w-8 text-foreground/80" />
                            </div>

                            <h2 className="text-4xl font-bold mb-8">The Motor Ambos Story</h2>

                            <div className="prose prose-lg dark:prose-invert prose-neutral max-w-none text-left md:text-center leading-relaxed text-muted-foreground">
                                <p className="mb-6">
                                    It started with a simple, frustrating reality: getting help on the road shouldn&apos;t be a gamble. In many parts of the continent, a breakdown means uncertainty—uncertainty about who to call, how much it will cost, and if the repair will actually hold.
                                </p>
                                <p className="mb-6">
                                    Motor Ambos was built to bridge this gap. We leverage technology to bring transparency and efficiency to a fragmented industry. Whether you need a battery jump, a tire change, fuel delivery, or a tow, our platform connects you instantly to the nearest available, verified provider.
                                </p>
                                <p>
                                    But we are more than just a tech platform. We are a community dedicated to keeping you safe. By empowering local mechanics with fair work and giving drivers the confidence to travel, we are upgrading the road experience for everyone.
                                </p>
                            </div>

                            <div className="mt-12 pt-12 border-t border-border w-full flex flex-col items-center">
                                <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4">Join our journey</p>
                                <div className="flex gap-4">
                                    {/* Social placeholders or secondary links could go here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
