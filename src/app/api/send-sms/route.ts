// app/api/send-sms/route.ts
import {NextResponse} from "next/server";
import { staffApiError } from "@/lib/serverAuth";
import { normalizePhone } from "@/lib/phone";

export async function POST(req: Request) {
    const accessError = await staffApiError();
    if (accessError) return accessError;
    try {
        const {to, content} = (await req.json()) as {
            to: string;
            content: string;
        };

        const phone = normalizePhone(to);
        if (!phone || !content) {
            return NextResponse.json(
                {error: "Enter a valid recipient phone number and message."},
                {status: 400}
            );
        }

        const HUBTEL_AUTH = process.env.HUBTEL_SMS_BASIC_AUTH; // "Basic xxxxxx"
        if (!HUBTEL_AUTH) {
            return NextResponse.json(
                {error: "HUBTEL_SMS_BASIC_AUTH env var not set"},
                {status: 500}
            );
        }

        const body = JSON.stringify({
            from: "MotorAmbos",
            to: phone,
            content,
        });

        const res = await fetch("https://smsc.hubtel.com/v1/messages/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: HUBTEL_AUTH,
            },
            body,
        });

        const text = await res.text();

        if (!res.ok) {
            return NextResponse.json(
                {error: "Hubtel error", detail: text},
                {status: 500}
            );
        }

        return NextResponse.json({ok: true, raw: text});
    } catch (e) {
        console.error("[send-sms] error", e);
        return NextResponse.json(
            {error: "Unexpected error sending SMS"},
            {status: 500}
        );
    }
}
