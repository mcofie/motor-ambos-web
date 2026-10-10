import HomeLanding from "@/components/landing-home/HomeLanding";
import type { Metadata } from "next";
import { siteDescription, siteTitle } from "@/lib/metadata";

export const metadata: Metadata = {
    title: { absolute: siteTitle },
    description: siteDescription,
    alternates: { canonical: "/" },
};

export default function LandingPage() {
    return <HomeLanding />;
}
