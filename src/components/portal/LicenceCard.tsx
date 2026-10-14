"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Camera, Check, IdCard, Loader2, Pencil } from "lucide-react";

type Licence = { licenceNumber: string | null; licenceClass: string | null; expiresOn: string | null; hasFront: boolean; hasBack: boolean; hasPhoto?: boolean; showOnFleetCards?: boolean };

const fieldClass = "h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-3.5 text-[16px] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";

/** Phone photos are often larger than the 5 MB upload limit, so shrink them first. */
async function shrinkPhoto(file: File, maxSide = 1600): Promise<File> {
    if (!file.type.startsWith("image/")) return file;
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
        return blob ? new File([blob], "licence.jpg", { type: "image/jpeg" }) : file;
    } catch {
        return file;
    }
}

function expiryState(value: string | null) {
    if (!value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((new Date(`${value}T12:00:00`).getTime() - today.getTime()) / 86_400_000);
    if (days < 0) return { label: "Expired", tone: "bg-[#FFF0EF] text-[#AA3333]" };
    if (days <= 30) return { label: "Due soon", tone: "bg-[#FFF4DF] text-[#915C12]" };
    return { label: "Valid", tone: "bg-[#EAF7F0] text-[#197252]" };
}

function PhotoSlot({ side, present, version, onUpload, busy }: { side: "front" | "back"; present: boolean; version: number; onUpload: (side: "front" | "back", file: File) => void; busy: boolean }) {
    return <label className={`relative flex aspect-[1.586] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] text-center transition-colors ${present ? "bg-[#F2F2F2]" : "border-2 border-dashed border-[#D6D6E8] bg-[#FAFAFF] hover:border-[#1111F6]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- private, signed photo that next/image cannot optimise */}
        {present && <img src={`/api/portal/licence?photo=${side}&v=${version}`} alt={`${side === "front" ? "Front" : "Back"} of your licence`} className="absolute inset-0 h-full w-full object-cover" />}
        <span className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] ${present ? "bg-black/55 text-white backdrop-blur-sm" : "text-[#1111F6]"}`}>{busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}{present ? "Retake" : side === "front" ? "Photo of front" : "Photo of back"}</span>
        <input type="file" accept="image/*" capture="environment" className="sr-only" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(side, file); event.target.value = ""; }} />
    </label>;
}

