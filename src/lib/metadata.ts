import type { Metadata } from "next";

export const siteUrl = "https://motorambos.com";
export const siteTitle = "Motor Ambos | Stay legal. Get help fast.";
export const siteDescription = "Keep car papers and renewal reminders together, manage fleet vehicles, and find roadside help in Ghana.";

export function publicPageMetadata(title: string, description: string, path: string): Metadata {
    const fullTitle = `${title} | Motor Ambos`;

    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            locale: "en_GH",
            siteName: "Motor Ambos",
            title: fullTitle,
            description,
            url: path,
            images: [{ url: "/og-motor-ambos.png", width: 1200, height: 630, alt: "Motor Ambos — Stay legal. Get help fast." }],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: ["/og-motor-ambos.png"],
        },
    };
}
