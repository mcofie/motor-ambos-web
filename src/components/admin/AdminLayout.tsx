"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LogOut } from "lucide-react";
import { AdminNavList, AdminSidebar, type AdminTab } from "./AdminSidebar";
import { User } from "./types";
import { listRequests } from "@/lib/supaFetch";

const pageCopy: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: "Overview", subtitle: "How the network is doing today." },
    admin: { title: "Overview", subtitle: "How the network is doing today." },
    providers: { title: "Providers", subtitle: "Roadside mechanics and partners drivers can reach." },
    requests: { title: "Service requests", subtitle: "Roadside requests as they come in." },
    memberships: { title: "Memberships", subtitle: "Drivers, their cars and their plans." },
    organizations: { title: "Organizations", subtitle: "Fleets, their drivers and billing." },
    nfc: { title: "Card inventory", subtitle: "Add, print and link Smart Cards." },
    orders: { title: "Card orders", subtitle: "Orders to fulfil, prices and delivery." },
    cars: { title: "Car images", subtitle: "Studio photos shown on Smart Card pages." },
    advisor: { title: "Maintenance", subtitle: "Vehicles due an oil change, worst first." },
};

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: AdminTab;
    user: User | null;
    onLogout: () => void;
}

export function AdminLayout({ children, activeTab, user, onLogout }: AdminLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [waiting, setWaiting] = useState(0);
    const pathname = usePathname();
    const copy = pageCopy[activeTab] || pageCopy.overview;
    const initial = user?.email?.[0]?.toUpperCase() || "A";

    // Close the phone menu whenever the page changes.
    const [menuPath, setMenuPath] = useState(pathname);
    if (menuPath !== pathname) {
        setMenuPath(pathname);
        setMenuOpen(false);
    }

    // Requests waiting for a provider, shown beside Service requests in the menu.
    useEffect(() => {
        const refresh = () => listRequests("pending").then((rows) => setWaiting(rows.length)).catch(() => {});
        refresh();
        // Poll rather than subscribe: it works whatever the database's realtime settings are.
        const timer = window.setInterval(refresh, 20_000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
    }, [menuOpen]);

    return (
        <div className="admin-theme base-landing flex h-[100dvh] w-full overflow-hidden bg-[#F7F7F7] text-[#171717]">
            <AdminSidebar activeTab={activeTab} email={user?.email} onLogout={onLogout} waiting={waiting} />
            <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                <header className="z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#EAEAEA] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[72px] lg:px-10">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link href="/admin/overview" aria-label="Back office home" className="lg:hidden"><Image src="/icon.svg" alt="" width={34} height={28} className="h-7 w-[34px]" /></Link>
                        <div className="min-w-0">
                            <h1 className="truncate text-[18px] tracking-[-0.03em] sm:text-[20px]">{copy.title}</h1>
                            <p className="hidden truncate text-[13px] text-[#777] sm:block">{copy.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Link href="/" target="_blank" className="hidden h-9 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-3.5 text-[13px] text-[#444] hover:border-[#B8B8FF] hover:text-[#1111F6] sm:inline-flex">View site<ArrowUpRight className="h-3.5 w-3.5" /></Link>
                        <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#1111F6] text-[13px] text-white sm:flex lg:hidden">{initial}</span>
                        <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="admin-menu" onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#F5F5F5] lg:hidden">
                            <span aria-hidden className="relative block h-6 w-6">
                                <span className={`absolute left-0.5 top-[7px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                                <span className={`absolute left-0.5 top-[17px] h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
                            </span>
                        </button>
                    </div>
                </header>

                {menuOpen && <div id="admin-menu" className="absolute inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-white px-3 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 lg:hidden">
                    <AdminNavList activeTab={activeTab} onNavigate={() => setMenuOpen(false)} waiting={waiting} />
                    <div className="mt-auto flex items-center gap-3 border-t border-[#EAEAEA] px-3 pt-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1111F6] text-[13px] text-white">{initial}</span>
                        <p className="min-w-0 flex-1 truncate text-[14px]">{user?.email || "Staff"}</p>
                        <button type="button" onClick={onLogout} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#E3E3E3] px-4 text-[13px] text-[#AA3333]"><LogOut className="h-4 w-4" />Sign out</button>
                    </div>
                </div>}

                <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col">{children}</div>
                </div>
            </main>
        </div>
    );
}
