// src/app/auth/signout/route.ts
import { getServerSupabase } from "@/lib/supabaseServer";

export async function POST() {
    const supabase = await getServerSupabase();
    await supabase.auth.signOut(); // clears the server auth cookie
    return Response.json({ ok: true });
}