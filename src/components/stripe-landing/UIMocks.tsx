"use client";

import React from 'react';
import { Shield, Clock, Search, MapPin, CreditCard, CheckCircle2, AlertCircle, FileText, Settings, Activity, ArrowRight, ChevronDown, Home, Car, Wrench, Cloud, RefreshCw, User, Asterisk, Sparkles, Zap, Check, Edit3, Heart, LogOut, ChevronRight, ChevronLeft, ScanFace, SlidersHorizontal, AlertTriangle, BatteryMedium, Thermometer, CarFront, X } from 'lucide-react';

export const VehicleOverviewMock = () => (
    <div className="bg-white rounded-[28px] p-6 w-full max-w-[340px] shadow-[0px_28px_56px_0px_rgba(23,23,23,0.08)] border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
            </div>
            <div>
                <h4 className="text-[17px] font-bold text-[#171717]">Vehicle Protocol</h4>
                <p className="text-[14px] text-[#525252]">$0.00 infrastructure fee</p>
            </div>
        </div>

        <div className="mb-6 p-3 rounded-xl border-2 border-[#00C767] bg-white">
            <p className="text-[14px] text-[#171717]">maxwell@motorambos.com</p>
        </div>

        <button className="w-full bg-[#00C767] text-white py-3 rounded-xl font-bold text-[15px] hover:opacity-90 transition-opacity">
            Confirm
        </button>
    </div>
);

export const ComplianceNodes = () => (
    <div className="w-full h-48 bg-[#011E0F] rounded-full flex items-center justify-center relative overflow-hidden group">
        <div className="w-20 h-20 bg-[#00C767] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,199,103,0.4)] transition-transform group-hover:scale-110 duration-500">
            <ArrowRight className="w-10 h-10 text-[#011E0F]" />
        </div>
        {/* Decorative lines/nodes could go here but following the screenshot's 'Giant Pill' style */}
    </div>
);

export const StackedUIMocks = () => (
    <div className="w-full bg-[#F5F5F5] rounded-[32px] p-6 md:p-8 flex flex-col h-[520px] overflow-hidden relative border border-slate-200/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 z-10">
            <div>
                <h4 className="font-extrabold text-[#171717] text-[20px] tracking-tight">Active Fleet</h4>
                <p className="text-[12px] font-medium text-slate-500">124 vehicles deployed</p>
            </div>
            <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <Search className="w-4 h-4" />
                </div>
            </div>
        </div>

        {/* Cars List */}
        <div className="space-y-4 z-10 w-full">
            {/* Vehicle 1 - Good Standing */}
            <div className="bg-white rounded-[24px] p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4 relative group hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[14px]">
                            JD
                        </div>
                        <div>
                            <h5 className="font-bold text-[#171717] text-[15px] leading-tight mb-0.5">John Doe • GT-405-21</h5>
                            <span className="text-[12px] text-slate-400 font-medium flex items-center gap-1">
                                Toyota Hilux
                            </span>
                        </div>
                    </div>
                    <div className="bg-[#00C767]/10 text-[#00C767] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Insurance</span>
                        <span className="text-[12px] font-bold text-[#171717]">Active</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rd Worthy</span>
                        <span className="text-[12px] font-bold text-[#171717]">Jul 2026</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Drive Score</span>
                        <span className="text-[12px] font-bold text-[#00C767]">98/100</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 rounded-xl p-2.5 flex justify-between items-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><Settings className="w-3 h-3" /> Service Log</span>
                        <span className="text-[11px] font-bold text-[#171717]">Clear</span>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-2.5 flex justify-between items-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1"><Activity className="w-3 h-3" /> Fuel Log</span>
                        <span className="text-[11px] font-bold text-[#171717]">4.2L/km</span>
                    </div>
                </div>
            </div>

            {/* Vehicle 2 - Needs Attention */}
            <div className="bg-white rounded-[24px] p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4 relative group hover:-translate-y-1 transition-transform cursor-pointer">
                {/* SOS Label for the second car */}
                <div className="absolute -top-3 right-4 z-20">
                    <div className="bg-[#E22B21] text-white rounded-full px-3 py-1 shadow-lg flex items-center gap-1 transform rotate-2">
                        <AlertCircle className="w-3 h-3 fill-white text-[#E22B21]" />
                        <span className="text-[9px] font-black uppercase tracking-widest">SOS ACTIVE</span>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[14px]">
                            SM
                        </div>
                        <div>
                            <h5 className="font-bold text-[#171717] text-[15px] leading-tight mb-0.5">Sarah Mensah • AW-902-23</h5>
                            <span className="text-[12px] text-slate-400 font-medium flex items-center gap-1">
                                Nissan Hardbody
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Insurance</span>
                        <span className="text-[12px] font-bold text-[#E22B21]">Expiring</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rd Worthy</span>
                        <span className="text-[12px] font-bold text-[#171717]">Oct 2026</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Drive Score</span>
                        <span className="text-[12px] font-bold text-amber-500">72/100</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Gradient Fade to simulate scrolling/stacking */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent z-20 pointer-events-none" />
    </div>
);

