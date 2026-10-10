import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Staff sign in",
    description: "Sign in to the Motor Ambos staff dashboard.",
    robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
    return <Suspense fallback={<div className="base-landing flex min-h-screen items-center justify-center bg-[#F7F7F7]">Loading sign in…</div>}><LoginForm mode="admin" /></Suspense>;
}
