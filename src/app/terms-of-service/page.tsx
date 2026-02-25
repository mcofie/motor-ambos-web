import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-44 pb-32">
                <div className="wise-container max-w-4xl">
                    <div className="space-y-6 mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                            System Protocols
                        </div>
                        <h1 className="wise-heading-section !leading-none">Terms of Service</h1>
                        <p className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">
                            Last protocol update: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>

                    <div className="grid gap-20">
                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">1. Technical Agreement</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                These Terms constitute a binding technical agreement between the user and Motor Ambos Infrastructure. Accessing our systems implies full compliance with these protocols.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">2. Intellectual Infrastructure</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                All code, telemetry, interface designs, and technical data within the Ambos ecosystem are proprietary infrastructure, protected under international technical and copyright laws.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">3. User Integrity</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                Users maintaining data on the platform represent that:
                            </p>
                            <ul className="space-y-6 border-l-2 border-[#9FE870] pl-8">
                                <li className="text-sm font-black uppercase tracking-widest text-[#5D7079]">
                                    <span className="text-black">Data Accuracy:</span> All telemetry and registration data is accurate and verifiable.
                                </li>
                                <li className="text-sm font-black uppercase tracking-widest text-[#5D7079]">
                                    <span className="text-black">Capacity:</span> They possess full legal capacity to utilize the infrastructure.
                                </li>
                                <li className="text-sm font-black uppercase tracking-widest text-[#5D7079]">
                                    <span className="text-black">Compliance:</span> System access will be conducted within defined legal parameters.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">4. Liability Limitations</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                Motor Ambos Infrastructure is not liable for indirect system failures, data corruption, or external hardware issues arising from user-side telemetry errors.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">5. Technical Complaints</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                Resolve system complaints via the primary support terminal: <span className="text-black underline cursor-pointer">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
