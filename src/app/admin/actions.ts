"use server";
import { createClient } from "@supabase/supabase-js";

const srv = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
    { auth: { persistSession: false } }
);

export async function adminInsertProvider(values: any) {
    const { error } = await srv.from("motorambos.providers").insert([values]);
    if (error) throw new Error(error.message);
}