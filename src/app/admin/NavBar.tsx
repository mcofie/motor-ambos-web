// src/app/admin/NavBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/supaFetch";
import type { User } from "@supabase/supabase-js"; // ✅ import Supabase User type

export default function NavBar({ user }: { user: User | null }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            console.error("[logout] failed:", e);
        } finally {
            window.location.href = "/login";
        }
    };

    return (
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary tracking-tight">MotorAmbos</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">Admin</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {user ? (
                        <>
                            <span className="truncate max-w-[200px] hidden sm:inline-block" title={user.email ?? "User"}>
                                {user.email ?? "User"}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-input bg-background px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.replace("/login")}
                            className="rounded-lg border border-input bg-background px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium"
                        >
                            Log in
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}