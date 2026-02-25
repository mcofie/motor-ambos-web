import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, ClipboardList, Zap, ArrowRight, Share2, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "The Digital Passport | Motor Ambos",
    description: "The NFC Smart Card that acts as your car's Digital Glovebox. Managing compliance, history, and safety in one tap.",
};

export default function DigitalPassportPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16">
                            <div className="ambos-label">HARDWARE_ANCHOR: VERIFIED_TELEMETRY</div>

                            <div className="space-y-8">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.8] text-foreground tracking-tighter">
                                    YOUR_CAR&apos;S <br />
                                    <span className="text-primary italic text-glow">DIGITAL_PASSPORT.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                                    An immutable hardware record for the modern owner. Storing every repair, renewal, and safety metric in one sovereign interface.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 items-center pt-8">
                                <button className="ambos-btn-lime !py-8 !px-20 text-xl">
                                    ORDER_HARDWARE
                                </button>
                                <button className="ambos-btn-secondary !py-8 !px-20 text-xl">
                                    LINK_TERMINAL
                                </button>
                            </div>

                            <div className="w-full max-w-2xl pt-20">
                                <div className="mono-text mb-4">HARDWARE_READOUT</div>
                                <div className="passport-id-box flex items-center justify-between group hover:border-primary/40 transition-all cursor-crosshair">
                                    <span>MA_TERMINAL_v1.0.4</span>
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#CEFF00] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-32 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Permanent Log", icon: ClipboardList, desc: "Verified history of all repairs. Instant technical verification for mechanics via hardware tap—zero app overhead." },
                                { title: "DVLA Protocol", icon: ShieldCheck, desc: "Infrastructure-level monitoring. Automated roadworthy and insurance renewals synchronized with your physical ID." },
                                { title: "Emergency ICE", icon: Zap, desc: "High-priority medical beacon. Instant access for first responders to critical telemetry and emergency contacts." }
                            ].map((f, i) => (
                                <div key={i} className="ambos-card p-12 group hover:border-primary/30">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <f.icon size={28} />
                                    </div>
                                    <h3 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight">{f.title.toUpperCase()}</h3>
                                    <p className="mono-text text-[11px] text-muted-foreground leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resale Value Section */}
                <section className="py-44 bg-background relative">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center gap-32">
                            <div className="lg:w-1/2 relative group">
                                <div className="absolute -inset-4 bg-primary/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                                <div className="ambos-card bg-zinc-900/80 p-20 aspect-[4/3] border-white/5 relative z-10 flex flex-col justify-between overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] blur-[80px]" />
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(206,255,0,0.3)]">
                                            <Zap size={40} />
                                        </div>
                                        <div className="mono-text text-[10px] text-white/40 tracking-[0.4em] font-black uppercase">SYSTEM_TAG: TERMINAL_ALPHA</div>
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <div className="h-[1px] bg-white/10 w-full" />
                                        <div className="h-[1px] bg-white/10 w-2/3" />
                                    </div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="ambos-heading text-4xl text-white tracking-widest">MOTOR_AMBOS</div>
                                        <div className="h-14 w-24 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 space-y-16">
                                <div className="ambos-label">ASSET_PERFORMANCE</div>
                                <h2 className="ambos-heading text-6xl md:text-8xl leading-[0.8] mb-12 text-foreground">
                                    MAXIMIZE <br /> <span className="text-primary italic text-glow">RESALE_VALUE.</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium uppercase tracking-tight">
                                    Africa&apos;s automotive market suffers from a trust deficit. The Ambos Passport provides buyers with immutable, hardware-verified proof of maintenance.
                                </p>
                                <ul className="space-y-8">
                                    {[
                                        "VERIFIED_TECHNICAL_HISTORY",
                                        "GENUINE_COMPLIANCE_SYNC",
                                        "TRANSPARENT_OWNERSHIP_DATA",
                                        "UNIFIED_DOCUMENT_TERMINAL"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-8 mono-text text-[12px] font-black tracking-[0.3em] text-foreground">
                                            <div className="h-[1px] w-12 bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search / Verification Section */}
                <section className="py-44 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-6 max-w-4xl text-center space-y-16">
                        <div className="ambos-label !bg-background !text-foreground !border-none">SYSTEM_AUDIT_TERMINAL</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background tracking-tighter">
                            VERIFY <br />
                            <span className="text-primary italic text-glow">VEHICLE_UNIT.</span>
                        </h2>
                        <p className="text-2xl text-background/60 leading-relaxed uppercase mono-text tracking-widest font-medium">
                            Executing a purchase? Access the verified health report via the unique Ambos Identifier.
                        </p>

                        <div className="relative max-w-2xl mx-auto group">
                            <input
                                type="text"
                                placeholder="ENTER_SYSTEM_ID: XXXX-XXXX"
                                className="w-full h-24 bg-background/5 border-b-2 border-background/20 px-10 text-3xl font-black uppercase tracking-[0.4em] text-background placeholder:text-background/20 focus:outline-none focus:border-primary transition-all duration-500 rounded-t-3xl"
                            />
                            <button className="absolute right-6 top-6 h-12 w-12 bg-primary flex items-center justify-center text-foreground hover:scale-110 transition-all rounded-xl shadow-xl">
                                <Search size={24} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-60 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-5xl text-center space-y-20">
                        <div className="space-y-8">
                            <h2 className="ambos-heading text-7xl md:text-[12vw] leading-[0.75] text-foreground tracking-tighter">
                                TRANSFORM <br />
                                <span className="text-primary italic text-glow">ASSET_INTEGRITY.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
                                The future of vehicle ownership is verified. <br /> Initialize your Digital Passport today.
                            </p>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                ORDER_TERMINAL_NOW
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
