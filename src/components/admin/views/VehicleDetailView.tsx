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
    updateVehicle,
    bulkAssignNfcCards,
    getVehicleMaintenanceStatus,
    listFuelLogs,
    listDrivingTrips,
    FuelLogRow,
    DrivingTripRow
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
    Link as LinkIcon,
    Image as ImageIcon,
    MapPin,
    X,
    Smartphone,
    Search,
    Shield,
    Fuel,
    Gauge,
    Trophy
} from "lucide-react";
import { cls } from "../ui/AdminUI";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VehicleDetailViewProps {
    vehicleId: string;
    initialVehicle?: VehicleRow | null;
    initialHistory?: ServiceHistoryRow[];
}

export function VehicleDetailView({ vehicleId, initialVehicle, initialHistory }: VehicleDetailViewProps) {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<VehicleRow | null>(initialVehicle || null);
    const [history, setHistory] = useState<ServiceHistoryRow[]>(initialHistory || []);
    const [fuelLogs, setFuelLogs] = useState<FuelLogRow[]>([]);
    const [trips, setTrips] = useState<DrivingTripRow[]>([]);
    const [loading, setLoading] = useState(!initialVehicle);
    const [linking, setLinking] = useState(false);
    const [activeTab, setActiveTab] = useState<"history" | "fuel" | "safety">("history");

    // NFC States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serialInput, setSerialInput] = useState("");
    const [verifying, setVerifying] = useState(false);

    const generateBase62Id = (length: number = 8) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleLinkSmartCard = async () => {
        const cleanSerial = serialInput.trim().toUpperCase();
        if (!cleanSerial) {
            toast.error("Please enter a serial number");
            return;
        }

        setVerifying(true);
        try {
            // 1. Verify existence and status
            const vRes = await fetch("/api/admin-nfc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "verify_card",
                    serial_number: cleanSerial
                })
            });

            if (!vRes.ok) {
                const err = await vRes.json();
                toast.error(err.error || "Card verification failed");
                return;
            }

            // 2. Perform Link
            await bulkAssignNfcCards([{
                vehicle_id: vehicleId,
                serial_number: cleanSerial
            }]);

            toast.success("Smart Card linked successfully");
            setIsModalOpen(false);
            setSerialInput("");

            // Refresh vehicle data
            const updated = await getVehicleById(vehicleId);
            if (updated) setVehicle(updated);
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to link Smart Card: " + (err.message || "Unknown error"));
        } finally {
            setVerifying(false);
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch vehicle if not provided as initial prop
            if (!vehicle) {
                const v = await getVehicleById(vehicleId);
                if (!v) {
                    toast.error("Vehicle not found");
                    router.back();
                    return;
                }
                setVehicle(v);
            }

            // Always fetch dynamic data (history, fuel logs, trips)
            const [h, f, t] = await Promise.all([
                listServiceHistory(vehicleId),
                listFuelLogs(vehicleId),
                listDrivingTrips(vehicleId)
            ]);
            setHistory(h);
            setFuelLogs(f);
            setTrips(t);
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

                            {/* Maintenance Advisor Section */}
                            <div className="pt-4 border-t border-border space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Maintenance Health
                                    {getVehicleMaintenanceStatus(vehicle).oilChangeStatus === 'HEALTHY' ? (
                                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Healthy</span>
                                    ) : (
                                        <span className="text-amber-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Attention</span>
                                    )}
                                </h4>

                                {(() => {
                                    const status = getVehicleMaintenanceStatus(vehicle);
                                    const statusColors = {
                                        HEALTHY: "bg-emerald-500",
                                        UPCOMING: "bg-amber-500",
                                        OVERDUE: "bg-rose-500"
                                    };

                                    return (
                                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
                                                    <span className="text-slate-400">Oil Life</span>
                                                    <span className={status.oilChangeStatus === 'OVERDUE' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}>
                                                        {status.kmRemaining.toLocaleString()} KM Left
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden border border-border/50">
                                                    <div
                                                        className={cls("h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]", statusColors[status.oilChangeStatus])}
                                                        style={{ width: `${status.percentLife}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-border/50 shadow-sm">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Current</p>
                                                    <p className="text-xs font-bold font-mono">{(vehicle.current_mileage || 0).toLocaleString()} km</p>
                                                </div>
                                                <div className="p-2 bg-white dark:bg-white/5 rounded-xl border border-border/50 shadow-sm">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Last Change</p>
                                                    <p className="text-xs font-bold font-mono">{(vehicle.last_oil_change_mileage || 0).toLocaleString()} km</p>
                                                </div>
                                            </div>

                                            {/* Anti-Cheat Estimator */}
                                            <div className="pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShieldCheck className="h-3 w-3 text-indigo-500" />
                                                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Fair Price Advisor</span>
                                                </div>
                                                <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group/fair">
                                                    <div className="absolute top-0 right-0 p-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                                                        Fair price for a standard oil change:
                                                        <span className="block text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1 tracking-tight">GHS 280 — 350</span>
                                                    </p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-[8px] text-indigo-400 font-bold uppercase">Market Average Analysis</span>
                                                        <button className="text-[8px] font-bold text-indigo-600 hover:underline uppercase">Vetted Shops &rarr;</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Smart Card Section */}
                            <div className="pt-4 border-t border-border space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    Smart Passport ID
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
                                                onClick={() => setIsModalOpen(true)}
                                                disabled={linking}
                                                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors border-t border-border/50 mt-2 pt-2"
                                            >
                                                <RefreshCw className="h-3 w-3" />
                                                Regenerate Card Link
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-2 space-y-3">
                                            <p className="text-xs text-slate-500">No smart card linked to this vehicle passport.</p>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                disabled={linking}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                <LinkIcon className="h-4 w-4" />
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

                <div className="lg:col-span-2 space-y-6">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-6 border-b border-border w-full">
                            <button
                                onClick={() => setActiveTab("history")}
                                className={cls(
                                    "pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border-b-2",
                                    activeTab === "history" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Clock className="h-4 w-4" />
                                Service History ({history.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("fuel")}
                                className={cls(
                                    "pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border-b-2",
                                    activeTab === "fuel" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Fuel className="h-4 w-4" />
                                Fuel Logs ({fuelLogs.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("safety")}
                                className={cls(
                                    "pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border-b-2",
                                    activeTab === "safety" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Gauge className="h-4 w-4" />
                                Safety Score
                            </button>
                        </div>
                    </section>

                    <div className="space-y-4">
                        {activeTab === "history" && (
                            history.length > 0 ? (
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

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Provider</label>
                                                    <p className="text-xs font-medium truncate">{h.provider_name || "Self Reported"}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Location</label>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-2.5 w-2.5 text-rose-500" />
                                                        <p className="text-xs font-medium truncate">{h.location || "N/A"}</p>
                                                    </div>
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

                                            {h.document_url && (
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Service Verification Photo</label>
                                                    <div className="flex items-start gap-4">
                                                        <a
                                                            href={h.document_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="relative block w-40 aspect-[3/2] rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all group shadow-sm shrink-0"
                                                        >
                                                            <img
                                                                src={h.document_url}
                                                                alt="Service document"
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <ExternalLink className="h-5 w-5 text-white" />
                                                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">View Full Size</span>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        {h.document_metadata && (
                                                            <div className="py-2 space-y-2">
                                                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                                                    <ImageIcon className="h-3 w-3" />
                                                                    <span className="text-[10px] font-bold uppercase tracking-tight">Image Meta</span>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {h.document_metadata.name && (
                                                                        <p className="text-[10px] text-muted-foreground flex items-center justify-between gap-4 pb-1 border-b border-border/30">
                                                                            <span>File:</span>
                                                                            <span className="font-mono font-bold text-foreground truncate max-w-[120px]">
                                                                                {h.document_metadata.name}
                                                                            </span>
                                                                        </p>
                                                                    )}
                                                                    <p className="text-[10px] text-muted-foreground flex items-center justify-between gap-4">
                                                                        <span>Size:</span>
                                                                        <span className="font-mono font-bold text-foreground">
                                                                            {h.document_metadata.size ? `${(h.document_metadata.size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-[10px] text-muted-foreground flex items-center justify-between gap-4">
                                                                        <span>Type:</span>
                                                                        <span className="font-mono font-bold text-foreground uppercase">
                                                                            {h.document_metadata.type?.split('/')[1] || "N/A"}
                                                                        </span>
                                                                    </p>
                                                                    {h.document_metadata.lastModified && (
                                                                        <p className="text-[10px] text-muted-foreground flex items-center justify-between gap-4">
                                                                            <span>Uploaded:</span>
                                                                            <span className="font-mono font-bold text-foreground flex items-center gap-1">
                                                                                <Clock className="h-2 w-2" />
                                                                                {new Date(h.document_metadata.lastModified).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                                            </span>
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                    <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">No recorded service history</p>
                                </div>
                            )
                        )}

                        {activeTab === "fuel" && (
                            fuelLogs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fuelLogs.map(log => (
                                        <div key={log.id} className="bg-card rounded-2xl border border-border p-5 hover:border-primary/20 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                                                        <Fuel className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm tracking-tight">{log.station_name || "Unknown Station"}</h4>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{new Date(log.date || log.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-emerald-600">GHS {log.total_cost?.toLocaleString()}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{log.liters} {log.fuel_type || "L"}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Odometer</label>
                                                    <p className="text-xs font-mono font-bold">{(log.odometer_reading || 0).toLocaleString()} km</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Unit Price</label>
                                                    <p className="text-xs font-mono font-bold">GHS {log.price_per_liter?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                    <Fuel className="h-10 w-10 text-slate-300 mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">No fuel logs recorded</p>
                                </div>
                            )
                        )}

                        {activeTab === "safety" && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-2xl p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Trophy className="h-32 w-32 rotate-12" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 mb-2">Aggregate Driving Score</h4>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-6xl font-black tracking-tighter">
                                                {trips.length > 0 ? Math.round(trips.reduce((acc, t) => acc + t.average_score, 0) / trips.length) : "--"}
                                            </span>
                                            <span className="text-xl font-bold text-white/40">/ 100</span>
                                        </div>
                                        <p className="mt-4 text-white/80 max-w-sm text-sm font-medium">
                                            Based on the last {trips.length} trips recorded by the telematics unit.
                                        </p>
                                    </div>
                                </div>

                                {trips.length > 0 ? (
                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Recent Trips</h5>
                                        {trips.map(trip => (
                                            <div key={trip.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cls(
                                                        "h-10 w-10 rounded-lg flex items-center justify-center font-bold",
                                                        trip.average_score >= 80 ? "bg-emerald-500/10 text-emerald-600" :
                                                            trip.average_score >= 60 ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                                                    )}>
                                                        {Math.round(trip.average_score)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{new Date(trip.start_time).toLocaleDateString()}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{trip.distance_km.toFixed(1)} km traveled</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                                                    <p className="text-xs font-mono font-bold">
                                                        {Math.round((new Date(trip.end_time).getTime() - new Date(trip.start_time).getTime()) / 60000)} mins
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center bg-muted/20">
                                        <Gauge className="h-10 w-10 text-slate-300 mb-3" />
                                        <p className="text-sm text-slate-500 font-medium">No driving trips recorded yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NFC Linking Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => !verifying && setIsModalOpen(open)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Link Smart Card</DialogTitle>
                        <DialogDescription>Enter the physical serial number found on the back of the card to connect it to this passport.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4 border-y border-border my-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Target Vehicle</label>
                            <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-4 border border-border/50">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <Car className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm tracking-tight">{vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{vehicle?.plate || "No Plate"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Physical Serial Number</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <Input
                                    autoFocus
                                    className="w-full pl-9 h-11 bg-background border border-input rounded-lg font-mono font-bold uppercase placeholder:font-sans placeholder:font-normal"
                                    placeholder="e.g. MA-26-00012"
                                    value={serialInput}
                                    onChange={(e) => setSerialInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && serialInput && !verifying) handleLinkSmartCard();
                                    }}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 ml-1">Alphanumeric ID printed on the physical card inventory.</p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-lg h-11 px-6 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLinkSmartCard}
                            disabled={verifying || !serialInput.trim()}
                            className="bg-primary text-white hover:bg-primary/90 rounded-lg h-11 px-8 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10 transition-all"
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Linking...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4 mr-2" />
                                    Link Card
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
