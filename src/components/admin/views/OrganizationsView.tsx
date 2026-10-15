"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
    listMembersWithMemberships,
    MemberWithMembershipRow,
    listAllVehicles,
    VehicleRow,
    listInvoices,
    InvoiceRow,
    createInvoice,
    listOrgDrivers,
    listMembershipPlans,
    MembershipPlanRow,
    upsertOrganization,
    recordInvoicePayment,
    listOrgNotes,
    addOrgNote,
    fetchOrgServiceAnalytics,
    sendFleetReport,
} from "@/lib/supaFetch";
import { ArrowLeft, Building2, ChevronRight, Download, Loader2, Pencil, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cls } from "../ui/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatPhone, phoneVariants } from "@/lib/phone";

type Driver = { id: string; full_name?: string | null; phone?: string | null; vehicle?: { id: string; make?: string | null; model?: string | null; plate?: string | null } | null };
type Note = { id: string; category?: string | null; content: string; created_at?: string | null };
type Tab = "vehicles" | "drivers" | "invoices" | "notes";

const field = "h-11 w-full rounded-[12px] border border-[#E3E3E3] bg-white px-3.5 text-[14px] text-[#171717] outline-none placeholder:text-[#AAA] focus:border-[#1111F6] focus:ring-2 focus:ring-[#1111F6]/15 disabled:bg-[#F7F7F7] disabled:text-[#888]";
const label = "block text-[13px] text-[#555]";
const primaryBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#1111F6] px-4 text-[14px] text-white transition-colors hover:bg-[#0606D8] disabled:opacity-50";
const quietBtn = "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#E3E3E3] bg-white px-4 text-[14px] text-[#333] transition-colors hover:border-[#B8B8FF] hover:text-[#1111F6] disabled:opacity-50";

