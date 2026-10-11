import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Bell,
    Check,
    ChevronRight,
    ClipboardCheck,
    FileSpreadsheet,
    Smartphone,
    Truck,
    Users,
} from "lucide-react";
import { LandingFooter, LandingNav, PixelCluster } from "@/components/landing-home/HomeLanding";
import MarketingMotion from "@/components/landing-home/MarketingMotion";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("Fleet Management", "Manage fleet vehicles, drivers, car papers, renewal reminders, and roadside requests with Motor Ambos.", "/business");

const quickCards = [
    { icon: ClipboardCheck, title: "See what needs attention", description: "Know which vehicles are ready, renewing soon, or overdue." },
    { icon: Smartphone, title: "Handle it from your phone", description: "Renew papers, invite drivers, and check your fleet in the app." },
    { icon: Truck, title: "Stay close to roadside jobs", description: "See when a driver needs help and follow the request." },
];

const workflow = [
    { number: "01", label: "Vehicle status" },
    { number: "02", label: "Expiry alerts" },
    { number: "03", label: "Driver access" },
    { number: "04", label: "Roadside updates" },
];

function FleetOverviewVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[390px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-center justify-between">
                    <div><span className="block text-[12px] text-[#777]">Fleet overview</span><span className="text-[18px] font-medium">Your vehicles</span></div>
                    <Bell className="h-5 w-5 text-[#1111F6]" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-[#EEF7F2] p-3"><span className="block text-[21px] text-[#277E62]">08</span><span className="text-[11px] text-[#555]">Ready</span></div>
                    <div className="rounded-lg bg-[#FFF7E9] p-3"><span className="block text-[21px] text-[#A66E21]">02</span><span className="text-[11px] text-[#555]">Renew soon</span></div>
                    <div className="rounded-lg bg-[#FBEDEF] p-3"><span className="block text-[21px] text-[#B84457]">01</span><span className="text-[11px] text-[#555]">Overdue</span></div>
                </div>
                <div className="mt-4 divide-y divide-[#EFEFEF] text-[12px]">
                    <div className="flex justify-between py-2"><span>Vehicle 01</span><span className="text-[#277E62]">Ready</span></div>
                    <div className="flex justify-between py-2"><span>Vehicle 02</span><span className="text-[#A66E21]">Renew soon</span></div>
                </div>
            </div>
        </div>
    );
}

function RenewalsVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[370px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#1111F6]"><ClipboardCheck className="h-5 w-5" /></span><span className="text-[16px] font-medium">Renewal list</span></div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[12px]"><span>Insurance · Vehicle 02</span><span className="text-[#A66E21]">Soon</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[12px]"><span>Roadworthy · Vehicle 05</span><span className="text-[#A66E21]">Soon</span></div>
                    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] px-4 py-3 text-[12px]"><span>Licence · Vehicle 08</span><Check className="h-4 w-4 text-[#277E62]" /></div>
                </div>
            </div>
        </div>
    );
}

function RoadsideVisual() {
    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#F1F3FF] p-3">
            <Image src="/images/roadside-tow.webp" alt="A tow truck helping a stranded fleet vehicle" width={1400} height={700} sizes="(max-width: 768px) 90vw, 520px" className="h-full w-full max-w-[520px] object-contain" />
        </div>
    );
}

