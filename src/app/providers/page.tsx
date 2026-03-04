import React from 'react';
import { StripeNavbar, StripeFooter, StripeServiceEcosystem } from "@/components/stripe-landing/Sections";
import { ArrowRight, CheckCircle2, Zap, Droplets, Cpu, Sparkles, Wrench, ShieldCheck, Truck, Store } from 'lucide-react';

export default function ProvidersPage() {
    return (
        <main className="bg-white min-h-screen w-full overflow-x-hidden selection:bg-[#00C767]/20 selection:text-[#171717]">
            <StripeNavbar />

            {/* Providers Hero */}
            <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center max-w-7xl mx-auto overflow-hidden">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl mx-auto z-10 relative">
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-6">Service Ecosystem</div>
                    <h1 className="text-[48px] sm:text-[64px] md:text-[84px] font-extrabold text-[#171717] leading-[1.0] md:leading-[0.95] tracking-[-0.04em] mb-8 md:mb-10 text-balance">
                        Join the protocol <br className="hidden md:block" /> for automotive trust.
                    </h1>
                    <p className="text-[18px] sm:text-[20px] md:text-[22px] text-[#525252] leading-[1.6] mb-10 md:mb-14 font-medium text-balance opacity-80 max-w-3xl mx-auto">
                        Motor Ambos connects trusted mechanics, service stations, and tow operators with thousands of verified clients. Scale your customer base securely with guaranteed payouts.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mb-16 md:mb-24">
                        <button className="bg-[#171717] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3 group/btn">
                            Apply as a Provider <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>

                <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 grayscale opacity-40">
                        <Wrench className="w-16 h-16" />
                        <Store className="w-16 h-16" />
                        <Truck className="w-16 h-16" />
                        <Cpu className="w-16 h-16" />
                        <ShieldCheck className="w-16 h-16" />
                        <Sparkles className="w-16 h-16" />
                        <Droplets className="w-16 h-16" />
                        <Zap className="w-16 h-16" />
                    </div>
                </div>
            </section>

            {/* Reusing the Service Ecosystem from landing page for identical look and feel */}
            <div className="pb-24 border-b border-slate-100">
                <StripeServiceEcosystem />
            </div>

            {/* How to Join Section */}
            <section className="py-24 md:py-40 px-6 md:px-12 bg-slate-50 bg-[#F8FAFF]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-24">
                        <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-6">Onboarding</div>
                        <h2 className="text-[36px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.04em] mb-6">
                            How you can join the network.
                        </h2>
                        <p className="text-[18px] md:text-[20px] text-[#525252] font-medium max-w-2xl mx-auto opacity-80">
                            Our vetting process ensures only the highest quality providers enter the network, so driver trust remains absolute.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative before:absolute before:top-12 before:left-[10%] before:right-[10%] before:h-1 before:bg-blue-100 before:hidden md:before:block">
                        {[
                            { step: "01", title: "Submit Application", p: "Provide your business registration, facility photos, and mechanic certifications for review by the Motor Ambos verification team." },
                            { step: "02", title: "Site Inspection", p: "Our team conducts an on-site evaluation to ensure your operations meet the standard for safety, transparency, and skill." },
                            { step: "03", title: "Activate Node", p: "Your service center goes live on the Motor Ambos app, instantly connecting you with fleet managers and individual clients." }
                        ].map((s, i) => (
                            <div key={i} className="relative bg-white p-8 md:p-10 rounded-[32px] border border-blue-50 shadow-sm shadow-blue-900/5 transition-transform hover:-translate-y-1 z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-[#171717] text-white rounded-full flex items-center justify-center font-extrabold text-[20px] mb-8 border-4 border-[#F8FAFF] shadow-lg">
                                    {s.step}
                                </div>
                                <h3 className="text-[24px] font-extrabold text-[#171717] mb-4">{s.title}</h3>
                                <p className="text-[#525252] font-medium leading-relaxed">{s.p}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <StripeFooter />
        </main>
    );
}
