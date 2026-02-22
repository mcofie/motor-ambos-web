"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    listProviders,
    insertProvider,
    updateProvider,
    deleteProvider,
    bulkUpdateProviders,
    listServices,
    setProviderServices,
    getProviderServiceIds,
    listProviderRates,
    upsertProviderRates,
    listRequests,
    uploadProviderAsset,
} from "@/lib/supaFetch";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import {
    Wrench,
    TrendingUp,
    ShieldCheck,
    List as ListIcon,
    Map as MapIcon,
    Search,
    Plus,
    Loader2,
    Edit2,
    Trash2,
    X,
    User as UserIcon,
    Save,
    Droplets,
    Sparkles,
    Truck,
    Fuel,
    Store,
    CircleDot,
    Zap,
    PaintBucket,
    Filter,
    Phone,
    MessageCircle,
    ChevronUp,
    ChevronDown,
    Download,
    CheckSquare,
    Square,
    ToggleLeft,
    ToggleRight,
    Clock,
    ExternalLink,
    Image as ImageIcon,
    Star,
    Briefcase,
    ArrowUpDown,
    Upload,
} from "lucide-react";
import {
    ProviderRow,
    ServiceRow,
    UUID,
    ProviderRateRow,
    RequestRow,
    ProviderType,
    OperatingHours,
    DEFAULT_OPERATING_HOURS,
    ProviderStats,
} from "../types";
import {
    cls,
    TextField,
    Toggle,
    StatCard,
} from "../ui/AdminUI";
import ProviderMap from "./ProviderMap";

