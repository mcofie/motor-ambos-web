import React from 'react';
import {
    StripeNavbar,
    StripeFooter
} from "@/components/stripe-landing/Sections";

export default function TermsOfServicePage() {
    return (
        <main className="bg-white min-h-screen selection:bg-[#00C767]/20 selection:text-[#171717] w-full overflow-x-hidden font-jakarta">
            <StripeNavbar />

            <div className="pt-44 pb-32 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F8FAFF] rounded-full text-[12px] font-bold uppercase tracking-[0.15em] text-[#00C767] border border-slate-100 shadow-sm">
                            Governance Protocol
                        </div>
                        <h1 className="text-[48px] md:text-[64px] font-extrabold text-[#171717] leading-[1.0] tracking-[-0.05em]">Terms of Service.</h1>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-[#525252] opacity-40">
                            Last protocol update: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>

                    <div className="space-y-20">
                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">1. Technical Agreement</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                These Terms constitute a binding technical agreement between the user and Motor Ambos Infrastructure. Accessing our systems implies full compliance with these protocols as defined in the master architecture.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">2. Intellectual Infrastructure</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                All code, telemetry, interface designs, hardware anchoring methods, and technical data within the Ambos ecosystem are proprietary infrastructure, protected under international technical and copyright laws. Unauthorized replication of protocol nodes is strictly prohibited.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">3. User Integrity</h2>
                            <div className="space-y-8">
                                <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                    Users maintaining data on the platform represent that:
                                </p>
                                <ul className="space-y-6 border-l-2 border-[#00C767] pl-8">
                                    <li className="text-[16px] font-bold text-[#525252]">
                                        <span className="text-[#171717]">Data Accuracy:</span> All telemetry and registration data is accurate and verifiable at the point of origin.
                                    </li>
                                    <li className="text-[16px] font-bold text-[#525252]">
                                        <span className="text-[#171717]">Capacity:</span> They possess full legal capacity to utilize the infrastructure in their respective region.
                                    </li>
                                    <li className="text-[16px] font-bold text-[#525252]">
                                        <span className="text-[#171717]">Compliance:</span> System access will be conducted within defined legal parameters of the Motor Ambos Jurisdiction.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">4. Liability Limitations</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                Motor Ambos Infrastructure is not liable for indirect system failures, data corruption, or external hardware issues arising from user-side telemetry errors or incompatible hardware anchoring.
                            </p>
                        </section>

                        <section className="space-y-8 pt-12 border-t border-slate-100">
                            <h2 className="text-[20px] font-extrabold text-[#171717] uppercase tracking-tight">5. Technical Complaints</h2>
                            <p className="text-[18px] font-medium text-[#525252] leading-relaxed opacity-80">
                                Resolve system complaints via the primary support terminal: <span className="text-[#00C767] font-bold underline cursor-pointer hover:text-emerald-600 transition-colors">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <StripeFooter />
        </main>
    );
}
