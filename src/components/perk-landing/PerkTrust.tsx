"use client";

import React from "react";

export function PerkTrust() {
    const statements = [
        { label: "01 // INTEGRITY", text: "Verified service records built on immutable logs. No hidden history." },
        { label: "02 // SCALE", text: "Engineered to manage vehicle fleets from 10 to 10,000 units across Africa." },
        { label: "03 // SOVEREIGNTY", text: "Your vehicle data, structured and accessible. Ownership through visibility." }
    ];

    return (
        <section id="trust" className="section-blue">
            <div className="fintech-container">
                <div className="grid lg:grid-cols-12 gap-24 items-start">
                    <div className="lg:col-span-12 space-y-12 mb-24">
                        <h2 className="section-heading">Built for scale across Africa.</h2>
                        <div className="h-2 w-48 bg-black" />
                    </div>

                    <div className="lg:col-span-12 grid md:grid-cols-3 gap-16">
                        {statements.map((s, i) => (
                            <div key={i} className="space-y-10 group">
                                <div className="label-technical text-black group-hover:text-[#9FE870] transition-colors">{s.label}</div>
                                <p className="hero-heading !text-3xl lg:!text-5xl !leading-tight tracking-tighter">
                                    {s.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
