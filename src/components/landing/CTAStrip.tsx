"use client";

import { Button } from "@/components/ui/button";

export function CTAStrip() {
    return (
        <section className="border-t border-border bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">24/7 Support</p>
                    <h3 className="text-xl font-semibold text-foreground">Stuck right now?</h3>
                    <p className="text-muted-foreground text-sm">Our network is active. Request help without a membership.</p>
                </div>
                <Button className="bg-foreground text-background hover:bg-muted-foreground font-bold rounded-full px-8">
                    Get Help Now
                </Button>
            </div>
        </section>
    );
}
