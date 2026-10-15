"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { insertProvider, updateProvider, setProviderServices, getProviderServiceIds, listProviderRates, upsertProviderRates, uploadProviderAsset } from "@/lib/supaFetch";
import { formatPhone } from "@/lib/phone";
import { ProviderRow, ServiceRow, UUID, ProviderRateRow, ProviderType, OperatingHours, DEFAULT_OPERATING_HOURS } from "../types";
import { cls } from "../ui/AdminUI";
import { PROVIDER_TYPES } from "./providerTypes";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const STEPS = ["Business", "Location", "Services", "Photos"] as const;

const field = "h-11 w-full rounded-[12px] border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#171717] outline-none placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/15";
const label = "block text-[13px] text-[#555]";

type FormState = {
    id: UUID | null;
    display_name: string;
    phone_business: string;
    about: string;
    address_line: string;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    lng: string;
    lat: string;
    is_verified: boolean;
    provider_type: ProviderType;
    logo_url: string;
    backdrop_url: string;
    operating_hours: OperatingHours;
    purchase_url: string;
    purchase_action_label: string;
    experience_years: number | null;
    specializations: string;
    certification_url: string;
};

function fromRow(row: ProviderRow | null): FormState {
    return {
        id: row?.id ?? null,
        display_name: row?.display_name || "",
        phone_business: row?.phone_business || "",
        about: row?.about || "",
        address_line: row?.address_line || "",
        is_active: row?.is_active ?? true,
        coverage_radius_km: row?.coverage_radius_km ?? 10,
        callout_fee: row?.callout_fee ?? 0,
        lng: row?.lng != null ? String(row.lng) : "",
        lat: row?.lat != null ? String(row.lat) : "",
        is_verified: !!row?.is_verified,
        provider_type: (row?.provider_type as ProviderType) || "mechanic",
        logo_url: row?.logo_url || "",
        backdrop_url: row?.backdrop_url || "",
        operating_hours: (row?.operating_hours as OperatingHours) || { ...DEFAULT_OPERATING_HOURS },
        purchase_url: row?.purchase_url || "",
        purchase_action_label: row?.purchase_action_label || "",
        experience_years: row?.experience_years ?? null,
        specializations: row?.specializations || "",
        certification_url: row?.certification_url || "",
    };
}

/** Pulls coordinates out of a pasted Google Maps link or "lat, lng" text. */
function coordinatesFrom(text: string): { lat: string; lng: string } | null {
    const match = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || text.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/) || text.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
    return match ? { lat: match[1], lng: match[2] } : null;
}

