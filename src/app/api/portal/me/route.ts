import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";
import { deleteVehicle } from "@/lib/deleteVehicle";
import type { PortalData, PortalOrganization, PortalVehicle } from "@/lib/portalTypes";
import { formatPhone, normalizePhone, phoneVariants } from "@/lib/phone";
import { reportMajorActivity } from "@/lib/discordActivity";
import { realEmail } from "@/lib/phoneLogin";
import { findCarImage } from "@/lib/carImageLibrary";

export const dynamic = "force-dynamic";

const ProfileSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    phone: z.string().trim().refine((value) => Boolean(normalizePhone(value))),
});

/** The phone a login proved by SMS code, as +233…, or null for email logins. */
function verifiedPhone(user: { phone?: string; phone_confirmed_at?: string }) {
    return user.phone && user.phone_confirmed_at ? normalizePhone(`+${user.phone.replace(/^\+/, "")}`) : null;
}

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
        email: realEmail(user.email) || "",
        needsProfile: true,
        suggestedProfile: { fullName: String(user.user_metadata?.full_name || ""), phone: formatPhone(verifiedPhone(user) || String(user.user_metadata?.phone || "")) },
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
        selectVehicles(service, "user_id", ownerIds),
        assignedIds.length
            ? selectVehicles(service, "id", assignedIds)
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

    // The car's own photo when it has one (a week-long link), else a studio photo from the car image
    // library that matches the make, model and colour.
    const imageUrls = new Map(await Promise.all(allVisibleVehicles.map(async (vehicle) => {
        const own = (vehicle as { photo_path?: string | null }).photo_path;
        if (own) {
            const { data } = await service.storage.from("vehicle-documents").createSignedUrl(own, 60 * 60 * 24 * 7);
            if (data?.signedUrl) return [vehicle.id, data.signedUrl] as const;
        }
        return [vehicle.id, await findCarImage(service, vehicle).catch(() => null)] as const;
    })));
    const withImage = (vehicle: PortalVehicle): PortalVehicle => {
        const { photo_path, ...rest } = vehicle as PortalVehicle & { photo_path?: string | null };
        return { ...rest, image_url: imageUrls.get(vehicle.id) ?? null, has_own_photo: Boolean(photo_path) };
    };

    const response: PortalData = {
        email: realEmail(user.email) || "",
        needsProfile: false,
        profile: { id: member.id, fullName: member.full_name || "", phone: formatPhone(member.phone), isBusiness: Boolean(member.is_business) },
        personalVehicles: personalVehicles.map(withImage),
        fleetVehicles: fleetVehicles.map(withImage),
        assignedVehicles: assigned.map(withImage),
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
    const loginPhone = verifiedPhone(user);
    // A phone login's number is already proven by SMS, so it is the profile's number.
    const phone = loginPhone || normalizePhone(parsed.data.phone);
    if (!phone) return NextResponse.json({ error: "Enter a valid phone number, such as +233558508306." }, { status: 400 });

    const service = getServiceClient();
    const { data: linked } = await service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (linked) return NextResponse.json({ ok: true });

    // Existing staff-created profiles are claimed through a verified email, never a typed phone alone.
    const email = realEmail(user.email);
    if (email) {
        const normalizedEmail = email.trim().toLowerCase();
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
        // Signed in by SMS code to this number: the profile is theirs, so connect it now.
        if (loginPhone && !record.auth_user_id) {
            const { error } = await service.from("members").update({ auth_user_id: user.id }).eq("id", record.id).is("auth_user_id", null);
            if (error) return NextResponse.json({ error: "Could not connect your existing profile. Please contact support@motorambos.com." }, { status: 500 });
            await reportMajorActivity("Existing profile connected to phone login", [{ name: "Member ID", value: record.id }]);
            return NextResponse.json({ ok: true });
        }
        if (!record.auth_user_id && user.email_confirmed_at && process.env.HUBTEL_SMS_BASIC_AUTH) {
            return NextResponse.json({ code: "PHONE_CLAIM_AVAILABLE", error: "This phone already has a profile. Verify it by SMS to connect it to your account." }, { status: 409 });
        }
        return NextResponse.json({ error: "This phone is already on a Motor Ambos profile. Ask support@motorambos.com to verify and connect your account." }, { status: 409 });
    }

    const { error } = await service.from("members").insert({
        auth_user_id: user.id,
        email,
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

const VEHICLE_COLUMNS = "id,user_id,name,make,model,year,plate,color,insurance_end_date,roadworthy_expiry,roadworthy_doc_url";

/** Vehicles with their powertrain and own photo, falling back while those migrations haven't run. */
async function selectVehicles(service: ReturnType<typeof getServiceClient>, column: "user_id" | "id", values: string[]) {
    for (const extra of [",powertrain,photo_path", ",powertrain", ""]) {
        const result = await service.from("vehicles").select(`${VEHICLE_COLUMNS}${extra}`).in(column, values);
        if (result.error?.code !== "42703") return result;
    }
    return service.from("vehicles").select(VEHICLE_COLUMNS).in(column, values);
}

/**
 * Deletes the signed-in person's account, as Apple requires apps to offer. Their own cars (with all
 * their history and files), licence and photos, fleet roles and sign-in are removed. Card orders are
 * kept for the accounts, against a member row stripped of name and phone.
 *
 * Refused while they are the only manager of a fleet, so a business never loses its vehicles because
 * one person left: someone else must become manager first.
 */
export async function DELETE() {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const service = getServiceClient();
    const { data: member, error: memberError } = await service.from("members").select("id,phone,is_business").eq("auth_user_id", user.id).maybeSingle();
    if (memberError) return NextResponse.json({ error: "Could not load your account" }, { status: 500 });

    if (member) {
        if (member.is_business) {
            return NextResponse.json({ error: "This is a business account. Contact support@motorambos.com to close it." }, { status: 409 });
        }
        const [{ data: adminRows }, { data: contactOrgs }] = await Promise.all([
            service.from("organization_members").select("org_member_id").eq("member_id", member.id).eq("role", "ADMIN"),
            service.from("members").select("id,business_name,full_name").eq("contact_member_id", member.id).eq("is_business", true),
        ]);
        const managed = Array.from(new Set([...(adminRows || []).map((row) => row.org_member_id), ...(contactOrgs || []).map((row) => row.id)]));
        const soleFleets: string[] = [];
        for (const orgId of managed) {
            const [{ data: otherAdmins }, { data: org }] = await Promise.all([
                service.from("organization_members").select("member_id").eq("org_member_id", orgId).eq("role", "ADMIN").neq("member_id", member.id),
                service.from("members").select("business_name,full_name,contact_member_id").eq("id", orgId).maybeSingle(),
            ]);
            const otherContact = org?.contact_member_id && org.contact_member_id !== member.id;
            if (!(otherAdmins || []).length && !otherContact) soleFleets.push(org?.business_name || org?.full_name || "your fleet");
        }
        if (soleFleets.length) {
            return NextResponse.json({
                error: `You're the only manager of ${soleFleets.join(", ")}. Make someone else a manager first, or contact support@motorambos.com.`,
                code: "SOLE_FLEET_MANAGER",
            }, { status: 409 });
        }

        // Their own cars, with everything logged against them.
        const { data: cars } = await service.from("vehicles").select("id").in("user_id", [member.id, user.id]);
        for (const car of cars || []) {
            const result = await deleteVehicle(service, car.id);
            if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
        }

        // Licence details and photos.
        const { data: licence } = await service.from("driver_licences").select("*").eq("member_id", member.id).maybeSingle();
        const licencePaths = ["front_path", "back_path", "photo_path"]
            .map((column) => (licence as Record<string, string | null> | null)?.[column])
            .filter((path): path is string => Boolean(path));
        if (licencePaths.length) await service.storage.from("vehicle-documents").remove(licencePaths);
        await service.from("driver_licences").delete().eq("member_id", member.id);

        // Fleet roles, devices for alerts and sign-in codes.
        await service.from("organization_members").delete().eq("member_id", member.id);
        await service.from("push_devices").delete().eq("member_id", member.id);
        if (member.phone) await service.from("phone_login_codes").delete().eq("phone", member.phone);

        // Keep the row for card orders and reports, without anything that identifies them.
        let { error } = await service.from("members").update({ full_name: "Deleted account", phone: null, auth_user_id: null }).eq("id", member.id);
        if (error) ({ error } = await service.from("members").update({ full_name: "Deleted account", auth_user_id: null }).eq("id", member.id));
        if (error) {
            console.error("Account delete: could not clear the member row", member.id, error);
            return NextResponse.json({ error: "Could not delete your account. Contact support@motorambos.com." }, { status: 500 });
        }
    }

    const { error: authError } = await service.auth.admin.deleteUser(user.id);
    if (authError) {
        console.error("Account delete: could not remove the sign-in", user.id, authError);
        return NextResponse.json({ error: "Could not finish deleting your account. Contact support@motorambos.com." }, { status: 500 });
    }
    await reportMajorActivity("Account deleted", [{ name: "Member ID", value: member?.id || null }]);
    return NextResponse.json({ ok: true });
}
