"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Car } from "lucide-react";

export function MembershipSection() {
    return (
        <section id="membership" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-black text-[#9ae600] dark:bg-card dark:text-foreground border border-border">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
                        <div className="space-y-6">
                            <Badge variant="outline" className="border-[#9ae600]/30 text-[#9ae600] bg-[#9ae600]/10 dark:border-primary/30 dark:text-primary dark:bg-primary/10">
                                Motor Ambos Club
                            </Badge>
                            <h2 className="text-3xl sm:text-5xl font-bold text-inherit tracking-tight">
                                Drive with confidence. <br /> Join the Club.
                            </h2>
                            <ul className="space-y-4 text-[#9ae600]/80 dark:text-muted-foreground">
                                {[
                                    "Priority service for all repairs",
                                    "Automated DVLA & Insurance renewals",
                                    "Free towing and emergency rescue",
                                    "Verified 'CarFax' style health reports"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-[#9ae600] dark:text-primary shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <Button className="bg-[#9ae600] text-black hover:bg-[#9ae600]/90 font-semibold dark:bg-foreground dark:text-background dark:hover:bg-muted-foreground">
                                    Become a Member
                                </Button>
                                <Button variant="ghost" className="text-inherit hover:text-[#9ae600] hover:bg-white/10 dark:text-foreground dark:hover:text-primary dark:hover:bg-muted">
                                    Compare Plans
                                </Button>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-md aspect-[1.58/1] rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* CSS-only Card Mockup */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-background border border-border shadow-2xl flex flex-col justify-between p-6 text-foreground">
                                <div className="flex justify-between items-start">
                                    <Car className="text-primary h-8 w-8" />
                                    <span className="font-mono text-xs text-muted-foreground">MEMBER ID</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold tracking-wider mb-1">JOHN DOE</div>
                                    <div className="text-xs text-muted-foreground font-mono">**** **** **** 4291</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">PREMIUM</span>
                                    <div className="h-8 w-12 bg-muted rounded-md opacity-50" />
                                    {/* Chip */}
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
