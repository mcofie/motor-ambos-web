import type { Metadata, Viewport } from "next";
import { PortalDataProvider } from "@/components/portal/PortalDataProvider";

export const metadata: Metadata = {
    robots: { index: false, follow: false },
    appleWebApp: { capable: true, title: "Motor Ambos", statusBarStyle: "default" },
};

// Edge to edge on phones, so the app bar and tab bar can sit in the safe areas.
export const viewport: Viewport = {
    viewportFit: "cover",
    themeColor: "#F7F7F7",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return <PortalDataProvider>{children}</PortalDataProvider>;
}
