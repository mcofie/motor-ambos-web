import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser, getServiceClient } from "@/lib/serverAuth";

const DeviceSchema = z.object({ token: z.string().regex(/^[0-9a-f]{64,200}$/i), environment: z.enum(["sandbox", "production"]) });

async function member() {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    const service = getServiceClient();
    const { data } = await service.from("members").select("id").eq("auth_user_id", user.id).maybeSingle();
    return data ? { service, memberId: data.id as string } : null;
}

/** Saves this iPhone's push token, so its owner can get fleet alerts. One row per token. */
export async function POST(request: Request) {
    const session = await member();
    if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const parsed = DeviceSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid device" }, { status: 400 });
    const { error } = await session.service.from("push_devices").upsert({
        token: parsed.data.token.toLowerCase(), environment: parsed.data.environment, member_id: session.memberId, platform: "ios", updated_at: new Date().toISOString(),
    }, { onConflict: "token" });
    if (error) return NextResponse.json({ error: "Could not save this device" }, { status: error.code === "PGRST205" ? 503 : 500 });
    return NextResponse.json({ ok: true });
}

/** Forgets this iPhone, on sign-out. */
export async function DELETE(request: Request) {
    const session = await member();
    if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const token = new URL(request.url).searchParams.get("token") || "";
    await session.service.from("push_devices").delete().eq("token", token.toLowerCase()).eq("member_id", session.memberId);
    return NextResponse.json({ ok: true });
}
