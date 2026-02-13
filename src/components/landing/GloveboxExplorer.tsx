"use client";

import React, { useState } from 'react';
import { ShieldCheck, ClipboardList, CreditCard, ReceiptText, ChevronRight, Zap } from 'lucide-react';

const DOCUMENTS = [
    {
        id: 'insurance',
        label: 'Insurance & Roadworthy',
        icon: ShieldCheck,
        status: 'Active',
        expiry: 'Dec 2024',
        details: 'Verified by NIC - Platinum Coverage',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
        id: 'logs',
        label: 'Verified Service Logs',
        icon: ClipboardList,
        status: 'Last: 2 days ago',
        details: 'Oil Change & Brake Pads - Silver Star Auto',
        color: 'bg-[#9FE870]/10 text-[#9FE870] border-[#9FE870]/20'
    },
    {
        id: 'receipts',
        label: 'Maintenance Spending',
        icon: ReceiptText,
        status: 'GHC 4,200 Total',
        details: '2024 Expenditure - 100% Digital Trail',
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    }
];

export function GloveboxExplorer() {
    const [activeId, setActiveId] = useState('logs');

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Visual: Layered Cards */}
                    <div className="flex-1 w-full order-2 lg:order-1">
                        <div className="relative h-[480px] perspective-2000 w-full max-w-md mx-auto">
                            {DOCUMENTS.map((doc, index) => {
                                const isActive = activeId === doc.id;
                                const stackIndex = DOCUMENTS.findIndex(d => d.id === activeId);
                                const diff = index - stackIndex;

                                return (
                                    <div
                                        key={doc.id}
                                        onClick={() => setActiveId(doc.id)}
                                        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer
                                            ${isActive ? 'z-30 translate-y-0 opacity-100 scale-100 rotate-0' :
                                                diff > 0 ? `z-10 translate-y-24 opacity-40 scale-90 rotate-2` :
                                                    `z-20 -translate-y-12 opacity-60 scale-95 -rotate-2`}
                                        `}
                                    >
                                        <div className={`w-full h-full glass-premium rounded-3xl p-8 border-2 flex flex-col justify-between
                                            ${isActive ? 'border-primary/40 shadow-2xl shadow-primary/10' : 'border-white/5 shadow-lg'}
                                        `}>
                                            <div className="flex justify-between items-start">
                                                <div className={`p-4 rounded-xl ${doc.color} border`}>
                                                    <doc.icon className="h-8 w-8" />
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</span>
                                                        <span className="service-pulse" />
                                                    </div>
                                                    <span className="font-bold text-sm">{doc.status}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-2xl font-bold tracking-tight">{doc.label}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {doc.details}
                                                </p>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="h-1.5 w-1/4 rounded-full bg-white/5" />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-white/5 pt-6 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Authenticated ID</span>
                                                    <span className="font-mono text-[10px] text-white/40">PASSPORT-V2.0-8821</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                                                    View Details <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-8 order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                            <Zap className="h-3.5 w-3.5 fill-primary/20" />
                            <span className="tracking-wide uppercase">The Digital Glovebox Explorer</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                            Total organization. <br />
                            <span className="text-primary italic font-light">Zero paperwork.</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Stop digging through your physical glovebox for receipts and cards.
                            Motor Ambos digitizes and <strong>verifies</strong> every critical document for your car.
                        </p>

                        <div className="space-y-6 pt-4">
                            {DOCUMENTS.map((doc) => (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveId(doc.id)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group
                                        ${activeId === doc.id ? 'bg-muted border-primary/40 shadow-lg scale-[1.02]' : 'bg-card border-border hover:border-primary/20'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${doc.color}`}>
                                            <doc.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-lg">{doc.label}</h5>
                                            <span className="text-xs text-muted-foreground tracking-wide">{doc.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${activeId === doc.id ? 'translate-x-1 text-primary' : 'text-muted-foreground group-hover:translate-x-1'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
