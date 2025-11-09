// src/app/admin/layout.tsx
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // No cookie reads/writes here. No Supabase server client here.
    return <>{children}</>;
}