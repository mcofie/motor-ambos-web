"use client";

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { getUser, logout } from "@/lib/supaFetch";
import { AdminLayout } from "./admin/AdminLayout";
import { ProvidersView } from "./admin/views/ProvidersView";
import { RequestsView } from "./admin/views/RequestsView";
import { MembershipsView } from "./admin/views/MembershipsView";
import { User } from "./admin/types";

export default function AdminDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<"providers" | "requests" | "memberships">("providers");

    useEffect(() => {
        getUser().then((u) => {
            if (u) setUser(u as User);
        });
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            toast.error("Failed to log out");
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <AdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                onLogout={handleLogout}
            >
                {activeTab === "providers" && <ProvidersView />}
                {activeTab === "requests" && <RequestsView />}
                {activeTab === "memberships" && <MembershipsView />}
            </AdminLayout>
        </>
    );
}