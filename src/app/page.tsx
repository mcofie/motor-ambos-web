import {
    StripeNavbar,
    StripeHero,
    StripeServiceEcosystem,
    StripeB2CFeatureGrid,
    StripeBusinessInfrastructure,
    StripeNFCCardSection,
    StripeSupportSection,
    StripeRoadAssistance,
    StripeFooter,
} from "@/components/stripe-landing/Sections";
import {
    ImagePlaceholder
} from "@/components/stripe-landing/UIMocks";

export default function LandingPage() {
    return (
        <main className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-[#00C767]/20 selection:text-[#171717]">
            <StripeNavbar />

            {/* Hero & Identity Layer */}
            <StripeHero />

            {/* Provider Ecosystem Grid */}
            <StripeServiceEcosystem />

            {/* B2C: The Digital Passport */}
            <StripeB2CFeatureGrid />

            {/* B2B: Motor Ambos for Business */}
            <StripeBusinessInfrastructure />

            {/* Hardened Trust: Vector & Onyx NFC Cards */}
            <StripeNFCCardSection />

            {/* Financial Infrastructure & Marketplace Savings */}
            <StripeSupportSection />

            {/* Road Assistance Feature */}
            <StripeRoadAssistance />

            <StripeFooter />
        </main>
    );
}