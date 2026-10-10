import { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = publicPageMetadata("Roadside Help", "Find nearby roadside providers for battery trouble, flat tyres, towing, fuel, and other car problems in Ghana.", "/help");

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
