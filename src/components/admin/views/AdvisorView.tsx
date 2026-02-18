"use client";

import React, { useEffect, useState } from "react";
import {
    listAllVehicles,
    listProviders,
    getVehicleMaintenanceStatus,
    VehicleRow,
    getMarketFairPrice,
    FairPriceEstimate
} from "@/lib/supaFetch";
import {
    Wrench,
    Car,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    TrendingDown,
    ShieldCheck,
    Star,
    MapPin,
    Loader2
} from "lucide-react";
import { cls } from "../ui/AdminUI";
import Link from "next/link";

export function AdvisorView() {
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [oilPrice, setOilPrice] = useState<FairPriceEstimate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [vData, pData, priceData] = await Promise.all([
                    listAllVehicles(),
                    listProviders(),
                    getMarketFairPrice('OIL_CHANGE')
                ]);
                setVehicles(vData);
                setProviders(pData.filter(p => p.is_verified).slice(0, 3));
                setOilPrice(priceData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const maintenanceFleet = vehicles.map(v => ({
        ...v,
        status: getVehicleMaintenanceStatus(v)
    }));

    const needingAttention = maintenanceFleet.filter(v => v.status.oilChangeStatus !== 'HEALTHY');
    const healthyCount = maintenanceFleet.length - needingAttention.length;

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Healthy Fleet</p>
                        <p className="text-2xl font-black">{healthyCount} <span className="text-sm font-medium text-slate-400">Vehicles</span></p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Needs Attention</p>
                        <p className="text-2xl font-black">{needingAttention.length} <span className="text-sm font-medium text-slate-400">Vehicles</span></p>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <TrendingDown className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Oil Life</p>
                        <p className="text-2xl font-black">
                            {vehicles.length > 0
                                ? Math.round(maintenanceFleet.reduce((a, b) => a + b.status.percentLife, 0) / vehicles.length)
                                : 0}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Maintenance List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                            <h3 className="font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Maintenance Pulse
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Fleet Scan</span>
                        </div>
                        <div className="divide-y divide-border">
                            {maintenanceFleet.map(v => (
                                <Link
                                    key={v.id}
                                    href={`/admin/vehicles/${v.id}`}
                                    className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center relative overflow-hidden">
                                            <Car className="h-6 w-6 text-slate-400 group-hover:scale-110 transition-transform" />
                                            <div className={cls(
                                                "absolute bottom-0 left-0 w-full h-1",
                                                v.status.oilChangeStatus === 'HEALTHY' ? 'bg-emerald-500' :
                                                    v.status.oilChangeStatus === 'UPCOMING' ? 'bg-amber-500' : 'bg-rose-500'
                                            )} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{v.make} {v.model}</p>
                                            <p className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-2 uppercase">
                                                {v.plate || "No Plate"}
                                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                {(v.current_mileage || 0).toLocaleString()} KM
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Next Oil Change</p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-24 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={cls(
                                                            "h-full rounded-full",
                                                            v.status.oilChangeStatus === 'HEALTHY' ? 'bg-emerald-500' :
                                                                v.status.oilChangeStatus === 'UPCOMING' ? 'bg-amber-500' : 'bg-rose-500'
                                                        )}
                                                        style={{ width: `${v.status.percentLife}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold">{v.status.kmRemaining.toLocaleString()} KM</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommendations Side */}
                <div className="space-y-6">
                    {/* Anti-Cheat Estimator */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Anti-Cheat Advisor</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold">Standard Price Index</h4>
                                <p className="text-xs text-slate-400 mt-1">Based on {oilPrice?.sampleSize || 0} verified providers in the network.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Oil Change Fair Quote</p>
                                <p className="text-xl font-black mt-1">
                                    {oilPrice?.currency || "GHS"} {oilPrice?.range[0] || 250} — {oilPrice?.range[1] || 350}
                                </p>
                                <div className="mt-3 flex items-center justify-between text-[9px] font-bold">
                                    <span className="text-emerald-500">MARKET AVERAGE: {oilPrice?.average || 300}</span>
                                    <span className="text-slate-500 uppercase">Updated Daily</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">Use these rates to verify mechanic quotes and prevent overcharging.</p>
                        </div>
                    </div>

                    {/* Vetted Shops */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            Premium Vetted Shops
                        </h4>
                        <div className="space-y-4">
                            {providers.map(p => (
                                <div key={p.id} className="flex items-start gap-3 group">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                                        {p.logo_url ? (
                                            <img src={p.logo_url} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Wrench className="h-full w-full p-2.5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h5 className="text-xs font-bold truncate">{p.display_name || p.name}</h5>
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-2 w-2 text-rose-500" />
                                            {p.address_line || "Main St, Accra"}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200/50">4.9 STAR</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">120+ JOBS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest border border-border">
                            View All Providers &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
