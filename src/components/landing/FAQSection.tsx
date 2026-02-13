"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
    const faqs = [
        {
            question: "What is the Digital Passport?",
            answer: "It's an NFC-enabled Smart Card that stays with your car. It acts as a 'digital glovebox,' storing your vehicle's entire service history, documents, and emergency info.",
        },
        {
            question: "Do mechanics need the Motor Ambos app?",
            answer: "No. Mechanics simply tap your card with their phone to open a secure web interface where they can log service or send you a digital invoice instantly.",
        },
        {
            question: "How does the Bureaucracy Concierge work?",
            answer: "We monitor your Roadworthy and Insurance expiry dates. When it's time to renew, we handle the paperwork and DVLA processing for you, saving you from long queues.",
        },
        {
            question: "Can the card help in an emergency?",
            answer: "Yes. The card features an ICE (In Case of Emergency) beacon. First responders can tap it to see critical medical data and emergency contacts, even if they don't have internet data.",
        },
        {
            question: "Does the card increase my car's resale value?",
            answer: "Absolutely. Verified service history and genuine parts certification build trust with buyers, often allowing 'Ghana Used' cars to sell for 15-20% more than unverified ones.",
        },
    ];

    return (
        <section className="py-24 bg-background">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about Motor Ambos.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="font-semibold text-foreground">{question}</span>
                {isOpen ? (
                    <Minus className="h-5 w-5 text-primary shrink-0" />
                ) : (
                    <Plus className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
            </button>
            <div
                className={cn(
                    "px-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                {answer}
            </div>
        </div>
    );
}
