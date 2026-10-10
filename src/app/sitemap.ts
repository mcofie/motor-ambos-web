import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

const publicPaths = ["/", "/business", "/roadside-mechanics", "/help", "/providers", "/smart-card", "/privacy-policy", "/terms-of-service"];

export default function sitemap(): MetadataRoute.Sitemap {
    return publicPaths.map((path) => ({
        url: new URL(path, siteUrl).toString(),
    }));
}
