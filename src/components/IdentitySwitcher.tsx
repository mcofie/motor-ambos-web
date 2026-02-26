"use client";

import React from "react";
import { useIdentity } from "./IdentityContext";
import { Layout, Boxes, Compass, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function IdentitySwitcher() {
    const { identity, setIdentity } = useIdentity();

    const themes = [
        { id: "platform", name: "Platform", icon: <Globe size={14} /> },
        { id: "onyx", name: "Onyx", icon: <Smartphone size={14} /> },
        { id: "brutalist", name: "Brutalist", icon: <Boxes size={14} /> },
        { id: "standard", name: "Forest", icon: <Layout size={14} /> },
        { id: "blueprint", name: "Blueprint", icon: <Compass size={14} /> },
    ] as const;

    return (
        <div className="flex bg-muted onyx:bg-white/5 platform:bg-slate-100 border-2 border-foreground onyx:border-white/10 platform:border-slate-200 rounded-[4px] p-1 gap-1">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => setIdentity(theme.id as any)}
                    title={theme.name}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all",
                        identity === theme.id
                            ? "bg-foreground text-background platform:bg-white platform:text-slate-900 platform:shadow-sm"
                            : "text-foreground hover:bg-primary platform:text-slate-500 platform:hover:bg-white/50"
                    )}
                >
                    {theme.icon}
                    <span className="hidden xl:inline">{theme.name}</span>
                </button>
            ))}
        </div>
    );
}