const ghs = (amount: number) => `GHS ${amount.toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;
const day = (value?: string | null) => value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const isoDay = (offsetDays = 0) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
const owed = (invoice: InvoiceRow) => invoice.status === "PENDING" || invoice.status === "OVERDUE" ? invoice.total_amount - invoice.paid_amount : 0;
const isAbort = (err: unknown) => err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"));

const INVOICE_TONE: Record<string, { label: string; tone: string }> = {
    PAID: { label: "Paid", tone: "bg-[#EAF7F0] text-[#197252]" },
    PENDING: { label: "Unpaid", tone: "bg-[#FFF4DF] text-[#915C12]" },
    OVERDUE: { label: "Overdue", tone: "bg-[#FFF0EF] text-[#AA3333]" },
    CANCELLED: { label: "Cancelled", tone: "bg-[#F2F2F2] text-[#666]" },
};

/** Fleet customers: who they are, their vehicles and drivers, and what they owe. */
export function OrganizationsView() {
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [allVehicles, setAllVehicles] = useState<VehicleRow[]>([]);
    const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
    const [plans, setPlans] = useState<MembershipPlanRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    const [selected, setSelected] = useState<MemberWithMembershipRow | null>(null);
    const [tab, setTab] = useState<Tab>("vehicles");
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [spend, setSpend] = useState({ total_requests: 0, total_cost: 0 });
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [noteCategory, setNoteCategory] = useState("GENERAL");

    const [orgFormOpen, setOrgFormOpen] = useState(false);
    const [savingOrg, setSavingOrg] = useState(false);
    const [orgForm, setOrgForm] = useState({ id: "", business_name: "", contact_member_id: "", email: "", phone: "", membership_tier: "", membership_expiry_date: isoDay(365), membership_is_active: true });

    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ due_date: isoDay(7), notes: "", items: [{ description: "Monthly membership", quantity: 1, unit_price: 0 }] });

    const [reportOpen, setReportOpen] = useState(false);
    const [reportForm, setReportForm] = useState({ startDate: isoDay(-30), endDate: isoDay(), includeServices: true, includeCompliance: true, includeFleetStats: true });

    const [payInvoice, setPayInvoice] = useState<InvoiceRow | null>(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const organizations = useMemo(() => members.filter((m) => m.is_business && (m.business_name || m.full_name)), [members]);
    const people = useMemo(() => members.filter((m) => !m.is_business), [members]);
    const peopleById = useMemo(() => new Map(people.map((m) => [m.member_id, m])), [people]);
    const contactFor = (org: MemberWithMembershipRow) => org.contact_member_id ? peopleById.get(org.contact_member_id) : undefined;
    const planName = (code?: string | null) => plans.find((p) => p.code === code)?.name || code || "No plan";
    const vehiclesFor = useCallback((org: MemberWithMembershipRow) => allVehicles.filter((v) => v.user_id === org.member_id || (org.auth_user_id && v.user_id === org.auth_user_id)), [allVehicles]);
    const invoicesFor = (org: MemberWithMembershipRow) => invoices.filter((i) => i.org_id === org.member_id);
    const balanceFor = (org: MemberWithMembershipRow) => invoicesFor(org).reduce((sum, i) => sum + owed(i), 0);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            const [mRes, vRes, iRes, pRes] = await Promise.all([listMembersWithMemberships(signal), listAllVehicles(signal), listInvoices(undefined, signal), listMembershipPlans(signal)]);
            setMembers(mRes || []);
            setAllVehicles(vRes || []);
            setInvoices(iRes || []);
            setPlans(pRes || []);
        } catch (err) {
            if (isAbort(err)) return;
            toast.error("Could not load organizations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loads server data once the page mounts
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    async function openOrg(org: MemberWithMembershipRow) {
        setSelected(org);
        setTab("vehicles");
        setDrivers([]);
        setNotes([]);
        setSpend({ total_requests: 0, total_cost: 0 });
        setLoadingDetail(true);
        try {
            const [d, n, a] = await Promise.all([listOrgDrivers(org.member_id), listOrgNotes(org.member_id), fetchOrgServiceAnalytics(org.member_id)]);
            setDrivers(d || []);
            setNotes(n || []);
            setSpend(a);
        } catch {
            toast.error("Could not load all of this organization’s details");
        } finally {
            setLoadingDetail(false);
        }
    }

    async function saveNote() {
        if (!selected || !newNote.trim()) return;
        try {
            await addOrgNote(selected.member_id, newNote.trim(), noteCategory);
            setNewNote("");
            setNotes(await listOrgNotes(selected.member_id));
            toast.success("Note saved");
        } catch {
            toast.error("Could not save the note");
        }
    }

    async function savePayment() {
        if (!payInvoice) return;
        try {
            await recordInvoicePayment(payInvoice.id, paymentAmount);
            toast.success("Payment recorded");
            setPayInvoice(null);
            await fetchData();
        } catch {
            toast.error("Could not record the payment");
        }
    }

    const invoiceTotal = invoiceForm.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    async function saveInvoice() {
        if (!selected) return;
        const items = invoiceForm.items.filter((item) => item.description.trim() && item.unit_price > 0);
        if (!items.length) return toast.error("Add at least one item with a price");
        try {
            await createInvoice({ org_id: selected.member_id, due_date: invoiceForm.due_date, total_amount: invoiceTotal, notes: invoiceForm.notes, items });
            toast.success("Invoice created");
            setInvoiceOpen(false);
            setTab("invoices");
            await fetchData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not create the invoice");
        }
    }

    async function downloadReport() {
        if (!selected) return;
        const tid = toast.loading("Preparing the fleet report…");
        try {
            const blob = await sendFleetReport(selected.member_id, reportForm);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Fleet report, ${selected.business_name || selected.full_name}, ${isoDay()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Report downloaded", { id: tid });
            setReportOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not create the report", { id: tid });
        }
    }

    async function saveOrg() {
        if (savingOrg) return;
        if (!orgForm.business_name.trim() || !orgForm.contact_member_id) return toast.error("Enter the business name and choose a contact person.");
        setSavingOrg(true);
        try {
            await upsertOrganization({ ...orgForm, id: orgForm.id || undefined });
            toast.success(orgForm.id ? "Organization saved" : "Organization added");
            setOrgFormOpen(false);
            await fetchData();
            if (selected && orgForm.id === selected.member_id) setSelected({ ...selected, business_name: orgForm.business_name, contact_member_id: orgForm.contact_member_id, email: orgForm.email, phone: orgForm.phone, membership_tier: orgForm.membership_tier, membership_expiry_date: orgForm.membership_expiry_date, membership_is_active: orgForm.membership_is_active });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not save the organization");
        } finally {
            setSavingOrg(false);
        }
    }

    function openAddOrg() {
        setOrgForm({ id: "", business_name: "", contact_member_id: "", email: "", phone: "", membership_tier: plans[0]?.code || "", membership_expiry_date: isoDay(365), membership_is_active: true });
        setOrgFormOpen(true);
    }

    function openEditOrg(org: MemberWithMembershipRow) {
        setOrgForm({
            id: org.member_id || org.id || "",
            business_name: org.business_name || "",
            contact_member_id: org.contact_member_id || "",
            email: org.email || "",
            phone: formatPhone(org.phone),
            membership_tier: org.membership_tier || org.tier || "",
            membership_expiry_date: (org.membership_expiry_date || "").slice(0, 10),
            membership_is_active: org.membership_is_active ?? true,
        });
        setOrgFormOpen(true);
    }

    const filtered = organizations.filter((org) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const contact = contactFor(org);
        return [org.business_name, org.full_name, org.email, org.phone, contact?.full_name, contact?.phone].some((value) => value?.toLowerCase().includes(q))
            || phoneVariants(org.phone || "").some((phone) => phone.toLowerCase().includes(q));
    });

    const totalOwed = invoices.reduce((sum, i) => sum + owed(i), 0);
    const fleetVehicleCount = organizations.reduce((sum, org) => sum + vehiclesFor(org).length, 0);

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    const dialogs = <>
        {/* Add or edit an organization */}
        <Dialog open={orgFormOpen} onOpenChange={setOrgFormOpen}>
            <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-h-[90dvh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{orgForm.id ? "Edit organization" : "Add an organization"}</DialogTitle>
                    <DialogDescription>A business with several vehicles. Its contact person manages the fleet from the app.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <label className={label}>Business name<input className={cls(field, "mt-1.5")} placeholder="e.g. Accra Logistics Ltd" value={orgForm.business_name} onChange={(e) => setOrgForm({ ...orgForm, business_name: e.target.value })} /></label>
                    <label className={label}>Contact person
                        <select className={cls(field, "mt-1.5")} value={orgForm.contact_member_id} onChange={(e) => setOrgForm({ ...orgForm, contact_member_id: e.target.value })}>
                            <option value="">Choose a member</option>
                            {people.filter((m) => m.phone).map((person) => <option key={person.member_id} value={person.member_id}>{person.full_name || person.email || "Unnamed"} · {formatPhone(person.phone)}</option>)}
                        </select>
                        <span className="mt-1.5 block text-[12px] text-[#888]">Not listed? Add them in <Link href="/admin/memberships" className="text-[#1111F6]">Memberships</Link> first.</span>
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className={label}>Business email <span className="text-[#AAA]">(optional)</span><input type="email" className={cls(field, "mt-1.5")} placeholder="accounts@company.com" value={orgForm.email} onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })} /></label>
                        <label className={label}>Business phone <span className="text-[#AAA]">(optional)</span><input className={cls(field, "mt-1.5")} placeholder="Uses the contact’s number" value={orgForm.phone} onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })} onBlur={() => setOrgForm((current) => ({ ...current, phone: formatPhone(current.phone) }))} /></label>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className={label}>Plan
                            <select className={cls(field, "mt-1.5")} value={orgForm.membership_tier} onChange={(e) => setOrgForm({ ...orgForm, membership_tier: e.target.value })}>
                                <option value="">No plan</option>
                                {plans.map((p) => <option key={p.id} value={p.code}>{p.name}</option>)}
                            </select>
                        </label>
                        <label className={label}>Plan ends<input type="date" className={cls(field, "mt-1.5")} value={orgForm.membership_expiry_date} onChange={(e) => setOrgForm({ ...orgForm, membership_expiry_date: e.target.value })} /></label>
                    </div>
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[14px] bg-[#F7F7F7] px-4 py-3">
                        <span className="text-[14px]">Plan is active<span className="block text-[12px] text-[#888]">Turn off to pause their services.</span></span>
                        <input type="checkbox" checked={orgForm.membership_is_active} onChange={(e) => setOrgForm({ ...orgForm, membership_is_active: e.target.checked })} className="h-5 w-5 accent-[#1111F6]" />
                    </label>
                </div>
                <DialogFooter>
                    <button type="button" onClick={() => setOrgFormOpen(false)} className={quietBtn}>Cancel</button>
                    <button type="button" onClick={saveOrg} disabled={savingOrg} className={primaryBtn}>{savingOrg && <Loader2 className="h-4 w-4 animate-spin" />}{orgForm.id ? "Save" : "Add organization"}</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* New invoice */}
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
            <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-h-[90dvh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New invoice</DialogTitle>
                    <DialogDescription>For {selected?.business_name || selected?.full_name}. Dated today.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {invoiceForm.items.map((item, idx) => (
                            <div key={idx} className="flex items-end gap-2">
                                <label className={cls(label, "flex-1")}>{idx === 0 && "Item"}<input className={cls(field, idx === 0 && "mt-1.5")} placeholder="Description" value={item.description} onChange={(e) => setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.map((it, i) => i === idx ? { ...it, description: e.target.value } : it) })} /></label>
                                <label className={cls(label, "w-28")}>{idx === 0 && "Price (GHS)"}<input type="number" min={0} className={cls(field, idx === 0 && "mt-1.5")} value={item.unit_price || ""} placeholder="0" onChange={(e) => setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.map((it, i) => i === idx ? { ...it, unit_price: parseFloat(e.target.value) || 0 } : it) })} /></label>
                                {invoiceForm.items.length > 1 && <button type="button" aria-label="Remove item" onClick={() => setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, i) => i !== idx) })} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#888] hover:bg-[#FFF0EF] hover:text-[#AA3333]"><X className="h-4 w-4" /></button>}
                            </div>
                        ))}
                        <button type="button" onClick={() => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { description: "", quantity: 1, unit_price: 0 }] })} className="w-fit text-[13px] text-[#1111F6]">+ Add another item</button>
                    </div>
                    <label className={label}>Due<input type="date" className={cls(field, "mt-1.5")} value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })} /></label>
                    <label className={label}>Notes <span className="text-[#AAA]">(optional)</span><textarea className={cls(field, "mt-1.5 h-20 py-2.5")} placeholder="Payment instructions or details" value={invoiceForm.notes} onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} /></label>
                    <div className="flex items-center justify-between rounded-[14px] bg-[#F7F7F7] px-4 py-3"><span className="text-[14px] text-[#555]">Total</span><span className="text-[20px] tracking-[-0.02em]">{ghs(invoiceTotal)}</span></div>
                </div>
                <DialogFooter>
                    <button type="button" onClick={() => setInvoiceOpen(false)} className={quietBtn}>Cancel</button>
                    <button type="button" onClick={saveInvoice} disabled={invoiceTotal <= 0} className={primaryBtn}>Create invoice</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Fleet report */}
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-md">
                <DialogHeader>
                    <DialogTitle>Fleet report</DialogTitle>
                    <DialogDescription>A PDF for {selected?.business_name || selected?.full_name} to keep or share.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <label className={label}>From<input type="date" className={cls(field, "mt-1.5")} value={reportForm.startDate} onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })} /></label>
                        <label className={label}>To<input type="date" className={cls(field, "mt-1.5")} value={reportForm.endDate} onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })} /></label>
                    </div>
                    <div className="overflow-hidden rounded-[14px] border border-[#EAEAEA]">
                        {([["includeServices", "Services", "Maintenance and repairs in this period"], ["includeCompliance", "Papers", "Insurance and roadworthy status"], ["includeFleetStats", "Fleet summary", "Vehicles, drivers and use"]] as const).map(([key, title, hint], index) => (
                            <label key={key} className={cls("flex cursor-pointer items-center gap-3 px-4 py-3", index > 0 && "border-t border-[#F0F0F0]")}>
                                <input type="checkbox" checked={reportForm[key]} onChange={(e) => setReportForm({ ...reportForm, [key]: e.target.checked })} className="h-4 w-4 accent-[#1111F6]" />
                                <span className="text-[14px]">{title}<span className="block text-[12px] text-[#888]">{hint}</span></span>
                            </label>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <button type="button" onClick={() => setReportOpen(false)} className={quietBtn}>Cancel</button>
                    <button type="button" onClick={downloadReport} className={primaryBtn}><Download className="h-4 w-4" />Download PDF</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Record a payment */}
        <Dialog open={!!payInvoice} onOpenChange={(open) => !open && setPayInvoice(null)}>
            <DialogContent className="admin-theme base-landing text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em] max-w-sm">
                <DialogHeader>
                    <DialogTitle>Record a payment</DialogTitle>
                    <DialogDescription>Invoice {payInvoice?.invoice_number}. {payInvoice && ghs(payInvoice.total_amount - payInvoice.paid_amount)} still owed.</DialogDescription>
                </DialogHeader>
                <label className={label}>Amount received (GHS)<input type="number" min={0} className={cls(field, "mt-1.5 text-[18px]")} value={paymentAmount || ""} onChange={(e) => setPaymentAmount(Number(e.target.value))} /></label>
                <DialogFooter>
                    <button type="button" onClick={() => setPayInvoice(null)} className={quietBtn}>Cancel</button>
                    <button type="button" onClick={savePayment} disabled={paymentAmount <= 0} className={primaryBtn}>Record payment</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>;

    // ── One organization ──
    if (selected) {
        const contact = contactFor(selected);
        const orgVehicles = vehiclesFor(selected);
        const orgInvoices = invoicesFor(selected);
        const balance = balanceFor(selected);
        const tabs: { key: Tab; label: string; count?: number }[] = [
            { key: "vehicles", label: "Vehicles", count: orgVehicles.length },
            { key: "drivers", label: "Drivers", count: drivers.length },
            { key: "invoices", label: "Invoices", count: orgInvoices.length },
            { key: "notes", label: "Notes", count: notes.length },
        ];
        return (
            <div className="flex flex-col gap-5 pb-8">
                <button type="button" onClick={() => setSelected(null)} className="inline-flex w-fit items-center gap-1.5 text-[14px] text-[#555] hover:text-[#1111F6]"><ArrowLeft className="h-4 w-4" />All organizations</button>

                <section className="rounded-[20px] border border-[#EAEAEA] bg-white p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3F3FF] text-[#1111F6]"><Building2 className="h-6 w-6" /></span>
                            <div className="min-w-0">
                                <h2 className="truncate text-[22px] tracking-[-0.03em]">{selected.business_name || selected.full_name}</h2>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[13px] text-[#777]">
                                    <span>{planName(selected.membership_tier)}</span>
                                    <span className={cls("rounded-full px-2 py-0.5 text-[12px]", selected.membership_is_active ? "bg-[#EAF7F0] text-[#197252]" : "bg-[#F2F2F2] text-[#666]")}>{selected.membership_is_active ? "Active" : "Paused"}</span>
                                    {selected.membership_expiry_date && <span>Ends {day(selected.membership_expiry_date)}</span>}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => openEditOrg(selected)} className={quietBtn}><Pencil className="h-4 w-4" />Edit</button>
                            <button type="button" onClick={() => setReportOpen(true)} className={quietBtn}><Download className="h-4 w-4" />Fleet report</button>
                            <button type="button" onClick={() => { setInvoiceForm({ due_date: isoDay(7), notes: "", items: [{ description: "Monthly membership", quantity: 1, unit_price: 0 }] }); setInvoiceOpen(true); }} className={primaryBtn}><Plus className="h-4 w-4" />New invoice</button>
                        </div>
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#F0F0F0] pt-5 text-[14px] lg:grid-cols-4">
                        <div><dt className="text-[13px] text-[#888]">Contact</dt><dd className="mt-0.5 truncate">{contact?.full_name || "Not set"}</dd><dd className="truncate text-[13px] text-[#777]">{formatPhone(contact?.phone || selected.phone) || "No phone"}</dd></div>
                        <div><dt className="text-[13px] text-[#888]">Owed</dt><dd className={cls("mt-0.5 text-[18px] tracking-[-0.02em]", balance > 0 && "text-[#AA3333]")}>{ghs(balance)}</dd></div>
                        <div><dt className="text-[13px] text-[#888]">Service spend</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">{loadingDetail ? "—" : ghs(spend.total_cost)}</dd></div>
                        <div><dt className="text-[13px] text-[#888]">Services logged</dt><dd className="mt-0.5 text-[18px] tracking-[-0.02em]">{loadingDetail ? "—" : spend.total_requests}</dd></div>
                    </dl>
                </section>

                <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                    <div className="flex gap-1 overflow-x-auto border-b border-[#F0F0F0] px-3 pt-3 sm:px-4">
                        {tabs.map((t) => (
                            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cls("-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 pb-3 pt-1 text-[14px] transition-colors", tab === t.key ? "border-[#1111F6] text-[#1111F6]" : "border-transparent text-[#777] hover:text-[#171717]")}>
                                {t.label}{t.count !== undefined && <span className="text-[#AAA]">{t.count}</span>}
                            </button>
                        ))}
                    </div>

                    {loadingDetail && tab !== "vehicles" && tab !== "invoices" ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#1111F6]" /></div> : <>
                        {tab === "vehicles" && (orgVehicles.length ? <ul className="divide-y divide-[#F0F0F0]">{orgVehicles.map((v) => {
                            const driver = drivers.find((d) => d.vehicle?.id === v.id);
                            return <li key={v.id}><Link href={`/admin/vehicles/${v.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAFA]">
                                <div className="min-w-0 flex-1"><p className="truncate text-[14px]">{[v.year, v.make, v.model].filter(Boolean).join(" ") || "Vehicle"}<span className="text-[#888]">{v.plate && ` · ${v.plate}`}</span></p><p className="truncate text-[13px] text-[#888]">{driver?.full_name ? `Driven by ${driver.full_name}` : "No driver assigned"}</p></div>
                                {v.nfc_serial_number && <span className="hidden rounded-full bg-[#EEEEFF] px-2.5 py-0.5 text-[12px] text-[#1111F6] sm:inline">Smart Card</span>}
                                <ChevronRight className="h-4 w-4 shrink-0 text-[#BBB]" />
                            </Link></li>;
                        })}</ul> : <Empty title="No vehicles yet" body="The contact person adds vehicles from the fleet app." />)}

                        {tab === "drivers" && (drivers.length ? <ul className="divide-y divide-[#F0F0F0]">{drivers.map((d) => (
                            <li key={d.id} className="flex items-center gap-3 px-5 py-3.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F3FF] text-[13px] text-[#1111F6]">{(d.full_name || "?").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}</span>
                                <div className="min-w-0 flex-1"><p className="truncate text-[14px]">{d.full_name || "Unnamed driver"}</p><p className="truncate text-[13px] text-[#888]">{formatPhone(d.phone) || "No phone"}</p></div>
                                <span className="truncate text-[13px] text-[#777]">{d.vehicle ? (d.vehicle.plate || [d.vehicle.make, d.vehicle.model].filter(Boolean).join(" ")) : "No vehicle"}</span>
                            </li>
                        ))}</ul> : <Empty title="No drivers yet" body="The contact person invites drivers from the fleet app." />)}

                        {tab === "invoices" && (orgInvoices.length ? <ul className="divide-y divide-[#F0F0F0]">{orgInvoices.map((inv) => {
                            const status = INVOICE_TONE[inv.status] || INVOICE_TONE.PENDING;
                            const due = inv.total_amount - inv.paid_amount;
                            return <li key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                                <div className="min-w-0 flex-1"><p className="text-[14px]"><span className="font-mono">{inv.invoice_number}</span> · {ghs(inv.total_amount)}</p><p className="text-[13px] text-[#888]" suppressHydrationWarning>Issued {day(inv.created_at || inv.issue_date)} · Due {day(inv.due_date)}{inv.paid_amount > 0 && inv.status !== "PAID" && ` · ${ghs(inv.paid_amount)} paid`}</p></div>
                                <span className={cls("rounded-full px-2.5 py-1 text-[12px]", status.tone)}>{status.label}</span>
                                {(inv.status === "PENDING" || inv.status === "OVERDUE") && <button type="button" onClick={() => { setPayInvoice(inv); setPaymentAmount(due); }} className="inline-flex h-8 items-center rounded-full border border-[#E3E3E3] px-3 text-[13px] hover:border-[#B8B8FF] hover:text-[#1111F6]">Record payment</button>}
                            </li>;
                        })}</ul> : <Empty title="No invoices yet" body="Create one with New invoice above." />)}

                        {tab === "notes" && <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1fr_320px]">
                            {notes.length ? <ul className="flex flex-col gap-3">{notes.map((note) => (
                                <li key={note.id} className="rounded-[14px] bg-[#F7F7F7] px-4 py-3">
                                    <p className="text-[12px] text-[#888]" suppressHydrationWarning>{note.category ? `${note.category.charAt(0)}${note.category.slice(1).toLowerCase()} · ` : ""}{day(note.created_at)}</p>
                                    <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed">{note.content}</p>
                                </li>
                            ))}</ul> : <p className="py-8 text-center text-[14px] text-[#888] lg:text-left">No notes yet. Keep a record of calls, agreements and issues here.</p>}
                            <div className="flex h-fit flex-col gap-3 rounded-[16px] border border-[#EAEAEA] p-4">
                                <p className="text-[14px]">Add a note</p>
                                <div className="flex gap-1.5">{["GENERAL", "BILLING", "FLEET"].map((cat) => <button key={cat} type="button" onClick={() => setNoteCategory(cat)} className={cls("h-8 flex-1 rounded-full text-[13px]", noteCategory === cat ? "bg-[#171717] text-white" : "bg-[#F2F2F2] text-[#555]")}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</button>)}</div>
                                <textarea className={cls(field, "h-28 py-2.5")} placeholder="What happened?" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
                                <button type="button" onClick={saveNote} disabled={!newNote.trim()} className={primaryBtn}>Save note</button>
                            </div>
                        </div>}
                    </>}
                </section>
                {dialogs}
            </div>
        );
    }

    // ── All organizations ──
    return (
        <div className="flex flex-col gap-5 pb-8">
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
                {[["Organizations", organizations.length.toLocaleString()], ["Fleet vehicles", fleetVehicleCount.toLocaleString()], ["Owed", ghs(totalOwed)]].map(([title, value]) => (
                    <div key={title} className="rounded-[16px] border border-[#EAEAEA] bg-white p-4 sm:p-5"><p className="truncate text-[22px] leading-none tracking-[-0.04em] sm:text-[28px]">{value}</p><p className="mt-2 text-[13px] text-[#777]">{title}</p></div>
                ))}
            </div>

            <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#F0F0F0] p-4 sm:flex-row sm:items-center sm:p-5">
                    <label className="relative block flex-1">
                        <span className="sr-only">Search organizations</span>
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
                        <input className={cls(field, "pl-10")} placeholder="Search by business, contact or phone" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </label>
                    <button type="button" onClick={openAddOrg} className={primaryBtn}><Plus className="h-4 w-4" />Add organization</button>
                </div>

                {filtered.length ? <ul className="divide-y divide-[#F0F0F0]">{filtered.map((org) => {
                    const contact = contactFor(org);
                    const balance = balanceFor(org);
                    const count = vehiclesFor(org).length;
                    return <li key={org.member_id || org.id}>
                        <button type="button" onClick={() => openOrg(org)} className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FAFAFA] sm:px-5">
                            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#F3F3FF] text-[#1111F6] sm:flex"><Building2 className="h-5 w-5" /></span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[15px]">{org.business_name || org.full_name}</p>
                                <p className="truncate text-[13px] text-[#888]">{contact?.full_name || "No contact"} · {count} {count === 1 ? "vehicle" : "vehicles"}</p>
                            </div>
                            <div className="hidden w-36 md:block"><p className="truncate text-[14px]">{planName(org.membership_tier)}</p><p className={cls("text-[13px]", org.membership_is_active ? "text-[#197252]" : "text-[#888]")}>{org.membership_is_active ? "Active" : "Paused"}</p></div>
                            <div className="w-24 text-right"><p className={cls("text-[14px]", balance > 0 ? "text-[#AA3333]" : "text-[#888]")}>{balance > 0 ? ghs(balance) : "Paid up"}</p>{balance > 0 && <p className="text-[12px] text-[#888]">owed</p>}</div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-[#BBB]" />
                        </button>
                    </li>;
                })}</ul> : <Empty title={organizations.length ? "No organizations match" : "No organizations yet"} body={organizations.length ? "Try another search." : "Add a business to manage its fleet, drivers and invoices."} />}
            </section>
            {dialogs}
        </div>
    );
}

function Empty({ title, body }: { title: string; body: string }) {
    return <div className="px-6 py-12 text-center"><p className="text-[15px]">{title}</p><p className="mt-1 text-[14px] text-[#888]">{body}</p></div>;
}