// ─── Provider Type Config ─────────────────────────────
export const PROVIDER_TYPES: {
    value: ProviderType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
}[] = [
        { value: "mechanic", label: "Mechanic (General)", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
        { value: "mechanic_engine", label: "Mechanic (Engine)", icon: Wrench, color: "text-blue-600", bg: "bg-blue-600/10" },
        { value: "mechanic_electrical", label: "Mechanic (Electrical)", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { value: "detailing", label: "Detailing", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
        { value: "car_wash", label: "Car Wash", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        { value: "roadworthy", label: "Roadworthy Center", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-600/10" },
        { value: "insurance", label: "Insurance Provider", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { value: "shop", label: "Spare Parts & Shop", icon: Store, color: "text-amber-600", bg: "bg-amber-600/10" },
        { value: "towing", label: "Towing", icon: Truck, color: "text-orange-500", bg: "bg-orange-500/10" },
        { value: "fuel", label: "Fuel Delivery", icon: Fuel, color: "text-amber-500", bg: "bg-amber-500/10" },
        { value: "auto_shop", label: "Auto Shop", icon: Store, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { value: "tire", label: "Tire Service", icon: CircleDot, color: "text-slate-500", bg: "bg-slate-500/10" },
        { value: "body_shop", label: "Body & Paint", icon: PaintBucket, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];

function getProviderTypeConfig(type?: ProviderType | string | null) {
    return PROVIDER_TYPES.find((t) => t.value === type) || PROVIDER_TYPES[0];
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

type SortField = "name" | "date" | "type" | "status" | "jobs";
type SortDir = "asc" | "desc";

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
    provider_type: ProviderType;
    logo_url: string;
    backdrop_url: string;
    operating_hours: OperatingHours;
    purchase_url: string;
    purchase_action_label: string;
    experience_years: number | null;
    specializations: string | null;
    certification_url: string | null;
};

export function ProvidersView() {
    const router = useRouter();

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
        provider_type: "mechanic",
        logo_url: "",
        backdrop_url: "",
        operating_hours: { ...DEFAULT_OPERATING_HOURS },
        purchase_url: "",
        purchase_action_label: "",
        experience_years: null,
        specializations: null,
        certification_url: null,
    };

    const [form, setForm] = useState<ProviderFormState>({ ...emptyForm });
    const [list, setList] = useState<ProviderRow[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [activeRequests, setActiveRequests] = useState<RequestRow[]>([]);
    const [allRequests, setAllRequests] = useState<RequestRow[]>([]);
    const [filterType, setFilterType] = useState<ProviderType | "all">("all");
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showBulkBar, setShowBulkBar] = useState(false);

    // Services state
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<UUID[]>([]);
    const [serviceRates, setServiceRates] = useState<Record<UUID, { base_price: string; price_unit: string }>>({});

    // Compute provider stats from requests
    const providerStatsMap = useMemo(() => {
        const map: Record<string, ProviderStats> = {};
        for (const provider of list) {
            const jobs = allRequests.filter(r => r.provider_id === provider.id);
            const completed = jobs.filter(r => r.status === "completed");
            map[provider.id] = {
                totalJobs: jobs.length,
                completedJobs: completed.length,
                completionRate: jobs.length > 0 ? Math.round((completed.length / jobs.length) * 100) : 0,
                avgRating: null, // Would require reviews table
                revenue: completed.length * (provider.callout_fee || 0),
            };
        }
        return map;
    }, [list, allRequests]);

    const fetchProviders = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const [providersData, requestsData, servicesData] = await Promise.all([
                listProviders(q, signal),
                listRequests(undefined, signal),
                listServices(signal)
            ]);
            setList(providersData as ProviderRow[]);
            const reqs = requestsData as RequestRow[];
            setAllRequests(reqs);
            setActiveRequests(reqs.filter(r => r.status === 'pending' || r.status === 'in_progress' || r.status === 'accepted'));
            setServices(servicesData as ServiceRow[]);
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [q]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProviders(controller.signal);

        const supabase = getSupabaseBrowser();
        const channel = supabase
            .channel('admin-dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
                fetchProviders();
                toast.info("Request data updated");
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, () => {
                fetchProviders();
            })
            .subscribe();

        return () => {
            controller.abort();
            supabase.removeChannel(channel);
        };
    }, [fetchProviders]);

    // Bulk bar visibility
    useEffect(() => {
        setShowBulkBar(selectedIds.size > 0);
    }, [selectedIds]);

    const handleSave = async () => {
        const promise = async () => {
            const payload = {
                ...form,
                coverage_radius_km: Number(form.coverage_radius_km),
                callout_fee: Number(form.callout_fee),
                lng: form.lng ? Number(form.lng) : null,
                lat: form.lat ? Number(form.lat) : null,
                logo_url: form.logo_url || null,
                backdrop_url: form.backdrop_url || null,
                purchase_url: form.purchase_url || null,
                purchase_action_label: form.purchase_action_label || null,
                experience_years: form.experience_years,
                specializations: form.specializations || null,
                certification_url: form.certification_url || null,
                operating_hours: form.operating_hours as unknown as Record<string, unknown>,
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
                    .filter((s) => selectedServiceIds.includes(s.id))
                    .map((s) => ({
                        service_id: s.id,
                        base_price: Number(serviceRates[s.id]?.base_price || 0),
                        price_unit: serviceRates[s.id]?.price_unit || "job",
                        min_callout_fee: null,
                        is_active: true,
                    }));
                if (rates.length) await upsertProviderRates(providerId, rates);
            }
            setIsSidebarOpen(false);
            fetchProviders();
            setForm({ ...emptyForm });
            setSelectedServiceIds([]);
            setServiceRates({});
        };

        toast.promise(promise, {
            loading: "Saving provider...",
            success: "Provider saved successfully",
            error: "Failed to save provider",
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
            provider_type: (row.provider_type as ProviderType) || "mechanic",
            logo_url: row.logo_url || "",
            backdrop_url: row.backdrop_url || "",
            operating_hours: (row.operating_hours as OperatingHours) || { ...DEFAULT_OPERATING_HOURS },
            purchase_url: row.purchase_url || "",
            purchase_action_label: row.purchase_action_label || "",
            experience_years: row.experience_years ?? null,
            specializations: row.specializations || "",
            certification_url: row.certification_url || "",
        });

        const ids = await getProviderServiceIds(row.id);
        setSelectedServiceIds(ids as UUID[]);

        const rates = (await listProviderRates(row.id)) as ProviderRateRow[];
        const rateMap: Record<UUID, { base_price: string; price_unit: string }> = {};
        rates.forEach((r) => {
            rateMap[r.service_id] = {
                base_price: String(r.base_price || 0),
                price_unit: r.price_unit || "",
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
                },
            },
        });
    };

    // Quick toggle active
    const handleQuickToggle = async (id: string, field: "is_active" | "is_verified", current: boolean) => {
        try {
            await updateProvider(id, { [field]: !current });
            setList(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p));
            toast.success(`Provider ${field === "is_active" ? (current ? "deactivated" : "activated") : (current ? "unverified" : "verified")}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update");
        }
    };

    // Bulk actions
    const handleBulkAction = async (action: "activate" | "deactivate" | "verify" | "unverify" | "delete") => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;

        const promise = async () => {
            switch (action) {
                case "activate":
                    await bulkUpdateProviders(ids, { is_active: true });
                    break;
                case "deactivate":
                    await bulkUpdateProviders(ids, { is_active: false });
                    break;
                case "verify":
                    await bulkUpdateProviders(ids, { is_verified: true });
                    break;
                case "unverify":
                    await bulkUpdateProviders(ids, { is_verified: false });
                    break;
                case "delete":
                    for (const id of ids) await deleteProvider(id);
                    break;
            }
            setSelectedIds(new Set());
            fetchProviders();
        };

        toast.promise(promise, {
            loading: `Applying to ${ids.length} provider(s)...`,
            success: `${action} applied to ${ids.length} provider(s)`,
            error: "Bulk action failed",
        });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredList.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredList.map(p => p.id)));
        }
    };

    // Export CSV
    const handleExportCSV = () => {
        const headers = ["Name", "Type", "Phone", "Address", "Active", "Verified", "Radius (km)", "Callout Fee", "Jobs", "Completion Rate"];
        const rows = filteredList.map(row => {
            const stats = providerStatsMap[row.id];
            const typeConfig = getProviderTypeConfig(row.provider_type);
            return [
                row.display_name,
                typeConfig.label,
                row.phone_business || "",
                row.address_line || "",
                row.is_active ? "Yes" : "No",
                row.is_verified ? "Yes" : "No",
                String(row.coverage_radius_km || 0),
                String(row.callout_fee || 0),
                String(stats?.totalJobs || 0),
                `${stats?.completionRate || 0}%`,
            ];
        });

        const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `providers-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Export downloaded");
    };

    // Sorting
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    // Filtered and sorted list
    const filteredList = useMemo(() => {
        let result = filterType === "all"
            ? list
            : list.filter((p) => (p.provider_type || "mechanic") === filterType);

        // Sort
        result = [...result].sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1;
            switch (sortField) {
                case "name":
                    return dir * (a.display_name || "").localeCompare(b.display_name || "");
                case "date":
                    return dir * ((a.created_at || "").localeCompare(b.created_at || ""));
                case "type":
                    return dir * ((a.provider_type || "").localeCompare(b.provider_type || ""));
                case "status":
                    return dir * (Number(a.is_active) - Number(b.is_active));
                case "jobs": {
                    const aJobs = providerStatsMap[a.id]?.totalJobs || 0;
                    const bJobs = providerStatsMap[b.id]?.totalJobs || 0;
                    return dir * (aJobs - bJobs);
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [list, filterType, sortField, sortDir, providerStatsMap]);

    // Derived Stats
    const activeProviders = list.filter((p) => p.is_active).length;
    const totalVerified = list.filter((p) => p.is_verified).length;
    const totalJobs = allRequests.length;

    // Count by type
    const typeCounts = PROVIDER_TYPES.reduce((acc, t) => {
        acc[t.value] = list.filter((p) => (p.provider_type || "mechanic") === t.value).length;
        return acc;
    }, {} as Record<string, number>);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-30" />;
        return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Providers" value={list.length} icon={Wrench} color="bg-blue-500" />
                <StatCard title="Active Now" value={activeProviders} icon={TrendingUp} color="bg-primary" />
                <StatCard title="Verified" value={totalVerified} icon={ShieldCheck} color="bg-emerald-500" />
                <StatCard title="Total Jobs" value={totalJobs} icon={Briefcase} color="bg-purple-500" />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 pr-2">
                    <Filter className="h-3.5 w-3.5" />
                    Type
                </div>
                <button
                    onClick={() => setFilterType("all")}
                    className={cls(
                        "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
                        filterType === "all"
                            ? "bg-foreground text-background border-foreground shadow-sm"
                            : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                    )}
                >
                    All
                    <span className={cls(
                        "ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        filterType === "all" ? "bg-background/20" : "bg-muted"
                    )}>
                        {list.length}
                    </span>
                </button>
                {PROVIDER_TYPES.map((t) => {
                    const Icon = t.icon;
                    const count = typeCounts[t.value] || 0;
                    if (count === 0 && filterType !== t.value) return null;
                    return (
                        <button
                            key={t.value}
                            onClick={() => setFilterType(t.value)}
                            className={cls(
                                "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
                                filterType === t.value
                                    ? `${t.bg} ${t.color} border-current shadow-sm`
                                    : "bg-card text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                            )}
                        >
                            <Icon className="h-3 w-3" />
                            {t.label}
                            <span className={cls(
                                "ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                filterType === t.value ? "bg-white/20" : "bg-muted"
                            )}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-card">
                    <div className="flex gap-2 self-start sm:self-auto">
                        <button
                            onClick={() => setViewMode("list")}
                            className={cls(
                                "p-2 rounded-lg transition-colors border",
                                viewMode === "list"
                                    ? "bg-secondary border-secondary text-secondary-foreground"
                                    : "border-transparent text-muted-foreground hover:bg-accent"
                            )}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={cls(
                                "p-2 rounded-lg transition-colors border",
                                viewMode === "map"
                                    ? "bg-secondary border-secondary text-secondary-foreground"
                                    : "border-transparent text-muted-foreground hover:bg-accent"
                            )}
                        >
                            <MapIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                            placeholder="Search providers..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-input hover:bg-accent transition-colors"
                            title="Export CSV"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button
                            onClick={() => {
                                setForm({ ...emptyForm });
                                setSelectedServiceIds([]);
                                setServiceRates({});
                                setIsSidebarOpen(true);
                            }}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Provider</span>
                        </button>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {showBulkBar && (
                    <div className="px-4 py-3 bg-primary/5 border-b border-primary/20 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                        <span className="text-sm font-semibold text-primary">
                            {selectedIds.size} selected
                        </span>
                        <div className="h-4 w-px bg-border" />
                        <button onClick={() => handleBulkAction("activate")} className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors flex items-center gap-1">
                            <ToggleRight className="h-3 w-3" /> Activate
                        </button>
                        <button onClick={() => handleBulkAction("deactivate")} className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors flex items-center gap-1">
                            <ToggleLeft className="h-3 w-3" /> Deactivate
                        </button>
                        <button onClick={() => handleBulkAction("verify")} className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Verify
                        </button>
                        <button onClick={() => handleBulkAction("delete")} className="text-xs font-medium px-2.5 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1 ml-auto">
                            <Trash2 className="h-3 w-3" /> Delete
                        </button>
                        <button onClick={() => setSelectedIds(new Set())} className="text-xs text-muted-foreground hover:text-foreground p-1">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative bg-muted/20">
                    {loading && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {viewMode === "map" ? (
                        <div className="w-full h-[600px] p-4">
                            <ProviderMap
                                key={`map-${filteredList.length}-${filterType}`}
                                providers={filteredList}
                                requests={activeRequests}
                                onEdit={handleEdit}
                            />
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 w-10">
                                            <button onClick={toggleSelectAll} className="p-0.5 hover:text-foreground transition-colors">
                                                {selectedIds.size === filteredList.length && filteredList.length > 0
                                                    ? <CheckSquare className="h-4 w-4 text-primary" />
                                                    : <Square className="h-4 w-4" />
                                                }
                                            </button>
                                        </th>
                                        <th className="px-4 py-3">
                                            <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                                Provider <SortIcon field="name" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3">
                                            <button onClick={() => handleSort("type")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                                Type <SortIcon field="type" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3">
                                            <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                                Status <SortIcon field="status" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3">
                                            <button onClick={() => handleSort("jobs")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                                Performance <SortIcon field="jobs" />
                                            </button>
                                        </th>
                                        <th className="px-4 py-3">Contact</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {filteredList.map((row) => {
                                        const typeConfig = getProviderTypeConfig(row.provider_type);
                                        const TypeIcon = typeConfig.icon;
                                        const stats = providerStatsMap[row.id];
                                        const isSelected = selectedIds.has(row.id);
                                        return (
                                            <tr
                                                key={row.id}
                                                className={cls(
                                                    "hover:bg-muted/50 transition-colors group",
                                                    isSelected && "bg-primary/5"
                                                )}
                                            >
                                                {/* Checkbox */}
                                                <td className="px-4 py-3">
                                                    <button onClick={() => toggleSelect(row.id)} className="p-0.5">
                                                        {isSelected
                                                            ? <CheckSquare className="h-4 w-4 text-primary" />
                                                            : <Square className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        }
                                                    </button>
                                                </td>

                                                {/* Provider Info */}
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => router.push(`/admin/providers/${row.id}`)}
                                                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                                                    >
                                                        {row.logo_url ? (
                                                            <img
                                                                src={row.logo_url}
                                                                alt={row.display_name}
                                                                className="h-9 w-9 rounded-lg object-cover border border-border"
                                                            />
                                                        ) : (
                                                            <div className={cls(
                                                                "h-9 w-9 rounded-lg flex items-center justify-center font-bold border border-border",
                                                                typeConfig.bg, typeConfig.color
                                                            )}>
                                                                <TypeIcon className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-foreground flex items-center gap-1.5">
                                                                {row.display_name}
                                                                {row.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                {row.address_line || "No address"}
                                                            </div>
                                                        </div>
                                                    </button>
                                                </td>

                                                {/* Type Badge */}
                                                <td className="px-4 py-3">
                                                    <span className={cls(
                                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                        typeConfig.bg, typeConfig.color,
                                                    )}>
                                                        <TypeIcon className="h-2.5 w-2.5" />
                                                        {typeConfig.label}
                                                    </span>
                                                </td>

                                                {/* Status — Quick toggle */}
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            onClick={() => handleQuickToggle(row.id, "is_active", !!row.is_active)}
                                                            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                                                            title="Click to toggle"
                                                        >
                                                            <span className={cls(
                                                                "h-2 w-2 rounded-full transition-colors",
                                                                row.is_active
                                                                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                                                    : "bg-muted-foreground/30"
                                                            )} />
                                                            <span className="text-xs font-medium text-muted-foreground">
                                                                {row.is_active ? "Active" : "Offline"}
                                                            </span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleQuickToggle(row.id, "is_verified", !!row.is_verified)}
                                                            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                                                            title="Click to toggle verification"
                                                        >
                                                            <ShieldCheck className={cls(
                                                                "h-3 w-3",
                                                                row.is_verified ? "text-emerald-500" : "text-muted-foreground/30"
                                                            )} />
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {row.is_verified ? "Verified" : "Unverified"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* Performance Stats */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-foreground">{stats?.totalJobs || 0}</div>
                                                            <div className="text-[10px] text-muted-foreground uppercase">Jobs</div>
                                                        </div>
                                                        <div className="h-6 w-px bg-border" />
                                                        <div className="text-center">
                                                            <div className={cls(
                                                                "text-sm font-bold",
                                                                (stats?.completionRate || 0) >= 80 ? "text-emerald-500" :
                                                                    (stats?.completionRate || 0) >= 50 ? "text-amber-500" : "text-muted-foreground"
                                                            )}>
                                                                {stats?.completionRate || 0}%
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground uppercase">Rate</div>
                                                        </div>
                                                        <div className="h-6 w-px bg-border" />
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-foreground">
                                                                {row.coverage_radius_km || 0}<span className="text-[10px] font-normal text-muted-foreground">km</span>
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground uppercase">Range</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Shortcuts */}
                                                <td className="px-4 py-3">
                                                    {row.phone_business ? (
                                                        <div className="flex items-center gap-1">
                                                            <a
                                                                href={`tel:${row.phone_business}`}
                                                                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors"
                                                                title="Call"
                                                            >
                                                                <Phone className="h-3.5 w-3.5" />
                                                            </a>
                                                            <a
                                                                href={`https://wa.me/${(row.phone_business || "").replace(/\D/g, "")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 transition-colors"
                                                                title="WhatsApp"
                                                            >
                                                                <MessageCircle className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground/50">—</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => router.push(`/admin/providers/${row.id}`)}
                                                            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(row)}
                                                            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredList.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <Wrench className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No providers found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ─── Slide Over Sheet ─────────────────────────────── */}
            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[520px] bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
                        <div className="p-5 border-b border-border flex items-center justify-between bg-card">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">
                                    {form.id ? "Edit Provider" : "New Provider"}
                                </h3>
                                <p className="text-xs text-muted-foreground">Manage service details and coverage</p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background/50">
                            {/* Provider Type Selector */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <Store className="w-3 h-3" /> Provider Type
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {PROVIDER_TYPES.map((t) => {
                                        const Icon = t.icon;
                                        const isSelected = form.provider_type === t.value;
                                        return (
                                            <button
                                                key={t.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, provider_type: t.value })}
                                                className={cls(
                                                    "flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all duration-200 text-center",
                                                    isSelected
                                                        ? `border-current ${t.bg} ${t.color} shadow-sm ring-1 ring-current/20`
                                                        : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:bg-accent/5"
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                                                    {t.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Basic Info */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <UserIcon className="w-3 h-3" /> Basic Info
                                </h4>
                                <TextField
                                    label="Display Name"
                                    value={form.display_name}
                                    onChange={(v) => setForm({ ...form, display_name: v })}
                                    required
                                />
                                <TextField
                                    label="Phone Number"
                                    value={form.phone_business}
                                    onChange={(v) => setForm({ ...form, phone_business: v })}
                                />
                                <TextField
                                    label="Physical Address"
                                    value={form.address_line}
                                    onChange={(v) => setForm({ ...form, address_line: v })}
                                />
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                        About / Description
                                    </label>
                                    <textarea
                                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground min-h-[80px] resize-none"
                                        value={form.about}
                                        onChange={(e) => setForm({ ...form, about: e.target.value })}
                                        placeholder="Brief description of the business..."
                                    />
                                </div>

                                {/* Logo URL & Upload */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Logo / Photo
                                    </label>
                                    <div className="flex gap-3 items-start">
                                        {form.logo_url && (
                                            <img
                                                src={form.logo_url}
                                                alt="Logo preview"
                                                className="h-12 w-12 rounded-lg object-cover border border-border shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <input
                                                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground"
                                                value={form.logo_url}
                                                onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                                                placeholder="https://example.com/logo.png"
                                            />
                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium cursor-pointer transition-colors">
                                                    <Upload className="w-3 h-3" />
                                                    <span>Upload Logo</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            try {
                                                                const loadingToast = toast.loading("Uploading logo...");
                                                                const url = await uploadProviderAsset(file, "logo");
                                                                setForm({ ...form, logo_url: url });
                                                                toast.dismiss(loadingToast);
                                                                toast.success("Logo uploaded!");
                                                            } catch (err) {
                                                                toast.error("Upload failed");
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Backdrop URL & Upload */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Backdrop / Cover
                                    </label>
                                    <div className="flex flex-col gap-3">
                                        {form.backdrop_url && (
                                            <img
                                                src={form.backdrop_url}
                                                alt="Backdrop preview"
                                                className="w-full h-24 rounded-lg object-cover border border-border"
                                            />
                                        )}
                                        <div className="space-y-2">
                                            <input
                                                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-foreground"
                                                value={form.backdrop_url}
                                                onChange={(e) => setForm({ ...form, backdrop_url: e.target.value })}
                                                placeholder="https://example.com/backdrop.jpg"
                                            />
                                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium cursor-pointer transition-colors">
                                                <Upload className="w-3 h-3" />
                                                <span>Upload Backdrop</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        try {
                                                            const loadingToast = toast.loading("Uploading backdrop...");
                                                            const url = await uploadProviderAsset(file, "backdrop");
                                                            setForm({ ...form, backdrop_url: url });
                                                            toast.dismiss(loadingToast);
                                                            toast.success("Backdrop uploaded!");
                                                        } catch (err) {
                                                            toast.error("Upload failed");
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Lat"
                                        value={form.lat || ""}
                                        onChange={(v) => setForm({ ...form, lat: v })}
                                        className="font-mono text-xs"
                                    />
                                    <TextField
                                        label="Lng"
                                        value={form.lng || ""}
                                        onChange={(v) => setForm({ ...form, lng: v })}
                                        className="font-mono text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        label="Booking / Purchase URL"
                                        value={form.purchase_url}
                                        onChange={(v) => setForm({ ...form, purchase_url: v })}
                                    />
                                    <TextField
                                        label="Action Label (e.g. Book Now)"
                                        value={form.purchase_action_label}
                                        onChange={(v) => setForm({ ...form, purchase_action_label: v })}
                                    />
                                </div>
                            </section>

                            {/* Operations */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <Wrench className="w-3 h-3" /> Operations
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <TextField
                                        type="number"
                                        label="Radius (km)"
                                        value={form.coverage_radius_km}
                                        onChange={(v) => setForm({ ...form, coverage_radius_km: Number(v) })}
                                    />
                                    <TextField
                                        type="number"
                                        label="Callout Fee"
                                        value={form.callout_fee}
                                        onChange={(v) => setForm({ ...form, callout_fee: Number(v) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Toggle
                                        label="Active Status"
                                        checked={form.is_active}
                                        onChange={(v) => setForm({ ...form, is_active: v })}
                                    />
                                    <Toggle
                                        label="Verified"
                                        checked={form.is_verified}
                                        onChange={(v) => setForm({ ...form, is_verified: v })}
                                    />
                                </div>
                            </section>

                            {/* Operating Hours */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <Clock className="w-3 h-3" /> Operating Hours
                                </h4>
                                <div className="space-y-2">
                                    {DAYS.map((day) => {
                                        const schedule = form.operating_hours[day];
                                        return (
                                            <div key={day} className={cls(
                                                "flex items-center gap-3 p-2.5 rounded-lg border transition-colors",
                                                schedule.closed ? "border-border bg-muted/50" : "border-primary/20 bg-card"
                                            )}>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({
                                                        ...form,
                                                        operating_hours: {
                                                            ...form.operating_hours,
                                                            [day]: { ...schedule, closed: !schedule.closed }
                                                        }
                                                    })}
                                                    className={cls(
                                                        "w-20 text-xs font-bold uppercase tracking-wider text-left",
                                                        schedule.closed ? "text-muted-foreground line-through" : "text-foreground"
                                                    )}
                                                >
                                                    {day.slice(0, 3)}
                                                </button>
                                                {schedule.closed ? (
                                                    <span className="text-xs text-muted-foreground italic">Closed</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="time"
                                                            value={schedule.open}
                                                            onChange={(e) => setForm({
                                                                ...form,
                                                                operating_hours: {
                                                                    ...form.operating_hours,
                                                                    [day]: { ...schedule, open: e.target.value }
                                                                }
                                                            })}
                                                            className="text-xs px-2 py-1 rounded border border-input bg-background text-foreground"
                                                        />
                                                        <span className="text-xs text-muted-foreground">to</span>
                                                        <input
                                                            type="time"
                                                            value={schedule.close}
                                                            onChange={(e) => setForm({
                                                                ...form,
                                                                operating_hours: {
                                                                    ...form.operating_hours,
                                                                    [day]: { ...schedule, close: e.target.value }
                                                                }
                                                            })}
                                                            className="text-xs px-2 py-1 rounded border border-input bg-background text-foreground"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Services */}
                            <section className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2">
                                    <ListIcon className="w-3 h-3" /> Services
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {services.map((svc) => {
                                        const isSelected = selectedServiceIds.includes(svc.id);
                                        return (
                                            <div
                                                key={svc.id}
                                                className={cls(
                                                    "p-3 rounded-lg border transition-all duration-200",
                                                    isSelected
                                                        ? "border-primary/30 bg-primary/5 shadow-sm"
                                                        : "border-border bg-card hover:border-primary/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            setSelectedServiceIds((prev) =>
                                                                isSelected ? prev.filter((id) => id !== svc.id) : [...prev, svc.id]
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-foreground">{svc.name}</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="flex gap-2 pl-7 animate-in slide-in-from-top-1 fade-in duration-200">
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">GHS</span>
                                                            <input
                                                                placeholder="0.00"
                                                                className="w-full pl-8 text-xs py-1.5 rounded border border-input bg-background text-foreground"
                                                                value={serviceRates[svc.id]?.base_price || ""}
                                                                onChange={(e) =>
                                                                    setServiceRates((prev) => ({
                                                                        ...prev,
                                                                        [svc.id]: { ...prev[svc.id], base_price: e.target.value },
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <input
                                                            placeholder="Unit (e.g., trip)"
                                                            className="w-24 text-xs px-2 py-1.5 rounded border border-input bg-background text-foreground"
                                                            value={serviceRates[svc.id]?.price_unit || ""}
                                                            onChange={(e) =>
                                                                setServiceRates((prev) => ({
                                                                    ...prev,
                                                                    [svc.id]: { ...prev[svc.id], price_unit: e.target.value },
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

                        <div className="p-5 border-t border-border bg-muted/20 flex gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground bg-background border border-input hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 flex justify-center items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                            >
                                <Save className="h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
