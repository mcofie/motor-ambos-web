import React from 'react';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ResourcesPage() {
    const resources = [
        {
            id: 1,
            title: "Motor Ambos Provider Guidelines",
            description: "A comprehensive guide for service providers on our network, detailing standards, expectations, and best practices.",
            filename: "resource-1.pdf",
            size: "2.4 MB"
        },
        {
            id: 2,
            title: "Vehicle Maintenance Checklist",
            description: "Standard operating procedure checklist for routine vehicle maintenance and safety inspections.",
            filename: "resource-2.pdf",
            size: "1.8 MB"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-44 pb-32">
                <div className="wise-container">
                    <div className="max-w-4xl mx-auto text-center space-y-12 mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0F2F5] rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079]">
                            Technical Documentation
                        </div>
                        <h1 className="wise-heading-hero">Resources.</h1>
                        <p className="wise-body text-xl max-w-2xl mx-auto">
                            Download helpful guides, checklists, and documentation to help you get the most out of the Motor Ambos ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {resources.map((resource) => (
                            <div key={resource.id} className="wise-card !p-12 space-y-10 group hover:border-[#9FE870] transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="p-4 bg-[#F0F2F5] rounded-2xl text-[#2D5B18] group-hover:bg-[#9FE870] transition-colors">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black px-4 py-1.5 bg-black text-white rounded-full tracking-widest uppercase">
                                        PDF Node
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{resource.title}</h3>
                                    <p className="text-sm font-bold text-[#5D7079] leading-relaxed uppercase tracking-widest min-h-[60px]">
                                        {resource.description}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-border flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-[#5D7079]">{resource.size}</span>
                                    <a
                                        href={`/resources/${resource.filename}`}
                                        download
                                        className="wise-btn-primary !px-6 !py-3 !text-xs flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        Download Protocol
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
