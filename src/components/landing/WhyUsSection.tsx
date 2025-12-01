"use client";

import { ShieldCheck, MapPin, CreditCard, Smartphone, Zap, Truck } from "lucide-react";

export function WhyUsSection() {
    const features = [
        { icon: ShieldCheck, title: "Verified Network", text: "We vet every provider. See prices and ratings upfront." },
        { icon: MapPin, title: "Smart Matching", text: "We rank providers by distance, availability, and rating." },
        { icon: CreditCard, title: "Clear Pricing", text: "Transparent callout fees. Receipts stored digitally." },
        { icon: Smartphone, title: "Seamless App", text: "Book in taps, track your provider live, and chat instantly." },
        { icon: Zap, title: "Fast Response", text: "Our algorithm prioritizes the closest active unit to you." },
        { icon: Truck, title: "All Vehicles", text: "From motorbikes to SUVs, we have the right gear for the job." },
    ];

    return (
        <section id="why" className="py-24 bg-background relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Why Motor Ambos?</h2>
                    <p className="text-muted-foreground">
                        We are building the operating system for African roadside assistance.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-[#9ae600] text-black dark:bg-card dark:text-foreground border border-border hover:border-primary/20 transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-black/10 flex items-center justify-center text-black mb-4 dark:bg-muted dark:text-primary">
                                <f.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-inherit mb-2">{f.title}</h3>
                            <p className="text-sm text-black/80 dark:text-muted-foreground leading-relaxed">{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
