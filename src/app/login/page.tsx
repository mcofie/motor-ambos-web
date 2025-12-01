import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
    title: "Login",
    description: "Sign in to your Motor Ambos account.",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <LoginForm />
        </Suspense>
    );
}