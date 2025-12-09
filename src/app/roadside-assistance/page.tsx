import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Truck, Fuel, Battery, Key, ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Roadside Assistance | Motor Ambos",
    description: "24/7 Roadside Assistance. Towing, fuel delivery, battery jumpstart, and lockout services. Fast response times.",
};

export default function RoadsideAssistancePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-muted/20">
                    <div className="container mx-auto px-4 max-w-6xl relative z-10">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                                Stuck on the Road? <br />
                                <span className="text-primary">We've Got You.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                                Fast, reliable roadside assistance exactly when you need it. No membership required for on-demand service.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg font-bold">
                                    <Link href="/help">Get Help Now</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold">
                                    <Link href="/club">View Membership Plans</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                                    <Truck className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Towing</h3>
                                <p className="text-muted-foreground">
                                    Professional towing for breakdowns or accidents. We'll get you to safety or your preferred mechanic.
                                </p>
                            </div>

                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
                                    <Fuel className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Fuel Delivery</h3>
                                <p className="text-muted-foreground">
                                    Ran out of gas? We'll deliver enough fuel to get you to the nearest station.
                                </p>
                            </div>

                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-500">
                                    <Battery className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Jump Start</h3>
                                <p className="text-muted-foreground">
                                    Dead battery? We'll give your car the boost it needs to get back on the road.
                                </p>
                            </div>

                            <div className="bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300">
                                <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                                    <Key className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Lockout Service</h3>
                                <p className="text-muted-foreground">
                                    Locked your keys inside? Our professionals can open your car without damage.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary/5">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-6">Don't Wait on the Side of the Road</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Our average response time is under 30 minutes. Request help instantly.
                        </p>
                        <Button asChild size="lg" className="h-14 px-10 text-lg font-bold">
                            <Link href="/help">
                                Request Assistance <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
