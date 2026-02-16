import { VehicleDetailView } from "@/components/admin/views/VehicleDetailView";
import { getAdminVehicleDetails } from "@/lib/adminServerFetch";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
    const { id } = await params;
    const data = await getAdminVehicleDetails(id);

    return (
        <VehicleDetailView
            vehicleId={id}
            initialVehicle={data?.vehicle}
            initialHistory={data?.history}
        />
    );
}
