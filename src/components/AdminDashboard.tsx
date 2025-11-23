// src/components/AdminDashboard.tsx
"use client";

import React, {useState, useEffect, useCallback} from "react";
import {
    getUser,
    logout,
    listProviders,
    insertProvider,
    updateProvider,
    deleteProvider,
    listRequests,
    listServices,
    setProviderServices,
    getProviderServiceIds,
    updateRequestStatus,
    listProviderRates,
    upsertProviderRates,
} from "@/lib/supaFetch";

import {
    Wrench,
    LifeBuoy,
    User as UserIcon,
    ShieldCheck,
    RefreshCw,
    LogOut,
    Search,
    Plus,
    Save,
    Trash2,
    Edit2,
    Loader2,
    XCircle,
} from "lucide-react";

/* ---------------- Types ---------------- */
type UUID = string;

export interface ProviderRow {
    id: UUID;
    display_name: string;
    phone_business: string | null;
    about: string | null;
    address_line: string | null;
    is_active: boolean;
    coverage_radius_km: number | null;
    callout_fee: number | null;
    lng?: number | null;
    lat?: number | null;
    created_at?: string;
    updated_at?: string;
    is_verified?: boolean | null;
}

export interface ServiceRow {
    id: UUID;
    name: string;
    code?: string | null;
}

export interface RequestRow {
    id: UUID;
    created_at: string;
    service_id: UUID | null;
    status: string | null;
    driver_name: string | null;
    driver_phone?: string | null;
    provider_id: UUID | null;
    details?: string | null;
    address_line?: string | null;
    location?: unknown;
}

type RequestStatus =
    | "pending"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

interface ProviderRateRow {
    service_id: UUID;
    base_price: number | null;
    price_unit: string | null;
}

interface User {
    id: UUID;
    email: string;
}

/* --------------- UI Components --------------- */

const cls = (...arr: Array<string | false | null | undefined>) =>
    arr.filter(Boolean).join(" ");

