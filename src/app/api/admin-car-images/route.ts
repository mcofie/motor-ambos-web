import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";
import { colourKey, textKey } from "@/lib/carImageLibrary";

const BUCKET = "car-images";
const imageTypes: Record<string, string> = { "image/png": "png", "image/webp": "webp", "image/jpeg": "jpg" };
const year = z.coerce.number().int().min(1950).max(2100).nullable();

export async function GET() {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const service = getServiceClient();
    const [{ data: images, error }, { data: vehicles }] = await Promise.all([
        service.from("car_images").select("id,make,model,colour,year_from,year_to,image_url,make_key,model_key,colour_key,created_at").order("make").order("model").order("colour"),
        service.from("vehicles").select("make,model,color,year").not("make", "is", null).not("model", "is", null).limit(5000),
    ]);
    if (error) return NextResponse.json({ error: "Could not load car images. Has the car image migration run?" }, { status: 500 });

    // Group the cars on the platform that no photo covers yet, most common first.
    const library = images || [];
    const missing = new Map<string, { make: string; model: string; colour: string; count: number; years: number[] }>();
    for (const vehicle of vehicles || []) {
        const make = textKey(vehicle.make), model = textKey(vehicle.model), colour = colourKey(vehicle.color);
        if (!make || !model || !colour) continue;
        const covered = library.some((image) => image.make_key === make && image.colour_key === colour && (model === image.model_key || model.startsWith(image.model_key)));
        if (covered) continue;
        const key = `${make}|${model}|${colour}`;
        const entry = missing.get(key) || { make: vehicle.make, model: vehicle.model, colour: vehicle.color || colour, count: 0, years: [] as number[] };
        entry.count += 1;
        if (Number(vehicle.year)) entry.years.push(Number(vehicle.year));
        missing.set(key, entry);
    }

    return NextResponse.json({
        images: library,
        missing: [...missing.values()].sort((a, b) => b.count - a.count).slice(0, 60).map(({ years, ...entry }) => ({ ...entry, yearFrom: years.length ? Math.min(...years) : null, yearTo: years.length ? Math.max(...years) : null })),
    });
}

export async function POST(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    const parsed = z.object({
        make: z.string().trim().min(1).max(60),
        model: z.string().trim().min(1).max(80),
        colour: z.string().trim().min(2).max(40),
        yearFrom: year,
        yearTo: year,
    }).safeParse({
        make: form?.get("make"), model: form?.get("model"), colour: form?.get("colour"),
        yearFrom: form?.get("yearFrom") || null, yearTo: form?.get("yearTo") || null,
    });
    if (!parsed.success || !(file instanceof File)) return NextResponse.json({ error: "Add the make, model, colour and an image" }, { status: 400 });
    if (parsed.data.yearFrom && parsed.data.yearTo && parsed.data.yearFrom > parsed.data.yearTo) return NextResponse.json({ error: "The first year must come before the last year" }, { status: 400 });
    const extension = imageTypes[file.type];
    if (!extension || file.size === 0 || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Use a PNG, WebP or JPEG under 5 MB" }, { status: 400 });

    const service = getServiceClient();
    const makeKey = textKey(parsed.data.make), modelKey = textKey(parsed.data.model), colour = colourKey(parsed.data.colour);
    const path = `${makeKey}/${modelKey}/${colour}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await service.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (uploadError) return NextResponse.json({ error: "Could not upload the image" }, { status: 500 });
    const imageUrl = service.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

    const { data, error } = await service.from("car_images").insert({
        make: parsed.data.make, model: parsed.data.model, colour: parsed.data.colour,
        year_from: parsed.data.yearFrom, year_to: parsed.data.yearTo,
        make_key: makeKey, model_key: modelKey, colour_key: colour,
        storage_path: path, image_url: imageUrl,
    }).select("id").single();
    if (error) {
        await service.storage.from(BUCKET).remove([path]);
        return NextResponse.json({ error: "Could not save the image" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}

export async function DELETE(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Choose an image" }, { status: 400 });
    const service = getServiceClient();
    const { data, error } = await service.from("car_images").delete().eq("id", id).select("storage_path").maybeSingle();
    if (error || !data) return NextResponse.json({ error: "Could not delete the image" }, { status: 500 });
    await service.storage.from(BUCKET).remove([data.storage_path]);
    return NextResponse.json({ ok: true });
}
