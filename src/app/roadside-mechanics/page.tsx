import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
import MechanicNetworkMap from "@/components/landing-home/MechanicNetworkMap";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("Roadside Mechanic Network", "Stuck on the road? Find independent roadside mechanics near you, compare distance and listed call-out fees, then call or message directly.", "/roadside-mechanics");

const helpTypes = [
    { title: "Mechanical trouble", detail: "When the car needs a mechanic at the roadside.", illustration: "/images/roadside-engine.webp" },
    { title: "Battery problems", detail: "For a flat battery or a car that will not start.", illustration: "/images/roadside-cables.webp" },
    { title: "Flat tyre", detail: "Find help to change or inflate a tyre.", illustration: "/images/roadside-car.webp" },
    { title: "Electrical issues", detail: "For wiring and other electrical faults.", illustration: "/images/roadside-electrical.webp" },
    { title: "Out of fuel", detail: "Find assistance when the tank runs dry.", illustration: "/images/roadside-fuel.webp" },
    { title: "Towing", detail: "Move your car when it cannot be driven.", illustration: "/images/roadside-tow.webp" },
];

const steps = [
    { number: "01", title: "Tell us what is wrong", detail: "Choose the kind of help you need and add the car details you know. A QR sticker can fill in the car for you." },
    { number: "02", title: "Share your location", detail: "Your location helps us show listed providers nearby. You decide when to share it." },
    { number: "03", title: "Choose who to contact", detail: "Compare distance and listed call-out fees, then call or message a mechanic to confirm availability." },
];

