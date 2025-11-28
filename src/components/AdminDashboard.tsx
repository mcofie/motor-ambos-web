// src/components/AdminDashboard.tsx
"use client";

import React, {useState, useEffect, useCallback} from "react";
import {Toaster, toast} from 'sonner';
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
    X,
    Map as MapIcon,
    List as ListIcon,
    LayoutGrid,
    MapPin,
    TrendingUp,
    AlertCircle
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

type RequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

interface ProviderRateRow {
    service_id: UUID;
    base_price: number | null;
    price_unit: string | null;
}

interface User {
    id: UUID;
    email: string;
}

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

/* --------------- UI Helpers --------------- */

const cls = (...arr: Array<string | false | null | undefined>) => arr.filter(Boolean).join(" ");

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TextFieldProps {
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    icon?: IconType;
}

function TextField({
                       label,
                       value,
                       onChange,
                       type = "text",
                       placeholder,
                       required,
                       className,
                       icon: Icon
                   }: TextFieldProps) {
    return (
        <div className={cls("space-y-1.5", className)}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3"/>}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

const Toggle = ({label, checked, onChange}: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cls(
            "group flex items-center justify-between gap-3 rounded-lg border p-3 shadow-sm transition-all duration-200",
            checked ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200 bg-white hover:border-slate-300"
        )}
    >
        <span className={cls("text-sm font-medium", checked ? "text-indigo-900" : "text-slate-700")}>{label}</span>
        <span
            className={cls(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-indigo-600" : "bg-slate-300"
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

function StatusBadge({status}: { status: string }) {
    const s = (status || "pending") as RequestStatus;
    const styles: Record<RequestStatus, string> = {
        pending: "bg-amber-100 text-amber-800 border-amber-200",
        accepted: "bg-blue-100 text-blue-800 border-blue-200",
        in_progress: "bg-indigo-100 text-indigo-800 border-indigo-200",
        completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return (
        <span
            className={cls(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                styles[s] || styles.pending
            )}
        >
      {s.replace('_', ' ')}
    </span>
    );
}

function StatCard({
                      title,
                      value,
                      icon: Icon,
                      color
                  }: {
    title: string;
    value: string | number;
    icon: IconType;
    color: string;
}) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cls("p-3 rounded-lg", color)}>
                <Icon className="w-5 h-5 text-white"/>
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{title}</p>
                <p className="text-xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

/* ---------------- Sub-Panels ---------------- */

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
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
            toast.error("Failed to load providers");
        } finally {
            setLoading(false);
        }
    }, [q]);

    useEffect(() => {
        fetchProviders();
        listServices().then((res) => setServices(res as ServiceRow[]));
    }, [fetchProviders]);

    const handleSave = async () => {
        const promise = async () => {
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

            if (providerId) {
                await setProviderServices(providerId, selectedServiceIds);
                const rates = services
                    .filter(s => selectedServiceIds.includes(s.id))
                    .map(s => ({
                        service_id: s.id,
                        base_price: Number(serviceRates[s.id]?.base_price || 0),
                        price_unit: serviceRates[s.id]?.price_unit || 'job',
                        min_callout_fee: null,
                        is_active: true
                    }));
                if (rates.length) await upsertProviderRates(providerId, rates);
            }
            setIsSidebarOpen(false);
            fetchProviders();
            setForm({...emptyForm});
        };

        toast.promise(promise, {
            loading: 'Saving provider...',
            success: 'Provider saved successfully',
            error: 'Failed to save provider',
        });
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
        toast("Delete Provider?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteProvider(id);
                        fetchProviders();
                        toast.success("Provider deleted");
                    } catch (error) {
                        console.error(error);
                        toast.error("Could not delete provider");
                    }
                }
            },
        })
    };

    // Derived Stats
    const activeProviders = list.filter(p => p.is_active).length;
    const totalVerified = list.filter(p => p.is_verified).length;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard title="Total Providers" value={list.length} icon={Wrench} color="bg-blue-500"/>
                <StatCard title="Active Now" value={activeProviders} icon={TrendingUp} color="bg-emerald-500"/>
                <StatCard title="Verified" value={totalVerified} icon={ShieldCheck} color="bg-indigo-500"/>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cls(
                                "p-2 rounded-lg transition-colors border",
                                viewMode === 'list'
                                    ? "bg-slate-100 border-slate-200 text-slate-900"
                                    : "border-transparent text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <ListIcon className="w-4 h-4"/>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={cls(
                                "p-2 rounded-lg transition-colors border",
                                viewMode === 'map'
                                    ? "bg-slate-100 border-slate-200 text-slate-900"
                                    : "border-transparent text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <MapIcon className="w-4 h-4"/>
                        </button>
                    </div>

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
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4"/>
                        <span className="hidden sm:inline">Add Provider</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative bg-slate-50/50">
                    {loading && (
                        <div
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
                        </div>
                    )}

                    {viewMode === 'map' ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2">
                            <MapPin className="w-12 h-12 opacity-20"/>
                            <p className="text-sm">Map Integration needed (Leaflet/Mapbox)</p>
                            <p className="text-xs">Showing {list.length} provider locations</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm">
                                <thead
                                    className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">Provider</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Info</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                {list.map(row => (
                                    <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200">
                                                    {row.display_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 flex items-center gap-1">
                                                        {row.display_name}
                                                        {row.is_verified &&
                                                            <ShieldCheck className="h-3 w-3 text-blue-500"/>}
                                                    </div>
                                                    <div
                                                        className="text-xs text-slate-500">{row.phone_business || 'No phone'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={cls(
                                                        "h-2 w-2 rounded-full",
                                                        row.is_active
                                                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                                            : "bg-slate-300"
                                                    )}
                                                />
                                                <span
                                                    className="text-slate-600 text-xs font-medium">
                                                    {row.is_active ? 'Active' : 'Offline'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-xs">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <span
                                                        className="text-slate-400 block text-[10px] uppercase">Radius</span>
                                                    {row.coverage_radius_km} km
                                                </div>
                                                <div>
                                                    <span
                                                        className="text-slate-400 block text-[10px] uppercase">Fee</span>
                                                    {row.callout_fee}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div
                                                className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(row)}
                                                    className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4"/>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {list.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                    <Wrench className="h-10 w-10 mb-2 opacity-20"/>
                                    <p>No providers found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modern Slide Over Sheet */}
            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
                    >
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">
                                    {form.id ? 'Edit Provider' : 'New Provider'}
                                </h3>
                                <p className="text-xs text-slate-500">Manage service details and coverage</p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                            >
                                <X className="h-5 w-5"/>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-2">
                                    <UserIcon className="w-3 h-3"/> Basic Info
                                </h4>
                                <TextField
                                    label="Display Name"
                                    value={form.display_name}
                                    onChange={v => setForm({...form, display_name: v})}
                                    required
                                />
                                <TextField
                                    label="Phone Number"
                                    value={form.phone_business}
                                    onChange={v => setForm({...form, phone_business: v})}
                                />
                                <TextField
                                    label="Physical Address"
                                    value={form.address_line}
                                    onChange={v => setForm({...form, address_line: v})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Lat"
                                        value={form.lat || ''}
                                        onChange={v => setForm({...form, lat: v})}
                                        className="font-mono text-xs"
                                    />
                                    <TextField
                                        label="Lng"
                                        value={form.lng || ''}
                                        onChange={v => setForm({...form, lng: v})}
                                        className="font-mono text-xs"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-2">
                                    <Wrench className="w-3 h-3"/> Operations
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        type="number"
                                        label="Radius (km)"
                                        value={form.coverage_radius_km}
                                        onChange={v => setForm({...form, coverage_radius_km: Number(v)})}
                                    />
                                    <TextField
                                        type="number"
                                        label="Callout Fee"
                                        value={form.callout_fee}
                                        onChange={v => setForm({...form, callout_fee: Number(v)})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Toggle
                                        label="Active Status"
                                        checked={form.is_active}
                                        onChange={v => setForm({...form, is_active: v})}
                                    />
                                    <Toggle
                                        label="Verified"
                                        checked={form.is_verified}
                                        onChange={v => setForm({...form, is_verified: v})}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-2">
                                    <ListIcon className="w-3 h-3"/> Services
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {services.map(svc => {
                                        const isSelected = selectedServiceIds.includes(svc.id);
                                        return (
                                            <div
                                                key={svc.id}
                                                className={cls(
                                                    "p-3 rounded-lg border transition-all duration-200",
                                                    isSelected
                                                        ? "border-indigo-200 bg-indigo-50 shadow-sm"
                                                        : "border-slate-100 bg-white hover:border-slate-200"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            setSelectedServiceIds(prev =>
                                                                isSelected
                                                                    ? prev.filter(id => id !== svc.id)
                                                                    : [...prev, svc.id]
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {svc.name}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <div
                                                        className="flex gap-2 pl-7 animate-in slide-in-from-top-1 fade-in duration-200"
                                                    >
                                                        <div className="relative flex-1">
                                                            <span
                                                                className="absolute left-2 top-1.5 text-xs text-slate-400">
                                                                GHS
                                                            </span>
                                                            <input
                                                                placeholder="0.00"
                                                                className="w-full pl-8 text-xs py-1.5 rounded border border-slate-200"
                                                                value={serviceRates[svc.id]?.base_price || ''}
                                                                onChange={e =>
                                                                    setServiceRates(prev => ({
                                                                        ...prev,
                                                                        [svc.id]: {
                                                                            ...prev[svc.id],
                                                                            base_price: e.target.value
                                                                        }
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <input
                                                            placeholder="Unit (e.g., trip)"
                                                            className="w-24 text-xs px-2 py-1.5 rounded border border-slate-200"
                                                            value={serviceRates[svc.id]?.price_unit || ''}
                                                            onChange={e =>
                                                                setServiceRates(prev => ({
                                                                    ...prev,
                                                                    [svc.id]: {
                                                                        ...prev[svc.id],
                                                                        price_unit: e.target.value
                                                                    }
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                            >
                                <Save className="h-4 w-4"/> Save Changes
                            </button>
                        </div>
                    </div>
                </>
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const updateStatus = async (id: UUID, status: RequestStatus) => {
        toast.promise(updateRequestStatus(id, status), {
            loading: 'Updating status...',
            success: 'Status updated',
            error: 'Failed to update'
        });
        fetchRequests();
    }

    // Derived stats
    const pendingCount = list.filter(r => r.status === 'pending').length;
    const inProgressCount = list.filter(r => r.status === 'in_progress').length;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard title="Total Requests" value={list.length} icon={LayoutGrid} color="bg-slate-500"/>
                <StatCard title="Pending" value={pendingCount} icon={AlertCircle} color="bg-amber-500"/>
                <StatCard title="In Progress" value={inProgressCount} icon={LifeBuoy} color="bg-indigo-500"/>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 items-center bg-white">
                    <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg">
                        {['all', 'pending', 'in_progress', 'completed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={cls(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                    statusFilter === s
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                )}
                            >
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1"></div>
                    <button
                        onClick={fetchRequests}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 rounded-lg"
                    >
                        <RefreshCw className="h-4 w-4"/>
                    </button>
                </div>

                <div className="flex-1 overflow-auto relative bg-slate-50/50">
                    {loading && (
                        <div
                            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
                        </div>
                    )}
                    <table className="w-full text-left text-sm">
                        <thead
                            className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3">Assignment</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                        {list.map(r => (
                            <tr key={r.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                                    {new Date(r.created_at).toLocaleString([], {
                                        dateStyle: 'short',
                                        timeStyle: 'short'
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={r.status || 'pending'}/>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{r.driver_name || 'Unknown User'}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        {r.driver_phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-xs">
                                    {r.provider_id ? (
                                        <span
                                            className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono">
                                            {r.provider_id.slice(0, 8)}...
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        className="bg-white border border-slate-200 text-xs rounded-lg py-1.5 pl-2 pr-8 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:border-slate-300"
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
                    {list.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <LifeBuoy className="h-10 w-10 mb-2 opacity-20"/>
                            <p>No requests found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


/* ---------------- Main Dashboard Shell ---------------- */

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"providers" | "requests">("providers");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser()
            .then((u) => setUser(u as User))
            .catch(() => {
                window.location.href = '/login';
            });
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
            <Toaster position="top-right" closeButton richColors/>

            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-slate-900 flex flex-col shadow-xl z-20 transition-all duration-300">
                <div
                    className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
                    <div
                        className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold lg:mr-3 shadow-lg shadow-indigo-500/30">
                        M
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white hidden lg:block">
                        MotorAmbos
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("providers")}
                        className={cls(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === 'providers'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <Wrench className="h-5 w-5"/>
                        <span className="hidden lg:block">Providers</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={cls(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === 'requests'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <LifeBuoy className="h-5 w-5"/>
                        <span className="hidden lg:block">Requests</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="hidden lg:flex items-center gap-3 mb-4 px-2">
                        <div
                            className="h-8 w-8 rounded-full bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-300">
                            <UserIcon className="h-4 w-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">Admin</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center lg:justify-start gap-3 text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4"/>
                        <span className="hidden lg:inline">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header
                    className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
                            {activeTab}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Manage your {activeTab} database
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-emerald-700">
                                System Operational
                            </span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden p-6 bg-slate-50">
                    {activeTab === "providers" && <ProvidersPanel/>}
                    {activeTab === "requests" && <RequestsPanel/>}
                </div>
            </main>
        </div>
    );
}