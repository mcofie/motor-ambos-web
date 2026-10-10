"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { LandingNav } from "@/components/landing-home/HomeLanding";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { formatPhone, normalizePhone } from "@/lib/phone";

const inputClass = "mt-2 h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

export default function RegisterForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function register(event: FormEvent) {
        event.preventDefault();
        const normalizedPhone = normalizePhone(phone);
        if (!normalizedPhone) { setError("Enter a valid phone number, such as +233558508306."); return; }
        setBusy(true);
        setError(null);
        try {
            const { data, error: signUpError } = await getSupabaseBrowser().auth.signUp({
                email: email.trim(),
                password,
                options: { data: { full_name: name.trim(), phone: normalizedPhone } },
            });
            if (signUpError) throw signUpError;
            if (data.session) router.replace("/app");
            else setSent(true);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not create your account");
        } finally {
            setBusy(false);
        }
    }

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <LandingNav hideCta />
        <main className="mx-auto max-w-[480px] px-4 pb-12 pt-28 sm:px-8 sm:pt-36">
            <div className="mb-7 text-center"><p className="mb-3 text-[13px] text-[#777]">Motor Ambos account</p><h1 className="text-[36px] tracking-[-0.04em] sm:text-[44px]">Start with your car.</h1><p className="mt-3 text-[15px] text-[#777]">Create a free account to keep your car details close.</p></div>
            <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-8">
                {sent ? <div role="status"><h2 className="text-[24px] tracking-[-0.03em]">Check your email</h2><p className="mt-3 text-[15px] leading-relaxed text-[#777]">If your address can be registered, you’ll receive a confirmation link. After confirming, sign in to finish your profile.</p><Link href="/login" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-white">Go to sign in <ArrowRight className="h-4 w-4" /></Link></div> : <form onSubmit={register} className="space-y-4">
                    <label className="block text-[14px]">Full name<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required minLength={2} /></label>
                    <label className="block text-[14px]">Phone number<input className={inputClass} value={phone} onChange={(event) => setPhone(event.target.value)} onBlur={() => setPhone(formatPhone(phone))} placeholder="+233558508306" inputMode="tel" autoComplete="tel" required /></label>
                    <label className="block text-[14px]">Email address<input className={inputClass} value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required /></label>
                    <label className="block text-[14px]">Password<input className={inputClass} value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required /><span className="mt-1 block text-[12px] text-[#888]">At least 8 characters.</span></label>
                    {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
                    <button type="submit" disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-white disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</> : <>Create account <ArrowRight className="h-4 w-4" /></>}</button>
                </form>}
            </div>
            <p className="mt-6 text-center text-[14px] text-[#777]">Already have an account? <Link href="/login" className="text-[#1111F6] underline underline-offset-4">Sign in</Link></p>
        </main>
    </div>;
}
