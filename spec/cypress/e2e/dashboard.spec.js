Cypress.Commands.add("plusMinusButton", label => {
  return cy.contains("li", label).find("button:first-child");
});

describe("Dashboard", () => {
  before(cy.appFixtures);

  // Doesn't explore the tabs at all

  it("Works", () => {
    cy.login();
    cy.visit("/");
    cy.contains("tr", "Bangolan");
    cy.contains("tr", "Bambalang");
    cy.contains("tr", "Hdi");
    cy.contains("li", "Ndop");
    cy.contains("li", "Hdi");

    cy.plusMinusButton("Drew Mambo").click();
    cy.contains("li", "Ndop").should("not.exist");
    cy.contains("li", "Hdi").should("not.exist");

    cy.contains("li", "Ndop").should("not.exist");
    cy.contains("li", "Ewondo").should("not.exist");
    cy.plusMinusButton("South Region").click();
    cy.contains("li", "Ndop");
    cy.contains("li", "Ewondo");

    cy.contains("li", "Ewondo").click();
    cy.contains("h2", "Ewondo");
    cy.contains("tr", "Bangolan").should("not.exist");

    cy.contains("li", "Ndop").click();
    cy.contains("li", "Bangolan");
    cy.contains("tr", "Bangolan");

    cy.contains("li", "North Region").click();
    cy.contains("tr", "Hdi");
    cy.contains("tr", "Zulgo");
  });
});
