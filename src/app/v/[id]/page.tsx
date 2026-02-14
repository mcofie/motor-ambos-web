import { PublicVehicleView } from "@/components/public/PublicVehicleView";
import { fetchPassportData } from "@/lib/serverFetch";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicVehiclePage({ params }: PageProps) {
    const { id } = await params;
    // Fetch data securely on the server side to bypass RLS restrictions on public access
    const data = await fetchPassportData(id);

    return <PublicVehicleView nfcId={id} initialData={data} />;
}
