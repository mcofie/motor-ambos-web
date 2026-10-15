"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowRight, Building2, Droplets, TrendingUp } from "lucide-react";
import { listProviders, listRequests, listAllVehicles, getVehicleMaintenanceStatus, type VehicleRow } from "@/lib/supaFetch";
import { StatCard, StatusBadge } from "../ui/AdminUI";
import { ProviderRow, RequestRow } from "../types";
import { requestInfo } from "../requestInfo";

const STATUSES = [
    { key: "pending", label: "Waiting", color: "#E2A23B" },
    { key: "accepted", label: "Accepted", color: "#7C7CFF" },
    { key: "in_progress", label: "In progress", color: "#B8B8FF" },
    { key: "completed", label: "Completed", color: "#1111F6" },
    { key: "cancelled", label: "Cancelled", color: "#D64545" },
];

export function OverviewView() {
    const [providers, setProviders] = useState<ProviderRow[]>([]);
    const [requests, setRequests] = useState<RequestRow[]>([]);
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [loading, setLoading] = useState(true);
    // Fixed when the page opens, so the week figures do not shift between renders.
    const [now] = useState(() => Date.now());

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pData, rData, vData] = await Promise.all([listProviders(), listRequests(), listAllVehicles()]);
                setProviders(pData as ProviderRow[]);
                setRequests(rData as RequestRow[]);
                setVehicles(vData);
            } catch (error) {
                console.error("Failed to load analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Refresh every minute so the waiting banner stays current.
        const timer = window.setInterval(loadData, 60_000);
        return () => window.clearInterval(timer);
    }, []);

    const activeProviders = providers.filter((p) => p.is_active).length;
    const completed = requests.filter((r) => r.status === "completed").length;
    const closed = completed + requests.filter((r) => r.status === "cancelled").length;
    const tracked = vehicles.filter((v) => getVehicleMaintenanceStatus(v).oilChangeStatus !== "UNKNOWN");
    const oilOnTime = tracked.filter((v) => getVehicleMaintenanceStatus(v).oilChangeStatus === "HEALTHY").length;

    // Requests per day over the last 7 days.
    const dayKey = (value: Date | string) => new Date(value).toISOString().slice(0, 10);
    const activityData = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(now);
        day.setDate(day.getDate() - (6 - index));
        const key = dayKey(day);
        return {
            date: day.toLocaleDateString("en-GH", { weekday: "short" }),
            requests: requests.filter((request) => request.created_at && dayKey(request.created_at) === key).length,
        };
    });

    // Week on week change, shown only when there is a previous week to compare with.
    const weekAgo = now - 7 * 86_400_000, twoWeeksAgo = now - 14 * 86_400_000;
    const thisWeek = requests.filter((request) => request.created_at && new Date(request.created_at).getTime() >= weekAgo).length;
    const lastWeek = requests.filter((request) => { const time = request.created_at ? new Date(request.created_at).getTime() : 0; return time >= twoWeeksAgo && time < weekAgo; }).length;
    const weekChange = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;

    const statusCounts = STATUSES.map((status) => ({ ...status, value: requests.filter((r) => (r.status || "pending") === status.key).length }));
    const waiting = statusCounts[0].value;
    const recent = [...requests].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")).slice(0, 6);

    const card = "rounded-[20px] border border-[#EAEAEA] bg-white p-5 sm:p-6";

    return (
        <div className="flex flex-col gap-6 pb-8">
            {waiting > 0 && <Link href="/admin/requests" className="flex items-center justify-between gap-3 rounded-[16px] bg-[#FFF4DF] px-5 py-4 text-[#915C12] transition-colors hover:bg-[#FFEDCC]">
                <span className="text-[14px]"><strong className="font-medium">{waiting} {waiting === 1 ? "request is" : "requests are"} waiting</strong> for a provider.</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[14px]">Review<ArrowRight className="h-4 w-4" /></span>
            </Link>}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                <StatCard title="Requests, last 7 days" value={loading ? "—" : thisWeek} icon={Activity} />
                <StatCard title="Completion rate" value={loading || !closed ? "—" : `${Math.round((completed / closed) * 100)}%`} icon={TrendingUp} />
                <StatCard title="Active providers" value={loading ? "—" : activeProviders} icon={Building2} />
                <StatCard title="Oil changes on time" value={loading || !tracked.length ? "—" : `${Math.round((oilOnTime / tracked.length) * 100)}%`} icon={Droplets} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className={`${card} lg:col-span-2`}>
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-[18px] tracking-[-0.02em]">Requests this week</h2>
                            <p className="text-[13px] text-[#777]">Roadside requests per day</p>
                        </div>
                        {weekChange !== null && <span className={`rounded-full px-3 py-1 text-[13px] ${weekChange >= 0 ? "bg-[#EEEEFF] text-[#1111F6]" : "bg-[#FFF4DF] text-[#915C12]"}`}>
                            {weekChange >= 0 ? "+" : ""}{weekChange}% vs last week
                        </span>}
                    </div>
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
                                <CartesianGrid stroke="#F0F0F0" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} dy={8} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                                <Tooltip cursor={{ fill: "#F3F3FF" }} contentStyle={{ borderRadius: 12, border: "1px solid #EAEAEA", boxShadow: "none", fontSize: 13 }} />
                                <Bar dataKey="requests" name="Requests" fill="#1111F6" radius={[8, 8, 8, 8]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className={card}>
                    <h2 className="text-[18px] tracking-[-0.02em]">By status</h2>
                    <p className="text-[13px] text-[#777]">All {requests.length.toLocaleString()} requests</p>
                    <ul className="mt-5 flex flex-col gap-4">
                        {statusCounts.map((status) => (
                            <li key={status.key}>
                                <div className="flex items-center justify-between text-[14px]">
                                    <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: status.color }} />{status.label}</span>
                                    <span className="text-[#777]">{status.value}</span>
                                </div>
                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F2F2F2]">
                                    <div className="h-full rounded-full" style={{ width: `${requests.length ? (status.value / requests.length) * 100 : 0}%`, backgroundColor: status.color }} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
                <section className={`${card} lg:col-span-2`}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-[18px] tracking-[-0.02em]">Latest requests</h2>
                        <Link href="/admin/requests" className="inline-flex items-center gap-1 text-[14px] text-[#1111F6]">See all<ArrowRight className="h-4 w-4" /></Link>
                    </div>
                    {recent.length ? <ul className="divide-y divide-[#F0F0F0]">
                        {recent.map((request) => (
                            <li key={request.id} className="flex items-center justify-between gap-3 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-[14px]">{request.driver_name || "Driver"}</p>
                                    <p className="truncate text-[13px] text-[#888]" suppressHydrationWarning>
                                        {[requestInfo(request).issue, request.address_line].filter(Boolean).join(", ") || "No details"} · {new Date(request.created_at).toLocaleString("en-GH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                                <StatusBadge status={request.status || "pending"} />
                            </li>
                        ))}
                    </ul> : <p className="py-8 text-center text-[14px] text-[#888]">{loading ? "Loading…" : "No requests yet."}</p>}
                </section>

                <section className="relative overflow-hidden rounded-[20px] bg-[#1111F6] p-6 text-white">
                    <div aria-hidden className="absolute -right-16 -top-24 h-56 w-56 rounded-full border-[32px] border-white/10" />
                    <div className="relative flex flex-col gap-6">
                        <div>
                            <p className="text-[13px] text-white/70">Network</p>
                            <p className="mt-2 text-[22px] leading-tight tracking-[-0.03em]">{activeProviders} {activeProviders === 1 ? "provider" : "providers"} taking jobs, {vehicles.length.toLocaleString()} {vehicles.length === 1 ? "vehicle" : "vehicles"} registered.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/admin/providers" className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[14px] text-[#171717]">Providers</Link>
                            <Link href="/admin/memberships" className="inline-flex h-10 items-center rounded-full bg-white/15 px-4 text-[14px] text-white hover:bg-white/25">Members</Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
