const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Cypress is invoked as `cypress run --project ./spec`, so every path below
  // is relative to spec/, not to the repo root.
  e2e: {
    baseUrl: "http://localhost:3002",

    // The specs are named *.spec.js, not Cypress 10+'s default *.cy.js, so this
    // has to be explicit. Renaming 19 files to match the default would buy
    // nothing and lose their history.
    specPattern: "cypress/e2e/**/*.spec.js",
    supportFile: "cypress/support/e2e.js",

    // No setupNodeEvents: the old cypress/plugins/index.js was the generated
    // stub with an empty function body, so there is nothing to carry over.

    // Cypress 12 turned on test isolation by default, which resets the browser
    // between tests -- blank page, cookies and storage cleared. This suite was
    // written before that existed and is deliberately stateful: a `before` hook
    // loads fixtures once per spec, and tests build on the page the previous
    // test left behind. log_in.spec.js's "Does redirects" asserts on
    // "Welcome to Dulu" before it visits anything, because the preceding test
    // ends by logging out.
    //
    // Turned off rather than rewriting 19 specs to be isolation-clean, which is
    // a change to what the tests do and does not belong in a version bump.
    // Making them independent is a real improvement, just a separate one.
    testIsolation: false,
  },

  chromeWebSecurity: false,
  video: false,

  // Cypress 15 warns on every run that allowCypressEnv is insecure -- it lets
  // any browser code read Cypress.env() -- and that it will be removed in a
  // future major. Nothing in this suite calls Cypress.env() or cy.env(), so
  // turning it off costs nothing and silences the warning.
  allowCypressEnv: false,

  // Timeouts are well above Cypress' defaults on purpose, and this is the
  // record of two separate flake investigations -- do not "tidy" them back to
  // the defaults.
  //
  // defaultCommandTimeout governs the retry window for cy.contains/should, and
  // 10s is not enough headroom on a loaded developer machine: it produced
  // failures that moved to a different spec on every run. Raising it hides
  // nothing, because a genuinely broken build never resolves and so still
  // fails, just later.
  //
  // responseTimeout and pageLoadTimeout are above Cypress' 30s/60s defaults
  // because the test environment compiles packs on demand
  // (shakapacker.yml test: compile: true). A cold public/packs-test makes the
  // first cy.visit() of a run wait ~60s for webpack, which surfaced as a random
  // ESOCKETTIMEDOUT in whichever spec happened to run first. yarn
  // test:cypress:gate precompiles first, so this is belt-and-braces; a
  // genuinely dead server still fails, just later.
  defaultCommandTimeout: 30000,
  responseTimeout: 120000,
  pageLoadTimeout: 120000,
});
