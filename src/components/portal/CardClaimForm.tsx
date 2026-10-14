"use client";

import { useState, type FormEvent } from "react";
import { Loader2, MessageSquareText } from "lucide-react";

const fieldClass = "mt-1.5 h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 font-mono text-[16px] uppercase tracking-[0.06em] text-[#171717] outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

/**
 * Linking a Smart Card takes the card number, the claim code printed on its back,
 * and a code texted to the account holder's phone.
 */
export default function CardClaimForm({ vehicleId, cardCode, onLinked, onCancel, tone = "light" }: { vehicleId: string; cardCode?: string; onLinked: (serial: string) => void; onCancel?: () => void; tone?: "light" | "brand" }) {
    const [step, setStep] = useState<"details" | "otp">("details");
    const [code, setCode] = useState(cardCode || "");
    const [claimCode, setClaimCode] = useState("");
    const [otp, setOtp] = useState("");
    const [phoneHint, setPhoneHint] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function send(body: Record<string, unknown>) {
        const response = await fetch("/api/portal/smart-card", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "Something went wrong. Try again.");
        return result;
    }

    async function start(event?: FormEvent) {
        event?.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const result = await send({ action: "start", vehicleId, code, claimCode });
            setPhoneHint(result.phoneHint);
            setOtp("");
            setStep("otp");
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Something went wrong. Try again.");
        } finally {
            setBusy(false);
        }
    }

    async function verify(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const result = await send({ action: "verify", otp });
            onLinked(result.serial);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Something went wrong. Try again.");
        } finally {
            setBusy(false);
        }
    }

    const brand = tone === "brand";
    const label = brand ? "block text-[13px] text-white/80" : "block text-[13px] text-[#555]";
    const hint = brand ? "mt-1.5 text-[12px] text-white/65" : "mt-1.5 text-[12px] text-[#888]";
    const primary = brand ? "bg-white text-[#171717]" : "bg-[#1111F6] text-white";
    const secondary = brand ? "text-white/80" : "text-[#666]";

    if (step === "otp") return <form onSubmit={verify} className="space-y-3">
        <p className={`flex items-start gap-2 text-[14px] ${brand ? "text-white" : "text-[#333]"}`}><MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />We texted a 6-digit code to your phone ending {phoneHint}.</p>
        <label className={label}>Code from the text
            <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" autoFocus className={fieldClass} required minLength={6} maxLength={6} />
        </label>
        {error && <p role="alert" className={`text-[13px] ${brand ? "rounded-[10px] bg-white/15 px-3 py-2 text-white" : "text-red-600"}`}>{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
            <button type="submit" disabled={busy || otp.length !== 6} className={`inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] disabled:opacity-50 ${primary}`}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Link card</button>
            <button type="button" onClick={() => void start()} disabled={busy} className={`h-11 px-3 text-[13px] disabled:opacity-50 ${secondary}`}>Send a new code</button>
        </div>
    </form>;

    return <form onSubmit={start} className="space-y-3">
        {!cardCode && <label className={label}>Card number
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. MA-26-00001" autoCapitalize="characters" autoComplete="off" autoFocus className={fieldClass} required minLength={4} />
        </label>}
        <label className={label}>Claim code
            <input value={claimCode} onChange={(event) => setClaimCode(event.target.value)} placeholder="e.g. 7F3A9-C21B0" autoCapitalize="characters" autoComplete="off" autoFocus={Boolean(cardCode)} className={fieldClass} required minLength={6} />
        </label>
        <p className={hint}>Both are printed on the back of the card. We will then text a code to the phone on your account to confirm it is you.</p>
        {error && <p role="alert" className={`text-[13px] ${brand ? "rounded-[10px] bg-white/15 px-3 py-2 text-white" : "text-red-600"}`}>{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
            <button type="submit" disabled={busy} className={`inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-[14px] disabled:opacity-50 ${primary}`}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Text me a code</button>
            {onCancel && <button type="button" onClick={onCancel} className={`h-11 px-3 text-[13px] ${secondary}`}>Cancel</button>}
        </div>
    </form>;
}
