"use client";

import { ServicePortalForm } from "@/components/public/ServicePortalForm";
import { Metadata } from "next";

// Note: metadata cannot be exported from a client component.
// I will move it to a separate layout or just have it in the page if it were a server component.
// Since the Wizard needs client state, I'll keep the page simple.

export default function ServiceLogPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            {/* --- Ambient Background (Matches HeroSection / Help Page) --- */}
            <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[140px] opacity-40" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `url('/grid-pattern.svg')`,
                        maskImage: 'radial-gradient(ellipse_at_center, white, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse_at_center, white, transparent 70%)'
                    }}
                />
            </div>

            <ServicePortalForm />
        </div>
    );
}
