"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function PerkFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "How does Motor Ambos protect my vehicle history?",
            a: "We use encrypted NFC hardware and multi-party verification protocols to ensure that every record logged in your vehicle's digital passport is authentic, tamper-proof, and legally verifiable."
        },
        {
            q: "Can I manage a fleet of vehicles with one account?",
            a: "Yes. Motor Ambos for Business is designed for fleet managers, providing centralized visibility into compliance, maintenance costs, and fuel consumption across unlimited vehicle nodes."
        },
        {
            q: "Do I need special hardware to use the system?",
            a: "While the app works for general tracking, the Onyx Card (NFC) is required for high-integrity service logging and quick-tap verification at partner service centers."
        }
    ];

    return (
        <section id="faq" className="wise-section bg-[#F0F2F5] border-t border-border">
            <div className="wise-container">
                <div className="max-w-4xl space-y-20">
                    <h2 className="wise-heading-section text-center">Frequently asked questions</h2>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full p-8 flex justify-between items-center text-left hover:bg-[#F0F2F5]/50 transition-colors group"
                                >
                                    <span className="text-xl font-black tracking-tight">{faq.q}</span>
                                    <ChevronDown size={24} className={`text-[#5D7079] transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openIndex === idx && (
                                    <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-lg font-bold text-[#5D7079] leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
