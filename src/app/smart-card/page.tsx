import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, QrCode, Wrench } from "lucide-react";
import { LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("Smart Car Card", "Connect a Motor Ambos car card to your vehicle's digital details and service history.", "/smart-card");

const details = [
    { icon: FileText, title: "Papers in one place", description: "Add your insurance and roadworthy documents to your vehicle record." },
    { icon: Wrench, title: "A record of work done", description: "Keep service and repair entries connected to the car they belong to." },
    { icon: QrCode, title: "A quick way in", description: "A linked card or QR sticker can open the vehicle page when someone needs its details." },
];

export default function SmartCardPage() {
    return (
        <main className="base-landing marketing-motion min-h-screen overflow-x-hidden bg-white text-[#171717]">
            <MarketingMotion />
            <LandingNav />

            <section className="relative overflow-hidden px-5 pb-16 pt-32 text-center sm:px-8 sm:pb-20 lg:px-16 lg:pt-36 lg:text-left">
                <PixelCluster className="right-[6%] top-[20%] opacity-45" heights={[16, 29, 48, 72, 83, 62, 33, 15]} />
                <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-6">
                    <div>
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Motor Ambos Smart Card</p>
                        <h1 className="text-[40px] font-normal leading-[1.07] tracking-[-0.045em] sm:text-[56px] lg:text-[68px]">Your car, one connected record.</h1>
                        <p className="mx-auto mt-6 max-w-[570px] text-[17px] leading-[1.5] text-[#777] sm:text-[19px] lg:mx-0">Keep the important details with the vehicle. A linked card gives someone a simple way to open its Motor Ambos page when you choose to share it.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                            <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-6 text-[16px] text-white transition-colors hover:bg-[#0606D8]">Add your car <ArrowRight className="h-4 w-4" /></Link>
                            <Link href="/help" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E8E8E8] px-6 text-[16px] transition-colors hover:bg-[#F8F8F8]">Roadside help</Link>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-[650px]">
                        <div aria-hidden="true" className="absolute inset-x-[15%] bottom-[15%] h-[45%] rounded-full bg-[#E9EBFF] opacity-50 blur-[65px]" />
                        <Image src="/images/smart-card-vehicle.webp" alt="Illustration of a blue car card beside a vehicle" width={1200} height={800} priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 650px" className="relative h-auto w-full object-contain" />
                    </div>
                </div>
            </section>

            <section className="border-y border-[#EAEAEA] bg-[#F7F7F7] px-5 py-16 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">What stays connected</p>
                    <h2 className="max-w-[660px] text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">The useful details travel with the car.</h2>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">
                        {details.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-[12px] border border-[#EAEAEA] bg-white p-6 sm:p-8"><Icon className="h-8 w-8 text-[#1111F6]" strokeWidth={1.6} /><h3 className="mt-8 text-[20px] tracking-[-0.03em]">{title}</h3><p className="mt-3 text-[16px] leading-[1.5] text-[#777]">{description}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] items-center gap-10 md:grid-cols-[1fr_auto]">
                    <div><p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Start with your car</p><h2 className="text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">Build the record first.</h2><p className="mt-5 max-w-[620px] text-[16px] leading-[1.5] text-[#777]">Add your vehicle, upload its current papers, and log work as it happens. Ask the Motor Ambos team about a physical card for your car.</p></div>
                    <a href="mailto:support@motorambos.com?subject=Motor%20Ambos%20Smart%20Card" className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full border border-[#E7E7E7] px-6 text-[16px] transition-colors hover:bg-[#FAFAFA] md:self-center">Ask about a card <ArrowRight className="h-4 w-4 text-[#1111F6]" /></a>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
