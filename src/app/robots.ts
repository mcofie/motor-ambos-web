import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/app$", "/app/", "/api", "/login", "/register", "/forgot-password", "/reset-password", "/service/log", "/review", "/v/"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
