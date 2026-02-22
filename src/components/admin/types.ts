export type UUID = string;

export type ProviderType =
    | "mechanic"
    | "mechanic_engine"
    | "mechanic_electrical"
    | "detailing"
    | "car_wash"
    | "roadworthy"
    | "insurance"
    | "shop"
    | "towing"
    | "fuel"
    | "auto_shop"
    | "tire"
    | "body_shop";

export type DaySchedule = {
    open: string;  // "08:00"
    close: string; // "17:00"
    closed: boolean;
};

export type OperatingHours = {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
};

export const DEFAULT_OPERATING_HOURS: OperatingHours = {
    monday: { open: "08:00", close: "17:00", closed: false },
    tuesday: { open: "08:00", close: "17:00", closed: false },
    wednesday: { open: "08:00", close: "17:00", closed: false },
    thursday: { open: "08:00", close: "17:00", closed: false },
    friday: { open: "08:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "14:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
};

export interface ProviderRow {
    id: UUID;
    display_name: string;
    phone_business: string | null;
    about: string | null;
    address_line: string | null;
    is_active: boolean;
    coverage_radius_km: number | null;
    callout_fee: number | null;
    lng?: number | null;
    lat?: number | null;
    created_at?: string;
    updated_at?: string;
    is_verified?: boolean | null;
    provider_type?: ProviderType | null;
    logo_url?: string | null;
    backdrop_url?: string | null;
    operating_hours?: OperatingHours | null;
    experience_years?: number | null;
    specializations?: string | null;
    certification_url?: string | null;
    purchase_url?: string | null;
    purchase_action_label?: string | null;
}

export interface ServiceRow {
    id: UUID;
    name: string;
    code?: string | null;
}

export interface RequestRow {
    id: UUID;
    created_at: string;
    service_id: UUID | null;
    status: string | null;
    driver_name: string | null;
    driver_phone?: string | null;
    provider_id: UUID | null;
    details?: string | null;
    address_line?: string | null;
    location?: unknown;
}

export type RequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

export interface ProviderRateRow {
    service_id: UUID;
    base_price: number | null;
    price_unit: string | null;
}

export interface User {
    id: UUID;
    email: string;
}

// Provider stats computed from requests
export interface ProviderStats {
    totalJobs: number;
    completedJobs: number;
    completionRate: number; // 0-100
    avgRating: number | null;
    revenue: number;
}

export type FuelLogRow = {
    id: string;
    vehicle_id: string;
    user_id: string;
    date: string;
    liters: number;
    price_per_liter: number;
    total_cost: number;
    odometer_reading: number | null;
    station_name: string | null;
    fuel_type: string | null;
    is_full_tank?: boolean;
    notes?: string | null;
    created_at: string;
};

export type DrivingTripRow = {
    id: string;
    user_id: string;
    vehicle_id: string;
    start_time: string;
    end_time: string;
    distance_km: number;
    average_score: number;
};

export type AiQueryRow = {
    id: string;
    member_id: string;
    event_type: string;
    event_data: {
        query: string;
        response: string;
    };
    created_at: string;
};
