/** @type {import('next').NextConfig} */
const nextConfig = {
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
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "play.google.com",
            },
            {
                protocol: "https",
                hostname: "developer.apple.com",
            },
        ],
    },
}

export default nextConfig