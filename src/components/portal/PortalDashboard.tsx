"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarClock, CalendarPlus, Car, Check, CheckCircle2, ChevronDown, FileText, LifeBuoy, Loader2, LogOut, Nfc, NotebookPen, Pencil, Phone, Plus, Search, Truck, UserRound, Users, X } from "lucide-react";
import { logout } from "@/lib/supaFetch";
import type { PortalDocument, PortalVehicle } from "@/lib/portalTypes";
import { formatPhone } from "@/lib/phone";
import { usePortalData } from "@/components/portal/PortalDataProvider";
import VehicleActivity from "@/components/portal/VehicleActivity";
import FleetIssueInbox, { type FleetIssue } from "@/components/portal/FleetIssueInbox";
import LicenceCard from "@/components/portal/LicenceCard";
import SmartCardPanel from "@/components/portal/SmartCardPanel";
import { QuickLogSheet, type LogKind } from "@/components/portal/QuickLog";

const inputClass = "h-12 w-full rounded-[10px] border border-[#DEDEDE] bg-white px-4 text-[16px] text-[#171717] outline-none focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/10";
const modelsByMake: Record<string, string[]> = {
    Toyota: ["Corolla", "Camry", "Yaris", "RAV4", "Hilux", "Land Cruiser", "Hiace"],
    Hyundai: ["i10", "Accent", "Elantra", "Tucson", "Santa Fe", "H-100"],
    Kia: ["Picanto", "Rio", "Cerato", "Sportage", "Sorento"],
    Nissan: ["March", "Sunny", "Sentra", "Altima", "X-Trail", "Navara"],
    Honda: ["Fit", "Civic", "Accord", "CR-V", "HR-V"],
    Suzuki: ["Alto", "Swift", "Dzire", "Vitara", "Baleno"],
    Ford: ["Focus", "Escape", "Ranger", "Explorer", "Transit"],
    Mercedes: ["C-Class", "E-Class", "GLC", "Sprinter", "Vito"],
    BMW: ["3 Series", "5 Series", "X3", "X5"],
};
const colorChoices = ["White", "Black", "Silver", "Grey", "Blue", "Red", "Green", "Gold", "Brown", "Beige", "Yellow", "Orange"];
const recentYears = Array.from({ length: 27 }, (_, index) => String(new Date().getFullYear() + 1 - index));
const documentKinds = ["insurance", "roadworthy"] as const;
type DocumentKind = (typeof documentKinds)[number];
const kindLabel: Record<DocumentKind, string> = { insurance: "Insurance", roadworthy: "Roadworthy" };

