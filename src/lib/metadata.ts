import type { Metadata } from "next";

export const siteUrl = "https://motorambos.com";
export const siteTitle = "Motor Ambos | Stay legal. Get help fast.";
export const siteDescription = "Car papers, renewal reminders, and nearby roadside help for drivers and fleets in Ghana.";
export const siteOgImage = "/og-motor-ambos-v2.png";

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
            images: [{ url: siteOgImage, width: 1200, height: 630, alt: "Motor Ambos smiling car logo and Stay legal. Get help fast." }],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [siteOgImage],
        },
    };
}
