import { PerkNavbar } from "@/components/perk-landing/PerkNavbar";
import { PerkHero } from "@/components/perk-landing/PerkHero";
import { PerkTrust } from "@/components/perk-landing/PerkTrust";
import { PerkServices } from "@/components/perk-landing/PerkServices";
import { PerkNFC } from "@/components/perk-landing/PerkNFC";
import { PerkBusiness } from "@/components/perk-landing/PerkBusiness";
import { PerkProviders } from "@/components/perk-landing/PerkProviders";
import { PerkSOS } from "@/components/perk-landing/PerkSOS";
import { PerkFAQ } from "@/components/perk-landing/PerkFAQ";
import { PerkFinalCTA, PerkFooter } from "@/components/perk-landing/PerkFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen selection:bg-[#9FE870] selection:text-black">
            <PerkNavbar />

            <main className="flex flex-col">
                <PerkHero />
                <PerkTrust />
                <PerkServices />
                <PerkNFC />
                <PerkBusiness />
                <PerkProviders />
                <PerkSOS />
                <PerkFAQ />
                <PerkFinalCTA />
            </main>

            <PerkFooter />
        </div>
    );
}