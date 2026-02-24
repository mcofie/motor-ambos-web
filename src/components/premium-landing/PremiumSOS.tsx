"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function PremiumSOS() {
    return (
        <section className="py-24 relative overflow-hidden bg-black/40">
            <div className="absolute inset-0 sos-glow opacity-30" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center gap-10">
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-10 bg-red-500/10 blur-[60px] rounded-full group-hover:bg-red-500/20 transition-all duration-500" />
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-600 flex items-center justify-center border-[8px] border-red-900/40 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse hover:scale-110 transition-transform">
                        <Star fill="white" className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white">24/7 Emergency Rescue</h2>
                    <p className="text-xl text-red-50/60 max-w-xl mx-auto">
                        Flat Tire. Dead Battery. Overheating. Accident. <br />
                        One tap and help is on the way. Available via App and USSD.
                    </p>
                </div>

                <Button className="bg-white text-navy hover:bg-red-50 font-black rounded-full px-12 py-8 h-auto text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
                    Get Help Now
                </Button>
            </div>
        </section>
    );
}
