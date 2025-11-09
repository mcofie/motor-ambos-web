// src/app/admin/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";

const srv = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only key
    { auth: { persistSession: false } }
);

type ProviderInsert = {
    display_name: string;
    phone_business?: string | null;
    about?: string | null;
    address_line?: string | null;
    is_active: boolean;
    coverage_radius_km: number;
    callout_fee: number;
    location?: string | null; // e.g. 'SRID=4326;POINT(lng lat)'
};

export async function adminInsertProvider(values: ProviderInsert): Promise<void> {
    const { error } = await srv.from("motorambos.providers").insert([values]);
    if (error) throw new Error(error.message);
}