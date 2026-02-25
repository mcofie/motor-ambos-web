"use client";

import React from "react";
import { ArrowRight, Globe, Layers, Cpu } from "lucide-react";

export function PerkNFC() {
    const cards = [
        {
            id: "onyx",
            name: "Onyx Edition",
            desc: "The high-integrity stealth finish. Precision-machined for professional nodes.",
            img: "/images/onyx-card.png",
            theme: "bg-[#1A1A1A] text-white",
            tag: "Premium"
        },
        {
            id: "vector",
            name: "Vector Edition",
            desc: "A clean, clinical aesthetic. The standard for modern vehicle identity.",
            img: "/images/vector-card.png",
            theme: "bg-[#F2F2F2] text-black",
            tag: "Standard"
        }
    ];

    return (
        <section id="nfc" className="wise-section bg-white border-t border-border">
            <div className="wise-container">
                <div className="space-y-24">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                            <Layers size={14} className="text-[#9FE870]" />
                            Physical Node Identity
                        </div>
                        <h2 className="wise-heading-section !text-[44px] md:!text-[72px] lg:!text-[88px] !leading-[0.95]">
                            Pick your <br /> passport.
                        </h2>
                        <p className="wise-body text-xl max-w-2xl mx-auto">
                            The Onyx Card is more than hardware. It is the verifiable bridge between your physical car and its digital history.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {cards.map((card) => (
                            <div key={card.id} className={`rounded-[32px] overflow-hidden flex flex-col group cursor-default shadow-sm border border-border/50 ${card.theme}`}>
                                <div className="p-12 aspect-[1.4/1] flex items-center justify-center overflow-hidden">
                                    <img
                                        src={card.img}
                                        alt={card.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                                <div className="p-12 pt-0 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-3xl font-black tracking-tight">{card.name}</h3>
                                        <span className="px-3 py-1 rounded-full border border-current/20 text-[10px] font-black uppercase tracking-widest">{card.tag}</span>
                                    </div>
                                    <p className={`text-lg font-bold ${card.id === 'onyx' ? 'text-white/40' : 'text-black/40'} leading-relaxed`}>
                                        {card.desc}
                                    </p>
                                    <div className="pt-8 flex items-center justify-between">
                                        <button className={`font-black text-sm uppercase tracking-widest flex items-center gap-3 group/btn ${card.id === 'onyx' ? 'text-[#9FE870]' : 'text-black'}`}>
                                            Select {card.name}
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <Cpu size={24} className="opacity-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12">
                        {[
                            { title: "Verifiable", icon: Globe, desc: "Signed at every tap." },
                            { title: "Indestructible", icon: Layers, desc: "Built for the glovebox." },
                            { title: "Universal", icon: Cpu, desc: "Works with any phone." }
                        ].map((feat, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center shrink-0">
                                    <feat.icon size={20} className="text-black" />
                                </div>
                                <div className="space-y-1">
                                    <div className="font-black text-lg">{feat.title}</div>
                                    <div className="text-sm font-bold text-[#5D7079]">{feat.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
