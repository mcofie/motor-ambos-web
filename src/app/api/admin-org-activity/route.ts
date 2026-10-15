import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";

/** An organization's notes and how much its vehicles have spent on servicing. */
export async function GET(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;

    const orgId = new URL(request.url).searchParams.get("org_id");
    if (!orgId || !z.string().uuid().safeParse(orgId).success) return NextResponse.json({ error: "Missing org_id" }, { status: 400 });

    const service = getServiceClient();
    const [{ data: notes }, { data: vehicles }] = await Promise.all([
        service.from("organization_notes").select("*").eq("org_id", orgId).order("created_at", { ascending: false }),
        service.from("vehicles").select("id").eq("user_id", orgId),
    ]);

    const ids = (vehicles || []).map((v) => v.id);
    const { data: history } = ids.length
        ? await service.from("service_history").select("cost").in("vehicle_id", ids)
        : { data: [] as { cost: number | null }[] };

    return NextResponse.json({
        notes: notes || [],
        spend: { total_requests: history?.length || 0, total_cost: (history || []).reduce((sum, row) => sum + (Number(row.cost) || 0), 0) },
    });
}

const NoteSchema = z.object({
    org_id: z.string().uuid(),
    content: z.string().trim().min(1).max(4000),
    category: z.enum(["GENERAL", "BILLING", "FLEET"]).default("GENERAL"),
});

export async function POST(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;

    const parsed = NoteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Write a note first." }, { status: 400 });

    const { error } = await getServiceClient().from("organization_notes").insert({ ...parsed.data, created_at: new Date().toISOString() });
    if (error) return NextResponse.json({ error: "Could not save the note." }, { status: 500 });
    return NextResponse.json({ success: true });
}
