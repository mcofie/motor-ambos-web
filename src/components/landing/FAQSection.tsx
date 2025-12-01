"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
    const faqs = [
        {
            question: "How quickly can a mechanic arrive?",
            answer: "Our average response time is under 30 minutes in Accra. The app will show you the exact ETA of your assigned provider.",
        },
        {
            question: "Do I need a membership to use Motor Ambos?",
            answer: "No! You can request on-demand assistance anytime. However, members enjoy discounted rates, priority dispatch, and free annual checkups.",
        },
        {
            question: "How are prices determined?",
            answer: "We use standard rate cards for common services (like battery jumps or tyre changes). For repairs, you'll get a verified quote before work begins.",
        },
        {
            question: "Is my vehicle covered anywhere in Ghana?",
            answer: "We currently operate primarily in Greater Accra, with expanding coverage in Kumasi and Takoradi. Check the app for the latest coverage map.",
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
