import type { Metadata } from "next";
import { PortalDataProvider } from "@/components/portal/PortalDataProvider";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return <PortalDataProvider>{children}</PortalDataProvider>;
}
