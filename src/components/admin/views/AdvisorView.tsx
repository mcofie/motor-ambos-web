"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { listAllVehicles, getVehicleMaintenanceStatus, VehicleRow, getMarketFairPrice, FairPriceEstimate, type MaintenanceStatus } from "@/lib/supaFetch";
import { cls } from "../ui/AdminUI";

const STATE: Record<MaintenanceStatus["oilChangeStatus"], { label: string; tone: string; bar: string; rank: number }> = {
    OVERDUE: { label: "Overdue", tone: "bg-[#FFF0EF] text-[#AA3333]", bar: "bg-[#D64545]", rank: 0 },
    UPCOMING: { label: "Due soon", tone: "bg-[#FFF4DF] text-[#915C12]", bar: "bg-[#E2A23B]", rank: 1 },
    HEALTHY: { label: "On time", tone: "bg-[#EAF7F0] text-[#197252]", bar: "bg-[#1111F6]", rank: 2 },
    UNKNOWN: { label: "No mileage", tone: "bg-[#F2F2F2] text-[#666]", bar: "bg-[#CCC]", rank: 3 },
};

/** Oil change status across every registered vehicle, worst first. */
export function AdvisorView() {
    const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
    const [oilPrice, setOilPrice] = useState<FairPriceEstimate | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [vData, priceData] = await Promise.all([listAllVehicles(), getMarketFairPrice("OIL_CHANGE")]);
                setVehicles(vData);
                setOilPrice(priceData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const fleet = vehicles
        .map((v) => ({ ...v, status: getVehicleMaintenanceStatus(v) }))
        .sort((a, b) => STATE[a.status.oilChangeStatus].rank - STATE[b.status.oilChangeStatus].rank || a.status.kmRemaining - b.status.kmRemaining);
    const count = (key: MaintenanceStatus["oilChangeStatus"]) => fleet.filter((v) => v.status.oilChangeStatus === key).length;
    const attention = fleet.filter((v) => v.status.oilChangeStatus === "OVERDUE" || v.status.oilChangeStatus === "UPCOMING");
    const unknown = count("UNKNOWN");
    const shown = showAll ? fleet : attention;

    if (loading) {
        return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#1111F6]" /></div>;
    }

    const tile = "rounded-[16px] border border-[#EAEAEA] bg-white p-5";
    return (
        <div className="flex flex-col gap-6 pb-8">
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
                {(["OVERDUE", "UPCOMING", "HEALTHY"] as const).map((key) => (
                    <div key={key} className={tile}>
                        <p className="text-[28px] leading-none tracking-[-0.04em]">{count(key)}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#777]"><span className={cls("h-2 w-2 rounded-full", STATE[key].bar)} />{STATE[key].label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className="overflow-hidden rounded-[20px] border border-[#EAEAEA] bg-white lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F0F0] px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="text-[18px] tracking-[-0.02em]">Oil changes</h2>
                            <p className="text-[13px] text-[#777]">Every 5,000 km from the last logged change</p>
                        </div>
                        <div className="flex rounded-full bg-[#F2F2F2] p-1 text-[13px]">
                            {[[false, `Needs attention (${attention.length})`], [true, `All (${fleet.length})`]].map(([value, label]) => (
                                <button key={String(value)} type="button" onClick={() => setShowAll(value as boolean)} className={cls("h-8 rounded-full px-3 transition-colors", showAll === value ? "bg-white text-[#171717] shadow-sm" : "text-[#777]")}>{label}</button>
                            ))}
                        </div>
                    </div>
                    {shown.length ? <ul className="divide-y divide-[#F0F0F0]">
                        {shown.map((v) => (
                            <li key={v.id}>
                                <Link href={`/admin/vehicles/${v.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAFAFA] sm:px-6">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[15px]">{[v.make, v.model].filter(Boolean).join(" ") || "Vehicle"}</p>
                                        <p className="truncate text-[13px] text-[#888]">{v.plate || "No plate"} · {(v.current_mileage || 0).toLocaleString()} km</p>
                                    </div>
                                    <div className="hidden w-32 sm:block">
                                        <div className="h-1.5 overflow-hidden rounded-full bg-[#F2F2F2]"><div className={cls("h-full rounded-full", STATE[v.status.oilChangeStatus].bar)} style={{ width: `${v.status.percentLife}%` }} /></div>
                                        <p className="mt-1 text-[12px] text-[#888]">{v.status.oilChangeStatus === "UNKNOWN" ? "No mileage" : `${v.status.kmRemaining.toLocaleString()} km left`}</p>
                                    </div>
                                    <span className={cls("shrink-0 rounded-full px-2.5 py-1 text-[12px]", STATE[v.status.oilChangeStatus].tone)}>{STATE[v.status.oilChangeStatus].label}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-[#BBB]" />
                                </Link>
                            </li>
                        ))}
                    </ul> : <p className="px-6 py-12 text-center text-[14px] text-[#888]">{fleet.length ? "No vehicle is due. Cars without logged mileage are under All." : "No vehicles registered yet."}</p>}
                </section>

                <section className="h-fit rounded-[20px] border border-[#EAEAEA] bg-white p-5 sm:p-6">
                    {unknown > 0 && <p className="mb-5 rounded-[14px] bg-[#F7F7F7] px-4 py-3 text-[13px] leading-relaxed text-[#555]">{unknown} {unknown === 1 ? "vehicle has" : "vehicles have"} no mileage logged yet, so {unknown === 1 ? "its" : "their"} oil change can’t be tracked. They appear under All.</p>}
                    <h2 className="text-[18px] tracking-[-0.02em]">Oil change price guide</h2>
                    {oilPrice ? <>
                        <p className="mt-4 text-[26px] leading-none tracking-[-0.03em]">{oilPrice.currency} {oilPrice.range[0]}–{oilPrice.range[1]}</p>
                        <p className="mt-2 text-[13px] text-[#777]">Average {oilPrice.currency} {oilPrice.average}, from {oilPrice.sampleSize} provider {oilPrice.sampleSize === 1 ? "price" : "prices"}. Use it to check quotes drivers are given.</p>
                    </> : <p className="mt-2 text-[14px] text-[#777]">No provider has set an oil change price yet. Add rates on a provider&apos;s page to build this guide.</p>}
                    <Link href="/admin/providers" className="mt-5 inline-flex h-10 items-center rounded-full border border-[#E3E3E3] px-4 text-[14px] hover:border-[#B8B8FF] hover:text-[#1111F6]">Providers</Link>
                </section>
            </div>
        </div>
    );
}
