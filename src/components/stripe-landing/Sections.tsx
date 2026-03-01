"use client";

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight, Check, Shield, Activity, CreditCard, FileText, Settings, AlertCircle, CheckCircle2, Car,
    Wrench, Store, Truck, Cpu, Sparkles, Droplets, Zap, ShieldCheck,
    Twitter, Linkedin, Github
} from 'lucide-react';
import {
    VehicleOverviewMock,
    ComplianceNodes,
    StackedUIMocks,
    LifecycleTimeline,
    WalletUpgradeMock,
    ImagePlaceholder,
    AIMechanicMock,
    FleetHeatmapMock,
    FuelBurnRateMock,
    VectorCardMock,
    OnyxCardMock,
    EmergencySOSMock,
    RescueMapMock
} from './UIMocks';

// --- Navbar ---
export const StripeNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Lock scroll when menu is open
    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If on another page, navigate home first (optional, but keep it simple for now)
            window.location.href = `/#${id}`;
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 px-6 h-20 flex items-center justify-between transition-all duration-300 ${isMenuOpen ? 'bg-white' : 'bg-white/80 backdrop-blur-xl border-b border-slate-100'}`}>
            <Link href="/" className="flex items-center gap-3 group cursor-pointer lg:pl-6 transition-opacity hover:opacity-80">
                <div className="w-7 h-7 bg-[#00C767] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                    <Car className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-[20px] tracking-tight text-[#171717]">motor ambos</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 lg:pr-6">
                <button
                    onClick={() => scrollToSection('business')}
                    className="text-[14px] font-bold text-[#525252] hover:text-[#171717] transition-all"
                >
                    Business
                </button>
                <button
                    onClick={() => scrollToSection('providers')}
                    className="text-[14px] font-bold text-[#525252] hover:text-[#171717] transition-all flex items-center gap-1"
                >
                    Providers <ArrowRight className="w-3.5 h-3.5 -rotate-45 opacity-50" />
                </button>
                <Link href="/help">
                    <button className="group bg-[#00C767] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#00B05C] shadow-lg shadow-[#00C767]/20 transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
                        Get App
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 text-[#171717]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className="space-y-1.5 relative z-[101]">
                    <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
            </button>

            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-20 bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
                    <div className="flex flex-col p-6 gap-6 min-h-[calc(100vh-80px)]">
                        <button
                            onClick={() => { setIsMenuOpen(false); scrollToSection('business'); }}
                            className="text-[20px] font-bold text-[#171717] text-left py-4 border-b border-slate-50 transition-all active:pl-2 flex items-center justify-between mt-4"
                        >
                            Business
                            <ArrowRight className="w-5 h-5 opacity-20 -rotate-45" />
                        </button>
                        <button
                            onClick={() => { setIsMenuOpen(false); scrollToSection('providers'); }}
                            className="text-[20px] font-bold text-[#171717] text-left py-4 border-b border-slate-50 transition-all active:pl-2 flex items-center justify-between"
                        >
                            Providers
                            <ArrowRight className="w-5 h-5 opacity-20 -rotate-45" />
                        </button>
                        <Link href="/help" onClick={() => setIsMenuOpen(false)} className="mt-auto pb-12 pt-8">
                            <button className="group w-full bg-[#00C767] text-white py-5 rounded-2xl font-bold text-[18px] hover:bg-[#00B05C] shadow-lg shadow-[#00C767]/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3">
                                Get App
                                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export const StripeNFCCardSection = () => (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
            {/* Split Feature Layout - Accrue Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                <div className="relative animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="absolute inset-0 bg-slate-100/50 rounded-full blur-[100px] -z-10" />
                    <img src="/images/nfc_card.png" alt="Motor Ambos NFC Ecosystem" className="w-full h-auto object-contain max-w-[500px] md:max-w-[600px] mx-auto drop-shadow-2xl" />
                </div>
                <div className="max-w-xl animate-in fade-in slide-in-from-right-8 duration-1000">
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-4">Verification Layer</div>
                    <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em] mb-8">Proof you can tap.</h2>
                    <div className="space-y-6">
                        <p className="text-[20px] text-[#525252] leading-relaxed font-medium">
                            Expanding vehicle trust into new markets is already hard enough. Verifying history shouldn't add to your worries.
                        </p>
                        <p className="text-[18px] text-[#525252]/70 leading-relaxed">
                            Motor Ambos' dense network of verified workshops helps you to easily tap into a vehicle's life story via popular NFC-enabled smart cards.
                        </p>
                        <div className="inline-block bg-slate-100/80 px-4 py-2 rounded-lg mt-4">
                            <span className="text-[12px] font-bold text-[#171717] uppercase tracking-wide">Available in GH, NG, ZA, KE.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Vector Card */}
                <div className="flex flex-col bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
                    <div className="mb-12 flex justify-start perspective-1000">
                        <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105">
                            {/* Card Shadow */}
                            <div className="absolute top-8 left-4 right-4 bottom-0 bg-black/20 blur-2xl rounded-[20px] -z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                            <img
                                src="/images/vector.png"
                                alt="Vector Smart Card"
                                className="w-full h-auto object-contain aspect-[1.58/1] max-w-[340px] rounded-[20px] border border-slate-200/50"
                            />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-[32px] font-extrabold text-[#171717] mb-4">Vector</h3>
                        <p className="text-[18px] text-[#525252] font-medium leading-[1.6] mb-10 max-w-sm">
                            For individual owners. A digital health passport that unlocks verified history and roadside rescue.
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                            {['Health Passport', 'Verified History', 'Resale Protection', 'USSD Access'].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-[#171717] uppercase tracking-wide opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C767]" />
                                    {perk}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#171717] text-white px-8 py-4 rounded-xl font-bold text-[16px] flex items-center gap-2 hover:bg-black transition-all active:scale-95 group/btn w-full sm:w-auto justify-center">
                            Order Vector <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Onyx Card */}
                <div className="flex flex-col bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
                    <div className="mb-12 flex justify-start perspective-1000">
                        <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105">
                            {/* Card Shadow */}
                            <div className="absolute top-8 left-4 right-4 bottom-0 bg-black/40 blur-2xl rounded-[20px] -z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                            <img
                                src="/images/onyx.png"
                                alt="Onyx Smart Card"
                                className="w-full h-auto object-contain aspect-[1.58/1] max-w-[340px] rounded-[20px] border border-white/10"
                            />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-[32px] font-extrabold text-[#171717] mb-4">Onyx</h3>
                        <p className="text-[18px] text-[#525252] font-medium leading-[1.6] mb-10 max-w-sm">
                            For fleets and enterprises. Hardened accountability for drivers and service providers.
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                            {['Compliance Logs', 'Anti-Leakage', 'Driver Accountability', 'Fleet Visibility'].map((perk, i) => (
                                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-[#171717] uppercase tracking-wide opacity-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#171717]/40" />
                                    {perk}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-[#171717] text-white px-8 py-4 rounded-xl font-bold text-[16px] flex items-center gap-2 hover:bg-black transition-all active:scale-95 group/btn w-full sm:w-auto justify-center">
                            Request Demo <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export const StripeHero = () => (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 md:px-12 flex flex-col items-center text-center max-w-7xl mx-auto min-h-screen overflow-hidden">
        {/* Main Hero Illustration */}
        <div className="flex items-center justify-center w-full animate-in fade-in zoom-in-95 duration-1000 delay-200 group mb-16 md:mb-24 scale-95 lg:scale-100 relative z-0">
            <div className="relative w-full max-w-[500px] md:max-w-[800px] lg:max-w-5xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00C767]/5 rounded-full blur-[120px] opacity-70" />
                <img
                    src="/images/hero_image.png"
                    alt="Motor Ambos Vehicle Digital Passport"
                    className="relative z-10 w-full h-auto object-contain transition-all duration-1000 group-hover:scale-[1.02] drop-shadow-2xl"
                />
            </div>
        </div>

        {/* Text content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-3xl mx-auto z-10 relative">
            <h1 className="text-[48px] sm:text-[64px] md:text-[84px] font-extrabold text-[#171717] leading-[1.0] md:leading-[0.95] tracking-[-0.04em] mb-8 md:mb-10 text-balance">
                The digital passport <br className="hidden md:block" /> for your car.
            </h1>
            <p className="text-[18px] sm:text-[20px] md:text-[22px] text-[#525252] leading-[1.6] mb-10 md:mb-14 font-medium text-balance opacity-80">
                Standardizing vehicle identity and trust across Africa through a single infrastructure layer. Built for individual drivers and continental fleets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mb-16 md:mb-24">
                <button className="bg-[#00C767] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-[#00B05C] transition-all active:scale-[0.98] shadow-xl shadow-[#00C767]/20 flex items-center justify-center gap-3 group/btn">
                    Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
                <button className="flex items-center justify-center gap-3 text-[#171717] bg-white border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                    Contact Sales
                </button>
            </div>
        </div>

        {/* Partners */}
        <div className="w-full border-t border-slate-100 pt-12 pb-8 max-w-5xl mx-auto animate-in fade-in duration-1000 delay-500">
            <div className="text-[12px] font-bold text-[#525252]/50 uppercase tracking-[0.2em] mb-8">Partnered with the best</div>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-40 hover:opacity-60 transition-opacity">
                <div className="text-[20px] md:text-[24px] font-black tracking-tighter">TOTAL</div>
                <div className="text-[20px] md:text-[24px] font-black tracking-tighter italic">DVLA</div>
                <div className="text-[20px] md:text-[24px] font-black tracking-tighter">SHELL</div>
                <div className="text-[20px] md:text-[24px] font-black tracking-tighter">ALLIANZ</div>
            </div>
        </div>
    </section>
);

export const StripeServiceEcosystem = () => {
    const categories = [
        { name: "Mechanics", icon: Wrench, desc: "Certified maintenance" },
        { name: "Auto Shops", icon: Store, desc: "Verified retail nodes" },
        { name: "Towing", icon: Truck, desc: "24/7 recovery dispatch" },
        { name: "Spare Parts", icon: Cpu, desc: "Tracked inventory" },
        { name: "Insurance", icon: ShieldCheck, desc: "Digital risk mitigation" },
        { name: "Detailing", icon: Sparkles, desc: "Premium care centers" },
        { name: "Car wash", icon: Droplets, desc: "Mobile & stationary" },
        { name: "Charge stations", icon: Zap, desc: "EV power network" }
    ];

    return (
        <section id="providers" className="py-24 md:py-32 px-6 md:px-12 bg-white overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className="text-[36px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.04em] mb-6">
                        One protocol. <br className="md:hidden" /> Every provider.
                    </h2>
                    <p className="text-[18px] md:text-[20px] text-[#525252] font-medium max-w-2xl mx-auto opacity-80">
                        Bridging the gap between vehicle owners and the vast network of automotive services across Africa.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className="p-6 md:p-8 rounded-[32px] bg-[#F8FAFF] border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 group group-hover:border-blue-100 flex flex-col items-center md:items-start text-center md:text-left"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-[#00C767] group-hover:scale-110">
                                <cat.icon className="w-6 h-6 md:w-7 md:h-7 text-[#171717] group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-[18px] md:text-[20px] font-bold text-[#171717] mb-2">{cat.name}</h4>
                            <p className="text-[14px] text-[#525252] font-medium opacity-60 leading-relaxed group-hover:opacity-100 transition-opacity">
                                {cat.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 mt-8">
                    <p className="text-[#525252] font-bold text-[14px] uppercase tracking-[0.2em] opacity-50">Ready to join the network?</p>
                    <button className="group flex items-center gap-4 bg-[#00C767] text-white px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-[16px] md:text-[17px] hover:bg-[#00B05C] transition-all active:scale-[0.98] shadow-xl shadow-[#00C767]/20">
                        Become a Provider
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export const StripeB2CFeatureGrid = () => (
    <section className="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
            <div className="max-w-xl">
                <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-4">Digital Glovebox</div>
                <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em] mb-8">Manage every detail <br className="hidden md:block" /> from your phone</h2>
                <p className="text-[20px] text-[#525252] leading-relaxed font-medium mb-10">
                    Motor Ambos replaces the fragmented glovebox with a unified digital infrastructure. Track insurance, roadworthy, and service history instantly.
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-[14px] bg-[#00C767]/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-[#00C767]" />
                        </div>
                        <span className="font-bold text-[17px] text-[#171717]">Zero-fine compliance notifications</span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                <WalletUpgradeMock />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    title: "AI Mechanic",
                    desc: "Describe symptoms in plain English. Our AI diagnoses potential issues in seconds.",
                    mock: <AIMechanicMock />
                },
                {
                    title: "Fleet Heatmaps",
                    desc: "Monitor real-world efficiency and monthly burn rates for entire fleets.",
                    mock: <FleetHeatmapMock />
                },
                {
                    title: "Fuel Logs",
                    desc: "Track every cedi spent at the pump with precision history logging.",
                    mock: <FuelBurnRateMock />
                }
            ].map((feature, i) => (
                <div key={i} className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
                    <div className="mb-8">
                        {feature.mock}
                    </div>
                    <h3 className="text-[24px] font-extrabold text-[#171717] tracking-tight mb-4">{feature.title}</h3>
                    <p className="text-[17px] text-[#525252] leading-relaxed font-medium">{feature.desc}</p>
                </div>
            ))}
        </div>
    </section>
);

export const StripeBusinessInfrastructure = () => (
    <section id="business" className="py-24 md:py-40 bg-[#171717] text-white px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
                <StackedUIMocks />
            </div>
            <div className="order-1 lg:order-2 max-w-xl">
                <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-4">Enterprise Protocol</div>
                <h2 className="text-[40px] md:text-[56px] font-extrabold leading-[1.05] tracking-[-0.04em] mb-8">Infrastructure for fleets that scale</h2>
                <p className="text-[20px] text-zinc-400 leading-relaxed font-medium mb-12">
                    From logistics giants to government departments, Motor Ambos provides the hard-security layer needed to manage thousands of vehicles with zero paperwork.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 bg-white/5 rounded-[32px] border border-white/10">
                    <div>
                        <div className="text-[32px] font-extrabold text-white mb-2">99.9%</div>
                        <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-500">Compliance Rate</div>
                    </div>
                    <div>
                        <div className="text-[32px] font-extrabold text-white mb-2">12M+</div>
                        <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-zinc-500">Events Logged</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export const StripeRoadAssistance = () => (
    <section className="py-24 md:py-48 px-6 md:px-12 bg-[#E22B21] overflow-hidden relative">
        {/* Background Patterns & Textures */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30] via-[#E22B21] to-[#B11B14] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

        {/* Decorative large circles for depth */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-black opacity-[0.1] rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 max-w-xl">
                <h2 className="text-[48px] sm:text-[64px] md:text-[72px] font-extrabold text-white leading-[1.0] tracking-[-0.04em] mb-10">
                    Rescue is <br className="hidden md:block" /> never a tap <br className="hidden md:block" /> too far.
                </h2>
                <p className="text-[20px] text-white/95 leading-relaxed font-medium mb-14">
                    Our 24/7 rescue network is built into the continent's infrastructure. Whether it's a mechanical failure or a flat tire, we coordinate verified responders in minutes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    {[
                        { title: "Real-time Tracking", desc: "Watch help arrive with precise coordination." },
                        { title: "USSD Fallback", desc: "No data? No problem. Dial *714# instantly." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/10 border border-white/10 p-8 rounded-[32px] backdrop-blur-md transition-transform hover:-translate-y-1">
                            <h4 className="font-bold text-white text-[20px] mb-3">{feature.title}</h4>
                            <p className="text-white/80 text-[16px] font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <button className="bg-white text-[#E22B21] px-10 py-5 rounded-[20px] font-bold text-[17px] hover:bg-red-50 transition-all active:scale-[0.98] shadow-2xl shadow-black/20 group flex items-center gap-3">
                    Launch Rescue App <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 lg:scale-110 xl:scale-125 transform-gpu lg:translate-x-12">
                {/* Intense light source behind image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 rounded-full blur-[140px] opacity-40 animate-pulse" />
                <img
                    src="/images/sos.png"
                    alt="Motor Ambos SOS Interface"
                    className="relative z-10 w-full h-auto object-contain max-w-[600px] lg:max-w-none mx-auto drop-shadow-[0_48px_96px_rgba(0,0,0,0.4)]"
                />
            </div>
        </div>
    </section>
);

export const StripeSupportSection = () => (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mb-12 md:mb-16 flex justify-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#00C767]/5 rounded-full blur-[100px] opacity-50" />
                <img src="/images/fleet_management.png" alt="Fleet Management Interface" className="relative z-10 w-full max-w-[800px] h-auto object-contain rounded-[32px] drop-shadow-2xl" />
            </div>
            <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em] mb-8">Ready to modernize your fleet?</h2>
            <p className="text-[19px] sm:text-[21px] text-[#525252] max-w-2xl mx-auto mb-12 font-medium leading-[1.6]">
                Join thousands of drivers and businesses standardizing vehicle trust across the continent. Built for the future of African logistics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 transition-all">
                <button className="bg-[#00C767] text-white px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-[16px] md:text-[17px] hover:bg-[#00B05C] transition-all active:scale-[0.98] shadow-xl shadow-[#00C767]/20 flex items-center justify-center gap-2 group">
                    Get Started Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="flex items-center justify-center gap-3 text-[#171717] bg-white border border-slate-200 px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-[16px] md:text-[17px] hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                    Talk to an Expert
                </button>
            </div>

            <div className="mt-24 pt-24 border-t border-slate-100 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 grayscale opacity-40 hover:opacity-60 transition-opacity duration-500 items-center">
                <div className="text-[20px] font-black uppercase tracking-tighter">PRUDENTIAL</div>
                <div className="text-[20px] font-black uppercase tracking-tighter italic">Uber</div>
                <div className="text-[20px] font-black uppercase tracking-tighter">Bolt</div>
                <div className="text-[20px] font-black uppercase tracking-tighter italic">Enterprise</div>
            </div>
        </div>
    </section>
);

export const StripeFooter = () => (
    <footer className="py-24 px-6 md:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 mb-24">
                <div className="col-span-1 lg:col-span-2">
                    <Link href="/" className="flex items-center gap-3 mb-8 group cursor-pointer w-fit transition-opacity hover:opacity-80">
                        <div className="w-7 h-7 bg-[#00C767] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                            <Car className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-extrabold text-[20px] tracking-tight text-[#171717]">motor ambos</span>
                    </Link>
                    <p className="max-w-[320px] text-[16px] font-medium text-[#525252] leading-relaxed mb-10 opacity-60">
                        The infrastructure layer for vehicle identity, compliance, and industrial trust across Africa.
                    </p>
                    <div className="flex gap-4">
                        <button className="p-3 rounded-xl bg-slate-50 border border-slate-100/60 text-[#525252] hover:text-[#171717] hover:border-slate-200 hover:bg-white transition-all active:scale-95 shadow-sm">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="p-3 rounded-xl bg-slate-50 border border-slate-100/60 text-[#525252] hover:text-[#171717] hover:border-slate-200 hover:bg-white transition-all active:scale-95 shadow-sm">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button className="p-3 rounded-xl bg-slate-50 border border-slate-100/60 text-[#525252] hover:text-[#171717] hover:border-slate-200 hover:bg-white transition-all active:scale-95 shadow-sm">
                            <Github className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold text-[#171717] mb-8 text-[12px] uppercase tracking-[0.2em] opacity-40">Protocol</h5>
                    <ul className="space-y-4 text-[15px] font-bold text-[#525252]">
                        <li><Link href="/help" className="hover:text-[#00C767] transition-colors">Safety Sequence</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-[#171717] mb-8 text-[12px] uppercase tracking-[0.2em] opacity-40">Resources</h5>
                    <ul className="space-y-4 text-[15px] font-bold text-[#525252]">
                        <li><Link href="/help" className="hover:text-[#00C767] transition-colors">Help Terminal</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-[#171717] mb-8 text-[12px] uppercase tracking-[0.2em] opacity-40">Legal</h5>
                    <ul className="space-y-4 text-[15px] font-bold text-[#525252]">
                        <li><Link href="/privacy-policy" className="hover:text-[#00C767] transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service" className="hover:text-[#00C767] transition-colors">System Terms</Link></li>
                    </ul>
                </div>
            </div>
            <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[14px] font-bold text-slate-400">
                    © 2026 Motor Ambos. All rights reserved.
                </div>
                <div className="flex items-center gap-8 text-[14px] font-bold text-[#525252]">
                    <span className="flex items-center gap-2 hover:text-[#171717] cursor-pointer">
                        <div className="w-1 h-1 rounded-full bg-[#00C767]" /> Ghana
                    </span>
                    <span className="flex items-center gap-2 hover:text-[#171717] cursor-pointer">
                        <div className="w-1 h-1 rounded-full bg-slate-300" /> Kenya
                    </span>
                    <span className="flex items-center gap-2 hover:text-[#171717] cursor-pointer">
                        <div className="w-1 h-1 rounded-full bg-slate-300" /> South Africa
                    </span>
                </div>
            </div>
        </div>
    </footer>
);

