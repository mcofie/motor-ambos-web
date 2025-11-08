"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser as supabase } from "@/lib/supabaseBrowser"; // <- fix

export default function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const err = params?.get("err");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.replace("/admin");
        } catch (e: any) {
            setError(e.message || String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto my-16 w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
            <p className="mb-4 text-sm text-gray-600">Admin access only.</p>
            {err === "not_admin" && (
                <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                    Your account isn’t authorized for admin access.
                </p>
            )}
            {error && <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}

            <form onSubmit={signIn} className="space-y-3">
                <label className="block text-sm">
                    <span className="text-gray-700">Email</span>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        type="email" value={email} onChange={e => setEmail((e.target as HTMLInputElement).value)} required
                    />
                </label>
                <label className="block text-sm">
                    <span className="text-gray-700">Password</span>
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        type="password" value={password} onChange={e => setPassword((e.target as HTMLInputElement).value)} required
                    />
                </label>
                <button className="w-full rounded-xl bg-black px-3 py-2 text-white disabled:opacity-50" disabled={loading}>
                    {loading ? "Please wait…" : "Sign in"}
                </button>
            </form>
        </div>
    );
}