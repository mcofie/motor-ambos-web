import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    listRequests,
    updateRequestStatus,
} from "@/lib/supaFetch";
import {
    LayoutGrid,
    AlertCircle,
    LifeBuoy,
    RefreshCw,
    Loader2,
    Eye,
    X,
    User as UserIcon,
    Wrench,
    MapPin,
    Clock,
} from "lucide-react";
import {
    RequestRow,
    RequestStatus,
    UUID,
} from "../types";
import {
    cls,
    StatusBadge,
    StatCard,
} from "../ui/AdminUI";

export function RequestsView() {
    const [list, setList] = useState<RequestRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
    const [selectedRequest, setSelectedRequest] = useState<RequestRow | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listRequests(statusFilter === "all" ? undefined : statusFilter);
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

    const updateStatusLocal = async (id: UUID, status: RequestStatus) => {
        toast.promise(updateRequestStatus(id, status), {
            loading: "Updating status...",
            success: "Status updated",
            error: "Failed to update",
        });
        fetchRequests();
    };

    const pendingCount = list.filter((r) => r.status === "pending").length;
    const inProgressCount = list.filter((r) => r.status === "in_progress").length;

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Requests" value={list.length} icon={LayoutGrid} color="bg-slate-500" />
                <StatCard title="Pending" value={pendingCount} icon={AlertCircle} color="bg-amber-500" />
                <StatCard title="In Progress" value={inProgressCount} icon={LifeBuoy} color="bg-primary" />
            </div>

            <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex gap-4 items-center bg-card">
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                        {["all", "pending", "in_progress", "completed"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s as RequestStatus | "all")}
                                className={cls(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                    statusFilter === s
                                        ? "bg-background text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                {s.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1" />
                    <button
                        onClick={fetchRequests}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted/30 hover:bg-primary/10 rounded-lg"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto relative bg-muted/20">
                    {loading && (
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    <table className="w-full text-left text-sm">
                        <thead
                            className="bg-muted/50 text-muted-foreground font-medium border-b border-border sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Assignment</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {list.map((r) => (
                                <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                        {new Date(r.created_at).toLocaleString([], {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={r.status || "pending"} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{r.driver_name || "Unknown User"}</div>
                                        <div
                                            className="text-xs text-muted-foreground flex items-center gap-1">{r.driver_phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs">
                                        {r.provider_id ? (
                                            <span
                                                className="bg-muted px-2 py-1 rounded border border-border font-mono">
                                                {r.provider_id.slice(0, 8)}...
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground/50 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            className="bg-background border border-input text-xs rounded-lg py-1.5 pl-2 pr-8 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-primary/50 text-foreground"
                                            value={r.status || "pending"}
                                            onChange={(e) => updateStatusLocal(r.id, e.target.value as RequestStatus)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(r);
                                                setIsSidebarOpen(true);
                                            }}
                                            className="ml-2 p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {list.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <LifeBuoy className="h-10 w-10 mb-2 opacity-20" />
                            <p>No requests found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Slide-over */}
            {isSidebarOpen && selectedRequest && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-card shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
                        <div className="p-5 border-b border-border flex items-center justify-between bg-card">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">
                                    Request Details
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                    ID: {selectedRequest.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background/50">
                            {/* Status Section */}
                            <section>
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2 mb-4">
                                    Current Status
                                </h4>
                                <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                                    <StatusBadge status={selectedRequest.status || "pending"} />
                                    <div className="flex-1">
                                        <label className="text-xs font-medium text-muted-foreground block mb-1">Update Status</label>
                                        <select
                                            className="w-full bg-background border border-input text-sm rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                                            value={selectedRequest.status || "pending"}
                                            onChange={(e) => {
                                                const newStatus = e.target.value as RequestStatus;
                                                updateStatusLocal(selectedRequest.id, newStatus);
                                                setSelectedRequest({ ...selectedRequest, status: newStatus });
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Driver Info */}
                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2 mb-4">
                                    <UserIcon className="w-3 h-3" /> Driver Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card p-3 rounded-lg border border-border">
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                                        <div className="font-medium text-foreground">{selectedRequest.driver_name || "Unknown"}</div>
                                    </div>
                                    <div className="bg-card p-3 rounded-lg border border-border">
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
                                        <div className="font-medium text-foreground">{selectedRequest.driver_phone || "—"}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Service Details */}
                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2 mb-4">
                                    <Wrench className="w-3 h-3" /> Service Details
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Service Type</label>
                                        <div className="font-medium text-foreground capitalize">{selectedRequest.service_id?.replace("_", " ") || "General Assistance"}</div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description / Notes</label>
                                        <div className="mt-1 p-3 bg-card rounded-lg text-sm text-muted-foreground leading-relaxed border border-border">
                                            {selectedRequest.details || "No additional details provided."}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Location */}
                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2 mb-4">
                                    <MapPin className="w-3 h-3" /> Location
                                </h4>
                                <div className="bg-card p-4 rounded-xl border border-border space-y-3">
                                    <div>
                                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Address</label>
                                        <div className="font-medium text-foreground">{selectedRequest.address_line || "Location coordinates only"}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Timestamps */}
                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-primary/20 pb-2 mb-4">
                                    <Clock className="w-3 h-3" /> Timeline
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="font-medium">Created:</span>
                                    <span>{new Date(selectedRequest.created_at).toLocaleString()}</span>
                                </div>
                            </section>
                        </div>

                        <div className="p-5 border-t border-border bg-muted/20">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-foreground bg-background border border-input hover:bg-accent transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
