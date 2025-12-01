import './globals.css'
import { ThemeProvider } from "@/components/ThemeProvider"
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
        default: "Motor Ambos — The Modern Roadside Network",
        template: "%s | Motor Ambos",
    },
    description: "On-demand car care and roadside assistance. Fuel, wash, oil, tyres, battery — delivered to your location.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable} ${anta.variable}`}>
            {/* Use your default text font here (Inter) */}
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}