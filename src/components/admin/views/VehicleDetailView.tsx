"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    getVehicleById,
    listServiceHistory,
    VehicleRow,
    ServiceHistoryRow,
    getMemberById,
    updateVehicle
} from "@/lib/supaFetch";
import {
    ArrowLeft,
    Car,
    Calendar,
    Wrench,
    FileText,
    ShieldCheck,
    Clock,
    ExternalLink,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    Tag,
    QrCode,
    RefreshCw,
    Link as LinkIcon
} from "lucide-react";
import { cls } from "../ui/AdminUI";
import { toast } from "sonner";

interface VehicleDetailViewProps {
    vehicleId: string;
    initialVehicle?: VehicleRow | null;
    initialHistory?: ServiceHistoryRow[];
}

export function VehicleDetailView({ vehicleId, initialVehicle, initialHistory }: VehicleDetailViewProps) {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<VehicleRow | null>(initialVehicle || null);
    const [history, setHistory] = useState<ServiceHistoryRow[]>(initialHistory || []);
    const [loading, setLoading] = useState(!initialVehicle);
    const [linking, setLinking] = useState(false);

    const generateBase62Id = (length: number = 8) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleLinkSmartCard = async () => {
        if (!vehicle) return;
        const serialNum = window.prompt(`Enter Physical Card Serial Number (e.g., MA-26-00451):`, vehicle.nfc_serial_number || "");
        if (!serialNum) return;

        const newId = generateBase62Id(8);
        setLinking(true);
        try {
            await updateVehicle(vehicle.id, {
                nfc_card_id: newId,
                nfc_serial_number: serialNum
            });
            setVehicle({ ...vehicle, nfc_card_id: newId, nfc_serial_number: serialNum });
            toast.success("Smart Card linked successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to link Smart Card");
        } finally {
            setLinking(false);
        }
    };

    const fetchData = useCallback(async () => {
        if (initialVehicle) return;
        setLoading(true);
        try {
            const v = await getVehicleById(vehicleId);
            if (!v) {
                toast.error("Vehicle not found");
                router.back();
                return;
            }
            setVehicle(v);

            const h = await listServiceHistory(vehicleId);
            setHistory(h);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load vehicle details");
        } finally {
            setLoading(false);
        }
    }, [vehicleId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!vehicle) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors group"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {vehicle.plate || "NO PLATE"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Vehicle Main Card */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                        <div className="h-32 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                            <Car className="h-20 w-20 text-white/10 absolute -right-4 -bottom-4 rotate-12" />
                            <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <Car className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Year</label>
                                    <p className="font-semibold">{vehicle.year}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Make</label>
                                    <p className="font-semibold">{vehicle.make}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Model</label>
                                    <p className="font-semibold">{vehicle.model}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Plate</label>
                                    <p className="font-mono font-bold text-primary">{vehicle.plate || "—"}</p>
                                </div>
                            </div>

                            {/* Smart Card Section */}
                            <div className="pt-4 border-t border-border space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Smart Card Profile
                                    {vehicle.nfc_card_id && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    )}
                                </h4>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border space-y-3">
                                    {vehicle.nfc_card_id ? (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                        <QrCode className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Public Passport ID</p>
                                                        <p className="text-sm font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">{vehicle.nfc_card_id}</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/v/${vehicle.nfc_card_id}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-primary"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            {vehicle.nfc_serial_number && (
                                                <div className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-between">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Physical Serial</span>
                                                    <span className="text-[10px] font-mono font-black text-slate-600 dark:text-slate-300">{vehicle.nfc_serial_number}</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleLinkSmartCard}
                                                disabled={linking}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-border/50 mt-2 pt-2"
                                            >
                                                {linking ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                                Regenerate Card Link
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-2 space-y-3">
                                            <p className="text-xs text-slate-500">No smart card linked to this vehicle passport.</p>
                                            <button
                                                onClick={handleLinkSmartCard}
                                                disabled={linking}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
                                                Link Smart Card
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Documents</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-border">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className={cls("h-5 w-5", vehicle.insurance_url ? "text-emerald-500" : "text-slate-300")} />
                                            <span className="text-sm font-medium">Insurance Policy</span>
                                        </div>
                                        {vehicle.insurance_url ? (
                                            <a href={vehicle.insurance_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Missing</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-border">
                                        <div className="flex items-center gap-3">
                                            <FileText className={cls("h-5 w-5", vehicle.roadworthy_url ? "text-emerald-500" : "text-slate-300")} />
                                            <span className="text-sm font-medium">Roadworthy Cert.</span>
                                        </div>
                                        {vehicle.roadworthy_url ? (
                                            <a href={vehicle.roadworthy_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Missing</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Service History */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Service History ({history.length})
                        </h3>
                    </section>

                    <div className="space-y-4">
                        {history.length > 0 ? (
                            history.map((h, i) => (
                                <div key={h.id} className="relative pl-8 group">
                                    {/* Timeline Line */}
                                    {i !== history.length - 1 && (
                                        <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-slate-200 dark:bg-white/5" />
                                    )}

                                    {/* Timeline Node */}
                                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <Wrench className="h-3 w-3" />
                                    </div>

                                    <div className="bg-card rounded-2xl border border-border p-5 hover:border-primary/20 transition-all">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white capitalize">{h.description}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(h.service_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                </p>
                                            </div>
                                            {h.is_verified && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Provider</label>
                                                <p className="text-xs font-medium truncate">{h.provider_name || "Self Reported"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Mileage</label>
                                                <p className="text-xs font-medium">{(h.mileage || 0).toLocaleString()} km</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Cost</label>
                                                <p className="text-xs font-bold text-emerald-600">GHS {(h.cost || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                                <p className="text-sm text-slate-500 font-medium">No recorded service history</p>
                                <p className="text-xs text-slate-400 mt-1">Updates from the provider app will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
