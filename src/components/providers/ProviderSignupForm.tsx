
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { insertProvider, getUser } from "@/lib/supaFetch";
import { toast } from "sonner";

export function ProviderSignupForm() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const displayName = formData.get("displayName") as string;
        const countryCode = formData.get("countryCode") as string;
        const phoneSuffix = formData.get("phoneBusinessSuffix") as string;
        const phoneBusiness = `${countryCode}${phoneSuffix} `;
        const addressLine = formData.get("addressLine") as string;
        const about = formData.get("about") as string;
        const coverageRadiusKm = Number(formData.get("coverageRadiusKm"));
        const calloutFee = Number(formData.get("calloutFee"));
        const lat = formData.get("lat") ? Number(formData.get("lat")) : null;
        const lng = formData.get("lng") ? Number(formData.get("lng")) : null;

        try {
            const userPayload = await getUser();
            // getUser returns { id: ... } or { user: { id: ... } } or null
            // SupabaseUserPayload = { id?: string; email?: string } | { user?: { id?: string; email?: string } } | null
            // We need to handle both structures
            const userId = (userPayload && 'user' in userPayload)
                ? userPayload.user?.id
                : (userPayload as { id?: string })?.id;

            if (!userId) {
                throw new Error("You must be logged in to sign up as a provider.");
            }

            await insertProvider({
                display_name: displayName,
                phone_business: phoneBusiness,
                address_line: addressLine,
                about: about,
                coverage_radius_km: coverageRadiusKm,
                callout_fee: calloutFee,
                lat: lat,
                lng: lng,
                is_active: false,
                is_verified: false,
                owner_id: userId,
            });

            setSuccess(true);
            toast.success("Application submitted successfully!");
        } catch (err) {
            console.error(err);
            setError((err as Error).message || "Failed to submit application. Please try again.");
            toast.error("Failed to submit application");
        } finally {
            setIsPending(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">Application Received!</h3>
                <p className="text-muted-foreground max-w-md">
                    Thank you for signing up. Your application is currently under review. We will contact you shortly at your business phone number.
                </p>
                <Button variant="outline" onClick={() => setSuccess(false)}>
                    Submit another application
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="displayName">Business Name</Label>
                <Input
                    id="displayName"
                    name="displayName"
                    placeholder="e.g. Kofi's Auto Repair"
                    required
                    minLength={2}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="phoneBusiness">Business Phone</Label>
                    <div className="flex gap-2">
                        <div className="w-[110px] flex-shrink-0">
                            <select
                                name="countryCode"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue="+233"
                            >
                                <option value="+233">🇬🇭 +233</option>
                                <option value="+254">🇰🇪 +254</option>
                                <option value="+229">🇧🇯 +229</option>
                                <option value="+228">🇹🇬 +228</option>
                                <option value="+225">🇨🇮 +225</option>
                            </select>
                        </div>
                        <Input
                            id="phoneBusiness"
                            name="phoneBusinessSuffix"
                            type="tel"
                            placeholder="XX XXX XXXX"
                            required
                            minLength={9}
                            className="flex-1"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="addressLine">Address</Label>
                    <Input
                        id="addressLine"
                        name="addressLine"
                        placeholder="Street address or location"
                        required
                        minLength={5}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="coverageRadiusKm">Coverage Radius (km)</Label>
                    <Input
                        id="coverageRadiusKm"
                        name="coverageRadiusKm"
                        type="number"
                        placeholder="e.g. 10"
                        required
                        min={1}
                        defaultValue={10}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="calloutFee">Callout Fee (GHS)</Label>
                    <Input
                        id="calloutFee"
                        name="calloutFee"
                        type="number"
                        placeholder="e.g. 50"
                        required
                        min={0}
                        defaultValue={0}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="lat">Latitude (Optional)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="lat"
                            name="lat"
                            type="number"
                            step="any"
                            placeholder="e.g. 5.6037"
                            defaultValue={lat ?? ""}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lng">Longitude (Optional)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="lng"
                            name="lng"
                            type="number"
                            step="any"
                            placeholder="e.g. -0.1870"
                            defaultValue={lng ?? ""}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (!navigator.geolocation) {
                            toast.error("Geolocation is not supported by your browser");
                            return;
                        }
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                setLat(position.coords.latitude);
                                setLng(position.coords.longitude);
                                toast.success("Location fetched successfully");
                            },
                            (error) => {
                                console.error(error);
                                toast.error("Unable to retrieve your location");
                            }
                        );
                    }}
                >
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Current Location
                </Button>
            </div>

            <div className="space-y-2">
                <Label htmlFor="about">About your business (Optional)</Label>
                <Textarea
                    id="about"
                    name="about"
                    placeholder="Tell us about your services, experience, and specialties..."
                    className="min-h-[100px]"
                />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Application"
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
        </form>
    );
}

