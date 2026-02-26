"use client";

import React from "react";
import { Wrench, Zap, BarChart3, ShieldCheck, ArrowUpRight } from "lucide-react";

export function PerkProviders() {
    return (
        <section id="providers" className="section-dark">
            <div className="fintech-container">
                <div className="space-y-24">
                    <div className="space-y-10 max-w-4xl text-center md:text-left">
                        <div className="label-technical !text-primary">Network Nodes / Service_Workshops</div>
                        <h2 className="section-heading !text-background">
                            Fueling the <br /> service economy.
                        </h2>
                        <p className="body-copy !text-background/60">
                            Ambos transforms workshops into high-trust data nodes. Attract premium fleets and prove your service quality with verifiable, immutable history logs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Wrench size={32} strokeWidth={2.5} />,
                                title: "Accredited Status",
                                desc: "Join the network of vetted workshops. Get prioritized by fleet managers and individual drivers."
                            },
                            {
                                icon: <Zap size={32} strokeWidth={2.5} />,
                                title: "Tap-to-Log Flow",
                                desc: "Every service signed physically. Eliminate disputes and build a verifiable history for every car."
                            },
                            {
                                icon: <BarChart3 size={32} strokeWidth={2.5} />,
                                title: "Demand Routing",
                                desc: "Get automated service requests based on health alerts. Keep your bays full with system-driven leads."
                            },
                            {
                                icon: <ShieldCheck size={32} strokeWidth={2.5} />,
                                title: "Fleet Compliance",
                                desc: "Providers sign off on audits automatically. Reduce paperwork and accelerate payment cycles."
                            }
                        ].map((item, i) => (
                            <div key={i} className="fintech-card !bg-transparent !border-primary !p-12 space-y-10 group hover:bg-primary hover:!text-foreground transition-all duration-500">
                                <div className="h-20 w-20 border-2 border-primary group-hover:border-foreground flex items-center justify-center transition-colors">
                                    <div className="text-primary group-hover:text-foreground">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic group-hover:text-foreground">{item.title}.</h3>
                                    <p className="text-sm font-bold opacity-60 leading-relaxed italic group-hover:opacity-80 group-hover:text-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-16 border-4 border-primary bg-background text-foreground flex flex-col lg:flex-row justify-between items-center gap-12 shadow-[12px_12px_0px_0px_var(--primary)] group">
                        <div className="space-y-4 text-center lg:text-left">
                            <div className="label-technical">Ready to join?</div>
                            <h4 className="text-4xl font-black uppercase tracking-tight italic">Become an accredited node.</h4>
                        </div>
                        <button className="btn-primary !px-16 !py-8 !text-2xl">
                            Apply as Provider <ArrowUpRight size={28} className="ml-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
