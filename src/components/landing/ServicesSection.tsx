"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, ClipboardList, ShieldCheck, Wrench, AlertCircle, ArrowRight } from "lucide-react";

export function ServicesSection() {
    const services = [
        {
            title: "NFC Smart Card",
            desc: "The 'Digital Glovebox' that stays with your car. Tap to access everything.",
            icon: CreditCard,
            colSpan: "md:col-span-2",
            bg: "bg-zinc-900",
        },
        {
            title: "Digital Service Log",
            desc: "A permanent, verified history of all repairs and maintenance.",
            icon: ClipboardList,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "Bureaucracy Concierge",
            desc: "We handle Roadworthy, Insurance, and DVLA compliance for you.",
            icon: ShieldCheck,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "Parts Authenticator",
            desc: "Order and verify genuine spare parts directly to your mechanic.",
            icon: Wrench,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "Emergency ICE Beacon",
            desc: "Passive safety feature for first responders to access critical info.",
            icon: AlertCircle,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
    ];

    return (
        <section id="services" className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl mb-2">
                            Comprehensive Care
                        </h2>
                        <p className="text-muted-foreground max-w-md">
                            Everyday maintenance or emergency situations. We have you covered.
                        </p>
                    </div>
                    <Button variant="link" className="text-primary p-0 h-auto">
                        View full rate card <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((s, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:bg-muted/80 ${s.colSpan}`}
                        >
                            <div className="absolute right-4 top-4 rounded-full bg-background/50 p-2 text-muted-foreground group-hover:text-primary transition-colors">
                                <s.icon className="h-6 w-6" />
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                                <p className="text-sm text-muted-foreground">{s.desc}</p>
                            </div>

                            {/* Gradient Overlay on Hover */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
