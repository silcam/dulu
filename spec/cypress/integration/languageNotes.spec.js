const hdiPath = "/languages/876048951";

describe("Notes for language", () => {
  before(cy.appFixtures);

  it("Shows notes", () => {
    cy.login();
    cy.visit(hdiPath);
    cy.contains("Notes");
    cy.contains("(2)");
    cy.contains("▼").click();
    cy.contains("tr", "This language is cool")
      .should("contain", "Andreas Everest")
      .should("contain", "11 Mar 2020");
  });

  it("Adds a note", () => {
    cy.login("kendall_ingles@sil.org");
    cy.visit(hdiPath);
    cy.icon("addIcon").click();
    cy.get("textarea").type("Hi");
    cy.contains("Save").click();
    cy.contains("tr", "Hi").should("contain", "Kendall Ingles");
  });

  it("Edits a note", () => {
    cy.login();
    cy.visit(hdiPath);
    cy.contains("▼").click();
    cy.contains("tr", "Dvi, Dvu, Dva").contains("button", "Edit").click();
    cy.get("textarea").type(", Dvoh!");
    cy.contains("Save").click();
    cy.contains("tr:first-child", "Dvi, Dvu, Dva, Dvoh!");
  });
});
