/** Sends a text message through Hubtel. Returns false when texts are not set up or sending fails. */
export async function sendSms(to: string, content: string) {
    const auth = process.env.HUBTEL_SMS_BASIC_AUTH;
    if (!auth) return false;
    const response = await fetch("https://smsc.hubtel.com/v1/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: auth },
        body: JSON.stringify({ from: "MotorAmbos", to, content }),
        cache: "no-store",
    }).catch(() => null);
    return Boolean(response?.ok);
}
