// src/app/review/page.tsx
"use client";

import * as React from "react";
import {useState} from "react";
import {Wrench, Star} from "lucide-react";

import {Button} from "@/components/ui/button";
import {CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";

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

export default function ReviewPage() {
    const [step, setStep] = useState<StepKey>("rating");
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
                // TODO: wire to Supabase / API endpoint for reviews
                // await fetch("/api/reviews", { method: "POST", body: JSON.stringify({ rating, review }) });

                setSubmitted(true);
            } finally {
                setSubmitting(false);
            }
        }
    }

    function onBack() {
        if (step === "review") return setStep("rating");
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Top Bar (same style as /help) */}
            <header
                className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto w-full max-w-2xl px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 font-semibold text-base sm:text-lg">
                            <Wrench className="h-5 w-5"/>
                            Motor Ambos
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">
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
                        <div className="hidden sm:flex sm:items-center sm:gap-2">
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
                            <CardTitle className="text-lg sm:text-xl font-extrabold py-2">
                                {step === "rating" && "How was your experience?"}
                                {step === "review" && "Tell us a bit more"}
                            </CardTitle>

                            {step !== "rating" && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBack}
                                    className="gap-1"
                                >
                                    {/* You can import ChevronLeft if you want an icon here */}
                                    <span className="hidden sm:inline">Back</span>
                                </Button>
                            )}
                        </div>
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
                    </CardContent>
                </div>
            </section>

            {/* Fixed Action Bar – same pattern as help page */}
            {!submitted && (
                <div
                    className="fixed inset-x-0 bottom-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                    <div className="mx-auto w-full max-w-2xl px-4 mb-5 py-3 pb-[env(safe-area-inset-bottom)]">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Button
                                type="button"
                                className="h-11 w-full"
                                disabled={!canNext || submitting}
                                onClick={handlePrimary}
                            >
                                {step === "rating" && "Next"}
                                {step === "review" && (submitting ? "Submitting…" : "Submit review")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}