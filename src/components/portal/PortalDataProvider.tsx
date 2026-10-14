"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalData } from "@/lib/portalTypes";

type PortalDataContextValue = {
    data: PortalData | null;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
    clear: () => void;
};

const PortalDataContext = createContext<PortalDataContextValue | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [data, setData] = useState<PortalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pending = useRef<Promise<void> | null>(null);

    const reload = useCallback(async () => {
        if (pending.current) return pending.current;
        const request = (async () => {
            try {
                const response = await fetch("/api/portal/me", { cache: "no-store" });
                if (response.status === 401) {
                    setData(null);
                    router.replace(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
                    return;
                }
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Could not load your account");
                setData(result as PortalData);
                setError(null);
            } catch (reason) {
                setError(reason instanceof Error ? reason.message : "Could not load your account");
                throw reason;
            } finally {
                setLoading(false);
            }
        })();
        pending.current = request;
        try {
            await request;
        } finally {
            pending.current = null;
        }
    }, [router]);

    useEffect(() => { void reload().catch(() => undefined); }, [reload]);

    const clear = useCallback(() => {
        setData(null);
        setError(null);
    }, []);

    return <PortalDataContext.Provider value={{ data, loading, error, reload, clear }}>{children}</PortalDataContext.Provider>;
}

export function usePortalData() {
    const context = useContext(PortalDataContext);
    if (!context) throw new Error("usePortalData must be used inside PortalDataProvider");
    return context;
}
