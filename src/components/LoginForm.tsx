"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { LandingNav } from "@/components/landing-home/HomeLanding";
import { loginWithPassword, logout } from "@/lib/supaFetch";

const inputClass = "h-14 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] text-[#171717] outline-none transition-colors placeholder:text-[#A0A0A0] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

export default function LoginForm({ mode = "member" }: { mode?: "member" | "admin" }) {
    const router = useRouter();
    const params = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function signIn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const session = await loginWithPassword(email.trim(), password);
            if (mode === "admin") {
                const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
                if (!session.user?.email || !allowed.includes(session.user.email.toLowerCase())) {
                    await logout();
                    throw new Error("This account does not have dashboard access.");
                }
            }
            const next = params.get("next");
            const safeNext = next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
            const staffNext = next === "/admin" || next?.startsWith("/admin/") && !next.startsWith("/admin/login");
            const destination = safeNext && (mode !== "admin" || staffNext) ? next : mode === "admin" ? "/admin" : "/app";
            router.replace(destination);
            router.refresh();
        } catch (reason: unknown) {
            setError(reason instanceof Error ? reason.message : "We could not sign you in. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
            <LandingNav hideCta />
            <main className="mx-auto flex min-h-[100svh] w-full max-w-[1200px] flex-col items-center justify-center px-4 pb-10 pt-24 sm:px-8 sm:pt-32">
                <div className="w-full max-w-[460px]">
                    <div className="mb-7 text-center sm:mb-9">
                        <p className="mb-3 text-[13px] text-[#777]">{mode === "admin" ? "Motor Ambos staff" : "Motor Ambos account"}</p>
                        <h1 className="text-[36px] font-normal leading-[1.08] tracking-[-0.04em] sm:text-[44px]">{mode === "admin" ? "Staff sign in." : "Welcome back."}</h1>
                        <p className="mt-3 text-[15px] leading-[1.45] text-[#777] sm:text-[16px]">{mode === "admin" ? "Access the internal dashboard." : "Sign in to manage your cars and fleet."}</p>
                    </div>

                    <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-8">
                        {params.get("err") === "not_admin" && (
                            <p role="alert" className="mb-5 rounded-[10px] border border-[#F2DFC2] bg-[#FFF9EF] p-4 text-[14px] text-[#8A5A19]">This account does not have dashboard access.</p>
                        )}
                        {error && <p role="alert" className="mb-5 rounded-[10px] border border-[#F2D6D6] bg-[#FFF6F6] p-4 text-[14px] text-[#A32F2F]">{error}</p>}

                        <form onSubmit={signIn} className="space-y-5">
                            <div>
                                <label htmlFor="login-email" className="block text-[14px]">Email address</label>
                                <input id="login-email" className={inputClass + " mt-2"} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" autoCapitalize="none" spellCheck={false} required />
                            </div>
                            <div>
                                <div className="flex items-center justify-between gap-3"><label htmlFor="login-password" className="block text-[14px]">Password</label><Link href="/forgot-password" className="text-[13px] text-[#1111F6] underline underline-offset-4">Forgot password?</Link></div>
                                <div className="relative mt-2">
                                    <input id="login-password" className={inputClass + " pr-14"} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
                                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center rounded-lg text-[#777] hover:text-[#1111F6]">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[16px] text-white transition-colors hover:bg-[#0606D8] disabled:cursor-wait disabled:opacity-60">
                                {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                            </button>
                        </form>
                        <p className="mt-6 text-center text-[14px] text-[#777]">Need account access? <a href="mailto:support@motorambos.com" className="text-[#1111F6] underline underline-offset-4">Email support</a></p>
                    </div>

                    {mode === "member" ? <p className="mt-6 text-center text-[14px] text-[#777]">New to Motor Ambos? <Link href="/register" className="text-[#1111F6] underline underline-offset-4">Create an account</Link></p> : <p className="mt-6 text-center text-[14px] text-[#777]">Driver or fleet manager? <Link href="/login" className="text-[#1111F6] underline underline-offset-4">Use your account sign in</Link></p>}
                    <p className="mt-3 text-center text-[14px] text-[#777]">Need help on the road? <Link href="/help" className="text-[#1111F6] underline underline-offset-4">Find roadside help</Link></p>
                    <div className="mt-10 flex items-center justify-center gap-6 text-[13px] text-[#888]">
                        <Link href="/privacy-policy" className="hover:text-[#1111F6]">Privacy</Link>
                        <Link href="/terms-of-service" className="hover:text-[#1111F6]">Terms</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
