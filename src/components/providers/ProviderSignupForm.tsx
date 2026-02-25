"use client";

import React, { useState } from "react";
import { insertProvider, getUser, uploadProviderAsset } from "@/lib/supaFetch";
import { toast } from "sonner";
import { Upload, ImageIcon, Loader2, CheckCircle2, AlertCircle, MapPin, Camera, ArrowRight, User, Wrench, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProviderSignupForm() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const displayName = formData.get("displayName") as string;
        const countryCode = formData.get("countryCode") as string;
        const phoneSuffix = formData.get("phoneBusinessSuffix") as string;
        const phoneBusiness = `${countryCode}${phoneSuffix}`.replace(/\s+/g, '');
        const addressLine = formData.get("addressLine") as string;
        const about = formData.get("about") as string;
        const coverageRadiusKm = Number(formData.get("coverageRadiusKm"));
        const calloutFee = Number(formData.get("calloutFee"));
        const experienceYears = formData.get("experienceYears") ? Number(formData.get("experienceYears")) : null;
        const specializations = formData.get("specializations") as string;
        const certificationUrl = formData.get("certificationUrl") as string;
        const purchaseUrl = formData.get("purchaseUrl") as string;
        const purchaseActionLabel = formData.get("purchaseActionLabel") as string;
        const latVal = formData.get("lat") ? Number(formData.get("lat")) : null;
        const lngVal = formData.get("lng") ? Number(formData.get("lng")) : null;

        try {
            const userPayload = await getUser();
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
                lat: latVal,
                lng: lngVal,
                is_active: false,
                is_verified: false,
                owner_id: userId,
                provider_type: formData.get("providerType") as string,
                logo_url: logoUrl || null,
                experience_years: experienceYears,
                specializations: specializations || null,
                certification_url: certificationUrl || null,
                purchase_url: purchaseUrl || null,
                purchase_action_label: purchaseActionLabel || null,
            });

            setSuccess(true);
            toast.success("Application submitted successfully!");
            window.scrollTo(0, 0);
        } catch (err) {
            setError((err as Error).message || "Failed to submit application.");
            toast.error("Failed to submit application");
        } finally {
            setIsPending(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-10 animate-in fade-in zoom-in duration-500">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-[#9FE870]/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative h-full w-full bg-[#9FE870] rounded-full flex items-center justify-center text-[#2D5B18] shadow-wise-lg">
                        <CheckCircle2 className="h-16 w-16" strokeWidth={3} />
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight">Application Received!</h1>
                    <p className="text-lg font-bold text-[#5D7079] max-w-md mx-auto">
                        Thank you for joining the network. Our auditors will review your technical credentials and activate your terminal within 24 hours.
                    </p>
                </div>
                <button
                    className="wise-btn-primary !px-12 flex items-center gap-3"
                    onClick={() => setSuccess(false)}
                >
                    Submit another application <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-[20px] flex items-center gap-4 text-red-600">
                    <AlertCircle className="shrink-0" size={24} />
                    <span className="text-sm font-black uppercase tracking-tight">{error}</span>
                </div>
            )}

            {/* Logo Section */}
            <div className="space-y-4">
                <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Business Identity</label>
                <div className="flex items-center gap-8 p-6 bg-[#F0F2F5] rounded-[24px] border-2 border-transparent hover:border-[#9FE870]/20 transition-all">
                    <div className="h-24 w-24 rounded-2xl bg-white border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-[#5D7079]/20" />
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <label htmlFor="logo-upload" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-[#9FE870] hover:text-black transition-all active:scale-95">
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                            {isUploading ? "Uploading..." : "Upload Logo"}
                            <input
                                id="logo-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                disabled={isUploading}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                        setIsUploading(true);
                                        const url = await uploadProviderAsset(file, "signup-logo");
                                        setLogoUrl(url);
                                        toast.success("Logo uploaded!");
                                    } catch (err) {
                                        toast.error("Upload failed");
                                    } finally {
                                        setIsUploading(false);
                                    }
                                }}
                            />
                        </label>
                        <p className="text-[10px] font-bold text-[#5D7079] uppercase tracking-widest">Square images work best. Max 2MB.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WiseInput label="Business Name" name="displayName" placeholder="e.g. Kofi's Auto Repair" required minLength={2} icon={<User size={18} />} />
                <div className="space-y-2">
                    <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Service Category</label>
                    <div className="relative group">
                        <select
                            name="providerType"
                            required
                            className="w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-5 px-6 text-xl font-bold outline-none transition-all appearance-none"
                        >
                            <option value="">Select a category</option>
                            <option value="mechanic">Mechanic (General)</option>
                            <option value="mechanic_engine">Mechanic (Engine Specialist)</option>
                            <option value="mechanic_electrical">Mechanic (Electrical Specialist)</option>
                            <option value="detailing">Detailing & Polish</option>
                            <option value="car_wash">Car Wash</option>
                            <option value="roadworthy">Roadworthy Center</option>
                            <option value="insurance">Insurance Provider</option>
                            <option value="shop">Spare Parts & Accessories</option>
                            <option value="towing">Towing Service</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#5D7079]">
                            <Upload size={18} className="rotate-180" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Business Phone</label>
                    <div className="flex gap-4">
                        <select
                            name="countryCode"
                            className="w-32 bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-5 px-6 text-xl font-bold outline-none transition-all appearance-none"
                            defaultValue="+233"
                        >
                            <option value="+233">+233</option>
                            <option value="+254">+254</option>
                            <option value="+229">+229</option>
                            <option value="+228">+228</option>
                        </select>
                        <input
                            name="phoneBusinessSuffix"
                            type="tel"
                            placeholder="XX XXX XXXX"
                            required
                            minLength={9}
                            className="flex-1 bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-5 px-6 text-xl font-bold outline-none transition-all"
                        />
                    </div>
                </div>
                <WiseInput label="Address" name="addressLine" placeholder="Street address or location" required minLength={5} icon={<MapPin size={18} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WiseInput label="Coverage Radius (km)" name="coverageRadiusKm" type="number" defaultValue={10} required min={1} />
                <WiseInput label="Callout Fee (GHS)" name="calloutFee" type="number" defaultValue={0} required min={0} icon={<Wallet size={18} />} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">Geospatial Coordinates</label>
                    <button
                        type="button"
                        onClick={() => {
                            if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
                            navigator.geolocation.getCurrentPosition(
                                (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); toast.success("Location fetched!"); },
                                () => { toast.error("Unable to retrieve location"); }
                            );
                        }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#9FE870] bg-black px-4 py-2 rounded-full hover:bg-black/90 active:scale-95 transition-all"
                    >
                        Fetch GPS
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <WiseInput label="Latitude" name="lat" type="number" step="any" defaultValue={lat ?? ""} placeholder="e.g. 5.6037" />
                    <WiseInput label="Longitude" name="lng" type="number" step="any" defaultValue={lng ?? ""} placeholder="e.g. -0.1870" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WiseInput label="Years of Experience" name="experienceYears" type="number" placeholder="e.g. 5" min={0} />
                <WiseInput label="Certification URL" name="certificationUrl" type="url" placeholder="Link to certifications" />
            </div>

            <WiseInput label="Specializations" name="specializations" placeholder="e.g. Toyota, Hybrid Engines, Auto Painting" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WiseInput label="Booking URL" name="purchaseUrl" type="url" placeholder="e.g. https://mybookingsite.com" />
                <WiseInput label="Action Label" name="purchaseActionLabel" placeholder="e.g. Book Now, Buy Parts" />
            </div>

            <div className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">About Your Business</label>
                <textarea
                    name="about"
                    placeholder="Tell us about your services, history, and why users should trust you..."
                    className="w-full h-40 bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[24px] p-8 text-lg font-bold outline-none transition-all resize-none"
                />
            </div>

            <div className="pt-8">
                <button type="submit" className="wise-btn-primary w-full !py-8 !text-2xl flex items-center justify-center gap-4 shadow-wise-lg disabled:opacity-30" disabled={isPending}>
                    {isPending ? <Loader2 className="animate-spin" size={24} /> : (
                        <>
                            Submit Application <ArrowRight size={24} />
                        </>
                    )}
                </button>
            </div>

            <p className="text-[10px] font-bold text-center text-[#5D7079] uppercase tracking-widest opacity-60">
                By submitting, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
            </p>
        </form>
    );
}

function WiseInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[12px] font-black uppercase tracking-widest text-[#5D7079] ml-1">{label}</label>
            <div className="relative group">
                {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5D7079]">{icon}</div>}
                <input
                    className={cn(
                        "w-full bg-[#F0F2F5] border-2 border-transparent focus:border-[#9FE870] rounded-[20px] py-5 px-6 text-xl font-bold outline-none transition-all placeholder:text-[#5D7079]/30",
                        icon && "pl-14"
                    )}
                    {...props}
                />
            </div>
        </div>
    );
}
