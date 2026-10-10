import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient, type User } from "@supabase/supabase-js";

export async function getAuthenticatedUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const client = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (items) => {
                    try {
                        items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    } catch {
                        // Server components cannot update cookies; route handlers can.
                    }
                },
            },
        }
    );
    const { data: { user }, error } = await client.auth.getUser();
    return error ? null : user;
}

export function isStaffEmail(email?: string | null): boolean {
    const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
    return Boolean(email && allowed.includes(email.toLowerCase()));
}

export async function getStaffAccess(): Promise<"ok" | "unauthenticated" | "forbidden"> {
    const user = await getAuthenticatedUser();
    if (!user) return "unauthenticated";
    return isStaffEmail(user.email) ? "ok" : "forbidden";
}

export async function staffApiError(): Promise<NextResponse | null> {
    const access = await getStaffAccess();
    if (access === "ok") return null;
    return NextResponse.json(
        { error: access === "unauthenticated" ? "Sign in required" : "Staff access required" },
        { status: access === "unauthenticated" ? 401 : 403 }
    );
}

export async function requireStaffPage(): Promise<User> {
    const user = await getAuthenticatedUser();
    if (!user || !isStaffEmail(user.email)) redirect("/admin/login");
    return user;
}

export function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false }, db: { schema: "motorambos" } }
    );
}

/** A business contact can manage its fleet without taking the driver's role away. */
export async function canManageFleet(service: ReturnType<typeof getServiceClient>, memberId: string, orgId: string): Promise<boolean> {
    const [{ data: organization, error: organizationError }, { data: manager, error: managerError }] = await Promise.all([
        service.from("members").select("id,contact_member_id").eq("id", orgId).eq("is_business", true).maybeSingle(),
        service.from("organization_members").select("id").eq("member_id", memberId).eq("org_member_id", orgId).eq("role", "ADMIN").maybeSingle(),
    ]);
    if (organizationError || managerError) {
        console.error("Could not check fleet access:", organizationError?.code || managerError?.code);
        return false;
    }
    return Boolean(organization && (organization.id === memberId || organization.contact_member_id === memberId || manager));
}
