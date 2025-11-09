// src/app/admin/page.tsx
"use client";
import * as React from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js"; // ✅ type-only import
import AdminDashboard from "@/components/AdminDashboard";
import NavBar from "./NavBar";
import { getUser } from "@/lib/supaFetch";

export default function AdminPage() {
    const [user, setUser] = React.useState<SupabaseUser | null>(null); // ✅ no 'any'
    const [checking, setChecking] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            // first attempt (getUser does its own short retries)
            const u1 = await getUser();
            if (u1) {
                setUser(u1 as SupabaseUser);
                setChecking(false);
                return;
            }
            // one last grace attempt
            const u2 = await getUser();
            if (u2) {
                setUser(u2 as SupabaseUser);
                setChecking(false);
                return;
            }
            // really no session → go to login
            window.location.replace("/login");
        })();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
                Checking authentication…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar user={user} />
            <main className="mx-auto max-w-6xl p-4 md:p-6">
                <AdminDashboard />
            </main>
        </div>
    );
}