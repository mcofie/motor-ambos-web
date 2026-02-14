"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    listAllVehicles,
    VehicleRow,
    updateVehicle
} from "@/lib/supaFetch";
import {
    QrCode,
    Link as LinkIcon,
    RefreshCw,
    Search,
    ExternalLink,
    Car,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cls } from "../ui/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SmartNfcView() {
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyUnlinked, setShowOnlyUnlinked] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleRow | null>(null);
    const [serialInput, setSerialInput] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listAllVehicles();
            setVehicles(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load vehicle inventory");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const generateBase62Id = (length: number = 8) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleOpenLinkDialog = (vehicle: VehicleRow) => {
        setEditingVehicle(vehicle);
        setSerialInput(vehicle.nfc_serial_number || "");
        setIsDialogOpen(true);
    };

    const handleSaveLink = async () => {
        if (!editingVehicle) return;
        if (!serialInput.trim()) {
            toast.error("Please enter a serial number");
            return;
        }

        setUpdatingId(editingVehicle.id);
        const publicId = generateBase62Id(8);

        try {
            await updateVehicle(editingVehicle.id, {
                nfc_card_id: publicId,
                nfc_serial_number: serialInput
            });

            setVehicles(prev => prev.map(v =>
                v.id === editingVehicle.id
                    ? { ...v, nfc_card_id: publicId, nfc_serial_number: serialInput }
                    : v
            ));

            toast.success("Card linked successfully");
            setIsDialogOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to link card");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchSearch = (
            v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.nfc_serial_number?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchStatus = showOnlyUnlinked ? !v.nfc_card_id : true;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-emerald-500" />
                        Smart Card Inventory
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage physical-to-digital vehicle passport mappings.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Total Linked</p>
                        <p className="text-xl font-black text-emerald-600 mt-1">{vehicles.filter(v => v.nfc_card_id).length}</p>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Unlinked</p>
                        <p className="text-xl font-black text-amber-600 mt-1">{vehicles.filter(v => !v.nfc_card_id).length}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by serial, plate, or car name..."
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowOnlyUnlinked(!showOnlyUnlinked)}
                    className={cls(
                        "px-4 py-2.5 rounded-xl text-sm font-bold transition-all border shrink-0",
                        showOnlyUnlinked
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                            : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                    )}
                >
                    {showOnlyUnlinked ? "Showing Unlinked Only" : "Show Unlinked Cards"}
                </button>
                <button
                    onClick={fetchData}
                    className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-emerald-500 rounded-xl transition-all border border-slate-200 dark:border-white/10"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vehicle Entity</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Physical Serial</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Public Passport ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredVehicles.map(v => (
                                <tr key={v.id} className="group hover:bg-emerald-50/20 dark:hover:bg-emerald-500/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors shrink-0">
                                                <Car className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white capitalize">{v.year} {v.make} {v.model}</p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">{v.plate || "No Plate"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {v.nfc_serial_number ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono font-black text-slate-700 dark:text-slate-300">{v.nfc_serial_number}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic font-mono">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        {v.nfc_card_id ? (
                                            <Link
                                                href={`/v/${v.nfc_card_id}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 group/id"
                                            >
                                                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 group-hover/id:underline">{v.nfc_card_id}</span>
                                                <ExternalLink className="h-3 w-3 text-slate-400 group-hover/id:translate-x-0.5 transition-transform" />
                                            </Link>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic font-mono">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        {v.nfc_card_id ? (
                                            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 uppercase tracking-tight">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-200 dark:border-white/10 uppercase tracking-tight">
                                                Not Linked
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleOpenLinkDialog(v)}
                                            disabled={updatingId === v.id}
                                            className={cls(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                v.nfc_card_id
                                                    ? "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                                    : "bg-emerald-500 text-white hover:scale-105 shadow-lg shadow-emerald-500/20 active:scale-95"
                                            )}
                                        >
                                            {updatingId === v.id ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                v.nfc_card_id ? <RefreshCw className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />
                                            )}
                                            {v.nfc_card_id ? "Re-assign" : "Link Card"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredVehicles.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">No matching passports</p>
                        <p className="text-xs text-slate-500 mt-2">Adjust your search or filters.</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <h3 className="text-xl font-black uppercase italic tracking-tight">The Physical-to-Digital Bridge</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Every Motor Ambos Smart Card has a physical serial number (e.g., <span className="text-emerald-400 font-mono">MA-26-00451</span>) on the back.
                        Linking this serial to a vehicle creates a unique, permanent public passport URL.
                        Scan a card. See the history. Trust the car.
                    </p>
                </div>
                <QrCode className="absolute -right-10 -bottom-10 h-64 w-64 text-white/[0.03] rotate-12" />
            </div>

            {/* Link Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Link Smart Card</DialogTitle>
                        <DialogDescription>
                            Enter the physical serial number found on the back of the card.
                        </DialogDescription>
                    </DialogHeader>

                    {editingVehicle && (
                        <div className="space-y-4 py-4">
                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-lg flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <Car className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{editingVehicle.year} {editingVehicle.make} {editingVehicle.model}</p>
                                    <p className="text-xs text-slate-500 font-mono">{editingVehicle.plate || "No Plate"}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Serial Number
                                </label>
                                <Input
                                    placeholder="e.g. MA-26-00451"
                                    value={serialInput}
                                    onChange={(e) => setSerialInput(e.target.value)}
                                    className="font-mono"
                                />
                                <p className="text-[10px] text-slate-400">
                                    This will generate a new public passport URL for the vehicle.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveLink} disabled={!serialInput || updatingId === editingVehicle?.id}>
                            {updatingId === editingVehicle?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <LinkIcon className="h-4 w-4 mr-2" />
                            )}
                            Link Card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
