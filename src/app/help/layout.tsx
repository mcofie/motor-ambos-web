import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Get Help",
    description: "Request on-demand roadside assistance. Battery, tyre, fuel, and towing services.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
