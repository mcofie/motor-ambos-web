import React from "react";
import { Wrench, LifeBuoy, Users, LogOut } from "lucide-react";
import { cls } from "./ui/AdminUI";

interface AdminSidebarProps {
    activeTab: "providers" | "requests" | "memberships";
    setActiveTab: (tab: "providers" | "requests" | "memberships") => void;
    onLogout: () => void;
}

export function AdminSidebar({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
    return (
        <aside className="w-20 lg:w-64 bg-slate-900 flex flex-col shadow-xl z-20 transition-all duration-300 h-full">
            <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold lg:mr-3 shadow-lg shadow-primary/30">
                    M
                </div>
                <span className="font-bold text-lg tracking-tight text-white hidden lg:block">
                    MotorAmbos
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => setActiveTab("providers")}
                    className={cls(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        activeTab === "providers"
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <Wrench className="h-5 w-5" />
                    <span className="hidden lg:block">Providers</span>
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={cls(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        activeTab === "requests"
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <LifeBuoy className="h-5 w-5" />
                    <span className="hidden lg:block">Requests</span>
                </button>
                <button
                    onClick={() => setActiveTab("memberships")}
                    className={cls(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        activeTab === "memberships"
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <Users className="h-5 w-5" />
                    <span className="hidden lg:block">Memberships</span>
                </button>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
