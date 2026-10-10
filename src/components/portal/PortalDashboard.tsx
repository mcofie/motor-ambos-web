"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, CalendarDays, Car, Check, ChevronRight, FileText, Loader2, LogOut, Pencil, Plus, ShieldCheck, Truck } from "lucide-react";
import { logout } from "@/lib/supaFetch";
import type { PortalData, PortalDocument, PortalVehicle } from "@/lib/portalTypes";
import { formatPhone } from "@/lib/phone";

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

function documentState(document: PortalDocument | undefined) {
    const date = document?.expires_on?.slice(0, 10);
    if (!date) return { label: "Add date", tone: "text-[#696969] bg-[#F2F2F2]", priority: 1 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(`${date}T12:00:00`);
    if (Number.isNaN(expiry.getTime())) return { label: "Check date", tone: "text-[#696969] bg-[#F2F2F2]", priority: 1 };
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
    if (daysLeft < 0) return { label: "Date passed", tone: "text-[#AA3333] bg-[#FFF0EF]", priority: 3 };
    if (daysLeft <= 30) return { label: "Due soon", tone: "text-[#915C12] bg-[#FFF4DF]", priority: 2 };
    return { label: "On file", tone: "text-[#197252] bg-[#EAF7F0]", priority: 0 };
}

function formatDate(value: string | null | undefined) {
    if (!value) return "No date added";
    const date = new Date(`${value.slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function VehicleCard({ vehicle, documents, editable, onUpdated }: {
    vehicle: PortalVehicle;
    documents: PortalDocument[];
    editable: boolean;
    onUpdated: () => Promise<void>;
}) {
    const insurance = documents.find((item) => item.vehicle_id === vehicle.id && item.kind === "insurance");
    const roadworthy = documents.find((item) => item.vehicle_id === vehicle.id && item.kind === "roadworthy");
    const [editing, setEditing] = useState(false);
    const [insuranceDate, setInsuranceDate] = useState(insurance?.expires_on || "");
    const [roadworthyDate, setRoadworthyDate] = useState(roadworthy?.expires_on || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setInsuranceDate(insurance?.expires_on || "");
        setRoadworthyDate(roadworthy?.expires_on || "");
    }, [insurance?.expires_on, roadworthy?.expires_on]);

    async function saveDates() {
        const changes = [
            { kind: "insurance", value: insuranceDate, previous: insurance?.expires_on || "" },
            { kind: "roadworthy", value: roadworthyDate, previous: roadworthy?.expires_on || "" },
        ].filter((entry) => entry.value !== entry.previous);
        setError(null);
        setSaving(true);
        try {
            for (const change of changes) {
                const response = await fetch("/api/portal/documents", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ vehicleId: vehicle.id, kind: change.kind, expiresOn: change.value || null }),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Could not save date");
            }
            await onUpdated();
            setEditing(false);
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not save date");
        } finally {
            setSaving(false);
        }
    }

    const title = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || vehicle.name || "Vehicle";
    const insuranceState = documentState(insurance);
    const roadworthyState = documentState(roadworthy);
    const worstPriority = Math.max(insuranceState.priority, roadworthyState.priority);
    const carStatus = worstPriority === 3 ? "Check a passed date" : worstPriority === 2 ? "Date due soon" : worstPriority === 1 ? editable ? "Add expiry dates" : "Dates not recorded" : "Dates on file";
    const statusTone = worstPriority === 3 ? "bg-[#FFF0EF] text-[#AA3333]" : worstPriority === 2 ? "bg-[#FFF4DF] text-[#915C12]" : worstPriority === 1 ? "bg-[#F2F2F2] text-[#686868]" : "bg-[#EAF7F0] text-[#197252]";
    const datesChanged = insuranceDate !== (insurance?.expires_on || "") || roadworthyDate !== (roadworthy?.expires_on || "");
    const helpParams = new URLSearchParams();
    if (vehicle.plate) helpParams.set("plate", vehicle.plate);
    if (vehicle.make) helpParams.set("make", vehicle.make);
    if (vehicle.model) helpParams.set("model", vehicle.model);
    if (vehicle.year) helpParams.set("year", vehicle.year);
    if (vehicle.color) helpParams.set("color", vehicle.color);

    return (
        <article id={`vehicle-${vehicle.id}`} className="scroll-mt-24 overflow-hidden rounded-[20px] border border-[#E7E7E7] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.025)]">
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EEEEFF] text-[#1111F6]"><Car className="h-6 w-6" /></span>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[21px] font-normal leading-tight tracking-[-0.035em] sm:text-[23px]">{title}</h3>
                        <p className="mt-1 text-[13px] text-[#777]">{[vehicle.plate || "Plate not added", vehicle.color].filter(Boolean).join(" · ")}</p>
                    </div>
                </div>
                <span className={`mt-5 inline-flex rounded-full px-3 py-1.5 text-[12px] ${statusTone}`}>{carStatus}</span>
            </div>
            <div className="border-t border-[#EEEEEE] px-5 sm:px-6">
                {(["insurance", "roadworthy"] as const).map((kind) => {
                    const record = kind === "insurance" ? insurance : roadworthy;
                    const state = documentState(record);
                    const fileUrl = record?.file_url;
                    return <div key={kind} className="flex min-h-[76px] items-center justify-between gap-3 border-b border-[#F0F0F0] py-3.5 last:border-b-0">
                        <div className="min-w-0"><p className="text-[14px] capitalize">{kind}</p><p className="mt-1 text-[13px] text-[#777]">{record?.expires_on ? `Expires ${formatDate(record.expires_on)}` : "No expiry date added"}</p>{fileUrl && <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#1111F6]"><FileText className="h-3.5 w-3.5" />View document</a>}</div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${state.tone}`}>{state.label}</span>
                    </div>;
                })}
            </div>
            {editing && <div className="mx-5 mb-5 grid gap-3 rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-4 sm:mx-6 sm:grid-cols-2">
                <label className="text-[13px]">Insurance expiry<input className={inputClass + " mt-2"} type="date" value={insuranceDate} onChange={(event) => setInsuranceDate(event.target.value)} /></label>
                <label className="text-[13px]">Roadworthy expiry<input className={inputClass + " mt-2"} type="date" value={roadworthyDate} onChange={(event) => setRoadworthyDate(event.target.value)} /></label>
                <p className="text-[12px] leading-relaxed text-[#777] sm:col-span-2">Dates you enter are reminders, not a verification of legal status.</p>
                {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
                <div className="flex gap-2 sm:col-span-2">
                    <button type="button" onClick={saveDates} disabled={saving || !datesChanged} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-40">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save dates</button>
                    <button type="button" onClick={() => setEditing(false)} className="h-11 rounded-full border border-[#E3E3E3] px-5 text-[14px]">Cancel</button>
                </div>
            </div>}
            <div className="flex flex-col gap-2 border-t border-[#EEEEEE] bg-[#FCFCFC] p-4 sm:flex-row sm:items-center sm:p-5">
                <Link href={`/help?${helpParams.toString()}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-5 text-[14px] text-white transition-colors hover:bg-[#0606D8]">Get help with this car <ArrowRight className="h-4 w-4" /></Link>
                {editable && !editing && <button type="button" onClick={() => setEditing(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#E3E3E3] bg-white px-5 text-[14px]"><Pencil className="h-3.5 w-3.5" />{worstPriority === 1 ? "Add dates" : "Edit dates"}</button>}
            </div>
        </article>
    );
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

function AddVehicle({ orgId, onAdded }: { orgId?: string; onAdded: () => Promise<void> }) {
    const [open, setOpen] = useState(false);
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

    function reset() {
        setMakeChoice(""); setMake(""); setModelChoice(""); setModel("");
        setYearChoice(""); setYear(""); setColorChoice(""); setColor("");
        setPlate(""); setShowDetails(false); setError(null);
    }

    function close() {
        setOpen(false);
        reset();
    }

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
            close();
            await onAdded();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not add vehicle");
        } finally {
            setBusy(false);
        }
    }

    return <div>
        {!open && <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DFDFDF] bg-white px-4 text-[14px] hover:border-[#1111F6] hover:text-[#1111F6]"><Plus className="h-4 w-4" />Add a vehicle</button>}
        {open && <form onSubmit={add} className="grid gap-5 rounded-[18px] border border-[#DADAF8] bg-white p-5 shadow-[0_12px_32px_rgba(17,17,246,0.05)] sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2"><p className="text-[12px] text-[#1111F6]">NEW VEHICLE</p><h3 className="mt-1 text-[22px] tracking-[-0.035em]">Add your car in a minute</h3><p className="mt-1 text-[14px] leading-relaxed text-[#777]">Start with the plate, then choose the make and model. Year and colour can wait.</p></div>

            <label className="block text-[14px] sm:col-span-2">Plate number
                <input className={inputClass + " mt-2 uppercase"} value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="e.g. GW-1234-22" autoCapitalize="characters" autoComplete="off" maxLength={30} required />
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

            <div className="sm:col-span-2"><button type="button" onClick={() => setShowDetails(!showDetails)} aria-expanded={showDetails} className="inline-flex min-h-11 items-center gap-1 text-[14px] text-[#1111F6]">{showDetails ? "Hide" : "Add"} year and colour <ChevronRight className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`} /></button></div>
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
            <div className="flex flex-col gap-2 border-t border-[#EFEFEF] pt-5 sm:col-span-2 sm:flex-row"><button type="submit" disabled={busy} className="h-12 rounded-full bg-[#1111F6] px-6 text-[15px] text-white disabled:opacity-50">{busy ? "Adding vehicle…" : "Add vehicle"}</button><button type="button" onClick={close} disabled={busy} className="h-12 rounded-full border border-[#E3E3E3] px-6 text-[14px] disabled:opacity-50">Cancel</button></div>
        </form>}
    </div>;
}

