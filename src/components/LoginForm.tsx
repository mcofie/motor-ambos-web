"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Lock, Mail, ArrowRight, Globe } from "lucide-react";
import { loginWithPassword } from "@/lib/supaFetch";
import Link from "next/link";

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
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center pt-24 pb-12 px-6">
            <div className="w-full max-w-lg space-y-12">
                {/* Branding */}
                <Link href="/" className="flex items-center justify-center gap-3 group mx-auto w-fit">
                    <div className="w-12 h-12 rounded-[10px] bg-[#9FE870] flex items-center justify-center font-black text-2xl shadow-sm">
                        A
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-foreground">ambos</span>
                </Link>

                <div className="wise-card !p-12 space-y-10 shadow-wise-lg">
                    <div className="space-y-4">
                        <h1 className="text-[32px] md:text-[40px] font-black tracking-tight leading-none">
                            Log in
                        </h1>
                        <p className="text-lg font-bold text-[#5D7079]">
                            Access your vehicle control panel.
                        </p>
                    </div>

                    {err === "not_admin" && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-[12px] flex items-center gap-3 text-red-600">
                            <Lock size={18} strokeWidth={3} />
                            <span className="text-sm font-black uppercase tracking-tight">Access denied. Admin required.</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-[12px] flex items-center gap-3 text-red-600">
                            <ShieldCheck size={18} strokeWidth={3} />
                            <span className="text-sm font-black uppercase tracking-tight">{error}</span>
                        </div>
                    )}

                    <form onSubmit={signIn} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5D7079]" />
                                    <input
                                        className="block w-full rounded-[12px] border-2 border-[#E2E8F0] bg-white pl-14 pr-6 py-5 text-lg font-bold text-black placeholder:text-[#5D7079]/40 focus:border-[#9FE870] focus:ring-0 outline-none transition-all"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1">
                                    <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Password</label>
                                    <Link href="/help" className="text-xs font-black text-[#5D7079]/60 hover:text-black hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5D7079]" />
                                    <input
                                        className="block w-full rounded-[12px] border-2 border-[#E2E8F0] bg-white pl-14 pr-6 py-5 text-lg font-bold text-black placeholder:text-[#5D7079]/40 focus:border-[#9FE870] focus:ring-0 outline-none transition-all"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#9FE870] text-black py-6 rounded-full font-black text-xl hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" strokeWidth={3} />
                                    <span>Loggin in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log in</span>
                                    <ArrowRight className="h-6 w-6" strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center space-y-8">
                    <p className="text-sm font-bold text-[#5D7079]">
                        New to Ambos? <Link href="/signup" className="text-black hover:underline underline-offset-4">Create an account</Link>
                    </p>

                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-[#E2E8F0]">
                        <button className="flex items-center gap-2 text-[10px] font-black text-[#5D7079] uppercase tracking-widest">
                            <Globe size={16} />
                            <span>English (UK)</span>
                        </button>
                        <Link href="/help" className="text-[10px] font-black text-[#5D7079] uppercase tracking-widest hover:text-black">Help center</Link>
                        <Link href="/terms" className="text-[10px] font-black text-[#5D7079] uppercase tracking-widest hover:text-black">Privacy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}