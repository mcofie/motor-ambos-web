type ActivityField = { name: string; value: string | number | boolean | null | undefined };

/** Send operational events from trusted server routes only. Never block the user action on Discord. */
export async function reportMajorActivity(title: string, fields: ActivityField[] = []): Promise<void> {
    const webhook = process.env.DISCORD_ACTIVITY_WEBHOOK_URL;
    if (!webhook) return;

    try {
        const response = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "Motor Ambos",
                allowed_mentions: { parse: [] },
                embeds: [{
                    title: title.slice(0, 256),
                    color: 0x1111f6,
                    timestamp: new Date().toISOString(),
                    fields: fields
                        .filter((field) => field.value !== null && field.value !== undefined && field.value !== "")
                        .slice(0, 12)
                        .map((field) => ({ name: field.name.slice(0, 256), value: String(field.value).slice(0, 1024), inline: true })),
                }],
            }),
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) console.warn("Discord activity delivery failed:", response.status);
    } catch (error) {
        console.warn("Discord activity delivery failed:", error instanceof Error ? error.name : "unknown error");
    }
}
