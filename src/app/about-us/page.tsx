import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Car, ShieldCheck, Users, Target, Heart, Wrench } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "About Us | Motor Ambos",
    description: "Driven by service, powered by data. Building the digital infrastructure for vehicle ownership across Africa.",
};

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow">
                {/* Hero section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="flex flex-col items-center text-center space-y-16 lg:space-y-20">
                            <div className="ambos-label">MOTOR_AMBOS: MISSION_IDENTITY_v4.2</div>

                            <div className="space-y-8 max-w-6xl">
                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter">
                                    DRIVEN_BY_SERVICE. <br />
                                    <span className="text-primary italic text-glow">POWERED_BY_DATA.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
                                    Motor Ambos is building the digital infrastructure for vehicle ownership across Africa. Trusted networks, verified history, and high-performance technical precision.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-y border-white/5 w-full max-w-6xl">
                                {[
                                    { label: "VERIFIED_MECHANICS", value: "500+" },
                                    { label: "AVG_SYNC_TIME", value: "15MIN" },
                                    { label: "NETWORK_STATUS", value: "24/7" },
                                    { label: "PROTECTED_UNITS", value: "5K+" }
                                ].map((stat) => (
                                    <div key={stat.label} className="flex flex-col items-center space-y-4">
                                        <span className="ambos-heading text-4xl md:text-5xl text-foreground text-glow">{stat.value}</span>
                                        <span className="mono-text text-[10px] text-primary tracking-[0.3em] font-black uppercase">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Principles Section */}
                <section className="py-44 bg-background relative overflow-hidden">
                    <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                        <div className="mb-32 space-y-8 text-center md:text-left">
                            <div className="ambos-label mx-auto md:ml-0">CORE_PRINCIPLES</div>
                            <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">THE_STANDARD_OF_TRUST.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: "Digital Mobility", icon: Car, desc: "Eliminating breakdown friction through high-speed dispatch and verified technical routing." },
                                { title: "Network Integrity", icon: Users, desc: "Every provider is a verified node in our ecosystem, governed by technical performance standards." },
                                { title: "Unfailing Safety", icon: ShieldCheck, desc: "Total transparency from dispatch to repair, ensuring that trust is data-driven, not assumed." }
                            ].map((v, i) => (
                                <div key={i} className="ambos-card p-12 text-left bg-white/[0.02] border-white/5 group hover:border-primary/40 transition-all duration-700">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <v.icon size={28} />
                                    </div>
                                    <h3 className="ambos-heading text-2xl mb-6 text-foreground tracking-tight uppercase tracking-widest">{v.title}</h3>
                                    <p className="mono-text text-[11px] text-muted-foreground uppercase tracking-widest leading-relaxed font-medium">
                                        {v.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="py-44 bg-foreground text-background mesh-bg !bg-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
                    <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-20">
                        <div className="ambos-label !bg-background !text-foreground !border-none">GENESIS_MODULE</div>
                        <h2 className="ambos-heading text-7xl md:text-[10vw] leading-[0.75] text-background text-center tracking-tighter uppercase">
                            THE_ROAD <br />
                            <span className="text-primary italic text-glow">NEEDS_A_SYSTEM.</span>
                        </h2>

                        <div className="max-w-4xl mx-auto">
                            <p className="text-xl md:text-2xl text-background/60 leading-relaxed uppercase mono-text tracking-[0.3em] font-black">
                                Infrastructure is invisible until it fails. In Ghana, the automotive industry was fragmented—relying on guesswork. We built Motor Ambos to be the invisible infrastructure that keeps the road moving.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-8 pt-10">
                            <button className="ambos-btn-lime !py-10 !px-24 text-2xl !bg-background !text-foreground hover:!bg-primary hover:!text-black transition-colors">
                                <Link href="/digital-passport">GET_PASSPORT</Link>
                            </button>
                            <button className="ambos-btn-secondary !border-background/20 !text-background !py-10 !px-24 text-2xl hover:!bg-background hover:!text-foreground transition-colors">
                                <Link href="/providers/join">PARTNER_NODE</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
