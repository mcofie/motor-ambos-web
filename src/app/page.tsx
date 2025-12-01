import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { MembershipSection } from "@/components/landing/MembershipSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { AppShowcaseSection } from "@/components/landing/AppShowcaseSection";
import { CTAStrip } from "@/components/landing/CTAStrip";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
    title: "Motor Ambos — The Modern Roadside Network",
    description:
        "On-demand car care and roadside assistance. Fuel, wash, oil, tyres, battery — delivered to your location.",
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar />

            <main className="flex flex-col">
                <HeroSection />
                <ServicesSection />
                <MembershipSection />
                <WhyUsSection />
                <AppShowcaseSection />
                <CTAStrip />
            </main>

            <Footer />
        </div>
    );
}