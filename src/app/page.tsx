import { PerkNavbar } from "@/components/perk-landing/PerkNavbar";
import { PerkHero } from "@/components/perk-landing/PerkHero";
import { PerkServices } from "@/components/perk-landing/PerkServices";
import { PerkBusiness } from "@/components/perk-landing/PerkBusiness";
import { PerkProviders } from "@/components/perk-landing/PerkProviders";
import { PerkNFC } from "@/components/perk-landing/PerkNFC";
import { PerkSOS } from "@/components/perk-landing/PerkSOS";
import { PerkFAQ } from "@/components/perk-landing/PerkFAQ";
import { PerkFinalCTA, PerkFooter } from "@/components/perk-landing/PerkFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen selection:bg-lime/30">
            <PerkNavbar />

            <main className="flex flex-col">
                <PerkHero />
                <PerkServices />
                <PerkBusiness />
                <PerkProviders />
                <PerkNFC />
                <PerkSOS />
                <PerkFAQ />
                <PerkFinalCTA />
            </main>

            <PerkFooter />
        </div>
    );
}