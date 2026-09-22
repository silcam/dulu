// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("mockOauth", (email = "drew_mambo@sil.org") => {
  return cy.app("mock_oauth", { email });
});

// Aborts whatever the previous page still has in flight, then logs in.
//
// The stop() is not tidiness, it is the fix for UPGRADE_PLAN 8e item 10. Rails writes
// `Set-Cookie: _dulu_session` on *every* response, not only when the session changes
// (measured: an ordinary GET that merely reads the session still rewrites the cookie).
// So a request issued by the previous test's page, carrying the previous user's cookie,
// restores that user's session if its response lands after this login's -- and the
// browser is then somebody else for the rest of the test.
//
// That is the whole flake. It presented as `navigation.spec.js` timing out for 30s on an
// addIcon that is permission-gated: the test logs in as Olga, who may create regions,
// but the page had been re-sessioned as Drew, who may not, so the icon correctly never
// rendered. Measured at 15 failures in 40 runs of that one spec before this line.
//
// Eleven specs switch identity mid-run and every one of them is exposed;
// `people.spec.js` logs in twelve times as five different people and is the suite's
// other recorded flake. Nothing about this is specific to the users involved.
Cypress.Commands.add("login", (email = "drew_mambo@sil.org") => {
  // cy.mockOauth(email);
  cy.then(() => {
    // cy.state rather than cy.window(): this has to be a no-op before the first visit of
    // a spec, and cy.window() would fail the command instead.
    const win = cy.state("window");
    if (win && typeof win.stop == "function") win.stop();
  });
  cy.request("POST", "/test-login", { email });
});

Cypress.Commands.add("icon", whichIcon => {
  return cy.get(`span[data-icon-name='${whichIcon}']`);
});

Cypress.Commands.add("actionBar", () =>
  cy.get("div[data-div-name='editActionBar']")
);

Cypress.Commands.add("actionBarIcon", whichIcon => {
  return cy.get(
    `div[data-div-name='editActionBar'] span[data-icon-name='${whichIcon}']`
  );
});

// Find input by placeholder
Cypress.Commands.add("placeholder", placeholder =>
  cy.get(`input[placeholder='${placeholder}']`)
);

// Find input by value
Cypress.Commands.add("byValue", value => cy.get(`input[value='${value}']`));

// Fill Fuzzy Date
Cypress.Commands.add("fillFuzzyDate", (year, month, day) => {
  cy.get("select[name='day']").select(day ? day.toString() : "Day");
  if (month) cy.get("select[name='month']").select(month || "Month");
  cy.placeholder("Year")
    .clear()
    .type(year);
});

// // Find item by label
// Cypress.Commands.add("withLabel", label =>
//   cy
//     .contains("label", label)
//     .siblings()
//     .first()
// );

// Find item by label
Cypress.Commands.add("inLabel", label =>
  cy
    .contains("label", label)
    .find("input, select, textarea")
    .first()
);

Cypress.Commands.add(
  "searchFill",
  { prevSubject: "element" },
  (textInput, searchTerm) => {
    // Re-wrap the element for each command rather than reusing one chainable.
    // A `cy.wrap()` result is consumed by the command it is passed to, so
    // reusing it meant the final `.type("{Enter}")` ran against the subject
    // left over from `.parent().within()` -- the dropdown <li>, which React
    // detaches from the DOM as soon as the search results re-render. That
    // produced intermittent "element is detached from the DOM" failures.
    cy.wrap(textInput)
      .clear()
      .type(searchTerm);
    cy.wrap(textInput)
      .parent()
      .within(() => {
        cy.contains("li", searchTerm);
      });
    cy.wrap(textInput).type("{Enter}");
  }
);

// Uncaught exceptions from the app are still swallowed -- returning false is what keeps
// one stray error from failing an unrelated test -- but they are no longer thrown away.
// The old handler in support/e2e.js was a bare `return false` under a comment admitting
// it hid an "occasional spurious failure" whose root cause was never found. That is
// exactly the class of bug UPGRADE_PLAN 8e item 10 is about: a swallowed error leaves no
// trace in the Rails log either, so a 30s timeout on a missing element is all you ever
// see. Recorded per test and shipped to the server-side log_fail dump.
let uncaughtErrors = [];

beforeEach(() => {
  uncaughtErrors = [];
});

Cypress.on("uncaught:exception", err => {
  uncaughtErrors.push({
    message: err.message,
    stack: (err.stack || "").split("\n").slice(0, 8).join("\n")
  });
  return false;
});

// What the page actually looked like when a command timed out. `Cypress.$` is bound to
// the application under test, and this runs synchronously inside the fail hook, before
// anything can tear the page down.
//
// For a "never found element" failure, these are the questions worth being able to answer
// without guessing:
//   - is the app on the page the test thinks it is?               href
//   - is the element really absent, or present and simply missed? iconNames
//   - did the app crash, or come up with no data?                 bodyText, uncaughtErrors
//   - is the browser even the user the test logged in as?         bodyText
//
// That last one is not hypothetical and is why bodyText is here. UPGRADE_PLAN 8e item 10
// was hunted for days as a timeout; what it actually was is a session getting clobbered
// back to the previous test's user, and the *only* thing that said so was the nav bar
// reading "Drew Logout" in a test that had logged in as Olga. Every other signal --
// server timings, status codes, the element being absent -- was consistent with a slow
// render. If you extend this, prefer capturing what the user would see over capturing
// more about the machinery.
export function pageDiagnostics() {
  const diagnostics = { uncaughtErrors };
  try {
    const win = cy.state("window");
    diagnostics.href = win && win.location ? win.location.href : "no window";
    diagnostics.iconNames = Cypress.$("span[data-icon-name]")
      .map((i, el) => el.getAttribute("data-icon-name"))
      .get();
    diagnostics.bodyText = Cypress.$("body")
      .text()
      .replace(/\s+/g, " ")
      .slice(0, 1500);
    diagnostics.bodyHtmlLength = (Cypress.$("body").html() || "").length;
  } catch (e) {
    diagnostics.diagnosticError = String(e);
  }
  return diagnostics;
}
