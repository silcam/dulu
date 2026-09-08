// Flat config, added in Phase 7d. There was no eslint config in this repo before --
// eslint 4 sat in devDependencies for years with nothing to run it, no config file
// and no script -- so this is a first setup rather than a migration from .eslintrc.
//
// Deliberately "recommended" everywhere and nothing tuned to make the output look
// good. The point of the first run is to find out what is actually here.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jest from "eslint-plugin-jest";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "public/**",
      "tmp/**",
      "vendor/**",
      "node_modules/**",
      "LIVE_DUMP/**",
      "coverage/**",
      "app/assets/**"
    ]
  },

  // Application code: browser globals, React, hooks.
  {
    files: ["app/javascript/**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // The props of every component are declared as a TypeScript interface, so
      // this rule reports each one as a missing runtime propTypes declaration.
      // It is the one rule turned off, and only because it is checking something
      // the type system already checks.
      "react/prop-types": "off"
    }
  },

  // Jest tests.
  {
    files: ["test/javascript/**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
    plugins: { jest },
    rules: { ...jest.configs["flat/recommended"].rules }
  },

  // Cypress specs. No cypress plugin here -- these just need the globals so the
  // whole suite does not report cy/Cypress as undefined.
  {
    files: ["spec/cypress/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.browser,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        assert: "readonly"
      }
    }
  },

  // Build and tooling config that runs in Node.
  {
    files: [
      "*.js",
      "*.mjs",
      "config/webpack/**/*.js",
      "babel.config.js",
      "postcss.config.js"
    ],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node } }
  }
);
