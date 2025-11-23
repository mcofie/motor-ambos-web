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
            <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <Wrench className="h-8 w-8 text-slate-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
                <p className="text-slate-500 max-w-md text-sm">
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
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {!submitted && step !== "rating" && (
                            <button
                                onClick={onBack}
                                className="mr-1 -ml-2 p-2 rounded-full hover:bg-slate-100 text-slate-600"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Motor Ambos
              </span>
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                 {submitted ? 'Feedback Sent' : 'Rate Experience'}
              </span>
                        </div>
                    </div>

                    {!submitted && (
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-slate-900 transition-all duration-500 ease-out"
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
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {step === "rating" ? "How did it go?" : "Any details to share?"}
                            </h1>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
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
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-6">
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
                                                        : "text-slate-200 group-hover:text-yellow-200"
                                                )}
                                                strokeWidth={active ? 0 : 1.5}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="min-h-[2rem] flex items-center justify-center">
                                {rating ? (
                                    <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all animate-in zoom-in duration-300">
                                {rating} / 5 – {RATING_LABELS[rating]}
                            </span>
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium">
                                Tap a star to select
                             </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: REVIEW */}
                    {!submitted && step === "review" && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Written Review</Label>
                                <Textarea
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="The mechanic arrived quickly and was very professional..."
                                    className="resize-none text-base bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-slate-900 min-h-[160px]"
                                    autoFocus
                                />
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[10px] text-slate-400">
                                        Min 6 chars. Don&apos;t share private info.
                                    </p>
                                    <span className={cn("text-[10px] font-medium", review.length > 5 ? "text-emerald-600" : "text-slate-300")}>
                                {review.length} / 6
                             </span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100">
                                    {errorMsg}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUCCESS STATE */}
                    {submitted && (
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-6 mt-8">
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                <CheckCircle className="h-10 w-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900">Thank you!</h2>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                                    Your feedback helps us maintain high standards for the Motor Ambos network.
                                </p>
                            </div>
                            <Button variant="outline" className="mt-2 rounded-xl border-slate-200 text-slate-600" onClick={() => window.close()}>
                                Close Window
                            </Button>
                        </div>
                    )}

                </div>
            </div>

            {/* Sticky Footer Action Bar */}
            {!submitted && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-30 pb-[env(safe-area-inset-bottom)]">
                    <div className="mx-auto max-w-lg">
                        <Button
                            type="button"
                            disabled={!canNext || submitting}
                            onClick={handlePrimary}
                            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-95"
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