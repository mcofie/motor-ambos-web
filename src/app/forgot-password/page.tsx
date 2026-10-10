"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { LandingNav } from "@/components/landing-home/HomeLanding";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function sendReset(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const { error: resetError } = await getSupabaseBrowser().auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (resetError) throw resetError;
            setSent(true);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not send the reset link. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <LandingNav hideCta />
        <main className="mx-auto flex min-h-[100svh] max-w-[520px] flex-col justify-center px-4 pb-12 pt-24 sm:px-8">
            <p className="mb-3 text-center text-[13px] text-[#777]">Motor Ambos account</p>
            <h1 className="text-center text-[36px] leading-[1.08] tracking-[-0.04em] sm:text-[44px]">Reset your password.</h1>
            <p className="mt-3 text-center text-[15px] leading-relaxed text-[#777]">Use the email address on your account. The new password will work for your car portal and any staff access you have.</p>
            <div className="mt-8 rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-8">
                {sent ? <div role="status"><h2 className="text-[22px] tracking-[-0.03em]">Check your email</h2><p className="mt-3 text-[14px] leading-relaxed text-[#666]">If that address has an account, you’ll receive a password reset link. Open it in this browser to choose a new password.</p><Link href="/admin/login" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white">Back to staff sign in <ArrowRight className="h-4 w-4" /></Link></div> : <form onSubmit={sendReset} className="space-y-5">
                    <label htmlFor="reset-email" className="block text-[14px]">Email address<input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" autoCapitalize="none" spellCheck={false} required className="mt-2 h-14 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10" /></label>
                    {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
                    <button type="submit" disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[16px] text-white disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin" />Sending link…</> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}</button>
                </form>}
            </div>
            <Link href="/admin/login" className="mt-6 text-center text-[14px] text-[#1111F6] underline underline-offset-4">Back to staff sign in</Link>
        </main>
    </div>;
}
