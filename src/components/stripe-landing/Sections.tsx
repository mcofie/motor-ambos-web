"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Check, Shield, Activity, CreditCard, FileText, Settings, AlertCircle, CheckCircle2, Car,
    Wrench, Store, Truck, Cpu, Sparkles, Droplets, Zap, ShieldCheck,
    Twitter, Linkedin, Github, Cloud, RefreshCw, Home, Clock, User, Asterisk, ChevronDown
} from 'lucide-react';
import {
    VehicleOverviewMock,
    ComplianceNodes,
    DailyDriverMock,
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
    RescueMapMock,
    DriverVehicleMock,
    InsuranceMock,
    DrivingScoreMock,
    RoadWorthyMock,
    ServiceLogsMock,
    SmartCardMock,
    ProviderMarketplaceMock,
    MobileAppMock
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isMenuOpen ? 'bg-white' : 'bg-white border-b border-slate-100/50 shadow-sm'}`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer lg:pl-6 transition-opacity hover:opacity-80">
                    <div className="w-7 h-7 bg-[#00C767] rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                        <Car className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-[20px] tracking-tight text-[#171717]">motor ambos</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 lg:pr-6">
                    <Link
                        href="/business"
                        className="text-[14px] font-bold text-[#525252] hover:text-[#171717] transition-all"
                    >
                        Business
                    </Link>
                    <Link
                        href="/smart-card"
                        className="text-[14px] font-bold text-[#525252] hover:text-[#171717] transition-all"
                    >
                        Smart Card
                    </Link>
                    <Link
                        href="/providers"
                        className="text-[14px] font-bold text-[#525252] hover:text-[#171717] transition-all flex items-center gap-1"
                    >
                        Providers <ArrowRight className="w-3.5 h-3.5 -rotate-45 opacity-50" />
                    </Link>

                    <div className="h-5 w-[1px] bg-slate-200 mx-2" />

                    {/* Country Abbreviation Selector */}
                    <div className="flex items-center gap-2 group cursor-pointer relative">
                        <div className="flex items-center gap-3 py-2 px-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                                <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                    <rect width="6" height="4" fill="#006B3F" />
                                    <rect width="6" height="2.66" fill="#FCD116" />
                                    <rect width="6" height="1.33" fill="#CF0921" />
                                    <path d="M3 1.5l.235.724H4l-.618.448.235.724L3 2.948l-.618.448.235-.724L1.999 2.224h.765L3 1.5z" fill="#000" />
                                </svg>
                            </div>
                            <span className="text-[14px] font-bold text-[#171717]">Ghana</span>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#171717] transition-all" />
                        </div>

                        {/* Hover Dropdown for countries */}
                        <div className="absolute top-12 right-0 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                            <div className="bg-white rounded-[24px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 min-w-[220px] flex flex-col gap-1">
                                <div className="flex items-center justify-between px-4 py-3 rounded-[18px] bg-[#F8FAFF] text-[#171717] font-bold text-[14px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-100">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#006B3F" />
                                                <rect width="6" height="2.66" fill="#FCD116" />
                                                <rect width="6" height="1.33" fill="#CF0921" />
                                                <path d="M3 1.5l.235.724H4l-.618.448.235.724L3 2.948l-.618.448.235-.724L1.999 2.224h.765L3 1.5z" fill="#000" />
                                            </svg>
                                        </div>
                                        <span>Ghana</span>
                                    </div>
                                    <Check className="w-4 h-4 text-[#00C767]" />
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 rounded-[18px] hover:bg-slate-50 transition-colors cursor-pointer group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-100 grayscale transition-all group-hover/item:grayscale-0">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#006600" />
                                                <rect width="6" height="2.8" fill="#FFFFFF" />
                                                <rect width="6" height="2.3" fill="#990000" />
                                                <rect width="6" height="1.2" fill="#FFFFFF" />
                                                <rect width="6" height="0.7" fill="#000000" />
                                                <path d="M3 1.2c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8z" fill="#990000" stroke="#FFFFFF" strokeWidth="0.05" />
                                            </svg>
                                        </div>
                                        <span className="text-[14px] font-bold text-slate-500 group-hover/item:text-[#171717]">Kenya</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 rounded-[18px] hover:bg-slate-50 transition-colors cursor-pointer group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-slate-100 grayscale transition-all group-hover/item:grayscale-0">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#000C8B" />
                                                <rect width="6" height="2" fill="#E21927" />
                                                <path d="M0 0l3 2L0 4z" fill="#007A4D" />
                                                <path d="M0 0l2.5 1.66v.68L0 4z" fill="#FFFFFF" stroke="#FFB612" strokeWidth="0.1" />
                                            </svg>
                                        </div>
                                        <span className="text-[14px] font-bold text-slate-500 group-hover/item:text-[#171717]">South Africa</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/help">
                        <button className="group bg-[#00C767] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#00B05C] shadow-lg shadow-[#00C767]/20 transition-all duration-300 active:scale-[0.98] flex items-center gap-2 ml-2">
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
            </div>

            {/* Mobile Navigation Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-20 bg-white z-40 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
                    <div className="flex flex-col p-6 gap-6 min-h-[calc(100vh-80px)]">
                        <Link
                            href="/business"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-[20px] font-bold text-[#171717] text-left py-4 border-b border-slate-50 transition-all active:pl-2 flex items-center justify-between mt-4"
                        >
                            Business
                            <ArrowRight className="w-5 h-5 opacity-20 -rotate-45" />
                        </Link>
                        <Link
                            href="/smart-card"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-[20px] font-bold text-[#171717] text-left py-4 border-b border-slate-50 transition-all active:pl-2 flex items-center justify-between"
                        >
                            Smart Card
                            <ArrowRight className="w-5 h-5 opacity-20 -rotate-45" />
                        </Link>
                        <Link
                            href="/providers"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-[20px] font-bold text-[#171717] text-left py-4 border-b border-slate-50 transition-all active:pl-2 flex items-center justify-between"
                        >
                            Providers
                            <ArrowRight className="w-5 h-5 opacity-20 -rotate-45" />
                        </Link>

                        {/* Mobile Country Selector */}
                        <div className="mt-4 border-t border-slate-50 pt-8 pb-4">
                            <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Select Country</h5>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFF] border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#006B3F" />
                                                <rect width="6" height="2.66" fill="#FCD116" />
                                                <rect width="6" height="1.33" fill="#CF0921" />
                                                <path d="M3 1.5l.235.724H4l-.618.448.235.724L3 2.948l-.618.448.235-.724L1.999 2.224h.765L3 1.5z" fill="#000" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-[#171717]">Ghana</span>
                                    </div>
                                    <Check className="w-5 h-5 text-[#00C767]" />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-transparent">
                                    <div className="flex items-center gap-4 opacity-50">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#006600" />
                                                <rect width="6" height="2.8" fill="#FFFFFF" />
                                                <rect width="6" height="2.3" fill="#990000" />
                                                <rect width="6" height="1.2" fill="#FFFFFF" />
                                                <rect width="6" height="0.7" fill="#000000" />
                                                <path d="M3 1.2c-.44 0-.8.36-.8.8s.36.8.8.8.8-.36.8-.8-.36-.8-.8-.8z" fill="#990000" stroke="#FFFFFF" strokeWidth="0.05" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-[#171717]">Kenya</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-transparent">
                                    <div className="flex items-center gap-4 opacity-50">
                                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0">
                                            <svg viewBox="0 0 6 4" className="w-full h-full object-cover">
                                                <rect width="6" height="4" fill="#000C8B" />
                                                <rect width="6" height="2" fill="#E21927" />
                                                <path d="M0 0l3 2L0 4z" fill="#007A4D" />
                                                <path d="M0 0l2.5 1.66v.68L0 4z" fill="#FFFFFF" stroke="#FFB612" strokeWidth="0.1" />
                                            </svg>
                                        </div>
                                        <span className="font-bold text-[#171717]">South Africa</span>
                                    </div>
                                </div>
                            </div>
                        </div>

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
    <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            {/* Split Feature Layout - Accrue Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-slate-100/50 rounded-full blur-[100px] -z-10" />
                    <Image src="/images/nfc_card.png" alt="Motor Ambos NFC Ecosystem" width={600} height={500} className="w-full h-auto object-contain max-w-[500px] md:max-w-[600px] mx-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.15)]" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-xl"
                >
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.25em] mb-4">Verification Layer</div>
                    <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.05em] mb-8">Proof you can tap.</h2>
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
                </motion.div>
            </div>

            {/* Product Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Vector Card */}
                <div className="flex flex-col bg-white p-6 sm:p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
                    <div className="mb-12 flex justify-start perspective-1000">
                        <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105">
                            {/* Card Shadow */}
                            <div className="absolute top-8 left-4 right-4 bottom-0 bg-black/20 blur-2xl rounded-[20px] -z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                            <Image
                                src="/images/vector.png"
                                alt="Vector Smart Card"
                                width={340}
                                height={215}
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
                <div className="flex flex-col bg-white p-6 sm:p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
                    <div className="mb-12 flex justify-start perspective-1000">
                        <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-105">
                            {/* Card Shadow */}
                            <div className="absolute top-8 left-4 right-4 bottom-0 bg-black/40 blur-2xl rounded-[20px] -z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                            <Image
                                src="/images/onyx.png"
                                alt="Onyx Smart Card"
                                width={340}
                                height={215}
                                className="w-full h-auto object-contain aspect-[1.58/1] max-w-[340px] rounded-[20px] border border-white/10 relative z-10"
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
    <section className="pt-24 pb-12 md:pt-32 md:pb-24 flex flex-col items-center text-center max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 min-h-[80vh] overflow-hidden">
        {/* Main Hero Illustration */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5, delay: 0.3 }}
            className="flex items-center justify-center w-full group mb-16 md:mb-24 scale-95 lg:scale-100 relative z-0"
        >
            <div className="relative w-full max-w-[500px] md:max-w-[800px] lg:max-w-5xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00C767]/5 rounded-full blur-[120px] opacity-70" />
                <Image
                    src="/images/hero_image.png"
                    alt="Motor Ambos Vehicle Digital Passport"
                    width={1000}
                    height={800}
                    priority
                    className="relative z-10 w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-[1.02] drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                />
            </div>
        </motion.div>

        {/* Text content */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto z-10 relative"
        >
            <h1 className="text-[44px] sm:text-[64px] md:text-[84px] font-extrabold text-[#171717] leading-[1.1] md:leading-[0.95] tracking-[-0.06em] mb-8 md:mb-10 text-balance">
                The digital passport <br className="hidden md:block" /> for your car.
            </h1>
            <p className="text-[18px] sm:text-[20px] md:text-[22px] text-[#525252] leading-[1.6] mb-10 md:mb-14 font-medium text-balance opacity-80">
                Standardizing vehicle identity and trust across Africa through a single infrastructure layer. Built for individual drivers and continental fleets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-5 mb-16 md:mb-24">
                <button className="bg-[#00C767] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-[#00B05C] transition-all active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_rgba(0,199,103,0.3)] flex items-center justify-center gap-3 group/btn">
                    Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
                <button className="flex items-center justify-center gap-3 text-[#171717] bg-white border border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold text-[16px] md:text-[17px] hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
                    Contact Sales
                </button>
            </div>
        </motion.div>

        {/* Partners */}
        <div className="w-full border-t border-slate-100 pt-12 pb-8 max-w-5xl mx-auto overflow-hidden animate-in fade-in duration-1000 delay-500">
            <div className="text-[12px] font-bold text-[#525252]/50 uppercase tracking-[0.2em] mb-12">Partnered with the best</div>

            <div className="relative flex overflow-hidden group/marquee">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-20 grayscale opacity-40 group-hover:opacity-80 transition-opacity">
                    {[
                        "TOTAL", "DVLA", "SHELL", "ALLIANZ", "SANTAM", "MTN", "ORYX", "VODA",
                        "TOTAL", "DVLA", "SHELL", "ALLIANZ", "SANTAM", "MTN", "ORYX", "VODA"
                    ].map((partner, i) => (
                        <div key={i} className="text-[20px] md:text-[24px] font-black tracking-tighter flex-shrink-0">
                            {partner}
                        </div>
                    ))}
                </div>

                {/* Gradient Masks for smooth fading on edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
            </div>
        </div>
    </section>
);

export const StripeServiceEcosystem = () => {
    // ... categories definition ...
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
        <section id="providers" className="py-16 md:py-24 bg-white overflow-hidden scroll-mt-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="text-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className="text-[36px] md:text-[52px] font-extrabold text-[#171717] leading-[1.1] tracking-[-0.04em] mb-6">
                        One protocol. <br className="md:hidden" /> Every provider.
                    </h2>
                    <p className="text-[18px] md:text-[20px] text-[#525252] font-medium max-w-2xl mx-auto opacity-80">
                        Bridging the gap between vehicle owners and the vast network of automotive services across Africa.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 lg:gap-6 mb-16">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className="bg-[#FAFAFA] rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col text-left transition-all duration-300 hover:bg-[#F3F3F3] cursor-pointer group"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] md:rounded-[16px] bg-white border border-slate-200/50 flex items-center justify-center mb-4 md:mb-6 md:mt-1 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#171717] group-hover:border-[#171717]">
                                <cat.icon className="w-4 h-4 md:w-5 md:h-5 text-[#171717] stroke-[1.5] transition-colors duration-300 group-hover:text-white" />
                            </div>
                            <h4 className="text-[15px] md:text-[17px] font-bold text-[#171717] mb-1 md:mb-[6px] tracking-tight">{cat.name}</h4>
                            <p className="text-[12px] md:text-[14px] text-slate-500 font-medium tracking-[0.01em] leading-relaxed">
                                {cat.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 mt-12">
                    <p className="text-[#525252] font-bold text-[13px] uppercase tracking-[0.3em] opacity-40">Continental Network</p>
                    <button className="group relative flex items-center gap-4 bg-[#171717] text-white px-10 py-5 rounded-2xl font-bold text-[17px] hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-black/10">
                        Become a Partner
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                    </button>
                    <p className="text-[#525252] text-[14px] font-medium opacity-60">Used by 1,200+ workshops across the continent</p>
                </div>
            </div>
        </section>
    );
};

export const StripeB2CFeatureGrid = () => {
    const [status, setStatus] = React.useState<'healthy' | 'warning' | 'critical'>('healthy');

    return (
        <>
            <section className="py-20 md:py-48 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="bg-[#F2F9E6] rounded-[32px] md:rounded-[48px] p-6 sm:p-12 md:p-[72px] relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-32 items-center relative z-10">
                        <div className="max-w-2xl lg:max-w-xl">
                            <div className="text-[13px] sm:text-[14px] font-black text-[#78B600] uppercase tracking-[0.2em] mb-4 sm:mb-6">Digital Glovebox</div>
                            <h2 className="text-[32px] sm:text-[48px] md:text-[56px] font-extrabold text-[#171717] leading-[1.1] md:leading-[1.0] tracking-[-0.03em] mb-6 sm:mb-10">
                                Manage every detail <br className="hidden sm:block" /> <span className="text-[#78B600]">from your phone.</span>
                            </h2>
                            <p className="text-[18px] sm:text-[20px] md:text-[22px] text-[#525252] leading-relaxed font-semibold mb-8 sm:mb-12 opacity-90 text-balance lg:text-pretty">
                                Motor Ambos replaces the fragmented glovebox with a unified digital infrastructure. Track insurance, roadworthy, and service history instantly.
                            </p>

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Preview Compliance States:</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { id: 'healthy', color: '#78B600', label: 'Active' },
                                        { id: 'warning', color: '#F59E0B', label: 'Expiring' },
                                        { id: 'critical', color: '#EF4444', label: 'Dead/Expired' }
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStatus(s.id as any)}
                                            className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all border-2 ${status === s.id
                                                    ? 'bg-white border-slate-500 shadow-md scale-105'
                                                    : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-100 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                                                style={{ backgroundColor: s.color }}
                                            />
                                            <span className={`text-[13px] font-black uppercase tracking-widest ${status === s.id ? 'text-[#171717]' : 'text-slate-500'
                                                }`}>
                                                {s.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center py-10 lg:py-0 h-full animate-in fade-in zoom-in-95 duration-1000 delay-300">
                            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:scale-110">
                                <DailyDriverMock status={status} />
                            </div>
                        </div>
                    </div>

                    {/* Patterns */}
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#78B600]/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#78B600]/5 rounded-full blur-[100px]" />
                </div>
            </section>

            <div className="px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto pb-48">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
                    {[
                        {
                            title: "Driver Profile",
                            desc: "Maintain central identity nodes connecting your vehicle registration and personal credentials.",
                            mock: <DriverVehicleMock />,
                            bg: "bg-[#E8FBFC]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Insurance Layer",
                            desc: "Never misplace your policy. Real-time active tracking and instant renewal connections.",
                            mock: <InsuranceMock />,
                            bg: "bg-[#FCF0FA]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Driving Score",
                            desc: "Safe drivers reap rewards. Unlock massive discounts on premiums based on your hard data.",
                            mock: <DrivingScoreMock />,
                            bg: "bg-[#F6F5FC]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Roadworthy Protocol",
                            desc: "Digital certification replaces windshield stickers. DVLA-verified compliance, always on your phone.",
                            mock: <RoadWorthyMock />,
                            bg: "bg-[#FCF5EB]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Service Logs",
                            desc: "Every mechanic stop, oil change, and part replacement. Stored globally and immutably.",
                            mock: <ServiceLogsMock />,
                            bg: "bg-[#EBFBF3]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Fuel Logging",
                            desc: "Track every cedi spent at the pump with precision history logging to understand your economy.",
                            mock: <FuelBurnRateMock />,
                            bg: "bg-[#F3F4FB]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "AI Mechanic",
                            desc: "Describe symptoms in plain English. Our AI diagnostics pipeline detects potential issues in seconds.",
                            mock: <AIMechanicMock />,
                            bg: "bg-[#FDF2F2]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        },
                        {
                            title: "Smart Card Vault",
                            desc: "An NFC passport connected to your digital twin. Tap to verify history on the spot.",
                            mock: <SmartCardMock />,
                            bg: "bg-[#171717]",
                            textColor: "text-white",
                            descColor: "text-zinc-400"
                        },
                        {
                            title: "Provider Network",
                            desc: "Discover verified workshops and certified mechanics around your location instantly.",
                            mock: <ProviderMarketplaceMock />,
                            bg: "bg-[#F4F4F6]",
                            textColor: "text-slate-800",
                            descColor: "text-slate-500"
                        }
                    ].map((feature, i) => (
                        <div key={i} className={`${feature.bg} p-6 sm:p-8 md:p-10 rounded-[40px] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/40 group break-inside-avoid relative overflow-hidden flex flex-col border border-black/5`}>
                            <div className="mb-12 z-10 break-inside-avoid">
                                <h3 className={`text-[24px] md:text-[26px] font-extrabold ${feature.textColor} tracking-tight mb-4`}>{feature.title}</h3>
                                <p className={`text-[16px] ${feature.descColor} leading-[1.7] font-medium opacity-90`}>{feature.desc}</p>
                            </div>
                            <div className="mt-auto z-10 w-full flex justify-center transform transition-transform duration-700 group-hover:scale-[1.02]">
                                {feature.mock}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export const StripeBusinessInfrastructure = () => (
    <section id="business" className="py-20 md:py-40 bg-[#171717] text-white scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
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
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[#E22B21] overflow-hidden relative">
        {/* Background Patterns & Textures */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B30] via-[#E22B21] to-[#B11B14] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

        {/* Decorative large circles for depth */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-black opacity-[0.1] rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative lg:scale-110 xl:scale-125 transform-gpu lg:translate-x-12 order-2 lg:order-1"
            >
                {/* Intense light source behind image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 rounded-full blur-[140px] opacity-40 animate-pulse" />
                <Image
                    src="/images/sos.png"
                    alt="Motor Ambos SOS Interface"
                    width={600}
                    height={800}
                    className="relative z-10 w-full h-auto object-contain max-w-[600px] lg:max-w-none mx-auto drop-shadow-[0_48px_96px_rgba(0,0,0,0.4)]"
                />
            </motion.div>

            <div className="animate-in fade-in slide-in-from-left-8 duration-1000 max-w-xl order-1 lg:order-2">
                <h2 className="text-[44px] sm:text-[64px] md:text-[72px] font-extrabold text-white leading-[1.1] md:leading-[1.0] tracking-[-0.04em] mb-10">
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
                        <div key={i} className="bg-[#B11B14] border border-[#B11B14] shadow-inner shadow-white/10 p-8 rounded-[32px] transition-transform hover:-translate-y-1">
                            <h4 className="font-bold text-white text-[20px] mb-3">{feature.title}</h4>
                            <p className="text-white/80 text-[16px] font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <button className="bg-white text-[#E22B21] px-10 py-5 rounded-[20px] font-bold text-[17px] hover:bg-red-50 transition-all active:scale-[0.98] shadow-2xl shadow-black/20 group flex items-center gap-3">
                    Launch Rescue App <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    </section>
);

export const StripeSupportSection = () => (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-white border-t border-slate-100">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="max-w-screen-2xl mx-auto text-center"
        >
            <div className="mb-12 md:mb-16 flex justify-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#00C767]/5 rounded-full blur-[100px] opacity-50" />
                <Image src="/images/fleet_management.png" alt="Fleet Management Interface" width={800} height={600} className="relative z-10 w-full max-w-[800px] h-auto object-contain rounded-[32px] drop-shadow-[0_48px_96px_rgba(0,0,0,0.15)]" />
            </div>
            <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.05em] mb-8">Ready to modernize your fleet?</h2>
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
        </motion.div>
    </section>
);

export const StripeAppDownload = () => {
    return (
        <section className="py-20 md:py-24 bg-[#F8FAFF] border-t border-slate-100 overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 relative z-10">
                <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 w-full max-w-[400px] order-2 md:order-1">
                    <MobileAppMock />
                </div>

                <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000 order-1 md:order-2">
                    <div className="text-[13px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-4">Motor Ambos App</div>
                    <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#171717] leading-[1.05] tracking-[-0.04em] mb-8">Take your passport everywhere.</h2>
                    <p className="text-[20px] text-[#525252] leading-relaxed font-medium mb-12">
                        Available on iOS and Android. Monitor your fleet burn rates, request instant roadside recovery, and verify histories directly from your pocket.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-[#171717] text-white px-8 py-4 rounded-[16px] flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all group">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <svg className="w-7 h-7 fill-white" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                            </div>
                            <div className="text-left">
                                <div className="text-[11px] font-bold text-white/60 mb-0.5">Download on the</div>
                                <div className="text-[20px] font-extrabold leading-none tracking-tight">App Store</div>
                            </div>
                        </button>

                        <button className="bg-white text-[#171717] border border-slate-200 px-8 py-4 rounded-[16px] flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <svg className="w-7 h-7" viewBox="0 0 512 512"><path fill="#00C767" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zM405.2 317.5l-60.6-60.6-60.2 60.2 281.3 162.1c11.9 5.8 24.2 1 30.5-5.2l-191-156.5zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                            </div>
                            <div className="text-left">
                                <div className="text-[11px] font-bold text-[#525252] mb-0.5">GET IT ON</div>
                                <div className="text-[20px] font-extrabold leading-none tracking-tight">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const StripeFooter = () => (
    <footer className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16 mb-24">
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
                        <li><Link href="/smart-card" className="hover:text-[#00C767] transition-colors">Smart Card</Link></li>
                        <li><Link href="/providers" className="hover:text-[#00C767] transition-colors">Providers</Link></li>
                        <li><Link href="/business" className="hover:text-[#00C767] transition-colors">Business</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-[#171717] mb-8 text-[12px] uppercase tracking-[0.2em] opacity-40">Resources</h5>
                    <ul className="space-y-4 text-[15px] font-bold text-[#525252]">
                        <li><Link href="/help" className="hover:text-[#00C767] transition-colors">Help Terminal</Link></li>
                        <li><Link href="/service/log" className="hover:text-[#00C767] transition-colors">Service Log</Link></li>
                        <li><Link href="/login" className="hover:text-[#00C767] transition-colors">System Login</Link></li>
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
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-between w-full md:w-auto text-center md:text-left">
                    <div className="text-[14px] font-bold text-slate-400">
                        © 2026 Motor Ambos. All rights reserved.
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-[18px] border border-slate-100/60 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group">
                        <div className="w-7 h-7 bg-[#171717] rounded-full flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                            <ArrowRight className="w-3.5 h-3.5 text-white animate-bounce" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#00C767] transition-colors leading-none mb-1">Available Now</span>
                            <span className="text-[13px] font-extrabold text-[#171717] leading-none">Download the App</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 md:gap-x-8">
                    {[
                        { flag: 'GHA', label: 'Ghana', active: true },
                        { flag: 'KEN', label: 'Kenya', active: false },
                        { flag: 'RSA', label: 'South Africa', active: false }
                    ].map((country, i) => (
                        <div key={i} className={`flex items-center gap-2.5 cursor-pointer transition-all group ${country.active ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${country.active ? 'bg-[#171717]' : 'bg-slate-100 group-hover:bg-[#171717]'}`}>
                                <span className={`text-[8px] font-black tracking-tighter ${country.active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                    {country.flag}
                                </span>
                            </div>
                            <span className="text-[14px] font-bold text-[#525252] group-hover:text-[#171717] transition-colors">
                                {country.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

