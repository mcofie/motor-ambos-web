import Link from "next/link";
import type {Metadata} from "next";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Car, Wrench, Shield, PhoneCall, MapPin, ArrowRight, Menu,
    Fuel, Droplet, BatteryCharging, Sparkles, Truck, ToolCase, Navigation2,
    Smartphone, Crown, QrCode, Users, Star, CreditCard
} from "lucide-react";
import {ThemeToggle} from "@/components/ThemeToggle";

export const metadata: Metadata = {
    title: "Motor Ambos — Roadside & On-Demand Car Care",
    description:
        "Decentralised network of verified mechanics & car-care providers. Roadside help + CAFU-style services (fuel, wash, oil, tyres, battery) with transparent pricing.",
};

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Skip link */}
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            {/* Header */}
            <header
                className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-base sm:text-lg"
                            aria-label="Motor Ambos home"
                        >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/25">
                <Car className="h-4.5 w-4.5 text-primary"/>
              </span>
                            Motor Ambos
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                            <TopNavLink href="#how">How it works</TopNavLink>
                            <TopNavLink href="#services">Services</TopNavLink>
                            <TopNavLink href="#membership">Membership & App</TopNavLink>
                            <TopNavLink href="/login">Log in</TopNavLink>
                            <Button asChild className="shadow-sm hover:shadow">
                                <Link href="/signup">Sign up</Link>
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
            </header>

            {/* HERO — neon gradient ribbon */}
            <section className="relative isolate overflow-hidden border-b">
                {/* === Backgrounds === */}
                {/* Neon ribbon sweep */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute inset-x-[-20%] top-[-35%] h-[140%] rotate-[-3deg]
                 bg-[conic-gradient(at_10%_10%,theme(colors.primary)_0deg,theme(colors.accent/70)_130deg,transparent_240deg)]
                 opacity-30 blur-3xl"
                    />
                </div>

                {/* Soft spotlight */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[40rem]
               -translate-x-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25"
                />

                {/* Subtle grid overlay */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]
               bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)]
               bg-[size:36px_36px]"
                />

                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 md:py-24">
                    <div className="max-w-3xl">
                        <Badge variant="secondary" className="mb-4 rounded-full">
                            Decentralised car-care network
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
        <span className="relative inline-block">
          <span className="bg-gradient-to-r from-primary via-foreground/90 to-primary bg-clip-text text-transparent">
            Get help for your car
          </span>
            {/* Accent underline */}
            <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[6px] w-full rounded-full bg-accent/70 blur-[1px]"
            />
        </span>{" "}
                            — fast, transparent, anywhere.
                        </h1>

                        <p className="mt-5 text-base md:text-lg/7 text-muted-foreground">
                            MotorAmbos connects drivers to nearby, verified mechanics and on-demand providers.
                            See pricing up front, choose by distance and rating, and connect instantly.
                            Providers don’t need an app — SMS works out of the box.
                        </p>

                        {/* Highlights */}
                        <div
                            className="mt-7 inline-flex flex-wrap items-center gap-3 rounded-2xl border bg-card/80 px-3 py-2 ring-4 ring-primary/10">
                            <HeroChip icon={<MapPin className="h-3.5 w-3.5"/>} text="Launching in Accra"/>
                            <HeroChip icon={<Shield className="h-3.5 w-3.5"/>} text="Verified providers"/>
                            <HeroChip icon={<PhoneCall className="h-3.5 w-3.5"/>} text="SMS-ready"/>
                        </div>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="h-11 px-6 shadow-sm hover:shadow-md">
                                <Link href="/help">
                                    Get help now <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="secondary" className="h-11 px-6">
                                <Link href="/providers">Become a provider</Link>
                            </Button>
                        </div>

                        {/* Service chips */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {[
                                {icon: <Wrench className="h-4 w-4"/>, label: "Roadside"},
                                {icon: <Fuel className="h-4 w-4"/>, label: "Fuel delivery"},
                                {icon: <Sparkles className="h-4 w-4"/>, label: "Car wash"},
                                {icon: <Droplet className="h-4 w-4"/>, label: "Oil change"},
                                {icon: <BatteryCharging className="h-4 w-4"/>, label: "Battery"},
                                {icon: <ToolCase className="h-4 w-4"/>, label: "Tyres"},
                            ].map((s) => (
                                <span
                                    key={s.label}
                                    className="inline-flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs shadow-sm
                       transition-colors hover:border-primary/50"
                                >
            {s.icon}
                                    {s.label}
          </span>
                            ))}
                        </div>

                        {/* Trust bar */}
                        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:max-w-2xl">
                            <div className="rounded-lg border bg-background/70 px-3 py-2">
                                <dt className="text-muted-foreground">Avg. response</dt>
                                <dd className="font-semibold">~12 min</dd>
                            </div>
                            <div className="rounded-lg border bg-background/70 px-3 py-2">
                                <dt className="text-muted-foreground">Verified providers</dt>
                                <dd className="font-semibold">100% KYC</dd>
                            </div>
                            <div className="rounded-lg border bg-background/70 px-3 py-2 sm:col-span-1 col-span-2">
                                <dt className="text-muted-foreground">Coverage</dt>
                                <dd className="font-semibold">Accra (expanding)</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>
            {/* Content anchor */}
            <div id="content"/>

            {/* WHY — colourful lines instead of cards */}
            <section className="relative bg-card border-b" aria-labelledby="value-heading">
                {/* colored band behind section title */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-12 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15"/>
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="value-heading" className="text-xl font-semibold tracking-tight">Why MotorAmbos?</h2>

                    <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <VariantRow
                            icon={<Shield className="h-5 w-5" aria-hidden="true"/>}
                            title="Trusted network"
                            body="We verify providers and show ratings so you choose with confidence."
                        />
                        <VariantRow
                            icon={<Navigation2 className="h-5 w-5" aria-hidden="true"/>}
                            title="Nearby in minutes"
                            body="Sorted by distance, coverage radius, and availability to cut wait times."
                        />
                        <VariantRow
                            icon={<ToolCase className="h-5 w-5" aria-hidden="true"/>}
                            title="Transparent pricing"
                            body="See callout fees and rate cards up front — no surprises."
                        />
                    </ul>
                </div>
            </section>

            {/* SERVICES — split lists with accents */}
            <section id="services" className="relative bg-background border-b" aria-labelledby="services-heading">
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-10 bg-gradient-to-r from-accent/20 via-transparent to-accent/20"/>
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="services-heading" className="text-2xl md:text-3xl font-bold">Services</h2>

                    <div className="mt-6 grid gap-10 md:grid-cols-2">
                        <ServiceList title="Roadside assistance" icon={<Wrench className="h-5 w-5"/>}
                                     items={["Jumpstart", "Towing", "Diagnostics", "Tyre change", "Lockout"]}/>
                        <ServiceList title="Fuel delivery" icon={<Fuel className="h-5 w-5"/>}
                                     items={["Petrol & diesel top-ups", "Emergency refuel"]}/>
                        <ServiceList title="Oil change" icon={<Droplet className="h-5 w-5"/>}
                                     items={["Engine oil & filter", "Service reminder log"]}/>
                        <ServiceList title="Battery & tyres" icon={<BatteryCharging className="h-5 w-5"/>}
                                     items={["Jumpstart & test", "On-site replacement", "Tyre patch/replace"]}/>
                        <ServiceList title="Car wash & detailing" icon={<Sparkles className="h-5 w-5"/>}
                                     items={["Waterless wash", "Interior clean", "Full detail (on-site)"]}/>
                        <ServiceList title="Fleet & membership" icon={<Truck className="h-5 w-5"/>}
                                     items={["Priority response", "Discounted rates", "Monthly subscriptions"]}/>
                    </div>
                </div>
            </section>

            {/* MEMBERSHIP & APP — panel look, no borders */}
            <section id="membership" className="relative bg-card border-b" aria-labelledby="mem-heading">
                <div
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_10%_10%,theme(colors.primary/12),transparent_70%)] dark:bg-[radial-gradient(60%_40%_at_10%_10%,theme(colors.primary/15),transparent_70%)]"/>
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="mem-heading" className="text-2xl md:text-3xl font-bold">Membership & Mobile App</h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-2">
                        <section
                            className="rounded-2xl bg-background/80 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,.25)] ring-1 ring-border">
                            <header className="flex items-center gap-2">
                                <Crown className="h-5 w-5 text-primary"/>
                                <h3 className="text-lg font-semibold">MotorAmbos Membership</h3>
                            </header>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Priority response, member pricing, and a digital card (Wallet, QR/NFC).
                                Works online or offline with provider SMS verification.
                            </p>

                            <ul className="mt-4 grid gap-2 text-sm">
                                <Li icon={<Star className="h-4 w-4"/>}>Priority dispatch</Li>
                                <Li icon={<CreditCard className="h-4 w-4"/>}>Member pricing</Li>
                                <Li icon={<QrCode className="h-4 w-4"/>}>QR / NFC verification</Li>
                            </ul>

                            <div className="mt-5 flex gap-2">
                                <Button asChild><Link href="/membership">See plans</Link></Button>
                                <Button asChild variant="outline"><Link href="/wallet">Add to Wallet</Link></Button>
                            </div>
                        </section>

                        <section
                            className="rounded-2xl bg-background/80 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,.25)] ring-1 ring-border">
                            <header className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-primary"/>
                                <h3 className="text-lg font-semibold">The App (driver first)</h3>
                            </header>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Request help, compare providers, chat with SMS fallback, and track jobs.
                                Providers can stay SMS-only or upgrade to the PWA later.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                <Chip>Live location & ETA</Chip>
                                <Chip>Rate cards & reviews</Chip>
                                <Chip>Receipts & history</Chip>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <Button asChild variant="secondary"><Link href="/app">Get the app</Link></Button>
                                <Button asChild variant="ghost"><Link href="/learn">Learn more</Link></Button>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            {/* HOW — driver & provider */}
            <section id="how" className="bg-background" aria-labelledby="how-heading">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="how-heading" className="text-2xl md:text-3xl font-bold">
                        How to get help & become a provider
                    </h2>

                    <div className="mt-8 grid gap-10 lg:grid-cols-2">
                        <section>
                            <h3 className="text-lg font-semibold">For Drivers</h3>
                            <div className="mt-4 space-y-3">
                                <StepRow n="1"
                                         text="Tell us your location & issue (fuel, wash, oil, battery, tyres, roadside)."/>
                                <StepRow n="2"
                                         text="Compare providers by distance, rating, and price. Pick your match."/>
                                <StepRow n="3"
                                         text="Connect instantly. Use chat or SMS fallback; pay provider directly."/>
                            </div>
                            <div className="mt-5">
                                <Button asChild><Link href="/help">Get help</Link></Button>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary"/>
                                <h3 className="text-lg font-semibold">For Providers</h3>
                            </div>
                            <div className="mt-4 space-y-3">
                                <StepRow n="1" text="Apply and get verified (ID + service checks)."/>
                                <StepRow n="2" text="Set your coverage radius, callout fee, and rate card."/>
                                <StepRow n="3" text="Receive jobs by SMS; reply to accept. Upgrade to PWA when ready."/>
                            </div>
                            <div className="mt-5 flex gap-2">
                                <Button asChild variant="secondary"><Link href="/providers">Apply as a
                                    provider</Link></Button>
                                <Button asChild variant="ghost"><Link href="/providers/faq">Provider FAQ</Link></Button>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section aria-labelledby="cta-heading" className="relative bg-secondary text-secondary-foreground">
                <div
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_80%_0%,theme(colors.primary/18),transparent_70%)]"/>
                <div
                    className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 id="cta-heading" className="text-xl md:text-2xl font-bold">Need help right now?</h3>
                        <p className="text-sm md:text-base text-secondary-foreground/80">
                            Request a nearby provider in a few taps — fuel, wash, oil, tyres, battery or roadside.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild size="lg" className="h-11 px-6"><Link href="/help">Get help</Link></Button>
                        <Button asChild size="lg" variant="outline" className="h-11 px-6"><Link href="/providers">Become
                            a provider</Link></Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background">
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

