// src/app/review/[reviewId]/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Wrench, Star, CheckCircle, ChevronLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitProviderReview, getRequestReviewContext } from "@/lib/supaFetch";

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

    const activeIndex = Math.max(0, steps.findIndex((s) => s.key === step));
    const progressPercent = ((activeIndex + 1) / steps.length) * 100;

    const canNext = step === "rating" ? rating !== null : step === "review" ? review.trim().length > 5 && rating !== null : false;

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
                if (!cancelled) setContext(ctx);
            } catch (e) {
                if (!cancelled) setContext(null);
            } finally {
                if (!cancelled) setCtxLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [requestId]);

    async function handlePrimary() {
        if (step === "rating") {
            if (!rating) return;
            setStep("review");
            return;
        }
        if (step === "review") {
            if (!rating || review.trim().length <= 5) return;
            try {
                setSubmitting(true);
                setErrorMsg(null);
                await submitProviderReview({ requestId: requestId!, rating, review: review.trim(), driverPhone: driverPhone || null, outcome });
                setSubmitted(true);
                window.scrollTo(0, 0);
            } catch (err) {
                setErrorMsg("We couldn't submit your review. This link may be invalid or expired.");
            } finally {
                setSubmitting(false);
            }
        }
    }

    if (!requestId || typeof requestId !== "string") {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="w-20 h-20 bg-[#F0F2F5] rounded-full flex items-center justify-center text-[#5D7079]">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-3xl font-black tracking-tight uppercase">Invalid Link.</h1>
                <p className="text-sm font-bold text-[#5D7079] uppercase tracking-widest max-w-sm">
                    We couldn&apos;t find the request connected to this link. It may have expired.
                </p>
            </main>
        );
    }

    const providerLabel = context?.provider_name || context?.provider_phone || "your mechanic";
    const serviceLabel = context?.service_name || context?.service_code || "Motor Ambos help request";

    if (submitted) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-12 animate-in fade-in zoom-in duration-500">
                <div className="w-32 h-32 bg-[#9FE870] rounded-full flex items-center justify-center text-[#2D5B18] shadow-wise-lg">
                    <CheckCircle2 size={64} strokeWidth={3} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight uppercase">Thank You.</h1>
                    <p className="text-lg font-bold text-[#5D7079] max-w-md mx-auto uppercase tracking-widest leading-relaxed">
                        Your data helps us maintain high integrity for the Motor Ambos network.
                    </p>
                </div>
                <button onClick={() => window.close()} className="wise-btn-secondary !px-12">Close Window</button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F0F2F5] text-[#1E1E1E] flex flex-col font-sans">
            <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-border">
                <div className="mx-auto max-w-lg px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "rating" && (
                            <button onClick={() => setStep("rating")} className="p-2 -ml-2 text-[#5D7079] hover:text-black transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <span className="text-sm font-black uppercase tracking-widest leading-none">Review Node</span>
                    </div>
                </div>
                <div className="h-1 w-full bg-[#F0F2F5]">
                    <div className="h-full bg-[#9FE870] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                </div>
            </header>

            <div className="mx-auto w-full max-w-lg px-6 py-12 pb-40">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="wise-heading-hero !text-5xl !leading-[0.85]">
                            {step === "rating" ? "How did it go?" : "Any details?"}
                        </h1>
                        <p className="text-sm font-bold text-[#5D7079] uppercase tracking-widest leading-relaxed">
                            {ctxLoading ? "Querying request details..." : (
                                <span>Rating <strong className="text-black">{providerLabel}</strong> for <strong className="text-black">{serviceLabel}</strong></span>
                            )}
                        </p>
                    </div>

                    {step === "rating" && (
                        <div className="wise-card !p-12 space-y-12 flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = (hoverRating ?? rating ?? 0) >= star;
                                    return (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            onClick={() => setRating(star)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={48}
                                                className={cn("transition-all", active ? "fill-[#9FE870] text-[#9FE870] scale-110" : "text-[#5D7079]/20")}
                                                strokeWidth={active ? 1 : 2}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="min-h-[4rem] text-center">
                                {rating ? (
                                    <div className="animate-in zoom-in duration-300">
                                        <p className="text-4xl font-black tracking-tighter mb-2">{rating}/5</p>
                                        <p className="text-[12px] font-black uppercase tracking-widest text-[#5D7079]">{RATING_LABELS[rating]}</p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5D7079] opacity-40">Tap a star to rate experience</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "review" && (
                        <div className="wise-card !p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Technician Feedback</label>
                                <textarea
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Tell us about the service..."
                                    className="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[24px] p-8 text-xl font-bold outline-none transition-all resize-none placeholder:text-[#5D7079]/20"
                                    autoFocus
                                />
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[10px] font-bold text-[#5D7079] uppercase tracking-widest opacity-60">Min 6 characters required</p>
                                    <span className={cn("text-[10px] font-black uppercase", review.length > 5 ? "text-[#2D5B18]" : "text-[#5D7079]")}>
                                        {review.length} / 6
                                    </span>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-5 bg-red-50 border border-red-100 rounded-[20px] flex items-center gap-4 text-red-600">
                                    <AlertCircle className="shrink-0" size={24} />
                                    <span className="text-sm font-black uppercase tracking-tight">{errorMsg}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-border z-30 pb-[env(safe-area-inset-bottom)]">
                <div className="mx-auto max-w-lg">
                    <button
                        disabled={!canNext || submitting}
                        onClick={handlePrimary}
                        className="wise-btn-primary w-full !py-6 !text-xl flex items-center justify-center gap-3 disabled:opacity-30"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : (
                            <>
                                {step === "rating" ? "Next Step" : "Submit Rating"}
                                <ArrowRight size={24} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}