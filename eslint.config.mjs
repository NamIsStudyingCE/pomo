import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Ranh giới import một chiều (ARCHITECTURE.md mục 1):
    // lib và design-system không được biết modules tồn tại.
    files: ["src/lib/**/*.ts", "src/design-system/**/*.tsx", "src/design-system/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/modules/*"] }],
    },
  },
];

export default eslintConfig;
