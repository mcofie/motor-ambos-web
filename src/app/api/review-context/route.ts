import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/serverAuth";

/**
 * What the public review page needs about one request. The request id in the review link is the
 * only key, so this returns a single row and never lists requests.
 */
export async function GET(request: Request) {
    const id = new URL(request.url).searchParams.get("id");
    if (!id || !z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid link" }, { status: 400 });

    const { data, error } = await getServiceClient()
        .from("request_review_context")
        .select("id,status,created_at,driver_name,driver_phone,provider_id,provider_name,provider_phone,service_code,service_name")
        .eq("id", id)
        .maybeSingle();

    if (error) return NextResponse.json({ error: "Could not load this request" }, { status: 500 });
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
