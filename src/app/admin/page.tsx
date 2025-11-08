import {redirect} from "next/navigation";
import AdminClient from "./AdminClient";
import {getServerSupabase} from "@/lib/supabaseServer";

export default async function AdminPage() {
    const supabase = await getServerSupabase();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Optional admin allowlist
    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const allowAllIfUnset = true;
    const email = (user.email || "").toLowerCase();
    const isAdmin = admins.length > 0 ? admins.includes(email) : allowAllIfUnset;

    if (!isAdmin) {
        redirect("/login?err=not_admin");
    }

    return <AdminClient/>;
}