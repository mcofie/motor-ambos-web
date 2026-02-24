// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/components/**/*.{ts,tsx}',
        './src/pages/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                space: ['var(--font-space)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
                heading: ['var(--font-space)', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
}
export default config