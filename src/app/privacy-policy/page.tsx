import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-44 pb-32">
                <div className="wise-container max-w-4xl">
                    <div className="space-y-6 mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                            Data Protocol
                        </div>
                        <h1 className="wise-heading-section !leading-none">Privacy Policy</h1>
                        <p className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">
                            Last systems update: {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>

                    <div className="grid gap-20">
                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">1. Technical Scope</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                Welcome to Motor Ambos Infrastructure. We are committed to protecting your data integrity. This Privacy Policy outlines the protocol for collecting, storing, and safeguarding your information within our ecosystem.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">2. Data Acquisition</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                We acquire data through several technical channels to maintain system functionality:
                            </p>
                            <ul className="space-y-6 border-l-2 border-[#9FE870] pl-8">
                                <li className="text-sm font-black uppercase tracking-widest text-[#5D7079]">
                                    <span className="text-black">Primary Data:</span> Name, address, and telematics provided during registration.
                                </li>
                                <li className="text-sm font-black uppercase tracking-widest text-[#5D7079]">
                                    <span className="text-black">Metric Data:</span> IP address, device telemetry, and access logs during session activity.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">3. Data Processing</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                Information is processed to maintain verified automotive passports and execute compliance workflows.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">4. Security Protocol</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                We deploy industry-standard encryption to protect data at rest and in transit. Access is strictly governed by the Ambos Security Protocol.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest">5. Contact Support</h2>
                            <p className="text-lg font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">
                                For data queries: <span className="text-black underline cursor-pointer">support@motorambos.com</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
