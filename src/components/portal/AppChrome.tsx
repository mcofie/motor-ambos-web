"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, ChevronRight, IdCard, LifeBuoy, LogOut, Nfc, NotebookPen, Truck, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { logout } from "@/lib/supaFetch";
import { usePortalData } from "@/components/portal/PortalDataProvider";

export type AppTab = "cars" | "fleet" | "cards";

/** Shows the page title in the bar once the large title has scrolled away, as native apps do. */
function useTitleScrolledAway(targetId: string) {
    const [hidden, setHidden] = useState(false);
    useEffect(() => {
        // The title can appear after data loads, so look it up on each scroll rather than once.
        let frame = 0;
        const check = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const target = document.getElementById(targetId);
                setHidden(Boolean(target && target.getBoundingClientRect().bottom < 56));
            });
        };
        check();
        window.addEventListener("scroll", check, { passive: true });
        return () => { window.removeEventListener("scroll", check); cancelAnimationFrame(frame); };
    }, [targetId]);
    return hidden;
}

function AccountSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const router = useRouter();
    const { data, clear } = usePortalData();
    const name = data?.profile?.fullName || "Your account";
    const initials = (data?.profile?.fullName || data?.email || "?").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

    async function signOut() {
        await logout();
        clear();
        router.replace("/login");
    }

    const row = "flex min-h-[52px] w-full items-center gap-3 px-4 text-left text-[16px] outline-none active:bg-[#F3F3F3] focus-visible:bg-[#F3F3FF]";
    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bottom-0 left-0 top-auto max-w-none translate-x-0 translate-y-0 gap-0 rounded-b-none rounded-t-[24px] border-0 bg-[#F7F7F7] p-0 pb-[max(16px,env(safe-area-inset-bottom))] text-[#171717] sm:hidden">
            <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-[#D9D9D9]" />
            <div className="flex items-center gap-3 px-5 pb-4 pt-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1111F6] text-[16px] text-white">{initials}</span>
                <div className="min-w-0"><DialogTitle className="truncate text-[18px] font-normal tracking-[-0.02em]">{name}</DialogTitle><DialogDescription className="truncate text-[13px] text-[#777]">{data?.email}</DialogDescription></div>
            </div>
            <div className="mx-4 overflow-hidden rounded-[16px] bg-white">
                <Link href="/app#driver-profile" onClick={() => onOpenChange(false)} className={row}><IdCard className="h-5 w-5 text-[#1111F6]" /><span className="flex-1">Driver profile and licence</span><ChevronRight className="h-4 w-4 text-[#BBB]" /></Link>
                <Link href="/app/cards" onClick={() => onOpenChange(false)} className={`${row} border-t border-[#F0F0F0]`}><Nfc className="h-5 w-5 text-[#1111F6]" /><span className="flex-1">Smart Cards and orders</span><ChevronRight className="h-4 w-4 text-[#BBB]" /></Link>
                <Link href="/help" onClick={() => onOpenChange(false)} className={`${row} border-t border-[#F0F0F0]`}><LifeBuoy className="h-5 w-5 text-[#1111F6]" /><span className="flex-1">Roadside help</span><ChevronRight className="h-4 w-4 text-[#BBB]" /></Link>
            </div>
            <div className="mx-4 mt-3 overflow-hidden rounded-[16px] bg-white">
                <button type="button" onClick={() => void signOut()} className={`${row} text-[#AA3333]`}><LogOut className="h-5 w-5" />Sign out</button>
            </div>
        </DialogContent>
    </Dialog>;
}

/** The phone-only top bar. Desktop keeps its own header. */
export function MobileAppBar({ title, titleId = "page-title" }: { title: string; titleId?: string }) {
    const showTitle = useTitleScrolledAway(titleId);
    return <header className="sticky top-0 z-40 border-b border-transparent bg-[#F7F7F7]/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-colors data-[scrolled=true]:border-[#E6E6E6] sm:hidden" data-scrolled={showTitle}>
        <div className="relative flex h-12 items-center justify-between px-4">
            <Link href="/" aria-label="Motor Ambos home" className="flex h-10 w-10 items-center"><Image src="/icon.svg" alt="" width={32} height={27} className="h-[27px] w-8" /></Link>
            <p aria-hidden={!showTitle} className={`pointer-events-none absolute inset-x-16 truncate text-center text-[16px] tracking-[-0.02em] transition-all duration-200 ${showTitle ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>{title}</p>
            <Link href="/help" aria-label="Roadside help" className="flex h-10 w-10 items-center justify-center rounded-full text-[#1111F6] active:bg-black/5"><LifeBuoy className="h-[22px] w-[22px]" /></Link>
        </div>
    </header>;
}

/**
 * The phone-only tab bar: a floating glass pill of icon tabs, with the active tab in a lighter
 * inner pill that slides between tabs, and logging as a round button beside it.
 */
export function MobileTabBar({ active, showFleet, onLog }: { active: AppTab; showFleet: boolean; onLog: () => void }) {
    const [accountOpen, setAccountOpen] = useState(false);
    const items: { key: AppTab | "help" | "me"; label: string; icon: typeof Car; href?: string }[] = [
        { key: "cars", label: "My cars", icon: Car, href: "/app" },
        ...(showFleet ? [{ key: "fleet" as const, label: "My fleet", icon: Truck, href: "/app/fleet" }] : []),
        { key: "cards", label: "Smart Cards", icon: Nfc, href: "/app/cards" },
        ...(showFleet ? [] : [{ key: "help" as const, label: "Roadside help", icon: LifeBuoy, href: "/help" }]),
        { key: "me", label: "Account", icon: UserRound },
    ];
    const activeIndex = items.findIndex((item) => item.key === active);
    const itemClass = (current: boolean) => `relative z-10 flex h-full flex-1 items-center justify-center rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/60 ${current ? "text-white" : "text-white/60 active:text-white"}`;

    return <>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 px-4 pb-[max(14px,env(safe-area-inset-bottom))] sm:hidden">
            <nav aria-label="App" className="glass-tab-bar pointer-events-auto relative flex h-[60px] flex-1 items-stretch rounded-full p-1.5">
                {activeIndex >= 0 && <span aria-hidden className="absolute bottom-1.5 top-1.5 rounded-full bg-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[left] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ width: `calc((100% - 12px) / ${items.length})`, left: `calc(6px + (100% - 12px) * ${activeIndex} / ${items.length})` }} />}
                {items.map(({ key, label, icon: Icon, href }) => {
                    const current = key === active;
                    const icon = <Icon className="h-[23px] w-[23px]" strokeWidth={current ? 2.3 : 1.8} />;
                    return href
                        ? <Link key={key} href={href} aria-label={label} aria-current={current ? "page" : undefined} className={itemClass(current)}>{icon}</Link>
                        : <button key={key} type="button" aria-label={label} onClick={() => setAccountOpen(true)} className={itemClass(false)}>{icon}</button>;
                })}
            </nav>
            <button type="button" onClick={onLog} aria-label="Log a fill-up, service or problem" className="glass-log-button pointer-events-auto flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-white outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#1111F6]/40 focus-visible:ring-offset-2"><NotebookPen className="h-6 w-6" /></button>
        </div>
        <AccountSheet open={accountOpen} onOpenChange={setAccountOpen} />
    </>;
}
