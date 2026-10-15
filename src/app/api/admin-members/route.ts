import { NextResponse } from "next/server";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";

/** Members with their plan, for the back office. Pass ?id= for one member with their business contact. */
export async function GET(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;

    const service = getServiceClient();
    const id = new URL(request.url).searchParams.get("id");
    const query = service.from("members").select("*, membership_plans (name, code)");

    if (!id) {
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) return NextResponse.json({ error: "Could not load members." }, { status: 500 });
        return NextResponse.json(data || []);
    }

    const { data, error } = await query.eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: "Could not load the member." }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Member not found." }, { status: 404 });

    const { data: contact } = data.contact_member_id
        ? await service.from("members").select("full_name,phone,email").eq("id", data.contact_member_id).maybeSingle()
        : { data: null };
    return NextResponse.json({ ...data, contact });
}
