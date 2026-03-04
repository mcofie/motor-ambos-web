"use client";

import React from 'react';
import { Shield, Clock, Search, MapPin, CreditCard, CheckCircle2, AlertCircle, FileText, Settings, Activity, ArrowRight, ChevronDown, Home, Car, Wrench } from 'lucide-react';

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
