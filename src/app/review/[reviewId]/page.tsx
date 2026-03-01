// src/app/review/[reviewId]/page.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
    Wrench,
    Star,
    CheckCircle,
    ChevronLeft,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Activity,
    Fingerprint,
    MessageSquare,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitProviderReview, getRequestReviewContext } from "@/lib/supaFetch";
import Link from "next/link";

type StepKey = "rating" | "review";

const steps: Array<{ key: StepKey; label: string }> = [
    { key: "rating", label: "Rating" },
    { key: "review", label: "Feedback" },
];

const RATING_LABELS: Record<number, string> = {
    1: "Urgent Correction Needed",
    2: "Performance Sub-Optimal",
    3: "Standard Operational",
    4: "High Fidelity Sync",
    5: "Exceptional Integrity",
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
                setErrorMsg("We couldn't submit your review. This protocol message may have expired.");
            } finally {
                setSubmitting(false);
            }
        }
    }

    if (!requestId || typeof requestId !== "string") {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center space-y-12 font-jakarta">
                <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 mb-6">
                    <AlertCircle size={48} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-[32px] font-extrabold tracking-tight uppercase text-[#171717]">Identity Lost.</h1>
                    <p className="text-[17px] font-medium text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed opacity-60">
                        The verification sequence for this request has expired or is invalid.
                    </p>
                </div>
                <Link href="/" className="bg-[#171717] text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[13px]">
                    Return to Infrastructure
                </Link>
            </main>
        );
    }

    const providerLabel = context?.provider_name || context?.provider_phone || "Service Provider";
    const serviceLabel = context?.service_name || context?.service_code || "Unit Operation";

    if (submitted) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center space-y-16 animate-in fade-in zoom-in duration-700 font-jakarta">
                <div className="relative w-40 h-40">
                    <div className="absolute inset-0 bg-[#00C767]/10 rounded-full blur-[60px] animate-pulse" />
                    <div className="relative h-full w-full bg-white border-4 border-[#00C767]/20 rounded-full flex items-center justify-center text-[#00C767] shadow-2xl">
                        <CheckCircle2 size={72} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-6">
                    <h1 className="text-[40px] font-extrabold tracking-tight text-[#171717] leading-none uppercase">Sequence Complete.</h1>
                    <p className="text-[18px] font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
                        Your verification helps us maintain 100% integrity across the Motor Ambos network.
                    </p>
                </div>
                <button
                    onClick={() => window.close()}
                    className="bg-[#171717] text-white px-12 py-5 rounded-2xl font-bold uppercase tracking-widest text-[13px] hover:bg-black transition-all"
                >
                    Dismiss Terminal
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50/50 text-[#171717] flex flex-col font-jakarta selection:bg-[#00C767]/20">
            <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="mx-auto max-w-lg px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step !== "rating" && (
                            <button onClick={() => setStep("rating")} className="p-2 -ml-2 text-slate-400 hover:text-[#171717] transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#00C767] rounded-full flex items-center justify-center text-white">
                                <Activity size={14} />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] leading-none text-slate-400">Review Protocol</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00C767] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-lg px-6 py-16 pb-48">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C767]/10 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[#00C767] mb-2">
                            <Fingerprint size={14} />
                            Feedback Authorization
                        </div>
                        <h1 className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.05em] text-[#171717] leading-[0.95] mb-4">
                            {step === "rating" ? "Rate the service." : "Commit details."}
                        </h1>
                        <p className="text-[15px] font-bold text-slate-300 uppercase tracking-[0.1em] leading-relaxed">
                            {ctxLoading ? "Scanning network for request context..." : (
                                <span>Evaluating <strong className="text-[#171717] font-extrabold">{providerLabel}</strong> <br /> for <strong className="text-[#171717] font-extrabold">{serviceLabel}</strong></span>
                            )}
                        </p>
                    </div>

                    {step === "rating" && (
                        <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-12 flex flex-col items-center">
                            <div className="flex items-center gap-4">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = (hoverRating ?? rating ?? 0) >= star;
                                    return (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            onClick={() => setRating(star)}
                                            className="transition-all duration-300 transform-gpu active:scale-90"
                                        >
                                            <Star
                                                size={56}
                                                className={cn(
                                                    "transition-all duration-500",
                                                    active ? "fill-[#00C767] text-[#00C767] scale-110 drop-shadow-[0_0_15px_rgba(0,199,103,0.3)]" : "text-slate-100"
                                                )}
                                                strokeWidth={active ? 0 : 2}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="min-h-[6rem] text-center flex flex-col justify-center">
                                {rating ? (
                                    <div className="animate-in zoom-in duration-500">
                                        <p className="text-7xl font-black tracking-tighter text-[#171717] mb-3 font-mono leading-none">{rating}<span className="text-xl text-slate-200">/5</span></p>
                                        <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#00C767]">{RATING_LABELS[rating]}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 opacity-30">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Initialize Rating Sequence</p>
                                        <div className="flex justify-center gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === "review" && (
                        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10 group transition-all duration-500 hover:shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 ml-2">
                                    <MessageSquare size={16} className="text-[#00C767]" />
                                    <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#171717]/40">Technician Feedback Protocol</label>
                                </div>
                                <textarea
                                    rows={6}
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Provide specific operational details..."
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#00C767] focus:bg-white rounded-[32px] p-8 text-[18px] font-bold text-[#171717] outline-none transition-all resize-none placeholder:text-slate-200 uppercase focus:shadow-xl focus:shadow-[#00C767]/5"
                                    autoFocus
                                />
                                <div className="flex justify-between items-center px-4">
                                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">Integrated Data Security v4.2</p>
                                    <div className="flex items-center gap-3">
                                        <span className={cn("text-[11px] font-bold uppercase tracking-widest", review.length > 5 ? "text-[#00C767]" : "text-slate-300")}>
                                            {review.length} / 6 chars
                                        </span>
                                        {review.length > 5 && <CheckCircle2 size={14} className="text-[#00C767]" />}
                                    </div>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-6 bg-red-50 border border-red-100 rounded-[28px] flex items-center gap-4 text-red-500 animate-in slide-in-from-top-2">
                                    <AlertCircle className="shrink-0" size={24} />
                                    <span className="text-[13px] font-bold uppercase tracking-wide leading-tight">{errorMsg}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-30 pb-[env(safe-area-inset-bottom)]">
                <div className="mx-auto max-w-lg">
                    <button
                        disabled={!canNext || submitting}
                        onClick={handlePrimary}
                        className="w-full bg-[#171717] text-white py-6 md:py-8 rounded-[32px] text-[18px] md:text-[20px] font-extrabold tracking-tight flex items-center justify-center gap-4 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:pointer-events-none group"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                {step === "rating" ? "Next Sequence" : "Commit Review"}
                                <div className="w-8 h-8 bg-[#00C767] rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}