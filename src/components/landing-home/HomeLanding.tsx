"use client";

import Link from "next/link";
import Image from "next/image";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
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
    LifeBuoy,
    QrCode,
    Smartphone,
    Truck,
} from "lucide-react";

const navigation = [
    { href: "/mobile-app", label: "App & Smart Card" },
    { href: "/business", label: "Fleets" },
    { href: "/roadside-mechanics", label: "Mechanic network" },
    { href: "/providers", label: "Join as a mechanic" },
];

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
    return <Image src="/icon.svg" alt="" width={24} height={20} className={`h-5 w-6 shrink-0 ${inverted ? "brightness-0 invert" : ""}`} />;
}

export function LandingNav({ hideCta = false }: { hideCta?: boolean }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    useEffect(() => {
        if (!menuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        const closeOnDesktop = () => {
            if (window.innerWidth >= 1024) setMenuOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        window.addEventListener("resize", closeOnDesktop);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
            window.removeEventListener("resize", closeOnDesktop);
        };
    }, [menuOpen]);

    const [menuPath, setMenuPath] = useState(pathname);
    if (menuPath !== pathname) {
        setMenuPath(pathname);
        setMenuOpen(false);
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#EEEEEE] bg-white">
            <nav className="relative mx-auto flex h-16 max-w-[1536px] items-center justify-between gap-3 px-5 sm:px-8 lg:h-[76px] lg:px-16" aria-label="Main navigation">
                <Link href="/" aria-label="Motor Ambos home" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-2.5 text-[16px] font-medium tracking-[-0.035em] text-[#171717] sm:text-[17px]">
                    <Image src="/icon.svg" alt="" width={42} height={36} className="h-9 w-[42px]" priority />
                    <span className="truncate lg:hidden">Motor Ambos</span>
                </Link>

                <div className="ml-8 mr-auto hidden items-center gap-6 lg:flex xl:ml-14 xl:gap-9">
                    {navigation.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            aria-current={isActive(link.href) ? "page" : undefined}
                            className={`relative flex h-[76px] items-center whitespace-nowrap text-[15px] font-normal transition-colors xl:text-[16px] hover:text-[#1111F6] ${isActive(link.href) ? "text-[#1111F6] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1111F6]" : "text-[#171717]"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
                    <Link href="/help" aria-current={isActive("/help") ? "page" : undefined} className={`inline-flex h-[34px] items-center gap-1.5 rounded-full border px-3.5 text-[14px] transition-colors ${isActive("/help") ? "border-[#1111F6] bg-[#F3F3FF] text-[#1111F6]" : "border-[#E3E3E3] text-[#171717] hover:border-[#B8B8FF] hover:text-[#1111F6]"}`}>
                        <LifeBuoy className="h-4 w-4" strokeWidth={1.8} />Roadside help
                    </Link>
                    {!hideCta && <Link href="/login" className="group inline-flex h-[34px] items-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] font-normal text-white transition-colors hover:bg-[#0606D8]">
                        <BrandMark inverted />Get started
                    </Link>}
                </div>

                <button
                    type="button"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1111F6] focus-visible:ring-offset-2 lg:hidden"
                >
                    <span aria-hidden="true" className="relative block h-6 w-6">
                        <span className={`absolute left-0.5 top-[7px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                        <span className={`absolute left-0.5 top-[17px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
                    </span>
                </button>
            </nav>

            {menuOpen && (
                <div id="mobile-navigation" className="absolute inset-x-0 top-16 z-40 flex h-[calc(100dvh-64px)] flex-col overflow-y-auto overscroll-contain border-t border-[#EEEEEE] bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 sm:px-8 lg:hidden">
                    <nav aria-label="Mobile navigation" className="flex flex-col">
                        {navigation.map((link) => (
                            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)} aria-current={isActive(link.href) ? "page" : undefined} className={`flex min-h-[64px] items-center justify-between border-b border-[#ECECEC] py-4 text-[19px] font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1111F6] ${isActive(link.href) ? "text-[#1111F6]" : "text-[#171717]"}`}>
                                <span className="flex items-center gap-3">{isActive(link.href) && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1111F6]" />}{link.label}</span>
                                <ArrowRight className={`h-5 w-5 shrink-0 ${isActive(link.href) ? "text-[#1111F6]" : "text-[#777]"}`} strokeWidth={1.5} />
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto flex shrink-0 flex-col gap-3 pt-8">
                        <Link href="/help" onClick={() => setMenuOpen(false)} className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#E3E3E3] text-[16px] text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1111F6] focus-visible:ring-offset-2">
                            <LifeBuoy className="h-5 w-5 text-[#1111F6]" strokeWidth={1.8} />Get roadside help
                        </Link>
                        {!hideCta && <Link href="/login" onClick={() => setMenuOpen(false)} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[16px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1111F6] focus-visible:ring-offset-2">
                            <BrandMark inverted />Get started
                        </Link>}
                    </div>
                </div>
            )}
        </header>
    );
}

export function PixelCluster({ className, heights }: { className: string; heights: number[] }) {
    const colors = ["#B6B1FF", "#D6B6FF", "#C6F1A6", "#F6D884", "#AAA6FF"];
    return (
        <div aria-hidden="true" className={["pixel-cluster pointer-events-none absolute flex items-center gap-[5px]", className].join(" ")}>
            {heights.map((height, index) => (
                <span key={index} className="block w-[5px] rounded-[1px]" style={{ height, backgroundColor: colors[index % colors.length], opacity: index % 3 === 0 ? 0.52 : 0.78 }} />
            ))}
        </div>
    );
}

function Hero() {
    return (
        <section className="relative flex w-full flex-col items-center overflow-hidden bg-white px-5 pb-14 pt-24 text-center sm:px-8 sm:pb-16 sm:pt-32 lg:min-h-[680px] lg:px-16 lg:pt-36 lg:text-left">
            <PixelCluster className="left-[0.5%] top-[31%] rotate-[-8deg] opacity-60" heights={[10, 16, 7, 28, 15, 42, 24, 11, 31, 18, 47, 23, 12]} />
            <PixelCluster className="left-[33%] top-[22%] rotate-[-4deg] opacity-50" heights={[10, 18, 29, 14, 39, 18, 25, 12, 33, 16, 24, 9]} />
            <PixelCluster className="right-[2%] top-[37%] rotate-[5deg] opacity-60" heights={[12, 20, 33, 18, 43, 25, 13, 39, 20, 31, 15]} />
            <PixelCluster className="right-[13%] top-[25%] opacity-65" heights={[29, 52, 73, 103, 129, 143, 136, 116, 88, 62, 38, 20]} />

            <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-2">
                <div className="order-2 lg:order-1">
                    <h1 className="mb-4 text-[40px] font-normal leading-[1.1] tracking-[-0.04em] text-[#171717] sm:text-[56px] sm:leading-[1.03] lg:text-[64px] xl:text-[72px]">
                        Stay legal.<br />Get help fast.
                    </h1>
                    <p className="mx-auto mb-[30px] max-w-[650px] text-[18px] font-normal leading-[1.4] tracking-[-0.025em] text-[#858585] md:text-[20px] md:leading-[28px] lg:mx-0">
                        Car papers, renewal reminders, and nearby roadside help in one app.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                        <Link href="/login" className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#1111F6] px-5 text-[15px] font-normal tracking-[-0.01em] text-white transition-colors hover:bg-[#0606D8] md:text-[16px]">
                            <BrandMark inverted />
                            Get started
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/help" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E8E8E8] bg-white px-5 text-[15px] font-normal tracking-[-0.01em] text-[#171717] transition-colors hover:bg-[#FAFAFA] md:text-[16px]">
                            Find roadside help
                        </Link>
                    </div>
                </div>
                <div className="relative order-1 mx-auto w-full max-w-[720px] lg:order-2">
                    <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[12%] h-[50%] rounded-full bg-[#E9EBFF] opacity-45 blur-[70px]" />
                    <Image src="/images/roadside-tow.webp" alt="A Motor Ambos roadside tow truck helping a car" width={1400} height={700} priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 680px" className="relative h-auto w-full object-contain" />
                </div>
            </div>

            <div className="relative z-10 mx-auto mt-8 w-full max-w-[1280px] px-5 text-center sm:px-8 lg:mt-auto lg:pt-12">
                <p className="mb-5 text-[13px] font-normal tracking-[-0.01em] text-[#858585] md:text-[14px]">One app for drivers and fleets. Help within reach for anyone in the car.</p>
                <div className="marketing-marquee mx-auto max-w-[960px] text-[16px] font-medium tracking-[-0.03em] text-[#777] md:text-[20px]">
                    <span className="sr-only">Driver app, fleet access, and QR car sticker</span>
                    <div className="marketing-marquee-track" aria-hidden="true">
                        {[0, 1].map((copy) => <div key={copy} className="marketing-marquee-group">
                            <span className="flex shrink-0 items-center gap-2"><Smartphone className="h-5 w-5" />Driver app</span>
                            <span className="flex shrink-0 items-center gap-2"><Truck className="h-5 w-5" />Fleet access</span>
                            <span className="flex shrink-0 items-center gap-2"><QrCode className="h-5 w-5" />QR car sticker</span>
                        </div>)}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Touchpoints() {
    const cards = [
        { href: "/mobile-app", icon: Smartphone, title: "Driver app", description: "Keep papers, service and fuel logs, reminders, and roadside help together on your phone." },
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

function MechanicNetworkPreview() {
    return (
        <section className="bg-[#F7F7F7] px-5 py-16 sm:px-8 md:py-24 lg:px-16">
            <div className="mx-auto grid max-w-[1136px] items-center gap-10 md:grid-cols-[1fr_0.9fr] md:gap-16">
                <div className="order-2 md:order-1">
                    <p className="mb-5 text-[12px] uppercase tracking-[0.1em] text-[#1111F6]">Roadside mechanic network</p>
                    <h2 className="max-w-[570px] text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">Local mechanics, <span className="text-[#898989]">easier to find.</span></h2>
                    <p className="mt-5 max-w-[510px] text-[16px] leading-[1.5] text-[#777]">Tell us what happened and share your location. Compare nearby independent providers by distance and listed call-out fee, then contact one directly.</p>
                    <Link href="/roadside-mechanics" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 text-[16px] transition-colors hover:border-[#B8B8FF]">Explore the network <ArrowRight className="h-4 w-4 text-[#1111F6]" /></Link>
                </div>
                <div className="relative order-1 flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[20px] border border-[#E7E9F7] bg-[#F1F3FF] p-4 sm:min-h-[400px] sm:p-6 md:order-2">
                    <Image src="/images/roadside-cables.webp" alt="Blue and silver jumper cables" width={900} height={717} sizes="(max-width: 768px) 90vw, 480px" className="pointer-events-none absolute left-1/2 top-[-8%] h-[85%] w-[90%] max-w-[480px] -translate-x-1/2 object-contain" />
                    <div className="relative z-10 flex items-center justify-between gap-3 rounded-[14px] border border-white/80 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(17,17,246,0.09)] backdrop-blur-sm sm:px-5 sm:py-4">
                        <div><span className="block text-[15px] text-[#171717]">Battery trouble?</span><span className="mt-1 block text-[13px] text-[#777]">Find nearby roadside help</span></div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1111F6] text-white"><ArrowRight className="h-5 w-5" /></span>
                    </div>
                </div>
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
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#F1F3FF] p-3">
            <Image src="/images/roadside-car.webp" alt="A car with a flat tyre" width={900} height={718} sizes="(max-width: 768px) 90vw, 520px" className="h-full w-full max-w-[480px] object-contain" />
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
        { id: "papers", title: "Stay ahead of expiry", description: "Keep insurance, roadworthy, and licence details close. Get a text message reminder before they expire.", visual: <PapersVisual /> },
        { id: "roadside", title: "Know the call-out fee before you call", description: "Share your location, find a nearby mechanic, and see their listed call-out fee when you need roadside help.", visual: <HelpVisual /> },
        { id: "fleet-app", title: "Run your fleet from your phone", description: "Check status, renew papers, invite drivers, and see issues drivers report. Use the web dashboard for bulk admin.", visual: <FleetVisual /> },
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
        { icon: ClipboardCheck, question: "Can I manage a fleet from my phone?", answer: "Yes. Check vehicles, handle renewals, invite drivers, and see issues drivers report in the app. The web dashboard supports bulk and admin tasks." },
        { icon: CircleAlert, question: "What if my car breaks down?", answer: "Choose the help you need, share your location, and contact a nearby provider directly. A call-out fee is shown when the provider has listed one." },
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
                    <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-[#171717] transition-colors hover:bg-[#F1F1F1]"><BrandMark />Get started</Link>
                    <Link href="/business" className="inline-flex h-12 items-center justify-center rounded-full bg-white/20 px-5 text-[16px] text-white transition-colors hover:bg-white/30">Explore fleets</Link>
                </div>
            </div>
        </section>
    );
}

const footerColumns = [
    { title: "Drivers", links: [{ href: "/mobile-app", label: "App & Smart Card" }, { href: "/help", label: "Roadside help" }, { href: "/roadside-mechanics", label: "Mechanic network" }, { href: "/login", label: "Get started" }] },
    { title: "Fleets", links: [{ href: "/business", label: "Fleet management" }, { href: "/login", label: "Set up your fleet" }] },
    { title: "Company", links: [{ href: "/providers", label: "Join as a mechanic" }, { href: "/#questions", label: "Common questions" }, { href: "mailto:support@motorambos.com", label: "Contact us" }, { href: "/privacy-policy", label: "Privacy" }, { href: "/terms-of-service", label: "Terms" }] },
];

export function LandingFooter() {
    return (
        <footer className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
            <div className="mx-auto grid max-w-[1136px] gap-8 sm:gap-12 md:grid-cols-4">
                <div>
                    <Link href="/" aria-label="Motor Ambos home" className="mb-6 block h-9 w-[42px]"><Image src="/icon.svg" alt="" width={42} height={36} className="h-9 w-[42px]" /></Link>
                    <p className="text-[14px] text-[#777]">Keep your car ready for the road.</p>
                </div>
                {footerColumns.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                        <h3 className="mb-4 text-[14px] text-[#171717]">{column.title}</h3>
                        <ul className="flex flex-col gap-3 text-[14px] text-[#777]">
                            {column.links.map((link) => <li key={link.label}><Link href={link.href} className="transition-colors hover:text-[#1111F6]">{link.label}</Link></li>)}
                        </ul>
                    </nav>
                ))}
            </div>
            <div className="mx-auto mt-12 flex max-w-[1136px] flex-col justify-between gap-4 border-t border-[#ECECEC] pt-6 text-[12px] text-[#888] sm:mt-20 sm:flex-row">
                <span>© 2026 Motor Ambos</span><span>Stay legal. Get help fast.</span>
            </div>
        </footer>
    );
}

export default function HomeLanding() {
    return (
        <main className="base-landing marketing-motion min-h-screen w-full overflow-x-hidden bg-white text-[#171717] selection:bg-[#DCDCFD] selection:text-[#171717]">
            <MarketingMotion />
            <LandingNav />
            <Hero />
            <Touchpoints />
            <MechanicNetworkPreview />
            <ProductOverview />
            <FeatureGrid />
            <Questions />
            <FinalCta />
            <LandingFooter />
        </main>
    );
}
