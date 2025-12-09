import React from "react";
import { Wrench, LifeBuoy, Users, LogOut, LayoutDashboard } from "lucide-react";
import { cls } from "./ui/AdminUI";

interface AdminSidebarProps {
    activeTab: "overview" | "providers" | "requests" | "memberships";
    setActiveTab: (tab: "overview" | "providers" | "requests" | "memberships") => void;
    onLogout: () => void;
}

export function AdminSidebar({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
    return (
        <aside className="w-20 lg:w-72 bg-slate-950/95 backdrop-blur-md flex flex-col border-r border-white/5 z-20 transition-all duration-300 h-full relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-emerald-500/5 blur-[100px] pointer-events-none" />

            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5 shrink-0">
                <div className="relative group">
                    <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold relative shadow-lg shadow-emerald-900/20">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                </div>
                <div className="hidden lg:block ml-4">
                    <span className="font-display font-bold text-xl tracking-tight text-white block">
                        MotorAmbos
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500/80">
                        Admin Console
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4 hidden lg:block">
                    Menu
                </div>
                <NavButton
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                    icon={LayoutDashboard}
                    label="Overview"
                />
                <NavButton
                    active={activeTab === "providers"}
                    onClick={() => setActiveTab("providers")}
                    icon={Wrench}
                    label="Providers"
                />
                <NavButton
                    active={activeTab === "requests"}
                    onClick={() => setActiveTab("requests")}
                    icon={LifeBuoy}
                    label="Service Requests"
                    badge="Live"
                />
                <NavButton
                    active={activeTab === "memberships"}
                    onClick={() => setActiveTab("memberships")}
                    icon={Users}
                    label="Memberships"
                />
            </nav>

            <div className="p-6 border-t border-white/5 bg-slate-950/50">
                <button
                    onClick={onLogout}
                    className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

function NavButton({ active, onClick, icon: Icon, label, badge }: { active: boolean, onClick: () => void, icon: any, label: string, badge?: string }) {
    return (
        <button
            onClick={onClick}
            className={cls(
                "relative group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 border",
                active
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
        >
            <Icon className={cls(
                "h-5 w-5 transition-colors duration-300",
                active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
            )} />
            <span className="hidden lg:block">{label}</span>

            {/* Active Indicator */}
            {active && (
                <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] hidden lg:block" />
            )}

            {/* Badge */}
            {badge && !active && (
                <span className="hidden lg:flex absolute right-3 items-center px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {badge}
                </span>
            )}
        </button>
    );
}
