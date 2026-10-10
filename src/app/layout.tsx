import './globals.css'
import { ThemeProvider } from "@/components/ThemeProvider"
import { CSPostHogProvider } from "@/components/PostHogProvider"
import PostHogPageView from "@/components/PostHogPageView"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, Space_Mono, Newsreader, Plus_Jakarta_Sans } from 'next/font/google'
import { siteDescription, siteTitle, siteUrl } from "@/lib/metadata"

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
})
import { ThemeWrapper } from "@/components/ThemeWrapper"
import { IdentityProvider } from "@/components/IdentityContext"

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
})

const spaceMono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-mono',
    display: 'swap',
})

const newsreader = Newsreader({
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
    style: 'italic',
})

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: "%s | Motor Ambos",
    },
    applicationName: "Motor Ambos",
    description: siteDescription,
    openGraph: {
        type: "website",
        locale: "en_GH",
        siteName: "Motor Ambos",
        title: siteTitle,
        description: siteDescription,
        url: "/",
        images: [{ url: "/og-motor-ambos.png", width: 1200, height: 630, alt: "Motor Ambos — Stay legal. Get help fast." }],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: ["/og-motor-ambos.png"],
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${newsreader.variable}`}>
            {/* Use Inter for body text */}
            <body className="font-sans antialiased">
                <IdentityProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem={true}
                        disableTransitionOnChange
                    >
                        <CSPostHogProvider>
                            <Suspense fallback={null}>
                                <PostHogPageView />
                            </Suspense>
                            <ThemeWrapper>
                                {children}
                            </ThemeWrapper>
                        </CSPostHogProvider>
                    </ThemeProvider>
                </IdentityProvider>
            </body>
        </html>
    )
}
