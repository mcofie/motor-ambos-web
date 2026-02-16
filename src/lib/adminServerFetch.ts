import { createClient } from "@supabase/supabase-js";
import { VehicleRow, MemberWithMembershipRow, MembershipPlanRow, ServiceHistoryRow } from "./supaFetch";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabaseAdmin() {
    if (!URL || !SERVICE_KEY) {
        throw new Error("Missing Supabase Service Key");
    }
    return createClient(URL, SERVICE_KEY, {
        auth: { persistSession: false },
        db: { schema: 'motorambos' }
    });
}

// Server-side admin fetcher that bypasses RLS
export async function getAdminMemberDetails(memberId: string) {
    const supabase = getSupabaseAdmin();

    // 1. Fetch Member
    const { data: member, error: mError } = await supabase
        .from("members")
        .select(`
            *,
            membership_plans (
                name,
                code
            )
        `)
        .eq("id", memberId)
        .single();

    if (mError || !member) {
        console.error("Admin Fetch Member Error:", mError);
        return null;
    }

    const memberRow = {
        member_id: member.id,
        auth_user_id: member.auth_user_id,
        full_name: member.full_name,
        phone: member.phone,
        email: member.email,
        membership_tier: member.membership_tier,
        membership_number: member.membership_number,
        membership_expiry_date: member.membership_expiry_date,
        membership_is_active: member.membership_is_active,
        plan_name: member.membership_plans?.name,
        plan_code: member.membership_plans?.code,
        car_brand: member.car_brand,
        id: member.id,
        is_business: member.is_business || false,
        business_name: member.business_name,
    } as MemberWithMembershipRow;

    // 2. Fetch Vehicles (by member_id OR auth_user_id)
    const ids = [memberRow.member_id];
    if (memberRow.auth_user_id) ids.push(memberRow.auth_user_id);

    const { data: vehicles, error: vError } = await supabase
        .from("vehicles")
        .select("*")
        .in("user_id", ids);

    if (vError) {
        console.error("Admin Fetch Vehicles Error:", vError);
    }

    return {
        member: memberRow,
        vehicles: (vehicles || []) as VehicleRow[]
    };
}

export async function getAdminMembershipPlans(): Promise<MembershipPlanRow[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .order("price_monthly", { ascending: true });

    if (error) {
        console.error("Admin Fetch Plans Error:", error);
        return [];
    }
    return (data || []) as MembershipPlanRow[];
}

export async function getAdminAllVehicles(): Promise<VehicleRow[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("vehicles")
        .select("*");

    if (error) {
        console.error("Admin Fetch All Vehicles Error:", error);
        return [];
    }
    return (data || []) as VehicleRow[];
}

export async function getAdminMembersWithMemberships(): Promise<MemberWithMembershipRow[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from("members")
        .select(`
            *,
            membership_plans (
                name,
                code
            )
        `);

    if (error) {
        console.error("Admin Fetch Members Error:", error);
        return [];
    }

    const rows = (data || []) as any[];
    return rows.map(r => ({
        member_id: r.id,
        auth_user_id: r.auth_user_id,
        full_name: r.full_name,
        phone: r.phone,
        email: r.email,
        membership_tier: r.membership_tier,
        membership_number: r.membership_number,
        membership_expiry_date: r.membership_expiry_date,
        membership_is_active: r.membership_is_active,
        plan_name: r.membership_plans?.name,
        plan_code: r.membership_plans?.code,
        car_brand: r.car_brand,
        id: r.id,
        is_business: r.is_business || false,
        business_name: r.business_name,
    })) as MemberWithMembershipRow[];
}

export async function getAdminVehicleDetails(vehicleId: string) {
    const supabase = getSupabaseAdmin();

    const { data: vehicle, error: vError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .single();

    if (vError || !vehicle) {
        console.error("Admin Fetch Vehicle Error:", vError);
        return null;
    }

    const { data: history, error: hError } = await supabase
        .from("service_history")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("service_date", { ascending: false });

    if (hError) {
        console.error("Admin Fetch Vehicle History Error:", hError);
    }

    return {
        vehicle: vehicle as VehicleRow,
        history: (history || []) as ServiceHistoryRow[]
    };
}
