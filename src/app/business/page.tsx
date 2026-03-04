"use client";

import React from 'react';
import Image from 'next/image';
import { StripeNavbar, StripeFooter } from "@/components/stripe-landing/Sections";
import { ArrowRight, CheckCircle2, Shield, Activity } from 'lucide-react';
import { StackedUIMocks, FleetReportMock } from "@/components/stripe-landing/UIMocks";

export default function BusinessPage() {
    return (
        <main className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-[#00C767]/20 selection:text-[#171717]">
            <StripeNavbar />

            {/* Business Hero */}
            <section className="pt-24 pb-16 md:pt-48 md:pb-36 flex flex-col items-center text-center max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 min-h-screen overflow-hidden">
                {/* Main Hero Illustration */}
                <div className="flex items-center justify-center w-full animate-in fade-in zoom-in-95 duration-1000 delay-200 group mb-16 md:mb-24 scale-95 lg:scale-100 relative z-0">
                    <div className="relative w-full max-w-[500px] md:max-w-[800px] lg:max-w-5xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00C767]/5 rounded-full blur-[120px] opacity-70" />
                        <Image
                            src="/images/businesses_hero.png"
                            alt="Motor Ambos for Business"
                            width={1600}
                            height={900}
                            className="relative z-10 w-full h-auto object-contain transition-all duration-1000 group-hover:scale-[1.02] drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>

                {/* Text content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl mx-auto z-10 relative mb-12 md:mb-16">
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-6">Motor Ambos for Business</div>
                    <h1 className="text-[40px] sm:text-[64px] md:text-[84px] font-extrabold text-[#171717] leading-[1.1] md:leading-[0.95] tracking-[-0.02em] mb-6 md:mb-10 text-balance">
                        Enterprise mobility, <br className="hidden md:block" /> instantly verifiable.
                    </h1>
                    <p className="text-[16px] sm:text-[20px] md:text-[22px] text-[#525252] leading-relaxed mb-8 md:mb-14 font-medium text-balance opacity-80 max-w-3xl mx-auto px-4 md:px-0">
                        Powering high-growth fleets, logistics companies, and corporate teams with a unified infrastructure for compliance, driver accountability, and real-time maintenance routing.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5">
                        <button className="bg-[#171717] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3 group/btn">
                            Get Business Demo <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                        <button className="flex items-center justify-center gap-3 text-[#171717] bg-white border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* Stacked UI Mocks */}
                <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-1000 delay-400">
                    <StackedUIMocks />
                </div>
            </section>

            {/* Reporting Section */}
            <section className="py-20 md:py-56 bg-white overflow-hidden border-t border-slate-50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className="relative animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#00C767]/5 blur-[100px] rounded-full" />
                        <FleetReportMock />
                    </div>
                    <div className="max-w-xl animate-in fade-in slide-in-from-right-8 duration-1000">
                        <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-4">Actionable Insights</div>
                        <h2 className="text-[32px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.02em] mb-6 md:mb-8">
                            Periodic audits <br className="hidden md:block" /> for total control.
                        </h2>
                        <p className="text-[17px] md:text-[20px] text-[#525252] leading-relaxed font-medium mb-8 md:mb-10 opacity-80">
                            Our platform automatically generates cross-continental fleet audits. Get deep visibility into driver behavior trends, maintenance cost projections, and real-time compliance status delivered to your inbox.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Automated weekly/monthly PDF reports",
                                "Predictive maintenance cost analysis",
                                "Driver safety & performance ranking",
                                "Compliance expiry forecasts"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[16px] font-bold text-[#171717]">
                                    <div className="w-5 h-5 rounded-full bg-[#00C767]/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-[#00C767]" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* How to Sign Up Section */}
            <section className="py-20 md:py-56 bg-slate-50 border-t border-slate-100">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-[32px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.02em] mb-6">
                            Start onboarding today.
                        </h2>
                        <p className="text-[17px] md:text-[20px] text-[#525252] font-medium max-w-2xl mx-auto opacity-80">
                            Seamless deployment ensures you can transition from paper logs to digital compliance in days, not months.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative before:absolute before:top-12 before:left-[10%] before:right-[10%] before:h-1 before:bg-slate-200 before:hidden md:before:block">
                        {[
                            { step: "01", title: "Schedule a Demo", p: "We analyze your fleet size, compliance needs, and current maintenance pain points to provide a tailored blueprint." },
                            { step: "02", title: "System Integration", p: "Onboarding drivers onto the Onyx standard. Deploying digital passports for every vehicle in your database." },
                            { step: "03", title: "Instant Visibility", p: "Your dashboard goes live. Monitor burn rates, compliance expiries, and live tracking across the continent." }
                        ].map((s, i) => (
                            <div key={i} className="relative bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#00C767] text-white rounded-full flex items-center justify-center font-extrabold text-[20px] mb-8 border-4 border-white shadow-lg">
                                    {s.step}
                                </div>
                                <h3 className="text-[24px] font-extrabold text-[#171717] mb-4">{s.title}</h3>
                                <p className="text-[#525252] font-medium leading-relaxed">{s.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-20 md:py-56 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div>
                        <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.02em] mb-6 md:mb-8 text-center lg:text-left">Reduce operational chaos.</h2>
                        <ul className="space-y-6">
                            {[
                                { title: "Automated Compliance tracking", desc: "Never miss a roadworthy renewal or insurance payment. Everything is centralized." },
                                { title: "Verified Service Routing", desc: "Direct your drivers to certified mechanic nodes for transparent, tracked servicing." },
                                { title: "Driver Accountability", desc: "Onyx cards enforce strict access mapping so you know exactly who is driving what." }
                            ].map((f, i) => (
                                <li key={i} className="flex gap-5 bg-[#F8FAFF] p-6 rounded-2xl border border-blue-50/50">
                                    <div className="w-12 h-12 bg-white text-[#00C767] rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-[18px] text-[#171717] mb-2">{f.title}</h4>
                                        <p className="font-medium text-[#525252] opacity-80 leading-relaxed text-[15px]">{f.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-[#171717] rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00C767]/20 blur-[100px] rounded-full" />
                        <Shield className="w-12 h-12 text-[#00C767] mb-8 relative z-10" />
                        <h3 className="text-[32px] font-extrabold leading-[1.1] tracking-tight mb-6 relative z-10">Data security <br /> built for enterprise.</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-10 relative z-10">
                            Motor Ambos isolates your fleet's data using industry-leading encryption. Service histories are immutably logged and fully auditable by your management team.
                        </p>
                        <button className="bg-white text-[#171717] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all relative z-10">
                            Read Security Docs <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            <StripeFooter />
        </main>
    );
}
