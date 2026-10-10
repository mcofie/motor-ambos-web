import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to your Motor Ambos account.",
    robots: { index: false, follow: false },
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="base-landing flex min-h-screen items-center justify-center bg-[#F7F7F7] text-[15px] text-[#777]">Loading sign in…</div>}>
            <LoginForm />
        </Suspense>
    );
}
