"use server";

import {createServerClient, type CookieOptions} from "@supabase/ssr";
import {cookies} from "next/headers";
import {z} from "zod";

const providerSchema = z.object({
    displayName: z.string().min(2, "Business name must be at least 2 characters"),
    phoneBusiness: z.string().min(10, "Phone number must be at least 10 characters"),
    addressLine: z.string().min(5, "Address must be at least 5 characters"),
    about: z.string().optional(),
    coverageRadiusKm: z.coerce.number().min(1, "Radius must be at least 1km"),
    calloutFee: z.coerce.number().min(0, "Callout fee cannot be negative"),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
});

export type ProviderState = {
    message?: string;
    error?: string;
    success?: boolean;
};

export async function createProvider(prevState: ProviderState, formData: FormData): Promise<ProviderState> {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({name, value, ...options});
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({name, value: "", ...options});
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return {error: "You must be logged in to sign up as a provider."};
    }

    const rawData = {
        displayName: formData.get("displayName"),
        phoneBusiness: `${formData.get("countryCode")}${formData.get("phoneBusinessSuffix")}`,
        addressLine: formData.get("addressLine"),
        about: formData.get("about"),
        coverageRadiusKm: formData.get("coverageRadiusKm"),
        calloutFee: formData.get("calloutFee"),
        lat: formData.get("lat") || undefined,
        lng: formData.get("lng") || undefined,
    };

    const validatedFields = providerSchema.safeParse(rawData);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            error: errors.displayName?.[0] || errors.phoneBusiness?.[0] || errors.coverageRadiusKm?.[0] || "Invalid input",
        };
    }

    const {
        displayName,
        phoneBusiness,
        addressLine,
        about,
        coverageRadiusKm,
        calloutFee,
        lat,
        lng
    } = validatedFields.data;

    const {error} = await supabase
        .schema('motorambos')
        .from("providers")
        .insert({
            owner_id: user.id,
            display_name: displayName,
            phone_business: phoneBusiness,
            address_line: addressLine,
            about: about,
            coverage_radius_km: coverageRadiusKm,
            callout_fee: calloutFee,
            lat: lat,
            lng: lng,
            is_active: false,
            created_by: user.id,
        });

    if (error) {
        console.error("Provider creation error:", error);
        return {error: "Failed to create provider account. Please try again."};
    }

    return {success: true, message: "Application submitted successfully!"};
}
