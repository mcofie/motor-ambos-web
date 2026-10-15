import Link from "next/link";
import Image from "next/image";
import { Building2, Droplets, Images, LayoutDashboard, LifeBuoy, LogOut, Nfc, ShoppingBag, Users, Wrench } from "lucide-react";
import { cls } from "./ui/AdminUI";

export type AdminTab = "overview" | "providers" | "requests" | "memberships" | "admin" | "nfc" | "organizations" | "advisor" | "cars" | "orders";

export const adminNav: { title?: string; items: { tab: AdminTab; href: string; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; badge?: string }[] }[] = [
    { items: [{ tab: "overview", href: "/admin/overview", label: "Overview", icon: LayoutDashboard }] },
    { title: "Network", items: [
        { tab: "providers", href: "/admin/providers", label: "Providers", icon: Wrench },
        { tab: "requests", href: "/admin/requests", label: "Service requests", icon: LifeBuoy },
    ] },
    { title: "Members", items: [
        { tab: "memberships", href: "/admin/memberships", label: "Memberships", icon: Users },
        { tab: "organizations", href: "/admin/organizations", label: "Organizations", icon: Building2 },
        { tab: "advisor", href: "/admin/advisor", label: "Maintenance", icon: Droplets },
    ] },
    { title: "Smart Cards", items: [
        { tab: "nfc", href: "/admin/nfc", label: "Card inventory", icon: Nfc },
        { tab: "orders", href: "/admin/card-orders", label: "Card orders", icon: ShoppingBag },
        { tab: "cars", href: "/admin/car-images", label: "Car images", icon: Images },
    ] },
];

/** The staff navigation, shared by the desktop sidebar and the phone menu. */
export function AdminNavList({ activeTab, onNavigate, waiting = 0 }: { activeTab: AdminTab; onNavigate?: () => void; waiting?: number }) {
    const current = activeTab === "admin" ? "overview" : activeTab;
    return <nav aria-label="Back office" className="flex flex-col gap-5">
        {adminNav.map((group, index) => <div key={group.title || index}>
            {group.title && <p className="mb-1.5 px-3 text-[11px] uppercase tracking-[0.1em] text-[#999]">{group.title}</p>}
            <ul className="flex flex-col gap-0.5">{group.items.map(({ tab, href, label, icon: Icon, badge: fixedBadge }) => {
                const active = current === tab;
                const badge = tab === "requests" && waiting > 0 ? String(waiting) : fixedBadge;
                return <li key={tab}><Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cls("flex h-10 items-center gap-3 rounded-full px-3 text-[14px] transition-colors", active ? "bg-[#F3F3FF] text-[#1111F6]" : "text-[#444] hover:bg-[#F5F5F5] hover:text-[#171717]")}>
                    <Icon className={cls("h-[18px] w-[18px] shrink-0", active ? "text-[#1111F6]" : "text-[#888]")} strokeWidth={1.8} />
                    <span className="flex-1 truncate">{label}</span>
                    {badge && <span title={tab === "requests" ? `${badge} waiting for a provider` : undefined} className={cls("rounded-full px-2 py-0.5 text-[11px]", tab === "requests" ? "bg-[#FFF4DF] text-[#915C12]" : "bg-[#EEEEFF] text-[#1111F6]")}>{badge}</span>}
                </Link></li>;
            })}</ul>
        </div>)}
    </nav>;
}

export function AdminSidebar({ activeTab, email, onLogout, waiting }: { activeTab: AdminTab; email?: string | null; onLogout: () => void; waiting?: number }) {
    const initial = email?.[0]?.toUpperCase() || "A";
    return (
        <aside className="hidden h-full w-[260px] shrink-0 flex-col border-r border-[#EAEAEA] bg-white lg:flex">
            <Link href="/admin/overview" className="flex h-[72px] shrink-0 items-center gap-2.5 px-6">
                <Image src="/icon.svg" alt="" width={36} height={30} className="h-[30px] w-9" />
                <span className="text-[16px] font-medium tracking-[-0.03em] text-[#171717]">Motor Ambos</span>
                <span className="rounded-full bg-[#F3F3FF] px-2 py-0.5 text-[11px] text-[#1111F6]">Staff</span>
            </Link>
            <div className="flex-1 overflow-y-auto px-3 pb-6 pt-2"><AdminNavList activeTab={activeTab} waiting={waiting} /></div>
            <div className="flex items-center gap-3 border-t border-[#EAEAEA] px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1111F6] text-[13px] text-white">{initial}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] text-[#171717]">{email || "Staff"}</p><p className="text-[12px] text-[#888]">Staff account</p></div>
                <button type="button" onClick={onLogout} aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-full text-[#777] hover:bg-[#FFF0EF] hover:text-[#AA3333]"><LogOut className="h-4 w-4" /></button>
            </div>
        </aside>
    );
}
