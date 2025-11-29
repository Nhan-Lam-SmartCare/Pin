module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React 17+ doesn't need React import
    "react/react-in-jsx-scope": "off",
    
    // Allow unused vars with underscore prefix
    "@typescript-eslint/no-unused-vars": ["warn", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    }],
    
    // Warn on 'any' usage instead of error (for gradual migration)
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Allow empty functions (useful for default callbacks)
    "@typescript-eslint/no-empty-function": "off",
    
    // React hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // Prefer const
    "prefer-const": "warn",
    
    // No console in production (warn for now)
    "no-console": ["warn", { allow: ["warn", "error"] }],
    
    // Consistent return
    "consistent-return": "off",
    
    // Allow non-null assertions (common in React)
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  ignorePatterns: ["dist", "node_modules", "*.config.js", "*.config.cjs"],
};