function daysUntil(value: string | null | undefined) {
    const date = value?.slice(0, 10);
    if (!date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(`${date}T12:00:00`);
    if (Number.isNaN(expiry.getTime())) return null;
    return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
}

function documentState(document: PortalDocument | undefined) {
    const daysLeft = daysUntil(document?.expires_on);
    if (daysLeft == null) return { label: "No date", tone: "text-[#696969] bg-[#F2F2F2]", priority: 1, daysLeft };
    if (daysLeft < 0) return { label: "Expired", tone: "text-[#AA3333] bg-[#FFF0EF]", priority: 3, daysLeft };
    if (daysLeft <= 30) return { label: "Due soon", tone: "text-[#915C12] bg-[#FFF4DF]", priority: 2, daysLeft };
    return { label: "Valid", tone: "text-[#197252] bg-[#EAF7F0]", priority: 0, daysLeft };
}

function relativeDays(days: number) {
    if (days === 0) return "today";
    if (days === 1) return "tomorrow";
    if (days === -1) return "yesterday";
    return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

function formatDate(value: string | null | undefined) {
    if (!value) return "No date added";
    const date = new Date(`${value.slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function vehicleTitle(vehicle: PortalVehicle) {
    return [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || vehicle.name || "Vehicle";
}

function findDocument(documents: PortalDocument[], vehicleId: string, kind: DocumentKind) {
    return documents.find((item) => item.vehicle_id === vehicleId && item.kind === kind);
}

function vehiclePriority(vehicle: PortalVehicle, documents: PortalDocument[]) {
    return Math.max(...documentKinds.map((kind) => documentState(findDocument(documents, vehicle.id, kind)).priority));
}

function helpLink(vehicle: PortalVehicle) {
    const params = new URLSearchParams();
    if (vehicle.plate) params.set("plate", vehicle.plate);
    if (vehicle.make) params.set("make", vehicle.make);
    if (vehicle.model) params.set("model", vehicle.model);
    if (vehicle.year) params.set("year", vehicle.year);
    if (vehicle.color) params.set("color", vehicle.color);
    return `/help?${params.toString()}`;
}

function downloadCalendarReminder(vehicle: PortalVehicle, kind: DocumentKind, date: string) {
    const day = date.slice(0, 10).replaceAll("-", "");
    if (!/^\d{8}$/.test(day)) return;
    const next = new Date(`${date.slice(0, 10)}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const nextDay = next.toISOString().slice(0, 10).replaceAll("-", "");
    const title = `${kindLabel[kind]} renewal - ${vehicle.plate || "vehicle"}`.replaceAll(/[\r\n,;]/g, " ");
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Motor Ambos//Vehicle Reminders//EN", "BEGIN:VEVENT", `UID:${vehicle.id}-${kind}@motorambos.com`, `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${nextDay}`, `SUMMARY:${title}`, "BEGIN:VALARM", "TRIGGER:-P30D", "ACTION:DISPLAY", `DESCRIPTION:${title}`, "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${kind}-${vehicle.plate || vehicle.id}.ics`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function scrollToVehicle(vehicleId: string) {
    requestAnimationFrame(() => document.getElementById(`vehicle-${vehicleId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function VehicleDetails({ vehicle, documents, editable, editing, onEditingChange, documentUploadAvailable, onUpdated, onLog, embedded = false, note }: {
    vehicle: PortalVehicle;
    documents: PortalDocument[];
    editable: boolean;
    editing: boolean;
    onEditingChange: (editing: boolean) => void;
    documentUploadAvailable: boolean;
    onUpdated: () => Promise<void>;
    onLog: () => void;
    embedded?: boolean;
    note?: string;
}) {
    const insurance = findDocument(documents, vehicle.id, "insurance");
    const roadworthy = findDocument(documents, vehicle.id, "roadworthy");
    const [insuranceDate, setInsuranceDate] = useState(insurance?.expires_on?.slice(0, 10) || "");
    const [roadworthyDate, setRoadworthyDate] = useState(roadworthy?.expires_on?.slice(0, 10) || "");
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
    const [roadworthyFile, setRoadworthyFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setInsuranceDate(insurance?.expires_on?.slice(0, 10) || "");
        setRoadworthyDate(roadworthy?.expires_on?.slice(0, 10) || "");
    }, [insurance?.expires_on, roadworthy?.expires_on]);

    async function saveDates() {
        const changes = [
            { kind: "insurance", value: insuranceDate, previous: insurance?.expires_on?.slice(0, 10) || "" },
            { kind: "roadworthy", value: roadworthyDate, previous: roadworthy?.expires_on?.slice(0, 10) || "" },
        ].filter((entry) => entry.value !== entry.previous);
        setError(null);
        setSaving(true);
        try {
            await Promise.all(changes.map(async (change) => {
                const response = await fetch("/api/portal/documents", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ vehicleId: vehicle.id, kind: change.kind, expiresOn: change.value || null }),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Could not save date");
            }));
            for (const [kind, file] of [["insurance", insuranceFile], ["roadworthy", roadworthyFile]] as const) {
                if (!file) continue;
                const form = new FormData();
                form.set("vehicleId", vehicle.id);
                form.set("kind", kind);
                form.set("file", file);
                const response = await fetch("/api/portal/documents", { method: "POST", body: form });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Could not upload document");
            }
            await onUpdated();
            setInsuranceFile(null); setRoadworthyFile(null);
            onEditingChange(false);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save date");
        } finally {
            setSaving(false);
        }
    }

    const datesChanged = insuranceDate !== (insurance?.expires_on?.slice(0, 10) || "") || roadworthyDate !== (roadworthy?.expires_on?.slice(0, 10) || "") || Boolean(insuranceFile || roadworthyFile);
    const missingDates = vehiclePriority(vehicle, documents) === 1 && documentKinds.some((kind) => !findDocument(documents, vehicle.id, kind)?.expires_on);

    return (
        <div className={embedded ? "" : "overflow-hidden rounded-[20px] border border-[#E7E7E7] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.025)]"}>
            {!embedded && <div className="flex items-start gap-3.5 p-5 sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EEEEFF] text-[#1111F6]"><Car className="h-6 w-6" /></span>
                <div className="min-w-0 flex-1">
                    <h3 className="text-[20px] font-normal leading-tight tracking-[-0.035em] sm:text-[22px]">{vehicleTitle(vehicle)}</h3>
                    <p className="mt-1 text-[13px] text-[#777]">{[vehicle.plate || "Plate not added", vehicle.color].filter(Boolean).join(" · ")}</p>
                    {note && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#F3F3FF] px-2.5 py-1 text-[11px] text-[#1111F6]"><Truck className="h-3 w-3" />{note}</span>}
                </div>
            </div>}

            <ul className={`${embedded ? "" : "border-t border-[#EEEEEE]"} px-5 sm:px-6`}>
                {documentKinds.map((kind) => {
                    const record = kind === "insurance" ? insurance : roadworthy;
                    const state = documentState(record);
                    const pill = <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${state.tone}`}>{state.label}</span>;
                    return <li key={kind} className="flex min-h-[72px] items-center justify-between gap-3 border-b border-[#F0F0F0] py-3.5 last:border-b-0">
                        <div className="min-w-0">
                            <p className="text-[14px]">{kindLabel[kind]}</p>
                            <p className="mt-0.5 text-[13px] text-[#777]">{record?.expires_on ? <>{state.daysLeft! < 0 ? "Expired" : "Expires"} {formatDate(record.expires_on)} <span className="text-[#999]">· {relativeDays(state.daysLeft!)}</span></> : "No expiry date added"}</p>
                            {(record?.file_url || record?.expires_on) && <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                {record?.file_url && <a href={record.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-1 text-[12px] text-[#1111F6]"><FileText className="h-3.5 w-3.5" />View document</a>}
                                {record?.expires_on && <button type="button" onClick={() => downloadCalendarReminder(vehicle, kind, record.expires_on!)} className="inline-flex min-h-7 items-center gap-1 text-[12px] text-[#1111F6]"><CalendarPlus className="h-3.5 w-3.5" />Add to calendar</button>}
                            </div>}
                        </div>
                        {editable && !editing && state.priority > 0 ? <button type="button" onClick={() => onEditingChange(true)} aria-label={`Update ${kindLabel[kind].toLowerCase()} date`} className="flex shrink-0 items-center gap-1 rounded-full transition-opacity hover:opacity-80">{pill}<Pencil className="h-3 w-3 text-[#999]" /></button> : pill}
                    </li>;
                })}
            </ul>

            {editing && <div className="mx-5 mb-5 grid gap-3 rounded-[12px] border border-[#DADAF8] bg-[#FAFAFF] p-4 sm:mx-6 sm:grid-cols-2">
                <p className="text-[14px] sm:col-span-2">Update papers</p>
                <label className="text-[13px]">Insurance expiry<input className={inputClass + " mt-2"} type="date" value={insuranceDate} onChange={(event) => setInsuranceDate(event.target.value)} /></label>
                <label className="text-[13px]">Roadworthy expiry<input className={inputClass + " mt-2"} type="date" value={roadworthyDate} onChange={(event) => setRoadworthyDate(event.target.value)} /></label>
                {documentUploadAvailable && <><label className="text-[13px]">Insurance document <span className="text-[#888]">(PDF or photo)</span><input className="mt-2 block w-full text-[13px] file:mr-3 file:rounded-full file:border-0 file:bg-[#EEEEFF] file:px-3 file:py-2 file:text-[#1111F6]" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setInsuranceFile(event.target.files?.[0] || null)} /></label><label className="text-[13px]">Roadworthy document <span className="text-[#888]">(PDF or photo)</span><input className="mt-2 block w-full text-[13px] file:mr-3 file:rounded-full file:border-0 file:bg-[#EEEEFF] file:px-3 file:py-2 file:text-[#1111F6]" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setRoadworthyFile(event.target.files?.[0] || null)} /></label></>}
                <p className="text-[12px] leading-relaxed text-[#777] sm:col-span-2">We use these dates to remind you before they expire. They are not a check of legal status.</p>
                {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
                <div className="flex gap-2 sm:col-span-2">
                    <button type="button" onClick={saveDates} disabled={saving || !datesChanged} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-40">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save</button>
                    <button type="button" onClick={() => onEditingChange(false)} className="h-11 rounded-full border border-[#E3E3E3] bg-white px-5 text-[14px]">Cancel</button>
                </div>
            </div>}

            <VehicleActivity vehicle={vehicle} editable={editable} />
            <SmartCardPanel vehicleId={vehicle.id} editable={editable} />

            <div className="flex flex-wrap gap-2 border-t border-[#EEEEEE] bg-[#FCFCFC] px-5 py-4 sm:px-6">
                <button type="button" onClick={onLog} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DADAF8] bg-white px-4 text-[13px] text-[#1111F6]"><NotebookPen className="h-3.5 w-3.5" />Log fuel, service or problem</button>
                {editable && !editing && <button type="button" onClick={() => onEditingChange(true)} className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] ${missingDates ? "bg-[#1111F6] text-white" : "border border-[#E3E3E3] bg-white"}`}><Pencil className="h-3.5 w-3.5" />{missingDates ? "Add expiry dates" : "Update papers"}</button>}
                <Link href={helpLink(vehicle)} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E3E3E3] bg-white px-4 text-[13px] hover:border-[#B8B8FF] hover:text-[#1111F6]"><LifeBuoy className="h-3.5 w-3.5 text-[#1111F6]" />Roadside help for this car</Link>
            </div>
        </div>
    );
}

type AttentionItem = { key: string; vehicle: PortalVehicle; level: number; title: string; detail: string; editable: boolean; sort: number };

function buildAttention(vehicles: PortalVehicle[], documents: PortalDocument[], editableIds: Set<string>) {
    const items: AttentionItem[] = [];
    for (const vehicle of vehicles) {
        const editable = editableIds.has(vehicle.id);
        const missing: string[] = [];
        for (const kind of documentKinds) {
            const record = findDocument(documents, vehicle.id, kind);
            const state = documentState(record);
            if (state.priority === 3) items.push({ key: vehicle.id + kind, vehicle, level: 3, title: `${kindLabel[kind]} expired`, detail: `${formatDate(record?.expires_on)} · ${relativeDays(state.daysLeft!)}`, editable, sort: state.daysLeft! });
            else if (state.priority === 2) items.push({ key: vehicle.id + kind, vehicle, level: 2, title: `${kindLabel[kind]} due soon`, detail: `${formatDate(record?.expires_on)} · ${relativeDays(state.daysLeft!)}`, editable, sort: state.daysLeft! });
            else if (state.priority === 1 && editable) missing.push(kindLabel[kind].toLowerCase());
        }
        if (missing.length) items.push({ key: vehicle.id + "missing", vehicle, level: 1, title: "Expiry dates missing", detail: `Add ${missing.join(" and ")} so we can remind you`, editable, sort: 0 });
    }
    return items.sort((a, b) => b.level - a.level || a.sort - b.sort);
}

function AttentionList({ items, onOpen }: { items: AttentionItem[]; onOpen: (item: AttentionItem) => void }) {
    const [showAll, setShowAll] = useState(false);
    const urgent = items.filter((item) => item.level >= 2).length;
    if (!items.length) return <section aria-label="Papers" className="mb-8 flex items-center gap-3 rounded-[16px] border border-[#D7EEDF] bg-white p-4 sm:p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7F0] text-[#197252]"><CheckCircle2 className="h-5 w-5" /></span>
        <div><h2 className="text-[16px] tracking-[-0.02em]">All papers up to date</h2><p className="mt-0.5 text-[13px] text-[#777]">We will remind you 30 days before anything expires.</p></div>
    </section>;

    const visible = showAll ? items : items.slice(0, 4);
    return <section id="attention" aria-labelledby="attention-heading" className="mb-8 scroll-mt-24 overflow-hidden rounded-[18px] border border-[#E7E7E7] bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-[#F0F0F0] px-5 py-4 sm:px-6">
            <h2 id="attention-heading" className="flex items-center gap-2 text-[17px] tracking-[-0.02em]"><CalendarClock className="h-5 w-5 text-[#1111F6]" />Needs attention</h2>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] ${urgent ? "bg-[#FFF0EF] text-[#AA3333]" : "bg-[#F2F2F2] text-[#666]"}`}>{items.length} {items.length === 1 ? "item" : "items"}</span>
        </div>
        <ul className="divide-y divide-[#F0F0F0]">
            {visible.map((item) => <li key={item.key} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.level === 3 ? "bg-[#D64545]" : item.level === 2 ? "bg-[#E2A23B]" : "bg-[#C4C4C4]"}`} />
                <div className="min-w-0 flex-1">
                    <p className="text-[14px]"><span>{item.title}</span> <span className="whitespace-nowrap text-[#777]">· {item.vehicle.plate || vehicleTitle(item.vehicle)}</span></p>
                    <p className="mt-0.5 truncate text-[12px] text-[#888]">{item.editable ? item.detail : `${item.detail} · Ask your fleet manager to update it`}</p>
                </div>
                <button type="button" onClick={() => onOpen(item)} className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] ${item.level >= 2 && item.editable ? "bg-[#1111F6] text-white" : "border border-[#E3E3E3] text-[#171717]"}`}>{item.editable ? item.level === 1 ? "Add" : "Update" : "View"}</button>
            </li>)}
        </ul>
        {items.length > 4 && <button type="button" onClick={() => setShowAll(!showAll)} className="flex h-11 w-full items-center justify-center gap-1 border-t border-[#F0F0F0] text-[13px] text-[#1111F6]">{showAll ? "Show less" : `Show all ${items.length}`}<ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} /></button>}
    </section>;
}