export const FleetReportMock = () => (
    <div className="w-full bg-white rounded-[32px] p-6 shadow-[0px_20px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group">
        {/* Header with Period */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <span className="text-[10px] font-bold text-[#00C767] uppercase tracking-[0.2em] mb-1 block">Monthly Audit</span>
                <h4 className="font-extrabold text-[#171717] text-[20px] tracking-tight">Fleet Performance</h4>
                <p className="text-[12px] font-medium text-slate-400">Feb 1, 2026 - Mar 1, 2026</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-400" />
            </div>
        </div>

        {/* Global Health Score */}
        <div className="flex items-center gap-6 mb-8 p-5 bg-[#F8FAFF] rounded-[24px] border border-blue-50/50">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                    <circle cx="40" cy="40" r="36" stroke="#00C767" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="45" className="transition-all duration-1000" />
                </svg>
                <span className="absolute font-black text-[18px] text-[#171717]">94</span>
            </div>
            <div>
                <h5 className="font-bold text-[#171717] text-[16px] mb-0.5">Fleet Efficiency Index</h5>
                <p className="text-[12px] text-slate-500 font-medium">Top 5% of logistics companies in Ghana</p>
            </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl p-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">Total Spend</span>
                <div className="flex items-end gap-1.5">
                    <span className="text-[18px] font-black text-[#171717]">¢42,800</span>
                    <span className="text-[10px] text-[#E22B21] font-bold mb-1">↑ 12%</span>
                </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">Compliance</span>
                <div className="flex items-end gap-1.5">
                    <span className="text-[18px] font-black text-[#171717]">98.2%</span>
                    <span className="text-[10px] text-[#00C767] font-bold mb-1">↑ 2%</span>
                </div>
            </div>
        </div>

        {/* Top Drivers List */}
        <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Driver Trends</h5>
            {[
                { name: "Isaac Appiah", score: 98, status: "excellent" },
                { name: "Kofi Owusu", score: 86, status: "good" }
            ].map((driver, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[13px] font-bold text-[#171717]">{driver.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${driver.status === 'excellent' ? 'bg-[#00C767]' : 'bg-amber-400'}`} />
                        <span className="text-[12px] font-black text-[#171717]">{driver.score}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Download Button */}
        <button className="mt-8 w-full py-4 border-2 border-slate-100 rounded-xl font-bold text-[14px] text-[#171717] hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            Download PDF Report <ArrowRight className="w-4 h-4" />
        </button>
    </div>
);

export const LifecycleTimeline = () => (
    <div className="w-full bg-[#F5F5F5] rounded-[32px] p-12 flex items-center justify-center h-[500px]">
        <div className="bg-white rounded-[28px] p-8 shadow-[0px_28px_56px_0px_rgba(23,23,23,0.06)] border border-slate-100 w-full max-w-sm">
            <h5 className="font-bold text-[#171717] mb-8 text-[18px]">Vehicle History</h5>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex-shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-3 w-2/3 bg-slate-50 rounded" />
                            <div className="h-2 w-1/3 bg-slate-50/50 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const WalletUpgradeMock = () => (
    <div className="bg-white rounded-[32px] p-10 w-full max-w-[460px] shadow-[0px_48px_80px_-16px_rgba(0,0,0,0.14)] border border-white">
        <div className="space-y-4">
            {/* Klarna Row */}
            <div className="bg-[#F7F9FC] rounded-[20px] p-5 flex items-center justify-between hover:bg-[#F2F4F7] transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#FFB3C7] rounded-[14px] flex items-center justify-center shadow-sm">
                        <span className="text-white font-black text-2xl tracking-tighter">K</span>
                    </div>
                    <div>
                        <div className="font-bold text-[17px] text-[#171717] tracking-tight">Klarna</div>
                        <div className="text-[14px] text-[#525252] font-medium leading-tight">Buy now, pay later</div>
                    </div>
                </div>
                <div className="text-slate-400 group-hover:text-[#171717] transition-colors pr-2">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>

            {/* Address Row */}
            <div className="bg-[#F7F9FC] rounded-[20px] p-5 flex items-center justify-between hover:bg-[#F2F4F7] transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#E6E9EF] rounded-[14px] flex items-center justify-center shadow-sm">
                        <Home className="w-7 h-7 text-[#525252]" />
                    </div>
                    <div>
                        <div className="text-[13px] text-[#525252] font-bold leading-tight mb-0.5 opacity-60 uppercase tracking-widest scale-90 origin-left">Ship to</div>
                        <div className="font-bold text-[17px] text-[#171717] tracking-tight">Jane Diaz</div>
                        <div className="text-[14px] text-[#525252] font-medium leading-tight">28 Liberty St, New York, NY</div>
                    </div>
                </div>
                <div className="text-slate-400 group-hover:text-[#171717] transition-colors pr-2">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        </div>
    </div>
);

export const AIMechanicMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#00C767]/10 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#00C767]" />
            </div>
            <div>
                <h4 className="font-bold text-[16px] text-[#171717]">AI Mechanic</h4>
                <p className="text-[12px] text-slate-400">Diagnosis Engine v2.4</p>
            </div>
        </div>
        <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none mr-8">
                <p className="text-[14px] text-[#525252]">"Me car bi grinding sound when me turn right."</p>
            </div>
            <div className="bg-[#00C767]/10 p-4 rounded-2xl rounded-tr-none ml-8 border border-[#00C767]/20">
                <p className="text-[14px] text-[#171717] font-medium">Likely Power Steering Pump failure or worn CV joint. Recommend immediate inspection.</p>
                <div className="mt-3 flex gap-2">
                    <span className="px-2 py-1 bg-white rounded-md text-[10px] font-bold text-[#00C767] border border-[#00C767]/20">92% CONFIDENCE</span>
                </div>
            </div>
        </div>
    </div>
);

export const FleetHeatmapMock = () => (
    <div className="bg-[#171717] rounded-[32px] p-8 shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-10">
            <h4 className="text-white font-bold text-[18px]">Fleet Heatmap</h4>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00C767]" />
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
            {[
                { label: "Road-Ready", value: "24", color: "text-[#00C767]", bg: "bg-[#00C767]/10" },
                { label: "Service Due", value: "08", color: "text-amber-400", bg: "bg-amber-400/10" },
                { label: "Grounded", value: "03", color: "text-red-500", bg: "bg-red-500/10" }
            ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white/5`}>
                    <div className={`text-[24px] font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>
    </div>
);

export const FuelBurnRateMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 max-w-sm w-full">
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Burn Rate</p>
                <h4 className="text-[32px] font-bold text-[#171717]">GHS 4.2 <span className="text-[16px] text-slate-400 font-medium">/km</span></h4>
            </div>
            <div className="bg-[#00C767]/10 px-3 py-1 rounded-full text-[#00C767] text-[12px] font-bold">
                -12% this month
            </div>
        </div>
        <div className="flex items-end gap-1.5 h-24 mb-4">
            {[40, 60, 45, 90, 65, 30, 50, 80, 45, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-t-sm relative group cursor-pointer overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-[#00C767] transition-all duration-500 group-hover:bg-[#171717]" style={{ height: `${h}%` }} />
                </div>
            ))}
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>WK 1</span>
            <span>WK 4</span>
        </div>
    </div>
);

export const VectorCardMock = () => (
    <div className="relative w-full max-w-[400px] aspect-square rounded-[24px] overflow-hidden group transition-all duration-700">
        <img
            src="/images/vector-card-real.jpg"
            alt="Vector NFC Card"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000"
        />
    </div>
);

export const OnyxCardMock = () => (
    <div className="relative w-full max-w-[400px] aspect-square rounded-[24px] overflow-hidden group transition-all duration-700">
        <img
            src="/images/onyx-card-real.jpg"
            alt="Onyx NFC Card"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000"
        />
    </div>
);

export const EmergencySOSMock = () => (
    <div className="bg-[#171717] rounded-[48px] p-12 shadow-2xl w-full max-w-sm flex flex-col items-center text-center border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.4)] relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
            <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h4 className="text-white font-bold text-[24px] mb-4">Rescue Protocol</h4>
        <p className="text-zinc-400 text-[14px] leading-relaxed mb-8">Tap to initiate emergency dispatch. Verified responders coordinated immediately.</p>
        <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[12px] font-bold text-white uppercase tracking-wider">USSD:*714#</div>
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[12px] font-bold text-[#00C767] uppercase tracking-wider">Active</div>
        </div>
    </div>
);

export const RescueMapMock = () => (
    <div className="bg-[#171717] rounded-[32px] p-1 shadow-2xl w-full max-w-md aspect-square relative overflow-hidden border border-white/5">
        {/* Simple stylized dark map background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />

        {/* Connection Lines (Paths) */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
            <path d="M 50,50 L 250,250" stroke="#00C767" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            <path d="M 350,50 L 250,250" stroke="white" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.5" />
        </svg>

        {/* Vehicle (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]" />

        {/* Responders */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#00C767] rounded-sm rotate-45 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/40 rounded-full" />

        {/* Responder Badge */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">Dispatch Incoming</span>
                <span className="text-[11px] font-bold text-[#00C767]">4 min</span>
            </div>
            <div className="text-[14px] font-medium text-zinc-300">Verified Recovery Unit (ACC-042)</div>
        </div>
    </div>
);

export const ImagePlaceholder = ({ aspect = "aspect-video", label = "Image Asset", className = "" }: { aspect?: string, label?: string, className?: string }) => (
    <div className={`w-full ${aspect} flex flex-col items-center justify-center p-12 group transition-all duration-500 overflow-hidden relative ${className}`}>
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500">
            <Activity className="w-8 h-8 text-slate-300 group-hover:text-[#00C767] transition-colors" />
        </div>
        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-[#171717] transition-colors text-center max-w-[200px]">{label}</span>
    </div>
);

export const DriverVehicleMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-[20px] font-bold text-slate-600">JD</div>
            <div>
                <h4 className="text-[20px] font-bold text-[#171717]">John Doe</h4>
                <p className="text-[14px] text-slate-400">Owner • GT-405-21</p>
            </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
            <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                <p className="text-[15px] font-bold text-[#171717]">2019 Toyota Hilux</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Car className="w-5 h-5 text-[#00C767]" />
            </div>
        </div>
    </div>
);

export const InsuranceMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm">
        <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Shield className="w-6 h-6" />
            </div>
            <div className="bg-[#00C767]/10 text-[#00C767] px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-widest">Active</div>
        </div>
        <h4 className="text-[24px] font-bold text-[#171717] mb-2">Comprehensive</h4>
        <p className="text-[14px] text-slate-400 mb-6">Allianz Insurance Ltd.</p>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="w-[60%] h-full bg-[#00C767]" />
        </div>
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Expires in 4 months</p>
    </div>
);

export const DrivingScoreMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm flex flex-col items-center text-center">
        <div className="relative mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.858" strokeDashoffset="35.185" className="text-[#00C767]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-black text-[#171717] leading-none">95</span>
                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
        </div>
        <h4 className="text-[18px] font-bold text-[#171717] mb-2">Excellent Driver</h4>
        <p className="text-[14px] text-slate-400">Top 5% in your fleet segment.</p>
    </div>
);

export const RoadWorthyMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
            <h4 className="text-[18px] font-bold text-[#171717]">Roadworthy</h4>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#00C767]" />
            </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center opacity-80">
                <div className="w-full h-full bg-[radial-gradient(#171717_2px,transparent_4px)] [background-size:8px_8px]" />
            </div>
            <p className="text-[20px] font-bold text-[#171717] tracking-widest mb-1">GH-3920-R</p>
            <p className="text-[12px] text-slate-400 uppercase tracking-widest font-bold">Valid until 12/26</p>
        </div>
    </div>
);

export const ServiceLogsMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm">
        <h4 className="text-[18px] font-bold text-[#171717] mb-6">Service Logs</h4>
        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-100">
            {[
                { date: "Oct 12", title: "Full Servicing", desc: "Total Auto Center" },
                { date: "Aug 04", title: "Brake Pad Replace", desc: "Kasoa Motors" }
            ].map((log, i) => (
                <div key={i} className="relative flex gap-4 items-start pl-8">
                    <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-[#00C767] shadow-[0_0_0_4px_white]" />
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{log.date}</p>
                        <p className="text-[15px] font-bold text-[#171717]">{log.title}</p>
                        <p className="text-[13px] text-slate-500">{log.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SmartCardMock = () => (
    <div className="bg-[#171717] rounded-[32px] p-8 shadow-xl border border-white/5 w-full max-w-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="w-12 h-12 bg-white/10 rounded-xl mb-12 flex items-center justify-center backdrop-blur-md">
            <CreditCard className="w-6 h-6 text-white" />
        </div>
        <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Digital Pass</p>
        <h4 className="text-[24px] font-bold text-white mb-6 tracking-tight">Onyx Identity</h4>
        <div className="flex justify-between items-end">
            <p className="text-[16px] font-mono text-zinc-300 tracking-widest">**** 4021</p>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/40" />
            </div>
        </div>
    </div>
);

export const ProviderMarketplaceMock = () => (
    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 w-full max-w-sm">
        <div className="flex justify-between items-center mb-6">
            <h4 className="text-[18px] font-bold text-[#171717]">Providers</h4>
            <div className="bg-slate-50 px-3 py-1 rounded-full text-[12px] font-bold text-[#171717] flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Nearby
            </div>
        </div>
        <div className="space-y-4">
            {[
                { name: "Total Auto Care", dist: "1.2 km", type: "Mechanic" },
                { name: "Shell Helix Service", dist: "3.4 km", type: "Oil Change" }
            ].map((p, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Wrench className="w-4 h-4 text-[#00C767]" />
                    </div>
                    <div className="flex-1">
                        <h5 className="font-bold text-[#171717] text-[14px]">{p.name}</h5>
                        <p className="text-[12px] text-slate-500">{p.type}</p>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{p.dist}</p>
                </div>
            ))}
        </div>
    </div>
);

export const MobileAppMock = () => {
    const [activeTab, setActiveTab] = React.useState('home');
    const [isPulsing, setIsPulsing] = React.useState(false);

    return (
        <div className="relative w-full max-w-[400px] mx-auto group perspective-1000">
            {/* Ambient Backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#00C767]/10 to-transparent rounded-full blur-[100px] transition-all duration-700 group-hover:scale-110" />

            <div className="bg-[#111A2C] rounded-[56px] p-2 shadow-2xl relative z-10 w-full aspect-[9/19] flex flex-col transform rotate-2 group-hover:rotate-0 transition-transform duration-700 mx-auto group-hover:shadow-[0_40px_100px_rgba(0,199,103,0.1)]">
                {/* Physical Phone Frame */}
                <div className="bg-[#F4F6F8] rounded-[48px] flex-1 flex flex-col overflow-hidden relative border-[2px] border-[#111A2C]">
                    {/* Dynamic Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#111A2C] rounded-b-3xl z-50 flex justify-center items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        <div className="w-3 h-3 rounded-full bg-blue-900/30 border border-blue-800/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10" />
                        </div>
                    </div>

                    {/* Status bar mock */}
                    <div className="flex justify-between items-center px-7 pt-[14px] pb-2 text-[12px] font-bold text-[#111A2C] z-40 bg-transparent relative">
                        <span className="opacity-90 tracking-tighter w-12">16:19</span>
                        <div className="flex items-center gap-1.5 opacity-80 w-12 justify-end">
                            <Activity className="w-3.5 h-3.5 rotate-90" />
                            <div className="w-[20px] h-[10px] rounded-[3px] border-[1.5px] border-current relative overflow-hidden">
                                <div className="absolute right-[1px] top-[1px] bottom-[1px] bg-current w-[70%] rounded-[1px]" />
                            </div>
                        </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 scrollbar-hide pb-28 pt-2 relative">

                        {/* Home Tab Content */}
                        {activeTab === 'home' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300 relative">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                                            <Cloud className="w-4 h-4 fill-[#00C767] text-[#00C767] opacity-80" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Good Afternoon</span>
                                        </div>
                                        <h1 className="text-[32px] leading-[1.1] font-extrabold text-[#111A2C] tracking-tight">Drive safe, <br /><span className="text-[#00C767]">Nii</span></h1>
                                    </div>
                                    <div className="relative mt-2" onClick={() => setActiveTab('profile')}>
                                        <div className="w-[52px] h-[52px] rounded-full bg-slate-300 border-[2.5px] border-[#F4F6F8] overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition-transform">
                                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full bg-[#A3E5C8] border-[2.5px] border-[#F4F6F8]" />
                                    </div>
                                </div>

                                {/* System Ready Card */}
                                <div className="bg-gradient-to-b from-[#C4EFDB]/60 to-white/70 border border-[#A3E5C8]/40 rounded-[28px] p-5 mb-8 relative overflow-hidden backdrop-blur-md shadow-sm">
                                    <Check className="absolute -bottom-4 -right-4 w-36 h-36 text-white/50 stroke-[3px]" />

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-[#A3E5C8]/40 flex flex-shrink-0 items-center justify-center shadow-inner">
                                            <div className="w-[34px] h-[34px] rounded-full bg-[#00C767] flex items-center justify-center shadow-lg shadow-[#00C767]/30">
                                                <Check className="w-5 h-5 text-white stroke-[4px]" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-[20px] font-bold text-[#111A2C] leading-snug tracking-tight">System Ready</h3>
                                            <p className="text-[14px] text-slate-500/90 font-medium">Your KIA is in peak condition.</p>
                                        </div>
                                    </div>

                                    <div className="bg-white/70 rounded-2xl p-[14px] shadow-sm border border-white/50 relative z-10 transition-transform hover:-translate-y-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#00C767]" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00C767]">Driver Tip</span>
                                            </div>
                                            <div className="bg-[#E4EBE8] px-2 py-[2px] rounded-full text-[10px] font-extrabold text-slate-500">31°C</div>
                                        </div>
                                        <p className="text-[13px] font-medium text-[#111A2C] leading-[1.5]">Evening peak. Drive defensively. Coolant check advised (30.5°C).</p>
                                    </div>
                                </div>

                                {/* Coach Insights */}
                                <div className="flex justify-between items-center mb-4 px-1">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#A2Aab6]">Coach Insights</h4>
                                    <RefreshCw className="w-3.5 h-3.5 text-[#00C767] cursor-pointer" onClick={() => setIsPulsing(true)} onAnimationEnd={() => setIsPulsing(false)} />
                                </div>

                                <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide -mx-5 px-5 pb-6">
                                    <div className="min-w-[85%] snap-center bg-white rounded-[28px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] cursor-pointer hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="w-[46px] h-[46px] bg-[#EAF9F1] rounded-full flex flex-shrink-0 items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-[#00C767]" />
                                            </div>
                                            <div>
                                                <h5 className="text-[15px] font-extrabold text-[#111A2C] mb-[6px] leading-[1.2] tracking-tight">Document Expiry Reminder</h5>
                                                <p className="text-[12.5px] text-slate-500 leading-[1.5] line-clamp-3 font-medium">The insurance for the 2010 KIA RIO 5 is valid until 2036, while the roadworthy certificate expires on 2027-02-17. En...</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="min-w-[85%] snap-center bg-white rounded-[28px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
                                        <div className="flex items-start gap-4">
                                            <div className="w-[46px] h-[46px] bg-amber-50 rounded-full flex flex-shrink-0 items-center justify-center">
                                                <Zap className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h5 className="text-[15px] font-extrabold text-[#111A2C] mb-[6px] leading-[1.2] tracking-tight">Fuel Economy Drop</h5>
                                                <p className="text-[12.5px] text-slate-500 leading-[1.5] line-clamp-3 font-medium">You used 14% more fuel this week compared to last week.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Daily Driver Card */}
                                <div className="bg-white rounded-[32px] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.04)] border border-[#E9EEF2] relative overflow-hidden mb-12 cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => setActiveTab('nfc')}>
                                    <div className="flex justify-between items-start mb-[10px]">
                                        <div className="bg-[#EEF1F4] px-[12px] py-[4px] rounded-full text-[10px] font-black uppercase tracking-wider text-[#818B98]">KIA</div>
                                        <div className="bg-[#EAF9F1] px-[10px] py-[4px] rounded-full flex items-center gap-1.5">
                                            <CheckCircle2 className="w-[11px] h-[11px] text-[#00C767] stroke-[3px]" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-[#00C767]">Primary</span>
                                        </div>
                                    </div>
                                    <h3 className="text-[22px] font-extrabold text-[#111A2C] tracking-tight">Daily Driver</h3>

                                    {/* License Plate Mock */}
                                    <div className="w-full h-[76px] bg-[#F4F6F8] border border-[#DEE3E8] rounded-[14px] mt-6 relative flex flex-col items-center justify-center overflow-hidden">
                                        <div className="absolute top-[6px] left-[10px] text-[9px] font-bold text-slate-400">GH</div>
                                        <div className="text-[26px] font-black text-[#111A2C] tracking-[0.15em] font-mono opacity-20 mt-1">GH-3920</div>
                                        <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[24px] h-[16px] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col">
                                            <div className="flex-1 bg-red-600" />
                                            <div className="flex-1 bg-yellow-400" />
                                            <div className="flex-1 bg-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services Tab Content */}
                        {activeTab === 'services' && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-300 relative">
                                <h1 className="text-[32px] leading-[1.1] font-extrabold text-[#111A2C] tracking-tight mb-6">Services</h1>

                                {/* Search Bar */}
                                <div className="bg-white h-[56px] rounded-2xl shadow-sm border border-[#E9EEF2] flex items-center px-4 mb-8">
                                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search services or ask AI..."
                                        className="flex-1 bg-transparent border-none outline-none px-3 text-[15px] font-medium placeholder:text-slate-400"
                                        readOnly
                                    />
                                    <div className="bg-[#EAF9F1] text-[#00C767] font-black text-[10px] px-2 py-1 rounded-lg shrink-0">AI</div>
                                </div>

                                {/* Active System Banner */}
                                <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-[#E9EEF2] mb-6 flex items-center gap-5 relative overflow-hidden">
                                    <div className="w-[60px] h-[60px] rounded-full bg-[#EAF9F1] flex items-center justify-center relative shrink-0">
                                        <div className="absolute inset-2 border-2 border-[#00C767]/30 rounded-full" />
                                        <div className="absolute inset-4 border-[3px] border-[#00C767] rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#00C767] rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00C767]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#00C767]">System Active</span>
                                        </div>
                                        <h3 className="text-[18px] font-bold text-[#111A2C] leading-snug">Local Marketplace</h3>
                                        <p className="text-[13px] text-slate-500 font-medium">21 service providers are currently online</p>
                                    </div>
                                </div>

                                {/* Distance Filters */}
                                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide mb-8 -mx-5 px-5">
                                    {['2km', '5km', '10km', '25km'].map((d) => (
                                        <div key={d} className="bg-white border border-[#E9EEF2] px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 whitespace-nowrap shadow-sm hover:border-slate-300 cursor-pointer">{d}</div>
                                    ))}
                                    <div className="bg-[#111A2C] text-white px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap shadow-md cursor-pointer">Show All</div>
                                </div>

                                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide mb-8 -mx-5 px-5">
                                    {['Open Now', 'Verified Only'].map((f) => (
                                        <div key={f} className="bg-white border border-[#E9EEF2] px-4 py-2 rounded-xl text-[13px] font-bold text-slate-600 whitespace-nowrap shadow-sm hover:border-slate-300 cursor-pointer">{f}</div>
                                    ))}
                                </div>

                                {/* AI Mechanic Banner */}
                                <div className="bg-[#EEF1FF] border border-[#DDE4FF] rounded-2xl p-5 mb-10 flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#DDE4FF] flex items-center justify-center shrink-0">
                                            <Sparkles className="w-5 h-5 text-[#5A7CFF]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#111A2C] text-[15px] mb-0.5">Ask AI Mechanic</h4>
                                            <p className="text-[#5A7CFF] text-[13px] font-bold">Identify mechanical issues instantly with AI</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#5A7CFF] group-hover:translate-x-1 transition-transform" />
                                </div>

                                {/* Category List */}
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#A2Aab6] mb-4 px-1">Mechanics & Performance</h4>

                                <div className="space-y-4 pb-12">
                                    {[
                                        { icon: Wrench, title: 'Mechanic (General)', desc: 'General auto repairs & maintenance', count: '13 nearby', bg: 'bg-[#EEF1FF]', text: 'text-[#4A90E2]', sub: 'bg-[#EEF1F1]' },
                                        { icon: Settings, title: 'Mechanic (Engine)', desc: 'Engine specialists & overhauls', count: '1 nearby', bg: 'bg-[#F4F4FF]', text: 'text-[#5E5CE6]', sub: 'bg-[#EAF9F1] text-[#00C767]' }
                                    ].map((cat, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                                            <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center shrink-0`}>
                                                <cat.icon className={`w-6 h-6 ${cat.text}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="font-extrabold text-[#111A2C] text-[16px] mb-1">{cat.title}</h5>
                                                <p className="text-[13px] text-slate-500 font-medium mb-2">{cat.desc}</p>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.sub || 'bg-[#EAF9F1] text-[#00C767]'}`}>{cat.count}</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-300 relative">
                                <h1 className="text-[32px] leading-[1.1] font-extrabold text-[#111A2C] tracking-tight mb-8">Profile</h1>

                                {/* User Core Card */}
                                <div className="bg-white rounded-[28px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-[#E9EEF2] mb-6 flex items-center gap-5 cursor-pointer">
                                    <div className="w-[72px] h-[72px] rounded-full p-1 bg-gradient-to-tr from-[#00C767] to-[#A3E5C8] shrink-0">
                                        <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-slate-100">
                                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[20px] font-extrabold text-[#111A2C] mb-1">Nii Offei Dario</h3>
                                        <p className="text-[14px] text-slate-500 font-medium mb-2">maxcofie@gmail.com</p>
                                        <div className="bg-[#EAF9F1] text-[#00C767] font-black text-[10px] px-2 py-1 rounded-md uppercase tracking-widest inline-block">100% Strength</div>
                                    </div>
                                    <Edit3 className="w-5 h-5 text-[#00C767]" />
                                </div>

                                {/* Safety Score Card */}
                                <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] mb-10 flex items-center gap-4 cursor-pointer">
                                    <div className="w-14 h-14 rounded-full border-[3px] border-[#00C767] flex items-center justify-center font-black text-[#111A2C] text-[18px] shrink-0 relative overflow-hidden">
                                        100
                                        <div className="absolute bottom-0 left-0 w-full h-[15%] bg-[#EAF9F1]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-extrabold text-[#111A2C] text-[16px] mb-0.5">Safety Score</h4>
                                        <p className="text-[13px] text-slate-500 font-medium">Track your drive to improve</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </div>

                                {/* Menu List */}
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#A2Aab6] mb-4 px-1">Personalization</h4>
                                <div className="bg-white rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] mb-8 overflow-hidden">
                                    {[
                                        { icon: User, label: 'Personal Info', bg: 'bg-[#EEF1FF]', color: 'text-[#5A7CFF]' },
                                        { icon: Heart, label: 'Favorite Providers', bg: 'bg-[#FFF0F0]', color: 'text-[#FF5A5A]' },
                                        { icon: Car, label: 'Garage Management', bg: 'bg-[#FFF6EB]', color: 'text-[#F5A623]' }
                                    ].map((item, i, arr) => (
                                        <div key={i} className={`flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <span className="flex-1 font-bold text-[#111A2C] text-[16px]">{item.label}</span>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </div>
                                    ))}
                                </div>

                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#A2Aab6] mb-4 px-1">Smart NFC Management</h4>
                                <div className="bg-white rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] mb-8 overflow-hidden pb-12">
                                    {[
                                        { icon: ScanFace, label: 'Physical Card Management', bg: 'bg-[#EEF1FF]', color: 'text-[#5A7CFF]', action: () => setActiveTab('nfc') },
                                        { icon: Clock, label: 'Card Request History', bg: 'bg-[#F4F4FF]', color: 'text-[#5E5CE6]' }
                                    ].map((item, i, arr) => (
                                        <div key={i} onClick={item.action} className={`flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <span className="flex-1 font-bold text-[#111A2C] text-[16px]">{item.label}</span>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Smart NFC Detail Modal (Onyx) */}
                        {activeTab === 'nfc' && (
                            <div className="absolute inset-0 bg-[#F4F6F8] z-[60] overflow-y-auto scrollbar-hide flex flex-col pt-4 pb-12 px-6 animate-in slide-in-from-bottom-full duration-500">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-10 pt-4">
                                    <ChevronLeft className="w-7 h-7 text-[#111A2C] cursor-pointer" onClick={() => setActiveTab('profile')} />
                                    <h2 className="text-[20px] font-extrabold text-[#111A2C]">Smart NFC Card</h2>
                                    <Clock className="w-6 h-6 text-[#111A2C]" />
                                </div>

                                {/* Onyx Card Face Mock */}
                                <div className="w-full aspect-[1.6] bg-[#171717] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-6 flex flex-col justify-between relative overflow-hidden mb-8">
                                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="text-[14px] font-bold tracking-[0.2em] text-white/90">MOTOR AMBOS</div>
                                        <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm relative">
                                            <div className="w-5 h-5 border-[2px] border-white/80 rounded-sm" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/80 rounded-sm" />
                                            <div className="absolute bottom-1 w-2.5 h-[2px] bg-white/80" />
                                        </div>
                                    </div>

                                    <div className="absolute top-20 right-6 z-10">
                                        <div className="px-3 py-1 rounded-full border border-[#FFD700]/30 text-[#FFD700] text-[10px] font-extrabold tracking-widest uppercase bg-[#FFD700]/10 backdrop-blur-md">Premium</div>
                                    </div>

                                    <div className="relative z-10 mt-auto">
                                        <div className="text-[10px] font-bold tracking-[0.2em] text-white/50 mb-1">ONYX EDITION</div>
                                        <div className="text-[14px] text-white/80 font-medium mb-2">Elite Member</div>
                                        <div className="text-[24px] font-extrabold text-white tracking-tight">Tap to Access</div>
                                    </div>
                                </div>

                                {/* Pagination Dots */}
                                <div className="flex justify-center gap-2 mb-10">
                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                    <div className="w-6 h-2 rounded-full bg-[#00C767]" />
                                </div>

                                {/* Benefits Content */}
                                <div className="text-center mb-8">
                                    <h3 className="text-[22px] font-extrabold text-[#111A2C] mb-2">Onyx Benefits</h3>
                                    <p className="text-[14px] text-slate-500 font-medium">Unlock the full potential of your digital garage.</p>
                                </div>

                                <div className="bg-white rounded-[28px] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-[#E9EEF2]">
                                    {[
                                        { icon: Shield, title: 'Priority Support', desc: '24/7 dedicated support line.', bg: 'bg-[#FFF6EB]', color: 'text-[#F5A623]' },
                                        { icon: RefreshCw, title: 'Full History', desc: 'Unlimited service history storage.', bg: 'bg-[#FFF0F0]', color: 'text-[#FF5A5A]' },
                                        { icon: Sparkles, title: 'Exclusive Perks', desc: 'Discounts on fuel and maintenance.', bg: 'bg-[#EEF1FF]', color: 'text-[#5A7CFF]' },
                                        { icon: CheckCircle2, title: 'Verified Badge', desc: 'Get a verified badge on your profile.', bg: 'bg-[#EAF9F1]', color: 'text-[#00C767]' }
                                    ].map((benefit, i, arr) => (
                                        <div key={i} className={`flex items-start gap-4 p-4 ${i !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                            <div className={`w-12 h-12 rounded-[14px] ${benefit.bg} flex items-center justify-center shrink-0`}>
                                                <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                                            </div>
                                            <div className="pt-1">
                                                <h5 className="font-extrabold text-[#111A2C] text-[15px] mb-1">{benefit.title}</h5>
                                                <p className="text-[13px] text-slate-500 font-medium">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full bg-[#F5A623] hover:bg-[#E09612] text-white py-[18px] rounded-[20px] font-extrabold text-[15px] shadow-lg shadow-[#F5A623]/30 mt-8 active:scale-[0.98] transition-all uppercase tracking-widest">
                                    Order Onyx Card
                                </button>
                            </div>
                        )}

                        {/* Activity Tab Content */}
                        {activeTab === 'activity' && (
                            <div className="animate-in fade-in slide-in-from-left-8 duration-300 relative">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-[32px] leading-[1.1] font-extrabold text-[#111A2C] tracking-tight">Activity</h1>
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#E9EEF2] flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                        <SlidersHorizontal className="w-5 h-5 text-[#111A2C]" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] mb-8 p-6 flex divide-x divide-slate-100">
                                    <div className="flex-1 pr-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#A2Aab6] mb-1">Total Spending</div>
                                        <div className="text-[20px] font-extrabold text-[#00C767]">GHS 1,221.00</div>
                                    </div>
                                    <div className="flex-1 pl-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#A2Aab6] mb-1">Latest Odometer</div>
                                        <div className="text-[20px] font-extrabold text-[#111A2C]">55,000 KM</div>
                                    </div>
                                </div>

                                {/* Filter Pills */}
                                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide mb-8 -mx-5 px-5">
                                    <div className="bg-[#111A2C] text-white px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap shadow-md cursor-pointer">All</div>
                                    {['Service', 'Fuel', 'Rescue', 'Insurance'].map((f) => (
                                        <div key={f} className="bg-white border border-[#E9EEF2] px-5 py-2.5 rounded-full text-[13px] font-bold text-slate-600 whitespace-nowrap shadow-sm hover:border-slate-300 cursor-pointer">{f}</div>
                                    ))}
                                </div>

                                {/* Timeline */}
                                <div className="relative pl-6 pb-12 space-y-6">
                                    <div className="absolute left-[3px] top-2 bottom-0 w-[2px] bg-slate-200" />

                                    {[
                                        { date: 'Feb 20, 2026', cost: 'GHS 750.00', title: 'General Repair, Suspension', provider: 'Moonic Auto Mechanic', km: '55,000 KM' },
                                        { date: 'Feb 16, 2026', cost: 'GHS 200.00', title: 'Oil Change', provider: 'Madina Amposan', km: '30,000 KM' },
                                        { date: 'Feb 16, 2026', cost: 'GHS 176.00', title: 'Oil Change, Tire Service, Brake Pads', provider: 'QuickFit Auto', km: '29,800 KM' }
                                    ].map((item, i) => (
                                        <div key={i} className="relative cursor-pointer transition-transform hover:-translate-y-1">
                                            <div className="absolute -left-[30px] top-1 w-[14px] h-[14px] rounded-full bg-[#00C767] border-4 border-[#F4F6F8] shadow-sm z-10" />
                                            <div className="flex justify-between items-end mb-2">
                                                <div className="text-[12px] font-bold text-slate-500">{item.date}</div>
                                                <div className="text-[14px] font-extrabold text-[#00C767]">{item.cost}</div>
                                            </div>
                                            <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2]">
                                                <h5 className="font-extrabold text-[#111A2C] text-[15px] mb-1 truncate">{item.title}</h5>
                                                <p className="text-[13px] text-slate-500 font-medium mb-3">{item.provider}</p>
                                                <div className="inline-block bg-[#F4F6F8] px-3 py-1 rounded-md text-[11px] font-bold text-slate-500 border border-slate-200">{item.km}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Emergency SOS Modal */}
                        {activeTab === 'sos' && (
                            <div className="absolute inset-0 bg-[#F4F6F8] z-[60] overflow-y-auto scrollbar-hide flex flex-col pt-4 pb-12 px-6 animate-in slide-in-from-bottom-full duration-500">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-10 pt-4">
                                    <X className="w-7 h-7 text-[#111A2C] cursor-pointer" onClick={() => setActiveTab('home')} />
                                    <div className="flex-1 flex justify-center items-center gap-2 pr-7">
                                        <div className="w-2 h-2 rounded-full bg-[#FA3555] animate-pulse" />
                                        <h2 className="text-[20px] font-extrabold text-[#111A2C]">Emergency SOS</h2>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center mb-10 mt-4">
                                    <div className="w-[120px] h-[120px] rounded-full bg-[#D32F2F] shadow-[0_20px_40px_rgba(211,47,47,0.4)] flex items-center justify-center mb-8 relative cursor-pointer active:scale-95 transition-transform">
                                        <div className="absolute inset-0 bg-[#D32F2F] rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 pointer-events-none" />
                                        <AlertTriangle className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-[28px] font-extrabold text-[#111A2C] mb-3">Need Help?</h3>
                                    <p className="text-[15px] text-slate-500 font-medium text-center px-4 leading-relaxed">
                                        Select your issue type to request immediate roadside assistance.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: CarFront, label: 'Flat Tyre' },
                                        { icon: BatteryMedium, label: 'Dead Battery' },
                                        { icon: Thermometer, label: 'Overheating' },
                                        { icon: AlertTriangle, label: 'Accident' }
                                    ].map((action, i) => (
                                        <div key={i} className="bg-white rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-[#E9EEF2] flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]">
                                            <action.icon className="w-8 h-8 text-[#FA3555]" />
                                            <span className="text-[13px] font-bold text-[#111A2C]">{action.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Floating Bottom Nav */}
                    <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-[#E9EEF2]/50 pb-6 pt-3 px-6 flex justify-between items-end rounded-b-[44px] z-50">
                        {/* Fake Home Indicator Line */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[4px] bg-[#111A2C]/10 rounded-full" />

                        {[
                            { id: 'home', icon: Home, label: 'Home' },
                            { id: 'services', icon: Wrench, label: 'Services' },
                        ].map((tab) => (
                            <div key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-[5px] cursor-pointer w-14 mb-[6px]">
                                <tab.icon className={`w-[22px] h-[22px] ${activeTab === tab.id ? 'text-[#00C767] fill-[#00C767]' : 'text-[#A2Aab6]'}`} />
                                <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-[#00C767]' : 'text-[#A2Aab6]'}`}>{tab.label}</span>
                            </div>
                        ))}

                        <div
                            className={`w-16 h-16 rounded-full bg-[#FA3555] shadow-[0_16px_32px_rgba(250,53,85,0.4)] flex items-center justify-center text-white -mb-1 cursor-pointer transition-all duration-300 ${isPulsing || activeTab === 'sos' ? 'scale-[0.85] shadow-none bg-[#D32F2F]' : 'hover:scale-105'} flex-shrink-0 z-50 ring-[6px] ring-white relative group`}
                            onClick={() => {
                                setIsPulsing(true);
                                setActiveTab('sos');
                            }}
                            onAnimationEnd={() => setIsPulsing(false)}
                        >
                            <div className="absolute inset-0 bg-[#FA3555] rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 group-hover:hidden" />
                            <Asterisk className={`w-8 h-8 stroke-[3px] relative z-10 ${isPulsing ? 'animate-spin' : ''} ${activeTab === 'sos' ? 'rotate-45' : ''} transition-transform duration-300`} />
                        </div>

                        {[
                            { id: 'activity', icon: Clock, label: 'Activity' },
                            { id: 'profile', icon: User, label: 'Profile' }
                        ].map((tab) => (
                            <div key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center gap-[5px] cursor-pointer w-14 mb-[6px]">
                                <tab.icon className={`w-[22px] h-[22px] ${activeTab === tab.id ? 'text-[#00C767]' : 'text-[#A2Aab6]'}`} />
                                <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-[#00C767]' : 'text-[#A2Aab6]'}`}>{tab.label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};
