"use client";

import React from "react";
import { ArrowRight, Apple, Play } from "lucide-react";

export function PerkFinalCTA() {
    return (
        <section className="uber-section uber-section-grey">
            <div className="uber-container text-center space-y-16">
                <div className="space-y-6">
                    <h2 className="uber-heading-section text-[48px] md:text-[64px]">
                        Download the app. Stay in control.
                    </h2>
                    <p className="uber-body text-xl max-w-2xl mx-auto">
                        Motor Ambos is the digital passport for your car. Manage everything from your phone.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button className="uber-btn-primary !px-12 !py-6 !text-xl !rounded-none flex items-center gap-4">
                        <Apple size={24} />
                        Get it on iOS
                    </button>
                    <button className="uber-btn-primary !px-12 !py-6 !text-xl !rounded-none flex items-center gap-4">
                        <Play size={24} fill="currentColor" />
                        Get it on Android
                    </button>
                </div>

                <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-12">
                    <button className="flex items-center gap-3 font-bold text-lg hover:text-black/60 transition-colors group">
                        Request demo
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button className="flex items-center gap-3 font-bold text-lg hover:text-black/60 transition-colors group">
                        Become a provider
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
