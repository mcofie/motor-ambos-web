"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic import for client-side only rendering of Leaflet map to avoid SSR errors
const ProviderMapClient = dynamic(
    () => import("./ProviderMapClient"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-[#F2F2F2] rounded-xl border border-[#E7E7E7] ">
                <div className="flex flex-col items-center gap-2 text-[#A3A3A3]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-xs font-medium">Loading Map...</span>
                </div>
            </div>
        )
    }
);

export default function ProviderMap(props: React.ComponentProps<typeof ProviderMapClient>) {
    return <ProviderMapClient {...props} />;
}
