import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import type { PortalData, PortalOrganization, PortalVehicle } from "@/lib/portalTypes";
import { formatPhone, normalizePhone, phoneVariants } from "@/lib/phone";
import { reportMajorActivity } from "@/lib/discordActivity";

export const dynamic = "force-dynamic";

const ProfileSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    phone: z.string().trim().refine((value) => Boolean(normalizePhone(value))),
});

export async function GET() {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

    const service = getServiceClient();
    const { data: member, error: memberError } = await service.from("members")
        .select("id,full_name,phone,is_business,business_name")
        .eq("auth_user_id", user.id)
        .maybeSingle();
    if (memberError) return NextResponse.json({ error: "Could not load account" }, { status: 500 });

    const empty: PortalData = {
        email: user.email || "",
        needsProfile: true,
        suggestedProfile: { fullName: String(user.user_metadata?.full_name || ""), phone: formatPhone(String(user.user_metadata?.phone || "")) },
        profile: null,
        personalVehicles: [],
        fleetVehicles: [],
        assignedVehicles: [],
        organizations: [],
        fleetDrivers: [],
        documents: [],
        documentUploadAvailable: false,
    };
    if (!member) return NextResponse.json(empty, { headers: { "Cache-Control": "no-store" } });

    const [membershipResult, contactResult] = await Promise.all([
        service.from("organization_members").select("org_member_id,vehicle_id,role").eq("member_id", member.id),
        service.from("members").select("id,business_name,full_name").eq("contact_member_id", member.id).eq("is_business", true),
    ]);
    const { data: memberships, error: membershipsError } = membershipResult;
    if (membershipsError) return NextResponse.json({ error: "Could not load account roles" }, { status: 500 });
    const { data: contactOrganizations, error: contactError } = contactResult;
    if (contactError) return NextResponse.json({ error: "Could not load business contacts" }, { status: 500 });
    const contactOrgIds = new Set((contactOrganizations || []).map((row) => row.id));

    const orgIds = Array.from(new Set([
        ...(member.is_business ? [member.id] : []),
        ...(memberships || []).map((row) => row.org_member_id),
        ...contactOrgIds,
    ]));
    const membershipsByOrg = new Map((memberships || []).map((row) => [row.org_member_id, row]));
    const managedOrgIds = orgIds.filter((orgId) => member.is_business && orgId === member.id || contactOrgIds.has(orgId) || membershipsByOrg.get(orgId)?.role === "ADMIN");
    const assignedIds = (memberships || []).flatMap((row) => row.vehicle_id ? [row.vehicle_id] : []);
    const ownerIds = Array.from(new Set([user.id, member.id, ...managedOrgIds]));
    const [orgResult, ownedResult, assignedResult, driversResult] = await Promise.all([
        orgIds.length
            ? service.from("members").select("id,business_name,full_name").in("id", orgIds)
            : Promise.resolve({ data: [], error: null }),
        service.from("vehicles").select("id,user_id,name,make,model,year,plate,color,insurance_end_date,roadworthy_expiry,roadworthy_doc_url").in("user_id", ownerIds),
        assignedIds.length
            ? service.from("vehicles").select("id,user_id,name,make,model,year,plate,color,insurance_end_date,roadworthy_expiry,roadworthy_doc_url").in("id", assignedIds)
            : Promise.resolve({ data: [], error: null }),
        managedOrgIds.length
            ? service.from("organization_members").select("member_id,org_member_id,vehicle_id").in("org_member_id", managedOrgIds).eq("role", "DRIVER")
            : Promise.resolve({ data: [], error: null }),
    ]);
    if (orgResult.error) return NextResponse.json({ error: "Could not load organizations" }, { status: 500 });
    if (ownedResult.error || assignedResult.error) return NextResponse.json({ error: "Could not load vehicles" }, { status: 500 });
    if (driversResult.error) return NextResponse.json({ error: "Could not load fleet drivers" }, { status: 500 });
    const orgNames = new Map((orgResult.data || []).map((row) => [row.id, row.business_name || row.full_name || "Fleet"]));
    const organizations: PortalOrganization[] = orgIds.map((orgId): PortalOrganization => {
        const membership = membershipsByOrg.get(orgId);
        return {
            id: orgId,
            name: orgNames.get(orgId) || "Fleet",
            role: member.is_business && orgId === member.id ? "OWNER" : contactOrgIds.has(orgId) || membership?.role === "ADMIN" ? "ADMIN" : "DRIVER",
            assignedVehicleId: membership?.vehicle_id,
        };
    });
    const owned = (ownedResult.data || []) as PortalVehicle[];
    const assigned = (assignedResult.data || []) as PortalVehicle[];
    const fleetVehicles = owned.filter((vehicle) => managedOrgIds.includes(vehicle.user_id) || member.is_business && vehicle.user_id === user.id)
        .map((vehicle) => ({ ...vehicle, orgId: member.is_business && vehicle.user_id === user.id ? member.id : vehicle.user_id }));
    const fleetVehicleIds = new Set(fleetVehicles.map((vehicle) => vehicle.id));
    const personalVehicles = owned.filter((vehicle) => !fleetVehicleIds.has(vehicle.id));
    const allVisibleVehicles = Array.from(new Map([...owned, ...assigned].map((vehicle) => [vehicle.id, vehicle])).values());
    const driverIds = Array.from(new Set((driversResult.data || []).map((row) => row.member_id)));
    const [driverMembers, uploadedDocuments] = await Promise.all([
        driverIds.length
            ? service.from("members").select("id,full_name,phone").in("id", driverIds)
            : Promise.resolve({ data: [], error: null }),
        allVisibleVehicles.length
            ? service.from("portal_vehicle_documents").select("vehicle_id,kind").in("vehicle_id", allVisibleVehicles.map((vehicle) => vehicle.id))
            : Promise.resolve({ data: [], error: null }),
    ]);
    if (driverMembers.error) return NextResponse.json({ error: "Could not load fleet drivers" }, { status: 500 });
    const driverNames = new Map((driverMembers.data || []).map((row) => [row.id, { name: row.full_name || "Driver", phone: formatPhone(row.phone) }]));
    const uploadedDocumentKeys = new Set((uploadedDocuments.data || []).map((row) => `${row.vehicle_id}:${row.kind}`));
    const documents: PortalData["documents"] = allVisibleVehicles.flatMap((vehicle) => [
        { id: `${vehicle.id}:insurance`, vehicle_id: vehicle.id, kind: "insurance" as const, expires_on: vehicle.insurance_end_date, file_url: uploadedDocumentKeys.has(`${vehicle.id}:insurance`) ? `/api/portal/documents?vehicleId=${vehicle.id}&kind=insurance` : null },
        { id: `${vehicle.id}:roadworthy`, vehicle_id: vehicle.id, kind: "roadworthy" as const, expires_on: vehicle.roadworthy_expiry, file_url: uploadedDocumentKeys.has(`${vehicle.id}:roadworthy`) ? `/api/portal/documents?vehicleId=${vehicle.id}&kind=roadworthy` : vehicle.roadworthy_doc_url },
    ]);

    const response: PortalData = {
        email: user.email || "",
        needsProfile: false,
        profile: { id: member.id, fullName: member.full_name || "", phone: formatPhone(member.phone), isBusiness: Boolean(member.is_business) },
        personalVehicles,
        fleetVehicles,
        assignedVehicles: assigned,
        organizations,
        fleetDrivers: (driversResult.data || []).map((row) => ({
            id: row.member_id,
            orgId: row.org_member_id,
            name: driverNames.get(row.member_id)?.name || "Driver",
            phone: driverNames.get(row.member_id)?.phone || "",
            vehicleId: row.vehicle_id,
        })),
        documents,
        documentUploadAvailable: !uploadedDocuments.error,
    };
    return NextResponse.json(response, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const parsed = ProfileSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Enter your name and a valid phone number" }, { status: 400 });
    const phone = normalizePhone(parsed.data.phone);
    if (!phone) return NextResponse.json({ error: "Enter a valid phone number, such as +233558508306." }, { status: 400 });

    const service = getServiceClient();
    const { data: linked } = await service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (linked) return NextResponse.json({ ok: true });

    // Existing staff-created profiles are claimed through a verified email, never a typed phone alone.
    if (user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const { data: emailMatches, error: emailLookupError } = await service.from("members")
            .select("id,email,auth_user_id")
            .ilike("email", normalizedEmail)
            .limit(100);
        if (emailLookupError) return NextResponse.json({ error: "Could not check your existing profile. Please try again." }, { status: 500 });
        const existing = (emailMatches || []).find((row) => row.email?.trim().toLowerCase() === normalizedEmail);
        if (existing) {
            if (existing.auth_user_id && existing.auth_user_id !== user.id) {
                return NextResponse.json({ error: "A profile with this email is already connected to another login. Please contact support@motorambos.com." }, { status: 409 });
            }
            if (!user.email_confirmed_at) return NextResponse.json({ error: "Confirm your email before connecting your driver or fleet profile." }, { status: 403 });
            const { error } = await service.from("members").update({ auth_user_id: user.id }).eq("id", existing.id).is("auth_user_id", null);
            if (error) return NextResponse.json({ error: "Could not connect your existing profile. Please contact support@motorambos.com." }, { status: 500 });
            await reportMajorActivity("Existing profile connected to login", [{ name: "Member ID", value: existing.id }]);
            return NextResponse.json({ ok: true });
        }
    }

    const { data: phoneMatches, error: phoneLookupError } = await service.from("members")
        .select("id,email,auth_user_id")
        .in("phone", phoneVariants(phone))
        .limit(2);
    if (phoneLookupError) return NextResponse.json({ error: "Could not check your existing profile. Please try again." }, { status: 500 });
    if ((phoneMatches?.length || 0) > 1) return NextResponse.json({ error: "Multiple profiles use this phone. Ask support@motorambos.com to connect your account." }, { status: 409 });
    if (phoneMatches?.length) {
        const record = phoneMatches[0];
        if (!record.auth_user_id && user.email_confirmed_at && process.env.HUBTEL_SMS_BASIC_AUTH) {
            return NextResponse.json({ code: "PHONE_CLAIM_AVAILABLE", error: "This phone already has a profile. Verify it by SMS to connect it to your account." }, { status: 409 });
        }
        return NextResponse.json({ error: "This phone is already on a Motor Ambos profile. Ask support@motorambos.com to verify and connect your account." }, { status: 409 });
    }

    const { error } = await service.from("members").insert({
        auth_user_id: user.id,
        email: user.email,
        full_name: parsed.data.fullName,
        phone,
        is_business: false,
    });
    if (error) {
        console.error("Portal profile insert failed:", error.code || "unknown");
        return NextResponse.json({ error: "Could not finish your profile. Please contact support@motorambos.com if this continues." }, { status: 500 });
    }
    await reportMajorActivity("Driver profile created", [{ name: "Auth user ID", value: user.id }]);
    return NextResponse.json({ ok: true });
}
