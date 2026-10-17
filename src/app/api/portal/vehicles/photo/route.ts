import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalVehicleAccess } from "@/lib/portalAccess";

const BUCKET = "vehicle-documents";
const imageTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const uuid = z.string().uuid();

function accessError(status: number) {
    const message = status === 401 ? "Sign in required" : status === 403 ? "Only the owner or fleet manager can change this car's photo" : status === 404 ? "Vehicle not found" : "Could not load vehicle";
    return NextResponse.json({ error: message }, { status });
}

/** Sets the car's own photo, shown instead of the library picture. Owners and fleet managers only. */
export async function POST(request: Request) {
    const form = await request.formData().catch(() => null);
    const vehicleId = String(form?.get("vehicleId") || "");
    const file = form?.get("file");
    if (!uuid.safeParse(vehicleId).success || !(file instanceof File)) return NextResponse.json({ error: "Choose a photo" }, { status: 400 });
    const extension = imageTypes[file.type];
    if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Use a photo under 5 MB" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);

    const { data: previous, error: readError } = await access.service.from("vehicles").select("photo_path").eq("id", vehicleId).maybeSingle();
    if (readError?.code === "42703") return NextResponse.json({ error: "Car photos aren't available yet. Try again later." }, { status: 503 });
    const path = `cars/${vehicleId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await access.service.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: "Could not upload the photo" }, { status: 500 });
    const { error } = await access.service.from("vehicles").update({ photo_path: path }).eq("id", vehicleId);
    if (error) {
        await access.service.storage.from(BUCKET).remove([path]);
        return NextResponse.json({ error: "Could not save the photo" }, { status: 500 });
    }
    if (previous?.photo_path) await access.service.storage.from(BUCKET).remove([previous.photo_path]);
    return NextResponse.json({ ok: true }, { status: 201 });
}

/** Removes the car's own photo, so the library picture shows again. */
export async function DELETE(request: Request) {
    const vehicleId = new URL(request.url).searchParams.get("vehicleId") || "";
    if (!uuid.safeParse(vehicleId).success) return NextResponse.json({ error: "Choose a vehicle" }, { status: 400 });
    const access = await getPortalVehicleAccess(vehicleId);
    if (access.status !== 200) return accessError(access.status);
    if (!access.canEdit) return accessError(403);
    const { data: previous } = await access.service.from("vehicles").select("photo_path").eq("id", vehicleId).maybeSingle();
    const { error } = await access.service.from("vehicles").update({ photo_path: null }).eq("id", vehicleId);
    if (error) return NextResponse.json({ error: "Could not remove the photo" }, { status: 500 });
    if (previous?.photo_path) await access.service.storage.from(BUCKET).remove([previous.photo_path]);
    return NextResponse.json({ ok: true });
}
