"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function PremiumFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How does the NFC card work?",
            a: "The NFC card contains a secure chip that links your physical vehicle to its digital passport. When scanned at a partner service center, it allows providers to view verified history and log new service events instantly."
        },
        {
            q: "Is it available nationwide in Ghana?",
            a: "Yes! While our primary network is densest in Accra and Kumasi, our USSD fallback and roadside rescue partners cover major highways and cities across the country 24/7."
        },
        {
            q: "What happens if I don't have internet access?",
            a: "Motor Ambos is built for Ghana. You can access emergency rescue and key vehicle info via our dedicated USSD code even without a data plan."
        },
        {
            q: "Can I manage multiple vehicles?",
            a: "Absolutely. Our 'Digital Garage' feature allows you to manage personal, family, or entire business fleets from a single dashboard with separate records for each."
        }
    ];

    return (
        <section id="faq" className="py-24 relative">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <span className="section-label">Questions</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-4">FAQ</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="glass-card overflow-hidden transition-all">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02]"
                            >
                                <span className="text-lg font-bold text-white">{faq.q}</span>
                                {openIndex === idx ? <ChevronUp className="text-emerald" /> : <ChevronDown className="text-muted-foreground" />}
                            </button>
                            {openIndex === idx && (
                                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
