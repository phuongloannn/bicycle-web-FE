import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Tắt tất cả các cảnh báo về any types
      "@typescript-eslint/no-explicit-any": "off",
      
      // Tắt cảnh báo về unused variables (cho phép prefix _)
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      
      // Tắt cảnh báo về unescaped entities trong JSX
      "react/no-unescaped-entities": "off",
      
      // Tắt cảnh báo về sử dụng <img> thay vì <Image>
      "@next/next/no-img-element": "off",
      
      // Tắt cảnh báo về missing dependencies trong useEffect
      "react-hooks/exhaustive-deps": "warn",
      
      // Tắt cảnh báo về @ts-ignore/@ts-expect-error
      "@typescript-eslint/ban-ts-comment": "off",
      
      // Tắt cảnh báo về prefer-const
      "prefer-const": "warn",
      
      // Tắt cảnh báo về empty interfaces
      "@typescript-eslint/no-empty-object-type": "off",
      
      // Tắt cảnh báo về async client components
      "@next/next/no-async-client-component": "warn"
    }
  }
];

export default eslintConfig;