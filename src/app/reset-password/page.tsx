"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { LandingNav } from "@/components/landing-home/HomeLanding";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function ResetPasswordPage() {
    const [checking, setChecking] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        getSupabaseBrowser().auth.getSession().then(({ data, error: sessionError }) => {
            if (!active) return;
            if (sessionError || !data.session?.user.email) setError("This reset link has expired or is invalid. Request a new link.");
            else setEmail(data.session.user.email);
            setChecking(false);
        }).catch(() => {
            if (active) { setError("This reset link has expired or is invalid. Request a new link."); setChecking(false); }
        });
        return () => { active = false; };
    }, []);

    async function savePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (password !== confirmPassword) { setError("The passwords do not match."); return; }
        setBusy(true);
        setError(null);
        try {
            const { error: updateError } = await getSupabaseBrowser().auth.updateUser({ password });
            if (updateError) throw updateError;
            setSaved(true);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not update your password. Request a new link and try again.");
        } finally {
            setBusy(false);
        }
    }

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <LandingNav hideCta />
        <main className="mx-auto flex min-h-[100svh] max-w-[520px] flex-col justify-center px-4 pb-12 pt-24 sm:px-8">
            <p className="mb-3 text-center text-[13px] text-[#777]">Motor Ambos account</p>
            <h1 className="text-center text-[36px] leading-[1.08] tracking-[-0.04em] sm:text-[44px]">Choose a new password.</h1>
            <div className="mt-8 rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-8">
                {checking ? <div role="status" className="flex items-center gap-2 text-[14px] text-[#777]"><Loader2 className="h-4 w-4 animate-spin" />Checking your reset link…</div> : saved ? <div role="status"><h2 className="text-[22px] tracking-[-0.03em]">Password updated</h2><p className="mt-3 text-[14px] text-[#666]">You can now use your new password to sign in.</p><Link href="/admin/login" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white">Go to staff sign in <ArrowRight className="h-4 w-4" /></Link></div> : email ? <form onSubmit={savePassword} className="space-y-5">
                    <p className="text-[14px] text-[#666]">Setting a password for <strong className="font-medium text-[#171717]">{email}</strong>.</p>
                    <label htmlFor="new-password" className="block text-[14px]">New password<input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="mt-2 h-14 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10" /><span className="mt-1 block text-[12px] text-[#888]">At least 8 characters.</span></label>
                    <label htmlFor="confirm-password" className="block text-[14px]">Confirm new password<input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="mt-2 h-14 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10" /></label>
                    {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
                    <button type="submit" disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[16px] text-white disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <>Save new password <ArrowRight className="h-4 w-4" /></>}</button>
                </form> : <div role="alert"><p className="text-[14px] text-red-600">{error}</p><Link href="/forgot-password" className="mt-5 inline-flex h-12 items-center rounded-full bg-[#1111F6] px-5 text-[14px] text-white">Request a new link</Link></div>}
            </div>
        </main>
    </div>;
}
