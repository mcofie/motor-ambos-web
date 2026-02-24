"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function PerkFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        { q: "Does it work without internet?", a: "Yes. Motor Ambos works via USSD fallback in zero-data areas, ensuring you can still request rescue and view critical vehicle data." },
        { q: "How are records verified?", a: "Records logged via the Onyx NFC card at approved centers are digitally signed and timestamped, creating a trusted history that boosts resale value." },
        { q: "Can any mechanic update my passport?", a: "Only verified providers in the Motor Ambos network can write to the verified history. You can manually log your own 'self-service' events separately." },
        { q: "What docs can I store?", a: "Insurance certificates, Roadworthy documents, Driver's License, and Logbooks. We'll alert you before they expire." },
        { q: "How do fleets manage many vehicles?", a: "Fleet owners get a master dashboard to track compliance, location, fuel efficiency, and maintenance across every unit in real-time." },
        { q: "Is my data secure?", a: "Your data is encrypted and protected by Supabase Row Level Security. Only you (and those you explicitly share with) can access your records." }
    ];

    return (
        <section id="faq" className="py-32 bg-background">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex flex-col gap-6 mb-20">
                    <div className="ambos-label">Documentation</div>
                    <h2 className="ambos-heading text-4xl md:text-8xl text-left text-foreground">FAQ</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-background p-12 space-y-6 hover:bg-secondary/50 transition-colors">
                            <h3 className="ambos-heading text-xl text-foreground">{faq.q}</h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wide leading-relaxed">
                                {faq.a}
                            </p>
                            <div className="pt-4 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                                <span>Ref: 0{idx + 1}</span>
                                <span>Technical Info</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final CTA section */}
                <div className="flex flex-wrap justify-center gap-6 mt-20">
                    <button className="ambos-btn-lime bg-primary text-black py-6 px-12 text-lg">
                        Get the App
                    </button>
                    <button className="ambos-btn-secondary border-white text-white py-6 px-12 text-lg hover:bg-white hover:text-onyx uppercase tracking-widest font-bold">
                        Request Fleet Demo
                    </button>
                </div>
            </div>
        </section>
    );
}
