"use client";

import { Button } from "@/components/ui/button";
import { Zap, Phone, ShieldIcon, MapPin, Truck, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RoadsideSection() {
    return (
        <section id="roadside" className="py-24 bg-background relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
                            <Zap className="h-3.5 w-3.5 fill-primary" />
                            <span>Available 24/7 across Greater Accra</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                            Stuck? <br />
                            <span className="text-primary">Don't Panic.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
                            Whether it's a flat tyre, empty tank, or a dead battery, we're just minutes away.
                            Our decentralized network connects you to the closest verified professional instantly.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            {[
                                { title: "USSD Fallback", text: "No data? No problem. Trigger rescue via USSD fallback printed on your card.", icon: Phone },
                                { title: "ICE Safety Beacon", text: "Passive safety feature for first responders to access critical medical data.", icon: ShieldIcon },
                                { title: "Smart Matching", text: "Our algorithm finds the nearest active unit to minimize your wait time.", icon: MapPin },
                                { title: "Verified Towing", text: "Secure towing to your preferred mechanic or any verified partner garage.", icon: Truck }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="h-12 px-8 font-bold bg-primary text-primary-foreground group">
                                <Link href="/help">
                                    Request Help Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8 font-bold border-border backdrop-blur-sm">
                                <Link href="/roadside-assistance">Full Rate Card</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Mock Emergency Interface */}
                        <div className="relative mx-auto w-full max-w-[320px] aspect-[9/19] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-900 shadow-2xl p-6 flex flex-col pt-12">
                            <div className="h-1 w-12 bg-zinc-800 rounded-full mx-auto mb-8" />

                            <div className="space-y-6 flex-grow">
                                <div className="text-center space-y-2">
                                    <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                                        <AlertCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl">Emergency Rescue</h3>
                                    <p className="text-zinc-500 text-xs">Finding nearest providers...</p>
                                </div>

                                <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-4">
                                    {[
                                        { name: "Isaac K. (Towing)", dist: "0.8km away", time: "4 mins" },
                                        { name: "Emmanuel S. (Tyre)", dist: "1.2km away", time: "7 mins" }
                                    ].map((m, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-zinc-200 text-xs font-bold">{m.name}</div>
                                                <div className="text-zinc-500 text-[10px]">{m.dist}</div>
                                            </div>
                                            <div className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold">{m.time}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">Or use USSD</div>
                                    <div className="text-2xl font-mono text-center text-primary font-bold">*920*48#</div>
                                </div>
                            </div>

                            <div className="h-1 w-1/3 bg-zinc-800 rounded-full mx-auto mt-auto mb-2" />

                            {/* Decorative Background Glow for the 'Phone' */}
                            <div className="absolute inset-0 bg-red-500/10 blur-[60px] -z-10 rounded-full" />
                        </div>

                        {/* Background blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-primary/20 blur-[120px] rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
