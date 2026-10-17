import { connect } from "node:http2";
import { createSign } from "node:crypto";
import { getServiceClient } from "@/lib/serverAuth";

type Service = ReturnType<typeof getServiceClient>;
type Device = { token: string; environment: "sandbox" | "production" };
export type PushMessage = { title: string; body: string; threadId?: string; data?: Record<string, string> };

/**
 * Sends alerts to iPhones through Apple's push service (APNs), signed with the team's .p8 key.
 * Needs APNS_KEY_ID, APNS_TEAM_ID and APNS_PRIVATE_KEY; without them it does nothing, so alerts are
 * simply off until the key is added. Debug builds register as "sandbox", TestFlight and App Store
 * builds as "production". Tokens Apple says are no longer valid are removed.
 */
export async function sendPush(service: Service, devices: Device[], message: PushMessage) {
    const keyId = process.env.APNS_KEY_ID, teamId = process.env.APNS_TEAM_ID, key = process.env.APNS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!keyId || !teamId || !key || !devices.length) return;
    const topic = process.env.APNS_BUNDLE_ID || "com.motorambos.app";
    const token = jwt(keyId, teamId, key);
    const payload = JSON.stringify({
        aps: { alert: { title: message.title, body: message.body }, sound: "default", ...(message.threadId ? { "thread-id": message.threadId } : {}) },
        ...message.data,
    });
    const stale: string[] = [];
    for (const environment of ["sandbox", "production"] as const) {
        const targets = devices.filter((device) => device.environment === environment);
        if (!targets.length) continue;
        const session = connect(environment === "sandbox" ? "https://api.sandbox.push.apple.com" : "https://api.push.apple.com");
        session.on("error", (error) => console.error("APNs connection failed", error));
        try {
            await Promise.all(targets.map((device) => new Promise<void>((resolve) => {
                const request = session.request({
                    ":method": "POST", ":path": `/3/device/${device.token}`,
                    authorization: `bearer ${token}`, "apns-topic": topic, "apns-push-type": "alert", "apns-priority": "10",
                });
                let body = "";
                request.on("response", (headers) => {
                    const status = Number(headers[":status"]);
                    request.on("data", (chunk) => { body += chunk; });
                    request.on("end", () => {
                        if (status === 410 || (status === 400 && /BadDeviceToken|DeviceTokenNotForTopic/.test(body))) stale.push(device.token);
                        else if (status !== 200) console.error("APNs refused a push", status, body);
                        resolve();
                    });
                });
                request.on("error", (error) => { console.error("APNs push failed", error); resolve(); });
                request.setTimeout(10_000, () => { request.close(); resolve(); });
                request.end(payload);
            })));
        } finally {
            session.close();
        }
    }
    if (stale.length) await service.from("push_devices").delete().in("token", stale);
}

function jwt(keyId: string, teamId: string, key: string) {
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const unsigned = `${encode({ alg: "ES256", kid: keyId })}.${encode({ iss: teamId, iat: Math.floor(Date.now() / 1000) })}`;
    const signature = createSign("SHA256").update(unsigned).sign({ key, dsaEncoding: "ieee-p1363" }).toString("base64url");
    return `${unsigned}.${signature}`;
}

/** The members who manage the fleet a car belongs to, or none for a personal car. */
export async function fleetManagersOf(service: Service, vehicleOwnerId: string): Promise<string[]> {
    let { data: org } = await service.from("members").select("id,contact_member_id").eq("id", vehicleOwnerId).eq("is_business", true).maybeSingle();
    if (!org) ({ data: org } = await service.from("members").select("id,contact_member_id").eq("auth_user_id", vehicleOwnerId).eq("is_business", true).maybeSingle());
    if (!org) return [];
    const { data: admins } = await service.from("organization_members").select("member_id").eq("org_member_id", org.id).eq("role", "ADMIN");
    return Array.from(new Set([org.id, org.contact_member_id, ...(admins || []).map((row) => row.member_id)].filter((id): id is string => Boolean(id))));
}

export async function devicesFor(service: Service, memberIds: string[]): Promise<Device[]> {
    if (!memberIds.length) return [];
    const { data, error } = await service.from("push_devices").select("token,environment").in("member_id", memberIds);
    return error ? [] : (data || []) as Device[];
}
