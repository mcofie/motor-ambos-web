// src/app/review/[reviewId]/page.tsx
"use client";

import * as React from "react";
import {useState, useEffect} from "react";
import {useParams, useSearchParams} from "next/navigation";
import {Wrench, Star} from "lucide-react";

import {Button} from "@/components/ui/button";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {
    submitProviderReview,
    getRequestReviewContext,
} from "@/lib/supaFetch";

type StepKey = "rating" | "review";

const steps: Array<{ key: StepKey; label: string }> = [
    {key: "rating", label: "Rating"},
    {key: "review", label: "Review"},
];

const RATING_LABELS: Record<number, string> = {
    1: "Very poor",
    2: "Poor",
    3: "Okay",
    4: "Good",
    5: "Excellent",
};

type RequestReviewContext = Awaited<
    ReturnType<typeof getRequestReviewContext>
>;

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

    const activeIndex = Math.max(
        0,
        steps.findIndex((s) => s.key === step)
    );

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
            <main className="min-h-screen bg-background text-foreground">
                <section
                    className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
                    <div className="space-y-3">
                        <div
                            className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            <Wrench className="h-3.5 w-3.5"/>
                            Motor Ambos
                        </div>
                        <h1 className="text-xl font-semibold">Invalid review link</h1>
                        <p className="text-sm text-muted-foreground">
                            We couldn&apos;t find the request connected to this review link.
                            Please check the link you received or request a new one.
                        </p>
                    </div>
                </section>
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
        <main className="min-h-screen bg-background text-foreground">
            {/* Top Bar */}
            <header
                className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto w-full max-w-2xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-base font-semibold sm:text-lg">
                            <Wrench className="h-5 w-5"/>
                            Motor Ambos
                        </div>
                        <div className="text-[10px] text-muted-foreground sm:text-xs">
                            Rate your experience
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="mt-3 flex items-center justify-between sm:justify-start sm:gap-2">
                        {/* Mobile dots */}
                        <div className="flex items-center gap-1 sm:hidden">
                            {steps.map((s, i) => {
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <span
                                        key={s.key}
                                        className={cn(
                                            "h-2 w-2 rounded-full bg-border",
                                            isDone && "bg-muted-foreground/50",
                                            isActive && "bg-primary"
                                        )}
                                    />
                                );
                            })}
                        </div>

                        {/* >= sm labeled stepper */}
                        <div className="hidden items-center gap-2 sm:flex">
                            {steps.map((s, i) => {
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <div key={s.key} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "grid h-7 w-7 place-items-center rounded-full text-[11px] font-medium",
                                                isActive && "bg-primary text-primary-foreground",
                                                isDone && "bg-muted",
                                                !isActive && !isDone && "bg-background"
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs uppercase tracking-wide",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}
                                        >
                      {s.label}
                    </span>
                                        {i < steps.length - 1 && (
                                            <div className="mx-1 h-px w-8 bg-border"/>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="mx-auto w-full max-w-2xl px-4 py-6 pb-36 sm:pb-32">
                <div className="rounded-2xl">
                    <CardHeader className="space-y-1 px-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="py-2 text-lg font-extrabold sm:text-xl">
                                {submitted
                                    ? "Thanks for your feedback"
                                    : step === "rating"
                                        ? "How was your experience?"
                                        : "Tell us a bit more"}
                            </CardTitle>

                            {!submitted && step !== "rating" && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBack}
                                    className="gap-1"
                                >
                                    <span className="hidden sm:inline">Back</span>
                                </Button>
                            )}
                        </div>

                        {/* Context line: provider + service */}
                        {!submitted && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {ctxLoading
                                    ? "Loading your request details…"
                                    : context
                                        ? (
                                            <>
                                                You’re rating{" "}
                                                <span className="font-medium">{providerLabel}</span>{" "}
                                                for{" "}
                                                <span className="font-medium">{serviceLabel}</span>.
                                            </>
                                        )
                                        : "You’re rating a recent Motor Ambos help request."}
                            </p>
                        )}
                    </CardHeader>

                    <CardContent>
                        {!submitted && step === "rating" && (
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-sm">Overall rating</Label>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Tap a star to rate your recent Motor Ambos experience.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {Array.from({length: 5}, (_, i) => i + 1).map((star) => {
                                        const active =
                                            hoverRating !== null
                                                ? star <= hoverRating
                                                : star <= (rating ?? 0);

                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                className="group"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                onClick={() => setRating(star)}
                                            >
                                                <Star
                                                    className={cn(
                                                        "h-8 w-8 transition",
                                                        active
                                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                                            : "text-muted-foreground/40 group-hover:text-yellow-300"
                                                    )}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="min-h-[1.5rem] text-sm text-muted-foreground">
                                    {rating ? (
                                        <span
                                            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
                      <span className="font-medium">
                        {rating} / 5 – {RATING_LABELS[rating]}
                      </span>
                    </span>
                                    ) : (
                                        <span className="text-xs">
                      No rating selected yet. Tap a star above.
                    </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {!submitted && step === "review" && (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm">Written review</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Tell us what happened, what went well, and what we could
                                        improve.
                                    </p>
                                    <Textarea
                                        rows={6}
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Example: The mechanic arrived quickly, was very friendly, and fixed my car on the roadside..."
                                        className="resize-none text-sm"
                                    />
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        Minimum 6 characters. Please don’t share sensitive personal
                                        information.
                                    </p>
                                </div>

                                {errorMsg && (
                                    <p className="text-xs font-medium text-red-500">{errorMsg}</p>
                                )}
                            </div>
                        )}

                        {submitted && (
                            <div className="space-y-4 py-4 text-center">
                                <div
                                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <Star className="h-6 w-6 fill-emerald-500 text-emerald-500"/>
                                </div>
                                <h2 className="text-lg font-semibold">
                                    Thanks for your feedback!
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Your review helps us make Motor Ambos better for the next
                                    driver who needs help.
                                </p>
                            </div>
                        )}

                        {!submitted && step !== "review" && errorMsg && (
                            <p className="mt-3 text-xs font-medium text-red-500">
                                {errorMsg}
                            </p>
                        )}
                    </CardContent>
                </div>
            </section>

            {/* Fixed Action Bar */}
            {!submitted && (
                <div
                    className="fixed inset-x-0 bottom-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <div className="mx-auto mb-5 w-full max-w-2xl px-4 py-3 pb-[env(safe-area-inset-bottom)]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button
                                type="button"
                                className="h-11 w-full"
                                disabled={!canNext || submitting}
                                onClick={handlePrimary}
                            >
                                {step === "rating" && "Next"}
                                {step === "review" &&
                                    (submitting ? "Submitting…" : "Submit review")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}