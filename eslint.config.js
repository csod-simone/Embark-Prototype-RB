import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Hardcoded hex colors are not allowed. Use semantic design tokens (e.g. text-primary, bg-accent) defined in index.css.",
        },
        {
          selector: "Literal[value=/\\brgba?\\(/]",
          message: "Hardcoded rgb/rgba colors are not allowed. Use semantic design tokens defined in index.css.",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Hardcoded hex colors are not allowed. Use semantic design tokens defined in index.css.",
        },
      ],
    },
  },
  {
    files: [
      "src/index.css",
      "src/design-system.css",
      "src/pages/DesignSystem.tsx",
      "src/design-system-bundle.tsx",
      "tailwind.config.ts",
      "scripts/**",
    ],
    rules: { "no-restricted-syntax": "off" },
  },
);
