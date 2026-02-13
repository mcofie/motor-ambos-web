import './globals.css'
import { ThemeProvider } from "@/components/ThemeProvider"
import { CSPostHogProvider } from "@/components/PostHogProvider"
import PostHogPageView from "@/components/PostHogPageView"
import { Suspense } from "react"
import { Inter, Poppins, Anta } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-poppins',
    display: 'swap',
})

const anta = Anta({
    subsets: ['latin'],
    weight: '400',              // Anta only has 400
    variable: '--font-anta',
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
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${anta.variable}`}>
            {/* Use your default text font here (Inter) */}
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