import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgeCheck, ChevronDown, CircleHelp, Clock3, LifeBuoy, Lock, Phone, ShieldCheck, Wrench } from "lucide-react";
import { SmartCard } from "@/components/landing-home/SmartCardStack";
import CarPhoto from "@/components/public/CarPhoto";
import { bodyTypeFor, colourFor, type BodyType } from "@/components/public/CarIllustration";
import type { PublicCardPage, PublicPaperStatus } from "@/lib/smartCard";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T12:00:00`));

const paperTone: Record<PublicPaperStatus["state"], { label: string; tone: string; icon: typeof ShieldCheck }> = {
    valid: { label: "Valid", tone: "bg-[#EAF7F0] text-[#197252]", icon: ShieldCheck },
    due: { label: "Due soon", tone: "bg-[#FFF4DF] text-[#915C12]", icon: Clock3 },
    expired: { label: "Expired", tone: "bg-[#FFF0EF] text-[#AA3333]", icon: AlertTriangle },
    unknown: { label: "Not recorded", tone: "bg-[#F2F2F2] text-[#666]", icon: CircleHelp },
};

function Shell({ children }: { children: React.ReactNode }) {
    return <main className="base-landing min-h-[100svh] bg-[#F5F4F0] text-[#171717]">
        <header className="mx-auto flex h-16 max-w-[640px] items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.03em]"><Image src="/icon.svg" alt="" width={36} height={30} className="h-[30px] w-9" />Motor Ambos</Link>
            <span className="rounded-full bg-white px-3 py-1.5 text-[12px] text-[#1111F6] ring-1 ring-black/5">Smart Card</span>
        </header>
        {children}
    </main>;
}

function CardHero() {
    return <div className="mx-auto w-[min(78%,300px)] [container-type:inline-size]">
        <div className="smart-card-float -rotate-3"><SmartCard skin="squiggle" /></div>
    </div>;
}

function Plate({ value }: { value: string }) {
    return <span className="inline-flex h-10 items-stretch overflow-hidden rounded-[8px] border-2 border-[#171717] bg-white shadow-[0_2px_0_rgba(0,0,0,0.06)]">
        <span aria-hidden className="flex w-6 flex-col items-center justify-center gap-[2px] bg-[#F3F3F3] text-[7px] font-bold leading-none text-[#171717]">
            <span className="flex h-[9px] w-3.5 flex-col overflow-hidden rounded-[1px]"><span className="flex-1 bg-[#CE1126]" /><span className="relative flex-1 bg-[#FCD116]"><span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" /></span><span className="flex-1 bg-[#006B3F]" /></span>GH
        </span>
        <span className="flex items-center px-3 font-mono text-[16px] font-bold tracking-[0.08em]">{value}</span>
    </span>;
}

const bodyLabels: Record<BodyType, string> = { sedan: "Sedan", hatchback: "Hatchback", suv: "SUV", pickup: "Pickup", van: "Minibus" };

const licenceTone: Record<PublicPaperStatus["state"], { label: string; tone: string }> = {
    valid: { label: "Licence valid", tone: "bg-[#EAF7F0] text-[#197252]" },
    due: { label: "Licence due soon", tone: "bg-[#FFF4DF] text-[#915C12]" },
    expired: { label: "Licence expired", tone: "bg-[#FFF0EF] text-[#AA3333]" },
    unknown: { label: "Licence on file", tone: "bg-[#F2F2F2] text-[#555]" },
};

function DriverSection({ driver }: { driver: NonNullable<Extract<PublicCardPage, { state: "linked" }>["driver"]> }) {
    const initials = driver.name.replace(/\./g, "").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
    const licence = driver.licence ? licenceTone[driver.licence.state] : null;
    return <section className="mt-10" aria-labelledby="driver-heading">
        <h2 id="driver-heading" className="text-[18px] tracking-[-0.02em]">Driver</h2>
        <div className="mt-5 flex flex-col items-center text-center">
            <span className="relative h-24 w-24 overflow-hidden rounded-full bg-[linear-gradient(135deg,#1111F6,#6B6BFF)] ring-4 ring-white shadow-[0_12px_30px_-14px_rgba(20,22,60,0.45)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed photo */}
                {driver.photoUrl ? <img src={driver.photoUrl} alt={`Photo of ${driver.name}`} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-[28px] tracking-[-0.03em] text-white">{initials}</span>}
            </span>
            <p className="mt-4 text-[20px] tracking-[-0.025em]">{driver.name}</p>
            <p className="mt-0.5 text-[13px] text-[#888]">{driver.role}</p>
            {licence && <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ${licence.tone}`}><BadgeCheck className="h-3.5 w-3.5" />{licence.label}{driver.licence?.licenceClass ? ` · Class ${driver.licence.licenceClass}` : ""}</span>}
        </div>
    </section>;
}

