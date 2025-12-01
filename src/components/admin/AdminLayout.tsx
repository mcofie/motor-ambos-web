import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { User } from "./types";

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: "providers" | "requests" | "memberships";
    setActiveTab: (tab: "providers" | "requests" | "memberships") => void;
    user: User | null;
    onLogout: () => void;
}

export function AdminLayout({ children, activeTab, setActiveTab, user, onLogout }: AdminLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10">
                    <h1 className="text-xl font-bold tracking-tight capitalize">
                        {activeTab} Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {user?.email}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.email?.[0]?.toUpperCase() || "A"}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
