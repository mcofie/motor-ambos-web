import { NextResponse } from "next/server";
import { canManageFleet, getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";

export async function GET(request: Request) {
    const orgId = new URL(request.url).searchParams.get("orgId");
    if (!orgId || !/^[0-9a-f-]{36}$/i.test(orgId)) return NextResponse.json({ error: "Choose a fleet" }, { status: 400 });
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const service = getServiceClient();
    const [{ data: member, error: memberError }, { data: organization, error: organizationError }] = await Promise.all([
        service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle(),
        service.from("members").select("id,auth_user_id").eq("id", orgId).eq("is_business", true).maybeSingle(),
    ]);
    if (memberError || organizationError) return NextResponse.json({ error: "Could not load fleet" }, { status: 500 });
    if (!member || !organization || !await canManageFleet(service, member.id, orgId)) return NextResponse.json({ error: "Fleet manager access required" }, { status: 403 });
    const ownerIds = [organization.id, organization.auth_user_id].filter(Boolean) as string[];
    const { data: vehicles, error: vehicleError } = await service.from("vehicles").select("id,plate,make,model").in("user_id", ownerIds);
    if (vehicleError) return NextResponse.json({ error: "Could not load fleet vehicles" }, { status: 500 });
    if (!vehicles?.length) return NextResponse.json({ issues: [] });
    const { data: issues, error } = await service.from("vehicle_issues")
        .select("id,vehicle_id,category,note,created_at")
        .in("vehicle_id", vehicles.map((vehicle) => vehicle.id)).eq("status", "open")
        .order("created_at", { ascending: false }).limit(100);
    if (error) return NextResponse.json({ issues: [], available: false });
    const vehicleLabels = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.plate || [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle"]));
    return NextResponse.json({ issues: (issues || []).map((issue) => ({ ...issue, vehicleLabel: vehicleLabels.get(issue.vehicle_id) || "Vehicle" })), available: true }, { headers: { "Cache-Control": "no-store" } });
}
