"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const isAdmin = (email?: string | null) => {
    const csv = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").toLowerCase();
    const list = csv.split(",").map(s => s.trim()).filter(Boolean);
    return list.length === 0 ? true : !!email && list.includes(email.toLowerCase());
};

export default function AdminGate({ children }: React.PropsWithChildren) {
    const router = useRouter();
    const [ready, setReady] = React.useState(false);
    const [allowed, setAllowed] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;

        (async () => {
            // getSession is very reliable in browser
            const { data, error } = await supabase.auth.getSession();
            if (error) console.warn("[AdminGate] getSession error:", error);

            const user = data?.session?.user ?? null;
            if (!user) return router.replace("/login");

            if (!isAdmin(user.email)) {
                return router.replace("/login?err=not_admin");
            }
            if (!mounted) return;
            setAllowed(true);
            setReady(true);
        })();

        const sub = supabase.auth.onAuthStateChange((_ev, session) => {
            const user = session?.user ?? null;
            if (!user) return router.replace("/login");
            if (!isAdmin(user.email)) return router.replace("/login?err=not_admin");
            setAllowed(true);
            setReady(true);
        });

        return () => {
            mounted = false;
            sub.data.subscription.unsubscribe();
        };
    }, [router]);

    if (!ready || !allowed) return null;
    return <>{children}</>;
}