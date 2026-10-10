import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/serverAuth";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type DocumentKind = "insurance" | "roadworthy";
type Vehicle = {
    id: string;
    user_id: string;
    plate: string | null;
    make: string | null;
    model: string | null;
    insurance_end_date: string | null;
    roadworthy_expiry: string | null;
};
type Member = { id: string; auth_user_id?: string | null; phone: string | null };
type DueDocument = { vehicle: Vehicle; kind: DocumentKind; expiryDate: string; daysBefore: 30 | 7 | 1 };
type Delivery = DueDocument & { recipient: Member; phone: string };

const pageSize = 500;
const dayMs = 86_400_000;

function authorized(request: Request, secret: string): boolean {
    const supplied = request.headers.get("authorization") || "";
    const expected = `Bearer ${secret}`;
    const suppliedBytes = Buffer.from(supplied);
    const expectedBytes = Buffer.from(expected);
    return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

function ghanaToday(): string {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
    return `${value("year")}-${value("month")}-${value("day")}`;
}

function addDays(date: string, days: number): string {
    return new Date(Date.parse(`${date}T00:00:00Z`) + days * dayMs).toISOString().slice(0, 10);
}

function intervalFor(daysRemaining: number): 30 | 7 | 1 | null {
    if (daysRemaining >= 8 && daysRemaining <= 30) return 30;
    if (daysRemaining >= 2 && daysRemaining <= 7) return 7;
    if (daysRemaining === 1) return 1;
    return null;
}

async function dueVehicles(service: ReturnType<typeof getServiceClient>, column: "insurance_end_date" | "roadworthy_expiry", start: string, end: string): Promise<Vehicle[]> {
    const all: Vehicle[] = [];
    for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await service.from("vehicles")
            .select("id,user_id,plate,make,model,insurance_end_date,roadworthy_expiry")
            .gte(column, `${start}T00:00:00Z`).lt(column, `${end}T00:00:00Z`)
            .order("id").range(offset, offset + pageSize - 1);
        if (error) throw new Error(`Could not load ${column} dates: ${error.code || "query error"}`);
        all.push(...(data || []) as Vehicle[]);
        if (!data || data.length < pageSize) return all;
    }
}

function chunks<T>(values: T[], size = 100): T[][] {
    const result: T[][] = [];
    for (let index = 0; index < values.length; index += size) result.push(values.slice(index, index + size));
    return result;
}

async function recipientsFor(service: ReturnType<typeof getServiceClient>, due: DueDocument[]): Promise<Map<string, Member[]>> {
    const ids = [...new Set(due.map((item) => item.vehicle.id))];
    const ownerIds = [...new Set(due.map((item) => item.vehicle.user_id))];
    const assignments: { vehicle_id: string; member_id: string }[] = [];
    const owners: Member[] = [];
    for (const batch of chunks(ids)) {
        const { data, error } = await service.from("organization_members")
            .select("vehicle_id,member_id").in("vehicle_id", batch).eq("role", "DRIVER");
        if (error) throw new Error(`Could not load assigned drivers: ${error.code || "query error"}`);
        assignments.push(...(data || []));
    }
    for (const batch of chunks(ownerIds)) {
        const [byId, byAuthId] = await Promise.all([
            service.from("members").select("id,auth_user_id,phone").in("id", batch).eq("is_business", false),
            service.from("members").select("id,auth_user_id,phone").in("auth_user_id", batch).eq("is_business", false),
        ]);
        if (byId.error || byAuthId.error) throw new Error(`Could not load vehicle owners: ${byId.error?.code || byAuthId.error?.code || "query error"}`);
        owners.push(...(byId.data || []), ...(byAuthId.data || []));
    }
    const assignedIds = [...new Set(assignments.map((item) => item.member_id))];
    const assignedMembers: Member[] = [];
    for (const batch of chunks(assignedIds)) {
        const { data, error } = await service.from("members").select("id,phone").in("id", batch);
        if (error) throw new Error(`Could not load driver phones: ${error.code || "query error"}`);
        assignedMembers.push(...(data || []));
    }
    const ownerById = new Map(owners.map((owner) => [owner.id, owner]));
    const ownerByAuthId = new Map(owners.filter((owner) => owner.auth_user_id).map((owner) => [owner.auth_user_id!, owner]));
    const assignedById = new Map(assignedMembers.map((member) => [member.id, member]));
    const vehicleById = new Map(due.map((item) => [item.vehicle.id, item.vehicle]));
    const result = new Map<string, Member[]>();
    for (const id of ids) {
        const vehicle = vehicleById.get(id)!;
        const owner = ownerById.get(vehicle.user_id) || ownerByAuthId.get(vehicle.user_id);
        if (owner) result.set(id, [owner]);
    }
    for (const assignment of assignments) {
        const member = assignedById.get(assignment.member_id);
        if (!member) continue;
        const existing = result.get(assignment.vehicle_id) || [];
        if (!existing.some((item) => item.id === member.id)) existing.push(member);
        result.set(assignment.vehicle_id, existing);
    }
    return result;
}

