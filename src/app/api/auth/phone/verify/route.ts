import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceClient } from "@/lib/serverAuth";
import { phoneVariants } from "@/lib/phone";
import { MAX_ATTEMPTS, codeMatches, ghanaMobile, placeholderEmail } from "@/lib/phoneLogin";
import { reportMajorActivity } from "@/lib/discordActivity";

export const dynamic = "force-dynamic";

const WRONG = "That code is wrong or has expired. Check the text, or send a new code.";

/**
 * Step 2 of phone sign-in: checks the code, finds or creates the person's login, and returns a
 * Supabase session the app hands to its SDK. A profile that already has a login (even an email one)
 * signs into that login; a profile added by staff or a fleet gets a new login linked to it.
 */
export async function POST(request: Request) {
    const body = await request.json().catch(() => null) as { phone?: unknown; code?: unknown } | null;
    const phone = ghanaMobile(body?.phone);
    const code = typeof body?.code === "string" && /^\d{6}$/.test(body.code) ? body.code : null;
    if (!phone || !code) return NextResponse.json({ error: "Enter the 6-digit code we texted you." }, { status: 400 });

    const service = getServiceClient();
    const { data: row, error: rowError } = await service.from("phone_login_codes")
        .select("id,code_hash,expires_at,attempts,used_at").eq("phone", phone)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (rowError) {
        console.error("Phone login code check failed:", rowError.code, rowError.message);
        return NextResponse.json({ error: "Could not check the code. Please try again." }, { status: 500 });
    }
    if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now() || row.attempts >= MAX_ATTEMPTS) {
        return NextResponse.json({ error: WRONG }, { status: 400 });
    }
    if (!codeMatches(row.id, code, row.code_hash)) {
        const attempts = row.attempts + 1;
        await service.from("phone_login_codes").update({ attempts }).eq("id", row.id);
        return NextResponse.json({ error: attempts >= MAX_ATTEMPTS ? "Too many wrong codes. Send a new code." : WRONG }, { status: 400 });
    }
    // Used once only, even if two requests race.
    const { data: claimed } = await service.from("phone_login_codes").update({ used_at: new Date().toISOString() })
        .eq("id", row.id).is("used_at", null).select("id").maybeSingle();
    if (!claimed) return NextResponse.json({ error: WRONG }, { status: 400 });

    // Which login does this number belong to?
    const { data: members, error: memberError } = await service.from("members")
        .select("id,auth_user_id").in("phone", phoneVariants(phone)).limit(2);
    if (memberError) return NextResponse.json({ error: "Could not sign you in. Please try again." }, { status: 500 });
    if ((members?.length || 0) > 1) {
        return NextResponse.json({ error: "More than one profile uses this number. Please contact support@motorambos.com." }, { status: 409 });
    }
    const member = members?.[0];

    let email: string;
    let userId: string | null = null;
    if (member?.auth_user_id) {
        const { data: found, error } = await service.auth.admin.getUserById(member.auth_user_id);
        if (error || !found?.user) return NextResponse.json({ error: "Could not sign you in. Please contact support@motorambos.com." }, { status: 500 });
        userId = found.user.id;
        email = found.user.email || placeholderEmail(phone);
        if (!found.user.email) await service.auth.admin.updateUserById(userId, { email, email_confirm: true });
    } else {
        email = placeholderEmail(phone);
        const { data: created, error } = await service.auth.admin.createUser({
            email, email_confirm: true, phone, phone_confirm: true, user_metadata: { phone },
        });
        // Signed in by phone before: the login already exists under the placeholder email.
        if (error && !/already|registered|exists/i.test(error.message)) {
            console.error("Phone login create failed:", error.message);
            return NextResponse.json({ error: "Could not sign you in. Please try again." }, { status: 500 });
        }
        userId = created?.user?.id ?? null;
    }

    const { data: link, error: linkError } = await service.auth.admin.generateLink({ type: "magiclink", email });
    if (linkError || !link?.properties?.hashed_token) {
        console.error("Phone login link failed:", linkError?.message);
        return NextResponse.json({ error: "Could not sign you in. Please try again." }, { status: 500 });
    }
    userId = userId ?? link.user.id;

    // A profile staff or a fleet created for this number, with no login yet: it's theirs now.
    if (member && !member.auth_user_id && userId) {
        const { error } = await service.from("members").update({ auth_user_id: userId }).eq("id", member.id).is("auth_user_id", null);
        if (!error) await reportMajorActivity("Existing profile connected to phone login", [{ name: "Member ID", value: member.id }]);
    }

    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: verified, error: sessionError } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "email" });
    if (sessionError || !verified.session) {
        console.error("Phone login session failed:", sessionError?.message);
        return NextResponse.json({ error: "Could not sign you in. Please try again." }, { status: 500 });
    }
    const { access_token, refresh_token, expires_in, expires_at, token_type } = verified.session;
    return NextResponse.json({ access_token, refresh_token, expires_in, expires_at, token_type }, { headers: { "Cache-Control": "no-store" } });
}
