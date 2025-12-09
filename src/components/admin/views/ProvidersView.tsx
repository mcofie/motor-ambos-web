import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    listProviders,
    insertProvider,
    updateProvider,
    deleteProvider,
    listServices,
    setProviderServices,
    getProviderServiceIds,
    listProviderRates,
    upsertProviderRates,
    listRequests,
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
    MapPin,
    Edit2,
    Trash2,
    X,
    User as UserIcon,
    Save,
} from "lucide-react";
import {
    ProviderRow,
    ServiceRow,
    UUID,
    ProviderRateRow,
    RequestRow,
} from "../types";
import {
    cls,
    TextField,
    Toggle,
    StatCard,
} from "../ui/AdminUI";
import ProviderMap from "./ProviderMap";

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

export function ProvidersView() {
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

    const [form, setForm] = useState<ProviderFormState>({ ...emptyForm });
    const [list, setList] = useState<ProviderRow[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [activeRequests, setActiveRequests] = useState<RequestRow[]>([]);

    // Services state
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<UUID[]>([]);
    const [serviceRates, setServiceRates] = useState<Record<UUID, { base_price: string; price_unit: string }>>({});

    const fetchProviders = useCallback(async () => {
        setLoading(true);
        try {
            const [providersData, requestsData] = await Promise.all([
                listProviders(q),
                listRequests() // Fetch all requests to filter active ones
            ]);
            setList(providersData as ProviderRow[]);
            // Filter for map relevant requests (pending/in_progress)
            const allRequests = requestsData as RequestRow[];
            setActiveRequests(allRequests.filter(r => r.status === 'pending' || r.status === 'in_progress' || r.status === 'accepted'));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [q]);

    useEffect(() => {
        fetchProviders();
        listServices().then((res) => setServices(res as ServiceRow[]));

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
            supabase.removeChannel(channel);
        };
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

    // Derived Stats
    const activeProviders = list.filter((p) => p.is_active).length;
    const totalVerified = list.filter((p) => p.is_verified).length;

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Providers" value={list.length} icon={Wrench} color="bg-blue-500" />
                <StatCard title="Active Now" value={activeProviders} icon={TrendingUp} color="bg-primary" />
                <StatCard title="Verified" value={totalVerified} icon={ShieldCheck} color="bg-emerald-500" />
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
                    <button
                        onClick={() => {
                            setForm(emptyForm);
                            setSelectedServiceIds([]);
                            setServiceRates({});
                            setIsSidebarOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="inline">Add Provider</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative bg-muted/20">
                    {loading && (
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {viewMode === "map" ? (
                        <div className="h-full w-full p-4 min-h-[500px]">
                            <ProviderMap providers={list} requests={activeRequests} onEdit={handleEdit} />
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm">
                                <thead
                                    className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3">Provider</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Info</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {list.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold border border-border">
                                                        {row.display_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground flex items-center gap-1">
                                                            {row.display_name}
                                                            {row.is_verified &&
                                                                <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                                                        </div>
                                                        <div
                                                            className="text-xs text-muted-foreground">{row.phone_business || "No phone"}</div>
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
                                                                : "bg-muted-foreground/30"
                                                        )}
                                                    />
                                                    <span className="text-muted-foreground text-xs font-medium">
                                                        {row.is_active ? "Active" : "Offline"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <span
                                                            className="text-muted-foreground/70 block text-[10px] uppercase">Radius</span>
                                                        {row.coverage_radius_km} km
                                                    </div>
                                                    <div>
                                                        <span
                                                            className="text-muted-foreground/70 block text-[10px] uppercase">Fee</span>
                                                        {row.callout_fee}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div
                                                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(row)}
                                                        className="p-2 hover:bg-secondary text-muted-foreground hover:text-primary rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row.id)}
                                                        className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {list.length === 0 && !loading && (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <Wrench className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No providers found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Slide Over Sheet */}
            {isSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
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
                            </section>

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
                                                    <span
                                                        className="text-sm font-medium text-foreground">{svc.name}</span>
                                                </div>
                                                {isSelected && (
                                                    <div
                                                        className="flex gap-2 pl-7 animate-in slide-in-from-top-1 fade-in duration-200">
                                                        <div className="relative flex-1">
                                                            <span
                                                                className="absolute left-2 top-1.5 text-xs text-muted-foreground">GHS</span>
                                                            <input
                                                                placeholder="0.00"
                                                                className="w-full pl-8 text-xs py-1.5 rounded border border-input bg-background text-foreground"
                                                                value={serviceRates[svc.id]?.base_price || ""}
                                                                onChange={(e) =>
                                                                    setServiceRates((prev) => ({
                                                                        ...prev,
                                                                        [svc.id]: {
                                                                            ...prev[svc.id],
                                                                            base_price: e.target.value,
                                                                        },
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
                                                                    [svc.id]: {
                                                                        ...prev[svc.id],
                                                                        price_unit: e.target.value,
                                                                    },
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
