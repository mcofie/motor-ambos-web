import React from 'react';
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Truck, Fuel, Battery, Key, ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Roadside Assistance | Motor Ambos",
    description: "24/7 Roadside Assistance. Towing, fuel delivery, battery jumpstart, and lockout services. Fast response times.",
};

export default function RoadsideAssistancePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle !bg-red-500/[0.05] !blur-[150px]" />

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center text-center space-y-20">
                            <div className="ambos-label !border-red-500/30 !text-red-500">RESCUE_DISPATCH_PROTOCOL_v0.9.8</div>

                            <div className="space-y-8 max-w-6xl">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] leading-[0.8] text-foreground tracking-tighter">
                                    STUCK_ON_ROAD? <br />
                                    <span className="text-red-500 italic drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">INITIALIZE_RESCUE.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                                    High-velocity intervention for mechanical failure or logistics emergency. Direct dispatch units on standby—zero subscription forced.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                                <button className="ambos-btn-lime !bg-red-500 !text-white !hover:shadow-[0_20px_40px_-10px_rgba(239,68,68,0.5)]">
                                    <Link href="/help">DEPLOY_UNIT_NOW</Link>
                                </button>
                                <button className="ambos-btn-secondary">
                                    <Link href="/club">SYSTEM_SPECS</Link>
                                </button>
                            </div>

                            <div className="w-full max-w-2xl pt-12">
                                <div className="mono-text mb-4 opacity-100 text-red-500/60">DISPATCH_COORDINATES_SYNCING</div>
                                <div className="passport-id-box flex items-center justify-between group hover:border-red-500/40 transition-all border-red-500/20 bg-red-500/5">
                                    <span className="text-red-500/80">PENDING_GPS_LOCK...</span>
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-32 bg-background relative">
                    <div className="container mx-auto px-6 max-w-7xl relative z-10">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Towing", icon: Truck, desc: "Professional extraction for mechanical fail or collision. Transport to secure node." },
                                { title: "Refuel", icon: Fuel, desc: "Energy exhaustion? We deliver fuel payload to reach nearest replenishment station." },
                                { title: "Jump Start", icon: Battery, desc: "Power failure? High-volt boost to initialize your systems immediately." },
                                { title: "Lockout", icon: Key, desc: "Integrity lock? Non-destructive entry protocols to regain vehicle access." }
                            ].map((s, i) => (
                                <div key={i} className="ambos-card p-12 group hover:border-red-500/30">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                                        <s.icon size={28} />
                                    </div>
                                    <h3 className="ambos-heading text-2xl mb-6 text-foreground">{s.title.toUpperCase()}</h3>
                                    <p className="mono-text text-[11px] text-muted-foreground leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-44 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-600/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-16">
                        <div className="ambos-label !bg-background !text-foreground !border-none">SYSTEM_CAPACITY</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background text-center tracking-tighter">
                            RAPID_RESPONSE <br />
                            <span className="text-red-500 italic drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">INFRASTRUCTURE.</span>
                        </h2>

                        <p className="text-2xl text-background/60 max-w-2xl mx-auto uppercase mono-text tracking-widest">
                            Average deployment timeline: <span className="text-white">&lt;28 minutes</span>. <br /> Tactical units ready for transmission.
                        </p>

                        <div className="pt-10">
                            <button className="ambos-btn-lime !bg-red-500 !text-white">
                                <Link href="/help">REQUEST_ASSISTANCE</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
