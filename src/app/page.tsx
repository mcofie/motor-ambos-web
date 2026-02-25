import { Navbar } from "@/components/landing/Navbar";
import { PerkHero, PerkGrid } from "@/components/perk-landing/PerkHero";
import { PerkProblem, PerkBusiness, PerkTrust } from "@/components/perk-landing/PerkProblem";
import { PerkNFC } from "@/components/perk-landing/PerkNFC";
import { PerkProviders } from "@/components/perk-landing/PerkProviders";
import { PerkFinalCTA, PerkFooter } from "@/components/perk-landing/PerkFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white selection:bg-[#9FE870] selection:text-black">
            <Navbar />

            <main className="flex flex-col">
                <PerkHero />        {/* Centered Utility Hero */}
                <PerkGrid />        {/* The 4-Pillar Grid */}
                <PerkProblem />     {/* B2C Deep Dive */}
                <PerkBusiness />    {/* B2B Deep Dive */}
                <PerkProviders />   {/* Provider/Workshop Deep Dive */}
                <PerkNFC />         {/* NFC Protocol & Tiers */}
                <PerkTrust />       {/* Simple Stats/Network Trust */}
                <PerkFinalCTA />    {/* Bold dark CTA */}
            </main>

            <PerkFooter />
        </div>
    );
}