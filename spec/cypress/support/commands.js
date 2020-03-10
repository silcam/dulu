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

Cypress.Commands.add("login", (email = "drew_mambo@sil.org") => {
  // cy.mockOauth(email);
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
