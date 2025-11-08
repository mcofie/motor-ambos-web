import Link from "next/link";
import type {Metadata} from "next";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";
import {
    Car,
    Wrench,
    Shield,
    PhoneCall,
    MapPin,
    ArrowRight,
    Menu,
    Fuel,
    Droplet,
    BatteryCharging,
    Sparkles,
    Truck,
    ToolCase,
    Navigation2,
    Smartphone,
    Crown,
    QrCode,
    Users,
    Star,
    CreditCard,
} from "lucide-react";
import {ThemeToggle} from "@/components/ThemeToggle";
import {Card, CardContent} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {AppStoreButtons} from "@/components/AppStoreButtons";

export const metadata: Metadata = {
    title: "Motor Ambos — Roadside & On-Demand Car Care",
    description:
        "Decentralised network of verified mechanics & car-care providers. Roadside help + CAFU-style services (fuel, wash, oil, tyres, battery) with transparent pricing.",
};

export default function LandingPage() {
    const services = ["5.png", "7.png", "11.png", "9.png"];
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Skip link */}
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            {/* Header (theme-aware card w/ blur) */}
            <header className="my-6 sm:my-8 w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                    <div
                        className="rounded-2xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                        <div className="px-4 sm:px-6 py-4">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 font-semibold text-base sm:text-lg"
                                    aria-label="Motor Ambos home"
                                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
                    <Car className="h-4.5 w-4.5 text-primary"/>
                  </span>
                                    <span className="hidden xs:inline">Motor Ambos</span>
                                </Link>

                                {/* Desktop nav */}
                                <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                                    <TopNavLink href="#membership">Membership & App</TopNavLink>
                                    <Button asChild className="shadow-sm hover:shadow">
                                        <Link href="/signup">Join now</Link>
                                    </Button>
                                    <ThemeToggle/>
                                </nav>

                                {/* Mobile */}
                                <div className="md:hidden flex items-center gap-1">
                                    <ThemeToggle/>
                                    <Button variant="ghost" size="icon" aria-label="Open menu">
                                        <Menu className="h-5 w-5"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO — theme-aware neon ribbon */}
            <section className="relative isolate overflow-hidden">
                {/* Neon ribbon sweep */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute inset-x-[-20%] top-[-35%] h-[140%] rotate-[-3deg]
            bg-[conic-gradient(at_10%_10%,theme(colors.primary)_0deg,theme(colors.primary/70)_130deg,transparent_240deg)]
            opacity-25 dark:opacity-40 blur-3xl"
                    />
                </div>

                {/* Soft spotlight */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[40rem]
          -translate-x-1/2 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"
                />

                {/* Subtle grid overlay */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12]
          [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]
          bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)]
          bg-[size:36px_36px]"
                />

                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
                    <div className="max-w-3xl text-center mx-auto">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                            Get help for your car <span className="text-primary">fast</span>, transparent, anywhere.
                        </h1>

                        <p className="mt-5 text-sm sm:text-base md:text-lg/7 text-muted-foreground max-w-2xl mx-auto">
                            MotorAmbos connects drivers to nearby, verified mechanics and on-demand providers. See
                            pricing up front,
                            choose by distance and rating, and connect instantly. Providers don’t need an app — SMS
                            works out of the box.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                                <Link href="/help">
                                    Request roadside help <ArrowRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                                <Link href="#services">Explore services</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content anchor */}
            <div id="content"/>

            {/* Value band */}
            <section className="w-full bg-primary/95 text-primary-foreground">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                    <div className="rounded-2xl border border-primary/40 bg-card/10 backdrop-blur">
                        <div className="mx-auto w-full max-w-3xl text-center px-4 sm:px-6 py-12 md:py-16">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                                Save money and time with transparent rates, priority response, and concierge
                                coordination.
                            </h2>
                            <div className="mt-6">
                                <Button asChild size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                                    <Link href="#services">Explore services</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section id="services" className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-10">
                <div className="text-center">
                    <h2 className="text-2xl md:text-4xl tracking-tight leading-[1.15]">Services</h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem
                        aperiam, eaque ipsa.
                    </p>
                </div>
                <Carousel className="mt-6">
                    <CarouselContent>
                        {services.map((file, index) => (
                            <CarouselItem key={index} className="pl-1 xs:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <div className="p-2 h-full">
                                    <Card
                                        className="border-0 bg-background hover:border-primary/60 transition-colors h-full">
                                        <CardContent
                                            className="flex aspect-square items-center justify-center p-4 sm:p-6">
                                            <Image
                                                src={`/images/${file}`}
                                                alt={`Service ${index + 1}`}
                                                width={800}
                                                height={800}
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="rounded-xl object-cover w-full h-full"
                                                priority={index < 2}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </section>

            {/* Membership section */}
            <section id="membership" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20">
                <div
                    className="rounded-2xl flex flex-col items-center justify-center border border-border bg-primary text-primary-foreground px-4 sm:px-6 py-12 md:py-16">
                    <h2 className="text-2xl md:text-5xl leading-[1.05] my-2 text-center">Become a member</h2>
                    <div className="flex flex-col items-center justify-center text-center mx-auto p-2 sm:p-6">
                        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
                            <Image
                                src="/images/membership_card.png"
                                alt="Membership card"
                                width={1200}
                                height={800}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                                className="rounded-xl object-cover shadow-sm ring-1 ring-border w-full h-auto"
                                priority
                            />
                            {/* subtle glow that adapts to theme */}
                            <span
                                className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_40px_4px_theme(colors.primary/10)] dark:shadow-[0_0_50px_6px_theme(colors.primary/15)]"/>
                        </div>
                        <p className="mt-6 max-w-2xl text-sm md:text-base text-primary-foreground/90">
                            Save money and time with transparent rates, priority response, and concierge coordination.
                            Your digital
                            card is QR-enabled and works across our network.
                        </p>
                        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/signup">Join Membership</Link>
                            </Button>
                            <Button asChild variant="outline"
                                    className="w-full sm:w-auto bg-transparent text-primary-foreground">
                                <Link href="#why">Learn more</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why section */}
            <section id="why" className="w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 text-center">
                    <h2 className="text-2xl md:text-4xl tracking-tight leading-[1.15]">Why Motor Ambos?</h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem
                        aperiam, eaque ipsa.
                    </p>
                </div>
                <div
                    className="mx-auto w-full max-w-6xl px-4 sm:px-6 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <section className="min-h-48 rounded-2xl border border-border bg-card p-6"/>
                    <section className="min-h-48 rounded-2xl border border-border bg-card p-6"/>
                    <section className="min-h-48 rounded-2xl border border-border bg-card p-6"/>
                </div>
            </section>

            {/* App highlight */}
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20">
                <div className="rounded-2xl border border-border bg-muted/40 p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                        <div className="w-full">
                            <Image
                                src="/images/iphone_mockup.png"
                                alt="App mockup"
                                width={1200}
                                height={1200}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-xl object-cover w-full h-auto"
                                priority
                            />
                        </div>
                        <div className="w-full md:pl-2">
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-semibold">
                                Get help for your car fast — transparent, anywhere.
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-prose">
                                Book fuel delivery, wash, jumpstart, tyre fixes, or towing. Pick providers by distance,
                                rating, and
                                rate card — no surprises.
                            </p>
                            <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <AppStoreButtons/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accent band */}
            {/*<section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">*/}
            {/*</section>*/}
            <div className="border border-border bg-black/90 min-h-40 sm:min-h-56"/>


            {/* Footer */}
            <footer className="border-border bg-background">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 text-sm text-muted-foreground">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>© {new Date().getFullYear()} MotorAmbos</div>
                        <nav className="flex gap-4">
                            <Link href="/about">About</Link>
                            <Link href="/terms">Terms</Link>
                            <Link href="/privacy">Privacy</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </main>
    );
}

/* ---------- Presentational bits (lightweight, colourful) ---------- */

function TopNavLink({
                        href,
                        children,
                    }: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
            <Link href={href}>{children}</Link>
        </Button>
    );
}
