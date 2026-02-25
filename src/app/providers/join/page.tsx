import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Wrench, ShieldCheck, Banknote } from "lucide-react";
import { ProviderSignupForm } from "@/components/providers/ProviderSignupForm";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ProviderJoinPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col selection:bg-primary/30">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-44 pb-32 overflow-hidden bg-background mesh-bg">
                    <div className="card-circle opacity-50" />

                    <div className="container px-8 max-w-[1600px] mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-24">
                            <div className="flex-1 text-center lg:text-left space-y-12">
                                <div className="ambos-label">PARTNER_NETWORK_PROTOCOL_v0.9</div>

                                <h1 className="ambos-heading text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.85] text-foreground tracking-tighter">
                                    GROW_YOUR <br />
                                    <span className="text-primary italic text-glow">BUSINESS_INFRA.</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    Join the network of trusted mechanics and service providers. Get more jobs, guaranteed payments, and powerful tools to manage your operations within the Motor Ambos ecosystem.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
                                    <button className="ambos-btn-lime !py-10 !px-24 text-2xl">
                                        <Link href="#signup-form" className="flex items-center">
                                            BECOME_A_PARTNER <ArrowRight className="ml-4 h-6 w-6" />
                                        </Link>
                                    </button>
                                    <button className="ambos-btn-secondary !py-10 !px-24 text-2xl">
                                        <Link href="/help/providers">VIEW_PROTOCOLS</Link>
                                    </button>
                                </div>
                            </div>

                            {/* Hero Graphic */}
                            <div className="flex-1 relative w-full max-w-2xl">
                                <div className="ambos-card bg-zinc-950/80 p-12 lg:p-16 border border-white/10 relative overflow-hidden group shadow-[0_0_100px_-20px_rgba(206,255,0,0.15)]">
                                    <div className="flex items-center gap-8 mb-12">
                                        <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_30px_rgba(206,255,0,0.3)]">
                                            <Wrench size={32} />
                                        </div>
                                        <div>
                                            <div className="ambos-label !bg-white/5 !text-white/40 !border-white/10 !text-[9px] mb-2 font-black">INCOMING_REQUEST</div>
                                            <h3 className="ambos-heading text-3xl text-white">OIL_SERVICE_ID</h3>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="ambos-heading text-xl text-primary drop-shadow-[0_0_10px_rgba(206,255,0,0.3)]">
                                                GHS 450.00
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-8 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="mono-text text-[10px] text-white/40 font-black tracking-widest">UNIT_LOCATION:</span>
                                            <span className="mono-text text-[10px] text-white font-black tracking-widest">ACCRA_METRO_NODE_04</span>
                                        </div>
                                        <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-2/3 animate-pulse" />
                                        </div>
                                    </div>

                                    <div className="mt-12 flex gap-6">
                                        <button className="flex-1 h-16 bg-primary rounded-full flex items-center justify-center text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            ACCEPT_JOB
                                        </button>
                                        <button className="flex-1 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/60 font-black text-xs uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all">
                                            DECLINE
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/[0.03] blur-[120px] -z-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-44 bg-background relative overflow-hidden border-y border-white/5">
                    <div className="container px-8 max-w-[1600px] mx-auto relative z-10">
                        <div className="mb-32 space-y-8">
                            <div className="ambos-label">ONBOARDING_PIPELINE</div>
                            <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow text-balance leading-[0.85]">SYSTEM_FLOW.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: CheckCircle2,
                                    title: "1. SIGN_UP",
                                    description: "SUBMIT BUSINESS CREDENTIALS VIA THE TERMINAL. ESTIMATED COMPLETION: 05_MINS.",
                                    delay: "delay-0"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "2. VERIFICATION",
                                    description: "SYSTEM AUDIT OF SERVICE CAPACITY AND TECHNICAL STANDARDS COMPLIANCE.",
                                    delay: "delay-150"
                                },
                                {
                                    icon: Banknote,
                                    title: "3. ACTIVATION",
                                    description: "INITIALIZE JOB RECEIPT AND AUTOMATED SETTLEMENT PROTOCOLS.",
                                    delay: "delay-300"
                                }
                            ].map((step, index) => (
                                <div key={index} className={`ambos-card p-12 space-y-10 group relative ${step.delay}`}>
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                        <step.icon size={28} />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="ambos-heading text-2xl text-foreground tracking-tight">{step.title}</h3>
                                        <p className="mono-text text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest font-black">
                                            {step.description}
                                        </p>
                                    </div>
                                    <div className="absolute top-8 right-8 text-6xl font-black text-foreground/[0.03] pointer-events-none group-hover:text-primary/5 transition-colors">
                                        0{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Signup Form */}
                <section id="signup-form" className="py-44 relative bg-background overflow-hidden">
                    <div className="container px-8 mx-auto relative z-10">
                        <div className="max-w-4xl mx-auto space-y-20">
                            <div className="text-center space-y-8">
                                <div className="ambos-label mx-auto">NETWORK_REGISTRATION</div>
                                <h2 className="ambos-heading text-6xl md:text-8xl text-foreground text-glow tracking-tighter">JOIN_THE_CORE.</h2>
                                <p className="mono-text text-sm font-black tracking-[0.3em] text-muted-foreground uppercase opacity-60">
                                    COMPLETE YOUR INITIAL APPLICATION TO BEGIN PARTNER VALIDATION.
                                </p>
                            </div>

                            <div className="ambos-card p-12 md:p-16 border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl">
                                <ProviderSignupForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
