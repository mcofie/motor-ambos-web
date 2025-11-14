import Link from "next/link";
import type {Metadata} from "next";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {AppStoreButtons} from "@/components/AppStoreButtons";
import {ThemeToggle} from "@/components/ThemeToggle";
import {
    Car,
    ArrowRight,
    Menu,
    Shield,
    Star,
    Wrench,
    Truck,
    BatteryCharging,
    Droplet,
    Disc,
    Navigation2,
    Smartphone,
    CreditCard,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Motor Ambos — Roadside & On-Demand Car Care",
    description:
        "Decentralised network of verified mechanics & car-care providers. Roadside help + CAFU-style services (fuel, wash, oil, tyres, battery) with transparent pricing.",
};

export default function LandingPage() {
    const services = [
        {title: "Tyres & Puncture", image: "5.png", icon: Disc},
        {title: "Rescue", image: "12.png", icon: Truck},
        {title: "Engine Oil", image: "11.png", icon: Droplet},
        {title: "Battery", image: "9.png", icon: BatteryCharging},
        {title: "General", image: "7.png", icon: Wrench},
    ];

    const year = new Date().getFullYear();

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Skip link */}
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            {/* HERO */}
            <section className="relative isolate overflow-hidden text-white">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 -z-20 bg-cover bg-center bg-fixed"
                    style={{backgroundImage: "url('/images/backdrop.jpg')"}}
                />
                <div className="absolute inset-0 -z-10 bg-black/65"/>

                {/* Glow + texture */}
                <div className="pointer-events-none absolute -z-10 inset-0">
                    <div
                        className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-lime-500/25 blur-3xl"/>
                    <div
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_60%)]"/>
                </div>

                {/* Header */}
                <header className="pt-5 sm:pt-8">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
                            <div className="px-4 sm:px-6 py-3.5">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/"
                                        className="group flex items-center gap-2 font-semibold text-base sm:text-lg"
                                        aria-label="Motor Ambos home"
                                    >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-lime-500/15 ring-1 ring-lime-400/25">
                      <Car className="h-4.5 w-4.5 text-lime-400 transition-transform group-hover:scale-110"/>
                    </span>
                                        <span className="hidden xs:inline tracking-tight">
                      Motor Ambos
                    </span>
                                    </Link>

                                    {/* Desktop nav */}
                                    <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                                        <TopNavLink href="#services">Services</TopNavLink>
                                        <TopNavLink href="#membership">Membership</TopNavLink>
                                        <TopNavLink href="#why">Why us</TopNavLink>
                                        <Button
                                            asChild
                                            className="shadow-sm hover:shadow-lg transition"
                                        >
                                            <Link href="/signup">Join now</Link>
                                        </Button>
                                        <ThemeToggle/>
                                    </nav>

                                    {/* Mobile */}
                                    <div className="md:hidden flex items-center gap-1">
                                        <ThemeToggle/>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Open menu"
                                        >
                                            <Menu className="h-5 w-5"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero content */}
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-14 sm:py-20 md:py-28 text-center">
                    <div className="mx-auto max-w-3xl">
            <span
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-gray-200">
              <Shield className="h-3.5 w-3.5"/>
              Verified mechanics • Transparent pricing
            </span>

                        <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] drop-shadow-lg">
                            Car trouble? Help is minutes away.
                        </h1>

                        <p className="mt-5 text-sm sm:text-base md:text-lg/7 text-gray-300 mx-auto max-w-2xl">
                            MotorAmbos finds the closest trusted mechanic to get you moving again. Everything you need
                            on the road, delivered in moments.
                        </p>

                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                                asChild
                                size="lg"
                                className="gap-2 w-full sm:w-auto bg-lime-500 hover:bg-lime-600 text-black"
                            >
                                <Link href="/help">
                                    Request roadside help <ArrowRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="gap-2 w-full sm:w-auto border-lime-400 text-lime-400 hover:bg-lime-400/10"
                            >
                                <Link href="#services">Explore services</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content anchor */}
            <div id="content"/>

            {/* Services */}
            <section
                id="services"
                className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-12 my-10"
            >
                <div className="text-center">
                    <h2 className="text-2xl md:text-4xl tracking-tight leading-[1.15] dark:text-lime-500">
                        Services
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
                        Roadside emergencies and everyday car care — delivered where you
                        are.
                    </p>
                </div>

                <Carousel className="mt-7">
                    <CarouselContent>
                        {services.map((s, index) => {
                            const Icon = s.icon;
                            return (
                                <CarouselItem
                                    key={index}
                                    className="pl-1 xs:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                >
                                    {/* Transparent wrapper (no bg), border only on hover */}
                                    <div className="group relative h-full overflow-hidden rounded-xl transition">
                                        {/* soft hover glow */}
                                        <div
                                            className="pointer-events-none absolute -inset-16 opacity-0 transition group-hover:opacity-20">
                                            <div
                                                className="h-full w-full bg-[conic-gradient(at_30%_10%,theme(colors.lime.500),transparent_60%)] blur-2xl"/>
                                        </div>

                                        {/* No Card/ CardContent — keep it neutral */}
                                        <div className="relative flex aspect-square items-center justify-center p-0">
                                            <div
                                                className="relative h-full w-full overflow-hidden rounded-xl ring-1 ring-border/50 group-hover:ring-lime-400/40 transition">
                                                <Image
                                                    src={`/images/${s.image}`}
                                                    alt={s.title}
                                                    width={800}
                                                    height={800}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                    priority={index < 2}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                                                <div
                                                    className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white ring-1 ring-white/15 backdrop-blur-sm">
                                                    <Icon className="h-3.5 w-3.5 text-lime-400"/>
                                                    {s.title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </section>

            {/* Membership */}
            <section
                id="membership"
                className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20"
            >
                <div
                    className="rounded-2xl border border-border bg-primary text-primary-foreground px-4 sm:px-6 py-12 md:py-16">
                    <h2 className="text-2xl md:text-5xl leading-[1.05] my-2 text-center dark:text-lime-500">
                        Become a member
                    </h2>
                    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center p-2 sm:p-6">
                        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
                            <Image
                                src="/images/membership_card.png"
                                alt="Membership card"
                                width={1200}
                                height={800}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                                className="h-auto w-full rounded-xl object-cover shadow-sm ring-1 ring-border"
                                priority
                            />
                            <span
                                className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_40px_4px_theme(colors.primary/10)] dark:shadow-[0_0_50px_6px_theme(colors.primary/15)]"/>
                        </div>
                        <p className="mt-6 max-w-2xl text-sm md:text-base text-primary-foreground/90">
                            Save on callouts, get priority response, and unlock concierge
                            coordination. Your digital card is QR-enabled and works across our
                            network.
                        </p>
                        <div className="mt-5 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/signup">Join Membership</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full bg-transparent text-primary-foreground sm:w-auto"
                            >
                                <Link href="#why">Learn more</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why */}
            <section id="why" className="w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl tracking-tight leading-[1.15] dark:text-lime-500">
                        Why Motor Ambos?
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
                        Everything you need to feel confident on the road.
                    </p>
                </div>

                <div
                    className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Feature
                        icon={<Shield className="h-5 w-5"/>}
                        title="Verified network"
                        body="We vet every provider and rate card. See prices and ratings up front — no surprises."
                    />
                    <Feature
                        icon={<Navigation2 className="h-5 w-5"/>}
                        title="Smart matching"
                        body="We rank providers by distance, availability, rating, and service relevance."
                    />
                    <Feature
                        icon={<CreditCard className="h-5 w-5"/>}
                        title="Clear pricing"
                        body="Transparent callout fees and rate cards, with receipts and history in your app."
                    />
                    <Feature
                        icon={<Smartphone className="h-5 w-5"/>}
                        title="Seamless experience"
                        body="Mobile-first. Book in a few taps, track status, and chat if needed."
                    />
                    <Feature
                        icon={<Star className="h-5 w-5"/>}
                        title="Quality first"
                        body="Ratings and job counts promote the best providers — and help everyone improve."
                    />
                    <Feature
                        icon={<Truck className="h-5 w-5"/>}
                        title="Emergency & everyday"
                        body="Towing, jumpstarts, tyres — plus oil, wash, fuel delivery and more."
                    />
                </div>
            </section>

            {/* App highlight */}
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20">
                <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
                    <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                        <div className="w-full">
                            <Image
                                src="/images/iphone_mockup.png"
                                alt="App mockup"
                                width={1200}
                                height={1200}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="w-full rounded-xl object-cover"
                                priority
                            />
                        </div>
                        <div className="w-full md:pl-2">
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-semibold">
                                Get help for your car fast — transparent, anywhere.
                            </h3>
                            <p className="mt-3 max-w-prose text-sm sm:text-base text-muted-foreground">
                                Book fuel delivery, wash, jumpstart, tyre fixes, or towing. Pick
                                providers by distance, rating, and rate card — no surprises.
                            </p>
                            <div className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                <AppStoreButtons/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Theme-aware accent strip before footer */}
            <section
                className="border-t border-border bg-gradient-to-r from-background via-muted/70 to-background dark:via-muted/50">
                <div
                    className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-6 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Always on
                        </p>
                        <p className="mt-1 text-base sm:text-lg font-semibold">
                            24/7 support, wherever the road takes you.
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
                            From quick jumpstarts to full recovery, MotorAmbos keeps you
                            moving — day or night.
                        </p>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Link href="/help">Get help now</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-background">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 md:py-10">
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                        {/* Brand + short blurb */}
                        <div className="max-w-sm space-y-3">
                            <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-500/15 ring-1 ring-lime-400/25">
                  <Car className="h-4 w-4 text-lime-400"/>
                </span>
                                <span className="text-sm font-semibold tracking-tight">
                  Motor Ambos
                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                A decentralised network of verified mechanics and car-care
                                providers built for African roads.
                            </p>
                        </div>

                        {/* Link columns */}
                        <div className="grid w-full max-w-md grid-cols-2 gap-6 text-xs sm:text-sm sm:grid-cols-3">
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Product
                                </h4>
                                <ul className="space-y-1.5">
                                    <li>
                                        <Link
                                            href="#services"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#membership"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Membership
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#why"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            How it works
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Company
                                </h4>
                                <ul className="space-y-1.5">
                                    <li>
                                        <Link
                                            href="/about"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/contact"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/providers"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Become a provider
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Legal
                                </h4>
                                <ul className="space-y-1.5">
                                    <li>
                                        <Link
                                            href="/terms"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Terms
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/privacy"
                                            className="hover:text-foreground transition-colors"
                                        >
                                            Privacy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom strip */}
                    <div
                        className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-4 text-[11px] sm:text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>© {year} MotorAmbos. All rights reserved.</p>
                        <p className="flex flex-wrap gap-2">
                            <span>Built for drivers in Ghana.</span>
                            <span className="hidden sm:inline">More markets coming soon.</span>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}

/* ---------- Presentational bits ---------- */

function TopNavLink({
                        href,
                        children,
                    }: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Button
            asChild
            variant="ghost"
            className="rounded-full text-white/90 hover:bg-white/10 hover:text-white"
        >
            <Link href={href}>{children}</Link>
        </Button>
    );
}

function Feature({
                     icon,
                     title,
                     body,
                 }: {
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <section
            className="group relative min-h-48 rounded-2xl border border-border bg-card/60 p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="pointer-events-none absolute -inset-16 opacity-0 transition group-hover:opacity-20">
                <div
                    className="h-full w-full bg-[radial-gradient(circle_at_top_left,theme(colors.lime.500),transparent_60%)] blur-2xl"/>
            </div>
            <div className="relative">
                <div
                    className="mb-2 inline-flex items-center justify-center rounded-xl border border-lime-500/30 bg-lime-500/10 p-2">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
        </section>
    );
}