export default function RoadsideMechanicsPage() {
    return (
        <main className="base-landing marketing-motion min-h-screen overflow-x-hidden bg-white text-[#171717] selection:bg-[#DCDCFD]">
            <MarketingMotion />
            <LandingNav />

            <section className="relative overflow-hidden px-5 pb-20 pt-24 sm:px-8 sm:pt-32 md:pb-28 md:pt-[176px] lg:px-16">
                <PixelCluster className="right-[5%] top-[20%] opacity-45" heights={[14, 27, 42, 67, 83, 70, 46, 23]} />
                <div className="relative mx-auto grid max-w-[1136px] items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
                    <div className="order-2 lg:order-1">
                        <p className="mb-6 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Roadside mechanic network</p>
                        <h1 className="max-w-[680px] text-[42px] font-normal leading-[1.06] tracking-[-0.045em] sm:text-[56px] md:text-[68px]">Stuck? Find a mechanic nearby.</h1>
                        <p className="mt-6 max-w-[540px] text-[18px] leading-[1.45] text-[#777] md:text-[20px]">Motor Ambos helps you find independent roadside mechanics and other providers near your location. Compare distance and listed call-out fees before you call.</p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/help" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-6 text-[16px] text-white transition-colors hover:bg-[#0606D8]">Find roadside help <ArrowRight className="h-4 w-4" /></Link>
                            <Link href="#our-approach" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E7E7E7] px-6 text-[16px] transition-colors hover:bg-[#FAFAFA]">The idea behind it</Link>
                        </div>
                    </div>
                    <div className="order-1 min-w-0 lg:order-2"><MechanicNetworkMap /></div>
                </div>
            </section>

            <section id="our-approach" className="scroll-mt-20 border-y border-[#EAEAEA] bg-[#FCFCFC] px-5 py-20 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
                    <div>
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Why we are building this</p>
                        <h2 className="text-[34px] leading-[1.1] tracking-[-0.04em] md:text-[46px]">Help already exists on the road. <span className="text-[#898989]">Finding it is the hard part.</span></h2>
                        <p className="mt-6 max-w-[520px] text-[17px] leading-[1.55] text-[#666]">Independent mechanics and roadside specialists work in the places drivers travel every day. When a car breaks down, that local knowledge is scattered across phone contacts, referrals, and roadside signs. We are bringing it into one place, beginning with the mechanics we map on the ground.</p>
                    </div>
                    <div className="self-center rounded-[16px] bg-[#1111F6] p-7 text-white sm:p-9">
                        <p className="text-[12px] uppercase tracking-[0.11em] text-white/65">Our working theory</p>
                        <p className="mt-6 text-[25px] leading-[1.25] tracking-[-0.035em] sm:text-[30px]">A nearby mechanic, a visible call-out fee, and a simple way to make contact can take uncertainty out of a roadside breakdown.</p>
                        <div className="mt-9 grid gap-3 border-t border-white/25 pt-6 text-[14px] text-white/85 sm:grid-cols-3"><span>Closer to the driver</span><span>Price visible earlier</span><span>Choice stays with the driver</span></div>
                    </div>
                </div>
            </section>

            <section className="px-5 py-20 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="max-w-[720px]"><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">How we build the network</p><h2 className="text-[32px] leading-[1.12] tracking-[-0.04em] md:text-[42px]">Local knowledge, made <span className="text-[#898989]">useful at the roadside.</span></h2></div>
                    <div className="mt-12 divide-y divide-[#EAEAEA] border-y border-[#EAEAEA]">
                        <div className="grid gap-3 py-7 sm:grid-cols-[72px_0.8fr_1.2fr] sm:items-start sm:gap-8"><span className="text-[13px] text-[#1111F6]">01 / Map</span><h3 className="text-[21px] tracking-[-0.03em]">Start with mechanics already there.</h3><p className="text-[16px] leading-[1.5] text-[#777]">We identify independent mechanics and roadside specialists by the areas they serve, so a search begins with local options.</p></div>
                        <div className="grid gap-3 py-7 sm:grid-cols-[72px_0.8fr_1.2fr] sm:items-start sm:gap-8"><span className="text-[13px] text-[#1111F6]">02 / List</span><h3 className="text-[21px] tracking-[-0.03em]">Make the useful details visible.</h3><p className="text-[16px] leading-[1.5] text-[#777]">A listing can show the provider’s location, services, phone number, and call-out fee where supplied. A verification badge appears only when that status applies.</p></div>
                        <div className="grid gap-3 py-7 sm:grid-cols-[72px_0.8fr_1.2fr] sm:items-start sm:gap-8"><span className="text-[13px] text-[#1111F6]">03 / Connect</span><h3 className="text-[21px] tracking-[-0.03em]">Let the driver choose.</h3><p className="text-[16px] leading-[1.5] text-[#777]">Drivers compare nearby listings, then call or message directly to confirm availability, explain the problem, and agree on the next step.</p></div>
                    </div>
                    <div className="mt-10 grid gap-5 rounded-[14px] border border-[#E3E3FF] bg-[#F7F7FF] p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:gap-12"><div><p className="text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">What we are building next</p><h3 className="mt-3 text-[23px] leading-[1.2] tracking-[-0.035em]">Close the loop after the call.</h3></div><p className="text-[16px] leading-[1.55] text-[#666]">A useful network has to learn whether help actually arrived and whether the price was fair. We want driver check-ins, job feedback, and fresher availability information to make future choices more reliable. These follow-ups are part of the roadmap, not the current request flow.</p></div>
                </div>
            </section>

            <section id="how-it-works" className="scroll-mt-20 bg-[#F7F7F7] px-5 py-20 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="max-w-[640px]"><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">How it works</p><h2 className="text-[32px] leading-[1.12] tracking-[-0.04em] md:text-[42px]">Three steps to <span className="text-[#898989]">someone you can contact.</span></h2></div>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">
                        {steps.map((step) => <article key={step.number} className="rounded-[12px] border border-[#E9E9E9] bg-white p-6 sm:p-8"><span className="text-[13px] text-[#1111F6]">{step.number}</span><h3 className="mt-10 text-[21px] tracking-[-0.03em]">{step.title}</h3><p className="mt-3 text-[16px] leading-[1.5] text-[#777]">{step.detail}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="px-5 py-20 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Types of help</p><h2 className="max-w-[610px] text-[32px] leading-[1.12] tracking-[-0.04em] md:text-[42px]">One place to start, <span className="text-[#898989]">whatever went wrong.</span></h2></div><Link href="/help" className="inline-flex h-12 items-center gap-2 self-start rounded-full border border-[#E7E7E7] px-5 text-[16px] transition-colors hover:bg-[#FAFAFA] md:self-auto">Find roadside help <ArrowRight className="h-4 w-4 text-[#1111F6]" /></Link></div>
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{helpTypes.map(({ title, detail, illustration }) => <article key={title} className="rounded-[12px] border border-[#EAEAEA] p-5 sm:p-6"><div className="flex h-[128px] items-center justify-center overflow-hidden rounded-[10px] bg-[#F1F3FF]"><Image src={illustration} alt="" width={440} height={260} sizes="(max-width: 640px) 90vw, 340px" className="h-full w-full object-contain p-2" /></div><h3 className="mt-5 text-[19px] tracking-[-0.03em]">{title}</h3><p className="mt-2 text-[15px] leading-[1.45] text-[#777]">{detail}</p></article>)}</div>
                </div>
            </section>

            <section className="border-y border-[#EAEAEA] bg-[#FCFCFC] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16"><div><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Before you choose</p><h2 className="text-[32px] leading-[1.12] tracking-[-0.04em] md:text-[42px]">Know who you are contacting.</h2><p className="mt-5 max-w-[360px] text-[16px] leading-[1.5] text-[#777]">These are independent providers. Speak to them to confirm they can come and agree on the work and full price before a repair starts.</p></div><div className="grid gap-7 sm:grid-cols-2"><div><MapPin className="h-6 w-6 text-[#1111F6]" /><h3 className="mt-4 text-[18px]">See what is nearby</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">Listings show the provider’s distance and location details.</p></div><div><ShieldCheck className="h-6 w-6 text-[#1111F6]" /><h3 className="mt-4 text-[18px]">Review the details</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">See a verification badge where applicable and a call-out fee when the provider has listed one.</p></div><div><Phone className="h-6 w-6 text-[#1111F6]" /><h3 className="mt-4 text-[18px]">Call directly</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">Ask whether the mechanic is available, describe the problem, and confirm the call-out fee.</p></div><div><MessageCircle className="h-6 w-6 text-[#1111F6]" /><h3 className="mt-4 text-[18px]">Or send a message</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">Review a message with your car and location details before opening your messaging app.</p></div></div></div>
            </section>

            <section className="bg-[#F7F7F7] px-5 py-20 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto max-w-[1136px]"><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">How we will judge the idea</p><h2 className="max-w-[720px] text-[32px] leading-[1.12] tracking-[-0.04em] md:text-[42px]">A good listing matters when <span className="text-[#898989]">help actually arrives.</span></h2><div className="mt-10 grid gap-4 md:grid-cols-3"><div className="border-t border-[#DCDCDC] pt-5"><h3 className="text-[19px]">Did help arrive?</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">The first measure is whether the driver reached a mechanic who came to them.</p></div><div className="border-t border-[#DCDCDC] pt-5"><h3 className="text-[19px]">Was the price fair?</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">We want to compare what was listed with what the driver actually paid.</p></div><div className="border-t border-[#DCDCDC] pt-5"><h3 className="text-[19px]">Would they use it again?</h3><p className="mt-2 text-[15px] leading-[1.5] text-[#777]">Repeat use would tell us the network helped when it mattered.</p></div></div></div>
            </section>

            <section className="px-5 py-20 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] items-center gap-10 rounded-[16px] border border-[#EAEAEA] bg-white p-7 sm:p-10 md:grid-cols-[1fr_auto] md:p-12">
                    <div><p className="mb-4 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">For roadside mechanics</p><h2 className="text-[28px] leading-[1.15] tracking-[-0.04em] md:text-[34px]">Work on the road? Let’s talk.</h2><p className="mt-4 max-w-[620px] text-[16px] leading-[1.5] text-[#777]">Tell us your service area, hours, phone number, services, and call-out fee. We’ll explain how a Motor Ambos listing works before adding your details.</p></div>
                    <Link href="/providers" className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full border border-[#E7E7E7] px-5 text-[16px] transition-colors hover:bg-[#FAFAFA] md:self-center">Join as a mechanic <ArrowRight className="h-4 w-4 text-[#1111F6]" /></Link>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#1111F6] px-5 py-20 text-white sm:px-8 md:py-24 lg:px-16"><PixelCluster className="right-[9%] top-[8%] opacity-60" heights={[20, 45, 75, 102, 79, 51, 22]} /><div className="relative mx-auto max-w-[1136px]"><h2 className="max-w-[650px] text-[34px] leading-[1.1] tracking-[-0.04em] md:text-[44px]">Need help with your car right now?</h2><p className="mt-4 max-w-[540px] text-[16px] leading-[1.5] text-white/75">Start a roadside request. You can use the help page without signing in.</p><Link href="/help" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[16px] text-[#171717] transition-colors hover:bg-[#F0F0F0]">Find roadside help <ArrowRight className="h-4 w-4" /></Link></div></section>

            <LandingFooter />
        </main>
    );
}
