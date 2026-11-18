import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber mutates three.js objects inside useFrame by design.
    files: ["components/game/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  {
    // Pasted UI components are kept as delivered; they read refs for hand-rolled number tweens.
    files: ["components/ui/**"],
    rules: { "react-hooks/refs": "off", "react-hooks/exhaustive-deps": "off", "@next/next/no-img-element": "off" },
  },
  {
    // Untyped bundle output pasted as delivered.
    files: ["components/ui/admit-one-ticket.tsx"],
    rules: { "no-var": "off", "@typescript-eslint/ban-ts-comment": "off", "@typescript-eslint/no-unused-vars": "off", "react-hooks/use-memo": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
