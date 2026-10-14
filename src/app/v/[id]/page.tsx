import { cache } from "react";
import type { Metadata } from "next";
import SmartCardPublicPage from "@/components/public/SmartCardPublicPage";
import { loadPublicCard } from "@/lib/publicCard";

type PageProps = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

// The title and the page both need the card; load it once per request.
const getCard = cache(loadPublicCard);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const page = await getCard((await params).id).catch(() => null);
    return {
        title: page?.state === "linked" ? page.title : "Smart Card",
        robots: { index: false, follow: false },
    };
}

export default async function PublicVehiclePage({ params }: PageProps) {
    const { id } = await params;
    return <SmartCardPublicPage page={await getCard(id)} />;
}