function smsMessage(delivery: Delivery, appUrl: string): string {
    const document = delivery.kind === "insurance" ? "insurance" : "roadworthy certificate";
    const vehicle = delivery.vehicle.plate || [delivery.vehicle.make, delivery.vehicle.model].filter(Boolean).join(" ") || "your vehicle";
    const formattedDate = new Intl.DateTimeFormat("en-GH", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Accra" })
        .format(new Date(`${delivery.expiryDate}T12:00:00Z`));
    return `Motor Ambos: ${document} for ${vehicle} expires ${formattedDate} (${delivery.daysBefore} day${delivery.daysBefore === 1 ? "" : "s"} left). Renew and update your record: ${appUrl}`;
}

export async function POST(request: Request) {
    const secret = process.env.CRON_REMINDER_SECRET;
    if (!secret || !process.env.HUBTEL_SMS_BASIC_AUTH) return NextResponse.json({ error: "Reminder service is not configured" }, { status: 503 });
    if (!authorized(request, secret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const today = ghanaToday();
    const start = addDays(today, 1);
    const end = addDays(today, 31);
    const service = getServiceClient();
    try {
        const { error: ledgerError } = await service.from("document_sms_reminders").select("id").limit(1);
        if (ledgerError) throw new Error(`Reminder migration unavailable: ${ledgerError.code || "query error"}`);
        const [insuranceVehicles, roadworthyVehicles] = await Promise.all([
            dueVehicles(service, "insurance_end_date", start, end),
            dueVehicles(service, "roadworthy_expiry", start, end),
        ]);
        const due: DueDocument[] = [];
        for (const [kind, vehicles] of [["insurance", insuranceVehicles], ["roadworthy", roadworthyVehicles]] as const) {
            for (const vehicle of vehicles) {
                const expiryDate = (kind === "insurance" ? vehicle.insurance_end_date : vehicle.roadworthy_expiry)?.slice(0, 10);
                if (!expiryDate) continue;
                const daysRemaining = Math.round((Date.parse(`${expiryDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / dayMs);
                const daysBefore = intervalFor(daysRemaining);
                if (daysBefore) due.push({ vehicle, kind, expiryDate, daysBefore });
            }
        }

        const recipients = due.length ? await recipientsFor(service, due) : new Map<string, Member[]>();
        const deliveries: Delivery[] = [];
        let withoutRecipient = 0;
        for (const item of due) {
            const people = recipients.get(item.vehicle.id) || [];
            if (!people.length) withoutRecipient++;
            for (const recipient of people) {
                const phone = normalizePhone(recipient.phone);
                if (phone?.startsWith("+233")) deliveries.push({ ...item, recipient, phone });
            }
        }

        const counts = { date: today, dueDocuments: due.length, eligibleRecipients: deliveries.length, sent: 0, alreadyClaimed: 0, failed: 0, withoutRecipient, invalidPhone: 0 };
        counts.invalidPhone = due.reduce((count, item) => count + (recipients.get(item.vehicle.id) || []).filter((member) => !normalizePhone(member.phone)?.startsWith("+233")).length, 0);
        if (new URL(request.url).searchParams.get("dryRun") === "1") {
            return NextResponse.json({ ...counts, dryRun: true }, { headers: { "Cache-Control": "no-store" } });
        }
        const appUrl = "https://motorambos.com/app";
        for (const batch of chunks(deliveries, 5)) {
            await Promise.all(batch.map(async (delivery) => {
                const { data: claimId, error: claimError } = await service.rpc("claim_document_sms_reminder", {
                    p_vehicle_id: delivery.vehicle.id,
                    p_recipient_member_id: delivery.recipient.id,
                    p_kind: delivery.kind,
                    p_expiry_date: delivery.expiryDate,
                    p_days_before: delivery.daysBefore,
                });
                if (claimError) throw new Error(`Could not claim reminder: ${claimError.code || "query error"}`);
                if (!claimId) { counts.alreadyClaimed++; return; }
                try {
                    const response = await fetch("https://smsc.hubtel.com/v1/messages/send", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: process.env.HUBTEL_SMS_BASIC_AUTH! },
                        body: JSON.stringify({ from: process.env.HUBTEL_FROM || "MotorAmbos", to: delivery.phone, content: smsMessage(delivery, appUrl) }),
                        signal: AbortSignal.timeout(8000),
                    });
                    if (!response.ok) throw new Error(`Hubtel HTTP ${response.status}`);
                    const { error } = await service.from("document_sms_reminders")
                        .update({ status: "sent", sent_at: new Date().toISOString(), last_error: null }).eq("id", claimId);
                    if (error) throw new Error(`Could not record sent reminder: ${error.code || "query error"}`);
                    counts.sent++;
                } catch (reason) {
                    const message = reason instanceof Error ? reason.message.slice(0, 120) : "SMS request failed";
                    await service.from("document_sms_reminders").update({ status: "failed", last_error: message }).eq("id", claimId);
                    counts.failed++;
                }
            }));
        }
        return NextResponse.json(counts, { status: counts.failed ? 502 : 200, headers: { "Cache-Control": "no-store" } });
    } catch (reason) {
        console.error("Document reminder job failed:", reason instanceof Error ? reason.message : "unknown error");
        return NextResponse.json({ error: "Reminder job failed" }, { status: 500 });
    }
}
