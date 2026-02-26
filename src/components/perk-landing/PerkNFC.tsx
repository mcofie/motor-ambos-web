"use client";

import React from "react";
import { CreditCard, ShieldCheck, Cpu, Zap, ArrowRight } from "lucide-react";

export function PerkNFC() {
    return (
        <section id="nfc" className="section-white">
            <div className="fintech-container">
                <div className="space-y-24">
                    <div className="max-w-4xl space-y-10">
                        <div className="label-technical">Physical Security Protocol / NFC_Verification</div>
                        <h2 className="section-heading">
                            Trust, <br /> physicalized.
                        </h2>
                        <p className="body-copy">
                            Every workshop visit, oil change, or major repair is signed physically via a high-security NFC tap. It turns your car&apos;s history into a verifiable, immutable asset.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Vector Card */}
                        <div className="fintech-card !p-0 overflow-hidden !border-4 platform:border-slate-100 platform:rounded-[24px] flex flex-col group">
                            <div className="p-10 lg:p-14 bg-muted onyx:bg-white/5 platform:bg-slate-50 border-b-4 border-foreground onyx:border-white/5 platform:border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-12 transition-colors group-hover:bg-primary/20 platform:group-hover:bg-primary/5">
                                <div className="space-y-6">
                                    <div className="label-technical">Entry_Tier / L01</div>
                                    <h3 className="text-5xl font-black uppercase tracking-tighter italic onyx:not-italic platform:not-italic platform:text-4xl platform:font-bold platform:normal-case">VECTOR</h3>
                                    <p className="text-sm font-bold uppercase max-w-[200px] italic onyx:not-italic platform:not-italic platform:normal-case platform:text-slate-500 platform:font-medium">The standard for modern vehicle compliance.</p>
                                </div>
                                <div className="relative">
                                    <div className="w-[280px] h-[180px] bg-foreground onyx:bg-slate-900 platform:bg-slate-900 rounded-[20px] p-8 flex flex-col justify-between shadow-2xl relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <Cpu className="text-primary" size={20} />
                                            </div>
                                            <div className="text-[10px] font-mono text-primary animate-pulse">NFC_ACTIVE</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-white/40 text-[8px] font-mono uppercase">Vehicle_ID</div>
                                            <div className="text-white text-sm font-mono tracking-widest">GW-1234-22</div>
                                        </div>
                                    </div>
                                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className="p-10 lg:p-14 space-y-10 bg-background onyx:bg-[#0F1219] platform:bg-white">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="text-xs font-black uppercase platform:normal-case platform:font-semibold platform:text-slate-400">Security</div>
                                        <div className="text-lg font-bold platform:text-slate-900">Level 01</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-black uppercase platform:normal-case platform:font-semibold platform:text-slate-400">Material</div>
                                        <div className="text-lg font-bold platform:text-slate-900">PVC Composite</div>
                                    </div>
                                </div>
                                <button className="btn-secondary w-full group">
                                    Order Vector <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Onyx Card */}
                        <div className="fintech-card !p-0 overflow-hidden !border-4 platform:border-slate-100 platform:rounded-[24px] flex flex-col group">
                            <div className="p-10 lg:p-14 bg-foreground onyx:bg-black platform:bg-slate-900 border-b-4 border-foreground onyx:border-white/5 platform:border-0 flex flex-col sm:flex-row justify-between items-start gap-12 transition-colors">
                                <div className="space-y-6">
                                    <div className="label-technical !text-primary">Premium_Tier / L02</div>
                                    <h3 className="text-5xl font-black uppercase tracking-tighter italic text-background onyx:not-italic platform:not-italic platform:text-4xl platform:font-bold platform:normal-case">ONYX</h3>
                                    <p className="text-sm font-bold uppercase max-w-[200px] italic text-background/60 onyx:not-italic platform:not-italic platform:normal-case platform:text-white/60 platform:font-medium">Architectural grade security for elite fleets.</p>
                                </div>
                                <div className="relative">
                                    <div className="w-[280px] h-[180px] bg-primary rounded-[20px] p-8 flex flex-col justify-between shadow-2xl relative z-10 group-hover:bg-primary/90 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="h-10 w-10 bg-black/10 rounded-lg flex items-center justify-center">
                                                <ShieldCheck className="text-black" size={20} />
                                            </div>
                                            <div className="text-[10px] font-mono text-black font-bold">LEGACY_PROTECTED</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-black/40 text-[8px] font-mono uppercase">Member_Since</div>
                                            <div className="text-black text-sm font-mono tracking-widest">EST. 2024</div>
                                        </div>
                                    </div>
                                    <div className="absolute -inset-10 bg-primary/40 blur-3xl rounded-full opacity-50 transition-opacity" />
                                </div>
                            </div>
                            <div className="p-10 lg:p-14 space-y-10 bg-background onyx:bg-[#0F1219] platform:bg-white">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="text-xs font-black uppercase platform:normal-case platform:font-semibold platform:text-slate-400">Security</div>
                                        <div className="text-lg font-bold platform:text-slate-900">Level 02</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-black uppercase platform:normal-case platform:font-semibold platform:text-slate-400">Material</div>
                                        <div className="text-lg font-bold platform:text-slate-900">Matte Steel</div>
                                    </div>
                                </div>
                                <button className="btn-primary w-full group">
                                    Join Waitlist <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkProviders() {
    return (
        <section id="workshops" className="section-dark relative overflow-hidden">
            <div className="platform:block hidden absolute top-0 left-0 w-full h-full bg-slate-900 z-0" />

            <div className="fintech-container relative z-10">
                <div className="grid lg:grid-cols-[0.8fr,1.2fr] gap-32 items-center">
                    <div className="space-y-16">
                        <div className="space-y-8">
                            <div className="label-technical !text-primary">Network Protocol / Service_Nodes</div>
                            <h2 className="section-heading !text-background">
                                Vetted. <br /> Verified. <br /> Validated.
                            </h2>
                            <p className="body-copy !text-background/60">
                                Every service center in the Motor Ambos network is an accredited data node. They sign your digital history with cryptographic certainty.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-8">
                            <button className="btn-primary">Become a Node</button>
                            <Link href="/providers/join" className="text-primary font-bold hover:underline flex items-center">
                                View Network Map <ArrowRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>

                    <div className="fintech-card !p-12 platform:bg-slate-800 platform:border-slate-700 bg-background text-foreground platform:text-white onyx:bg-[#0F1219] onyx:border-white/5 space-y-10 onyx:rounded-[2rem] platform:rounded-[24px]">
                        <div className="flex justify-between items-center border-b-2 border-foreground onyx:border-white/5 platform:border-slate-700 pb-8">
                            <div className="label-technical !text-primary">Node_Status / ACTIVE</div>
                            <div className="service-pulse" />
                        </div>
                        <div className="space-y-12">
                            <div className="flex items-start gap-8">
                                <div className="h-16 w-16 bg-primary onyx:bg-primary/20 platform:rounded-2xl flex items-center justify-center font-black text-2xl italic onyx:not-italic">AN</div>
                                <div className="space-y-2">
                                    <h4 className="text-3xl font-black uppercase tracking-tight italic onyx:not-italic platform:not-italic platform:text-2xl platform:font-bold">Accredited Node.</h4>
                                    <p className="opacity-60 font-bold platform:text-slate-400 platform:font-normal">Authorized to sign digital maintenance logs via NFC protocol.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 border-2 border-foreground onyx:border-white/5 platform:border-slate-700 bg-muted onyx:bg-white/5 platform:bg-slate-900/50 rounded-[var(--radius)] platform:rounded-2xl">
                                    <div className="text-4xl font-black italic onyx:not-italic platform:not-italic platform:font-bold">100%</div>
                                    <div className="label-technical platform:!text-slate-500">History_Accuracy</div>
                                </div>
                                <div className="p-8 border-2 border-foreground onyx:border-white/5 platform:border-slate-700 bg-muted onyx:bg-white/5 platform:bg-slate-900/50 rounded-[var(--radius)] platform:rounded-2xl">
                                    <div className="text-4xl font-black italic onyx:not-italic platform:not-italic platform:font-bold">&lt;10m</div>
                                    <div className="label-technical platform:!text-slate-500">Sync_Latency</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PerkFooter() {
    return (
        <section className="bg-background pt-48">
            <div className="fintech-container space-y-48 pb-24">
                <div className="space-y-16 text-center max-w-4xl mx-auto">
                    <h2 className="section-heading">Join the <br /> infrastructure.</h2>
                    <p className="body-copy mx-auto">
                        Automate your vehicle compliance and protect your asset value today. Secure Ghana&apos;s roads, one vehicle at a time.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <button className="btn-primary !py-8 !px-16 !text-2xl platform:!py-5 platform:!px-10 platform:!text-lg">Deploy App Now</button>
                        <button className="btn-secondary !py-8 !px-16 !text-2xl platform:!py-5 platform:!px-10 platform:!text-lg">Contact Sales</button>
                    </div>
                </div>

                <footer className="border-t-2 border-foreground onyx:border-white/5 platform:border-slate-100 pt-24 grid md:grid-cols-4 gap-20">
                    <div className="space-y-10 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary border-2 border-foreground platform:border-0 rounded-lg platform:rounded-xl flex items-center justify-center font-black text-xl">A</div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic onyx:not-italic platform:not-italic platform:normal-case platform:font-bold platform:text-slate-900">ambos.</span>
                        </Link>
                        <p className="label-technical !leading-relaxed platform:!text-slate-400 platform:normal-case platform:tracking-tight platform:font-medium">
                            The Operating System for vehicle ownership in Africa. Reliable infrastructure for a safer future.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <h5 className="label-technical !text-foreground platform:!text-slate-900">Ecosystem</h5>
                        <div className="flex flex-col gap-4">
                            {["Protocol", "Infrastructure", "Verified Nodes", "Fleet Management"].map(link => (
                                <Link key={link} href="#" className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity platform:font-medium platform:text-slate-500">{link}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h5 className="label-technical !text-foreground platform:!text-slate-900">Legal</h5>
                        <div className="flex flex-col gap-4">
                            {["Terms", "Privacy", "Compliance", "Architecture"].map(link => (
                                <Link key={link} href="#" className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity platform:font-medium platform:text-slate-500">{link}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h5 className="label-technical !text-foreground platform:!text-slate-900">Status</h5>
                        <div className="flex items-center gap-4 p-4 border-2 border-foreground onyx:border-white/5 platform:border-slate-100 rounded-lg platform:rounded-xl bg-muted onyx:bg-white/5 platform:bg-slate-50">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest platform:normal-case platform:font-semibold platform:text-slate-600">All Nodes Active</span>
                        </div>
                    </div>
                </footer>

                <div className="text-center">
                    <p className="label-technical opacity-40">© 2024 Motor Ambos Infrastructure. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
}
