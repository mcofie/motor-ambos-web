import type React from "react";
import { CircleDot, Droplets, Fuel, PaintBucket, ShieldCheck, Sparkles, Store, Truck, Wrench, Zap } from "lucide-react";
import type { ProviderType } from "../types";

/** The kinds of provider staff can list, in the order the form shows them. */
export const PROVIDER_TYPES: { value: ProviderType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "mechanic", label: "Mechanic", icon: Wrench },
    { value: "mechanic_engine", label: "Engine specialist", icon: Wrench },
    { value: "mechanic_electrical", label: "Auto electrician", icon: Zap },
    { value: "towing", label: "Towing", icon: Truck },
    { value: "tire", label: "Tyres", icon: CircleDot },
    { value: "fuel", label: "Fuel delivery", icon: Fuel },
    { value: "body_shop", label: "Body and paint", icon: PaintBucket },
    { value: "auto_shop", label: "Auto shop", icon: Store },
    { value: "shop", label: "Spare parts", icon: Store },
    { value: "car_wash", label: "Car wash", icon: Droplets },
    { value: "detailing", label: "Detailing", icon: Sparkles },
    { value: "roadworthy", label: "Roadworthy centre", icon: ShieldCheck },
    { value: "insurance", label: "Insurance", icon: ShieldCheck },
];

export function providerType(type?: string | null) {
    return PROVIDER_TYPES.find((t) => t.value === type) || PROVIDER_TYPES[0];
}
