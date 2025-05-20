import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser, // Enables browser-specific globals like console, window
        ...globals.node     // ✅ add this line for server-side files
      }
    },
    rules: {
      "semi": ["error", "always"], // Requires semicolons
      "no-unused-vars": ["warn"], // Warns about unused variables
      "no-undef": "error", // Prevents using undefined variables
      "eqeqeq": ["error", "always"], // Requires strict equality (=== instead of ==)
      "curly": "error", // Requires curly braces for blocks
      "no-console": "off" // Allows console logging for development
    }
  },
  pluginJs.configs.recommended
];
