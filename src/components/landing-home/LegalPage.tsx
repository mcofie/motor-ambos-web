import { LandingFooter, LandingNav } from "@/components/landing-home/HomeLanding";

export type LegalSection = { title: string; body: React.ReactNode };

/** Shared layout for the privacy policy and terms, in the same style as the rest of the site. */
export default function LegalPage({ eyebrow, title, updated, intro, sections }: { eyebrow: string; title: string; updated: string; intro: string; sections: LegalSection[] }) {
    return <main className="base-landing min-h-screen overflow-x-hidden bg-white text-[#171717]">
        <LandingNav />
        <article className="px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:px-16">
            <div className="mx-auto max-w-[760px]">
                <p className="text-[12px] uppercase tracking-[0.11em] text-[#1111F6]">{eyebrow}</p>
                <h1 className="mt-4 text-[40px] font-normal leading-[1.06] tracking-[-0.045em] sm:text-[56px]">{title}</h1>
                <p className="mt-4 text-[14px] text-[#888]">Last updated {updated}</p>
                <p className="mt-8 text-[18px] leading-[1.6] text-[#555]">{intro}</p>
                <nav aria-label="On this page" className="mt-10 rounded-[16px] bg-[#F7F7F7] p-5 sm:p-6">
                    <p className="text-[13px] text-[#777]">On this page</p>
                    <ol className="mt-3 grid gap-2 text-[15px] sm:grid-cols-2">{sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`} className="text-[#171717] hover:text-[#1111F6]">{index + 1}. {section.title}</a></li>)}</ol>
                </nav>
                <div className="mt-12 divide-y divide-[#EEEEEE]">
                    {sections.map((section, index) => <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-24 py-9 first:pt-0">
                        <h2 className="text-[22px] tracking-[-0.03em]">{index + 1}. {section.title}</h2>
                        <div className="legal-body mt-4 space-y-4 text-[16px] leading-[1.65] text-[#555] [&_a]:text-[#1111F6] [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-[#171717] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">{section.body}</div>
                    </section>)}
                </div>
            </div>
        </article>
        <LandingFooter />
    </main>;
}