function ProfileSetup({ email, initialName, initialPhone, onDone }: { email: string; initialName: string; initialPhone: string; onDone: () => Promise<void> }) {
    const [name, setName] = useState(initialName);
    const [phone, setPhone] = useState(initialPhone);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [claimAvailable, setClaimAvailable] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [claimCode, setClaimCode] = useState("");
    const [claimBusy, setClaimBusy] = useState(false);

    async function save(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/me", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: name, phone }) });
            const result = await response.json();
            if (!response.ok) {
                setClaimAvailable(result.code === "PHONE_CLAIM_AVAILABLE");
                throw new Error(result.error || "Could not save profile");
            }
            await onDone();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save profile");
        } finally {
            setBusy(false);
        }
    }

    async function sendCode() {
        setClaimBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send", phone }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not send code");
            setCodeSent(true);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not send code");
        } finally {
            setClaimBusy(false);
        }
    }

    async function verifyCode(event: FormEvent) {
        event.preventDefault();
        setClaimBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", code: claimCode }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not verify code");
            await onDone();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not verify code");
        } finally {
            setClaimBusy(false);
        }
    }

    return <div className="mx-auto max-w-[480px] rounded-[16px] border border-[#EAEAEA] bg-white p-5 sm:p-8">
        <h1 className="text-[28px] tracking-[-0.035em]">Finish your account</h1>
        <p className="mt-2 text-[15px] text-[#777]">Signed in as {email}. Add your name and phone so we can show your cars and fleet access.</p>
        <form onSubmit={save} className="mt-6 space-y-4">
            <label className="block text-[14px]">Full name<input className={inputClass + " mt-2"} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>
            <label className="block text-[14px]">Phone number<input className={inputClass + " mt-2"} value={phone} onChange={(event) => { setPhone(event.target.value); setClaimAvailable(false); setCodeSent(false); }} onBlur={() => setPhone(formatPhone(phone))} placeholder="+233558508306" inputMode="tel" autoComplete="tel" required /></label>
            {error && <p role="alert" className="text-[13px] text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-white disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Continue</button>
        </form>
        {claimAvailable && <div className="mt-5 rounded-[12px] border border-[#E7E7E7] bg-[#FAFAFA] p-4">
            <p className="text-[14px] leading-relaxed text-[#555]">We’ll text a code to the phone on that existing profile. Enter it here to connect your account.</p>
            {!codeSent ? <button type="button" onClick={sendCode} disabled={claimBusy} className="mt-4 h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-50">{claimBusy ? "Sending…" : "Text me a code"}</button> : <form onSubmit={verifyCode} className="mt-4 space-y-3">
                <p role="status" className="text-[13px] text-[#277E62]">Code sent. It expires in 10 minutes.</p>
                <label className="block text-[14px]">8-digit code<input className={inputClass + " mt-2"} value={claimCode} onChange={(event) => setClaimCode(event.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" maxLength={8} required /></label>
                <button type="submit" disabled={claimBusy || claimCode.length !== 8} className="h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-50">{claimBusy ? "Verifying…" : "Connect my profile"}</button>
                <button type="button" onClick={sendCode} disabled={claimBusy} className="ml-3 h-11 text-[13px] text-[#1111F6] disabled:opacity-50">Send another code</button>
            </form>}
        </div>}
    </div>;
}

function AddVehicle({ orgId, onAdded, onClose }: { orgId?: string; onAdded: () => Promise<void>; onClose: () => void }) {
    const [makeChoice, setMakeChoice] = useState("");
    const [make, setMake] = useState("");
    const [modelChoice, setModelChoice] = useState("");
    const [model, setModel] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [yearChoice, setYearChoice] = useState("");
    const [year, setYear] = useState("");
    const [colorChoice, setColorChoice] = useState("");
    const [color, setColor] = useState("");
    const [plate, setPlate] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function add(event: FormEvent) {
        event.preventDefault();
        if (!plate.trim() || !make.trim() || !model.trim()) {
            setError("Add the plate number, make, and model to continue.");
            return;
        }
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ make: make.trim(), model: model.trim(), plate: plate.trim().toUpperCase(), year, color: color.trim(), orgId }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not add vehicle");
            onClose();
            await onAdded();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not add vehicle");
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={add} className="mb-5 grid gap-5 rounded-[18px] border border-[#DADAF8] bg-white p-5 shadow-[0_12px_32px_rgba(17,17,246,0.05)] sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2"><h3 className="text-[20px] tracking-[-0.035em]">Add a vehicle</h3><p className="mt-1 text-[14px] leading-relaxed text-[#777]">Start with the plate, then choose the make and model. Year and colour can wait.</p></div>

        <label className="block text-[14px] sm:col-span-2">Plate number
            <input className={inputClass + " mt-2 uppercase placeholder:normal-case"} value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="e.g. GW-1234-22" autoCapitalize="characters" autoComplete="off" autoFocus maxLength={30} required />
            <span className="mt-1 block text-[12px] text-[#888]">Use the plate shown on the car. Spaces and dashes are okay.</span>
        </label>

        <label className="block text-[14px]">Make
            <select className={inputClass + " mt-2"} value={makeChoice} onChange={(event) => {
                const choice = event.target.value;
                setMakeChoice(choice); setMake(choice === "other" ? "" : choice);
                setModelChoice(""); setModel("");
            }} required>
                <option value="">Choose make</option>
                {Object.keys(modelsByMake).map((item) => <option key={item} value={item}>{item}</option>)}
                <option value="other">Another make</option>
            </select>
        </label>
        {makeChoice === "other" && <label className="block text-[14px]">Make name<input className={inputClass + " mt-2"} value={make} onChange={(event) => setMake(event.target.value)} placeholder="Type make" autoComplete="off" maxLength={60} required /></label>}
        <label className="block text-[14px]">Model
            {makeChoice === "other" ? <input className={inputClass + " mt-2"} value={model} onChange={(event) => setModel(event.target.value)} placeholder="Type model" autoComplete="off" required /> : <select className={inputClass + " mt-2"} value={modelChoice} onChange={(event) => { const choice = event.target.value; setModelChoice(choice); setModel(choice === "other" ? "" : choice); }} disabled={!makeChoice} required>
                <option value="">{makeChoice ? "Choose model" : "Choose make first"}</option>
                {(modelsByMake[makeChoice] || []).map((item) => <option key={item} value={item}>{item}</option>)}
                {makeChoice && <option value="other">Another model</option>}
            </select>}
        </label>
        {modelChoice === "other" && makeChoice !== "other" && <label className="block text-[14px]">Model name<input className={inputClass + " mt-2"} value={model} onChange={(event) => setModel(event.target.value)} placeholder="Type model" autoComplete="off" maxLength={60} required /></label>}

        <div className="sm:col-span-2"><button type="button" onClick={() => setShowDetails(!showDetails)} aria-expanded={showDetails} className="inline-flex min-h-11 items-center gap-1 text-[14px] text-[#1111F6]">{showDetails ? "Hide" : "Add"} year and colour <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} /></button></div>
        {showDetails && <>
            <label className="block text-[14px]">Year <span className="text-[#888]">(optional)</span>
                <select className={inputClass + " mt-2"} value={yearChoice} onChange={(event) => { const choice = event.target.value; setYearChoice(choice); setYear(choice === "other" ? "" : choice); }}><option value="">Choose year</option>{recentYears.map((item) => <option key={item} value={item}>{item}</option>)}<option value="other">Older / another year</option></select>
                {yearChoice === "other" && <input className={inputClass + " mt-2"} value={year} onChange={(event) => setYear(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="e.g. 1998" inputMode="numeric" pattern="[0-9]{4}" title="Enter a four-digit year" maxLength={4} />}
            </label>
            <label className="block text-[14px]">Colour <span className="text-[#888]">(optional)</span>
                <select className={inputClass + " mt-2"} value={colorChoice} onChange={(event) => { const choice = event.target.value; setColorChoice(choice); setColor(choice === "other" ? "" : choice); }}><option value="">Choose colour</option>{colorChoices.map((item) => <option key={item} value={item}>{item}</option>)}<option value="other">Another colour</option></select>
                {colorChoice === "other" && <input className={inputClass + " mt-2"} value={color} onChange={(event) => setColor(event.target.value)} placeholder="Type colour" autoComplete="off" maxLength={40} />}
            </label>
        </>}
        {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex flex-col gap-2 border-t border-[#EFEFEF] pt-5 sm:col-span-2 sm:flex-row"><button type="submit" disabled={busy} className="h-12 rounded-full bg-[#1111F6] px-6 text-[15px] text-white disabled:opacity-50">{busy ? "Adding vehicle…" : "Add vehicle"}</button><button type="button" onClick={onClose} disabled={busy} className="h-12 rounded-full border border-[#E3E3E3] px-6 text-[14px] disabled:opacity-50">Cancel</button></div>
    </form>;
}

function AddDriver({ orgId, vehicles, onAdded, onClose }: { orgId: string; vehicles: PortalVehicle[]; onAdded: (email: string) => Promise<void>; onClose: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function add(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/fleet/drivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orgId, fullName: name, email, phone, vehicleId: vehicleId || null }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not add driver");
            onClose();
            await onAdded(email);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not add driver");
        } finally {
            setBusy(false);
        }
    }

    return <form onSubmit={add} className="mb-5 grid gap-4 rounded-[18px] border border-[#DADAF8] bg-white p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2"><h3 className="text-[20px] tracking-[-0.035em]">Add a driver</h3><p className="mt-1 text-[14px] text-[#777]">They sign in with this email to see the car you assign.</p></div>
        <label className="text-[14px]">Full name<input className={inputClass + " mt-2"} value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" autoFocus required /></label>
        <label className="text-[14px]">Email address<input className={inputClass + " mt-2"} value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="off" required /></label>
        <label className="text-[14px]">Phone number<input className={inputClass + " mt-2"} value={phone} onChange={(event) => setPhone(event.target.value)} onBlur={() => setPhone(formatPhone(phone))} placeholder="+233558508306" type="tel" inputMode="tel" required /></label>
        <label className="text-[14px]">Assigned vehicle <span className="text-[#888]">(optional)</span><select className={inputClass + " mt-2"} value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}><option value="">Choose later</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{[vehicle.plate, vehicleTitle(vehicle)].filter(Boolean).join(" · ")}</option>)}</select></label>
        {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex gap-2 sm:col-span-2"><button type="submit" disabled={busy} className="h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-50">{busy ? "Adding…" : "Add driver"}</button><button type="button" onClick={onClose} className="h-11 rounded-full border border-[#E3E3E3] px-5 text-[14px]">Cancel</button></div>
    </form>;
}

function papersSummary(vehicle: PortalVehicle, documents: PortalDocument[]) {
    const states = documentKinds.map((kind) => ({ kind, ...documentState(findDocument(documents, vehicle.id, kind)) }));
    const worst = Math.max(...states.map((state) => state.priority));
    const worstKinds = states.filter((state) => state.priority === worst);
    const subject = worstKinds.length > 1 ? "Papers" : kindLabel[worstKinds[0].kind];
    if (worst === 3) return { label: `${subject} expired`, tone: worstKinds[0].tone };
    if (worst === 2) return { label: `${subject} due soon`, tone: worstKinds[0].tone };
    if (worst === 1) return { label: worstKinds.length > 1 ? "No dates added" : `${subject} date missing`, tone: worstKinds[0].tone };
    return { label: "Papers valid", tone: worstKinds[0].tone };
}

function FleetVehicleRow({ vehicle, documents, driverName, issueCount, expanded, onToggle, children }: {
    vehicle: PortalVehicle;
    documents: PortalDocument[];
    driverName?: string;
    issueCount: number;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    const papers = papersSummary(vehicle, documents);
    return <li id={`vehicle-${vehicle.id}`} className={`scroll-mt-24 overflow-hidden rounded-[16px] border bg-white transition-shadow ${expanded ? "border-[#DADAF8] shadow-[0_12px_32px_rgba(17,17,246,0.06)]" : "border-[#E7E7E7]"}`}>
        <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex w-full items-center gap-3 p-4 text-left sm:gap-4 sm:px-5">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#EEEEFF] text-[#1111F6] sm:flex"><Car className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2 text-[15px] sm:text-[16px]"><span>{vehicle.plate || "No plate"}</span><span className="text-[13px] text-[#777]">{vehicleTitle(vehicle)}</span></p>
                <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#888]"><UserRound className="h-3 w-3" />{driverName || "No driver assigned"}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-1.5">
                {issueCount > 0 && <span className="rounded-full bg-[#FFF4DF] px-2 py-0.5 text-[11px] text-[#915C12]">{issueCount} {issueCount === 1 ? "issue" : "issues"}</span>}
                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] ${papers.tone}`}>{papers.label}</span>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 text-[#777] transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && <div className="border-t border-[#EEEEEE]">{children}</div>}
    </li>;
}

const pendingLinkKey = "motorambos-pending-card";

function LinkCardBanner({ code, vehicles, onDone }: { code: string; vehicles: PortalVehicle[]; onDone: () => void }) {
    const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || "");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [linked, setLinked] = useState<string | null>(null);

    async function link() {
        setBusy(true);
        setError(null);
        try {
            const response = await fetch("/api/portal/smart-card", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId, code }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not link the card");
            setLinked(vehicles.find((vehicle) => vehicle.id === vehicleId)?.plate || "your car");
            window.dispatchEvent(new Event("portal-smartcard-changed"));
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not link the card");
        } finally {
            setBusy(false);
        }
    }

    return <section aria-label="Link Smart Card" className="mb-8 overflow-hidden rounded-[18px] bg-[#1111F6] p-5 text-white sm:p-6">
        <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15"><Nfc className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
                <h2 className="text-[18px] tracking-[-0.02em]">{linked ? `Smart Card linked to ${linked}` : "Link your Smart Card"}</h2>
                <p className="mt-1 text-[14px] text-white/75">{linked ? "Tap the card with a phone to see its page. Choose what it shows under the car's Smart Card settings." : vehicles.length ? "Choose the car this card belongs to." : "Add a car first, then link the card to it."}</p>
                {!linked && vehicles.length > 0 && <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <select value={vehicleId} onChange={(event) => setVehicleId(event.target.value)} className="h-11 rounded-full border-0 bg-white px-4 text-[15px] text-[#171717] outline-none sm:min-w-[240px]">{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{[vehicle.plate, vehicleTitle(vehicle)].filter(Boolean).join(" · ")}</option>)}</select>
                    <button type="button" onClick={link} disabled={busy || !vehicleId} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white/20 px-5 text-[15px] hover:bg-white/30 disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Link card</button>
                </div>}
                {error && <p role="alert" className="mt-3 rounded-[10px] bg-white/15 px-3 py-2 text-[13px]">{error}</p>}
            </div>
            <button type="button" onClick={onDone} aria-label="Dismiss" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/15"><X className="h-4 w-4" /></button>
        </div>
    </section>;
}

function DashboardSkeleton({ view }: { view: "personal" | "fleet" }) {
    const bar = "rounded-full bg-[#E7E7E7] motion-safe:animate-pulse";

    return <div role="status" aria-label="Loading your account">
        <span className="sr-only">Loading your account…</span>
        <div aria-hidden="true">
            <div className="mb-7"><div className={`${bar} h-3 w-24`} /><div className={`${bar} mt-4 h-10 w-[min(78%,390px)]`} /></div>
            <div className="mb-7 flex gap-5 border-b border-[#E1E1E1] pb-3"><div className={`${bar} h-5 w-20`} /><div className={`${bar} h-5 w-20`} /></div>
            {view === "fleet" && <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">{[0, 1, 2, 3].map((item) => <div key={item} className="h-[88px] rounded-[16px] border border-[#EAEAEA] bg-white p-4"><div className={`${bar} h-6 w-10`} /><div className={`${bar} mt-3 h-3 w-20`} /></div>)}</div>}
            <div className="mb-8 rounded-[18px] border border-[#E7E7E7] bg-white p-5"><div className={`${bar} h-5 w-36`} />{[0, 1, 2].map((item) => <div key={item} className="mt-5 flex items-center gap-3"><div className={`${bar} h-2.5 w-2.5`} /><div className="flex-1"><div className={`${bar} h-4 w-1/2`} /><div className={`${bar} mt-2 h-3 w-1/3`} /></div><div className={`${bar} h-9 w-20`} /></div>)}</div>
            <div className={`${bar} mb-5 h-7 w-28`} />
            <div className="grid gap-3">{[0, 1, 2].map((item) => <div key={item} className="flex items-center gap-3 rounded-[16px] border border-[#E7E7E7] bg-white p-4"><div className="h-10 w-10 rounded-[12px] bg-[#EEEEFF] motion-safe:animate-pulse" /><div className="flex-1"><div className={`${bar} h-4 w-1/3`} /><div className={`${bar} mt-2 h-3 w-1/4`} /></div></div>)}</div>
        </div>
    </div>;
}

type VehicleFilter = "all" | "attention" | "issues";

export default function PortalDashboard({ view }: { view: "personal" | "fleet" }) {
    const router = useRouter();
    const { data, loading, error, reload, clear } = usePortalData();
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [addingVehicle, setAddingVehicle] = useState(false);
    const [addingDriver, setAddingDriver] = useState(false);
    const [addedDriverEmail, setAddedDriverEmail] = useState<string | null>(null);
    const [fleetIssues, setFleetIssues] = useState<FleetIssue[]>([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<VehicleFilter>("all");
    const [logSheet, setLogSheet] = useState<{ vehicleId?: string; kind?: LogKind } | null>(null);
    const [pendingCard, setPendingCard] = useState<string | null>(null);

    useEffect(() => {
        // A tapped, unlinked card sends people here with ?link=<card>. Keep it through sign-up.
        const fromUrl = new URLSearchParams(window.location.search).get("link");
        try {
            if (fromUrl) window.sessionStorage.setItem(pendingLinkKey, fromUrl);
            setPendingCard(fromUrl || window.sessionStorage.getItem(pendingLinkKey));
        } catch {
            setPendingCard(fromUrl);
        }
    }, []);

    function dismissPendingCard() {
        setPendingCard(null);
        try { window.sessionStorage.removeItem(pendingLinkKey); } catch { /* storage unavailable */ }
        if (new URLSearchParams(window.location.search).has("link")) router.replace(window.location.pathname);
    }

    useEffect(() => {
        if (view === "personal" && data && !data.needsProfile && data.personalVehicles.length === 0 && data.assignedVehicles.length === 0 && data.organizations.some((org) => org.role !== "DRIVER")) {
            router.replace("/app/fleet");
        }
    }, [data, router, view]);

    async function signOut() {
        await logout();
        clear();
        router.replace("/login");
    }

    const managedOrgs = data?.organizations.filter((org) => org.role !== "DRIVER") || [];
    const showFleetTab = managedOrgs.length > 0;
    const currentOrg = managedOrgs.find((org) => org.id === selectedOrgId) || managedOrgs[0];
    const fleetCars = useMemo(() => data && currentOrg ? data.fleetVehicles.filter((vehicle) => (vehicle.orgId || vehicle.user_id) === currentOrg.id) : [], [data, currentOrg]);
    const fleetDrivers = data && currentOrg ? data.fleetDrivers.filter((driver) => driver.orgId === currentOrg.id) : [];
    const personalCars = data ? [...data.personalVehicles, ...data.assignedVehicles.filter((vehicle) => !data.personalVehicles.some((own) => own.id === vehicle.id))] : [];
    const ownIds = new Set((data?.personalVehicles || []).map((vehicle) => vehicle.id));
    const visibleCars = view === "fleet" ? fleetCars : personalCars;
    const linkableCars = data ? [...data.personalVehicles, ...(data.fleetVehicles || []).filter((vehicle) => managedOrgs.some((org) => org.id === (vehicle.orgId || vehicle.user_id)))] : [];
    const editableIds = new Set((view === "fleet" ? fleetCars : data?.personalVehicles || []).map((vehicle) => vehicle.id));
    const attention = data ? buildAttention(visibleCars, data.documents, editableIds) : [];
    const firstName = data?.profile?.fullName.trim().split(/\s+/)[0] || "there";
    const initials = (data?.profile?.fullName || data?.email || "?").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
    const issuesByVehicle = fleetIssues.reduce<Record<string, number>>((counts, issue) => ({ ...counts, [issue.vehicle_id]: (counts[issue.vehicle_id] || 0) + 1 }), {});
    const attentionVehicleIds = new Set(attention.filter((item) => item.level >= 2).map((item) => item.vehicle.id));
    const driverFor = (vehicleId: string) => fleetDrivers.find((driver) => driver.vehicleId === vehicleId)?.name;
    const assignedNote = (vehicleId: string) => {
        if (ownIds.has(vehicleId)) return undefined;
        const org = data?.organizations.find((item) => item.assignedVehicleId === vehicleId);
        return org ? `Assigned by ${org.name}` : "Assigned to you";
    };

    const normalizedQuery = query.trim().toLowerCase();
    const filteredFleet = fleetCars.filter((vehicle) => {
        if (filter === "attention" && !attentionVehicleIds.has(vehicle.id)) return false;
        if (filter === "issues" && !issuesByVehicle[vehicle.id]) return false;
        if (!normalizedQuery) return true;
        return [vehicle.plate, vehicle.make, vehicle.model, vehicle.year, driverFor(vehicle.id)].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery);
    });

    const handleIssuesChange = useCallback((issues: FleetIssue[]) => setFleetIssues(issues), []);

    function openVehicle(vehicleId: string, edit = false) {
        setExpandedId(vehicleId);
        if (edit) setEditingId(vehicleId);
        if (view === "fleet") { setFilter("all"); setQuery(""); }
        scrollToVehicle(vehicleId);
    }

    function details(vehicle: PortalVehicle, embedded: boolean) {
        return <VehicleDetails key={vehicle.id} vehicle={vehicle} documents={data!.documents} editable={editableIds.has(vehicle.id)} editing={editingId === vehicle.id} onEditingChange={(editing) => setEditingId(editing ? vehicle.id : null)} documentUploadAvailable={data!.documentUploadAvailable} onUpdated={reload} onLog={() => setLogSheet({ vehicleId: vehicle.id })} embedded={embedded} note={view === "personal" ? assignedNote(vehicle.id) : undefined} />;
    }

    const stats = [
        { label: "Vehicles", value: fleetCars.length, icon: Truck, href: "#vehicles", tone: "" },
        { label: "Drivers", value: fleetDrivers.length, icon: Users, href: "#drivers", tone: "" },
        { label: "Papers to renew", value: attentionVehicleIds.size, icon: CalendarClock, href: "#attention", tone: attentionVehicleIds.size ? "text-[#AA3333]" : "" },
        { label: "Open issues", value: fleetIssues.length, icon: AlertCircle, href: "#issues", tone: fleetIssues.length ? "text-[#915C12]" : "" },
    ];

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <header className="sticky top-0 z-40 border-b border-[#E9E9E9] bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1136px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
                <Link href="/" className="flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.035em]"><Image src="/icon.svg" alt="" width={42} height={36} className="h-9 w-[42px]" /><span className="hidden sm:inline">Motor Ambos</span></Link>
                <div className="flex items-center gap-2">
                    {data && !data.needsProfile && visibleCars.length > 0 && <button type="button" onClick={() => setLogSheet({})} className="hidden h-10 items-center gap-1.5 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8] sm:inline-flex"><NotebookPen className="h-4 w-4" />Log</button>}
                    <Link href="/help" aria-label="Roadside help" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3 text-[14px] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] sm:px-3.5"><LifeBuoy className="h-4 w-4 text-[#1111F6]" /><span className="hidden sm:inline">Roadside help</span></Link>
                    {data && !data.needsProfile && <span title={data.profile?.fullName || data.email} className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#EEEEFF] text-[13px] text-[#1111F6] sm:flex">{initials}</span>}
                    <button type="button" onClick={signOut} aria-label="Sign out" className="inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[14px] text-[#666] hover:text-[#1111F6]"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button>
                </div>
            </div>
        </header>
        <main className={`mx-auto max-w-[1136px] px-4 pt-7 sm:px-8 sm:pt-10 ${view === "fleet" ? "pb-12" : "pb-28 sm:pb-12"}`}>
            {loading ? <DashboardSkeleton view={view} /> : error ? <div role="alert" className="rounded-[16px] border border-[#F3D8D8] bg-white p-6"><p className="text-[15px] text-red-600">{error}</p><button type="button" onClick={() => { void reload().catch(() => undefined); }} className="mt-4 h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white">Try again</button></div> : data?.needsProfile ? <ProfileSetup email={data.email} initialName={data.suggestedProfile?.fullName || ""} initialPhone={data.suggestedProfile?.phone || ""} onDone={reload} /> : data && <>
                <div className="mb-6">
                    <h1 className="text-[30px] leading-[1.1] tracking-[-0.045em] sm:text-[40px]">{view === "fleet" ? currentOrg?.name || "My fleet" : `Hello, ${firstName}`}</h1>
                    <p className="mt-2 text-[15px] text-[#6F6F6F]">{view === "fleet" ? `${fleetCars.length} ${fleetCars.length === 1 ? "vehicle" : "vehicles"} · ${fleetDrivers.length} ${fleetDrivers.length === 1 ? "driver" : "drivers"}` : "Your cars, their papers, and help when you need it."}</p>
                </div>
                {(showFleetTab || view === "fleet") && <nav aria-label="Account sections" className="mb-7 flex gap-1 border-b border-[#E1E1E1]">
                    <Link href="/app" aria-current={view === "personal" ? "page" : undefined} className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 pb-3 text-[15px] ${view === "personal" ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777] hover:text-[#171717]"}`}><Car className="h-4 w-4" />My cars</Link>
                    {showFleetTab && <Link href="/app/fleet" aria-current={view === "fleet" ? "page" : undefined} className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 pb-3 text-[15px] ${view === "fleet" ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777] hover:text-[#171717]"}`}><Truck className="h-4 w-4" />My fleet</Link>}
                </nav>}

                {pendingCard && <LinkCardBanner code={pendingCard} vehicles={linkableCars} onDone={dismissPendingCard} />}

                {view === "fleet" ? !currentOrg ? <div className="rounded-[16px] border border-[#E7E7E7] bg-white p-6">This account does not have fleet manager access.</div> : <>
                    {managedOrgs.length > 1 && <label className="mb-6 block max-w-[360px] text-[13px] text-[#666]">Fleet<select className={inputClass + " mt-2"} value={currentOrg.id} onChange={(event) => { setSelectedOrgId(event.target.value); setExpandedId(null); setEditingId(null); }}>{managedOrgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select></label>}
                    <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                        {stats.map(({ label, value, icon: Icon, href, tone }) => <a key={label} href={href} className="group rounded-[16px] border border-[#EAEAEA] bg-white p-4 transition-colors hover:border-[#B8B8FF] sm:p-5">
                            <div className="flex items-center justify-between"><span className={`text-[26px] tracking-[-0.04em] sm:text-[30px] ${tone}`}>{value}</span><Icon className="h-5 w-5 text-[#1111F6]" /></div>
                            <span className="mt-1 block text-[13px] text-[#777] group-hover:text-[#171717]">{label}</span>
                        </a>)}
                    </div>
                    <AttentionList items={attention} onOpen={(item) => openVehicle(item.vehicle.id, item.editable)} />
                    <FleetIssueInbox key={currentOrg.id} orgId={currentOrg.id} onOpenVehicle={(id) => openVehicle(id)} onIssuesChange={handleIssuesChange} />

                    <section id="vehicles" aria-labelledby="vehicles-heading" className="scroll-mt-24">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 id="vehicles-heading" className="text-[22px] tracking-[-0.035em]">Vehicles</h2>
                            {!addingVehicle && <button type="button" onClick={() => setAddingVehicle(true)} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#1111F6] px-4 text-[14px] text-white hover:bg-[#0606D8]"><Plus className="h-4 w-4" />Add vehicle</button>}
                        </div>
                        {addingVehicle && <AddVehicle key={currentOrg.id} orgId={currentOrg.id} onAdded={reload} onClose={() => setAddingVehicle(false)} />}
                        {fleetCars.length > 0 && <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <label className="relative block flex-1 sm:max-w-[340px]"><span className="sr-only">Search vehicles</span><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search plate, model or driver" className="h-11 w-full rounded-full border border-[#E3E3E3] bg-white pl-10 pr-4 text-[16px] outline-none focus:border-[#1111F6] sm:text-[14px]" /></label>
                            <div role="group" aria-label="Filter vehicles" className="flex gap-1.5 overflow-x-auto">
                                {([["all", `All ${fleetCars.length}`], ["attention", `Papers due ${attentionVehicleIds.size}`], ["issues", `Issues ${Object.keys(issuesByVehicle).length}`]] as [VehicleFilter, string][]).map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className={`h-9 shrink-0 rounded-full px-3.5 text-[13px] transition-colors ${filter === key ? "bg-[#171717] text-white" : "border border-[#E3E3E3] bg-white text-[#555] hover:border-[#BDBDBD]"}`}>{label}</button>)}
                            </div>
                        </div>}
                        {fleetCars.length ? filteredFleet.length ? <ul className="grid gap-2.5">{filteredFleet.map((vehicle) => <FleetVehicleRow key={vehicle.id} vehicle={vehicle} documents={data.documents} driverName={driverFor(vehicle.id)} issueCount={issuesByVehicle[vehicle.id] || 0} expanded={expandedId === vehicle.id} onToggle={() => { setExpandedId(expandedId === vehicle.id ? null : vehicle.id); if (expandedId === vehicle.id) setEditingId(null); }}>{details(vehicle, true)}</FleetVehicleRow>)}</ul> : <p className="rounded-[16px] border border-dashed border-[#DADADA] p-6 text-center text-[14px] text-[#777]">No vehicles match. <button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="text-[#1111F6]">Clear filters</button></p> : !addingVehicle && <div className="rounded-[16px] border border-dashed border-[#DADADA] bg-white p-8 text-center"><Truck className="mx-auto h-8 w-8 text-[#1111F6]" /><h3 className="mt-3 text-[18px]">Add your first vehicle</h3><p className="mx-auto mt-1 max-w-[340px] text-[14px] text-[#777]">Start with one vehicle. You can add its papers and assign a driver next.</p><button type="button" onClick={() => setAddingVehicle(true)} className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-full bg-[#1111F6] px-5 text-[14px] text-white"><Plus className="h-4 w-4" />Add vehicle</button></div>}
                    </section>

                    <section id="drivers" aria-labelledby="drivers-heading" className="mt-12 scroll-mt-24">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 id="drivers-heading" className="text-[22px] tracking-[-0.035em]">Drivers</h2>
                            {!addingDriver && <button type="button" onClick={() => { setAddingDriver(true); setAddedDriverEmail(null); }} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DFDFDF] bg-white px-4 text-[14px] hover:border-[#1111F6] hover:text-[#1111F6]"><Plus className="h-4 w-4" />Add driver</button>}
                        </div>
                        {addedDriverEmail && <p role="status" className="mb-4 flex items-start gap-2 rounded-[12px] bg-[#EAF7F0] p-3.5 text-[13px] text-[#197252]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />Driver added. Ask them to sign in or create an account with {addedDriverEmail} to see their car.</p>}
                        {addingDriver && <AddDriver key={currentOrg.id} orgId={currentOrg.id} vehicles={fleetCars} onAdded={async (email) => { setAddedDriverEmail(email); await reload(); }} onClose={() => setAddingDriver(false)} />}
                        {fleetDrivers.length ? <ul className="divide-y divide-[#F0F0F0] overflow-hidden rounded-[16px] border border-[#E7E7E7] bg-white">{fleetDrivers.map((driver) => {
                            const car = fleetCars.find((vehicle) => vehicle.id === driver.vehicleId);
                            return <li key={driver.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F3F3] text-[13px] text-[#555]">{driver.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                                <div className="min-w-0 flex-1"><p className="truncate text-[15px]">{driver.name}</p><p className="mt-0.5 truncate text-[12px] text-[#888]">{car ? <button type="button" onClick={() => openVehicle(car.id)} className="text-[#1111F6]">{car.plate || vehicleTitle(car)}</button> : "No vehicle assigned"}</p></div>
                                {driver.phone && <a href={`tel:${driver.phone.replace(/\s+/g, "")}`} aria-label={`Call ${driver.name}`} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3.5 text-[13px] hover:border-[#1111F6] hover:text-[#1111F6]"><Phone className="h-3.5 w-3.5" /><span className="hidden sm:inline">{driver.phone}</span><span className="sm:hidden">Call</span></a>}
                            </li>;
                        })}</ul> : !addingDriver && <p className="rounded-[16px] border border-dashed border-[#DADADA] bg-white p-6 text-center text-[14px] text-[#777]">No drivers yet. Add one and assign them a vehicle.</p>}
                    </section>
                </> : <>
                    <AttentionList items={attention} onOpen={(item) => openVehicle(item.vehicle.id, item.editable)} />
                    <LicenceCard name={data.profile?.fullName || ""} />
                    <section aria-labelledby="cars-heading">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 id="cars-heading" className="text-[22px] tracking-[-0.035em]">{data.assignedVehicles.length && !data.personalVehicles.length ? "Your assigned car" : "My cars"} <span className="text-[14px] text-[#888]">{personalCars.length}</span></h2>
                            {!addingVehicle && personalCars.length > 0 && <button type="button" onClick={() => setAddingVehicle(true)} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#DFDFDF] bg-white px-4 text-[14px] hover:border-[#1111F6] hover:text-[#1111F6]"><Plus className="h-4 w-4" />Add car</button>}
                        </div>
                        {addingVehicle && <AddVehicle onAdded={reload} onClose={() => setAddingVehicle(false)} />}
                        {personalCars.length ? <div className="grid items-start gap-4 md:grid-cols-2">{personalCars.map((vehicle) => <div key={vehicle.id} id={`vehicle-${vehicle.id}`} className="min-w-0 scroll-mt-24">{details(vehicle, false)}</div>)}</div> : !addingVehicle && <div className="rounded-[18px] border border-dashed border-[#DADADA] bg-white p-8 text-center"><Car className="mx-auto h-9 w-9 text-[#1111F6]" /><h3 className="mt-3 text-[19px]">Add your first car</h3><p className="mx-auto mt-1 max-w-[360px] text-[14px] text-[#777]">Keep its papers, service and fuel in one place, and get roadside help with its details filled in.</p><button type="button" onClick={() => setAddingVehicle(true)} className="mt-5 inline-flex h-12 items-center gap-1.5 rounded-full bg-[#1111F6] px-6 text-[15px] text-white"><Plus className="h-4 w-4" />Add a car</button></div>}
                    </section>
                </>}
                <p className="mt-12 text-[12px] leading-relaxed text-[#888]">Dates shown here are the ones you enter. Check the actual policy or certificate before relying on its status.</p>
            </>}
        </main>
        {view === "personal" && data && !data.needsProfile && !loading && !error && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E7E7E7] bg-white/95 px-4 pt-3 backdrop-blur-md sm:hidden" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
            <div className="flex gap-2">
                {personalCars.length > 0 && <button type="button" onClick={() => setLogSheet({})} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#DADAF8] bg-white text-[15px] text-[#1111F6]"><NotebookPen className="h-4 w-4" />Log</button>}
                <Link href="/help" className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[15px] text-white"><LifeBuoy className="h-4 w-4" />Roadside help</Link>
            </div>
        </div>}
        {view === "fleet" && data && !data.needsProfile && fleetCars.length > 0 && <button type="button" onClick={() => setLogSheet({})} aria-label="Log a fill-up, service or problem" className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1111F6] text-white shadow-[0_12px_30px_rgba(17,17,246,0.35)] sm:hidden"><NotebookPen className="h-5 w-5" /></button>}
        {logSheet && <QuickLogSheet open onOpenChange={(open) => { if (!open) setLogSheet(null); }} vehicles={visibleCars} initialVehicleId={logSheet.vehicleId} initialKind={logSheet.kind} />}
    </div>;
}
