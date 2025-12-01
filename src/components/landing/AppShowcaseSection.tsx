"use client";

import { Button } from "@/components/ui/button";

export function AppShowcaseSection() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="rounded-3xl bg-primary text-primary-foreground px-8 pt-12 pb-0 md:px-20 md:pt-20 md:flex items-center justify-between relative overflow-hidden">

                    <div className="md:w-1/2 pb-12 md:pb-20 z-10 relative">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            The workshop <br /> in your pocket.
                        </h2>
                        <p className="text-primary-foreground/90 font-medium text-lg mb-8 max-w-md">
                            Download the Motor Ambos app to manage your garage, track requests, and pay securely.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Mock App Store Buttons */}
                            <Button className="bg-[#9ae600] text-black hover:bg-[#9ae600]/90 h-12 px-6 rounded-xl dark:bg-black dark:text-white dark:hover:bg-black/80">
                                Download on iOS
                            </Button>
                            <Button className="bg-[#9ae600] text-black hover:bg-[#9ae600]/90 h-12 px-6 rounded-xl dark:bg-transparent dark:border-2 dark:border-black dark:text-black dark:hover:bg-black/10">
                                Get it on Android
                            </Button>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center md:justify-end relative z-10 translate-y-4 md:translate-y-0">
                        {/* Replace with actual Image of iPhone */}
                        <div className="w-64 h-[500px] bg-foreground rounded-t-[3rem] border-[8px] border-foreground shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                                [App Screen Mockup]
                            </div>
                        </div>
                    </div>

                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] pointer-events-none mix-blend-overlay" />
                </div>
            </div>
        </section>
    );
}
