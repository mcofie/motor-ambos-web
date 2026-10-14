import type { getServiceClient } from "@/lib/serverAuth";

/** Colour families used to match a vehicle's colour to a library photo. Order matters: "navy blue" is navy. */
export const libraryColours = ["White", "Pearl", "Black", "Silver", "Grey", "Navy", "Blue", "Maroon", "Red", "Green", "Champagne", "Gold", "Brown", "Beige", "Cream", "Yellow", "Orange", "Purple"] as const;

const colourAliases: Record<string, string> = { gray: "grey", wine: "maroon", burgundy: "maroon", bronze: "brown", ivory: "cream" };

export const textKey = (value: string | null | undefined) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function colourKey(value: string | null | undefined) {
    let name = (value || "").toLowerCase();
    for (const [alias, colour] of Object.entries(colourAliases)) name = name.replace(alias, colour);
    const family = libraryColours.find((colour) => name.includes(colour.toLowerCase()));
    return family ? family.toLowerCase() : textKey(name);
}

type LibraryImage = { image_url: string; model_key: string; colour_key: string; year_from: number | null; year_to: number | null; created_at: string };

/** Picks the closest photo for this car: same colour, the most specific model name, then the best year fit. */
export async function findCarImage(service: ReturnType<typeof getServiceClient>, car: { make: string | null; model: string | null; year: string | number | null; color: string | null }) {
    const make = textKey(car.make);
    const model = textKey(car.model);
    const colour = colourKey(car.color);
    if (!make || !model || !colour) return null;

    const { data, error } = await service.from("car_images").select("image_url,model_key,colour_key,year_from,year_to,created_at").eq("make_key", make).eq("colour_key", colour);
    if (error || !data?.length) return null;

    const year = Number(car.year) || null;
    const yearGap = (image: LibraryImage) => {
        if (!year) return 0;
        if ((image.year_from == null || year >= image.year_from) && (image.year_to == null || year <= image.year_to)) return 0;
        return Math.min(...[image.year_from, image.year_to].filter((value): value is number => value != null).map((value) => Math.abs(value - year)));
    };

    const candidates = (data as LibraryImage[]).filter((image) => model === image.model_key || model.startsWith(image.model_key));
    candidates.sort((a, b) => b.model_key.length - a.model_key.length || yearGap(a) - yearGap(b) || b.created_at.localeCompare(a.created_at));
    return candidates[0]?.image_url || null;
}
