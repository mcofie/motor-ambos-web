import {Suspense} from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <LoginForm/>
        </Suspense>
    );
}