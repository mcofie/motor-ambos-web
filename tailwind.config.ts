// tailwind.config.ts
import type {Config} from 'tailwindcss'

const config: Config = {
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/pages/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // default body/UI
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                // section headings, CTA
                heading: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
                // hero/brand display
                display: ['var(--font-anta)', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
}
export default config