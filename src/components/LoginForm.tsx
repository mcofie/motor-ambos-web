// src/components/LoginForm.tsx
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
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
            await loginWithPassword(email, password);
            router.refresh();

            const next = params?.get("next");
            if (next && next.startsWith("/")) {
                router.replace(next);
            } else {
                router.replace("/admin");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans selection:bg-emerald-500/30">
            {/* Left Panel - Premium Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
                {/* Background Gradient Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_#10b981_0%,_transparent_50%),radial-gradient(circle_at_100%_100%,_#059669_0%,_transparent_50%)] opacity-20" />

                {/* Floating Elements Animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
                    <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_reverse]" />
                </div>

                {/* Glass Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/30 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 w-fit shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-emerald-100">Admin Console</span>
                    </div>

                    <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-8 font-display tracking-tight">
                        Powering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                            Roadside Grid
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-12 border-l-2 border-emerald-500/30 pl-6">
                        Orchestrate providers, manage dispatch logistics, and monitor real-time network health from one centralized command center.
                    </p>

                    {/* Stats / Proof */}
                    <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                        <div>
                            <div className="text-3xl font-bold text-white font-display">24/7</div>
                            <div className="text-sm text-slate-500 mt-1">Network Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white font-display">Real-time</div>
                            <div className="text-sm text-slate-500 mt-1">GPS Tracking</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-slate-950 relative">
                {/* Subtle light effect on mobile */}
                <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_50%_0%,_#10b981_0%,_transparent_35%)] opacity-10 pointer-events-none" />

                <div className="w-full max-w-[420px] animate-[fade-in-up_0.6s_ease-out_forwards]">
                    {/* Mobile Branding */}
                    <div className="lg:hidden text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800 rounded-full px-4 py-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-100 tracking-wide uppercase">MotorAmbos Admin</span>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />

                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-6 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight font-display">
                                    Welcome back
                                </h2>
                                <p className="text-slate-400 text-sm mt-2">
                                    Sign in to your restricted account
                                </p>
                            </div>

                            {/* Error States */}
                            {err === "not_admin" && (
                                <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 animate-[shake_0.5s_ease-in-out]">
                                    <Lock className="h-4 w-4 text-red-400" />
                                    <p className="text-xs font-medium text-red-200">
                                        Access denied. Admin privileges required.
                                    </p>
                                </div>
                            )}
                            {error && (
                                <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 animate-[shake_0.5s_ease-in-out]">
                                    <ShieldCheck className="h-4 w-4 text-red-400" />
                                    <p className="text-xs font-medium text-red-200">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={signIn} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 ml-1">Email</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                        <input
                                            className="block w-full rounded-xl border border-slate-700/50 bg-slate-800/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-300 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                        <input
                                            className="block w-full rounded-xl border border-slate-700/50 bg-slate-800/50 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 p-[1px] shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                                >
                                    <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:from-emerald-400 hover:to-emerald-500 transition-all h-full w-full">
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Authenticating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign in</span>
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-600">
                        Protected by enterprise-grade security.
                    </p>
                </div>
            </div>

            {/* Custom Animation Keyframes (injected via style tag since we can't edit config easily right now) */}
            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
            `}</style>
        </div>
    );
}