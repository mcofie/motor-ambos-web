"use client";

import { ShieldCheck, MapPin, CreditCard, Smartphone, Zap, Truck } from "lucide-react";

export function WhyUsSection() {
    const features = [
        { icon: ShieldCheck, title: "Resale Value", text: "Verified service records can increase your car's resale value by up to 20%." },
        { icon: Smartphone, title: "Digital Glovebox", text: "All your documents and maintenance logs in one NFC-powered smart card." },
        { icon: Zap, title: "DVLA Concierge", text: "No more queues. We handle your roadworthy and insurance renewals automatically." },
        { icon: CreditCard, title: "Parts Guarantee", text: "Every part ordered through our platform is verified for authenticity." },
        { icon: MapPin, title: "ICE Safety", text: "Instant access to emergency info for first responders, even without data." },
        { icon: Truck, title: "Fleet Management", text: "Enterprise-grade tools for corporate fleets and HR departments." },
    ];

    return (
        <section id="why" className="py-24 bg-background relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">The Motor Ambos Advantage</h2>
                    <p className="text-muted-foreground">
                        We're building the infrastructure for a more transparent and valuable car market in Ghana.
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
