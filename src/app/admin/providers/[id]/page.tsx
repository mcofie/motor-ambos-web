"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    listProviders,
    updateProvider,
    listRequestsByProvider,
    getProviderServiceIds,
    listProviderRates,
    listServices,
} from "@/lib/supaFetch";
import {
    ArrowLeft,
    Wrench,
    Phone,
    MessageCircle,
    MapPin,
    ShieldCheck,
    Clock,
    Edit2,
    Briefcase,
    CheckCircle2,
    XCircle,
    Timer,
    Loader2,
    Droplets,
    Sparkles,
    Truck,
    Fuel,
    Store,
    CircleDot,
    Zap,
    PaintBucket,
    Star,
    DollarSign,
    ExternalLink,
    TrendingUp,
    Calendar,
    Image as ImageIcon,
} from "lucide-react";
import {
    ProviderRow,
    ServiceRow,
    ProviderRateRow,
    RequestRow,
    ProviderType,
    OperatingHours,
} from "@/components/admin/types";

// Duplicate type config (keep in sync with ProvidersView)
const PROVIDER_TYPES = [
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
] as const;

function getTypeConfig(type?: string | null) {
    return PROVIDER_TYPES.find(t => t.value === type) || PROVIDER_TYPES[0];
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function cls(...args: (string | boolean | undefined | null)[]): string {
    return args.filter(Boolean).join(" ");
}

function formatDate(iso?: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(iso);
}

const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    accepted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ProviderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [provider, setProvider] = useState<ProviderRow | null>(null);
    const [requests, setRequests] = useState<RequestRow[]>([]);
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [providerServiceIds, setProviderServiceIds] = useState<string[]>([]);
    const [rates, setRates] = useState<ProviderRateRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "timeline">("overview");

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [allProviders, reqs, svcIds, allServices, providerRates] = await Promise.all([
                    listProviders(),
                    listRequestsByProvider(id),
                    getProviderServiceIds(id),
                    listServices(),
                    listProviderRates(id),
                ]);
                const found = (allProviders as ProviderRow[]).find(p => p.id === id);
                setProvider(found || null);
                setRequests(reqs as RequestRow[]);
                setProviderServiceIds(svcIds as string[]);
                setServices(allServices as ServiceRow[]);
                setRates(providerRates as ProviderRateRow[]);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load provider details");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // Computed stats
    const stats = useMemo(() => {
        const total = requests.length;
        const completed = requests.filter(r => r.status === "completed").length;
        const cancelled = requests.filter(r => r.status === "cancelled").length;
        const pending = requests.filter(r => r.status === "pending" || r.status === "accepted" || r.status === "in_progress").length;
        const revenue = completed * (provider?.callout_fee || 0);
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, cancelled, pending, revenue, completionRate };
    }, [requests, provider]);

    // Timeline events from requests
    const timeline = useMemo(() => {
        return [...requests]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 20)
            .map(req => ({
                id: req.id,
                date: req.created_at,
                type: req.status || "pending",
                title: `${req.status === "completed" ? "Completed" : req.status === "cancelled" ? "Cancelled" : req.status === "in_progress" ? "In Progress" : req.status === "accepted" ? "Accepted" : "New"} request`,
                description: `${req.driver_name || "Unknown driver"} — ${req.address_line || "No address"}`,
                details: req.details || null,
            }));
    }, [requests]);

    // Matched services (those the provider offers)
    const providerServices = useMemo(() => {
        return services.filter(s => providerServiceIds.includes(s.id));
    }, [services, providerServiceIds]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4">
                <Wrench className="h-12 w-12 opacity-20" />
                <p>Provider not found</p>
                <button onClick={() => router.push("/admin/providers")} className="text-primary hover:underline text-sm">
                    ← Back to providers
                </button>
            </div>
        );
    }

    const typeConfig = getTypeConfig(provider.provider_type);
    const TypeIcon = typeConfig.icon;
    const hours = provider.operating_hours as OperatingHours | null;

    return (
        <div className="space-y-6 pb-10">
            {/* Back Button */}
            <button
                onClick={() => router.push("/admin/providers")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Providers
            </button>

            {/* Header Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
                {/* Backdrop Image */}
                <div className="h-32 md:h-48 w-full relative overflow-hidden bg-muted">
                    {provider.backdrop_url ? (
                        <img
                            src={provider.backdrop_url}
                            alt="Provider backdrop"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className={cls("w-full h-full opacity-20", typeConfig.bg.replace("/10", ""))} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                </div>

                <div className="px-6 pb-6 flex flex-col md:flex-row gap-6 -mt-12 relative z-10">
                    {/* Logo / Avatar */}
                    <div className="shrink-0">
                        {provider.logo_url ? (
                            <img
                                src={provider.logo_url}
                                alt={provider.display_name}
                                className="h-24 w-24 rounded-2xl object-cover border border-border shadow-md"
                            />
                        ) : (
                            <div className={cls(
                                "h-24 w-24 rounded-2xl flex items-center justify-center border border-border shadow-md",
                                typeConfig.bg, typeConfig.color
                            )}>
                                <TypeIcon className="h-10 w-10" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">{provider.display_name}</h1>
                            <div className="flex items-center gap-2">
                                <span className={cls(
                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                    typeConfig.bg, typeConfig.color
                                )}>
                                    <TypeIcon className="h-3 w-3" />
                                    {typeConfig.label}
                                </span>
                                {provider.is_verified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                                        <ShieldCheck className="h-3 w-3" /> Verified
                                    </span>
                                )}
                                <span className={cls(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                                    provider.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                                )}>
                                    <span className={cls(
                                        "h-1.5 w-1.5 rounded-full",
                                        provider.is_active ? "bg-emerald-500" : "bg-muted-foreground/30"
                                    )} />
                                    {provider.is_active ? "Active" : "Offline"}
                                </span>
                            </div>
                        </div>
                        {provider.about && (
                            <p className="text-sm text-muted-foreground max-w-2xl">{provider.about}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {provider.address_line && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" /> {provider.address_line}
                                </span>
                            )}
                            {provider.phone_business && (
                                <span className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5" /> {provider.phone_business}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" /> Joined {formatDate(provider.created_at)}
                            </span>
                        </div>
                        {/* Contact buttons */}
                        {provider.phone_business && (
                            <div className="flex items-center gap-2 pt-1">
                                <a
                                    href={`tel:${provider.phone_business}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
                                >
                                    <Phone className="h-3 w-3" /> Call
                                </a>
                                <a
                                    href={`https://wa.me/${(provider.phone_business || "").replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                                >
                                    <MessageCircle className="h-3 w-3" /> WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: "Total Jobs", value: stats.total, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Pending", value: stats.pending, icon: Timer, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Completion", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "Revenue", value: `GHS ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                            <div className={cls("p-2 rounded-lg", stat.bg)}>
                                <Icon className={cls("h-4 w-4", stat.color)} />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg border border-border w-fit">
                {(["overview", "jobs", "timeline"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cls(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all capitalize",
                            activeTab === tab
                                ? "bg-card text-foreground shadow-sm border border-border"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Services & Rates */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-primary" /> Services & Rates
                        </h3>
                        {providerServices.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No services assigned</p>
                        ) : (
                            <div className="space-y-2">
                                {providerServices.map((svc) => {
                                    const rate = rates.find(r => r.service_id === svc.id);
                                    return (
                                        <div key={svc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                                            <span className="text-sm font-medium text-foreground">{svc.name}</span>
                                            {rate ? (
                                                <span className="text-sm font-bold text-primary">
                                                    GHS {rate.base_price || 0}
                                                    {rate.price_unit && <span className="text-xs font-normal text-muted-foreground">/{rate.price_unit}</span>}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">No rate set</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="pt-2 grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-muted/30 rounded-lg border border-border">
                                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Callout Fee</span>
                                <span className="font-bold text-foreground">GHS {provider.callout_fee || 0}</span>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg border border-border">
                                <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Coverage</span>
                                <span className="font-bold text-foreground">{provider.coverage_radius_km || 0} km</span>
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" /> Operating Hours
                        </h3>
                        {hours ? (
                            <div className="space-y-1.5">
                                {DAYS.map((day) => {
                                    const schedule = hours[day];
                                    if (!schedule) return null;
                                    const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === day;
                                    return (
                                        <div key={day} className={cls(
                                            "flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors",
                                            isToday ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30"
                                        )}>
                                            <span className={cls(
                                                "text-sm font-medium capitalize w-24",
                                                schedule.closed ? "text-muted-foreground line-through" : "text-foreground",
                                                isToday && "font-bold"
                                            )}>
                                                {day}
                                                {isToday && <span className="text-[10px] ml-1 text-primary font-bold">TODAY</span>}
                                            </span>
                                            {schedule.closed ? (
                                                <span className="text-xs text-muted-foreground italic">Closed</span>
                                            ) : (
                                                <span className="text-sm text-foreground font-mono">
                                                    {schedule.open} — {schedule.close}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No operating hours set</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "jobs" && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h3 className="font-bold text-foreground">Job History ({requests.length})</h3>
                    </div>
                    {requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <Briefcase className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No jobs yet</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                                <tr>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Driver</th>
                                    <th className="px-4 py-3 text-left">Location</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground text-xs">
                                            {formatDate(req.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-foreground">{req.driver_name || "—"}</div>
                                            <div className="text-xs text-muted-foreground">{req.driver_phone || ""}</div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                                            {req.address_line || "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cls(
                                                "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                                statusColors[req.status || "pending"] || statusColors.pending
                                            )}>
                                                {(req.status || "pending").replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                                            {req.details || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === "timeline" && (
                <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-bold text-foreground mb-6">Activity Timeline</h3>
                    {timeline.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <Clock className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No activity yet</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
                            <div className="space-y-6">
                                {timeline.map((event) => {
                                    const statusColor = statusColors[event.type] || statusColors.pending;
                                    return (
                                        <div key={event.id} className="flex gap-4 pl-1">
                                            <div className={cls(
                                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border z-10",
                                                statusColor
                                            )}>
                                                {event.type === "completed" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                                                    event.type === "cancelled" ? <XCircle className="h-3.5 w-3.5" /> :
                                                        event.type === "in_progress" ? <Timer className="h-3.5 w-3.5" /> :
                                                            <Briefcase className="h-3.5 w-3.5" />
                                                }
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-foreground">{event.title}</span>
                                                    <span className="text-xs text-muted-foreground">{timeAgo(event.date)}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                                                {event.details && (
                                                    <p className="text-xs text-muted-foreground/60 mt-0.5 italic">{event.details}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
