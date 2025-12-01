// src/components/LoginForm.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { loginWithPassword } from "@/lib/supaFetch";

export default function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const err = params?.get("err");

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // loginWithPassword is assumed to throw on failure
            await loginWithPassword(email, password);

            // 1. Force a refresh to update server-side cookie knowledge
            router.refresh();

            // 2. Then navigate
            const next = params?.get("next");
            if (next && next.startsWith("/")) {
                router.replace(next);
            } else {
                router.replace("/admin");
            }
            // note: we intentionally do NOT setLoading(false) here, since we're navigating away

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
            // Only stop loading if there was an error.
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Brand / intro */}
                <div className="mb-6 text-center text-slate-100">
                    <div
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700/70 shadow-sm mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        MotorAmbos Admin
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                        Sign in to your console
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Roadside assistance control panel. Admin access only.
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl bg-slate-950/80 px-5 py-6 sm:px-6 sm:py-7 shadow-xl shadow-black/40 ring-1 ring-slate-800/80 backdrop-blur">
                    {/* Icon / heading row */}
                    <div className="mb-5 flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/40">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
                                Admin sign in
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400">
                                Use your admin email and password to continue.
                            </p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {err === "not_admin" && (
                        <p className="mb-3 rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs sm:text-sm text-red-100">
                            This account isn’t authorized for admin access.
                        </p>
                    )}
                    {error && (
                        <p className="mb-3 rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs sm:text-sm text-red-100">
                            {error}
                        </p>
                    )}

                    {/* Form */}
                    <form onSubmit={signIn} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-200">
                                Email
                            </label>
                            <input
                                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@motorambos.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-200">
                                Password
                            </label>
                            <input
                                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing you in…
                                </>
                            ) : (
                                <>Sign in</>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-[11px] text-slate-500">
                        Access is restricted. Contact the MotorAmbos team if you believe you
                        should have admin permissions.
                    </p>
                </div>
            </div>
        </div>
    );
}