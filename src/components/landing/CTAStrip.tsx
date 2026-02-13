"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTAStrip() {
    return (
        <section className="border-t border-border bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Fleet Management</p>
                    <h3 className="text-xl font-semibold text-foreground">Managing a corporate fleet?</h3>
                    <p className="text-muted-foreground text-sm">Boost efficiency and security with Motor Ambos for Business.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" asChild className="font-bold rounded-full px-8">
                        <Link href="/business">Fleet Solutions</Link>
                    </Button>
                    <Button className="bg-foreground text-background hover:bg-muted-foreground font-bold rounded-full px-8">
                        Order Smart Card
                    </Button>
                </div>
            </div>
        </section>
    );
}
