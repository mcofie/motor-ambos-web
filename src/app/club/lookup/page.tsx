"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export default function MembershipLookupPage() {
    const router = useRouter();
    const [membershipId, setMembershipId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!membershipId.trim()) return;

        setIsSubmitting(true);
        // Navigate to the digital card page with the ID
        router.push(`/club?m=${encodeURIComponent(membershipId.trim())}`);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-border shadow-lg">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
                            <Search className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Member Access</span>
                            </div>
                            <CardTitle className="text-2xl font-bold">Find Your Card</CardTitle>
                            <CardDescription className="text-base">
                                Enter your Membership ID to view your verified digital card.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="membershipId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Membership ID
                                </label>
                                <Input
                                    id="membershipId"
                                    placeholder="e.g. MBR-2024-001"
                                    value={membershipId}
                                    onChange={(e) => setMembershipId(e.target.value.toUpperCase())}
                                    className="h-12 text-lg font-mono placeholder:font-sans"
                                    autoComplete="off"
                                    autoFocus
                                    maxLength={20}
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    You can find this in your welcome email.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 font-bold text-base"
                                disabled={!membershipId.trim() || isSubmitting}
                            >
                                {isSubmitting ? "Locating..." : "View Digital Card"}
                                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
