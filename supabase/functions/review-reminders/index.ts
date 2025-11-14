// supabase/functions/review-reminders/index.ts
// @ts-nocheck  // <-- Important: prevent Next/tsc from trying to type-check Deno URL imports

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ──────────────────────────────────────────
// Env & clients
// ──────────────────────────────────────────
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const HUBTEL_BASIC_AUTH = Deno.env.get("HUBTEL_SMS_BASIC_AUTH"); // e.g. "Basic …"
const HUBTEL_FROM = Deno.env.get("HUBTEL_FROM") ?? "MotorAmbos";
const REVIEW_BASE_URL =
    Deno.env.get("REVIEW_BASE_URL") ?? "https://motorambos.com/review";

// Basic guard so we fail loudly if env is missing in production
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[review-reminders] Missing Supabase env vars");
    throw new Error("Missing Supabase env vars");
}

if (!HUBTEL_BASIC_AUTH) {
    console.error("[review-reminders] Missing HUBTEL_SMS_BASIC_AUTH");
    // You *can* throw here too if you want to hard-fail:
    // throw new Error("Missing HUBTEL_SMS_BASIC_AUTH");
}

// Scope this client to the `motorambos` schema
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: "motorambos" },
});

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
function buildReminderMessage(driverName: string | null, requestId: string) {
    const name = driverName?.trim() || "there";
    const reviewLink = `${REVIEW_BASE_URL}/${requestId}`;

    return (
        `Hi ${name}, thanks for using MotorAmbos. ` +
        `Please take a moment to review your mechanic and service here: ${reviewLink}`
    );
}

async function sendSms(to: string, content: string) {
    const res = await fetch("https://smsc.hubtel.com/v1/messages/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: HUBTEL_BASIC_AUTH!,
        },
        body: JSON.stringify({
            from: HUBTEL_FROM,
            to,
            content,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Hubtel SMS failed: ${res.status} – ${text}`);
    }
}

type RequestRow = {
    id: string;
    created_at: string;
    status: string;
    driver_name: string | null;
    driver_phone: string | null;
    provider_id: string | null;
    review_reminder_sent_at: string | null;
};

// ──────────────────────────────────────────
// Function handler
// ──────────────────────────────────────────
serve(async () => {
    // 1. Find requests older than 1 hour with a provider + phone,
    //    and that haven’t yet been reminded.
    const oneHourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: requests, error } = await supabase
        .from("requests")
        .select(
            "id, created_at, status, driver_name, driver_phone, provider_id, review_reminder_sent_at",
        )
        // If you only want to ping jobs beyond "pending", you can tweak this:
        // .in("status", ["accepted", "in_progress", "completed"])
        .eq("status", "pending")
        .not("provider_id", "is", null)
        .lte("created_at", oneHourAgoIso)
        .is("review_reminder_sent_at", null)
        .not("driver_phone", "is", null)
        .limit(50);

    if (error) {
        console.error("[review-reminders] Query error:", error);
        return new Response("Query error", { status: 500 });
    }

    if (!requests || requests.length === 0) {
        console.log("[review-reminders] No matching requests");
        return new Response("No requests to remind", { status: 200 });
    }

    const nowIso = new Date().toISOString();

    for (const req of requests as RequestRow[]) {
        const phone = req.driver_phone?.trim();
        if (!phone) continue;

        try {
            const sms = buildReminderMessage(req.driver_name, req.id);
            await sendSms(phone, sms);

            const { error: updateErr } = await supabase
                .from("requests")
                .update({ review_reminder_sent_at: nowIso })
                .eq("id", req.id);

            if (updateErr) {
                console.error(
                    "[review-reminders] Failed to mark reminder as sent:",
                    req.id,
                    updateErr,
                );
            } else {
                console.log("[review-reminders] Reminder sent for request:", req.id);
            }
        } catch (e) {
            console.error(
                "[review-reminders] SMS failed for request:",
                req.id,
                e,
            );
        }
    }

    return new Response("OK", { status: 200 });
});