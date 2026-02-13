"use client";

import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-border bg-background pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="h-6 w-6 text-primary" />
                            <span className="font-bold text-foreground">Motor Ambos</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            The Operating System for car ownership in Ghana. Verified data, genuine parts, and simplified compliance.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/digital-passport" className="hover:text-primary">Digital Passport</Link></li>
                            <li><Link href="/concierge" className="hover:text-primary">DVLA Concierge</Link></li>
                            <li><Link href="/club" className="hover:text-primary">Ambos Club</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about-us" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/for-mechanics" className="hover:text-primary">For Mechanics</Link></li>
                            <li><Link href="/resources" className="hover:text-primary">Resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© {year} MotorAmbos. All rights reserved.</p>
                    <p>Made for drivers.</p>
                </div>
            </div>
        </footer>
    );
}
