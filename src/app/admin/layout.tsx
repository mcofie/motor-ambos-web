// src/app/admin/layout.tsx
import React from "react";
import {getServerSupabase} from "@/lib/supabaseServer";
import NavBar from "./NavBar";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    const supabase = await getServerSupabase();
    const {data: {user}} = await supabase.auth.getUser();
    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar user={user}/>
            <main className="mx-auto max-w-6xl p-6">{children}</main>
        </div>
    );
}