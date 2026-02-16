import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { User } from "./types";
import { Bell, Search } from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: "overview" | "providers" | "requests" | "memberships" | "admin" | "nfc" | "organizations";
    user: User | null;
    onLogout: () => void;
}

export function AdminLayout({ children, activeTab, user, onLogout }: AdminLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-foreground font-sans overflow-hidden">
            <AdminSidebar activeTab={activeTab} onLogout={onLogout} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shrink-0 z-10 transition-all duration-300">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize font-display">
                            {activeTab === "admin" ? "Overview" : activeTab} Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Overview of your network activity
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar - Visual Only for now */}
                        <div className="hidden md:flex items-center relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-emerald-500/50 text-sm w-64 text-slate-900 dark:text-white placeholder:text-slate-500 outline-none transition-all"
                            />
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                        <button className="relative p-2 text-slate-500 hover:text-emerald-500 transition-colors rounded-full hover:bg-emerald-500/10">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
                        </button>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {user?.email?.split('@')[0] || "Admin"}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Super Admin
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 ring-2 ring-white dark:ring-white/10">
                                {user?.email?.[0]?.toUpperCase() || "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-950 px-10 py-8">
                    <div className="w-full max-w-7xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
