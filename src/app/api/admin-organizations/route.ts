import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";
import { normalizePhone, phoneVariants } from "@/lib/phone";

const OrganizationSchema = z.object({
    id: z.string().uuid().optional(),
    business_name: z.string().trim().min(2).max(160),
    contact_member_id: z.string().uuid(),
    email: z.union([z.email(), z.literal("")]).optional(),
    phone: z.string().trim().max(25).optional(),
    membership_tier: z.string().trim().max(60).optional(),
    membership_expiry_date: z.union([z.iso.date(), z.literal("")]).optional(),
    membership_is_active: z.boolean().optional(),
});

async function saveOrganization(request: Request, isUpdate: boolean) {
    const accessError = await staffApiError();
    if (accessError) return accessError;

    const parsed = OrganizationSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success || (isUpdate && !parsed.data?.id) || (!isUpdate && parsed.data?.id)) {
        return NextResponse.json({ error: "Enter a business name, choose a contact person, and check the business email." }, { status: 400 });
    }

    const { id, ...values } = parsed.data;
    const service = getServiceClient();
    const { data: contact, error: contactError } = await service.from("members")
        .select("id,full_name,phone,email,is_business")
        .eq("id", values.contact_member_id)
        .maybeSingle();
    if (contactError) return NextResponse.json({ error: "Could not load the contact person." }, { status: 500 });
    if (!contact || contact.is_business || !normalizePhone(contact.phone)) {
        return NextResponse.json({ error: "Choose a person with a valid phone number as the business contact." }, { status: 400 });
    }
    const phone = values.phone ? normalizePhone(values.phone) : null;
    if (values.phone && !phone) return NextResponse.json({ error: "Enter a valid business line, such as +233558508306, or leave it empty." }, { status: 400 });
    if (phone && phone === normalizePhone(contact.phone)) {
        return NextResponse.json({ error: "This is already the contact person's number. Leave the separate business line empty." }, { status: 400 });
    }
    const email = values.email?.trim().toLowerCase() || null;
    if (email && email === contact.email?.trim().toLowerCase()) {
        return NextResponse.json({ error: "This email belongs to the contact person. Leave the separate business email empty." }, { status: 400 });
    }
    const payload = {
        business_name: values.business_name,
        full_name: contact.full_name || values.business_name,
        contact_member_id: contact.id,
        email,
        phone,
        membership_tier: values.membership_tier || null,
        membership_expiry_date: values.membership_expiry_date || null,
        membership_is_active: values.membership_is_active ?? true,
        is_business: true,
        updated_at: new Date().toISOString(),
    };
    if (phone) {
        const { data: samePhone, error: phoneError } = await service.from("members").select("id").in("phone", phoneVariants(phone));
        if (phoneError) return NextResponse.json({ error: "Could not check the business line. Please try again." }, { status: 500 });
        if (samePhone?.some((row) => row.id !== id)) return NextResponse.json({ error: "That business line is already on another profile." }, { status: 409 });
    }

    if (isUpdate) {
        const { data, error } = await service.from("members").update(payload).eq("id", id!).eq("is_business", true).select("id").maybeSingle();
        if (error) return databaseError(error);
        if (!data) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        return NextResponse.json({ id: data.id });
    }

    const { data, error } = await service.from("members").insert(payload).select("id").single();
    if (error) return databaseError(error);
    return NextResponse.json({ id: data.id }, { status: 201 });
}

function databaseError(error: { code?: string; message: string }) {
    if (error.code === "23505") return NextResponse.json({ error: "An organization or member already uses that email or phone." }, { status: 409 });
    if (error.code === "42703" || error.code === "PGRST204") return NextResponse.json({ error: "The business contact database update has not been applied yet." }, { status: 503 });
    console.error("Could not save organization:", error);
    return NextResponse.json({ error: "Could not save organization. Please try again." }, { status: 500 });
}

export async function POST(request: Request) {
    return saveOrganization(request, false);
}

export async function PATCH(request: Request) {
    return saveOrganization(request, true);
}