function AdminVisual() {
    return (
        <div className="flex h-full items-center justify-center bg-[#FCFCFC] p-5 sm:p-8">
            <div className="w-full max-w-[390px] rounded-[18px] border border-[#EAEAEA] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="mb-5 flex items-center justify-between"><div><span className="block text-[12px] text-[#777]">Web dashboard</span><span className="text-[17px] font-medium">Fleet admin</span></div><FileSpreadsheet className="h-5 w-5 text-[#1111F6]" /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#EEEEEE] p-4"><FileSpreadsheet className="mb-3 h-5 w-5 text-[#1111F6]" /><span className="block text-[12px]">Bulk uploads</span></div>
                    <div className="rounded-lg border border-[#EEEEEE] p-4"><Users className="mb-3 h-5 w-5 text-[#1111F6]" /><span className="block text-[12px]">Team roles</span></div>
                </div>
                <div className="mt-3 rounded-lg border border-[#EEEEEE] px-4 py-3 text-[12px]">Reports, billing, and invoices</div>
            </div>
        </div>
    );
}

const features = [
    { title: "A clear view on your phone", description: "Check every vehicle at a glance, then open its papers, reminders, and roadside history.", visual: <FleetOverviewVisual /> },
    { title: "Renew what needs renewing", description: "See upcoming expiries, then request a renewal for one vehicle or several.", visual: <RenewalsVisual /> },
    { title: "Know when a driver needs help", description: "Follow roadside requests and stay informed while help is being arranged.", visual: <RoadsideVisual /> },
    { title: "Web tools for the admin work", description: "Use the dashboard for bulk uploads, reports, billing, invoices, and team setup.", visual: <AdminVisual /> },
];

export default function BusinessPage() {
    return (
        <main className="base-landing marketing-motion min-h-screen overflow-x-hidden bg-white text-[#171717]">
            <MarketingMotion />
            <LandingNav />

            <section className="relative overflow-hidden px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-32 lg:px-16 lg:pt-36 lg:text-left">
                <PixelCluster className="left-[8%] top-[38%] opacity-40" heights={[10, 18, 29, 15, 42, 25, 12]} />
                <PixelCluster className="right-[9%] top-[44%] opacity-45" heights={[18, 38, 65, 88, 70, 43, 20]} />
                <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[0.93fr_1.07fr] lg:gap-4">
                    <div className="order-2 lg:order-1">
                    <p className="mb-5 text-[14px] text-[#777]">Motor Ambos for fleets of 5–50 vehicles</p>
                    <h1 className="text-[38px] font-normal leading-[1.06] tracking-[-0.04em] sm:text-[56px] lg:text-[62px] xl:text-[70px]">Every vehicle ready.<br />Every driver supported.</h1>
                    <p className="mx-auto mt-5 max-w-[760px] text-[16px] leading-[1.4] tracking-[-0.025em] text-[#858585] sm:mt-6 sm:text-[18px] md:text-[20px]">Run your fleet from your phone, stay ahead of papers, and know when a driver needs roadside help.</p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                        <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[16px] text-white transition-colors hover:bg-[#0606D8]"><span className="h-4 w-4 rounded-[2px] bg-white" />Set up your fleet <ChevronRight className="h-4 w-4" /></Link>
                        <Link href="/help" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E8E8E8] px-5 text-[16px] transition-colors hover:bg-[#F8F8F8]">Explore roadside help</Link>
                    </div>
                    <p className="mt-6 text-[13px] text-[#888]">Monthly pricing per vehicle, with roadside help included.</p>
                    </div>
                    <div className="relative order-1 mx-auto w-full max-w-[680px] lg:order-2">
                        <div aria-hidden="true" className="absolute inset-x-[15%] bottom-[12%] h-[45%] rounded-full bg-[#E9EBFF] opacity-50 blur-[65px]" />
                        <Image src="/images/fleet-vehicles.webp" alt="A small fleet of Motor Ambos vehicles" width={1400} height={933} priority sizes="(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 650px" className="relative h-auto w-full object-contain" />
                    </div>
                </div>
            </section>

            <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-16">
                <div className="mx-auto grid max-w-[1136px] gap-4 md:grid-cols-3">
                    {quickCards.map(({ icon: Icon, title, description }) => (
                        <article key={title} className="min-h-[168px] rounded-[12px] border border-[#ECECEC] p-5">
                            <Icon className="mb-5 h-7 w-7 text-[#1111F6]" strokeWidth={1.8} />
                            <h2 className="mb-2 text-[18px] font-normal tracking-[-0.025em]">{title}</h2>
                            <p className="text-[16px] leading-[1.4] text-[#777]">{description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-[#F7F7F7] px-5 py-16 text-center sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <h2 className="text-[30px] font-normal leading-[1.1] tracking-[-0.035em] md:text-[36px]">Daily work in the app. Admin work on the web.</h2>
                    <p className="mt-4 text-[16px] leading-relaxed text-[#777]">One fleet view connects the vehicles, drivers, papers, and roadside updates you manage.</p>
                    <div className="mt-14 grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
                        {workflow.map((item, index) => (
                            <div key={item.number} className={index === 0 ? "px-4" : index === 2 ? "px-4 md:border-l md:border-[#E4E4E4]" : "border-l border-[#E4E4E4] px-4"}>
                                <div className="text-[30px] tracking-[-0.045em] md:text-[36px]">{item.number}</div>
                                <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[#777] md:text-[12px]">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 py-16 sm:px-8 md:py-28 lg:px-16">
                <div className="mx-auto max-w-[1136px]">
                    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <h2 className="max-w-[650px] text-[32px] font-normal leading-[1.12] tracking-[-0.04em] md:text-[42px]">A clearer way to keep <span className="text-[#898989]">every vehicle moving.</span></h2>
                        <Link href="/login" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#E8E8E8] px-5 text-[16px] transition-colors hover:bg-[#F8F8F8] md:self-auto">Get started <ChevronRight className="h-4 w-4" /></Link>
                    </div>
                    <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                        {features.map((feature) => (
                            <article key={feature.title}>
                                <div className="h-[220px] overflow-hidden rounded-[12px] border border-[#ECECEC] sm:h-[260px] md:h-[310px]">{feature.visual}</div>
                                <h3 className="mt-6 text-[20px] font-normal tracking-[-0.025em]">{feature.title}</h3>
                                <p className="mt-2 max-w-[520px] text-[16px] leading-[1.45] text-[#777]">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#1111F6] px-5 py-20 text-white sm:px-8 md:py-24 lg:px-16">
                <PixelCluster className="right-[12%] bottom-[-10%] opacity-55" heights={[24, 55, 88, 123, 156, 120, 75, 35]} />
                <div className="relative z-10 mx-auto max-w-[1136px]">
                    <h2 className="text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">Bring your fleet together.</h2>
                    <p className="mt-4 max-w-[470px] text-[16px] leading-[1.45] text-white/70">Start with your vehicles and drivers. Motor Ambos can help get their papers organized.</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-[16px] text-[#171717] transition-colors hover:bg-[#F1F1F1]"><span className="h-4 w-4 rounded-[2px] bg-[#1111F6]" />Set up your fleet</Link>
                        <Link href="/help" className="inline-flex h-12 items-center justify-center rounded-full bg-white/20 px-5 text-[16px] text-white transition-colors hover:bg-white/30">Roadside help <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </main>
    );
}
