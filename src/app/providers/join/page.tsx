import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Wrench, ShieldCheck, Banknote, Zap, Star } from "lucide-react";
import { ProviderSignupForm } from "@/components/providers/ProviderSignupForm";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ProviderJoinPage() {
    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-[#F0F2F5]">
                    <div className="wise-container relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-24">
                            <div className="flex-1 text-center lg:text-left space-y-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                    Partner Network Protocol
                                </div>

                                <h1 className="wise-heading-hero">
                                    Grow your <br />
                                    <span className="text-[#2D5B18] italic">business infra.</span>
                                </h1>

                                <p className="wise-body text-xl max-w-2xl mx-auto lg:mx-0">
                                    Join the network of trusted mechanics and service providers. Get more jobs, guaranteed payments, and powerful tools to manage your operations within the Motor Ambos ecosystem.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                                    <Link href="#signup-form">
                                        <button className="wise-btn-primary !px-12 py-5 flex items-center gap-3">
                                            Become a partner <ArrowRight size={20} />
                                        </button>
                                    </Link>
                                    <Link href="/help">
                                        <button className="wise-btn-secondary !px-12 py-5">
                                            View Protocols
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Hero Graphic */}
                            <div className="flex-1 w-full max-w-xl">
                                <div className="wise-card !p-12 !bg-black text-white relative overflow-hidden shadow-wise-lg">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9FE870]/10 blur-[80px]" />
                                    <div className="space-y-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-[#9FE870] rounded-2xl flex items-center justify-center text-black">
                                                <Wrench size={32} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#9FE870]">Incoming Request</p>
                                                <h3 className="text-2xl font-black tracking-tighter uppercase">Oil Service ID</h3>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-xl font-black text-[#9FE870]">GHS 450</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-8 border-t border-white/10">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                                <span>Unit Location</span>
                                                <span>Accra Metro Node</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 w-full rounded-full overflow-hidden">
                                                <div className="h-full bg-[#9FE870] w-2/3 animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="wise-btn-primary flex-1 !py-4 text-sm">Accept Job</button>
                                            <button className="wise-btn-secondary flex-1 !py-4 text-sm !bg-transparent !text-white !border-white/20">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pipeline */}
                <section className="py-44 bg-white border-y border-border">
                    <div className="wise-container">
                        <div className="mb-24 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                                Onboarding Pipeline
                            </div>
                            <h2 className="wise-heading-section !leading-none">System Flow.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: CheckCircle2, title: "1. Sign Up", desc: "Submit business credentials via the terminal. Estimated completion: 05 mins." },
                                { icon: ShieldCheck, title: "2. Verification", desc: "System audit of service capacity and technical standards compliance." },
                                { icon: Banknote, title: "3. Activation", desc: "Initialize job receipt and automated settlement protocols." }
                            ].map((s, i) => (
                                <div key={i} className="wise-card !p-12 space-y-12 group hover:border-[#9FE870]">
                                    <div className="w-14 h-14 rounded-2xl bg-[#9FE870]/10 text-[#2D5B18] flex items-center justify-center transition-all group-hover:bg-[#9FE870] group-hover:text-black">
                                        <s.icon size={28} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black tracking-tight uppercase">{s.title}</h3>
                                        <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Signup Form */}
                <section id="signup-form" className="py-44 bg-[#F0F2F5]">
                    <div className="wise-container max-w-4xl">
                        <div className="text-center space-y-8 mb-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] shadow-xs">
                                Network Registration
                            </div>
                            <h2 className="wise-heading-section !leading-none">Join the Core.</h2>
                            <p className="wise-body max-w-2xl mx-auto">
                                Complete your initial application to begin partner validation. Our team will review your credentials and activate your account within 24 hours.
                            </p>
                        </div>

                        <div className="wise-card !p-12 md:!p-16 !bg-white">
                            <ProviderSignupForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
