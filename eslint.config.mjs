import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships flat configs, so they are used directly rather than through FlatCompat.
export default defineConfig([
    ...nextVitals,
    ...nextTypescript,
    globalIgnores([".next/**", ".netlify/**", "out/**", "build/**", "node_modules/**", "next-env.d.ts"]),
]);
