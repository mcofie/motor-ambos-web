"use client";

import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="pt-60 pb-16 bg-background relative overflow-hidden selection:bg-primary selection:text-black mt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="container mx-auto px-8 max-w-[1600px] relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-32 mb-40">
                    <div className="space-y-16 max-w-md">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="ambos-heading text-3xl tracking-[0.5em] group-hover:text-primary transition-all duration-500 font-black">MOTOR_AMBOS</span>
                        </Link>
                        <p className="mono-text text-[11px] text-muted-foreground leading-relaxed tracking-[0.3em] font-black uppercase opacity-60">
                            INDUSTRIAL_INFRASTRUCTURE_FOR_GHA_AUTOMOTIVE_FUTURE. <br />
                            <span className="text-primary italic">SECURE. VERIFIED. SOVEREIGN.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-24 w-full lg:max-w-4xl">
                        <div className="space-y-12">
                            <h4 className="mono-text text-[10px] text-primary/50 font-black tracking-[0.4em] uppercase">SYSTEM_DIRECTORY</h4>
                            <div className="flex flex-col gap-8">
                                <Link href="/digital-passport" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">DIGITAL_PASSPORT</Link>
                                <Link href="/concierge" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">CONCIERGE_HUB</Link>
                                <Link href="/club" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">CLUB_ACCESS</Link>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <h4 className="mono-text text-[10px] text-primary/50 font-black tracking-[0.4em] uppercase">NETWORK_NODES</h4>
                            <div className="flex flex-col gap-8">
                                <Link href="/about-us" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">ABOUT_UNIT</Link>
                                <Link href="/for-mechanics" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">MECHANIC_SYNC</Link>
                                <Link href="/resources" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">PROTOCOLS</Link>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <h4 className="mono-text text-[10px] text-primary/50 font-black tracking-[0.4em] uppercase">LEGAL_CORE</h4>
                            <div className="flex flex-col gap-8">
                                <Link href="/privacy-policy" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">PRIVACY_POLICY</Link>
                                <Link href="/terms-of-service" className="mono-text text-[12px] font-black tracking-[0.2em] hover:text-primary transition-all hover:translate-x-2">SYSTEM_TERMS</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <p className="mono-text text-[10px] text-muted-foreground tracking-[0.5em] font-black uppercase">
                            © {year} MOTOR_AMBOS_INFRASTRUCTURE. ALL_SYSTEMS_OPERATIONAL.
                        </p>
                    </div>
                    <div className="flex gap-12">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#CEFF00] animate-pulse" />
                        <span className="mono-text text-[10px] text-primary font-black tracking-[0.5em] uppercase">LINK_ESTABLISHED</span>
                    </div>
                </div>

                <div className="pt-32 pb-4">
                    <div className="ambos-heading text-[15vw] opacity-[0.03] pointer-events-none whitespace-nowrap overflow-hidden w-full text-center leading-none select-none tracking-tighter">
                        INDUSTRIAL_INFRASTRUCTURE_OS
                    </div>
                </div>
            </div>
        </footer>
    );
}
