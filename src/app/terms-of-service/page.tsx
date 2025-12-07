import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
                        <p className="mb-4">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Motor Ambos ("we," "us," or "our"), concerning your access to and use of our website and services. By accessing the site, you have read, understood, and agreed to be bound by all of these Terms of Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">2. Intellectual Property Rights</h2>
                        <p className="mb-4">
                            Unless otherwise indicated, the safe is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">3. User Representations</h2>
                        <p className="mb-4">
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
                        <p className="mb-4">
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                        <p className="mb-4">
                            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@motorambos.com.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