function AddDriver({ orgId, vehicles, onAdded }: { orgId: string; vehicles: PortalVehicle[]; onAdded: () => Promise<void> }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedEmail, setAddedEmail] = useState<string | null>(null);

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
            setAddedEmail(email);
            setOpen(false);
            setName(""); setEmail(""); setPhone(""); setVehicleId("");
            await onAdded();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Could not add driver");
        } finally {
            setBusy(false);
        }
    }

    return <div>
        <button type="button" onClick={() => { setOpen(!open); setAddedEmail(null); }} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DFDFDF] bg-white px-4 text-[14px]"><Plus className="h-4 w-4" />Add driver</button>
        {addedEmail && <p role="status" className="mt-3 text-[13px] text-[#277E62]">Driver added. Ask them to sign in or create an account with {addedEmail} to see their assigned car.</p>}
        {open && <form onSubmit={add} className="mt-4 grid gap-4 rounded-[16px] border border-[#E7E7E7] bg-white p-5 sm:grid-cols-2">
            <label className="text-[14px]">Full name<input className={inputClass + " mt-2"} value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label className="text-[14px]">Email address<input className={inputClass + " mt-2"} value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
            <label className="text-[14px]">Phone number<input className={inputClass + " mt-2"} value={phone} onChange={(event) => setPhone(event.target.value)} onBlur={() => setPhone(formatPhone(phone))} placeholder="+233558508306" inputMode="tel" required /></label>
            <label className="text-[14px]">Assigned vehicle <span className="text-[#888]">(optional)</span><select className={inputClass + " mt-2"} value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}><option value="">Choose later</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plate || [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle"}</option>)}</select></label>
            {error && <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">{error}</p>}
            <div className="flex gap-2 sm:col-span-2"><button type="submit" disabled={busy} className="h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white disabled:opacity-50">{busy ? "Adding…" : "Save driver"}</button><button type="button" onClick={() => setOpen(false)} className="h-11 rounded-full border border-[#E3E3E3] px-5 text-[14px]">Cancel</button></div>
        </form>}
    </div>;
}

