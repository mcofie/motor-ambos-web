"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, ShieldAlert, Truck, ChevronRight } from "lucide-react";

export function PremiumBusiness() {
    return (
        <section id="business" className="py-24 relative overflow-hidden bg-white/[0.01]">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="flex flex-col gap-6">
                        <span className="section-label">For Businesses</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Transparency. Efficiency. <br />
                            <span className="emerald-text-gradient">Asset Longevity.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-lg">
                            Take complete control of your fleet. From fuel consumption monitoring to automated compliance, we provide the data you need to reduce costs and increase vehicle lifespan.
                        </p>
                        <Button className="bg-emerald hover:bg-emerald/90 text-navy font-bold rounded-full px-8 py-7 h-auto text-lg w-fit mt-4">
                            Request Fleet Demo
                        </Button>
                    </div>

                    <div className="relative">
                        {/* Mock Dashboard Card */}
                        <div className="glass-card p-8 relative z-10 overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-bold text-white">Fleet Performance</h4>
                                <div className="flex gap-2 text-[10px] font-bold">
                                    <span className="px-2 py-1 rounded bg-emerald/10 text-emerald">ACTIVE</span>
                                    <span className="px-2 py-1 rounded bg-white/5 text-muted-foreground">REAL-TIME</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Fuel Efficiency</span>
                                    <div className="text-2xl font-bold text-white">+14.2%</div>
                                </div>
                                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Units</span>
                                    <div className="text-2xl font-bold text-white">42 / 45</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: "Unit #104 (Ford Ranger)", status: "On Route", health: 98 },
                                    { name: "Unit #202 (Nissan NP200)", status: "In Service", health: 84 },
                                    { name: "Unit #089 (Toyota Hiace)", status: "Active", health: 92 },
                                ].map((unit, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                                                <Truck size={14} className="text-emerald" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{unit.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{unit.status}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-emerald">{unit.health}%</div>
                                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                                                <div className="h-full bg-emerald" style={{ width: `${unit.health}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative Blur */}
                        <div className="absolute -inset-4 bg-emerald/10 blur-3xl -z-10" />
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { title: "Cost Control", icon: BarChart3, desc: "Eliminate Ghost Receipts & Fuel Skimming" },
                        { title: "Efficiency", icon: Users, desc: "Fleet Heatmap & Compliance Automation" },
                        { title: "Asset Protection", icon: ShieldAlert, desc: "NFC Logged Repairs & Certified History" },
                        { title: "Safety", icon: Truck, desc: "Universal Rescue (Accra to Kumasi)" },
                    ].map((pillar, idx) => (
                        <div key={idx} className="glass-card p-8 flex flex-col gap-4 group cursor-default hover:bg-white/[0.05] transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <pillar.icon className="w-5 h-5 text-emerald" />
                            </div>
                            <h4 className="font-bold text-white text-lg">{pillar.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