// Modern Input Field
function TextField({
                       label,
                       value,
                       onChange,
                       type = "text",
                       placeholder,
                       required,
                       className,
                   }: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}) {
    return (
        <div className={cls("space-y-1.5", className)}>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

// Modern Toggle Switch
const Toggle = ({
                    label,
                    checked,
                    onChange,
                }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300"
    >
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span
            className={cls(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-indigo-600" : "bg-slate-200"
            )}
        >
      <span
          aria-hidden="true"
          className={cls(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-4" : "translate-x-0"
          )}
      />
    </span>
    </button>
);

// Modern Status Badge
function StatusBadge({status}: { status: string }) {
    const s = (status || "pending") as RequestStatus;
    const styles = {
        pending: "bg-amber-50 text-amber-700 border-amber-200",
        accepted: "bg-blue-50 text-blue-700 border-blue-200",
        in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
        completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <span
            className={cls("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", styles[s] || styles.pending)}>
      {s.replace('_', ' ')}
    </span>
    );
}

/* ---------------- Sub-Panels ---------------- */

// Define form state type explicitly to avoid 'any'
type ProviderFormState = {
    id: UUID | null;
    display_name: string;
    phone_business: string;
    about: string;
    address_line: string;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    lng: string | number | null;
    lat: string | number | null;
    is_verified: boolean;
};

// Providers Panel
// Providers Panel
function ProvidersPanel() {
    const emptyForm: ProviderFormState = {
        id: null,
        display_name: "",
        phone_business: "",
        about: "",
        address_line: "",
        is_active: true,
        coverage_radius_km: 10,
        callout_fee: 0,
        lng: "",
        lat: "",
        is_verified: false,
    };

    const [form, setForm] = useState<ProviderFormState>({...emptyForm});
    const [list, setList] = useState<ProviderRow[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Services state
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<UUID[]>([]);
    const [serviceRates, setServiceRates] = useState<Record<UUID, { base_price: string; price_unit: string }>>({});

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listProviders(q);
            setList(data as ProviderRow[]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [q]);

    useEffect(() => {
        fetchProviders();
        listServices().then((res) => setServices(res as ServiceRow[]));
    }, [fetchProviders]);

    const handleSave = async () => {
        try {
            const payload = {
                ...form,
                coverage_radius_km: Number(form.coverage_radius_km),
                callout_fee: Number(form.callout_fee),
                lng: form.lng ? Number(form.lng) : null,
                lat: form.lat ? Number(form.lat) : null,
            };

            let providerId = form.id;

            if (form.id) {
                await updateProvider(form.id, payload);
            } else {
                const res = await insertProvider(payload);
                if (res) providerId = res.id;
            }

            // Save services
            if (providerId) {
                await setProviderServices(providerId, selectedServiceIds);

                const rates = services
                    .filter(s => selectedServiceIds.includes(s.id))
                    .map(s => ({
                        service_id: s.id,
                        base_price: Number(serviceRates[s.id]?.base_price || 0),
                        price_unit: serviceRates[s.id]?.price_unit || 'job',
                        // FIX: Explicitly adding the missing property
                        min_callout_fee: null,
                        is_active: true
                    }));

                if (rates.length) await upsertProviderRates(providerId, rates);
            }

            setIsSidebarOpen(false);
            fetchProviders();
            setForm({...emptyForm});
        } catch (err) {
            console.error(err);
            alert("Failed to save provider");
        }
    };

    const handleEdit = async (row: ProviderRow) => {
        setForm({
            ...row,
            phone_business: row.phone_business || "",
            about: row.about || "",
            address_line: row.address_line || "",
            is_verified: !!row.is_verified,
            coverage_radius_km: row.coverage_radius_km ?? 10,
            callout_fee: row.callout_fee ?? 0,
            lng: row.lng || "",
            lat: row.lat || "",
        });

        // Load services
        const ids = await getProviderServiceIds(row.id);
        setSelectedServiceIds(ids as UUID[]);

        const rates = await listProviderRates(row.id) as ProviderRateRow[];
        const rateMap: Record<UUID, { base_price: string; price_unit: string }> = {};
        rates.forEach(r => {
            rateMap[r.service_id] = {
                base_price: String(r.base_price || 0),
                price_unit: r.price_unit || ''
            };
        });
        setServiceRates(rateMap);

        setIsSidebarOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this provider?")) return;
        try {
            await deleteProvider(id);
            fetchProviders();
        } catch (e) {
            console.error(e);
            alert("Failed to delete provider");
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* List View */}
            <div
                className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            placeholder="Search providers..."
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setForm(emptyForm);
                            setIsSidebarOpen(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="h-4 w-4"/>
                        Add Provider
                    </button>
                </div>

                <div className="flex-1 overflow-auto relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
                        </div>
                    )}
                    <table className="w-full text-left text-sm">
                        <thead
                            className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Provider</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {list.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{row.display_name}</div>
                                    <div className="text-xs text-slate-500">{row.phone_business || 'No phone'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cls("h-2 w-2 rounded-full", row.is_active ? "bg-emerald-500" : "bg-slate-300")}/>
                                        <span className="text-slate-600">{row.is_active ? 'Active' : 'Inactive'}</span>
                                        {row.is_verified && <ShieldCheck className="h-4 w-4 text-blue-500 ml-1"/>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">
                                    {row.address_line || '—'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div
                                        className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(row)}
                                                className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                title="Edit">
                                            <Edit2 className="h-4 w-4"/>
                                        </button>
                                        <button onClick={() => handleDelete(row.id)}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                title="Delete">
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {list.length === 0 && !loading && (
                        <div className="p-12 text-center text-slate-500">No providers found.</div>
                    )}
                </div>
            </div>

            {/* Edit/Create Sidebar (Slide-over) */}
            {isSidebarOpen && (
                <div
                    className="w-96 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 fixed right-6 top-24 bottom-6 z-50 md:relative md:top-0 md:bottom-0 md:right-0 md:z-0">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-semibold text-slate-900">{form.id ? 'Edit Provider' : 'New Provider'}</h3>
                        <button onClick={() => setIsSidebarOpen(false)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-500"><XCircle className="h-5 w-5"/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Info</h4>
                            <TextField label="Name" value={form.display_name}
                                       onChange={v => setForm({...form, display_name: v})} required/>
                            <TextField label="Phone" value={form.phone_business}
                                       onChange={v => setForm({...form, phone_business: v})}/>
                            <TextField label="Address" value={form.address_line}
                                       onChange={v => setForm({...form, address_line: v})}/>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operations</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        type="number"
                                        label="Radius (km)"
                                        value={form.coverage_radius_km}
                                        // Fix: Convert string 'v' to Number()
                                        onChange={v => setForm({...form, coverage_radius_km: Number(v)})}
                                    />
                                    <TextField
                                        type="number"
                                        label="Callout Fee"
                                        value={form.callout_fee}
                                        // Fix: Convert string 'v' to Number()
                                        onChange={v => setForm({...form, callout_fee: Number(v)})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Toggle label="Active" checked={form.is_active}
                                        onChange={v => setForm({...form, is_active: v})}/>
                                <Toggle label="Verified" checked={form.is_verified}
                                        onChange={v => setForm({...form, is_verified: v})}/>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Services</h4>
                            <div className="space-y-2">
                                {services.map(svc => {
                                    const isSelected = selectedServiceIds.includes(svc.id);
                                    return (
                                        <div key={svc.id}
                                             className={cls("p-3 rounded-lg border transition-all", isSelected ? "border-indigo-200 bg-indigo-50" : "border-slate-100 bg-white")}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <input type="checkbox" checked={isSelected} onChange={() => {
                                                    setSelectedServiceIds(prev => isSelected ? prev.filter(id => id !== svc.id) : [...prev, svc.id]);
                                                }}
                                                       className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>
                                                <span className="text-sm font-medium text-slate-900">{svc.name}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="flex gap-2 pl-6">
                                                    <input
                                                        placeholder="Price"
                                                        className="w-20 text-xs p-1 rounded border border-slate-200"
                                                        value={serviceRates[svc.id]?.base_price || ''}
                                                        onChange={e => setServiceRates(prev => ({
                                                            ...prev,
                                                            [svc.id]: {...prev[svc.id], base_price: e.target.value}
                                                        }))}
                                                    />
                                                    <input
                                                        placeholder="Unit"
                                                        className="w-16 text-xs p-1 rounded border border-slate-200"
                                                        value={serviceRates[svc.id]?.price_unit || ''}
                                                        onChange={e => setServiceRates(prev => ({
                                                            ...prev,
                                                            [svc.id]: {...prev[svc.id], price_unit: e.target.value}
                                                        }))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <button onClick={handleSave}
                                className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                            <Save className="h-4 w-4"/> Save Provider
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Requests Panel
function RequestsPanel() {
    const [list, setList] = useState<RequestRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listRequests(statusFilter === 'all' ? undefined : statusFilter);
            setList(data as RequestRow[]);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const updateStatus = async (id: UUID, status: RequestStatus) => {
        await updateRequestStatus(id, status);
        fetchRequests();
    }

    return (
        <div
            className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex gap-4 items-center bg-slate-50/50">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                    {['all', 'pending', 'in_progress', 'completed'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cls(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                                statusFilter === s ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {s.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button onClick={fetchRequests} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <RefreshCw className="h-4 w-4"/></button>
            </div>

            <div className="flex-1 overflow-auto relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
                    </div>
                )}
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Provider</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {list.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 text-slate-500 text-xs">
                                {new Date(r.created_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={r.status || 'pending'}/>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{r.driver_name || 'Unknown'}</div>
                                <div className="text-xs text-slate-500">{r.driver_phone}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 text-xs font-mono">
                                {r.provider_id?.slice(0, 8) || '—'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <select
                                    className="bg-white border border-slate-200 text-xs rounded-md py-1 pl-2 pr-6 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    value={r.status || 'pending'}
                                    onChange={(e) => updateStatus(r.id, e.target.value as RequestStatus)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


/* ---------------- Main Dashboard Shell ---------------- */

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"providers" | "requests">("providers");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser().then((u) => setUser(u as User)).catch(() => window.location.href = '/login');
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <div
                        className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">M
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">MotorAmbos</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => setActiveTab("providers")}
                        className={cls("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'providers' ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50")}
                    >
                        <Wrench className="h-4 w-4"/> Providers
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={cls("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", activeTab === 'requests' ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50")}
                    >
                        <LifeBuoy className="h-4 w-4"/> Requests
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <UserIcon className="h-4 w-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={() => logout()}
                            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors">
                        <LogOut className="h-3 w-3"/> Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header
                    className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-8">
                    <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-500">System Operational</span>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-6">
                    {activeTab === "providers" && <ProvidersPanel/>}
                    {activeTab === "requests" && <RequestsPanel/>}
                </div>
            </main>

        </div>
    );
}