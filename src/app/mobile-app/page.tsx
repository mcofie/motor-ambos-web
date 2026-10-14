import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Bell,
    Car,
    Check,
    ChevronRight,
    ClipboardList,
    Fuel,
    IdCard,
    LifeBuoy,
    Nfc,
    ShieldCheck,
    Smartphone,
    Truck,
    Wrench,
} from "lucide-react";
import { BrandMark, LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
import SmartCardStack, { SmartCard } from "@/components/landing-home/SmartCardStack";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("App & Smart Card", "Keep your car's papers, service log, fuel log, and driver details in the Motor Ambos app, then link a Smart Card so anyone you choose can tap to see the car's record.", "/mobile-app");

const overview = [
    { number: "01", label: "Papers" },
    { number: "02", label: "Service log" },
    { number: "03", label: "Fuel log" },
    { number: "04", label: "Smart Card" },
];

function DriverVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[350px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEEEFF] text-[15px] text-[#1111F6]">AM</span>
                    <div><span className="block text-[16px] font-medium">Ama Mensah</span><span className="text-[12px] text-[#777]">Main driver</span></div>
                </div>
                <div className="divide-y divide-[#EFEFEF] text-[13px]">
                    <div className="flex justify-between py-2.5"><span className="text-[#777]">Phone</span><span>+233 55 000 0000</span></div>
                    <div className="flex justify-between py-2.5"><span className="text-[#777]">Licence</span><span className="flex items-center gap-1.5 text-[#277E62]"><Check className="h-3.5 w-3.5" />Valid</span></div>
                    <div className="flex justify-between py-2.5"><span className="text-[#777]">Drives</span><span>GW-1234-22</span></div>
                </div>
            </div>
        </div>
    );
}

function PapersVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[350px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center justify-between"><span className="text-[15px] font-medium">Car papers</span><Bell className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[13px]"><span>Insurance</span><span className="flex items-center gap-1.5 text-[#277E62]"><Check className="h-3.5 w-3.5" />Ready</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[13px]"><span>Roadworthy</span><span className="text-[#A66E21]">Renew in 12 days</span></div>
                </div>
                <p className="mt-4 rounded-lg border border-[#EEEEEE] px-4 py-3 text-[12px] text-[#666]">Reminder sent by text message</p>
            </div>
        </div>
    );
}

