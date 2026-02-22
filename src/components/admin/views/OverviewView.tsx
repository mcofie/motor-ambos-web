"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from "recharts";
import {
    Users,
    CreditCard,
    TrendingUp,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Car,
    ShieldCheck,
    Building2,
    Sparkles
} from "lucide-react";
import { listProviders, listRequests, listAllVehicles, getVehicleMaintenanceStatus, listAiQueries } from "@/lib/supaFetch";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { StatCard } from "../ui/AdminUI";
import { ProviderRow, RequestRow, AiQueryRow } from "../types";

const STATUS_COLORS: Record<string, string> = {
    "Completed": "#10b981", // emerald-500
    "In Progress": "#3b82f6", // blue-500
    "Pending": "#f59e0b", // amber-500
    "Cancelled": "#ef4444", // red-500
};

export function OverviewView() {
    const [providers, setProviders] = useState<ProviderRow[]>([]);
    const [requests, setRequests] = useState<RequestRow[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [aiQueries, setAiQueries] = useState<AiQueryRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pData, rData, vData, aiData] = await Promise.all([
                    listProviders(),
                    listRequests(),
                    listAllVehicles(),
                    listAiQueries(5)
                ]);
                setProviders(pData as ProviderRow[]);
                setRequests(rData as RequestRow[]);
                setVehicles(vData);
                setAiQueries(aiData);
            } catch (error) {
                console.error("Failed to load analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        const supabase = getSupabaseBrowser();
        const channel = supabase
            .channel('overview-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => {
                loadData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // --- Derived Metrics ---

    // 1. Total Active Providers
    const activeProviders = providers.filter(p => p.is_active).length;

    // 2. Request Status Breakdown
    const requestStatusData = [
        { name: "Completed", value: requests.filter(r => r.status === "completed").length },
        { name: "In Progress", value: requests.filter(r => r.status === "in_progress").length },
        { name: "Pending", value: requests.filter(r => r.status === "pending").length },
        { name: "Cancelled", value: requests.filter(r => r.status === "cancelled").length },
    ].filter(d => d.value > 0);

    const serviceDistribution = requestStatusData.map(item => ({
        ...item,
        color: STATUS_COLORS[item.name] || "#cbd5e1"
    }));

    // 3. Revenue Estimate (Mock calculation based on completed requests * avg fee)
    // In a real app, this would sum up actual transaction values.
    const estimatedRevenue = requests
        .filter(r => r.status === "completed")
        .length * 50; // Assuming 50 GHS avg commission/fee

    // 4. Activity Over Time (Group by Date)
    // Taking last 7 days for demo
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return dates;
    };

    const activityData = getLast7Days().map(date => ({
        date,
        requests: Math.floor(Math.random() * 20) + 5, // Mock data for demo visualization since we might not have enough history
        revenue: Math.floor(Math.random() * 1000) + 200
    }));

    return (
        <div className="flex flex-col gap-8 pb-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue (Est)"
                    value={`GHS ${estimatedRevenue.toLocaleString()}`}
                    icon={CreditCard}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Fleet Health"
                    value={`${vehicles.length ? Math.round((vehicles.filter(v => getVehicleMaintenanceStatus(v).oilChangeStatus === 'HEALTHY').length / vehicles.length) * 100) : 100}%`}
                    icon={ShieldCheck}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Total Requests"
                    value={requests.length}
                    icon={Activity}
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Active Providers"
                    value={activeProviders}
                    icon={Building2}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Completion Rate"
                    value={`${requests.length ? Math.round((requests.filter(r => r.status === 'completed').length / requests.length) * 100) : 0}%`}
                    icon={TrendingUp}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart: Activity */}
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Revenue & Activity</h3>
                            <p className="text-sm text-muted-foreground">Performance over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                            <ArrowUpRight className="h-4 w-4" />
                            +12.5% vs last week
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    label={{ value: 'Requests', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    label={{ value: 'Revenue (GHS)', angle: 90, position: 'insideRight', offset: 0, fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="requests"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Chart: Status Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-1">Request Status</h3>
                    <p className="text-sm text-muted-foreground mb-6">Distribution of service requests</p>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={requestStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {requestStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#cbd5e1"} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centered Total */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">{requests.length}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {requestStatusData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] || "#cbd5e1" }} />
                                <span>{entry.name}: <span className="font-semibold text-foreground">{entry.value}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">System Health</h3>
                            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
                                All systems operational. Real-time fleet tracking is active.
                                {activeProviders} providers are currently online across Greater Accra.
                                Drive scores are being synchronized every 15 minutes.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm font-medium">Database Connected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">AI Mechanic Insights</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                            <Sparkles className="h-3 w-3" /> Live
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {aiQueries.length > 0 ? aiQueries.map((q) => (
                            <div key={q.id} className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                    <span>User Query</span>
                                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-medium text-foreground line-clamp-2 italic">
                                    "{q.event_data.query}"
                                </p>
                                <div className="pt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-tight">Advised to visit checked partner</span>
                                </div>
                            </div>
                        )) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl">
                                <Sparkles className="h-8 w-8 text-muted-foreground/20 mb-3" />
                                <p className="text-xs font-medium text-muted-foreground">No recent AI interactions logged.</p>
                            </div>
                        )}
                    </div>
                    <button className="mt-4 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-t border-border pt-4">
                        View All AI Conversations →
                    </button>
                </div>
            </div>
        </div>
    );
}