function DashboardSkeleton({ view }: { view: "personal" | "fleet" }) {
    const bar = "rounded-full bg-[#E7E7E7] motion-safe:animate-pulse";

    return <div role="status" aria-label="Loading your account">
        <span className="sr-only">Loading your account…</span>
        <div aria-hidden="true">
            <div className="mb-7">
                <div className={`${bar} h-3 w-24`} />
                <div className={`${bar} mt-4 h-10 w-[min(78%,390px)] sm:h-12`} />
                <div className={`${bar} mt-4 h-4 w-[min(90%,430px)]`} />
            </div>
            <div className="mb-7 flex gap-5 border-b border-[#E1E1E1] pb-3">
                <div className={`${bar} h-5 w-20`} />
                <div className={`${bar} h-5 w-20`} />
            </div>
            <div className="mb-8 flex min-h-[210px] flex-col justify-between gap-7 rounded-[22px] bg-[#E8E8FF] p-6 sm:min-h-[180px] sm:flex-row sm:items-center sm:p-8">
                <div className="w-full max-w-[450px]">
                    <div className="h-3 w-28 rounded-full bg-[#CFCFFA] motion-safe:animate-pulse" />
                    <div className="mt-4 h-8 w-[min(90%,300px)] rounded-full bg-[#CFCFFA] motion-safe:animate-pulse" />
                    <div className="mt-4 h-4 w-full rounded-full bg-[#D8D8FB] motion-safe:animate-pulse" />
                    <div className="mt-2 h-4 w-3/4 rounded-full bg-[#D8D8FB] motion-safe:animate-pulse" />
                </div>
                <div className="h-12 w-44 shrink-0 rounded-full bg-white/80 motion-safe:animate-pulse" />
            </div>
            {view === "fleet" && <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3">{[0, 1, 2].map((item) => <div key={item} className="h-28 rounded-[16px] border border-[#EAEAEA] bg-white p-4"><div className={`${bar} h-5 w-5`} /><div className={`${bar} mt-3 h-7 w-12`} /><div className={`${bar} mt-2 h-3 w-20 max-w-full`} /></div>)}</div>}
            <div className={`${bar} mb-5 h-7 w-28`} />
            <div className={`${bar} mb-5 h-11 w-36 bg-[#E2E2E2]`} />
            <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((item) => <div key={item} className="overflow-hidden rounded-[20px] border border-[#E7E7E7] bg-white">
                <div className="flex gap-3 p-5 sm:p-6"><div className="h-12 w-12 shrink-0 rounded-[14px] bg-[#EEEEFF] motion-safe:animate-pulse" /><div className="w-full"><div className={`${bar} h-6 w-2/3`} /><div className={`${bar} mt-3 h-3 w-1/2`} /><div className={`${bar} mt-5 h-6 w-24`} /></div></div>
                <div className="space-y-5 border-t border-[#EEEEEE] px-5 py-6 sm:px-6"><div className={`${bar} h-4 w-1/3`} /><div className={`${bar} h-3 w-1/2`} /><div className={`${bar} h-4 w-1/3`} /><div className={`${bar} h-3 w-1/2`} /></div>
                <div className="border-t border-[#EEEEEE] bg-[#FCFCFC] p-4 sm:p-5"><div className={`${bar} h-12 w-44`} /></div>
            </div>)}</div>
        </div>
    </div>;
}

export default function PortalDashboard({ view }: { view: "personal" | "fleet" }) {
    const router = useRouter();
    const [data, setData] = useState<PortalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

    const load = useCallback(async () => {
        const response = await fetch("/api/portal/me", { cache: "no-store" });
        if (response.status === 401) { router.replace(`/login?next=${encodeURIComponent(view === "fleet" ? "/app/fleet" : "/app")}`); return; }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load your account");
        setData(result as PortalData);
        if (view === "personal" && (result as PortalData).personalVehicles.length === 0 && (result as PortalData).assignedVehicles.length === 0 && (result as PortalData).organizations.some((org) => org.role !== "DRIVER")) {
            router.replace("/app/fleet");
        }
        setLoading(false);
    }, [router, view]);

    useEffect(() => {
        load().catch((reason) => { setError(reason instanceof Error ? reason.message : "Could not load your account"); setLoading(false); });
    }, [load]);

    async function signOut() {
        await logout();
        router.replace("/login");
    }

    const managedOrgs = data?.organizations.filter((org) => org.role !== "DRIVER") || [];
    const assignedOrgs = data?.organizations.filter((org) => org.assignedVehicleId) || [];
    const showFleetTab = managedOrgs.length > 0;
    const currentOrg = managedOrgs.find((org) => org.id === selectedOrgId) || managedOrgs[0];
    const fleetCars = data && currentOrg ? data.fleetVehicles.filter((vehicle) => (vehicle.orgId || vehicle.user_id) === currentOrg.id) : [];
    const personalCars = data ? [...data.personalVehicles, ...data.assignedVehicles.filter((vehicle) => !data.personalVehicles.some((own) => own.id === vehicle.id))] : [];
    const visibleCars = view === "fleet" ? fleetCars : personalCars;
    const visibleIds = new Set(visibleCars.map((vehicle) => vehicle.id));
    const editableIds = new Set((view === "fleet" ? fleetCars : data?.personalVehicles || []).map((vehicle) => vehicle.id));
    const visibleDocuments = data?.documents.filter((document) => visibleIds.has(document.vehicle_id)) || [];
    const passedDates = visibleDocuments.filter((document) => documentState(document).priority === 3);
    const dueDates = visibleDocuments.filter((document) => documentState(document).priority === 2);
    const missingDates = visibleDocuments.filter((document) => editableIds.has(document.vehicle_id) && documentState(document).priority === 1);
    const nextAttention = passedDates[0] || dueDates[0] || missingDates[0];
    const firstName = data?.profile?.fullName.trim().split(/\s+/)[0] || "there";

    return <div className="base-landing min-h-[100svh] bg-[#F7F7F7] text-[#171717]">
        <header className="sticky top-0 z-40 border-b border-[#E9E9E9] bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1136px] items-center justify-between px-5 sm:h-[76px] sm:px-8">
                <Link href="/" className="flex items-center gap-2.5 text-[17px] font-medium tracking-[-0.035em]"><span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1111F6] text-white"><Car className="h-4 w-4" /></span>Motor Ambos</Link>
                <button type="button" onClick={signOut} className="inline-flex h-11 items-center gap-1.5 text-[14px] text-[#666] hover:text-[#1111F6]"><LogOut className="h-4 w-4" />Sign out</button>
            </div>
        </header>
        <main className="mx-auto max-w-[1136px] px-4 pb-24 pt-8 sm:px-8 sm:pt-11">
            {loading ? <DashboardSkeleton view={view} /> : error ? <div role="alert" className="rounded-[16px] border border-[#F3D8D8] bg-white p-6"><p className="text-[15px] text-red-600">{error}</p><button type="button" onClick={() => { setLoading(true); setError(null); load().catch((reason) => { setError(reason instanceof Error ? reason.message : "Could not load your account"); setLoading(false); }); }} className="mt-4 h-11 rounded-full bg-[#1111F6] px-5 text-[14px] text-white">Try again</button></div> : data?.needsProfile ? <ProfileSetup email={data.email} initialName={data.suggestedProfile?.fullName || ""} initialPhone={data.suggestedProfile?.phone || ""} onDone={load} /> : data && <>
                <div className="mb-7">
                    <p className="text-[13px] text-[#777]">{view === "fleet" ? "Fleet overview" : "Your account"}</p>
                    <h1 className="mt-2 text-[36px] leading-[1.08] tracking-[-0.05em] sm:text-[48px]">{view === "fleet" ? currentOrg?.name || "My fleet" : `Good to see you, ${firstName}.`}</h1>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#6F6F6F]">{view === "fleet" ? "Keep vehicles, drivers, and important dates together." : "Your cars, important dates, and help when you need it."}</p>
                </div>
                <nav aria-label="Account sections" className="mb-7 flex gap-2 overflow-x-auto border-b border-[#E1E1E1]">
                    <Link href="/app" aria-current={view === "personal" ? "page" : undefined} className={`whitespace-nowrap border-b-2 px-3 pb-3 text-[15px] ${view === "personal" ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777]"}`}>My cars</Link>
                    {showFleetTab && <Link href="/app/fleet" aria-current={view === "fleet" ? "page" : undefined} className={`whitespace-nowrap border-b-2 px-3 pb-3 text-[15px] ${view === "fleet" ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777]"}`}>My fleet</Link>}
                </nav>

                <section className="relative mb-6 overflow-hidden rounded-[22px] bg-[#1111F6] px-6 py-6 text-white sm:px-8 sm:py-8">
                    <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[36px] border-white/10 sm:right-12" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="text-[12px] text-white/70">ROADSIDE SUPPORT</p><h2 className="mt-2 text-[25px] leading-tight tracking-[-0.04em] sm:text-[30px]">Need help on the road?</h2><p className="mt-2 max-w-[450px] text-[14px] leading-relaxed text-white/80">Tell us what happened and find help near you. You can start with one of your cars below.</p></div>
                        <Link href="/help" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-5 text-[14px] text-[#1111F6] sm:self-auto">Get roadside help <ArrowRight className="h-4 w-4" /></Link>
                    </div>
                </section>

                {nextAttention && <section aria-label="Dates to review" className={`mb-8 flex items-start gap-3 rounded-[16px] border p-4 sm:items-center sm:p-5 ${passedDates.length ? "border-[#F4D5D2] bg-[#FFF8F7]" : dueDates.length ? "border-[#F3E5C6] bg-[#FFFBF3]" : "border-[#E6E6E6] bg-white"}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${passedDates.length ? "bg-[#FFE9E7] text-[#AA3333]" : dueDates.length ? "bg-[#FFF1D5] text-[#915C12]" : "bg-[#F2F2F2] text-[#777]"}`}>{passedDates.length || dueDates.length ? <AlertCircle className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}</span>
                    <div className="min-w-0 flex-1"><h2 className="text-[16px] tracking-[-0.02em]">{passedDates.length ? `${passedDates.length} ${passedDates.length === 1 ? "date has" : "dates have"} passed` : dueDates.length ? `${dueDates.length} ${dueDates.length === 1 ? "date is" : "dates are"} due soon` : "Add expiry dates to your cars"}</h2><p className="mt-1 text-[13px] leading-relaxed text-[#777]">{passedDates.length || dueDates.length ? "Check the actual document. For an assigned car, ask your fleet manager to update its record." : "Once dates are recorded, you can see which ones are coming up."}</p><a href={`#vehicle-${nextAttention.vehicle_id}`} className="mt-2 inline-flex items-center gap-1 text-[13px] text-[#1111F6]">View car <ChevronRight className="h-4 w-4" /></a></div>
                </section>}

                {view === "fleet" ? !currentOrg ? <div className="rounded-[16px] border border-[#E7E7E7] bg-white p-6">This account does not have fleet manager access.</div> : <>
                    {managedOrgs.length > 1 && <label className="mb-6 block max-w-[360px] text-[13px] text-[#666]">Choose a fleet<select className={inputClass + " mt-2"} value={currentOrg.id} onChange={(event) => setSelectedOrgId(event.target.value)}>{managedOrgs.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select></label>}
                    <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-3.5 sm:p-5"><Truck className="mb-2 h-4 w-4 text-[#1111F6] sm:h-5 sm:w-5" /><span className="block text-[26px] tracking-[-0.04em] sm:text-[30px]">{fleetCars.length}</span><span className="text-[12px] text-[#777] sm:text-[13px]">Vehicles</span></div>
                        <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-3.5 sm:p-5"><ShieldCheck className="mb-2 h-4 w-4 text-[#1111F6] sm:h-5 sm:w-5" /><span className="block text-[26px] tracking-[-0.04em] sm:text-[30px]">{data.fleetDrivers.filter((driver) => driver.orgId === currentOrg.id).length}</span><span className="text-[12px] text-[#777] sm:text-[13px]">Drivers</span></div>
                        <div className="rounded-[16px] border border-[#EAEAEA] bg-white p-3.5 sm:p-5"><CalendarDays className="mb-2 h-4 w-4 text-[#1111F6] sm:h-5 sm:w-5" /><span className="block text-[26px] tracking-[-0.04em] sm:text-[30px]">{passedDates.length + dueDates.length}</span><span className="text-[12px] leading-tight text-[#777] sm:text-[13px]">Dates to review</span></div>
                    </div>
                    <h2 className="mb-4 text-[23px] tracking-[-0.035em]">Fleet vehicles</h2>
                    <div className="mb-5"><AddVehicle key={currentOrg.id} orgId={currentOrg.id} onAdded={load} /></div>
                    {fleetCars.length ? <div className="grid gap-4 md:grid-cols-2">{fleetCars.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} documents={data.documents} editable onUpdated={load} />)}</div> : <p className="rounded-[16px] bg-white p-6 text-[15px] text-[#777]">No fleet vehicles yet. Add the first one above.</p>}
                    <section className="mt-10"><h2 className="mb-4 text-[23px] tracking-[-0.035em]">Drivers</h2><div className="mb-5"><AddDriver key={currentOrg.id} orgId={currentOrg.id} vehicles={fleetCars} onAdded={load} /></div>{data.fleetDrivers.filter((driver) => driver.orgId === currentOrg.id).length ? <div className="grid gap-3 sm:grid-cols-2">{data.fleetDrivers.filter((driver) => driver.orgId === currentOrg.id).map((driver) => <div key={driver.id} className="rounded-[12px] border border-[#E7E7E7] bg-white p-4"><span className="block text-[16px]">{driver.name}</span><span className="mt-1 block text-[13px] text-[#777]">{driver.phone}</span><span className="mt-2 block text-[13px] text-[#777]">{driver.vehicleId ? fleetCars.find((vehicle) => vehicle.id === driver.vehicleId)?.plate || "Assigned vehicle" : "No vehicle assigned"}</span></div>)}</div> : <p className="rounded-[12px] bg-white p-5 text-[14px] text-[#777]">No drivers linked to this fleet yet. Add the first one above.</p>}</section>
                </> : <>
                    <div className="mb-4 flex items-baseline gap-3"><h2 className="text-[23px] tracking-[-0.035em]">{assignedOrgs.length && !data.personalVehicles.length ? "Assigned vehicle" : "My cars"}</h2><span className="text-[13px] text-[#888]">{personalCars.length} {personalCars.length === 1 ? "car" : "cars"}</span></div>
                    <div className="mb-5"><AddVehicle onAdded={load} /></div>
                    {personalCars.length ? <div className="grid gap-4 md:grid-cols-2">{personalCars.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} documents={data.documents} editable={data.personalVehicles.some((own) => own.id === vehicle.id)} onUpdated={load} />)}</div> : <div className="rounded-[16px] border border-[#E7E7E7] bg-white p-6"><Car className="mb-4 h-8 w-8 text-[#1111F6]" /><h3 className="text-[19px]">Your cars will appear here</h3><p className="mt-2 text-[14px] text-[#777]">Add your car to keep its details and get roadside help faster.</p></div>}
                </>}
                <p className="mt-10 text-[12px] text-[#888]">Document dates shown here are records you enter. Check the actual policy or certificate before relying on its status.</p>
            </>}
        </main>
        {data && !data.needsProfile && !loading && !error && <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E7E7E7] bg-white/95 px-4 pt-3 backdrop-blur-md sm:hidden" style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
            <Link href="/help" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1111F6] text-[15px] text-white">Get roadside help <ArrowRight className="h-4 w-4" /></Link>
        </div>}
    </div>;
}
