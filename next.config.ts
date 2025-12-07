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
                            "img-src 'self' data: https:",
                            "style-src 'self' 'unsafe-inline' https:",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:",
                            "connect-src 'self' https://*.supabase.co", // allow Supabase Auth & REST
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
