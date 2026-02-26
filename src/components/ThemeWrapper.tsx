"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIdentity } from "./IdentityContext";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { identity } = useIdentity();

    // Only force standard on admin, otherwise follow context
    const isAdmin = pathname?.startsWith("/admin");
    const activeIdentity = isAdmin ? "standard" : identity;

    return (
        <div className={cn(
            "min-h-screen",
            activeIdentity === "brutalist" && "brutalist",
            activeIdentity === "blueprint" && "blueprint",
            activeIdentity === "onyx" && "onyx",
            activeIdentity === "platform" && "platform"
        )}>
            {children}
        </div>
    );
}
