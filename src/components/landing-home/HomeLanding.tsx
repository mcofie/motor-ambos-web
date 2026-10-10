"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    Bell,
    Car,
    Check,
    ChevronRight,
    CircleAlert,
    ClipboardCheck,
    MapPin,
    Menu,
    QrCode,
    Smartphone,
    Truck,
    Wrench,
    X,
} from "lucide-react";

const navigation = [
    { href: "/#how-it-works", label: "Drivers" },
    { href: "/business", label: "Fleets" },
    { href: "/help", label: "Roadside help" },
    { href: "/#questions", label: "Resources" },
];

export function LandingNav({ hideCta = false }: { hideCta?: boolean }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (!menuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        const closeOnDesktop = () => {
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        window.addEventListener("resize", closeOnDesktop);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
            window.removeEventListener("resize", closeOnDesktop);
        };
    }, [menuOpen]);

    useEffect(() => { setMenuOpen(false); }, [pathname]);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#EEEEEE] bg-white">
            <nav className="relative mx-auto flex h-16 max-w-[1536px] items-center justify-between px-5 sm:px-8 md:h-[76px] lg:px-16" aria-label="Main navigation">
                <Link href="/" aria-label="Motor Ambos home" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.035em] text-[#171717]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#1111F6] text-white"><Car className="h-[18px] w-[18px]" /></span>
                    <span className="md:hidden">Motor Ambos</span>
                </Link>

                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                    {navigation.map((link) => (
                        <Link key={link.label} href={link.href} className="text-[16px] font-normal text-[#171717] transition-colors hover:text-[#1111F6]">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {hideCta ? <span className="hidden text-[14px] text-[#777] md:block">Sign in</span> : <Link href="/login" className="group hidden h-[34px] items-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] font-normal text-white transition-colors hover:bg-[#0606D8] md:inline-flex">
                    Get started <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>}

                <button
                    type="button"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg border border-[#EAEAEA] text-[#171717] md:hidden"
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {menuOpen && (
                <div id="mobile-navigation" className="absolute inset-x-0 top-16 z-40 flex h-[calc(100dvh-64px)] flex-col overflow-y-auto border-t border-[#EEEEEE] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-5 md:hidden">
                    <nav aria-label="Mobile navigation" className="flex flex-col">
                        {navigation.map((link) => (
                            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} aria-current={(link.href === "/business" && pathname === "/business") || (link.href === "/help" && pathname === "/help") ? "page" : undefined} className="flex min-h-[68px] items-center justify-between border-b border-[#ECECEC] py-4 text-[20px] font-normal">
                                {link.label}<ArrowRight className="h-5 w-5 text-[#1111F6]" />
                            </Link>
                        ))}
                    </nav>
                    {!hideCta && <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[16px] text-white">
                        Get started <ChevronRight className="h-4 w-4" />
                    </Link>}
                </div>
            )}
        </header>
    );
}

export function PixelCluster({ className, heights }: { className: string; heights: number[] }) {
    const colors = ["#B6B1FF", "#D6B6FF", "#C6F1A6", "#F6D884", "#AAA6FF"];
    return (
        <div aria-hidden="true" className={["pointer-events-none absolute flex items-center gap-[5px]", className].join(" ")}>
            {heights.map((height, index) => (
                <span key={index} className="block w-[5px] rounded-[1px]" style={{ height, backgroundColor: colors[index % colors.length], opacity: index % 3 === 0 ? 0.52 : 0.78 }} />
            ))}
        </div>
    );
}

function Hero() {
    return (
        <section className="relative flex w-full flex-col items-center overflow-hidden bg-white px-5 pb-14 pt-32 text-center sm:h-[100svh] sm:min-h-[700px] sm:max-h-[1120px] sm:px-8 sm:pb-[205px] sm:pt-[198px] lg:min-h-[640px]">
            <PixelCluster className="left-[0.5%] top-[31%] rotate-[-8deg] opacity-60" heights={[10, 16, 7, 28, 15, 42, 24, 11, 31, 18, 47, 23, 12]} />
            <PixelCluster className="left-[33%] top-[22%] rotate-[-4deg] opacity-50" heights={[10, 18, 29, 14, 39, 18, 25, 12, 33, 16, 24, 9]} />
            <PixelCluster className="right-[2%] top-[37%] rotate-[5deg] opacity-60" heights={[12, 20, 33, 18, 43, 25, 13, 39, 20, 31, 15]} />
            <PixelCluster className="right-[21%] top-[41%] opacity-65" heights={[29, 52, 73, 103, 129, 143, 136, 116, 88, 62, 38, 20]} />
            <PixelCluster className="left-[47%] top-[66%] rotate-[4deg] opacity-50" heights={[15, 25, 11, 33, 19, 41, 21, 13, 29, 17, 35]} />

            <div className="relative z-10 mx-auto w-full max-w-[1120px]">
                <h1 className="mx-auto mb-4 max-w-[960px] text-[40px] font-normal leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-[56px] sm:leading-[1.03] md:text-[72px]">
                    Stay legal.<br />Get help fast.
                </h1>
                <p className="mx-auto mb-[30px] max-w-[850px] text-[18px] font-normal leading-[1.4] tracking-[-0.025em] text-[#858585] md:text-[20px] md:leading-[28px]">
                    Car papers, renewal reminders, and trusted roadside help at an upfront price.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                    <Link href="/login" className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#1111F6] px-5 text-[15px] font-normal tracking-[-0.01em] text-white transition-colors hover:bg-[#0606D8] md:text-[16px]">
                        <span className="h-[18px] w-[18px] rounded-[2px] bg-white" />
                        Get started
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/help" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E8E8E8] bg-white px-5 text-[15px] font-normal tracking-[-0.01em] text-[#171717] transition-colors hover:bg-[#FAFAFA] md:text-[16px]">
                        Find roadside help
                    </Link>
                </div>
            </div>

            <div className="relative z-10 mx-auto mt-16 w-full max-w-[1280px] px-5 sm:absolute sm:bottom-10 sm:left-0 sm:right-0 sm:mt-0 sm:px-8 lg:bottom-[14px]">
                <p className="mb-5 text-[13px] font-normal tracking-[-0.01em] text-[#858585] md:text-[14px]">One app for drivers and fleets. Help within reach for anyone in the car.</p>
                <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[16px] font-medium tracking-[-0.03em] text-[#777] sm:gap-x-16 md:text-[20px]">
                    <span className="flex items-center gap-2"><Smartphone className="h-5 w-5" />Driver app</span>
                    <span className="flex items-center gap-2"><Truck className="h-5 w-5" />Fleet access</span>
                    <span className="flex items-center gap-2"><QrCode className="h-5 w-5" />QR car sticker</span>
                </div>
            </div>
        </section>
    );
}

function Touchpoints() {
    const cards = [
        { href: "#features", icon: Smartphone, title: "Driver app", description: "Keep papers, reminders, renewals, and roadside help together on your phone." },
        { href: "/business", icon: Truck, title: "Fleet access", description: "See vehicle status, invite drivers, and handle the daily work from the app." },
        { href: "#qr-sticker", icon: QrCode, title: "QR car sticker", description: "A quick path to roadside help, with a printed phone number as backup." },
    ];

    return (
        <section id="how-it-works" className="scroll-mt-20 bg-white px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-16 lg:px-16">
            <div className="mx-auto grid max-w-[1136px] gap-4 md:grid-cols-3">
                {cards.map(({ href, icon: Icon, title, description }) => (
                    <Link key={title} href={href} className="group min-h-[168px] rounded-[12px] border border-[#ECECEC] bg-white p-5 transition-colors hover:border-[#B8B8FF] hover:bg-[#FAFAFF]">
                        <div className="mb-5 flex items-start justify-between">
                            <Icon className="h-7 w-7 text-[#1111F6]" strokeWidth={1.8} />
                            <ChevronRight className="h-4 w-4 text-[#666] transition-transform group-hover:translate-x-1" />
                        </div>
                        <h2 className="mb-2 text-[18px] font-normal tracking-[-0.025em] text-[#171717]">{title}</h2>
                        <p className="text-[16px] leading-[1.4] text-[#777]">{description}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function ProductOverview() {
    const items = [
        { number: "01", title: "Papers" },
        { number: "02", title: "Reminders" },
        { number: "03", title: "Roadside" },
        { number: "04", title: "Car record" },
    ];

    return (
        <section className="bg-[#F7F7F7] px-5 py-16 text-center sm:px-8 md:py-28 lg:px-16">
            <div className="mx-auto max-w-[1136px]">
                <h2 className="text-[30px] font-normal leading-[1.1] tracking-[-0.035em] text-[#171717] md:text-[36px]">Car ownership, with less to worry about.</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-[#777]">Stay ahead of expired papers. Know where to turn when your car breaks down.</p>
                <div className="mt-14 grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
                    {items.map((item, index) => (
                        <div key={item.number} className={index === 0 ? "px-4" : index === 2 ? "px-4 md:border-l md:border-[#E4E4E4]" : "border-l border-[#E4E4E4] px-4"}>
                            <div className="text-[30px] font-normal tracking-[-0.045em] text-[#171717] md:text-[36px]">{item.number}</div>
                            <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[#777] md:text-[12px]">{item.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PapersVisual() {
    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#FCFCFC] p-7">
            <div className="absolute left-[13%] top-[17%] h-3 w-3 rounded-full bg-[#D9D8FF]" />
            <div className="absolute right-[15%] bottom-[17%] h-2 w-2 rounded-full bg-[#C6F1A6]" />
            <div className="w-full max-w-[330px] rounded-[20px] border border-[#ECECEC] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-center justify-between"><span className="text-[15px] font-medium">My car</span><Car className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[13px]"><span>Insurance</span><span className="flex items-center gap-1.5 text-[#277E62]"><Check className="h-3.5 w-3.5" />Ready</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[13px]"><span>Roadworthy</span><span className="text-[#A66E21]">Renew soon</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[13px]"><span>Licence</span><span className="flex items-center gap-1.5 text-[#277E62]"><Check className="h-3.5 w-3.5" />Ready</span></div>
                </div>
            </div>
        </div>
    );
}

function HelpVisual() {
    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#FCFCFC] p-7">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(#E9E9E9 1px, transparent 1px), linear-gradient(90deg, #E9E9E9 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
            <div className="relative flex w-full max-w-[340px] items-center gap-4 rounded-[18px] border border-[#ECECEC] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEEEFF] text-[#1111F6]"><Wrench className="h-6 w-6" /></span>
                <div><span className="block text-[15px] font-medium">Roadside help</span><span className="mt-1 block text-[13px] text-[#777]">Nearby mechanic · Price upfront</span></div>
                <MapPin className="ml-auto h-5 w-5 shrink-0 text-[#1111F6]" />
            </div>
        </div>
    );
}

function FleetVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-7">
            <div className="w-full max-w-[350px] rounded-[20px] border border-[#ECECEC] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center justify-between"><div><span className="block text-[12px] text-[#777]">Fleet view</span><span className="text-[17px] font-medium">Your vehicles</span></div><Bell className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="divide-y divide-[#EFEFEF]">
                    <div className="flex items-center justify-between py-3 text-[13px]"><span>Vehicle 01</span><span className="text-[#277E62]">Ready</span></div>
                    <div className="flex items-center justify-between py-3 text-[13px]"><span>Vehicle 02</span><span className="text-[#A66E21]">Renew soon</span></div>
                    <div className="flex items-center justify-between py-3 text-[13px]"><span>Vehicle 03</span><span className="text-[#277E62]">Ready</span></div>
                </div>
            </div>
        </div>
    );
}

function StickerVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-7">
            <div className="flex max-w-[350px] items-center gap-5 rounded-[18px] border border-[#E9E9E9] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <span className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[8px] border border-[#ECECEC]"><QrCode className="h-[70px] w-[70px] text-[#171717]" strokeWidth={1.5} /></span>
                <div><span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.05em] text-[#1111F6]">Motor Ambos</span><span className="block text-[16px] font-medium leading-tight">Need roadside help?</span><span className="mt-2 block text-[12px] text-[#777]">Scan or call the number</span></div>
            </div>
        </div>
    );
}

function FeatureGrid() {
    const features = [
        { id: "papers", title: "Stay ahead of expiry", description: "Keep insurance, roadworthy, and licence details close. Get WhatsApp and SMS reminders before they expire.", visual: <PapersVisual /> },
        { id: "roadside", title: "Know the price before help arrives", description: "Find a nearby mechanic, see the call-out price, and share your location when you need roadside help.", visual: <HelpVisual /> },
        { id: "fleet-app", title: "Run your fleet from your phone", description: "Check status, renew papers, invite drivers, and follow roadside requests. Use the web dashboard for bulk admin.", visual: <FleetVisual /> },
        { id: "qr-sticker", title: "Help anyone can reach", description: "A QR sticker opens roadside help with the car already filled in. A printed phone number is there as backup.", visual: <StickerVisual /> },
    ];

    return (
        <section id="features" className="scroll-mt-20 bg-white px-5 py-16 sm:px-8 md:py-28 lg:px-16">
            <div className="mx-auto max-w-[1136px]">
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <h2 className="max-w-[660px] text-[32px] font-normal leading-[1.12] tracking-[-0.04em] text-[#171717] md:text-[42px]">
                        Motor Ambos is the place for <span className="text-[#898989]">your car, your fleet, and help on the road.</span>
                    </h2>
                    <Link href="/business" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#E8E8E8] px-5 text-[16px] text-[#171717] transition-colors hover:bg-[#F8F8F8] md:self-auto">
                        Explore fleets <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                    {features.map((feature) => (
                        <article key={feature.title} id={feature.id} className="scroll-mt-24">
                            <div className="h-[220px] overflow-hidden rounded-[12px] border border-[#ECECEC] sm:h-[260px] md:h-[310px]">{feature.visual}</div>
                            <h3 className="mt-6 text-[20px] font-normal tracking-[-0.025em] text-[#171717]">{feature.title}</h3>
                            <p className="mt-2 max-w-[520px] text-[16px] leading-[1.45] text-[#777]">{feature.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Questions() {
    const questions = [
        { icon: Smartphone, question: "Is the driver app free?", answer: "Yes. Individual drivers can use the app at no cost. If you ask Motor Ambos to handle a renewal, a renewal fee may apply." },
        { icon: ClipboardCheck, question: "Can I manage a fleet from my phone?", answer: "Yes. Check vehicles, handle renewals, invite drivers, and follow roadside requests in the app. The web dashboard supports bulk and admin tasks." },
        { icon: CircleAlert, question: "What if my car breaks down?", answer: "Choose the help you need, share your location, and contact a nearby provider. A call-out fee is shown when available." },
    ];

    return (
        <section id="questions" className="scroll-mt-20 bg-white px-5 pb-20 sm:px-8 sm:pb-28 lg:px-16">
            <div className="mx-auto max-w-[1136px] border-t border-[#ECECEC] pt-16 sm:pt-20">
                <h2 className="mb-8 text-[32px] font-normal tracking-[-0.035em] text-[#171717] md:text-[40px]">Common questions.</h2>
                <div className="grid gap-5 md:grid-cols-3">
                    {questions.map(({ icon: Icon, question, answer }) => (
                        <article key={question} className="flex flex-col rounded-[12px] bg-[#F7F7F7] p-6 md:min-h-[300px]">
                            <Icon className="mb-8 h-8 w-8 text-[#1111F6] md:mb-auto" strokeWidth={1.6} />
                            <h3 className="text-[19px] font-normal tracking-[-0.025em] text-[#171717] md:mt-12">{question}</h3>
                            <p className="mt-3 text-[15px] leading-[1.45] text-[#777]">{answer}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="relative overflow-hidden bg-[#1111F6] px-5 py-20 text-white sm:px-8 md:py-24 lg:px-16">
            <PixelCluster className="right-[3%] top-[6%] opacity-65" heights={[10, 24, 43, 58, 72, 54, 30, 14]} />
            <PixelCluster className="right-[27%] bottom-[-12%] opacity-50" heights={[32, 70, 108, 148, 180, 160, 124, 90, 52, 22]} />
            <div className="relative z-10 mx-auto max-w-[1136px]">
                <h2 className="text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">Start with your car.</h2>
                <p className="mt-4 max-w-[430px] text-[16px] leading-[1.45] text-white/70">Keep your papers close and know where to turn when the road surprises you.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-[#171717] transition-colors hover:bg-[#F1F1F1]"><span className="h-4 w-4 rounded-[2px] bg-[#1111F6]" />Get started</Link>
                    <Link href="/business" className="inline-flex h-12 items-center justify-center rounded-full bg-white/20 px-5 text-[16px] text-white transition-colors hover:bg-white/30">For fleets</Link>
                </div>
            </div>
        </section>
    );
}

export function LandingFooter() {
    return (
        <footer className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
            <div className="mx-auto grid max-w-[1136px] gap-8 sm:gap-12 md:grid-cols-4">
                <div>
                    <Link href="/" aria-label="Motor Ambos home" className="mb-6 flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#1111F6] text-white"><Car className="h-[18px] w-[18px]" /></Link>
                    <p className="text-[14px] text-[#777]">Keep your car ready for the road.</p>
                </div>
                <div><h3 className="mb-4 text-[14px] text-[#171717]">Drivers</h3><div className="flex flex-col gap-3 text-[14px] text-[#777]"><Link href="/login" className="hover:text-[#1111F6]">Get started</Link><Link href="/help" className="hover:text-[#1111F6]">Roadside help</Link><Link href="/#how-it-works" className="hover:text-[#1111F6]">How it works</Link></div></div>
                <div><h3 className="mb-4 text-[14px] text-[#171717]">Fleets</h3><div className="flex flex-col gap-3 text-[14px] text-[#777]"><Link href="/business" className="hover:text-[#1111F6]">Fleet access</Link><Link href="/business" className="hover:text-[#1111F6]">Web dashboard</Link></div></div>
                <div><h3 className="mb-4 text-[14px] text-[#171717]">Resources</h3><div className="flex flex-col gap-3 text-[14px] text-[#777]"><Link href="/#questions" className="hover:text-[#1111F6]">Common questions</Link><Link href="/privacy-policy" className="hover:text-[#1111F6]">Privacy</Link><Link href="/terms-of-service" className="hover:text-[#1111F6]">Terms</Link></div></div>
            </div>
            <div className="mx-auto mt-12 flex max-w-[1136px] flex-col justify-between gap-4 border-t border-[#ECECEC] pt-6 text-[12px] text-[#888] sm:mt-20 sm:flex-row">
                <span>© 2026 Motor Ambos</span><span>Stay legal. Get help fast.</span>
            </div>
        </footer>
    );
}

export default function HomeLanding() {
    return (
        <main className="base-landing min-h-screen w-full overflow-x-hidden bg-white text-[#171717] selection:bg-[#DCDCFD] selection:text-[#171717]">
            <LandingNav />
            <Hero />
            <Touchpoints />
            <ProductOverview />
            <FeatureGrid />
            <Questions />
            <FinalCta />
            <LandingFooter />
        </main>
    );
}
