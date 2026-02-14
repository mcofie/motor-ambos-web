"use client";

import { use } from "react";
import { VehicleDetailView } from "@/components/admin/views/VehicleDetailView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: PageProps) {
    const { id } = use(params);
    return <VehicleDetailView vehicleId={id} />;
}
