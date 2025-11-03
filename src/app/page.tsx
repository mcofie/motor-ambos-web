// src/app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Wrench,
    Car,
    Shield,
    PhoneCall,
    MapPin,
    ArrowRight,
    Menu,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Motor Ambos — Roadside help, simplified",
    description:
        "Find verified mechanics nearby with transparent pricing and instant contact. Motor Ambos makes roadside help fast and simple.",
};

/**
 * Minimal, solid-color landing page
 * - Mobile-first, no gradients, strong type
 * - Solid bands for visual hierarchy
 * - Buttons use `asChild` to avoid nested <a> in <button> warnings
 */
export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Skip link for a11y */}
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
            >
                Skip to content
            </a>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-base sm:text-lg"
                            aria-label="Motor Ambos home"
                        >
                            <Car className="h-5 w-5" />
                            Motor Ambos
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                            <Button asChild variant="ghost">
                                <Link href="#how">How it works</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link href="#pricing">Pricing</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign up</Link>
                            </Button>
                        </nav>

                        {/* Mobile menu button (placeholder; hook up to a sheet/drawer later) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section
                className="bg-primary text-primary-foreground"
                aria-labelledby="hero-heading"
            >
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-20">
                    <div className="max-w-3xl">
                        <Badge variant="secondary" className="rounded-full mb-3">
                            Roadside help, simplified
                        </Badge>

                        <h1
                            id="hero-heading"
                            className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
                        >
                            Find a verified mechanic near you — fast.
                        </h1>

                        <p className="mt-4 text-sm sm:text-base md:text-lg/7 text-primary-foreground/90">
                            Motor Ambos connects drivers to nearby mechanics with transparent
                            pricing and instant contact. No apps to install for providers —
                            SMS works out of the box.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Button asChild size="lg" className="h-11 px-6">
                                <Link href="/help">
                                    Get roadside help <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="secondary" className="h-11 px-6">
                                <Link href="/providers">Become a provider</Link>
                            </Button>
                        </div>

                        <ul
                            className="mt-6 flex flex-wrap gap-3 text-xs sm:text-sm text-primary-foreground/85"
                            aria-label="Highlights"
                        >
                            <li className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" /> Start in Accra — expanding
                                soon
                            </li>
                            <li className="inline-flex items-center gap-1">
                                <Shield className="h-3.5 w-3.5" /> Verified mechanics
                            </li>
                            <li className="inline-flex items-center gap-1">
                                <PhoneCall className="h-3.5 w-3.5" /> SMS notifications
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Content anchor */}
            <div id="content" />

            {/* Value props */}
            <section className="bg-card" aria-labelledby="value-heading">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="value-heading" className="sr-only">
                        Why choose Motor Ambos
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ValueCard
                            icon={<Wrench className="h-5 w-5" aria-hidden="true" />}
                            title="Verified mechanics"
                            body="We screen providers and show ratings so you can choose with confidence."
                        />
                        <ValueCard
                            icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
                            title="Nearby in minutes"
                            body="We sort by distance and availability to reduce your waiting time."
                        />
                        <ValueCard
                            icon={<Shield className="h-5 w-5" aria-hidden="true" />}
                            title="Transparent rates"
                            body="See callout fees and service price ranges before you connect."
                        />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="bg-muted" aria-labelledby="how-heading">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <h2 id="how-heading" className="text-2xl md:text-3xl font-bold">
                        How it works
                    </h2>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <StepCard
                            step="1"
                            title="Tell us your location & issue"
                            body="Share where you are and what you need: jumpstart, towing, tyre change, diagnostics, and more."
                        />
                        <StepCard
                            step="2"
                            title="Compare nearby providers"
                            body="Review distance, ratings, and rate cards. Pick the provider that suits you."
                        />
                        <StepCard
                            step="3"
                            title="Connect instantly"
                            body="We notify the mechanic. Use in-app chat or SMS fallback — your choice."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="bg-background" aria-labelledby="pricing-heading">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <h2 id="pricing-heading" className="text-2xl md:text-3xl font-bold">
                                Pricing
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                You only pay when you book a provider. No subscriptions for drivers.
                            </p>
                        </div>
                        <Button asChild variant="ghost" className="self-start sm:self-auto">
                            <Link href="/pricing">See details</Link>
                        </Button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border p-5 bg-card">
                            <h3 className="text-lg font-semibold">Driver</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Free to use. You’ll see provider rates and callout fees upfront.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>• Nearby search & instant contact</li>
                                <li>• Transparent rate cards</li>
                                <li>• SMS fallback for offline providers</li>
                            </ul>
                            <div className="mt-5">
                                <Button asChild>
                                    <Link href="/help">Get roadside help</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border p-5 bg-card">
                            <h3 className="text-lg font-semibold">Provider</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Join for free. Pay a small commission per completed job.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>• Appear in nearby searches</li>
                                <li>• Define coverage radius & callout fee</li>
                                <li>• Rate cards for pricing transparency</li>
                            </ul>
                            <div className="mt-5">
                                <Button asChild variant="secondary">
                                    <Link href="/providers">Apply as a provider</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA band */}
            <section
                aria-labelledby="cta-heading"
                className="bg-secondary text-secondary-foreground"
            >
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 id="cta-heading" className="text-xl md:text-2xl font-bold">
                            Need roadside help right now?
                        </h3>
                        <p className="text-sm md:text-base text-secondary-foreground/80">
                            Request a nearby mechanic in a few taps.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild size="lg" className="h-11 px-6">
                            <Link href="/help">Get help</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-11 px-6">
                            <Link href="/providers">Become a provider</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 text-sm text-muted-foreground">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>© {new Date().getFullYear()} Motor Ambos</div>
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

/* ---------- Presentational bits ---------- */

function ValueCard({
                       icon,
                       title,
                       body,
                   }: {
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <div className="rounded-xl border bg-card p-5">
            <div
                className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                aria-hidden="true"
            >
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
    );
}

function StepCard({
                      step,
                      title,
                      body,
                  }: {
    step: string;
    title: string;
    body: string;
}) {
    return (
        <div className="rounded-xl border bg-background p-5">
            <div className="mb-2 inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-foreground text-background text-xs font-semibold">
                {step}
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
    );
}