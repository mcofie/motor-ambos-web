import React from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to Motor Ambos ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website and use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                        <p className="mb-4">
                            We may collect information about you in a variety of ways. The information we may collect includes:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                        <p className="mb-4">
                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Speedily, we use information collected about you via the site to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Create and manage your account.</li>
                            <li>Process your orders and payments.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the site.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">4. Disclosure of Your Information</h2>
                        <p className="mb-4">
                            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                        <p className="mb-4">
                            If you have questions or comments about this Privacy Policy, please contact us at support@motorambos.com.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
