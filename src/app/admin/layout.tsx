"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { getUser, logout } from "@/lib/supaFetch";
import { AdminLayout as BaseAdminLayout } from "@/components/admin/AdminLayout";
import { User } from "@/components/admin/types";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const u = await getUser();
            if (u) {
                setUser(u as User);
                setChecking(false);
            } else {
                router.replace("/login");
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to log out");
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 gap-4">
                <div className="h-8 w-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse">Authenticating...</p>
            </div>
        );
    }

    // Determine active tab from pathname
    const pathParts = pathname.split("/");
    // If it's something like /admin/memberships/123, the active tab is "memberships"
    let activeTab: "overview" | "providers" | "requests" | "memberships" | "nfc" = "overview";

    if (pathParts.includes("memberships") || pathParts.includes("vehicles")) activeTab = "memberships";
    else if (pathParts.includes("providers")) activeTab = "providers";
    else if (pathParts.includes("requests")) activeTab = "requests";
    else if (pathParts.includes("nfc")) activeTab = "nfc";
    else if (pathParts.includes("overview")) activeTab = "overview";

    return (
        <>
            <Toaster position="top-right" />
            <BaseAdminLayout
                activeTab={activeTab}
                user={user}
                onLogout={handleLogout}
            >
                {children}
            </BaseAdminLayout>
        </>
    );
}