import React from 'react';
import { FileText, Download } from 'lucide-react';
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
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container mx-auto px-4 py-12 max-w-5xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold mb-4">Resources</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Download helpful guides, checklists, and documentation to help you get the most out of Motor Ambos.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {resources.map((resource) => (
                            <div key={resource.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-all bg-card text-card-foreground">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-secondary rounded text-secondary-foreground">
                                        PDF
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                                <p className="text-muted-foreground mb-6 h-20">
                                    {resource.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <span className="text-sm text-muted-foreground">{resource.size}</span>
                                    <a
                                        href={`/resources/${resource.filename}`}
                                        download
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
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
