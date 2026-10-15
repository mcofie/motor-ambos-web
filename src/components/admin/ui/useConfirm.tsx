"use client";

import React, { useCallback, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Ask = { title: string; body?: string; confirm?: string; danger?: boolean };

/**
 * A styled replacement for window.confirm. Render `dialog` once, then `await ask({...})`.
 * Resolves true when the person confirms, false when they cancel or close it.
 */
export function useConfirm() {
    const [open, setOpen] = useState<Ask | null>(null);
    const resolver = useRef<(value: boolean) => void>(() => {});

    const ask = useCallback((options: Ask) => new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpen(options);
    }), []);

    const close = (value: boolean) => {
        resolver.current(value);
        setOpen(null);
    };

    const dialog = <Dialog open={!!open} onOpenChange={(next) => !next && close(false)}>
        <DialogContent className="admin-theme base-landing max-w-sm text-[#171717] [&_[data-slot=dialog-title]]:font-medium [&_[data-slot=dialog-title]]:tracking-[-0.02em]">
            <DialogHeader>
                <DialogTitle>{open?.title}</DialogTitle>
                {open?.body && <DialogDescription>{open.body}</DialogDescription>}
            </DialogHeader>
            <DialogFooter>
                <button type="button" onClick={() => close(false)} className="inline-flex h-10 items-center rounded-full border border-[#E3E3E3] px-4 text-[14px]">Keep it</button>
                <button type="button" autoFocus onClick={() => close(true)} className={`inline-flex h-10 items-center rounded-full px-4 text-[14px] text-white ${open?.danger ? "bg-[#AA3333] hover:bg-[#922B2B]" : "bg-[#1111F6] hover:bg-[#0606D8]"}`}>{open?.confirm || "Confirm"}</button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;

    return { ask, dialog };
}
