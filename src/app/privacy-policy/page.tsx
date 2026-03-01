import React from 'react';
import {
    StripeNavbar,
    StripeFooter
} from "@/components/stripe-landing/Sections";

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-white min-h-screen selection:bg-[#00C767]/20 selection:text-[#171717] w-full overflow-x-hidden font-jakarta">
            <StripeNavbar />

            <div className="pt-44 pb-32 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F8FAFF] rounded-full text-[12px] font-bold uppercase tracking-[0.15em] text-[#00C767] border border-slate-100 shadow-sm">
                            System Protocol
                        </div>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold text-[#171717] leading-[1.0] tracking-[-0.05em]">Privacy Policy.</h1>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-[#525252] opacity-40">
                            Last systems update: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>

                    <div className="space-y-20">
                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">1. Technical Scope</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                Welcome to Motor Ambos Infrastructure. We are committed to protecting your data integrity. This Privacy Policy outlines the protocol for collecting, storing, and safeguarding your information within our ecosystem.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">2. Data Acquisition</h2>
                            <div className="space-y-8">
                                <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                    We acquire data through several technical channels to maintain system functionality:
                                </p>
                                <ul className="space-y-6 border-l-2 border-[#00C767] pl-8">
                                    <li className="text-[16px] font-bold text-[#525252]">
                                        <span className="text-[#171717]">Primary Data_Set:</span> Name, address, and telematics provided during registration.
                                    </li>
                                    <li className="text-[16px] font-bold text-[#525252]">
                                        <span className="text-[#171717]">Metric Data_Set:</span> IP address, device telemetry, and access logs during session activity.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">3. Data Processing</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                Information is processed to maintain verified automotive passports and execute compliance workflows. No biometric data is stored without explicit hardware authorization.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">4. Security Protocol</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                We deploy industry-standard architecture to protect data at rest and in transit. Access is strictly governed by the Ambos Security Protocol (ASP-01).
                            </p>
                        </section>

                        <section className="space-y-8 pt-12 border-t border-slate-100">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">5. Contact Infrastructure Support</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                For data queries: <span className="text-[#00C767] font-bold underline cursor-pointer hover:text-emerald-600 transition-colors">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <StripeFooter />
        </main>
    );
}