export default function LicenceCard({ name }: { name: string }) {
    const [licence, setLicence] = useState<Licence | null>(null);
    const [available, setAvailable] = useState(false);
    const [editing, setEditing] = useState(false);
    const [number, setNumber] = useState("");
    const [licenceClass, setLicenceClass] = useState("");
    const [expiresOn, setExpiresOn] = useState("");
    const [uploading, setUploading] = useState<"front" | "back" | "profile" | null>(null);
    const [saving, setSaving] = useState(false);
    const [version, setVersion] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState(false);

    const load = useCallback(async () => {
        const response = await fetch("/api/portal/licence", { cache: "no-store" }).catch(() => null);
        if (!response?.ok) { setLoadError(true); return; }
        setLoadError(false);
        const result = await response.json();
        setAvailable(result.available !== false);
        setLicence(result.licence);
        setNumber(result.licence?.licenceNumber || "");
        setLicenceClass(result.licence?.licenceClass || "");
        setExpiresOn(result.licence?.expiresOn || "");
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the component mounts
    useEffect(() => { void load(); }, [load]);

    async function upload(side: "front" | "back" | "profile", file: File) {
        setUploading(side);
        setError(null);
        try {
            const form = new FormData();
            form.set("side", side);
            form.set("file", await shrinkPhoto(file, side === "profile" ? 800 : 1600));
            const response = await fetch("/api/portal/licence", { method: "POST", body: form });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || "Could not upload the photo");
            setVersion((value) => value + 1);
            await load();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not upload the photo");
        } finally {
            setUploading(null);
        }
    }

    async function saveDetails(event: FormEvent) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/licence", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ licenceNumber: number || null, licenceClass: licenceClass || null, expiresOn: expiresOn || null }) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || "Could not save");
            await load();
            setEditing(false);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save");
        } finally {
            setSaving(false);
        }
    }

    async function setFleetSharing(showOnFleetCards: boolean) {
        setLicence((current) => current ? { ...current, showOnFleetCards } : { licenceNumber: null, licenceClass: null, expiresOn: null, hasFront: false, hasBack: false, showOnFleetCards });
        const response = await fetch("/api/portal/licence", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ showOnFleetCards }) }).catch(() => null);
        if (!response?.ok) { setError("Could not save that choice. Try again."); await load(); }
    }

    if (loadError) return <section aria-label="Driver profile" role="alert" className="mb-8 flex items-center justify-between gap-3 rounded-[18px] border border-[#F3D8D8] bg-white p-5">
        <p className="text-[14px] text-[#AA3333]">We could not load your driver profile.</p>
        <button type="button" onClick={() => void load()} className="h-10 shrink-0 rounded-full border border-[#E3E3E3] px-4 text-[13px]">Try again</button>
    </section>;
    if (!available) return null;
    const state = expiryState(licence?.expiresOn || null);
    const hasDetails = Boolean(licence?.licenceNumber || licence?.expiresOn);

    return <section id="driver-profile" aria-labelledby="licence-heading" className="mb-8 scroll-mt-20 overflow-hidden rounded-[18px] border border-[#E7E7E7] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] px-5 py-4 sm:px-6">
            <h2 id="licence-heading" className="flex items-center gap-2 text-[17px] tracking-[-0.02em]"><IdCard className="h-5 w-5 text-[#1111F6]" />Driver profile</h2>
            {state && <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] ${state.tone}`}>{state.label}</span>}
        </div>
        <div className="flex items-center gap-4 border-b border-[#F0F0F0] px-5 py-4 sm:px-6">
            <label className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-full bg-[#EEEEFF] ring-2 ring-white shadow-[0_0_0_1px_#E3E3F5]">
                {/* eslint-disable-next-line @next/next/no-img-element -- private, signed photo that next/image cannot optimise */}
                {licence?.hasPhoto ? <img src={`/api/portal/licence?photo=profile&v=${version}`} alt="Your profile photo" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-[20px] text-[#1111F6]">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "?"}</span>}
                <span className="absolute inset-x-0 bottom-0 flex h-6 items-center justify-center bg-black/45 text-white opacity-90 transition-opacity group-hover:opacity-100">{uploading === "profile" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}</span>
                <input type="file" accept="image/*" capture="user" className="sr-only" disabled={uploading === "profile"} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload("profile", file); event.target.value = ""; }} aria-label={licence?.hasPhoto ? "Change profile photo" : "Add profile photo"} />
            </label>
            <div className="min-w-0">
                <p className="truncate text-[16px]">{name || "Your name"}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#888]">{licence?.hasPhoto ? "Tap your photo to change it." : "Add a clear photo of your face."} It shows on your Smart Card page only if you switch on “Driver profile”.</p>
            </div>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-[1fr_1.1fr] sm:p-6">
            <div className="grid grid-cols-2 gap-2.5">
                <PhotoSlot side="front" present={Boolean(licence?.hasFront)} version={version} onUpload={upload} busy={uploading === "front"} />
                <PhotoSlot side="back" present={Boolean(licence?.hasBack)} version={version} onUpload={upload} busy={uploading === "back"} />
            </div>
            {editing || !hasDetails ? <form onSubmit={saveDetails} className="grid content-start gap-3">
                {!hasDetails && !editing && <p className="text-[14px] text-[#666]">Keep a photo and the details of your licence with you, and get a reminder before it expires.</p>}
                <label className="text-[13px] text-[#666]">Licence number<input className={fieldClass + " mt-1.5 uppercase placeholder:normal-case"} value={number} onChange={(event) => setNumber(event.target.value)} placeholder="As printed on the card" autoCapitalize="characters" autoComplete="off" maxLength={40} /></label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="text-[13px] text-[#666]">Class<input className={fieldClass + " mt-1.5 uppercase placeholder:normal-case"} value={licenceClass} onChange={(event) => setLicenceClass(event.target.value)} placeholder="e.g. B" maxLength={20} /></label>
                    <label className="text-[13px] text-[#666]">Expires<input className={fieldClass + " mt-1.5"} type="date" value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} /></label>
                </div>
                <div className="flex gap-2"><button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save details</button>{editing && <button type="button" onClick={() => setEditing(false)} className="h-11 px-3 text-[14px] text-[#666]">Cancel</button>}</div>
            </form> : <div className="grid content-start gap-3">
                <dl className="grid grid-cols-2 gap-3 text-[14px]">
                    <div className="col-span-2"><dt className="text-[12px] text-[#888]">Licence number</dt><dd className="mt-0.5 font-mono tracking-[0.03em]">{licence?.licenceNumber || "Not added"}</dd></div>
                    <div><dt className="text-[12px] text-[#888]">Class</dt><dd className="mt-0.5">{licence?.licenceClass || "—"}</dd></div>
                    <div><dt className="text-[12px] text-[#888]">Expires</dt><dd className="mt-0.5">{licence?.expiresOn ? new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${licence.expiresOn}T12:00:00`)) : "—"}</dd></div>
                </dl>
                <button type="button" onClick={() => setEditing(true)} className="inline-flex h-10 w-fit items-center gap-1.5 rounded-full border border-[#E3E3E3] px-4 text-[13px]"><Pencil className="h-3.5 w-3.5" />Edit details</button>
            </div>}
            {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
            <label className="flex cursor-pointer items-center gap-3 rounded-[12px] bg-[#F7F7F7] px-4 py-3 sm:col-span-2">
                <span className="min-w-0 flex-1"><span className="block text-[14px]">Show my profile on fleet cars I drive</span><span className="block text-[12px] text-[#888]">Your photo, first name and licence status on the Smart Card of a fleet car you are assigned to.</span></span>
                <input type="checkbox" role="switch" checked={licence?.showOnFleetCards !== false} onChange={(event) => void setFleetSharing(event.target.checked)} className="peer sr-only" />
                <span aria-hidden className="relative h-6 w-10 shrink-0 rounded-full bg-[#DADADA] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-[#1111F6] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1111F6] peer-focus-visible:ring-offset-2" />
            </label>
            <p className="text-[12px] text-[#888] sm:col-span-2">Only you can see your licence photos and number. A Smart Card page can show whether your licence is valid, never the licence itself.</p>
        </div>
    </section>;
}
