import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "**/build/**",
    "**/.turbo/**",
    "**/.next/**",
    "**/generated/**",
  ]),

  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },

  eslintPrettier,
]);
