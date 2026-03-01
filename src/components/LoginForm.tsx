"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2, Lock, Mail, ArrowRight, Globe, Car, Check } from "lucide-react";
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
        <div className="min-h-screen bg-white md:bg-[#F8FAFF] flex flex-col items-center justify-center p-6 selection:bg-[#00C767]/20 font-jakarta">
            <div className="w-full max-w-[480px] space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Branding */}
                <Link href="/" className="flex items-center justify-center gap-3 group mx-auto w-fit transition-transform hover:scale-105">
                    <div className="w-10 h-10 bg-[#00C767] rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-extrabold text-[24px] tracking-tight text-[#171717]">motor ambos</span>
                </Link>

                <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="space-y-4 mb-10">
                        <h1 className="text-[32px] font-extrabold text-[#171717] tracking-tight leading-none">
                            Welcome back
                        </h1>
                        <p className="text-[17px] font-medium text-[#525252] opacity-70">
                            Log in to manage your vehicle identity.
                        </p>
                    </div>

                    {err === "not_admin" && (
                        <div className="p-4 mb-8 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700">
                            <Lock size={18} />
                            <span className="text-sm font-bold uppercase tracking-tight">Access denied. Admin node required.</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 mb-8 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                            <ShieldCheck size={18} />
                            <span className="text-sm font-bold uppercase tracking-tight">{error}</span>
                        </div>
                    )}

                    <form onSubmit={signIn} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#525252] ml-1 opacity-60">Identity / Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#00C767] transition-colors" />
                                    <input
                                        className="block w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-5 text-[16px] font-bold text-[#171717] placeholder:text-slate-300 focus:border-[#00C767] focus:ring-4 focus:ring-[#00C767]/5 outline-none transition-all"
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
                                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#525252] ml-1 opacity-60">Security_Key / Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#00C767] transition-colors" />
                                    <input
                                        className="block w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-6 py-5 text-[16px] font-bold text-[#171717] placeholder:text-slate-300 focus:border-[#00C767] focus:ring-4 focus:ring-[#00C767]/5 outline-none transition-all"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-200 text-[#00C767] focus:ring-[#00C767]" />
                                <span className="text-sm font-bold text-[#525252]">Remember node</span>
                            </label>
                            <Link href="/help" className="text-sm font-bold text-[#00C767] hover:underline">Forgot key?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#171717] text-white py-6 rounded-2xl font-bold text-lg hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-black/10 mt-10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin text-[#00C767]" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log in</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center space-y-8 pt-4">

                    <div className="flex items-center justify-center gap-6 pt-10 opacity-40">
                        <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#171717]">Privacy</Link>
                        <Link href="/terms-of-service" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#171717]">Terms</Link>
                        <Link href="/help" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#171717]">Protocol Help</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}