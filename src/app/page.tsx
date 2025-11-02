// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Car, Shield, PhoneCall, MapPin, ArrowRight } from "lucide-react";

/**
 * Bold, minimal landing page with solid colors (no gradients).
 * - Section blocks: solid backgrounds, strong type, tight spacing.
 * - Primary CTA appears in the hero and lower CTA band.
 * - Mobile-first, scales up cleanly.
 */
export default function LandingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                        <Car className="h-5 w-5" />
                        Motor Ambos
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Link href="#how">
                            <Button variant="ghost">How it works</Button>
                        </Link>
                        <Link href="#pricing">
                            <Button variant="ghost">Pricing</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Sign up</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero (solid primary band) */}
            <section className="bg-primary text-primary-foreground">
                <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
                    <div className="max-w-3xl">
                        <Badge variant="secondary" className="rounded-full mb-4">
                            Roadside help, simplified
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Find a verified mechanic near you — fast.
                        </h1>
                        <p className="mt-4 text-base md:text-lg text-primary-foreground/90">
                            Motor Ambos connects drivers to nearby mechanics with transparent pricing and instant contact.
                            No apps to install for providers — SMS works out of the box.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link href="/help">
                                <Button size="lg" className="h-11 px-6">
                                    Get roadside help <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/providers">
                                <Button size="lg" variant="secondary" className="h-11 px-6">
                                    Become a provider
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 text-xs text-primary-foreground/80">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Start in Accra — expanding soon
              </span>
                            <span className="inline-flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Verified mechanics
              </span>
                            <span className="inline-flex items-center gap-1">
                <PhoneCall className="h-3.5 w-3.5" /> SMS notifications
              </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key value props (solid background = surface) */}
            <section className="bg-card">
                <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ValueCard
                            icon={<Wrench className="h-5 w-5" />}
                            title="Verified mechanics"
                            body="We screen providers and show ratings so you can choose with confidence."
                        />
                        <ValueCard
                            icon={<MapPin className="h-5 w-5" />}
                            title="Nearby in minutes"
                            body="We sort by distance and availability to reduce your waiting time."
                        />
                        <ValueCard
                            icon={<Shield className="h-5 w-5" />}
                            title="Transparent rates"
                            body="See callout fees and service price ranges before you connect."
                        />
                    </div>
                </div>
            </section>

            {/* How it works (numbered steps on muted background) */}
            <section id="how" className="bg-muted">
                <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
                    <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <StepCard
                            step="1"
                            title="Tell us your location & issue"
                            body="Share where you are and what you need: jumpstart, towing, tire change, diagnostics, and more."
                        />
                        <StepCard
                            step="2"
                            title="Compare nearby providers"
                            body="Review distance, ratings, and rate cards. Pick the provider that suits you."
                        />
                        <StepCard
                            step="3"
                            title="Connect instantly"
                            body="We notify the mechanic. Chat in-app or use SMS fallback — your choice."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing (simple, honest) */}
            <section id="pricing" className="bg-background">
                <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Pricing</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                You only pay when you book a provider. No subscriptions for drivers.
                            </p>
                        </div>
                        <Link href="/pricing">
                            <Button variant="ghost">See details</Button>
                        </Link>
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
                                <Link href="/help">
                                    <Button>Get roadside help</Button>
                                </Link>
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
                                <Link href="/providers">
                                    <Button variant="secondary">Apply as a provider</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA band (solid secondary) */}
            <section className="bg-secondary text-secondary-foreground">
                <div className="mx-auto w-full max-w-6xl px-6 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold">Need roadside help right now?</h3>
                        <p className="text-sm md:text-base text-secondary-foreground/80">
                            Request a nearby mechanic in a few taps.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/help">
                            <Button size="lg" className="h-11 px-6">
                                Get help
                            </Button>
                        </Link>
                        <Link href="/providers">
                            <Button size="lg" variant="outline" className="h-11 px-6">
                                Become a provider
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background">
                <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>© {new Date().getFullYear()} Motor Ambos</div>
                    <div className="flex gap-4">
                        <Link href="/about">About</Link>
                        <Link href="/terms">Terms</Link>
                        <Link href="/privacy">Privacy</Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}

/* ---------- Small, tidy presentational components ---------- */

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
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border">
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