"use client";

import { Star } from "lucide-react";
import Image from "next/image";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Kwame Mensah",
            role: "Uber Driver",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
            quote: "Motor Ambos saved my day when my battery died in Osu. The mechanic arrived in 15 minutes!",
            rating: 5,
        },
        {
            name: "Ama Osei",
            role: "Commuter",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
            quote: "I love the transparency. No haggling over prices, just professional service every time.",
            rating: 5,
        },
        {
            name: "Kojo Antwi",
            role: "Fleet Manager",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
            quote: "Managing my fleet's maintenance is so much easier now. The monthly reports are a lifesaver.",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Drivers</h2>
                    <p className="text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what our community has to say.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <blockquote className="text-foreground font-medium mb-6 leading-relaxed">
                                &quot;{t.quote}&quot;
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                                    <Image
                                        src={t.image}
                                        alt={t.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
