"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Nfc } from "lucide-react";
import { shareOptions, type ShareKey, type ShareSettings } from "@/lib/smartCard";
import CardClaimForm from "@/components/portal/CardClaimForm";

type CardState = { linked: boolean; publicId: string | null; serial: string | null; share: ShareSettings; canEdit: boolean };

export default function SmartCardPanel({ vehicleId, editable }: { vehicleId: string; editable: boolean }) {
    const [card, setCard] = useState<CardState | null>(null);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const load = useCallback(async () => {
        const response = await fetch(`/api/portal/smart-card?vehicleId=${vehicleId}`, { cache: "no-store" }).catch(() => null);
        if (response?.ok) setCard(await response.json());
    }, [vehicleId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the component mounts
        void load();
        window.addEventListener("portal-smartcard-changed", load);
        return () => window.removeEventListener("portal-smartcard-changed", load);
    }, [load]);

    async function toggle(key: ShareKey) {
        if (!card) return;
        const share = { ...card.share, [key]: !card.share[key] };
        setCard({ ...card, share });
        setError(null);
        const response = await fetch("/api/portal/smart-card", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId, share }) }).catch(() => null);
        if (!response?.ok) {
            setCard(card);
            setError("Could not save that change. Try again.");
        }
    }

    async function unlink() {
        if (!window.confirm("Unlink this Smart Card? Tapping it will no longer show this car.")) return;
        setBusy(true);
        const response = await fetch(`/api/portal/smart-card?vehicleId=${vehicleId}`, { method: "DELETE" }).catch(() => null);
        setBusy(false);
        if (response?.ok) { await load(); setOpen(false); } else setError("Could not unlink the card.");
    }

    async function copyLink() {
        if (!card?.publicId) return;
        await navigator.clipboard?.writeText(`${window.location.origin}/v/${card.publicId}`).catch(() => undefined);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    }

    if (!card) return null;
    const pageUrl = card.publicId ? `/v/${card.publicId}` : null;
    const sharedCount = shareOptions.filter((option) => card.share[option.key]).length;

    return <div className="border-t border-[#EEEEEE] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${card.linked ? "bg-[#EEEEFF] text-[#1111F6]" : "bg-[#F2F2F2] text-[#888]"}`}><Nfc className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
                <p className="text-[14px]">Smart Card</p>
                <p className="truncate text-[12px] text-[#888]">{card.linked ? `Linked${card.serial ? ` · ${card.serial}` : ""} · Sharing ${sharedCount} of ${shareOptions.length}` : "Not linked"}</p>
            </div>
            {card.linked ? <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-[#E3E3E3] px-3 text-[13px]">Manage<ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} /></button>
                : editable && !open && <div className="flex shrink-0 gap-1.5"><a href={`/app/cards?vehicle=${vehicleId}`} className="inline-flex h-9 items-center rounded-full border border-[#E3E3E3] px-3 text-[13px] hover:border-[#1111F6] hover:text-[#1111F6]">Get one</a><button type="button" onClick={() => setOpen(true)} className="h-9 rounded-full bg-[#1111F6] px-3.5 text-[13px] text-white">Link card</button></div>}
        </div>

        {open && !card.linked && editable && <div className="mt-4 rounded-[14px] border border-[#DADAF8] bg-[#FAFAFF] p-4">
            <CardClaimForm vehicleId={vehicleId} onLinked={async () => { await load(); setOpen(true); }} onCancel={() => setOpen(false)} />
            <p className="mt-3 text-[12px] text-[#888]">Have the card with you? Tap it with your phone and choose “Link to my car”.</p>
            <p className="mt-2 text-[12px] text-[#888]">No card yet? <a href={`/app/cards?vehicle=${vehicleId}`} className="text-[#1111F6]">Get a Smart Card</a> and it arrives linked to this car.</p>
        </div>}

        {open && card.linked && <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
                {pageUrl && <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3.5 text-[13px] hover:border-[#1111F6] hover:text-[#1111F6]"><ExternalLink className="h-3.5 w-3.5" />See what people see</a>}
                <button type="button" onClick={copyLink} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3.5 text-[13px] hover:border-[#1111F6] hover:text-[#1111F6]">{copied ? <Check className="h-3.5 w-3.5 text-[#197252]" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy link"}</button>
            </div>
            {card.canEdit && <fieldset>
                <legend className="text-[13px] text-[#555]">When someone taps this card, show:</legend>
                <ul className="mt-2 divide-y divide-[#F0F0F0] rounded-[14px] border border-[#EAEAEA]">
                    {shareOptions.map((option) => <li key={option.key}>
                        <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                            <span className="min-w-0 flex-1"><span className="block text-[14px]">{option.label}</span><span className="block text-[12px] text-[#888]">{option.detail}</span></span>
                            <input type="checkbox" role="switch" checked={card.share[option.key]} onChange={() => void toggle(option.key)} className="peer sr-only" />
                            <span aria-hidden className="relative h-6 w-10 shrink-0 rounded-full bg-[#DADADA] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-[#1111F6] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1111F6] peer-focus-visible:ring-offset-2" />
                        </label>
                    </li>)}
                </ul>
                <p className="mt-2 text-[12px] text-[#888]">Changes save straight away. Roadside help is always available on the page.</p>
            </fieldset>}
            {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
            {card.canEdit && <button type="button" onClick={unlink} disabled={busy} className="text-[13px] text-[#AA3333] disabled:opacity-50">Unlink this card</button>}
        </div>}
    </div>;
}
