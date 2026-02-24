/** @type {import('next').NextConfig} */
const nextConfig = {

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            "img-src 'self' data: https: https://*.ytimg.com",
                            "style-src 'self' 'unsafe-inline' https:",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: https://www.youtube.com",
                            "frame-src 'self' https://www.youtube.com https://*.youtube.com",
                            "connect-src 'self' https://*.supabase.co https://*.youtube.com https://*.google.com", // allow Supabase & YouTube
                        ].join("; "),
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "play.google.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "developer.apple.com",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
        ];
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
}

export default nextConfig
