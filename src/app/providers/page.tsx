import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("For Service Providers", "Learn how roadside mechanics and automotive service providers can connect with Motor Ambos drivers and fleets.", "/providers");

const listingDetails = [
    { icon: MapPin, title: "Where you can help", description: "Tell us the areas you serve and the types of roadside work you take on." },
    { icon: Phone, title: "How drivers reach you", description: "A listing can include your phone number, hours, and call-out fee when supplied." },
    { icon: MessageCircle, title: "The next step is yours", description: "Drivers contact you directly to confirm availability, the work, and the full price." },
];

export default function ProvidersPage() {
    return (
        <main className="base-landing marketing-motion min-h-screen overflow-x-hidden bg-white text-[#171717]">
            <MarketingMotion />
            <LandingNav />

            <section className="relative overflow-hidden px-5 pb-16 pt-32 text-center sm:px-8 sm:pb-20 lg:px-16 lg:pt-36 lg:text-left">
                <PixelCluster className="left-[4%] top-[24%] opacity-45" heights={[12, 25, 44, 69, 81, 58, 30]} />
                <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:gap-6">
                    <div>
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">For roadside providers</p>
                        <h1 className="text-[40px] font-normal leading-[1.07] tracking-[-0.045em] sm:text-[56px] lg:text-[68px]">Be easier to find when a driver needs you.</h1>
                        <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.5] text-[#777] sm:text-[19px] lg:mx-0">Motor Ambos is mapping independent mechanics and roadside specialists by the areas they serve. Give drivers a clearer way to see your services and get in touch.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                            <a href="mailto:support@motorambos.com?subject=Roadside%20provider%20listing" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-6 text-[16px] text-white transition-colors hover:bg-[#0606D8]">Contact the team <ArrowRight className="h-4 w-4" /></a>
                            <Link href="/roadside-mechanics" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E8E8E8] px-6 text-[16px] transition-colors hover:bg-[#F8F8F8]">See the network</Link>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-[600px]">
                        <div aria-hidden="true" className="absolute inset-x-[16%] bottom-[14%] h-[46%] rounded-full bg-[#E9EBFF] opacity-50 blur-[65px]" />
                        <Image src="/images/roadside-cables.webp" alt="Blue and silver roadside jumper cables" width={900} height={717} priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 600px" className="relative h-auto w-full object-contain" />
                    </div>
                </div>
            </section>

            <section className="border-y border-[#EAEAEA] bg-[#F7F7F7] px-5 py-16 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">What a useful listing includes</p>
                    <h2 className="max-w-[700px] text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">The details a driver needs before making the call.</h2>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">
                        {listingDetails.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-[12px] border border-[#EAEAEA] bg-white p-6 sm:p-8"><Icon className="h-8 w-8 text-[#1111F6]" strokeWidth={1.6} /><h3 className="mt-8 text-[20px] tracking-[-0.03em]">{title}</h3><p className="mt-3 text-[16px] leading-[1.5] text-[#777]">{description}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
                    <div><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">How to join the map</p><h2 className="text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">Tell us about your roadside work.</h2><p className="mt-5 max-w-[520px] text-[16px] leading-[1.5] text-[#777]">Share your service area, hours, phone number, services, and call-out fee. The team can explain how the listing works and what information will be shown to drivers.</p><a href="mailto:support@motorambos.com?subject=Roadside%20provider%20listing" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#E7E7E7] px-6 text-[16px] transition-colors hover:bg-[#FAFAFA]">Ask about a listing <ArrowRight className="h-4 w-4 text-[#1111F6]" /></a></div>
                    <div className="overflow-hidden rounded-[16px] border border-[#E7E9F7] bg-[#F1F3FF] p-5"><Image src="/images/roadside-tow.webp" alt="A roadside tow truck helping a car" width={1400} height={700} sizes="(max-width: 1024px) 90vw, 550px" className="h-auto w-full object-contain" /></div>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
