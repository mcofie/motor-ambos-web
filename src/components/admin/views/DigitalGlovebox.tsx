"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Car,
    FileText,
    History,
    CheckCircle2,
    Plus,
    ClipboardCheck,
    Calendar,
    Wallet,
    Shield,
    Smartphone,
    ExternalLink,
    Loader2
} from "lucide-react";
import {
    VehicleRow,
    ServiceHistoryRow,
    listServiceHistory,
    upsertServiceHistory
} from "@/lib/supaFetch";
import { cls } from "../ui/AdminUI";
import { toast } from "sonner";

interface DigitalGloveboxProps {
    membershipId: string;
    memberName: string;
    vehicles: VehicleRow[];
    onClose: () => void;
}

export function DigitalGlovebox({ membershipId, memberName, vehicles, onClose }: DigitalGloveboxProps) {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(vehicles[0] || null);
    const [history, setHistory] = useState<ServiceHistoryRow[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isAddingHistory, setIsAddingHistory] = useState(false);
    const [newHistory, setNewHistory] = useState({
        description: "",
        service_date: new Date().toISOString().split('T')[0],
        provider_name: "",
        mileage: "",
        cost: "",
    });

    useEffect(() => {
        if (selectedVehicle) {
            loadHistory(selectedVehicle.id);
        }
    }, [selectedVehicle]);

    const loadHistory = async (vehicleId: string) => {
        setLoadingHistory(true);
        try {
            const data = await listServiceHistory(vehicleId);
            setHistory(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load service history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleAddHistory = async () => {
        if (!selectedVehicle) return;
        try {
            await upsertServiceHistory({
                vehicle_id: selectedVehicle.id,
                description: newHistory.description,
                service_date: newHistory.service_date,
                provider_name: newHistory.provider_name,
                mileage: newHistory.mileage ? Number(newHistory.mileage) : null,
                cost: newHistory.cost ? Number(newHistory.cost) : null,
                is_verified: true, // Admin entries are verified by default
            });
            toast.success("Service record added");
            loadHistory(selectedVehicle.id);
            setIsAddingHistory(false);
            setNewHistory({
                description: "",
                service_date: new Date().toISOString().split('T')[0],
                provider_name: "",
                mileage: "",
                cost: "",
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add service record");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-end">
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full md:w-[600px] h-full bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
                {/* Header */}
                <header className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-emerald-500" />
                            Digital Glovebox
                        </h2>
                        <p className="text-sm text-slate-500">{memberName}'s Fleet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Vehicle Selector */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Vehicle</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                            {vehicles.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVehicle(v)}
                                    className={cls(
                                        "flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all shrink-0 w-44 text-left",
                                        selectedVehicle?.id === v.id
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                                    )}
                                >
                                    <Car className={cls("h-5 w-5 mb-1", selectedVehicle?.id === v.id ? "text-emerald-500" : "text-slate-400")} />
                                    <span className="font-bold text-sm block">
                                        {v.year} {v.make} {v.model}
                                    </span>
                                    <span className="text-[10px] font-mono uppercase tracking-tighter opacity-70">{v.plate}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {selectedVehicle && (
                        <>
                            {/* Digital Docs & NFC */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <section className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <Smartphone className="h-6 w-6 opacity-80" />
                                        <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">NFC Active</div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">Smart NFC Link</h3>
                                    <p className="text-xs text-white/70 mb-4">Point NFC tag to: amb.os/v/{selectedVehicle.id.slice(0, 8)}</p>
                                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all">
                                        <ExternalLink className="h-3 w-3" />
                                        Test Live Link
                                    </button>
                                </section>

                                <section className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Shield className="h-5 w-5 text-emerald-500" />
                                        <span className="font-bold text-sm">Active Documents</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-medium uppercase tracking-tight">Insurance</span>
                                            </div>
                                            <FileText className="h-3 w-3 text-slate-400 cursor-pointer hover:text-emerald-500" />
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-medium uppercase tracking-tight">Roadworthy</span>
                                            </div>
                                            <FileText className="h-3 w-3 text-slate-400 cursor-pointer hover:text-emerald-500" />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Service History */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <History className="h-3 w-3" />
                                        Verified Service History
                                    </h3>
                                    <button
                                        onClick={() => setIsAddingHistory(!isAddingHistory)}
                                        className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {isAddingHistory && (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-emerald-500/20 space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="date"
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                                value={newHistory.service_date}
                                                onChange={(e) => setNewHistory({ ...newHistory, service_date: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Service Center Name"
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                                value={newHistory.provider_name}
                                                onChange={(e) => setNewHistory({ ...newHistory, provider_name: e.target.value })}
                                            />
                                        </div>
                                        <textarea
                                            placeholder="What was done? (e.g. Full engine service, brake pad replacement)"
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-3 text-xs focus:ring-1 focus:ring-emerald-500 outline-none h-20 resize-none"
                                            value={newHistory.description}
                                            onChange={(e) => setNewHistory({ ...newHistory, description: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="number"
                                                placeholder="Mileage (km)"
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                                value={newHistory.mileage}
                                                onChange={(e) => setNewHistory({ ...newHistory, mileage: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Total Cost (GHS)"
                                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                                value={newHistory.cost}
                                                onChange={(e) => setNewHistory({ ...newHistory, cost: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => setIsAddingHistory(false)}
                                                className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-bold uppercase transition-colors hover:bg-slate-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddHistory}
                                                className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                            >
                                                Save Record
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {loadingHistory ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                        </div>
                                    ) : history.length > 0 ? (
                                        history.map((item, idx) => (
                                            <div key={item.id} className="relative pl-6 pb-6 last:pb-0 group">
                                                {/* Timeline Line */}
                                                <div className="absolute left-1.5 top-2 bottom-0 w-px bg-slate-200 dark:bg-white/5 group-last:bg-transparent" />
                                                {/* Timeline Dot */}
                                                <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 bg-emerald-500 shadow-[0_0_10px_#10b981]" />

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                            {new Date(item.service_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        {item.is_verified && (
                                                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-bold">
                                                                <CheckCircle2 className="h-2 w-2" /> VERIFIED
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{item.description}</h4>
                                                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <ClipboardCheck className="h-3 w-3" />
                                                            {item.provider_name || "Self Recorded"}
                                                        </span>
                                                        {item.mileage && (
                                                            <span className="flex items-center gap-1">
                                                                <History className="h-3 w-3" />
                                                                {item.mileage.toLocaleString()} km
                                                            </span>
                                                        )}
                                                        {item.cost && (
                                                            <span className="flex items-center gap-1">
                                                                <Wallet className="h-3 w-3" />
                                                                GHS {item.cost.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                                            <History className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                            <p className="text-xs text-slate-400">No service records found for this vehicle.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                {/* Footer / Quick Actions */}
                <footer className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                    <button className="w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl text-sm transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2">
                        Export Full PDF History
                        <FileText className="h-4 w-4" />
                    </button>
                </footer>
            </div>
        </div>
    );
}
