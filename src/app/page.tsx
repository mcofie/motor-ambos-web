import Link from "next/link";
import type {Metadata} from "next";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"; // Assuming shadcn Sheet
import {ThemeToggle} from "@/components/ThemeToggle";
import Image from "next/image";
import {
    Car,
    Menu,
    Zap,
    Wrench,
    Truck,
    BatteryCharging,
    Droplet,
    Disc,
    MapPin,
    Smartphone,
    CreditCard,
    CheckCircle2, ShieldCheck, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Motor Ambos — The Modern Roadside Network",
    description:
        "On-demand car care and roadside assistance. Fuel, wash, oil, tyres, battery — delivered to your location.",
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-lime-500/30">
            <Navbar/>

            <main className="flex flex-col">
                <HeroSection/>
                <ServicesSection/>
                <MembershipSection/>
                <WhyUsSection/>
                <AppShowcaseSection/>
                <CTAStrip/>
            </main>

            <Footer/>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                 */

/* -------------------------------------------------------------------------- */

function Navbar() {
    const navLinks = [
        {href: "#services", label: "Services"},
        {href: "#membership", label: "Membership"},
        {href: "#why", label: "Why Us"},
    ];

    return (
        <header
            className="fixed top-0 z-50 w-full border-b border-white/5 bg-zinc-950/60 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400 ring-1 ring-lime-400/20 transition-all group-hover:bg-lime-400 group-hover:text-black">
                        <Car className="h-4 w-4"/>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">
            Motor Ambos
          </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-4 w-px bg-white/10"/>
                    <ThemeToggle/>
                    <Button
                        asChild
                        className="bg-lime-400 text-zinc-950 hover:bg-lime-500 font-semibold"
                    >
                        <Link href="/signup">Join Network</Link>
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle/>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-300">
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-950 border-l-zinc-800 text-white">
                            <div className="flex flex-col gap-6 mt-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-semibold hover:text-lime-400"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button asChild className="mt-4 bg-lime-400 text-zinc-950">
                                    <Link href="/signup">Join Network</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-zinc-950">

            {/* --- BACKGROUND IMAGE START --- */}
            <div className="absolute inset-0 -z-20 h-full w-full">
                <Image
                    src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop"
                    alt="Car repair background"
                    fill
                    priority
                    className="object-cover opacity-20 mix-blend-screen"
                />
                {/* Gradient overlay to fade image into the dark background */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950"/>
            </div>
            {/* --- BACKGROUND IMAGE END --- */}

            {/* Existing Background Effects (Lime Glow) */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/20 rounded-full blur-[120px] -z-10 opacity-40 pointer-events-none"/>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] -z-10"/>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center relative z-10">
                <div
                    className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-3 py-1 text-xs font-medium text-lime-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ShieldCheck className="h-3.5 w-3.5"/>
                    <span>Verified Providers • Transparent Pricing</span>
                </div>

                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:leading-[1.1] mb-6">
                    Car trouble? <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-500">
            Help is minutes away.
          </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-zinc-400 mb-10 leading-relaxed">
                    The decentralized network connecting you to the closest trusted
                    mechanics. From emergency rescue to scheduled maintenance—everything
                    your car needs, on demand.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto h-12 px-8 text-base bg-lime-400 text-zinc-950 hover:bg-lime-500 font-bold"
                    >
                        <Link href="/help">
                            Request Assistance <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto h-12 px-8 text-base border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white backdrop-blur-sm"
                    >
                        <Link href="#services">Explore Services</Link>
                    </Button>
                </div>

                {/* Trust Badge */}
                <div
                    className="mt-12 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xs font-medium tracking-widest uppercase text-zinc-500">
            Trusted by drivers across Ghana
          </span>
                </div>
            </div>
        </section>
    );
}

function ServicesSection() {
    const services = [
        {
            title: "Roadside Rescue",
            desc: "Towing, winching, and emergency coordination.",
            icon: Truck,
            colSpan: "md:col-span-2",
            bg: "bg-zinc-900",
        },
        {
            title: "Tyre Service",
            desc: "Puncture repair & replacements.",
            icon: Disc,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "Engine Health",
            desc: "Oil changes & diagnostics.",
            icon: Droplet,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "Battery Jump",
            desc: "Testing and jumpstarts.",
            icon: BatteryCharging,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
        {
            title: "General Repair",
            desc: "Mobile mechanic services.",
            icon: Wrench,
            colSpan: "md:col-span-1",
            bg: "bg-zinc-900",
        },
    ];

    return (
        <section id="services" className="py-24 bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-2">
                            Comprehensive Care
                        </h2>
                        <p className="text-zinc-400 max-w-md">
                            Everyday maintenance or emergency situations. We have you covered.
                        </p>
                    </div>
                    <Button variant="link" className="text-lime-400 p-0 h-auto">
                        View full rate card <ArrowRight className="ml-1 h-4 w-4"/>
                    </Button>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((s, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl border border-zinc-800 ${s.bg} p-8 transition-all hover:border-lime-400/30 hover:bg-zinc-800/80 ${s.colSpan}`}
                        >
                            <div
                                className="absolute right-4 top-4 rounded-full bg-zinc-950/50 p-2 text-zinc-400 group-hover:text-lime-400 transition-colors">
                                <s.icon className="h-6 w-6"/>
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-zinc-400">{s.desc}</p>
                            </div>

                            {/* Gradient Overlay on Hover */}
                            <div
                                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-lime-400/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MembershipSection() {
    return (
        <section id="membership" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800">
                    {/* Decorative Blob */}
                    <div
                        className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-lime-500/20 blur-[100px] rounded-full pointer-events-none"/>

                    <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
                        <div className="space-y-6">
                            <Badge variant="outline" className="border-lime-400/30 text-lime-400 bg-lime-400/10">
                                Motor Ambos Club
                            </Badge>
                            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                                Drive with confidence. <br/> Join the Club.
                            </h2>
                            <ul className="space-y-4 text-zinc-300">
                                {[
                                    "Priority response for breakdowns",
                                    "Discounted callout fees",
                                    "Free annual vehicle health check",
                                    "Concierge repair coordination"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-lime-400 shrink-0"/>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold">
                                    Become a Member
                                </Button>
                                <Button variant="ghost" className="text-white hover:text-lime-400 hover:bg-zinc-800">
                                    Compare Plans
                                </Button>
                            </div>
                        </div>

                        <div
                            className="relative mx-auto w-full max-w-md aspect-[1.58/1] rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* CSS-only Card Mockup */}
                            <div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 shadow-2xl flex flex-col justify-between p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <Car className="text-lime-400 h-8 w-8"/>
                                    <span className="font-mono text-xs text-zinc-500">MEMBER ID</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold tracking-wider mb-1">JOHN DOE</div>
                                    <div className="text-xs text-zinc-400 font-mono">**** **** **** 4291</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span
                                        className="text-[10px] bg-lime-400 text-black px-2 py-0.5 rounded font-bold">PREMIUM</span>
                                    <div className="h-8 w-12 bg-zinc-700 rounded-md opacity-50"/>
                                    {/* Chip */}
                                </div>

                                {/* Shine Effect */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function WhyUsSection() {
    const features = [
        {icon: ShieldCheck, title: "Verified Network", text: "We vet every provider. See prices and ratings upfront."},
        {icon: MapPin, title: "Smart Matching", text: "We rank providers by distance, availability, and rating."},
        {icon: CreditCard, title: "Clear Pricing", text: "Transparent callout fees. Receipts stored digitally."},
        {icon: Smartphone, title: "Seamless App", text: "Book in taps, track your provider live, and chat instantly."},
        {icon: Zap, title: "Fast Response", text: "Our algorithm prioritizes the closest active unit to you."},
        {icon: Truck, title: "All Vehicles", text: "From motorbikes to SUVs, we have the right gear for the job."},
    ];

    return (
        <section id="why" className="py-24 bg-zinc-950 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Why Motor Ambos?</h2>
                    <p className="text-zinc-400">
                        We are building the operating system for African roadside assistance.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i}
                             className="flex flex-col items-start p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-lime-400/20 transition-colors">
                            <div
                                className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lime-400 mb-4">
                                <f.icon className="h-5 w-5"/>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AppShowcaseSection() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div
                    className="rounded-3xl bg-lime-400 text-zinc-900 px-8 pt-12 pb-0 md:px-20 md:pt-20 md:flex items-center justify-between relative overflow-hidden">

                    <div className="md:w-1/2 pb-12 md:pb-20 z-10 relative">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            The workshop <br/> in your pocket.
                        </h2>
                        <p className="text-zinc-800 font-medium text-lg mb-8 max-w-md">
                            Download the Motor Ambos app to manage your garage, track requests, and pay securely.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Mock App Store Buttons */}
                            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-6 rounded-xl">
                                Download on iOS
                            </Button>
                            <Button
                                className="bg-transparent border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900/10 h-12 px-6 rounded-xl">
                                Get it on Android
                            </Button>
                        </div>
                    </div>

                    <div
                        className="md:w-1/2 flex justify-center md:justify-end relative z-10 translate-y-4 md:translate-y-0">
                        {/* Replace with actual Image of iPhone */}
                        <div
                            className="w-64 h-[500px] bg-zinc-900 rounded-t-[3rem] border-[8px] border-zinc-900 shadow-2xl relative overflow-hidden">
                            <div
                                className="absolute inset-0 bg-zinc-800 flex items-center justify-center text-zinc-600">
                                [App Screen Mockup]
                            </div>
                        </div>
                    </div>

                    {/* Background Texture */}
                    <div
                        className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] pointer-events-none mix-blend-overlay"/>
                </div>
            </div>
        </section>
    );
}

function CTAStrip() {
    return (
        <section className="border-t border-zinc-800 bg-zinc-950 py-12">
            <div
                className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-sm font-bold text-lime-400 uppercase tracking-wider mb-1">24/7 Support</p>
                    <h3 className="text-xl font-semibold text-white">Stuck right now?</h3>
                    <p className="text-zinc-400 text-sm">Our network is active. Request help without a membership.</p>
                </div>
                <Button className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-full px-8">
                    Get Help Now
                </Button>
            </div>
        </section>
    );
}

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-zinc-800 bg-zinc-950 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="h-6 w-6 text-lime-400"/>
                            <span className="font-bold text-white">Motor Ambos</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            Decentralised network of verified mechanics & car-care providers built for African roads.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-lime-400">Roadside Assistance</Link></li>
                            <li><Link href="#" className="hover:text-lime-400">Mobile Mechanics</Link></li>
                            <li><Link href="#" className="hover:text-lime-400">Membership</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-lime-400">About Us</Link></li>
                            <li><Link href="#" className="hover:text-lime-400">Careers</Link></li>
                            <li><Link href="#" className="hover:text-lime-400">For Mechanics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-lime-400">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-lime-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div
                    className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>© {year} MotorAmbos. All rights reserved.</p>
                    <p>Made for drivers.</p>
                </div>
            </div>
        </footer>
    );
}