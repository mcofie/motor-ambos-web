import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Clock, Map, Phone, Eye, Zap, TrendingUp } from 'lucide-react';

export const metadata = {
    title: "For Mechanics | Motor Ambos",
    description: "Empower your shop without an app. Join the Motor Ambos network and build a data-verified reputation.",
};

export default function ForMechanicsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16 lg:space-y-20">
                            <div className="ambos-label">PROFESSIONAL_TERMINAL: NO_APP_REQUIRED_v4.2</div>

                            <div className="space-y-8 max-w-6xl">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter">
                                    EMPOWER_YOUR_SHOP <br />
                                    <span className="text-primary italic text-glow">WITHOUT_AN_APP.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                                    Join the Motor Ambos network. Just tap a customer&apos;s Smart Card to log service, dispatch digital invoices, and build a data-verified reputation — all via browser infrastructure.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8">
                                <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                    <Link href="/providers/join">REGISTER_YOUR_GARAGE</Link>
                                </button>
                            </div>

                            <div className="w-full max-w-2xl pt-24 space-y-4">
                                <div className="ambos-label mx-auto !bg-transparent !border-white/10 !text-white/30">TERMINAL_READOUT</div>
                                <div className="passport-id-box flex items-center justify-between group hover:border-primary/40 transition-all cursor-crosshair bg-white/[0.02] border-white/10 p-4 rounded-xl">
                                    <span className="mono-text text-[10px] tracking-widest font-black uppercase text-white/50">GHA_SHOP_ADMIN_v0.4.1</span>
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#CEFF00] animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="py-44 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="mb-32 space-y-8 text-center md:text-left">
                            <div className="ambos-label mx-auto md:ml-0">OPERATIONAL_ADVANTAGE</div>
                            <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">THE_PROFESSIONAL_GRID.</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { title: "Tap to Log", icon: Zap, desc: "Simply tap the customer's RFID Card. Instant browser interface for high-speed service logging." },
                                { title: "Digital Invoices", icon: Eye, desc: "Send detailed, data-backed Digital Invoices via Technical Link. Professional, paperless, permanent." },
                                { title: "Verified History", icon: TrendingUp, desc: "Every job entry adds to the car's Permanent Passport. Verified work commands premium node value." },
                                { title: "Parts Terminal", icon: Clock, desc: "One-tap access to our Verified Parts Network. Genesis spares dispatched directly to your shop." }
                            ].map((f, i) => (
                                <div key={i} className="ambos-card p-12 text-left bg-white/[0.02] border-white/5 group hover:border-primary/40 transition-all duration-700">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <f.icon size={28} />
                                    </div>
                                    <h3 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight uppercase tracking-widest">{f.title}</h3>
                                    <p className="mono-text text-[11px] text-muted-foreground uppercase tracking-widest leading-relaxed font-medium">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-60 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-20">
                        <div className="ambos-label !bg-background !text-foreground !border-none">INDUSTRIAL_UPGRADE</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background text-center tracking-tighter uppercase">
                            UPGRADE_YOUR <br />
                            <span className="text-primary italic text-glow">GARAGE_NOW.</span>
                        </h2>

                        <p className="text-xl md:text-2xl text-background/60 max-w-4xl mx-auto uppercase mono-text tracking-[0.3em] font-black">
                            Join the industrial standard for car care in Ghana. <br /> Total professional control, unlocked.
                        </p>

                        <div className="pt-10">
                            <button className="ambos-btn-lime !py-12 !px-32 !text-3xl !tracking-[0.5em] !bg-background !text-foreground hover:!bg-primary hover:!text-black transition-all hover:!shadow-[0_20px_60px_-10px_rgba(206,255,0,0.5)]">
                                <Link href="/providers/join">CLAIM_DIGITAL_ID</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