function ServiceVisual() {
    const entries = [
        { title: "Oil change", meta: "84,200 km · Abossey Okai", tag: "Approved" },
        { title: "Brake pads", meta: "79,950 km · East Legon", tag: "Approved" },
        { title: "Battery replaced", meta: "75,300 km · Added by you", tag: "" },
    ];
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[360px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-3 flex items-center justify-between"><span className="text-[15px] font-medium">Service log</span><Wrench className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="divide-y divide-[#EFEFEF]">
                    {entries.map((entry) => (
                        <div key={entry.title} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                            <div><span className="block">{entry.title}</span><span className="text-[11px] text-[#888]">{entry.meta}</span></div>
                            {entry.tag && <span className="flex shrink-0 items-center gap-1 text-[11px] text-[#277E62]"><ShieldCheck className="h-3.5 w-3.5" />{entry.tag}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FuelVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[350px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center justify-between"><div><span className="block text-[12px] text-[#777]">This month</span><span className="text-[20px] font-medium tracking-[-0.03em]">GH₵1,240</span></div><Fuel className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="divide-y divide-[#EFEFEF] text-[13px]">
                    <div className="flex justify-between py-2.5"><span>32 L · Full tank</span><span className="text-[#777]">GH₵480</span></div>
                    <div className="flex justify-between py-2.5"><span>25 L · Top-up</span><span className="text-[#777]">GH₵375</span></div>
                    <div className="flex justify-between py-2.5"><span>26 L · Full tank</span><span className="text-[#777]">GH₵385</span></div>
                </div>
            </div>
        </div>
    );
}

function CardVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#F1F3FF] p-5 sm:p-8">
            <div className="smart-card-slot w-full max-w-[300px] [container-type:inline-size]">
                <div className="smart-card-float"><SmartCard skin="squiggle" /></div>
            </div>
        </div>
    );
}

function RoadsideVisual() {
    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#F1F3FF] p-3">
            <Image src="/images/roadside-car.webp" alt="A car with a flat tyre" width={900} height={718} sizes="(max-width: 768px) 90vw, 520px" className="h-full w-full max-w-[480px] object-contain" />
        </div>
    );
}

const features = [
    { icon: IdCard, title: "Driver details and licence", description: "Keep each driver's name, phone number, and licence details with the car they drive. Fleets can see who is behind every wheel.", visual: <DriverVisual /> },
    { icon: ShieldCheck, title: "Insurance and roadworthy", description: "Store the car's current papers and get a text message reminder before anything expires.", visual: <PapersVisual /> },
    { icon: Wrench, title: "A service log you can trust", description: "Record every service and repair with the date, mileage, workshop, and notes. A mechanic can add the work too, once you approve it with a code sent to your phone.", visual: <ServiceVisual /> },
    { icon: Fuel, title: "Fuel log", description: "Note each fill-up with litres, cost, mileage, and station, and see what the car really costs to run.", visual: <FuelVisual /> },
    { icon: Nfc, title: "Connect a Smart Card", description: "Link an NFC Smart Card to the car from the app. One tap with a phone opens the car's record.", visual: <CardVisual /> },
    { icon: LifeBuoy, title: "Roadside help, ready to go", description: "If the car stops, start a roadside request with its details already filled in and contact a nearby provider.", visual: <RoadsideVisual /> },
];

const cardSteps = [
    { number: "01", title: "Link it in the app", detail: "Add your car, then connect the Smart Card to it. The card now points to that car's record." },
    { number: "02", title: "Keep it with the car", detail: "Leave it in the glovebox or with the driver. It needs no battery and no charging." },
    { number: "03", title: "Tap to see the car", detail: "A mechanic, buyer, or fleet manager taps the card with a phone to open the car's details and service history." },
];

const audiences = [
    { icon: Car, title: "Car owners", description: "Never dig for papers again, and show a full service history when it is time to sell." },
    { icon: Truck, title: "Fleets", description: "Every vehicle, driver, paper, and fuel cost in one place, with drivers keeping records up to date from their phones." },
    { icon: Wrench, title: "Mechanics", description: "Tap the card to see what was done before, then log today's work for the owner to approve." },
];

const questions = [
    { question: "Is the app free?", answer: "Yes. Individual drivers can use the app at no cost. If you ask Motor Ambos to handle a renewal, a renewal fee may apply." },
    { question: "Do I need a Smart Card to use the app?", answer: "No. The app keeps your car's record on its own. The Smart Card is an optional, faster way to open that record from the car." },
    { question: "Which phones can read the card?", answer: "Most recent Android phones with NFC switched on, and iPhone XS or newer. Hold the top of the phone near the card." },
    { question: "Who can add to my service log?", answer: "You can, and so can a mechanic you approve. Each mechanic entry needs the code sent to your phone before it is saved." },
];

export default function MobileAppPage() {
    return (
        <main className="base-landing marketing-motion min-h-screen overflow-x-hidden bg-white text-[#171717] selection:bg-[#DCDCFD]">
            <MarketingMotion />
            <LandingNav />

            <section className="relative overflow-hidden px-5 pb-14 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-32 lg:px-16 lg:pt-36 lg:text-left">
                <PixelCluster className="left-[3%] top-[30%] opacity-45" heights={[10, 18, 31, 15, 42, 24, 12]} />
                <PixelCluster className="right-[6%] top-[22%] opacity-50" heights={[16, 29, 48, 72, 83, 62, 33, 15]} />
                <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
                    <div className="order-2 lg:order-1">
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Motor Ambos app + Smart Card</p>
                        <h1 className="text-[38px] font-normal leading-[1.07] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]">Everything about your car, in one place.</h1>
                        <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.5] text-[#777] sm:mt-6 sm:text-[19px] lg:mx-0">The app keeps your papers, service log, fuel log, and driver details together. Link a Smart Card and anyone you choose can tap to see the car&apos;s record.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                            <Link href="/login" className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#1111F6] px-6 text-[16px] text-white transition-colors hover:bg-[#0606D8] sm:w-auto"><BrandMark inverted />Get started <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                            <Link href="#smart-card" className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#E8E8E8] px-6 text-[16px] transition-colors hover:bg-[#F8F8F8] sm:w-auto">How the card works</Link>
                        </div>
                    </div>
                    <div className="relative order-1 mx-auto w-full max-w-[640px] lg:order-2">
                        <div aria-hidden="true" className="absolute inset-x-[15%] bottom-[15%] h-[45%] rounded-full bg-[#E9EBFF] opacity-50 blur-[65px]" />
                        <Image src="/images/smart-card-vehicle.webp" alt="A blue Motor Ambos Smart Card beside a car" width={1200} height={800} priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 640px" className="relative h-auto w-full object-contain" />
                    </div>
                </div>
            </section>

            <section className="bg-[#F7F7F7] px-5 py-16 text-center sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <h2 className="text-[30px] font-normal leading-[1.1] tracking-[-0.035em] md:text-[36px]">One record that follows the car.</h2>
                    <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-[#777]">Every paper, service, and fill-up stays with the vehicle, whoever is driving it.</p>
                    <div className="mt-12 grid grid-cols-2 gap-y-8 md:mt-14 md:grid-cols-4 md:gap-y-0">
                        {overview.map((item, index) => (
                            <div key={item.number} className={index === 0 ? "px-4" : index === 2 ? "px-4 md:border-l md:border-[#E4E4E4]" : "border-l border-[#E4E4E4] px-4"}>
                                <div className="text-[30px] tracking-[-0.045em] md:text-[36px]">{item.number}</div>
                                <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[#777] md:text-[12px]">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="scroll-mt-20 px-5 py-16 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="mb-12 max-w-[700px]">
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">What the app keeps</p>
                        <h2 className="text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">The details that matter, <span className="text-[#898989]">recorded as they happen.</span></h2>
                    </div>
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-14">
                        {features.map(({ icon: Icon, title, description, visual }) => (
                            <article key={title}>
                                <div className="h-[220px] overflow-hidden rounded-[12px] border border-[#ECECEC] sm:h-[260px] md:h-[310px]">{visual}</div>
                                <h3 className="mt-6 flex items-center gap-2.5 text-[20px] font-normal tracking-[-0.025em]"><Icon className="h-5 w-5 shrink-0 text-[#1111F6]" strokeWidth={1.8} />{title}</h3>
                                <p className="mt-2 max-w-[520px] text-[16px] leading-[1.45] text-[#777]">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="smart-card" className="scroll-mt-20 border-y border-[#EAEAEA] bg-[#FCFCFC] px-5 py-16 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                        <div className="max-w-[560px]">
                            <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">The Smart Card</p>
                            <h2 className="text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">Tap the card. <span className="text-[#898989]">See the car.</span></h2>
                            <p className="mt-5 text-[16px] leading-[1.5] text-[#777]">A Smart Card is an NFC card linked to one car. It turns the record in your app into something you can hand to a mechanic or a buyer in a second. Drivers and fleets each get a card for every car.</p>
                            <a href="mailto:support@motorambos.com?subject=Motor%20Ambos%20Smart%20Card" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#E7E7E7] bg-white px-5 text-[16px] transition-colors hover:bg-[#FAFAFA]">Ask about a card <ArrowRight className="h-4 w-4 text-[#1111F6]" /></a>
                        </div>
                        <div className="px-2 py-4 sm:px-6"><SmartCardStack /></div>
                    </div>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">
                        {cardSteps.map((step) => (
                            <article key={step.number} className="rounded-[12px] border border-[#E9E9E9] bg-white p-6 sm:p-8">
                                <span className="text-[13px] text-[#1111F6]">{step.number}</span>
                                <h3 className="mt-8 text-[21px] tracking-[-0.03em] md:mt-10">{step.title}</h3>
                                <p className="mt-3 text-[16px] leading-[1.5] text-[#777]">{step.detail}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="max-w-[640px]">
                        <p className="mb-5 text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">Who it helps</p>
                        <h2 className="text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">Useful on both sides <span className="text-[#898989]">of the bonnet.</span></h2>
                    </div>
                    <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
                        {audiences.map(({ icon: Icon, title, description }) => (
                            <article key={title} className="rounded-[12px] bg-[#F7F7F7] p-6 sm:p-8">
                                <Icon className="h-8 w-8 text-[#1111F6]" strokeWidth={1.6} />
                                <h3 className="mt-8 text-[20px] tracking-[-0.03em]">{title}</h3>
                                <p className="mt-3 text-[16px] leading-[1.5] text-[#777]">{description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="questions" className="scroll-mt-20 px-5 pb-16 sm:px-8 md:pb-28 lg:px-16">
                <div className="mx-auto max-w-[1136px] border-t border-[#ECECEC] pt-14 sm:pt-20">
                    <h2 className="mb-8 text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">Common questions.</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {questions.map(({ question, answer }) => (
                            <article key={question} className="rounded-[12px] border border-[#ECECEC] p-6">
                                <h3 className="flex items-start gap-3 text-[18px] font-normal tracking-[-0.025em]"><ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-[#1111F6]" strokeWidth={1.7} />{question}</h3>
                                <p className="mt-3 text-[15px] leading-[1.5] text-[#777]">{answer}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#1111F6] px-5 py-20 text-white sm:px-8 md:py-24 lg:px-16">
                <PixelCluster className="right-[8%] bottom-[-10%] opacity-55" heights={[24, 55, 88, 123, 156, 120, 75, 35]} />
                <div className="relative z-10 mx-auto max-w-[1136px]">
                    <h2 className="text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">Start your car&apos;s record.</h2>
                    <p className="mt-4 max-w-[460px] text-[16px] leading-[1.45] text-white/70">Add your car, upload its papers, and log the next service. Add a Smart Card whenever you are ready.</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-[#171717] transition-colors hover:bg-[#F1F1F1]"><BrandMark />Get started</Link>
                        <Link href="/business" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/20 px-5 text-[16px] text-white transition-colors hover:bg-white/30"><Smartphone className="h-4 w-4" />Explore fleets</Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
