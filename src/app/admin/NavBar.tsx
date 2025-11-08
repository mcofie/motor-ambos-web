// src/app/admin/NavBar.tsx
"use client";
import {useRouter} from "next/navigation";
import {supabaseBrowser} from "@/lib/supabaseBrowser";

export default function NavBar({user}: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Clear client session (localStorage)
            await supabaseBrowser.auth.signOut();

            // Clear server cookie
            await fetch("/auth/signout", {method: "POST", credentials: "include"});

            // Navigate away and refresh any cached SSR content
            router.replace("/login");
            router.refresh();
        } catch (e) {
            console.error("[logout] failed:", e);
            // As a fallback, still go to login
            router.replace("/login");
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-black">MotorAmbos</span>
                    <span className="text-xs text-gray-500">Admin Panel</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    {user ? (
                        <>
              <span className="truncate max-w-[200px]" title={user.email}>
                {user.email}
              </span>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.replace("/login")}
                            className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100"
                        >
                            Log in
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}