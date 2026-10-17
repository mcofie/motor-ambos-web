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
    /** ice (petrol or diesel), hybrid or ev. Missing for cars added before it existed. */
    powertrain?: "ice" | "hybrid" | "ev" | null;
    current_mileage?: number | null;
    last_oil_change_mileage?: number | null;
    /** The car's own photo, or a matching studio photo from the car image library, if there is one. */
    image_url?: string | null;
    /** True when image_url is the owner's own photo rather than a library picture. */
    has_own_photo?: boolean;
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