function TopNavLink({href, children}: { href: string; children: React.ReactNode }) {
    return (
        <Button asChild variant="ghost" className="rounded-full hover:bg-primary/10">
            <Link href={href}>{children}</Link>
        </Button>
    );
}

function HeroChip({icon, text}: { icon: React.ReactNode; text: string }) {
    return (
        <span
            className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs ring-1 ring-primary/10">
      {icon}
            <span className="font-medium">{text}</span>
    </span>
    );
}

function VariantRow({icon, title, body}: { icon: React.ReactNode; title: string; body: string }) {
    return (
        <li className="group">
            <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
                <div className="flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                </div>
            </div>
            <div
                className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-primary/40 transition-colors"/>
        </li>
    );
}

function ServiceList({title, icon, items}: { title: string; icon: React.ReactNode; items: string[] }) {
    return (
        <section>
            <header className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-background ring-1 ring-border">
          {icon}
        </span>
                <h3 className="text-lg font-semibold">{title}</h3>
            </header>
            <ul className="mt-3 divide-y">
                {items.map((i) => (
                    <li key={i} className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">{i}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60"/>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function Li({children, icon}: { children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2">
      <span className="grid h-5 w-5 place-items-center rounded-md bg-primary/15 text-primary">
        {icon}
      </span>
            <span>{children}</span>
        </div>
    );
}

function Chip({children}: { children: React.ReactNode }) {
    return <span className="rounded-full border bg-card px-2.5 py-1 shadow-sm">{children}</span>;
}

function StepRow({n, text}: { n: string; text: string }) {
    return (
        <div className="flex items-center gap-3">
      <span
          className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
        {n}
      </span>
            <span className="text-sm">{text}</span>
        </div>
    );
}