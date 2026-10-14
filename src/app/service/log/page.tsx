"use client";

import { Toaster } from "sonner";
import { ServicePortalForm } from "@/components/public/ServicePortalForm";

export default function ServiceLogPage() {
    return <>
        <Toaster position="top-center" />
        <ServicePortalForm />
    </>;
}