/** Add or edit a provider in four short steps. New providers step through; existing ones can jump. */
export function ProviderForm({ provider, isNew, services, onClose, onSaved }: { provider: ProviderRow | null; isNew: boolean; services: ServiceRow[]; onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState<FormState>(() => fromRow(provider));
    const [step, setStep] = useState(0);
    const [serviceIds, setServiceIds] = useState<UUID[]>([]);
    const [rates, setRates] = useState<Record<UUID, { base_price: string; price_unit: string }>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<"logo" | "backdrop" | null>(null);
    const [mapsLink, setMapsLink] = useState("");

    useEffect(() => {
        if (!provider) return;
        let live = true;
        Promise.all([getProviderServiceIds(provider.id), listProviderRates(provider.id)]).then(([ids, rows]) => {
            if (!live) return;
            setServiceIds(ids as UUID[]);
            const map: Record<UUID, { base_price: string; price_unit: string }> = {};
            (rows as ProviderRateRow[]).forEach((r) => { map[r.service_id] = { base_price: r.base_price ? String(r.base_price) : "", price_unit: r.price_unit || "" }; });
            setRates(map);
        }).catch(() => toast.error("Could not load this provider’s services"));
        return () => { live = false; };
    }, [provider]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
    const setDay = (day: (typeof DAYS)[number], patch: Partial<OperatingHours[typeof day]>) => setForm((current) => ({ ...current, operating_hours: { ...current.operating_hours, [day]: { ...current.operating_hours[day], ...patch } } }));

    async function upload(kind: "logo" | "backdrop", file?: File) {
        if (!file) return;
        setUploading(kind);
        try {
            const url = await uploadProviderAsset(file, kind);
            set(kind === "logo" ? "logo_url" : "backdrop_url", url);
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(null);
        }
    }

    async function save() {
        if (!form.display_name.trim()) { setStep(0); return toast.error("Enter the business name"); }
        setSaving(true);
        try {
            const payload = {
                ...form,
                id: undefined,
                display_name: form.display_name.trim(),
                coverage_radius_km: Number(form.coverage_radius_km) || 0,
                callout_fee: Number(form.callout_fee) || 0,
                lng: form.lng ? Number(form.lng) : null,
                lat: form.lat ? Number(form.lat) : null,
                logo_url: form.logo_url || null,
                backdrop_url: form.backdrop_url || null,
                purchase_url: form.purchase_url || null,
                purchase_action_label: form.purchase_action_label || null,
                specializations: form.specializations || null,
                certification_url: form.certification_url || null,
                operating_hours: form.operating_hours as unknown as Record<string, unknown>,
            };
            let providerId = form.id;
            if (providerId) await updateProvider(providerId, payload);
            else providerId = (await insertProvider(payload))?.id ?? null;
            if (providerId) {
                await setProviderServices(providerId, serviceIds);
                const rows = services.filter((s) => serviceIds.includes(s.id)).map((s) => ({ service_id: s.id, base_price: Number(rates[s.id]?.base_price || 0), price_unit: rates[s.id]?.price_unit || "job", min_callout_fee: null, is_active: true }));
                if (rows.length) await upsertProviderRates(providerId, rows);
            }
            toast.success(isNew ? "Provider added" : "Provider saved");
            onSaved();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save the provider");
        } finally {
            setSaving(false);
        }
    }

    const last = step === STEPS.length - 1;
    return <>
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
        <div role="dialog" aria-modal="true" aria-label={isNew ? "Add a provider" : "Edit provider"} className="admin-theme base-landing fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white text-[#171717] shadow-2xl animate-in slide-in-from-right duration-300 md:w-[560px]">
            <div className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] px-5 pb-0 pt-5">
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[20px] tracking-[-0.03em]">{isNew ? "Add a provider" : form.display_name || "Edit provider"}</h2>
                    <div className="mt-3 flex gap-1 overflow-x-auto">
                        {STEPS.map((name, index) => (
                            <button key={name} type="button" onClick={() => setStep(index)} className={cls("-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-2 pb-3 text-[13px] transition-colors", step === index ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#888] hover:text-[#171717]")}>
                                <span className={cls("flex h-5 w-5 items-center justify-center rounded-full text-[11px]", step === index ? "bg-[#1111F6] text-white" : "bg-[#F2F2F2] text-[#777]")}>{index + 1}</span>{name}
                            </button>
                        ))}
                    </div>
                </div>
                <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-[#777] hover:bg-[#F2F2F2]"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
                {step === 0 && <div className="flex flex-col gap-4">
                    <label className={label}>Business name<input className={cls(field, "mt-1.5")} value={form.display_name} onChange={(e) => set("display_name", e.target.value)} placeholder="e.g. Kofi’s Auto Clinic" /></label>
                    <fieldset>
                        <legend className={label}>What they do</legend>
                        <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {PROVIDER_TYPES.map((t) => {
                                const Icon = t.icon;
                                const active = form.provider_type === t.value;
                                return <button key={t.value} type="button" onClick={() => set("provider_type", t.value)} className={cls("flex items-center gap-2 rounded-[12px] border px-3 py-2.5 text-left text-[13px] transition-colors", active ? "border-[#1111F6] bg-[#F3F3FF] text-[#1111F6]" : "border-[#E3E3E3] text-[#444] hover:border-[#B8B8FF]")}><Icon className="h-4 w-4 shrink-0" />{t.label}</button>;
                            })}
                        </div>
                    </fieldset>
                    <label className={label}>Business phone<input className={cls(field, "mt-1.5")} value={form.phone_business} onChange={(e) => set("phone_business", e.target.value)} onBlur={() => set("phone_business", formatPhone(form.phone_business))} placeholder="+233 55 850 8306" /></label>
                    <label className={label}>About <span className="text-[#AAA]">(shown to drivers)</span><textarea className={cls(field, "mt-1.5 h-24 py-2.5")} value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="What they’re good at, in a sentence or two" /></label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={label}>Years of experience<input type="number" min={0} className={cls(field, "mt-1.5")} value={form.experience_years ?? ""} onChange={(e) => set("experience_years", e.target.value ? Number(e.target.value) : null)} /></label>
                        <label className={label}>Specialities<input className={cls(field, "mt-1.5")} value={form.specializations} onChange={(e) => set("specializations", e.target.value)} placeholder="e.g. Toyota, Honda" /></label>
                    </div>
                    <div className="overflow-hidden rounded-[14px] border border-[#EAEAEA]">
                        {([["is_active", "Taking jobs", "Shown to drivers and can be assigned requests."], ["is_verified", "Verified", "You have checked their identity and workshop."]] as const).map(([key, title, hint], index) => (
                            <label key={key} className={cls("flex cursor-pointer items-center justify-between gap-3 px-4 py-3", index > 0 && "border-t border-[#F0F0F0]")}>
                                <span className="text-[14px]">{title}<span className="block text-[12px] text-[#888]">{hint}</span></span>
                                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="h-5 w-5 accent-[#1111F6]" />
                            </label>
                        ))}
                    </div>
                </div>}

                {step === 1 && <div className="flex flex-col gap-4">
                    <label className={label}>Address<input className={cls(field, "mt-1.5")} value={form.address_line} onChange={(e) => set("address_line", e.target.value)} placeholder="e.g. Spintex Road, near Coca-Cola roundabout" /></label>
                    <div className="rounded-[14px] bg-[#F7F7F7] p-4">
                        <label className={label}>Map location
                            <input className={cls(field, "mt-1.5")} value={mapsLink} onChange={(e) => {
                                setMapsLink(e.target.value);
                                const point = coordinatesFrom(e.target.value);
                                if (point) { setForm((current) => ({ ...current, ...point })); toast.success("Location set from the link"); }
                            }} placeholder="Paste a Google Maps link or “5.6037, -0.1870”" />
                        </label>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <label className={label}>Latitude<input className={cls(field, "mt-1.5 font-mono")} value={form.lat} onChange={(e) => set("lat", e.target.value)} /></label>
                            <label className={label}>Longitude<input className={cls(field, "mt-1.5 font-mono")} value={form.lng} onChange={(e) => set("lng", e.target.value)} /></label>
                        </div>
                        {form.lat && form.lng && <a href={`https://www.google.com/maps?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px] text-[#1111F6]">Check on Google Maps</a>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={label}>Covers up to (km)<input type="number" min={0} className={cls(field, "mt-1.5")} value={form.coverage_radius_km} onChange={(e) => set("coverage_radius_km", Number(e.target.value))} /></label>
                        <label className={label}>Call-out fee (GHS)<input type="number" min={0} className={cls(field, "mt-1.5")} value={form.callout_fee} onChange={(e) => set("callout_fee", Number(e.target.value))} /></label>
                    </div>
                    <fieldset>
                        <legend className={label}>Opening hours</legend>
                        <ul className="mt-1.5 divide-y divide-[#F0F0F0] overflow-hidden rounded-[14px] border border-[#EAEAEA]">
                            {DAYS.map((day) => {
                                const schedule = form.operating_hours[day];
                                return <li key={day} className="flex items-center gap-3 px-4 py-2.5">
                                    <span className="w-24 text-[14px] capitalize">{day}</span>
                                    {schedule.closed ? <span className="flex-1 text-[13px] text-[#888]">Closed</span> : <span className="flex flex-1 items-center gap-2">
                                        <input type="time" value={schedule.open} onChange={(e) => setDay(day, { open: e.target.value })} className="h-9 rounded-[10px] border border-[#E3E3E3] px-2 text-[13px]" aria-label={`${day} opens`} />
                                        <span className="text-[13px] text-[#888]">to</span>
                                        <input type="time" value={schedule.close} onChange={(e) => setDay(day, { close: e.target.value })} className="h-9 rounded-[10px] border border-[#E3E3E3] px-2 text-[13px]" aria-label={`${day} closes`} />
                                    </span>}
                                    <label className="flex shrink-0 items-center gap-1.5 text-[13px] text-[#555]"><input type="checkbox" checked={!schedule.closed} onChange={(e) => setDay(day, { closed: !e.target.checked })} className="h-4 w-4 accent-[#1111F6]" />Open</label>
                                </li>;
                            })}
                        </ul>
                    </fieldset>
                </div>}

                {step === 2 && <div className="flex flex-col gap-3">
                    <p className="text-[13px] text-[#777]">Tick what they offer and set a starting price. Prices also feed the oil change price guide.</p>
                    <ul className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[14px] border border-[#EAEAEA]">
                        {services.map((svc) => {
                            const on = serviceIds.includes(svc.id);
                            return <li key={svc.id} className={cls("px-4 py-3", on && "bg-[#FAFAFF]")}>
                                <label className="flex cursor-pointer items-center gap-3 text-[14px]">
                                    <input type="checkbox" checked={on} onChange={() => setServiceIds((prev) => on ? prev.filter((id) => id !== svc.id) : [...prev, svc.id])} className="h-4 w-4 accent-[#1111F6]" />
                                    {svc.name}
                                </label>
                                {on && <div className="mt-2 flex gap-2 pl-7">
                                    <label className="relative flex-1"><span className="sr-only">Price</span><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#888]">GHS</span><input inputMode="decimal" className={cls(field, "h-10 pl-12")} placeholder="0" value={rates[svc.id]?.base_price || ""} onChange={(e) => setRates((prev) => ({ ...prev, [svc.id]: { ...prev[svc.id], base_price: e.target.value } }))} /></label>
                                    <label className="w-28"><span className="sr-only">Per</span><input className={cls(field, "h-10")} placeholder="per job" value={rates[svc.id]?.price_unit || ""} onChange={(e) => setRates((prev) => ({ ...prev, [svc.id]: { ...prev[svc.id], price_unit: e.target.value } }))} /></label>
                                </div>}
                            </li>;
                        })}
                        {!services.length && <li className="px-4 py-6 text-center text-[14px] text-[#888]">No services set up yet.</li>}
                    </ul>
                </div>}

                {step === 3 && <div className="flex flex-col gap-5">
                    {(["logo", "backdrop"] as const).map((kind) => {
                        const url = kind === "logo" ? form.logo_url : form.backdrop_url;
                        return <div key={kind}>
                            <p className={label}>{kind === "logo" ? "Logo or photo" : "Cover photo"}</p>
                            <div className="mt-1.5 flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element -- provider-supplied image of any host */}
                                {url ? <img src={url} alt="" className={cls("shrink-0 rounded-[12px] border border-[#EAEAEA] object-cover", kind === "logo" ? "h-16 w-16" : "h-16 w-28")} /> : <span className={cls("shrink-0 rounded-[12px] bg-[#F2F2F2]", kind === "logo" ? "h-16 w-16" : "h-16 w-28")} />}
                                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#E3E3E3] px-4 text-[14px] hover:border-[#B8B8FF] hover:text-[#1111F6]">
                                    {uploading === kind ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{url ? "Replace" : "Upload"}
                                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => void upload(kind, e.target.files?.[0])} />
                                </label>
                                {url && <button type="button" onClick={() => set(kind === "logo" ? "logo_url" : "backdrop_url", "")} className="text-[13px] text-[#AA3333]">Remove</button>}
                            </div>
                        </div>;
                    })}
                    <label className={label}>Certificate link <span className="text-[#AAA]">(optional)</span><input className={cls(field, "mt-1.5")} value={form.certification_url} onChange={(e) => set("certification_url", e.target.value)} placeholder="https://" /></label>
                    <div className="grid grid-cols-[1fr_140px] gap-3">
                        <label className={label}>Booking link <span className="text-[#AAA]">(optional)</span><input className={cls(field, "mt-1.5")} value={form.purchase_url} onChange={(e) => set("purchase_url", e.target.value)} placeholder="https://" /></label>
                        <label className={label}>Button text<input className={cls(field, "mt-1.5")} value={form.purchase_action_label} onChange={(e) => set("purchase_action_label", e.target.value)} placeholder="Book now" /></label>
                    </div>
                </div>}
            </div>

            <div className="flex items-center gap-2 border-t border-[#F0F0F0] px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-11 items-center rounded-full px-4 text-[14px] text-[#555] hover:bg-[#F2F2F2]">Back</button>}
                <div className="flex-1" />
                {isNew && !last
                    ? <button type="button" onClick={() => { if (step === 0 && !form.display_name.trim()) return toast.error("Enter the business name"); setStep(step + 1); }} className="inline-flex h-11 items-center rounded-full bg-[#1111F6] px-5 text-[14px] text-white hover:bg-[#0606D8]">Next</button>
                    : <button type="button" onClick={save} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white hover:bg-[#0606D8] disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{isNew ? "Add provider" : "Save changes"}</button>}
            </div>
        </div>
    </>;
}
