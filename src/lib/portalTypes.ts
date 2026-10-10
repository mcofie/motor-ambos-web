export type PortalVehicle = {
    id: string;
    user_id: string;
    orgId?: string;
    name: string | null;
    make: string | null;
    model: string | null;
    year: string | null;
    plate: string | null;
    color: string | null;
    insurance_end_date: string | null;
    roadworthy_expiry: string | null;
    roadworthy_doc_url: string | null;
};

export type PortalDocument = {
    id: string;
    vehicle_id: string;
    kind: "insurance" | "roadworthy";
    expires_on: string | null;
    file_url: string | null;
};

export type PortalOrganization = {
    id: string;
    name: string;
    role: "OWNER" | "ADMIN" | "DRIVER";
    assignedVehicleId?: string | null;
};

export type PortalData = {
    email: string;
    needsProfile: boolean;
    suggestedProfile?: { fullName: string; phone: string };
    profile: { id: string; fullName: string; phone: string; isBusiness: boolean } | null;
    personalVehicles: PortalVehicle[];
    fleetVehicles: PortalVehicle[];
    assignedVehicles: PortalVehicle[];
    organizations: PortalOrganization[];
    fleetDrivers: Array<{ id: string; orgId: string; name: string; phone: string; vehicleId: string | null }>;
    documents: PortalDocument[];
    documentUploadAvailable: boolean;
};
