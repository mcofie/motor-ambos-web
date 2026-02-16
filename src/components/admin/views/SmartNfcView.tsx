"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    listAllVehicles,
    VehicleRow,
    updateVehicle,
    listNfcCards,
    NfcCardRow,
    createNfcCardBatch,
    listNfcRequests,
    NfcRequestRow,
    updateNfcRequestStatus,
    listMembersWithMemberships,
    MemberWithMembershipRow,
    bulkAssignNfcCards,
    updateNfcCard,
    deleteNfcCard
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
    Loader2,
    Plus,
    CreditCard,
    Package,
    Truck,
    CheckSquare,
    ChevronRight,
    Building2,
    Layers,
    Trash2,
    Edit
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cls, StatCard } from "../ui/AdminUI";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SmartNfcView() {
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [cards, setCards] = useState<NfcCardRow[]>([]);
    const [requests, setRequests] = useState<NfcRequestRow[]>([]);
    const [members, setMembers] = useState<MemberWithMembershipRow[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Dialog State
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleRow | null>(null);
    const [serialInput, setSerialInput] = useState("");

    // Batch Dialog
    const [isBatchOpen, setIsBatchOpen] = useState(false);
    const [batchSerials, setBatchSerials] = useState("");
    const [batchId, setBatchId] = useState("");
    const [generateCount, setGenerateCount] = useState(1);
    const [generatePrefix, setGeneratePrefix] = useState("MA-26-");

    // Card Edit Dialog
    const [isCardEditOpen, setIsCardEditOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<any>(null);

    // Bulk Mode
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [bulkOrgId, setBulkOrgId] = useState("");

    const organizations = members.filter(m => m.is_business && (m.business_name || m.full_name));

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const [vData, cData, rData, mData] = await Promise.all([
                listAllVehicles(signal),
                listNfcCards(signal),
                listNfcRequests(signal),
                listMembersWithMemberships(signal)
            ]);
            setVehicles(vData || []);
            setCards(cData || []);
            setRequests(rData || []);
            setMembers(mData || []);
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const generateBase62Id = (length: number = 8) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const generateBatchId = () => {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        setBatchId(`BATCH-${date}-${rand}`);
    };

    const handleGenerateSerials = () => {
        const existingIndices = cards.map(c => {
            const match = c.serial_number.match(/\d+$/);
            return match ? parseInt(match[0], 10) : 0;
        });

        let lastIndex = Math.max(0, ...existingIndices);
        const newSerials: string[] = [];

        for (let i = 0; i < generateCount; i++) {
            lastIndex++;
            const padded = lastIndex.toString().padStart(5, '0');
            newSerials.push(`${generatePrefix}${padded}`);
        }

        const currentContent = batchSerials.trim();
        setBatchSerials(currentContent ? `${currentContent}\n${newSerials.join('\n')}` : newSerials.join('\n'));
        toast.info(`Generated ${generateCount} serials`);
    };

    const handleOpenLinkDialog = (vehicle: VehicleRow) => {
        setEditingVehicle(vehicle);
        setSerialInput(vehicle.nfc_serial_number || "");
        setIsLinkDialogOpen(true);
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
            toast.success("Card linked successfully");
            setIsLinkDialogOpen(false);
            fetchData();
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
            toast.error("Failed to link card");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEditCard = (item: any) => {
        setEditingCard(item);
        setIsCardEditOpen(true);
    };

    const handleUpdateCardSave = async () => {
        if (!editingCard || editingCard.id.toString().startsWith('legacy-')) {
            toast.error("Legacy cards cannot be edited directly.");
            return;
        }

        setUpdatingId(editingCard.id);
        try {
            await updateNfcCard(editingCard.id, {
                serial_number: editingCard.serial_number,
                status: editingCard.status,
                batch_id: editingCard.batch_id
            });
            toast.success("Card updated");
            setIsCardEditOpen(false);
            fetchData();
        } catch (e: any) {
            if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
            toast.error("Update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteCard = async (id: string) => {
        if (id.startsWith('legacy-')) {
            toast.error("Legacy entries cannot be deleted.");
            return;
        }

        if (!confirm("Are you sure you want to delete this card?")) return;

        setUpdatingId(id);
        try {
            await deleteNfcCard(id);
            toast.success("Card deleted");
            fetchData();
        } catch (e: any) {
            if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
            toast.error("Delete failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleBulkAssign = async () => {
        if (selectedVehicleIds.length === 0) return;
        const availableCards = cards.filter(c => c.status === 'MANUFACTURED');
        if (availableCards.length < selectedVehicleIds.length) {
            toast.error("Not enough available cards.");
            return;
        }

        setUpdatingId('bulk');
        try {
            const mappings = selectedVehicleIds.map((vId, idx) => ({
                vehicle_id: vId,
                serial_number: availableCards[idx].serial_number
            }));
            await bulkAssignNfcCards(mappings);
            toast.success(`Assigned ${selectedVehicleIds.length} cards`);
            setSelectedVehicleIds([]);
            setIsBulkAssignOpen(false);
            fetchData();
        } catch (e: any) {
            if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
            toast.error("Bulk assignment failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleOrgSelectForBulk = (orgId: string) => {
        setBulkOrgId(orgId);
        if (orgId === "NONE") {
            setSelectedVehicleIds([]);
            return;
        }
        const orgVehicles = vehicles.filter(v => v.user_id === orgId && !v.nfc_serial_number);
        setSelectedVehicleIds(orgVehicles.map(v => v.id));
    };

    const handleCreateBatch = async () => {
        const lines = batchSerials.split('\n').map(s => s.trim()).filter(s => s);
        if (lines.length === 0) return;

        setUpdatingId('batch');
        try {
            await createNfcCardBatch(lines, batchId || new Date().toISOString().split('T')[0]);
            toast.success(`Created ${lines.length} cards`);
            setBatchSerials("");
            setBatchId("");
            setIsBatchOpen(false);
            fetchData();
        } catch (e: any) {
            if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
            toast.error("Failed to create batch.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleUpdateRequest = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            await updateNfcRequestStatus(id, status);
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            toast.success("Status updated");
        } catch (e: any) {
            if (e.name === 'AbortError' || e.message?.includes('aborted')) return;
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Derived State
    const allSerials = new Set([
        ...cards.map(c => c.serial_number),
        ...vehicles.map(v => v.nfc_serial_number).filter(Boolean) as string[]
    ]);

    const inventoryList = Array.from(allSerials).map(serial => {
        const cardRecord = cards.find(c => c.serial_number === serial);
        const linkedVehicle = vehicles.find(v => v.nfc_serial_number === serial);
        return {
            id: cardRecord?.id || `legacy-${serial}`,
            serial_number: serial,
            batch_id: cardRecord?.batch_id,
            status: cardRecord?.status || (linkedVehicle ? 'ASSIGNED' : 'UNKNOWN'),
            linkedVehicle
        };
    });

    const filteredInventory = inventoryList.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
            item.serial_number.toLowerCase().includes(q) ||
            item.batch_id?.toLowerCase().includes(q) ||
            item.linkedVehicle?.plate?.toLowerCase().includes(q) ||
            item.linkedVehicle?.make?.toLowerCase().includes(q)
        );
    });

    if (loading && vehicles.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalCards = cards.length;
    const unlinkedCards = cards.filter(c => !c.vehicle_id).length;
    const pendingRequestsCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in duration-700">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total NFC Cards" value={totalCards} icon={CreditCard} color="bg-indigo-500" />
                <StatCard title="Unlinked Cards" value={unlinkedCards} icon={Package} color="bg-amber-500" />
                <StatCard title="Pending Requests" value={pendingRequestsCount} icon={Clock} color="bg-rose-500" />
            </div>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Unified Toolbar */}
                <div className="p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-card">
                    <div className="flex bg-muted/30 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={cls(
                                "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                                activeTab === 'inventory' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={cls(
                                "px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2",
                                activeTab === 'requests' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Requests
                            {pendingRequestsCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                                    {pendingRequestsCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 w-full md:w-auto relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-foreground"
                            placeholder={activeTab === 'inventory' ? "Search cards..." : "Search requests..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {activeTab === 'inventory' ? (
                            <>
                                <button onClick={() => setIsBatchOpen(true)} className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors shadow-sm">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Batch</span>
                                </button>
                                <button onClick={() => setIsBulkAssignOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                    <Layers className="h-4 w-4" />
                                    <span>Bulk Assign</span>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => fetchData()} className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/30 hover:bg-primary/10 rounded-lg">
                                <RefreshCw className={cls("h-4 w-4", loading && "animate-spin")} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-muted/20">
                    {activeTab === 'inventory' ? (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">Card Details</th>
                                    <th className="px-6 py-3">Batch</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Linked Vehicle</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {filteredInventory.map(card => (
                                    <tr key={card.id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-mono font-bold text-sm tracking-wide">{card.serial_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-tighter">
                                                {card.batch_id || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {card.linkedVehicle ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-tight">
                                                    <CheckCircle2 className="h-3 w-3" /> Assigned
                                                </span>
                                            ) : card.status === 'MANUFACTURED' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase tracking-tight">
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border border-border uppercase tracking-tight">
                                                    {card.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {card.linkedVehicle ? (
                                                <Link href={`/admin/vehicles/${card.linkedVehicle.id}`} className="flex items-center gap-2 group/link">
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                        <Car className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-foreground group-hover/link:text-primary transition-colors">
                                                            {card.linkedVehicle.make} {card.linkedVehicle.model}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{card.linkedVehicle.plate}</div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditCard(card)} className="p-1.5 hover:text-primary transition-colors bg-muted/50 hover:bg-primary/10 rounded-lg border border-border">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDeleteCard(card.id)} className="p-1.5 hover:text-destructive transition-colors bg-muted/50 hover:bg-destructive/10 rounded-lg border border-border">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-muted-foreground">No cards found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3">Request</th>
                                    <th className="px-6 py-3">Member / Vehicle</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {requests.map(req => (
                                    <tr key={req.id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={cls(
                                                    "inline-block w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    req.request_type === 'NEW' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                                )}>
                                                    {req.request_type}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">{new Date(req.created_at || "").toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground">{req.member?.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">{req.member?.phone}</div>
                                                    {req.vehicle && (
                                                        <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium tracking-tight">
                                                            <Car className="h-3 w-3" /> {req.vehicle.make} {req.vehicle.model}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cls(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border",
                                                req.status === 'PENDING' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                    req.status === 'SHIPPED' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                                        req.status === 'DELIVERED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                            "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {req.status === 'SHIPPED' && <Truck className="h-3 w-3" />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {req.status === 'PENDING' && (
                                                    <button onClick={() => handleUpdateRequest(req.id, 'SHIPPED')} disabled={updatingId === req.id} className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                                                        Mark Shipped
                                                    </button>
                                                )}
                                                {req.status === 'SHIPPED' && (
                                                    <button onClick={() => handleUpdateRequest(req.id, 'DELIVERED')} disabled={updatingId === req.id} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-muted-foreground">No requests found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* DIALOGS */}
            <Dialog open={isBatchOpen} onOpenChange={setIsBatchOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add New Card Batch</DialogTitle>
                        <DialogDescription>Enter physical serial numbers or use the generator to add to inventory.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4 border-y border-border my-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch Reference</label>
                                <button onClick={generateBatchId} className="text-[10px] text-primary font-bold hover:underline">Auto-Gen</button>
                            </div>
                            <Input placeholder="e.g. SEP-2024-A" value={batchId} onChange={e => setBatchId(e.target.value)} />
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Serial Number Generator</label>
                            <div className="flex items-end gap-3">
                                <div className="space-y-1.5 flex-[2]">
                                    <span className="text-[10px] text-muted-foreground font-bold">Prefix</span>
                                    <Input value={generatePrefix} onChange={e => setGeneratePrefix(e.target.value)} className="h-8 text-xs font-mono" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <span className="text-[10px] text-muted-foreground font-bold">Qty</span>
                                    <Input type="number" value={generateCount} onChange={e => setGenerateCount(parseInt(e.target.value) || 1)} className="h-8 text-xs" />
                                </div>
                                <Button onClick={handleGenerateSerials} variant="outline" className="h-8 text-xs">Generate</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Final Serial List</label>
                            <Textarea placeholder={"MA-26-001\nMA-26-002\n..."} className="font-mono h-40 text-xs" value={batchSerials} onChange={e => setBatchSerials(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBatchOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateBatch} disabled={!batchSerials || updatingId === 'batch'}>
                            {updatingId === 'batch' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Process Batch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isCardEditOpen} onOpenChange={setIsCardEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Card Details</DialogTitle>
                        <DialogDescription>Update metadata for this physical card.</DialogDescription>
                    </DialogHeader>
                    {editingCard && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Serial Number</label>
                                <Input value={editingCard.serial_number} onChange={e => setEditingCard({ ...editingCard, serial_number: e.target.value })} className="font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch ID</label>
                                <Input value={editingCard.batch_id || ""} onChange={e => setEditingCard({ ...editingCard, batch_id: e.target.value })} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCardEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateCardSave} disabled={updatingId === editingCard?.id}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isBulkAssignOpen} onOpenChange={setIsBulkAssignOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Bulk Assign Smart Cards</DialogTitle>
                        <DialogDescription>Assign available cards to multiple vehicles at once.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Organization</label>
                            <select className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" value={bulkOrgId} onChange={(e) => handleOrgSelectForBulk(e.target.value)}>
                                <option value="NONE">Select an organization...</option>
                                {organizations.map(org => (
                                    <option key={org.member_id} value={org.member_id}>{org.business_name || org.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Vehicles to Link ({selectedVehicleIds.length})</label>
                                <button onClick={() => setSelectedVehicleIds([])} className="text-[10px] text-destructive font-bold hover:underline">Clear Selection</button>
                            </div>
                            <div className="max-h-60 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                                {vehicles.filter(v => !v.nfc_serial_number).map(v => (
                                    <div key={v.id} className={cls("flex items-center gap-3 p-3 text-sm cursor-pointer transition-colors", selectedVehicleIds.includes(v.id) ? "bg-primary/5" : "hover:bg-muted/50")} onClick={() => {
                                        if (selectedVehicleIds.includes(v.id)) {
                                            setSelectedVehicleIds(prev => prev.filter(id => id !== v.id));
                                        } else {
                                            setSelectedVehicleIds(prev => [...prev, v.id]);
                                        }
                                    }}>
                                        <div className={cls("h-4 w-4 rounded border flex items-center justify-center transition-colors", selectedVehicleIds.includes(v.id) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                                            {selectedVehicleIds.includes(v.id) && <CheckSquare className="h-3 w-3" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">{v.make} {v.model}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">{v.plate || "No Plate"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBulkAssignOpen(false)}>Cancel</Button>
                        <Button onClick={handleBulkAssign} disabled={selectedVehicleIds.length === 0 || updatingId === 'bulk'}>Confirm Bulk Assignment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Link Smart Card</DialogTitle>
                        <DialogDescription>Enter the physical serial number found on the back of the card.</DialogDescription>
                    </DialogHeader>
                    {editingVehicle && (
                        <div className="space-y-4 py-4">
                            <div className="bg-muted p-4 rounded-lg flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Car className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{editingVehicle.year} {editingVehicle.make} {editingVehicle.model}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{editingVehicle.plate || "No Plate"}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Serial Number</label>
                                <Input placeholder="e.g. MA-26-00123" value={serialInput} onChange={(e) => setSerialInput(e.target.value)} className="font-mono" />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveLink} disabled={!serialInput || updatingId === editingVehicle?.id}>Link Card</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
