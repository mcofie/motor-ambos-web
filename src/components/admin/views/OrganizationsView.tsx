"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    fetchOrgServiceAnalytics
} from "@/lib/supaFetch";
import {
    Building2,
    Users,
    Car,
    FileText,
    TrendingUp,
    Plus,
    Search,
    Loader2,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Wallet,
    Download,
    Eye,
    RefreshCw,
    User as UserIcon,
    X,
    Filter,
    Settings2,
    Calendar,
    ShieldCheck,
    BarChart3,
    HeartPulse,
    History,
    StickyNote,
    CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { cls, StatCard } from "../ui/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendFleetReport } from "@/lib/supaFetch";

export function OrganizationsView() {
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);
    const [allVehicles, setAllVehicles] = useState<VehicleRow[]>([]);
    const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrg, setSelectedOrg] = useState<MemberWithMembershipRow | null>(null);
    const [orgDrivers, setOrgDrivers] = useState<any[]>([]);
    const [loadingDrivers, setLoadingDrivers] = useState(false);
    const [plans, setPlans] = useState<MembershipPlanRow[]>([]);

    // Org Form Dialog
    const [isOrgFormOpen, setIsOrgFormOpen] = useState(false);
    const [orgForm, setOrgForm] = useState({
        id: "",
        business_name: "",
        full_name: "",
        email: "",
        phone: "",
        membership_tier: "",
        membership_expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        membership_is_active: true
    });

    // Invoice Dialog
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: "",
        items: [{ description: "Monthly Membership Subscription", quantity: 1, unit_price: 1500 }]
    });

    // Report Dialog
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        includeServices: true,
        includeCompliance: true,
        includeFleetStats: true
    });

    // New States for requested features
    const [activeTab, setActiveTab] = useState<'fleet' | 'billing' | 'notes' | 'analytics'>('fleet');
    const [orgNotes, setOrgNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState("");
    const [noteCategory, setNoteCategory] = useState("GENERAL");
    const [roiStats, setRoiStats] = useState({ total_requests: 0, total_cost: 0 });
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const organizations = useMemo(() =>
        members.filter(m => m.is_business && (m.business_name || m.full_name)),
        [members]);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const [mRes, vRes, iRes, pRes] = await Promise.all([
                listMembersWithMemberships(signal),
                listAllVehicles(signal),
                listInvoices(undefined, signal),
                listMembershipPlans(signal)
            ]);
            setMembers(mRes || []);
            setAllVehicles(vRes || []);
            setInvoices(iRes || []);
            setPlans(pRes || []);
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            toast.error("Failed to load organizations");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const handleOrgClick = async (org: MemberWithMembershipRow) => {
        setSelectedOrg(org);
        setLoadingDrivers(true);
        setActiveTab('fleet');
        try {
            const [drivers, notes, analytics] = await Promise.all([
                listOrgDrivers(org.member_id),
                listOrgNotes(org.member_id),
                fetchOrgServiceAnalytics(org.member_id)
            ]);
            setOrgDrivers(drivers || []);
            setOrgNotes(notes || []);
            setRoiStats(analytics);
        } catch (e) {
            toast.error("Failed to load organization details");
        } finally {
            setLoadingDrivers(false);
        }
    };

    const handleAddNote = async () => {
        if (!selectedOrg || !newNote.trim()) return;
        try {
            await addOrgNote(selectedOrg.member_id, newNote, noteCategory);
            setNewNote("");
            const notes = await listOrgNotes(selectedOrg.member_id);
            setOrgNotes(notes);
            toast.success("Note added");
        } catch (e) {
            toast.error("Failed to add note");
        }
    };

    const handleRecordPayment = async () => {
        if (!selectedInvoice) return;
        try {
            await recordInvoicePayment(selectedInvoice.id, paymentAmount);
            toast.success("Payment recorded");
            setIsPaymentOpen(false);
            fetchData();
            if (selectedOrg) {
                const iRes = await listInvoices(selectedOrg.member_id);
                setInvoices((prev) => prev.map(inv => {
                    const match = iRes.find(r => r.id === inv.id);
                    return match || inv;
                }));
            }
        } catch (e) {
            toast.error("Failed to record payment");
        }
    };

    const handleCreateInvoice = async () => {
        if (!selectedOrg) return;
        const total = invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

        try {
            await createInvoice({
                org_id: selectedOrg.member_id,
                due_date: invoiceForm.due_date,
                total_amount: total,
                notes: invoiceForm.notes,
                items: invoiceForm.items
            });
            toast.success("Invoice created successfully");
            setIsInvoiceOpen(false);
            fetchData();
        } catch (e: any) {
            toast.error(e.message || "Failed to create invoice");
        }
    };

    const handleSendReport = async () => {
        if (!selectedOrg) return;
        const tid = toast.loading("Generating fleet report PDF...");
        try {
            const blob = await sendFleetReport(selectedOrg.member_id, {
                startDate: reportForm.startDate,
                endDate: reportForm.endDate,
                includeServices: reportForm.includeServices,
                includeCompliance: reportForm.includeCompliance,
                includeFleetStats: reportForm.includeFleetStats
            });

            // Download the PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Fleet_Report_${selectedOrg.business_name || selectedOrg.full_name}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success("Fleet report generated successfully", { id: tid });
            setIsReportOpen(false);
        } catch (e: any) {
            toast.error(e.message || "Failed to generate report", { id: tid });
        }
    };

    const handleOrgSubmit = async () => {
        const tid = toast.loading("Saving organization...");
        try {
            await upsertOrganization({
                id: orgForm.id || undefined,
                business_name: orgForm.business_name,
                full_name: orgForm.full_name,
                email: orgForm.email,
                phone: orgForm.phone,
                membership_tier: orgForm.membership_tier,
                membership_expiry_date: orgForm.membership_expiry_date,
                membership_is_active: orgForm.membership_is_active
            });
            toast.success("Organization saved successfully", { id: tid });
            setIsOrgFormOpen(false);
            fetchData();
        } catch (e: any) {
            toast.error(e.message || "Failed to save organization", { id: tid });
        }
    };

    const openAddOrg = () => {
        setOrgForm({
            id: "",
            business_name: "",
            full_name: "",
            email: "",
            phone: "",
            membership_tier: plans[0]?.code || "",
            membership_expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            membership_is_active: true
        });
        setIsOrgFormOpen(true);
    };

    const openEditOrg = (org: MemberWithMembershipRow) => {
        setOrgForm({
            id: org.member_id || org.id || "",
            business_name: org.business_name || "",
            full_name: org.full_name || "",
            email: org.email || "",
            phone: org.phone || "",
            membership_tier: org.membership_tier || org.tier || "",
            membership_expiry_date: (org.membership_expiry_date || "").split('T')[0],
            membership_is_active: org.membership_is_active ?? true
        });
        setIsOrgFormOpen(true);
    };

    const stats = useMemo(() => {
        const outstanding = invoices
            .filter(i => i.status === 'PENDING' || i.status === 'OVERDUE')
            .reduce((sum, i) => sum + (i.total_amount - i.paid_amount), 0);

        return {
            totalOrgs: organizations.length,
            totalFleet: allVehicles.filter(v => organizations.some(o => o.member_id === v.user_id)).length,
            outstandingAmount: outstanding
        };
    }, [organizations, allVehicles, invoices]);

    const filteredOrgs = organizations.filter(org => {
        const q = searchQuery.toLowerCase();
        return (org.business_name || org.full_name || "").toLowerCase().includes(q) ||
            (org.email || "").toLowerCase().includes(q) ||
            (org.phone || "").toLowerCase().includes(q);
    });

    if (loading && members.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in duration-700">
            {/* Summary Stats - Synchronized with Memberships Look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Organizations" value={stats.totalOrgs} icon={Building2} color="bg-indigo-500" />
                <StatCard title="Active FleetUnits" value={stats.totalFleet} icon={Car} color="bg-emerald-500" />
                <StatCard title="Outstanding Balances" value={`GHS ${stats.outstandingAmount.toLocaleString()}`} icon={Wallet} color="bg-slate-500" />
            </div>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {!selectedOrg ? (
                    <>
                        {/* Toolbar - Matching MembershipsView */}
                        <div className="p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-card">
                            <div className="flex bg-muted/30 p-1 rounded-lg">
                                {([
                                    { label: 'All', value: 'ALL' },
                                    { label: 'Standard', value: 'Standard' },
                                    { label: 'Enterprise', value: 'Enterprise' }
                                ] as const).map(tab => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setSearchQuery(tab.value === 'ALL' ? '' : tab.value)}
                                        className={cls(
                                            "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                                            (tab.value === 'ALL' && !searchQuery) || searchQuery === tab.value
                                                ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 w-full md:w-auto relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                                    placeholder="Search organizations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => fetchData()}>
                                    <RefreshCw className={cls("h-3.5 w-3.5 mr-2", loading && "animate-spin")} />
                                    Sync
                                </Button>
                                <Button size="sm" onClick={openAddOrg} className="shadow-sm">
                                    <Plus className="h-4 w-4 mr-1" /> Add Business
                                </Button>
                            </div>
                        </div>

                        {/* Table List - Matching MembershipsView table style */}
                        <div className="flex-1 overflow-auto relative bg-muted/20">
                            {loading && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}

                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="px-6 py-4">Organization</th>
                                        <th className="px-6 py-4">Units & Tier</th>
                                        <th className="px-6 py-4">Financial Status</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {filteredOrgs.map(org => {
                                        const orgInvoices = invoices.filter(i => i.org_id === org.member_id);
                                        const balance = orgInvoices
                                            .filter(i => i.status === 'PENDING' || i.status === 'OVERDUE')
                                            .reduce((sum, i) => sum + (i.total_amount - i.paid_amount), 0);

                                        return (
                                            <tr
                                                key={org.member_id || org.id}
                                                className="hover:bg-muted/50 transition-colors group cursor-pointer"
                                                onClick={() => handleOrgClick(org)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                            <Building2 className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 uppercase italic">
                                                                {org.business_name || org.full_name}
                                                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                                #{org.membership_number?.slice(0, 10) || "PENDING"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                            <Car className="h-3 w-3 text-slate-400" />
                                                            {orgDrivers.length} managed slots
                                                        </div>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase border border-indigo-100">
                                                            {org.membership_tier || "Standard"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className={cls(
                                                            "text-sm font-black text-rose-600",
                                                            balance === 0 && "text-emerald-600"
                                                        )}>
                                                            GHS {balance.toLocaleString()}
                                                        </div>
                                                        <span className={cls(
                                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                                            org.membership_is_active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-muted text-muted-foreground border border-border"
                                                        )}>
                                                            {org.membership_is_active ? "Active Subscription" : "Inactive"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                                    <div className="font-medium text-foreground">{org.phone}</div>
                                                    <div className="opacity-70">{org.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditOrg(org); }}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
                                                    >
                                                        <Settings2 className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Detail View Container - Replaces list when org selected */}
                        <div className="flex-1 flex flex-col h-full bg-card min-h-0">
                            {/* Detail Header - Profile Style like Memberships */}
                            <div className="p-6 md:p-8 border-b border-border bg-card">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <button
                                            onClick={() => setSelectedOrg(null)}
                                            className="p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors group"
                                            title="Back to Registry"
                                        >
                                            <ChevronRight className="h-5 w-5 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                                <Building2 className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-2xl font-black text-foreground tracking-tight uppercase italic truncate max-w-[300px] sm:max-w-none">
                                                        {selectedOrg.business_name || selectedOrg.full_name}
                                                    </h2>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                                                        #{selectedOrg.membership_number}
                                                    </span>
                                                    <span className="h-1 w-1 rounded-full bg-border" />
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                                                        {selectedOrg.membership_tier || "Standard"} Member
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="icon" onClick={() => setIsReportOpen(true)} className="rounded-xl h-11 w-11">
                                            <Download className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                        <Button onClick={() => setIsInvoiceOpen(true)} className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                            <Plus className="h-5 w-5 mr-2" /> New Invoice
                                        </Button>
                                    </div>
                                </div>

                                {/* Dashboard Navigation Tabs - Matching Membership Detail */}
                                <div className="mt-8 overflow-x-auto pb-1 scrollbar-hide">
                                    <div className="p-1 gap-1 flex bg-muted/30 rounded-2xl border border-border/50 w-max min-w-full lg:min-w-0">
                                        {[
                                            { id: 'fleet', label: 'Fleet Health', icon: HeartPulse },
                                            { id: 'billing', label: 'Billing Center', icon: Wallet },
                                            { id: 'notes', label: 'Timeline', icon: StickyNote },
                                            { id: 'analytics', label: 'ROI Analytics', icon: BarChart3 },
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as any)}
                                                className={cls(
                                                    "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                                    activeTab === tab.id
                                                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-border"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                                                )}
                                            >
                                                <tab.icon className={cls("h-4 w-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto bg-muted/5 p-6">
                                <div className="max-w-7xl mx-auto">
                                    {activeTab === 'fleet' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {orgDrivers.map((driver: any) => (
                                                <div key={driver.id} className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                            <UserIcon className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-foreground uppercase italic">{driver.full_name}</div>
                                                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{driver.phone}</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                                            <div className="text-[9px] font-black text-muted-foreground uppercase mb-1">Vehicle Info</div>
                                                            <div className="text-xs font-bold text-foreground">{driver.vehicle_reg || "NO VEHICLE"}</div>
                                                        </div>
                                                        <div className="p-3 rounded-xl bg-muted/30 border border-border">
                                                            <div className="text-[9px] font-black text-muted-foreground uppercase mb-1">Status</div>
                                                            <div className="text-xs font-black text-emerald-600">VERIFIED</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {orgDrivers.length === 0 && (
                                                <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/20">
                                                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Users className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <h3 className="font-black text-foreground uppercase tracking-tight">No Active Drivers</h3>
                                                    <p className="text-xs text-muted-foreground mt-1">This organization does not have any drivers registered yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'billing' && (
                                        <div className="space-y-6">
                                            <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-sm">
                                                <div className="px-8 py-6 border-b border-border bg-muted/30 flex items-center justify-between">
                                                    <h3 className="font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                                                        <Wallet className="h-5 w-5 text-indigo-500" />
                                                        Invoice History
                                                    </h3>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-border">
                                                        {invoices.filter(i => i.org_id === selectedOrg.member_id).length} Records Foundations
                                                    </span>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="bg-muted/10 text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                                                                <th className="px-8 py-4">Invoice #</th>
                                                                <th className="px-8 py-4">Date</th>
                                                                <th className="px-8 py-4">Amount</th>
                                                                <th className="px-8 py-4">Status</th>
                                                                <th className="px-8 py-4 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border">
                                                            {invoices.filter(i => i.org_id === selectedOrg.member_id).map(inv => (
                                                                <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                                                                    <td className="px-8 py-5">
                                                                        <div className="font-black text-foreground text-sm font-mono tracking-tighter">#{inv.invoice_number}</div>
                                                                    </td>
                                                                    <td className="px-8 py-5">
                                                                        <div className="text-xs font-bold text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</div>
                                                                    </td>
                                                                    <td className="px-8 py-5">
                                                                        <div className="text-sm font-black text-foreground italic">GHS {inv.total_amount.toLocaleString()}</div>
                                                                        <div className="text-[10px] text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</div>
                                                                    </td>
                                                                    <td className="px-8 py-5">
                                                                        <span className={cls(
                                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase border",
                                                                            inv.status === 'PAID' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                                inv.status === 'OVERDUE' ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse" :
                                                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                                        )}>
                                                                            {inv.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-8 py-5 text-right">
                                                                        {inv.status !== 'PAID' && (
                                                                            <Button
                                                                                onClick={() => { setSelectedInvoice(inv); setIsPaymentOpen(true); }}
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="rounded-xl font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                                                            >
                                                                                Record Payment
                                                                            </Button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-4">
                                                {orgNotes.map((note) => (
                                                    <div key={note.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                                                                {note.category}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                {new Date(note.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-foreground leading-relaxed font-medium">{note.content}</p>
                                                    </div>
                                                ))}
                                                {orgNotes.length === 0 && (
                                                    <div className="py-20 text-center border-2 border-dashed border-border rounded-[32px] bg-muted/20">
                                                        <StickyNote className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                                        <h3 className="font-black text-muted-foreground uppercase tracking-tight">Timeline Empty</h3>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="lg:col-span-1">
                                                <div className="bg-card rounded-3xl p-6 border border-border shadow-xl sticky top-6">
                                                    <h3 className="font-black text-foreground uppercase tracking-tight mb-6 flex items-center gap-2">
                                                        <Plus className="h-5 w-5 text-primary" />
                                                        Add Entry
                                                    </h3>
                                                    <div className="space-y-5">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-muted-foreground">Category</label>
                                                            <div className="flex gap-2">
                                                                {['GENERAL', 'BILLING', 'FLEET'].map(cat => (
                                                                    <button
                                                                        key={cat}
                                                                        onClick={() => setNoteCategory(cat)}
                                                                        className={cls(
                                                                            "flex-1 py-2 text-[10px] font-black rounded-xl border transition-all",
                                                                            noteCategory === cat ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-muted/30 border-border text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {cat}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase text-muted-foreground">Interaction Record</label>
                                                            <Textarea
                                                                value={newNote}
                                                                onChange={e => setNewNote(e.target.value)}
                                                                placeholder="Type any updates or audit notes..."
                                                                className="min-h-[140px] rounded-2xl bg-muted/20 border-border text-sm resize-none focus:ring-2 focus:ring-primary/20"
                                                            />
                                                        </div>
                                                        <Button onClick={handleAddNote} className="w-full rounded-2xl h-12 font-black shadow-lg shadow-primary/20">
                                                            Save Record
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'analytics' && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm flex flex-col justify-between overflow-hidden relative group">
                                                    <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                                    <div>
                                                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
                                                            <TrendingUp className="h-7 w-7" />
                                                        </div>
                                                        <div className="text-3xl font-black text-foreground italic">GHS {roiStats.total_cost.toLocaleString()}</div>
                                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Total Service Expenditure</div>
                                                    </div>
                                                    <div className="mt-8 pt-8 border-t border-dashed border-border">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] font-black text-muted-foreground uppercase">Budget Optimization</span>
                                                            <span className="text-xs font-black text-indigo-600">80% Efficiency</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]" style={{ width: '80%' }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm flex flex-col justify-between overflow-hidden relative group">
                                                    <div className="absolute right-0 top-0 h-32 w-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                                    <div>
                                                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100">
                                                            <Users className="h-7 w-7" />
                                                        </div>
                                                        <div className="text-3xl font-black text-foreground italic">{roiStats.total_requests} Request Units</div>
                                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Fleet Service Volume</div>
                                                    </div>
                                                    <div className="mt-8 pt-8 border-t border-dashed border-border">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-[10px] font-black text-muted-foreground uppercase">Service Satisfaction</span>
                                                            <span className="text-xs font-black text-emerald-600">94.2% Rating</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: '80%' }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6 rounded-2xl border border-dashed border-border bg-muted/10 flex items-center gap-5 group">
                                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                                        <History className="h-7 w-7" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-black text-foreground uppercase tracking-tight">Utilization Metric</div>
                                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">The organization is utilizing <span className="text-foreground font-black font-mono">{Math.round((roiStats.total_requests / (orgDrivers.length || 1)) * 10) / 10}</span> services per driver per period.</p>
                                                    </div>
                                                    <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* CREATE INVOICE DIALOG */}
            <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create Invoice</DialogTitle>
                        <DialogDescription>
                            Generate a formal invoice for {selectedOrg?.business_name || selectedOrg?.full_name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4 border-y border-border my-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Issue Date</label>
                                <Input type="date" value={new Date().toISOString().split('T')[0]} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Due Date</label>
                                <Input
                                    type="date"
                                    value={invoiceForm.due_date}
                                    onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Line Items</label>
                            {invoiceForm.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-1.5">
                                        <span className="text-[10px] text-muted-foreground font-bold">Description</span>
                                        <Input
                                            value={item.description}
                                            onChange={e => {
                                                const newItems = [...invoiceForm.items];
                                                newItems[idx].description = e.target.value;
                                                setInvoiceForm({ ...invoiceForm, items: newItems });
                                            }}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="w-24 space-y-1.5">
                                        <span className="text-[10px] text-muted-foreground font-bold">Price</span>
                                        <Input
                                            type="number"
                                            value={item.unit_price}
                                            onChange={e => {
                                                const newItems = [...invoiceForm.items];
                                                newItems[idx].unit_price = parseFloat(e.target.value) || 0;
                                                setInvoiceForm({ ...invoiceForm, items: newItems });
                                            }}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            const newItems = invoiceForm.items.filter((_, i) => i !== idx);
                                            setInvoiceForm({ ...invoiceForm, items: newItems });
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { description: "", quantity: 1, unit_price: 0 }] })}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Item
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Internal Notes</label>
                            <Textarea
                                placeholder="Add any details or payment instructions..."
                                value={invoiceForm.notes}
                                onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                                className="h-20 text-sm"
                            />
                        </div>

                        <div className="bg-muted/50 p-4 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground">Total Amount</span>
                            <span className="text-xl font-black text-foreground">
                                GHS {invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateInvoice}>Create & Send Invoice</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* GENERATE REPORT DIALOG */}
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate Fleet Report</DialogTitle>
                        <DialogDescription>
                            Create a detailed audit report for {selectedOrg?.business_name || selectedOrg?.full_name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4 border-y border-border my-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Period Start</label>
                                <Input
                                    type="date"
                                    value={reportForm.startDate}
                                    onChange={e => setReportForm({ ...reportForm, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Period End</label>
                                <Input
                                    type="date"
                                    value={reportForm.endDate}
                                    onChange={e => setReportForm({ ...reportForm, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Inclusions</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={reportForm.includeServices}
                                        onChange={e => setReportForm({ ...reportForm, includeServices: e.target.checked })}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <span>Service Logs</span>
                                        <p className="text-[10px] text-muted-foreground font-normal">Detailed maintenance and repair history</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={reportForm.includeCompliance}
                                        onChange={e => setReportForm({ ...reportForm, includeCompliance: e.target.checked })}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <span>Compliance Status</span>
                                        <p className="text-[10px] text-muted-foreground font-normal">Insurance and roadworthy verification</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={reportForm.includeFleetStats}
                                        onChange={e => setReportForm({ ...reportForm, includeFleetStats: e.target.checked })}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <span>Fleet Analytics</span>
                                        <p className="text-[10px] text-muted-foreground font-normal">Utilization summary and metrics</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReportOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendReport}>
                            <Download className="h-4 w-4 mr-2" /> Generate PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ORGANIZATION FORM DIALOG */}
            <Dialog open={isOrgFormOpen} onOpenChange={setIsOrgFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{orgForm.id ? "Edit Organization" : "Register New Business"}</DialogTitle>
                        <DialogDescription>
                            Manage business profile and membership subscriptions.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Business Details</h4>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Business Name</label>
                                <Input
                                    placeholder="Enter company name"
                                    value={orgForm.business_name}
                                    onChange={e => setOrgForm({ ...orgForm, business_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Contact Person</label>
                                <Input
                                    placeholder="Full name"
                                    value={orgForm.full_name}
                                    onChange={e => setOrgForm({ ...orgForm, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="email@company.com"
                                    value={orgForm.email}
                                    onChange={e => setOrgForm({ ...orgForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Phone Number</label>
                                <Input
                                    placeholder="+233..."
                                    value={orgForm.phone}
                                    onChange={e => setOrgForm({ ...orgForm, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Subscription & Status</h4>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Membership Plan</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={orgForm.membership_tier}
                                    onChange={e => setOrgForm({ ...orgForm, membership_tier: e.target.value })}
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.code}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">Expiry Date</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={orgForm.membership_expiry_date}
                                        onChange={e => setOrgForm({ ...orgForm, membership_expiry_date: e.target.value })}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 cursor-pointer group hover:border-primary/30 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={orgForm.membership_is_active}
                                        onChange={e => setOrgForm({ ...orgForm, membership_is_active: e.target.checked })}
                                        className="h-5 w-5 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-bold flex items-center gap-2">
                                            Active Membership
                                            {orgForm.membership_is_active && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Toggle to enable or disable member services.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 pt-4 border-t border-border">
                        <Button variant="outline" onClick={() => setIsOrgFormOpen(false)}>Cancel</Button>
                        <Button onClick={handleOrgSubmit} className="min-w-[140px]">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (orgForm.id ? "Save Changes" : "Create Organization")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* RECORD PAYMENT DIALOG */}
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                        <DialogDescription>
                            Enter the amount paid for invoice {selectedInvoice?.invoice_number}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border">
                            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1">
                                <span>Total Amount</span>
                                <span>GHS {selectedInvoice?.total_amount?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black text-foreground">
                                <span>Outstanding</span>
                                <span>GHS {(selectedInvoice ? selectedInvoice.total_amount - selectedInvoice.paid_amount : 0).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground">Amount Received (GHS)</label>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(Number(e.target.value))}
                                className="text-lg font-black h-12"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancel</Button>
                        <Button onClick={handleRecordPayment} disabled={paymentAmount <= 0}>
                            Record Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
