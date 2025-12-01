import { Suspense } from "react";
import { MembershipPageClient } from "./MembershipPageClient";

function MembershipFallback() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
                <div className="space-y-3">
                    <div className="h-5 w-40 rounded-full bg-muted animate-pulse" />
                    <div className="h-7 w-56 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-64 rounded-full bg-muted animate-pulse" />
                </div>

                <div className="relative mx-auto mt-2 max-w-sm">
                    <div className="absolute inset-0 translate-y-3 rounded-3xl bg-muted/60 blur-2xl" />
                    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card px-4 py-4 shadow-sm">
                        <div className="space-y-4 animate-pulse">
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="h-5 w-28 rounded-full bg-muted" />
                                    <div className="h-4 w-32 rounded-full bg-muted" />
                                    <div className="h-3 w-40 rounded-full bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 w-20 rounded-full bg-muted" />
                                    <div className="h-4 w-24 rounded-full bg-muted" />
                                    <div className="h-3 w-24 rounded-full bg-muted" />
                                </div>
                            </div>

                            <div className="h-px bg-muted" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="h-3 w-20 rounded-full bg-muted" />
                                    <div className="h-4 w-24 rounded-full bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-20 rounded-full bg-muted" />
                                    <div className="h-4 w-24 rounded-full bg-muted" />
                                </div>
                            </div>

                            <div className="h-px bg-muted" />

                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="h-3 w-24 rounded-full bg-muted" />
                                    <div className="h-4 w-28 rounded-full bg-muted" />
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export const metadata = {
    title: "Membership",
    description: "Join the Motor Ambos Club for priority response, discounted fees, and free annual checks.",
};

export default function MembershipPage() {
    return (
        <Suspense fallback={<MembershipFallback />}>
            <MembershipPageClient />
        </Suspense>
    );
}