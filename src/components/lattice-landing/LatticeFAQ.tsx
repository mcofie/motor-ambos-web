"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function LatticeFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        { q: "Does it work without internet?", a: "Yes. Motor Ambos is designed for Ghana. You can access roadside rescue and view critical vehicle data via our USSD fallback even in zero-data areas." },
        { q: "How are service records verified?", a: "Every record logged via the NFC card is timestamped and signed by the verified provider's digital ID, making it a reliable 'Digital Passport' that boosts your car's resale value." },
        { q: "Can any mechanic write to my passport?", a: "No. Only 'Verified Providers' in the Motor Ambos network can write to the verified history. However, you can manually log your own 'Self-Service' events in separate records." },
        { q: "What documents can I store?", a: "You can securely store Insurance, Roadworthy, Driver's License, and Logbook scans. We'll even send you reminders before they expire to avoid fines." },
        { q: "How do fleets manage many vehicles?", a: "Business owners get a unified dashboard where they can see compliance, fuel efficiency, and location heatmaps for their entire fleet in real-time." },
        { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and Supabase Row Level Security to ensure that only you (and people you explicitly share the Passport with) can see your data." }
    ];

    return (
        <section id="faq" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                </div>

                <div className="grid gap-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="lattice-card overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-10 py-8 flex items-center justify-between text-left group transition-colors hover:bg-slate-50"
                            >
                                <span className={`text-xl font-bold transition-colors ${openIndex === idx ? "text-emerald" : "text-slate-900"}`}>
                                    {faq.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${openIndex === idx ? "bg-emerald border-emerald text-white rotate-180" : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                                    }`}>
                                    {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>
                            {openIndex === idx && (
                                <div className="px-10 pb-10 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
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
