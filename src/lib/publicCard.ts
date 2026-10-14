import { getServiceClient } from "@/lib/serverAuth";
import { defaultShare, paperStatus, type PublicCardPage } from "@/lib/smartCard";
import { findCarImage } from "@/lib/carImageLibrary";

const keepAsIs = new Set(["BMW", "GMC", "VW", "AMG", "GT", "GTI", "SUV", "XL", "LE", "SE", "XLE", "LX", "GX", "RX", "DX", "EX"]);

/** Records are often typed in capitals ("KIA RIO 5"). Show them as people write them. */
function readable(value: string | null | undefined) {
    if (!value) return null;
    if (value !== value.toUpperCase()) return value;
    return value.toLowerCase().split(/(\s+)/).map((word) => {
        const upper = word.toUpperCase();
        if (keepAsIs.has(upper) || /\d/.test(word) || /^[a-z]{1,2}-[a-z0-9]{1,2}$/.test(word)) return upper;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join("");
}

type Member = { id: string; full_name: string | null; business_name: string | null; is_business: boolean | null; phone: string | null };
type Service = ReturnType<typeof getServiceClient>;

const shortName = (fullName: string | null | undefined) => {
    const parts = readable(fullName?.trim())?.split(/\s+/) || [];
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : parts[0] || null;
};

/** The person behind the wheel: a fleet's assigned driver if there is one, otherwise an individual owner. */
async function loadDriver(service: Service, vehicleId: string, owner: Member | null): Promise<Extract<PublicCardPage, { state: "linked" }>["driver"]> {
    const { data: assignment } = await service.from("organization_members").select("member_id").eq("vehicle_id", vehicleId).eq("role", "DRIVER").limit(1).maybeSingle();
    const driver = assignment
        ? (await service.from("members").select("id,full_name,business_name,is_business,phone").eq("id", assignment.member_id).maybeSingle()).data as Member | null
        : owner && !owner.is_business ? owner : null;

    if (!driver) return owner?.is_business && owner.business_name ? { name: readable(owner.business_name)!, role: "Fleet vehicle", photoUrl: null, licence: null } : null;

    const first = await service.from("driver_licences").select("licence_class,expires_on,photo_path,show_on_fleet_cards").eq("member_id", driver.id).maybeSingle();
    const licence = first.error?.code === "42703"
        ? (await service.from("driver_licences").select("licence_class,expires_on").eq("member_id", driver.id).maybeSingle()).data
        : first.data;
    // A fleet driver can choose not to appear on the cards of cars they are assigned to.
    if (assignment && (licence as { show_on_fleet_cards?: boolean } | null)?.show_on_fleet_cards === false) {
        return owner?.is_business && owner.business_name ? { name: readable(owner.business_name)!, role: "Fleet vehicle", photoUrl: null, licence: null } : null;
    }
    const photoPath = (licence as { photo_path?: string | null } | null)?.photo_path;
    const photoUrl = photoPath ? (await service.storage.from("vehicle-documents").createSignedUrl(photoPath, 60 * 60)).data?.signedUrl || null : null;
    const fleetName = assignment && owner?.is_business ? readable(owner.business_name) : null;

    return {
        name: shortName(driver.full_name) || "Driver",
        role: assignment ? fleetName ? `Driver · ${fleetName}` : "Driver" : "Owner and driver",
        photoUrl,
        licence: licence?.expires_on || licence?.licence_class ? { state: paperStatus(licence.expires_on).state, licenceClass: licence.licence_class ? String(licence.licence_class).toUpperCase() : null } : null,
    };
}

/**
 * Builds the public Smart Card page for one card. Only fields the owner has switched on
 * leave the server, so nothing private reaches the visitor's browser.
 */
export async function loadPublicCard(publicId: string): Promise<PublicCardPage> {
    if (!/^[A-Za-z0-9_-]{4,40}$/.test(publicId)) return { state: "missing" };
    const service = getServiceClient();

    const columns = "id,user_id,make,model,year,color,plate,insurance_end_date,roadworthy_expiry";
    let { data: vehicle, error } = await service.from("vehicles").select(`${columns},public_share`).eq("nfc_card_id", publicId).maybeSingle();
    // Until the sharing migration runs, fall back to the default sharing choices.
    if (error?.code === "42703") ({ data: vehicle, error } = await service.from("vehicles").select(columns).eq("nfc_card_id", publicId).maybeSingle());
    if (error) throw new Error("Could not load Smart Card");

    if (!vehicle) {
        const { data: card } = await service.from("nfc_cards").select("public_id,status").eq("public_id", publicId).maybeSingle();
        return card && card.status !== "VOID" ? { state: "unlinked", publicId } : { state: "missing" };
    }

    const share = { ...defaultShare, ...((vehicle as { public_share?: object }).public_share || {}) };
    const [historyResult, ownerResult] = await Promise.all([
        share.service
            ? service.from("service_history").select("service_date,description,provider_name,mileage,is_verified").eq("vehicle_id", vehicle.id).order("service_date", { ascending: false }).limit(20)
            : Promise.resolve({ data: null }),
        share.owner || share.contact
            ? service.from("members").select("id,full_name,business_name,is_business,phone").or(`id.eq.${vehicle.user_id},auth_user_id.eq.${vehicle.user_id}`).limit(1).maybeSingle()
            : Promise.resolve({ data: null }),
    ]);

    const owner = ownerResult.data as Member | null;
    const driver = share.owner ? await loadDriver(service, vehicle.id, owner).catch(() => null) : null;
    // The call button rings the owner's phone, so it carries the owner's name, not an assigned driver's.
    const ownerName = owner ? (owner.is_business ? readable(owner.business_name) : readable(owner.full_name?.trim().split(/\s+/)[0])) : null;
    const make = readable(vehicle.make);
    const model = readable(vehicle.model);
    const color = readable(vehicle.color);
    const title = share.vehicle ? [vehicle.year, make, model].filter(Boolean).join(" ") || "Motor Ambos car" : "Motor Ambos car";

    const help = new URLSearchParams();
    if (share.plate && vehicle.plate) help.set("plate", vehicle.plate);
    if (share.vehicle) {
        if (vehicle.make) help.set("make", vehicle.make);
        if (vehicle.model) help.set("model", vehicle.model);
        if (vehicle.year) help.set("year", String(vehicle.year));
        if (vehicle.color) help.set("color", vehicle.color);
    }

    return {
        state: "linked",
        publicId,
        title,
        vehicle: share.vehicle ? { make, model, year: vehicle.year ? String(vehicle.year) : null, color } : null,
        imageUrl: share.vehicle ? await findCarImage(service, { make: vehicle.make, model: vehicle.model, year: vehicle.year, color: vehicle.color }).catch(() => null) : null,
        plate: share.plate ? vehicle.plate : null,
        papers: share.papers ? { insurance: paperStatus(vehicle.insurance_end_date), roadworthy: paperStatus(vehicle.roadworthy_expiry) } : null,
        service: share.service ? (historyResult.data || []).map((entry) => ({ date: entry.service_date, description: readable(entry.description) || "Service", provider: entry.provider_name, mileage: entry.mileage, verified: Boolean(entry.is_verified) })) : null,
        ownerFirstName: share.owner ? ownerName : null,
        driver,
        contactPhone: share.contact ? owner?.phone || null : null,
        helpQuery: help.toString(),
    };
}
