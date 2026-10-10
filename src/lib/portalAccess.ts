import { canManageFleet, getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";

export async function getPortalVehicleAccess(vehicleId: string) {
    const user = await getAuthenticatedUser();
    if (!user) return { status: 401 as const };
    const service = getServiceClient();
    const [{ data: member, error: memberError }, { data: vehicle, error: vehicleError }] = await Promise.all([
        service.from("members").select("id,is_business").eq("auth_user_id", user.id).maybeSingle(),
        service.from("vehicles").select("id,user_id,plate").eq("id", vehicleId).maybeSingle(),
    ]);
    if (memberError || vehicleError) return { status: 500 as const };
    if (!member || !vehicle) return { status: 404 as const };

    const owns = vehicle.user_id === member.id || vehicle.user_id === user.id;
    const { data: legacyOwner, error: legacyOwnerError } = owns
        ? { data: null, error: null }
        : await service.from("members").select("id").eq("auth_user_id", vehicle.user_id).eq("is_business", true).maybeSingle();
    if (legacyOwnerError) return { status: 500 as const };
    const orgId = legacyOwner?.id || vehicle.user_id;
    const manages = !owns && await canManageFleet(service, member.id, orgId);
    const { data: assignment, error: assignmentError } = owns || manages
        ? { data: null, error: null }
        : await service.from("organization_members").select("member_id").eq("member_id", member.id).eq("vehicle_id", vehicle.id).eq("role", "DRIVER").maybeSingle();
    if (assignmentError) return { status: 500 as const };
    if (!owns && !manages && !assignment) return { status: 403 as const };
    return { status: 200 as const, user, member, vehicle, service, canEdit: owns || manages, canReport: true };
}
