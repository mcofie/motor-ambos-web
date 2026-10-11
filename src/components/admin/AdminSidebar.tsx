import Link from "next/link";
import { Wrench, LifeBuoy, Users, LogOut, LayoutDashboard, QrCode, Building2, ShieldCheck } from "lucide-react";
import { cls } from "./ui/AdminUI";

interface AdminSidebarProps {
    activeTab: "overview" | "providers" | "requests" | "memberships" | "admin" | "nfc" | "organizations" | "advisor";
    onLogout: () => void;
}

export function AdminSidebar({ activeTab, onLogout }: AdminSidebarProps) {
    const currentTab = activeTab === "admin" ? "overview" : activeTab;

    return (
        <aside className="fixed inset-x-0 bottom-0 z-30 flex h-[calc(72px+env(safe-area-inset-bottom))] w-full flex-row overflow-hidden border-t border-white/5 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-all duration-300 md:relative md:inset-auto md:h-full md:w-20 md:flex-col md:border-r md:border-t-0 md:pb-0 lg:w-72">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-emerald-500/5 blur-[100px] pointer-events-none" />

            {/* Logo Area */}
            <div className="hidden h-24 items-center justify-center border-b border-white/5 md:flex lg:justify-start lg:px-10 shrink-0">
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

            <nav aria-label="Admin navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 py-2 md:block md:space-y-2 md:overflow-y-auto md:px-4 md:py-8">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4 hidden lg:block">
                    Menu
                </div>
                <NavButton
                    active={currentTab === "overview"}
                    href="/admin/overview"
                    icon={LayoutDashboard}
                    label="Overview"
                />
                <NavButton
                    active={currentTab === "providers"}
                    href="/admin/providers"
                    icon={Wrench}
                    label="Providers"
                />
                <NavButton
                    active={currentTab === "requests"}
                    href="/admin/requests"
                    icon={LifeBuoy}
                    label="Service Requests"
                    badge="Live"
                />
                <NavButton
                    active={currentTab === "memberships"}
                    href="/admin/memberships"
                    icon={Users}
                    label="Memberships"
                />
                <NavButton
                    active={currentTab === "nfc"}
                    href="/admin/nfc"
                    icon={QrCode}
                    label="Smart Cards"
                />
                <NavButton
                    active={currentTab === "organizations"}
                    href="/admin/organizations"
                    icon={Building2}
                    label="Organizations"
                    badge="New"
                />
                <NavButton
                    active={currentTab === "advisor"}
                    href="/admin/advisor"
                    icon={ShieldCheck}
                    label="Smart Advisor"
                    badge="AI"
                />
            </nav>

            <div className="flex shrink-0 items-center border-l border-white/5 px-1 md:mb-4 md:block md:border-l-0 md:border-t md:bg-slate-950/50 md:p-6">
                <button
                    onClick={onLogout}
                    className="group flex min-w-[56px] items-center justify-center gap-3 rounded-xl border border-transparent px-2 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 md:w-full md:justify-start md:px-4 md:py-3.5"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

function NavButton({ active, href, icon: Icon, label, badge }: { active: boolean, href: string, icon: any, label: string, badge?: string }) {
    return (
        <Link
            href={href}
            className={cls(
                "relative group flex min-w-[76px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[10px] font-medium transition-all duration-300 md:w-full md:min-w-0 md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3.5 md:text-sm",
                active
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
        >
            <Icon className={cls(
                "h-5 w-5 transition-colors duration-300",
                active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
            )} />
            <span className="max-w-[72px] truncate text-center md:hidden lg:block lg:max-w-none lg:text-left">{label}</span>

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
        </Link>
    );
}
