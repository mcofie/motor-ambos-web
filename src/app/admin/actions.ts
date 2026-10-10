// src/app/admin/actions.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { requireStaffPage } from "@/lib/serverAuth";
import { normalizePhone } from "@/lib/phone";

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
    await requireStaffPage();
    const phone = values.phone_business ? normalizePhone(values.phone_business) : null;
    if (values.phone_business && !phone) throw new Error("Enter a valid phone number, such as +233558508306.");
    const { error } = await srv.from("motorambos.providers").insert([{ ...values, phone_business: phone }]);
    if (error) throw new Error(error.message);
}
