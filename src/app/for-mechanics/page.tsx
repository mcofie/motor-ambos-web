import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Clock, Map, Phone, Eye, Zap, TrendingUp, Handshake, ShieldCheck, Box } from 'lucide-react';

export const metadata = {
    title: "For Mechanics | Motor Ambos",
    description: "Empower your shop without an app. Join the Motor Ambos network and build a data-verified reputation.",
};

export default function ForMechanicsPage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-[#F0F2F5]">
                    <div className="wise-container relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-12">
                            <h1 className="wise-heading-hero">
                                Empower your shop <br />
                                <span className="text-[#2D5B18] italic">without an app.</span>
                            </h1>

                            <p className="wise-body text-xl max-w-2xl mx-auto">
                                Join the Motor Ambos network. Just tap a customer&apos;s Smart Card to log service, dispatch digital invoices, and build a data-verified reputation — all via your browser.
                            </p>

                            <div className="flex justify-center pt-8">
                                <Link href="/providers/join">
                                    <button className="wise-btn-primary !px-16 !py-6 text-xl flex items-center gap-4">
                                        Register your Garage <Zap size={24} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Grid */}
                <section className="py-44 bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="grid lg:grid-cols-2 gap-24 items-end mb-24">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                    Operational Advantage
                                </div>
                                <h2 className="wise-heading-section !leading-none">The Professional <br /> Grid.</h2>
                            </div>
                            <p className="wise-body text-lg">
                                We provide the digital infrastructure so you can focus on the grease and gears. Professionalize your operations in seconds.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Tap to Log", icon: Zap, color: "text-amber-600 bg-amber-50", desc: "Simply tap the customer's RFID Card. Instant browser interface for high-speed service logging." },
                                { title: "Digital Invoices", icon: Eye, color: "text-blue-600 bg-blue-50", desc: "Send detailed, data-backed Digital Invoices via Technical Link. Professional, paperless, permanent." },
                                { title: "Verified History", icon: TrendingUp, color: "text-[#2D5B18] bg-[#9FE870]/10", desc: "Every job entry adds to the car's Permanent Passport. Verified work commands premium node value." },
                                { title: "Parts Terminal", icon: Box, color: "text-purple-600 bg-purple-50", desc: "One-tap access to our Verified Parts Network. Genuine spares dispatched directly to your shop." }
                            ].map((f, i) => (
                                <div key={i} className="wise-card !p-12 space-y-12 group hover:border-[#9FE870]">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", f.color)}>
                                        <f.icon size={28} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">{f.title}</h3>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-44 bg-black text-white text-center">
                    <div className="wise-container max-w-4xl space-y-16">
                        <h2 className="wise-heading-hero !text-white !leading-[0.85]">Upgrade your <br /> <span className="text-[#9FE870] italic">garage now.</span></h2>
                        <p className="text-xl font-bold opacity-60 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
                            Join the industrial standard for car care in Ghana. Total professional control, unlocked.
                        </p>
                        <div className="pt-8">
                            <Link href="/providers/join">
                                <button className="wise-btn-primary !px-16 !py-6 !text-2xl shadow-[0_20px_60px_-10px_rgba(159,232,112,0.3)]">
                                    Claim Digital ID
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