export default function SmartCardPublicPage({ page }: { page: PublicCardPage }) {
    if (page.state === "missing") return <Shell>
        <section className="mx-auto max-w-[520px] px-5 pb-16 pt-10 text-center">
            <CardHero />
            <h1 className="mt-10 text-[30px] leading-tight tracking-[-0.04em]">We could not find this card</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#666]">The link may be mistyped, or the card may have been replaced. If you need help with a car right now, you can still find someone nearby.</p>
            <Link href="/help" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#1111F6] px-6 text-[15px] text-white"><LifeBuoy className="h-4 w-4" />Find roadside help</Link>
        </section>
    </Shell>;

    if (page.state === "unlinked") return <Shell>
        <section className="mx-auto max-w-[520px] px-5 pb-16 pt-10 text-center">
            <CardHero />
            <h1 className="mt-10 text-[30px] leading-tight tracking-[-0.04em]">This Smart Card is ready to link</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[#666]">Link it to your car and anyone you hand it to can tap to see the details you choose to share.</p>
            <Link href={`/app?link=${encodeURIComponent(page.publicId)}`} className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#1111F6] px-6 text-[15px] text-white">Link to my car <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-4 text-[13px] text-[#888]">You will be asked to sign in or create an account first.</p>
        </section>
    </Shell>;

    const papers = page.papers ? ([["Insurance", page.papers.insurance], ["Roadworthy", page.papers.roadworthy]] as const) : [];
    const chip = "inline-flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] text-[#444] ring-1 ring-black/5";

    return <Shell>
        <section className="mx-auto max-w-[640px] px-5 pb-36 pt-6 sm:pb-16">
            <div className="text-center">
                <div className="car-stage relative -mx-5 max-w-[600px] overflow-hidden px-5 pt-[clamp(40px,12vw,72px)] sm:mx-auto">
                    <div aria-hidden className="car-stage-glow absolute left-1/2 top-[46%] h-[86%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#E3E3FF_0%,rgba(227,227,255,0.55)_45%,transparent_100%)]" />
                    {page.vehicle?.model && <span aria-hidden className="car-stage-word pointer-events-none absolute inset-x-0 top-0 select-none whitespace-nowrap text-center text-[clamp(72px,24vw,150px)] font-medium leading-none tracking-[-0.06em] text-[#E8E6DF]">{page.vehicle.model}</span>}
                    <div aria-hidden className="car-stage-road absolute inset-x-0 bottom-[13%] h-[3px]" />
                    <div className="car-stage-car relative mx-auto flex aspect-[16/10] w-full max-w-[500px] items-end">
                        <CarPhoto src={page.imageUrl} make={page.vehicle?.make ?? null} model={page.vehicle?.model ?? null} color={page.vehicle?.color ?? null} alt={page.title} className="relative w-full mix-blend-multiply" />
                    </div>
                    <div aria-hidden className="car-stage-shadow relative mx-auto -mt-[7%] h-7 w-[74%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(20,22,40,0.32),rgba(20,22,40,0.08)_60%,transparent)]" />
                </div>
                <h1 className="mt-4 text-[34px] leading-[1.05] tracking-[-0.045em] sm:text-[44px]">{page.title}</h1>
                {(page.plate || page.vehicle) && <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {page.plate && <li className="flex basis-full justify-center sm:basis-auto"><Plate value={page.plate} /></li>}
                    {page.vehicle?.color && <li className={chip}><span aria-hidden className="h-3.5 w-3.5 rounded-full ring-1 ring-black/15" style={{ background: colourFor(page.vehicle.color) }} />{page.vehicle.color}</li>}
                    {page.vehicle?.year && <li className={chip}>{page.vehicle.year}</li>}
                    {page.vehicle && <li className={chip}>{bodyLabels[bodyTypeFor(page.vehicle.make, page.vehicle.model)]}</li>}
                </ul>}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-[#F5F4F0]/95 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0">
                <div className="mx-auto flex max-w-[640px] gap-2">
                    <Link href={`/help${page.helpQuery ? `?${page.helpQuery}` : ""}`} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[15px] text-white"><LifeBuoy className="h-4 w-4" />Get roadside help</Link>
                    {page.contactPhone && <a href={`tel:${page.contactPhone.replace(/\s+/g, "")}`} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#D9D7D0] bg-white text-[15px]"><Phone className="h-4 w-4 text-[#1111F6]" />Call {page.ownerFirstName || "owner"}</a>}
                </div>
            </div>

            {page.papers && <section className="mt-10" aria-labelledby="papers-heading">
                <h2 id="papers-heading" className="text-[18px] tracking-[-0.02em]">Papers</h2>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {papers.map(([label, status]) => {
                        const { label: stateLabel, tone, icon: Icon } = paperTone[status.state];
                        return <div key={label} className="rounded-[16px] bg-white p-4 ring-1 ring-black/5">
                            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${tone}`}><Icon className="h-[18px] w-[18px]" /></span>
                            <p className="mt-3 text-[14px] text-[#666]">{label}</p>
                            <p className="text-[18px] tracking-[-0.02em]">{stateLabel}</p>
                            {status.expiresOn && <p className="mt-0.5 text-[12px] text-[#888]">{status.state === "expired" ? "Ended" : "Until"} {formatDate(status.expiresOn)}</p>}
                        </div>;
                    })}
                </div>
                <p className="mt-2 text-[12px] text-[#888]">Based on dates the owner recorded. Ask to see the documents if you need proof.</p>
            </section>}

            {page.service && <section className="mt-10" aria-labelledby="service-heading">
                <h2 id="service-heading" className="text-[18px] tracking-[-0.02em]">Service history</h2>
                {page.service.length ? <details className="group mt-3 overflow-hidden rounded-[18px] bg-white ring-1 ring-black/5">
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEEEFF] text-[#1111F6]"><Wrench className="h-[18px] w-[18px]" /></span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-[15px]">{page.service.length} {page.service.length === 1 ? "record" : "records"}</span>
                            <span className="block truncate text-[13px] text-[#777]">Last: {page.service[0].description} · {formatDate(page.service[0].date)}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-[13px] text-[#1111F6]"><span className="group-open:hidden">Show</span><span className="hidden group-open:inline">Hide</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></span>
                    </summary>
                    <ol className="border-t border-[#F0F0F0] px-4 py-2 sm:px-5">
                        {page.service.map((entry, index) => <li key={`${entry.date}-${index}`} className="relative flex gap-4 py-3.5">
                            <div className="relative flex w-3 shrink-0 justify-center"><span className="mt-1.5 h-3 w-3 rounded-full border-2 border-[#1111F6] bg-white" />{index < page.service!.length - 1 && <span className="absolute top-5 bottom-[-18px] w-px bg-[#E2E0F5]" />}</div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px]">{entry.description}</p>
                                <p className="mt-0.5 text-[13px] text-[#777]">{formatDate(entry.date)}{entry.mileage ? ` · ${Number(entry.mileage).toLocaleString()} km` : ""}{entry.provider ? ` · ${entry.provider}` : ""}</p>
                                {entry.verified && <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#EAF7F0] px-2 py-0.5 text-[11px] text-[#197252]"><BadgeCheck className="h-3.5 w-3.5" />Recorded by mechanic</span>}
                            </div>
                        </li>)}
                    </ol>
                </details> : <p className="mt-3 rounded-[18px] bg-white p-5 text-[14px] text-[#777] ring-1 ring-black/5">No services recorded yet.</p>}
            </section>}

            {page.driver && <DriverSection driver={page.driver} />}

            <section className="mt-10 flex items-start gap-4 rounded-[18px] bg-[#1111F6] p-5 text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"><Wrench className="h-5 w-5" /></span>
                <div className="flex-1"><h2 className="text-[17px] tracking-[-0.02em]">Working on this car?</h2><p className="mt-1 text-[13px] leading-relaxed text-white/75">Log the service so it stays with the car. The owner approves it with a code sent to their phone.</p>
                    <Link href={`/service/log${page.plate ? `?plate=${encodeURIComponent(page.plate)}` : ""}`} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] text-[#171717]">Log a service <ArrowRight className="h-4 w-4" /></Link></div>
            </section>

            <footer className="mt-10 border-t border-black/10 pt-6 text-center">
                <p className="inline-flex items-center gap-1.5 text-[12px] text-[#888]"><Lock className="h-3.5 w-3.5" />The owner chooses what this page shows.</p>
                <p className="mt-3 text-[13px]"><Link href="/mobile-app#smart-card" className="text-[#1111F6]">Get a Smart Card for your car</Link></p>
            </footer>
        </section>
    </Shell>;
}
