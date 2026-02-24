import './globals.css'
import { ThemeProvider } from "@/components/ThemeProvider"
import { CSPostHogProvider } from "@/components/PostHogProvider"
import PostHogPageView from "@/components/PostHogPageView"
import { Suspense } from "react"
import { Inter, Space_Grotesk, Space_Mono } from 'next/font/google'

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

export const metadata = {
    title: {
        default: "Motor Ambos — The Digital Passport for Your Car",
        template: "%s | Motor Ambos",
    },
    description: "The Operating System for car ownership in Ghana. Manage compliance, track verified maintenance history, and protect your vehicle's resale value.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}>
            {/* Use Inter for body text */}
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CSPostHogProvider>
                        <Suspense fallback={null}>
                            <PostHogPageView />
                        </Suspense>
                        {children}
                    </CSPostHogProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}