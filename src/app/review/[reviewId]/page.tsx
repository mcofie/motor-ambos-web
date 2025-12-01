// src/app/review/[reviewId]/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Wrench, Star, CheckCircle, ChevronLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Assuming these imports exist based on your snippet
import {
    submitProviderReview,
    getRequestReviewContext,
} from "@/lib/supaFetch";

type StepKey = "rating" | "review";

const steps: Array<{ key: StepKey; label: string }> = [
    { key: "rating", label: "Rating" },
    { key: "review", label: "Review" },
];

const RATING_LABELS: Record<number, string> = {
    1: "Very poor",
    2: "Poor",
    3: "Okay",
    4: "Good",
    5: "Excellent",
};

// Updated type definition to allow null | undefined | string
type RequestReviewContext = {
    provider_name?: string | null;
    provider_phone?: string | null;
    service_name?: string | null;
    service_code?: string | null;
} | null;

export default function ReviewPage() {
    const params = useParams<{ reviewId: string }>();
    const searchParams = useSearchParams();

    const requestId = params?.reviewId;
    const driverPhone = searchParams.get("phone") ?? "";
    const outcome = searchParams.get("outcome") ?? "other";

    const [step, setStep] = useState<StepKey>("rating");
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [context, setContext] = useState<RequestReviewContext>(null);
    const [ctxLoading, setCtxLoading] = useState<boolean>(true);

    // Calculate progress
    const activeIndex = Math.max(
        0,
        steps.findIndex((s) => s.key === step)
    );
    const progressPercent = ((activeIndex + 1) / steps.length) * 100;

    const canNext =
        step === "rating"
            ? rating !== null
            : step === "review"
                ? review.trim().length > 5 && rating !== null
                : false;

    // Load request/provider/service context for banner
    useEffect(() => {
        if (!requestId || typeof requestId !== "string") {
            setCtxLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setCtxLoading(true);
                const ctx = await getRequestReviewContext(requestId);
                if (!cancelled) {
                    // The error was here because ctx properties could be null
                    setContext(ctx);
                }
            } catch (e) {
                console.error("[getRequestReviewContext] error:", e);
                if (!cancelled) {
                    setContext(null);
                }
            } finally {
                if (!cancelled) setCtxLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [requestId]);

    async function handlePrimary() {
        if (step === "rating") {
            if (!rating) return;
            setStep("review");
            return;
        }

        if (step === "review") {
            if (!rating || review.trim().length <= 5) return;
            if (!requestId) {
                setErrorMsg("This review link is invalid. Please request a new link.");
                return;
            }

            try {
                setSubmitting(true);
                setErrorMsg(null);

                await submitProviderReview({
                    requestId,
                    rating,
                    review: review.trim(),
                    driverPhone: driverPhone || null,
                    outcome,
                });

                setSubmitted(true);
            } catch (err) {
                console.error("[submitProviderReview] error:", err);
                setErrorMsg(
                    "We couldn't submit your review. This link may be invalid or expired. Please try again or request a new link."
                );
            } finally {
                setSubmitting(false);
            }
        }
    }

    function onBack() {
        if (step === "review") return setStep("rating");
    }

    // Handle missing / bad reviewId up-front
    if (!requestId || typeof requestId !== "string") {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Wrench className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h1>
                <p className="text-muted-foreground max-w-md text-sm">
                    We couldn&apos;t find the request connected to this review link. It may have expired or is incorrect.
                </p>
            </main>
        );
    }

    const providerLabel =
        context?.provider_name ||
        context?.provider_phone ||
        "your mechanic";

    const serviceLabel =
        context?.service_name ||
        context?.service_code ||
        "Motor Ambos help request";

    return (
        <main className="min-h-screen bg-background font-sans text-foreground">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {!submitted && step !== "rating" && (
                            <button
                                onClick={onBack}
                                className="mr-1 -ml-2 p-2 rounded-full hover:bg-muted text-muted-foreground"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">
                                Motor Ambos
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                {submitted ? 'Feedback Sent' : 'Rate Experience'}
                            </span>
                        </div>
                    </div>

                    {!submitted && (
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-foreground transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <div className="mx-auto w-full max-w-lg px-4 py-8 pb-32">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Header Text */}
                    {!submitted && (
                        <div className="mb-8 text-center space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                {step === "rating" ? "How did it go?" : "Any details to share?"}
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                {ctxLoading
                                    ? "Loading request details..."
                                    : context
                                        ? <span>Rating <strong>{providerLabel}</strong> for <strong>{serviceLabel}</strong></span>
                                        : "Your feedback helps us improve the Motor Ambos network."}
                            </p>
                        </div>
                    )}

                    {/* STEP 1: RATING */}
                    {!submitted && step === "rating" && (
                        <div className="bg-card p-8 rounded-3xl shadow-sm border border-border flex flex-col items-center gap-6">
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
                                    const active =
                                        hoverRating !== null
                                            ? star <= hoverRating
                                            : star <= (rating ?? 0);

                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            className="group relative p-1 transition-transform active:scale-95"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                className={cn(
                                                    "h-10 w-10 transition-all duration-200",
                                                    active
                                                        ? "fill-yellow-400 text-yellow-400 scale-110"
                                                        : "text-muted-foreground/30 group-hover:text-yellow-200"
                                                )}
                                                strokeWidth={active ? 0 : 1.5}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="min-h-[2rem] flex items-center justify-center">
                                {rating ? (
                                    <span className="inline-flex items-center rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background shadow-md transition-all animate-in zoom-in duration-300">
                                        {rating} / 5 – {RATING_LABELS[rating]}
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground font-medium">
                                        Tap a star to select
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: REVIEW */}
                    {!submitted && step === "review" && (
                        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Written Review</Label>
                                <Textarea
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="The mechanic arrived quickly and was very professional..."
                                    className="resize-none text-base bg-background border-input rounded-xl focus-visible:ring-ring min-h-[160px]"
                                    autoFocus
                                />
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[10px] text-muted-foreground">
                                        Min 6 chars. Don&apos;t share private info.
                                    </p>
                                    <span className={cn("text-[10px] font-medium", review.length > 5 ? "text-emerald-600" : "text-muted-foreground")}>
                                        {review.length} / 6
                                    </span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUCCESS STATE */}
                    {submitted && (
                        <div className="bg-card p-10 rounded-3xl shadow-sm border border-border flex flex-col items-center text-center gap-6 mt-8">
                            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">Thank you!</h2>
                                <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                                    Your feedback helps us maintain high standards for the Motor Ambos network.
                                </p>
                            </div>
                            <Button variant="outline" className="mt-2 rounded-xl border-border text-muted-foreground" onClick={() => window.close()}>
                                Close Window
                            </Button>
                        </div>
                    )}

                </div>
            </div>

            {/* Sticky Footer Action Bar */}
            {!submitted && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-30 pb-[env(safe-area-inset-bottom)]">
                    <div className="mx-auto max-w-lg">
                        <Button
                            type="button"
                            disabled={!canNext || submitting}
                            onClick={handlePrimary}
                            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-foreground/10 transition-all active:scale-95"
                        >
                            {submitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {step === "rating" ? "Next Step" : "Submit Review"}
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            )}

        </main>
    );
}