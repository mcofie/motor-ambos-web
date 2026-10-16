import { NextResponse } from "next/server";
import { getServiceClient, staffApiError } from "@/lib/serverAuth";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

/**
 * One-off move to phone sign-in: copies each linked member's Ghana phone onto their Supabase login,
 * so signing in with that number by SMS opens the same account. Staff only.
 * POST ?dryRun=1 first to see what would change. Numbers on more than one member, numbers already
 * on another login, and non-Ghana numbers are skipped and listed for support to sort out.
 */
export async function POST(request: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
    const service = getServiceClient();

    const { data: members, error } = await service.from("members").select("id,auth_user_id,phone").not("auth_user_id", "is", null);
    if (error) return NextResponse.json({ error: "Could not load members." }, { status: 500 });

    const byPhone = new Map<string, { memberId: string; userId: string }[]>();
    const skipped: { memberId: string; reason: string }[] = [];
    for (const member of members || []) {
        const phone = normalizePhone(member.phone);
        if (!phone || !phone.startsWith("+233")) {
            skipped.push({ memberId: member.id, reason: phone ? "Not a Ghana number" : "No usable phone" });
            continue;
        }
        byPhone.set(phone, [...(byPhone.get(phone) || []), { memberId: member.id, userId: member.auth_user_id as string }]);
    }

    let updated = 0, alreadySet = 0;
    for (const [phone, owners] of byPhone) {
        if (owners.length > 1) {
            owners.forEach((owner) => skipped.push({ memberId: owner.memberId, reason: "Phone shared with another member" }));
            continue;
        }
        const [{ memberId, userId }] = owners;
        const { data: found, error: userError } = await service.auth.admin.getUserById(userId);
        if (userError || !found?.user) {
            skipped.push({ memberId, reason: "Login not found" });
            continue;
        }
        // Supabase stores phones without the leading "+".
        if (found.user.phone && `+${found.user.phone.replace(/^\+/, "")}` === phone) {
            alreadySet += 1;
            continue;
        }
        if (dryRun) {
            updated += 1;
            continue;
        }
        const { error: updateError } = await service.auth.admin.updateUserById(userId, { phone, phone_confirm: true });
        if (updateError) skipped.push({ memberId, reason: updateError.message.includes("already") ? "Phone already on another login" : "Could not update the login" });
        else updated += 1;
    }

    return NextResponse.json({ dryRun, updated, alreadySet, skipped });
}
