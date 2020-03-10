const silPath = "/organizations/show/258650127";

describe("Organizations", () => {
  beforeEach(cy.appFixtures);

  it("Adds an organization", () => {
    cy.login();
    cy.visit("/organizations");
    cy.icon("addIcon").click();
    cy.inLabel("Short Name").type("UEEC");
    cy.inLabel("Long Name").type("Union des Églises Évangeliques du Cameroun");
    cy.inLabel("Description").type("A denomination");
    cy.contains("Save").click();
    cy.contains("tr", "UEEC");
    cy.contains("h2", "UEEC");
    cy.contains("h3", "Union des Églises Évangeliques du Cameroun");
    cy.contains("A denomination");
  });

  it("Denies invalid name", () => {
    cy.login();
    cy.visit("/organizations");
    cy.icon("addIcon").click();
    cy.contains("button", "Save").should("be.disabled");
  });

  it("Updates organizations", () => {
    cy.login();
    cy.visit(silPath);
    cy.actionBarIcon("editIcon").click();
    cy.byValue("SIL")
      .clear()
      .type("The Evil Empire");
    cy.inLabel("Long Name")
      .clear()
      .type("The Most Evilly Evil Empire of all Time");
    cy.contains("li", "Parent Organization")
      .find("input")
      .type("Lutheran");
    cy.contains("li", "Lutheran Bible").click();
    cy.contains("li", "Country:")
      .find("input")
      .clear()
      .type("United");
    cy.contains("United States").click();
    cy.inLabel("Description")
      .clear()
      .type("Gonna Take over the galaxy, yo!");
    cy.contains("Save").click();

    cy.contains("h2", "The Evil Empire");
    cy.contains("h3", "The Most Evilly Evil Empire of all Time");
    cy.contains("a", "Lutheran Bible Translators");
    cy.contains("li", "United States of America");
    cy.contains("Gonna Take over the galaxy, yo!");
  });

  it("Deletes organizations", () => {
    cy.login("rick_conrad@sil.org");
    cy.visit(silPath);
    cy.contains("tr", "SIL");
    cy.actionBarIcon("deleteIcon").click();
    cy.contains("I'm sure").click();
    cy.contains("Permanently Delete SIL").click();
    cy.contains("tr", "SIL").should("not.exist");
  });

  it("Kevin's view", () => {
    cy.login("kevin_barnes@sil.org");
    cy.visit("/organizations");
    cy.contains("Lutheran");
    cy.icon("addIcon").should("not.exist");
    cy.contains("SIL").click();
    cy.contains("li", "Cameroon");
    cy.icon("editIcon").should("not.exist");
    cy.icon("delete").should("not.exist");
  });

  it("Drew's view", () => {
    cy.login();
    cy.visit(silPath);
    cy.actionBarIcon("editIcon");
    cy.actionBarIcon("deleteIcon").should("not.exist");
  });
});
