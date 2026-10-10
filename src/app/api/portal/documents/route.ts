import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalVehicleAccess } from "@/lib/portalAccess";
import { reportMajorActivity } from "@/lib/discordActivity";

const DocumentSchema = z.object({
    vehicleId: z.string().uuid(),
    kind: z.enum(["insurance", "roadworthy"]),
    expiresOn: z.iso.date().nullable(),
});

export async function PUT(request: Request) {
    const parsed = DocumentSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Choose a document and expiry date" }, { status: 400 });
    const access = await getPortalVehicleAccess(parsed.data.vehicleId);
    if (access.status !== 200) return NextResponse.json({ error: "Vehicle unavailable" }, { status: access.status });
    if (!access.canEdit) return NextResponse.json({ error: "You cannot edit this vehicle" }, { status: 403 });

    const column = parsed.data.kind === "insurance" ? "insurance_end_date" : "roadworthy_expiry";
    const { error } = await access.service.from("vehicles").update({ [column]: parsed.data.expiresOn }).eq("id", access.vehicle.id);
    if (error) return NextResponse.json({ error: "Could not save the expiry date" }, { status: 500 });
    return NextResponse.json({ ok: true });
}

const fileTypes: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const vehicleId = params.get("vehicleId") || "";
    const kind = params.get("kind") || "";
    if (!z.string().uuid().safeParse(vehicleId).success || !["insurance", "roadworthy"].includes(kind))
        return NextResponse.json({ error: "Choose a document" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return NextResponse.json({ error: "Document unavailable" }, { status: access.status });
    const { data: document, error } = await access.service.from("portal_vehicle_documents")
        .select("storage_path").eq("vehicle_id", vehicleId).eq("kind", kind).maybeSingle();
    if (error || !document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    const { data, error: signedError } = await access.service.storage.from("vehicle-documents").createSignedUrl(document.storage_path, 60);
    if (signedError || !data?.signedUrl) return NextResponse.json({ error: "Could not open document" }, { status: 500 });
    return NextResponse.redirect(data.signedUrl);
}

export async function POST(request: Request) {
    const form = await request.formData().catch(() => null);
    const vehicleId = form?.get("vehicleId");
    const kind = form?.get("kind");
    const file = form?.get("file");
    if (typeof vehicleId !== "string" || !z.string().uuid().safeParse(vehicleId).success || typeof kind !== "string" || !["insurance", "roadworthy"].includes(kind) || !(file instanceof File))
        return NextResponse.json({ error: "Choose a PDF or image" }, { status: 400 });
    const extension = fileTypes[file.type];
    if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024)
        return NextResponse.json({ error: "Use a PDF or image under 5 MB" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return NextResponse.json({ error: "You cannot edit this vehicle" }, { status: access.status });
    if (!access.canEdit) return NextResponse.json({ error: "Only the vehicle owner or fleet manager can upload documents" }, { status: 403 });

    const { data: previous } = await access.service.from("portal_vehicle_documents")
        .select("storage_path").eq("vehicle_id", vehicleId).eq("kind", kind).maybeSingle();
    const path = `${vehicleId}/${kind}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await access.service.storage.from("vehicle-documents")
        .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: "Could not upload document" }, { status: 500 });
    const { error } = await access.service.from("portal_vehicle_documents").upsert({
        vehicle_id: vehicleId,
        kind,
        storage_path: path,
        file_name: file.name.slice(0, 120),
        uploaded_by: access.member.id,
    }, { onConflict: "vehicle_id,kind" });
    if (error) {
        await access.service.storage.from("vehicle-documents").remove([path]);
        return NextResponse.json({ error: "Could not save document" }, { status: 500 });
    }
    if (previous?.storage_path) await access.service.storage.from("vehicle-documents").remove([previous.storage_path]);
    await reportMajorActivity("Vehicle document uploaded", [
        { name: "Document", value: kind },
        { name: "Plate", value: access.vehicle.plate },
        { name: "Vehicle ID", value: vehicleId },
    ]);
    return NextResponse.json({ ok: true }, { status: 201 });
}
