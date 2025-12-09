"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic import for client-side only rendering of Leaflet map to avoid SSR errors
const ProviderMapClient = dynamic(
    () => import("./ProviderMapClient"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-xs font-medium">Loading Map...</span>
                </div>
            </div>
        )
    }
);

export default function ProviderMap(props: any) {
    return <ProviderMapClient {...props} />;
}
