import React from 'react';
import { StripeNavbar, StripeFooter, StripeNFCCardSection } from "@/components/stripe-landing/Sections";
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SmartCardPage() {
    return (
        <main className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-[#00C767]/20 selection:text-[#171717]">
            <StripeNavbar />

            {/* Smart Card Hero */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center max-w-7xl mx-auto min-h-screen overflow-hidden">
                {/* Main Hero Illustration */}
                <div className="flex items-center justify-center w-full animate-in fade-in zoom-in-95 duration-1000 delay-200 group mb-16 md:mb-24 scale-95 lg:scale-100 relative z-0">
                    <div className="relative w-full max-w-[500px] md:max-w-[800px] lg:max-w-5xl">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00C767]/5 rounded-full blur-[120px] opacity-70" />
                        <img
                            src="/images/smart_card_hero.png"
                            alt="Motor Ambos Smart Card"
                            className="relative z-10 w-full h-auto object-contain transition-all duration-1000 group-hover:scale-[1.02] drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl mx-auto z-10 relative">
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-6">The Digital Passport</div>
                    <h1 className="text-[48px] sm:text-[64px] md:text-[84px] font-extrabold text-[#171717] leading-[1.0] md:leading-[0.95] tracking-[-0.04em] mb-8 md:mb-10 text-balance">
                        Your vehicle's <br className="hidden md:block" /> immutable history.
                    </h1>
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] text-[#525252] leading-[1.6] mb-10 md:mb-14 font-medium text-balance opacity-80 max-w-3xl mx-auto">
                        Say goodbye to paper logs and disputed service histories. Motor Ambos smart cards bundle your identity, roadworthy, insurance, and mechanical truth in one secure tap.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mb-16 md:mb-24">
                        <button className="bg-[#00C767] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-[#00B05C] transition-all active:scale-[0.98] shadow-xl shadow-[#00C767]/20 flex items-center justify-center gap-3 group/btn">
                            Order Smart Card <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Smart Card Types & Perks (Reusing the landing page section) */}
            <div className="pb-24 border-b border-slate-100">
                <StripeNFCCardSection />
            </div>

            {/* How to Request Section */}
            <section className="py-24 md:py-40 px-6 md:px-12 bg-slate-50 bg-[#F8FAFF]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-6">Simple Onboarding</div>
                        <h2 className="text-[36px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.04em] mb-6">
                            How to get your smart card.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-transform">
                            <h3 className="text-[28px] font-extrabold text-[#171717] mb-6">For Individuals (Vector)</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-[#00C767]/10 text-[#00C767] font-extrabold flex items-center justify-center shrink-0">1</span>
                                    <p className="text-[16px] font-medium text-[#525252] leading-relaxed">Download the Motor Ambos app and create your driver profile.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-[#00C767]/10 text-[#00C767] font-extrabold flex items-center justify-center shrink-0">2</span>
                                    <p className="text-[16px] font-medium text-[#525252] leading-relaxed">Add your vehicle using its registration and verify ownership.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-[#00C767]/10 text-[#00C767] font-extrabold flex items-center justify-center shrink-0">3</span>
                                    <p className="text-[16px] font-medium text-[#525252] leading-relaxed">Request your Vector card for ¢50. We deliver it directly to your address in 48 hours.</p>
                                </li>
                            </ul>
                            <button className="w-full mt-10 bg-[#171717] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                                Download App <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="bg-[#171717] p-10 rounded-[32px] border border-white/10 shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform text-white">
                            <h3 className="text-[28px] font-extrabold text-white mb-6">For Enterprises (Onyx)</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-white/10 font-extrabold flex items-center justify-center shrink-0">1</span>
                                    <p className="text-[16px] font-medium text-zinc-400 leading-relaxed">Contact sales to set up your enterprise dashboard and organization node.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-white/10 font-extrabold flex items-center justify-center shrink-0">2</span>
                                    <p className="text-[16px] font-medium text-zinc-400 leading-relaxed">Bulk import your fleet database, assigning drivers to their designated vehicles.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-8 h-8 rounded-full bg-white/10 font-extrabold flex items-center justify-center shrink-0">3</span>
                                    <p className="text-[16px] font-medium text-zinc-400 leading-relaxed">We ship your customized Onyx cards initialized and ready for immediate deployment.</p>
                                </li>
                            </ul>
                            <button className="w-full mt-10 bg-white text-[#171717] px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                                Request Enterprise Demo <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <StripeFooter />
        </main>
    );
}
